import { Hono } from "hono";
import { requirePermission, logAudit } from "../middleware/auth";
import {
  ok,
  badRequest,
  serverError,
  paginatedResponse,
  extractPaginationParams,
} from "../utils/response";
import { eventSchema } from "../validation";
import auditLogsRouter from "./auditLogs";

const app = new Hono<{
  Bindings: { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string };
  Variables: { user: any; supabase: any; role: string; permissions: string[] };
}>();

app.get("/dashboard", async (c) => {
  const supabase = c.get("supabase");
  const [usersRes, eventsRes, upcomingRes, regsRes, checkedInRes, projectsRes, newsRes, volunteersRes, recentRegsRes] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase.from("events").select("*", { count: "exact" }).eq("published", true).gte("event_date", new Date().toISOString().split("T")[0]),
    supabase.from("event_registrations").select("*", { count: "exact", head: true }),
    supabase.from("event_registrations").select("*", { count: "exact", head: true }).eq("status", "CHECKED_IN"),
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("news").select("*", { count: "exact", head: true }),
    supabase.from("volunteers").select("*", { count: "exact", head: true }),
    supabase.from("event_registrations").select("*, event:events!inner(title)").order("created_at", { ascending: false }).limit(10),
  ]);
  return ok(c, {
    total_users: usersRes.count || 0, total_events: eventsRes.count || 0,
    upcoming_events: upcomingRes.count || 0, total_registrations: regsRes.count || 0,
    checked_in: checkedInRes.count || 0, total_projects: projectsRes.count || 0,
    total_news: newsRes.count || 0, total_volunteers: volunteersRes.count || 0,
    recent_registrations: recentRegsRes.data || [],
  });
});

app.get("/users", async (c) => {
  const { page, limit, offset } = extractPaginationParams(c);
  const search = c.req.query("search");
  const supabase = c.get("supabase");
  let query = supabase.from("profiles").select("*", { count: "exact" });
  if (search) query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  const { data: profiles, error, count } = await query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);
  if (error) return serverError(c, error.message);
  const usersWithRoles = await Promise.all((profiles || []).map(async (p: any) => {
    const { data: r } = await supabase.from("user_roles").select("role").eq("user_id", p.id).single();
    return { ...p, role: r?.role || "USER" };
  }));
  return paginatedResponse(c, usersWithRoles, page, limit, count || 0);
});

app.get("/events", async (c) => {
  const { page, limit, offset } = extractPaginationParams(c);
  const search = c.req.query("search");
  const supabase = c.get("supabase");
  let query = supabase.from("events").select("*", { count: "exact" });
  if (search) query = query.or(`title.ilike.%${search}%,short_description.ilike.%${search}%`);
  const { data, error, count } = await query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);
  if (error) return serverError(c, error.message);
  return paginatedResponse(c, data || [], page, limit, count || 0);
});

app.post("/events", async (c) => {
  return requirePermission("events.create", c, async () => {
    const body = await c.req.json();
    const valid = eventSchema.safeParse(body);
    if (!valid.success) return badRequest(c, valid.error.errors[0]?.message || "Validation failed");
    const supabase = c.get("supabase");
    const { data, error } = await supabase.from("events").insert({ ...valid.data, created_by: c.get("user")?.id, updated_by: c.get("user")?.id }).select().single();
    if (error) return serverError(c, error.message);
    await logAudit(c, "EVENT_CREATED", "events", data.id, undefined);
    return ok(c, data);
  });
});

app.get("/events/:id", async (c) => {
  const supabase = c.get("supabase");
  const { data, error } = await supabase.from("events").select("*").eq("id", c.req.param("id")).single();
  if (error || !data) return badRequest(c, "Event not found");
  return ok(c, data);
});

app.put("/events/:id", async (c) => {
  return requirePermission("events.update", c, async () => {
    const body = await c.req.json();
    const valid = eventSchema.safeParse(body);
    if (!valid.success) return badRequest(c, valid.error.errors[0]?.message || "Validation failed");
    const supabase = c.get("supabase");
    const { data, error } = await supabase.from("events").update({ ...valid.data, updated_by: c.get("user")?.id, updated_at: new Date().toISOString() }).eq("id", c.req.param("id")).select().single();
    if (error) return serverError(c, error.message);
    await logAudit(c, "EVENT_UPDATED", "events", data.id, undefined);
    return ok(c, data);
  });
});

app.delete("/events/:id", async (c) => {
  return requirePermission("events.delete", c, async () => {
    const supabase = c.get("supabase");
    const { error } = await supabase.from("events").delete().eq("id", c.req.param("id"));
    if (error) return serverError(c, error.message);
    await logAudit(c, "EVENT_DELETED", "events", c.req.param("id"));
    return ok(c, { success: true });
  });
});

app.get("/events/:id/registrations", async (c) => {
  const { page, limit, offset } = extractPaginationParams(c);
  const search = c.req.query("search");
  const status = c.req.query("status");
  const supabase = c.get("supabase");
  let query = supabase.from("event_registrations").select("*, event:events!inner(title, slug)", { count: "exact" }).eq("event_id", c.req.param("id"));
  if (search) query = query.or(`full_name.ilike.%${search}%,registration_reference.ilike.%${search}%`);
  if (status) query = query.eq("status", status);
  const { data, error, count } = await query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);
  if (error) return serverError(c, error.message);
  return paginatedResponse(c, data || [], page, limit, count || 0);
});

app.patch("/events/:eventId/registrations/:regId", async (c) => {
  return requirePermission("registrations.manage", c, async () => {
    const body = await c.req.json();
    const supabase = c.get("supabase");
    const { data: oldData } = await supabase.from("event_registrations").select("*").eq("id", c.req.param("regId")).single();
    const { data, error } = await supabase.from("event_registrations")
      .update({ status: body.status, updated_at: new Date().toISOString() })
      .eq("id", c.req.param("regId")).eq("event_id", c.req.param("eventId")).select().single();
    if (error) return serverError(c, error.message);
    await logAudit(c, "ATTENDANCE_CHANGED", "event_registrations", data.id, oldData, { status: body.status });
    return ok(c, data);
  });
});

app.get("/projects", async (c) => {
  const { page, limit, offset } = extractPaginationParams(c);
  const search = c.req.query("search");
  const supabase = c.get("supabase");
  let query = supabase.from("projects").select("*", { count: "exact" });
  if (search) query = query.or(`title.ilike.%${search}%`);
  const { data, error, count } = await query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);
  if (error) return serverError(c, error.message);
  return paginatedResponse(c, data || [], page, limit, count || 0);
});

app.post("/projects", async (c) => {
  return requirePermission("projects.create", c, async () => {
    const body = await c.req.json();
    const supabase = c.get("supabase");
    const { data, error } = await supabase.from("projects").insert({ ...body, created_by: c.get("user")?.id, updated_by: c.get("user")?.id }).select().single();
    if (error) return serverError(c, error.message);
    await logAudit(c, "PROJECT_CREATED", "projects", data.id, undefined);
    return ok(c, data);
  });
});

app.put("/projects/:id", async (c) => {
  return requirePermission("projects.update", c, async () => {
    const body = await c.req.json();
    const supabase = c.get("supabase");
    const { data, error } = await supabase.from("projects").update({ ...body, updated_by: c.get("user")?.id, updated_at: new Date().toISOString() }).eq("id", c.req.param("id")).select().single();
    if (error) return serverError(c, error.message);
    await logAudit(c, "PROJECT_UPDATED", "projects", data.id, undefined);
    return ok(c, data);
  });
});

app.delete("/projects/:id", async (c) => {
  return requirePermission("projects.delete", c, async () => {
    const supabase = c.get("supabase");
    const { error } = await supabase.from("projects").delete().eq("id", c.req.param("id"));
    if (error) return serverError(c, error.message);
    await logAudit(c, "PROJECT_DELETED", "projects", c.req.param("id"));
    return ok(c, { success: true });
  });
});

app.get("/news", async (c) => {
  const { page, limit, offset } = extractPaginationParams(c);
  const search = c.req.query("search");
  const supabase = c.get("supabase");
  let query = supabase.from("news").select("*", { count: "exact" });
  if (search) query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
  const { data, error, count } = await query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);
  if (error) return serverError(c, error.message);
  return paginatedResponse(c, data || [], page, limit, count || 0);
});

app.post("/news", async (c) => {
  return requirePermission("news.create", c, async () => {
    const body = await c.req.json();
    const supabase = c.get("supabase");
    const { data, error } = await supabase.from("news").insert({ ...body, created_by: c.get("user")?.id, updated_by: c.get("user")?.id }).select().single();
    if (error) return serverError(c, error.message);
    await logAudit(c, "NEWS_CREATED", "news", data.id, undefined);
    return ok(c, data);
  });
});

app.put("/news/:id", async (c) => {
  return requirePermission("news.update", c, async () => {
    const body = await c.req.json();
    const supabase = c.get("supabase");
    const { data, error } = await supabase.from("news").update({ ...body, updated_by: c.get("user")?.id, updated_at: new Date().toISOString() }).eq("id", c.req.param("id")).select().single();
    if (error) return serverError(c, error.message);
    await logAudit(c, "NEWS_UPDATED", "news", data.id, undefined);
    return ok(c, data);
  });
});

app.delete("/news/:id", async (c) => {
  return requirePermission("news.delete", c, async () => {
    const supabase = c.get("supabase");
    const { error } = await supabase.from("news").delete().eq("id", c.req.param("id"));
    if (error) return serverError(c, error.message);
    await logAudit(c, "NEWS_DELETED", "news", c.req.param("id"));
    return ok(c, { success: true });
  });
});

app.get("/gallery", async (c) => {
  const { page, limit, offset } = extractPaginationParams(c);
  const search = c.req.query("search");
  const supabase = c.get("supabase");
  let query = supabase.from("gallery_items").select("*", { count: "exact" });
  if (search) query = query.or(`caption.ilike.%${search}%,alt_text.ilike.%${search}%`);
  const { data, error, count } = await query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);
  if (error) return serverError(c, error.message);
  return paginatedResponse(c, data || [], page, limit, count || 0);
});

app.post("/gallery", async (c) => {
  return requirePermission("gallery.manage", c, async () => {
    const body = await c.req.json();
    const supabase = c.get("supabase");
    const { data, error } = await supabase.from("gallery_items").insert({ ...body, uploaded_by: c.get("user")?.id }).select().single();
    if (error) return serverError(c, error.message);
    return ok(c, data);
  });
});

app.patch("/gallery/:id", async (c) => {
  return requirePermission("gallery.manage", c, async () => {
    const body = await c.req.json();
    const supabase = c.get("supabase");
    const { data, error } = await supabase.from("gallery_items").update(body).eq("id", c.req.param("id")).select().single();
    if (error) return serverError(c, error.message);
    return ok(c, data);
  });
});

app.delete("/gallery/:id", async (c) => {
  return requirePermission("gallery.manage", c, async () => {
    const supabase = c.get("supabase");
    const { error } = await supabase.from("gallery_items").delete().eq("id", c.req.param("id"));
    if (error) return serverError(c, error.message);
    return ok(c, { success: true });
  });
});

app.get("/volunteers", async (c) => {
  const { page, limit, offset } = extractPaginationParams(c);
  const search = c.req.query("search");
  const status = c.req.query("status");
  const supabase = c.get("supabase");
  let query = supabase.from("volunteers").select("*", { count: "exact" });
  if (search) query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  if (status) query = query.eq("status", status);
  const { data, error, count } = await query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);
  if (error) return serverError(c, error.message);
  return paginatedResponse(c, data || [], page, limit, count || 0);
});

app.patch("/volunteers/:id", async (c) => {
  return requirePermission("volunteers.manage", c, async () => {
    const body = await c.req.json();
    const supabase = c.get("supabase");
    const { data, error } = await supabase.from("volunteers").update({ ...body, updated_at: new Date().toISOString() }).eq("id", c.req.param("id")).select().single();
    if (error) return serverError(c, error.message);
    return ok(c, data);
  });
});

app.delete("/volunteers/:id", async (c) => {
  return requirePermission("volunteers.manage", c, async () => {
    const supabase = c.get("supabase");
    const { error } = await supabase.from("volunteers").delete().eq("id", c.req.param("id"));
    if (error) return serverError(c, error.message);
    return ok(c, { success: true });
  });
});

app.get("/donations", async (c) => {
  const { page, limit, offset } = extractPaginationParams(c);
  const search = c.req.query("search");
  const supabase = c.get("supabase");
  let query = supabase.from("donations").select("*", { count: "exact" });
  if (search) query = query.or(`donor_name.ilike.%${search}%,donor_email.ilike.%${search}%,reference.ilike.%${search}%`);
  const { data, error, count } = await query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);
  if (error) return serverError(c, error.message);
  return paginatedResponse(c, data || [], page, limit, count || 0);
});

app.patch("/donations/:id", async (c) => {
  return requirePermission("donations.manage", c, async () => {
    const body = await c.req.json();
    const supabase = c.get("supabase");
    const { data, error } = await supabase.from("donations").update(body).eq("id", c.req.param("id")).select().single();
    if (error) return serverError(c, error.message);
    return ok(c, data);
  });
});

app.delete("/donations/:id", async (c) => {
  return requirePermission("donations.manage", c, async () => {
    const supabase = c.get("supabase");
    const { error } = await supabase.from("donations").delete().eq("id", c.req.param("id"));
    if (error) return serverError(c, error.message);
    return ok(c, { success: true });
  });
});

app.get("/contact", async (c) => {
  const { page, limit, offset } = extractPaginationParams(c);
  const search = c.req.query("search");
  const status = c.req.query("status");
  const supabase = c.get("supabase");
  let query = supabase.from("contact_messages").select("*", { count: "exact" });
  if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%`);
  if (status) query = query.eq("status", status);
  const { data, error, count } = await query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);
  if (error) return serverError(c, error.message);
  return paginatedResponse(c, data || [], page, limit, count || 0);
});

app.get("/contact/:id", async (c) => {
  const supabase = c.get("supabase");
  const { data, error } = await supabase.from("contact_messages").select("*").eq("id", c.req.param("id")).single();
  if (error || !data) return badRequest(c, "Message not found");
  return ok(c, data);
});

app.patch("/contact/:id", async (c) => {
  return requirePermission("contact.manage", c, async () => {
    const body = await c.req.json();
    const supabase = c.get("supabase");
    const { data, error } = await supabase.from("contact_messages").update({ ...body, updated_at: new Date().toISOString() }).eq("id", c.req.param("id")).select().single();
    if (error) return serverError(c, error.message);
    return ok(c, data);
  });
});

app.delete("/contact/:id", async (c) => {
  return requirePermission("contact.manage", c, async () => {
    const supabase = c.get("supabase");
    const { error } = await supabase.from("contact_messages").delete().eq("id", c.req.param("id"));
    if (error) return serverError(c, error.message);
    return ok(c, { success: true });
  });
});

app.get("/settings", async (c) => {
  const supabase = c.get("supabase");
  const { data, error } = await supabase.from("site_settings").select("*").order("group");
  if (error) return serverError(c, error.message);
  return ok(c, data || []);
});

app.patch("/settings/:key", async (c) => {
  return requirePermission("settings.manage", c, async () => {
    const key = c.req.param("key");
    const body = await c.req.json<{ value: string }>();
    if (body.value === undefined || body.value === null) return badRequest(c, "Value is required");
    const supabase = c.get("supabase");
    const { data, error } = await supabase.from("site_settings").update({ value: body.value, updated_at: new Date().toISOString() }).eq("key", key).select().single();
    if (error) return serverError(c, error.message);
    await logAudit(c, "SETTING_UPDATED", "site_settings", data.id, undefined, { key, value: body.value });
    return ok(c, data);
  });
});

app.route("/audit-logs", auditLogsRouter);

export default app;
