import { Hono } from "hono";
import { z } from "zod";
import { requirePermission, logAudit } from "../middleware/auth";
import { log } from "../utils/logger";
import {
  ok,
  badRequest,
  serverError,
  created,
  paginatedResponse,
  extractPaginationParams,
} from "../utils/response";
import { eventSchema, volunteerSchema } from "../validation";
import auditLogsRouter from "./auditLogs";

const app = new Hono<{
  Bindings: { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string };
  Variables: { user: any; supabase: any; role: string; permissions: string[] };
}>();

app.get("/dashboard", async (c) => {
  return requirePermission("events.view", c, async () => {
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
});

app.get("/users", async (c) => {
  return requirePermission("users.view", c, async () => {
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
});

const assignableRoles = ["SUPER_ADMIN", "ADMIN", "EVENT_MANAGER", "CONTENT_MANAGER", "USER"] as const;

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  full_name: z.string().min(2, "Full name is required"),
  role: z.enum(assignableRoles),
  phone: z.string().optional(),
  organization: z.string().optional(),
});

const updateUserSchema = z.object({
  full_name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  organization: z.string().optional(),
  role: z.enum(assignableRoles).optional(),
});

const setPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

app.post("/users", async (c) => {
  return requirePermission("users.manage", c, async () => {
    const body = await c.req.json();
    const parsed = createUserSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(c, parsed.error.errors[0]?.message || "Validation failed");
    }

    const { email, password, full_name, role, phone, organization } = parsed.data;
    const supabase = c.get("supabase");

    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();
    if (existing) {
      return badRequest(c, "A user with that email already exists");
    }

    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name },
    });

    if (createError || !created?.user) {
      log("error", { msg: "Admin create user failed", error: createError?.message });
      return serverError(c, createError?.message || "Failed to create user");
    }

    const userId = created.user.id;

    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        full_name,
        email,
        phone: phone || null,
        organization: organization || null,
      });

    const { error: roleError } = await supabase
      .from("user_roles")
      .upsert(
        { user_id: userId, role, created_by: c.get("user")?.id },
        { onConflict: "user_id" }
      );

    if (profileError || roleError) {
      log("error", {
        msg: "Create user: profile/role insert failed, rolling back auth user",
        userId,
        profileError: profileError?.message,
        roleError: roleError?.message,
      });
      await supabase.from("user_roles").delete().eq("user_id", userId);
      await supabase.auth.admin.deleteUser(userId);
      return serverError(c, "Failed to finish creating the account. Please try again.");
    }

    await logAudit(c, "USER_CREATED", "profiles", userId, undefined, { email, role });

    return created(c, { id: userId, email, full_name, role });
  });
});

app.patch("/users/:id", async (c) => {
  return requirePermission("users.manage", c, async () => {
    const userId = c.req.param("id");
    const body = await c.req.json();
    const parsed = updateUserSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(c, parsed.error.errors[0]?.message || "Validation failed");
    }

    const { email, role, ...profileFields } = parsed.data;
    const supabase = c.get("supabase");

    const { data: current } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();
    if (!current) {
      return badRequest(c, "User not found");
    }

    if (email) {
      const { error: emailError } = await supabase.auth.admin.updateUserById(userId, { email });
      if (emailError) {
        return serverError(c, emailError.message);
      }
    }

    if (Object.keys(profileFields).length > 0) {
      const updates: Record<string, unknown> = { ...profileFields };
      if (email) updates.email = email;
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", userId);
      if (profileError) {
        return serverError(c, profileError.message);
      }
    }

    if (role) {
      const { error: roleError } = await supabase
        .from("user_roles")
        .upsert(
          { user_id: userId, role, created_by: c.get("user")?.id },
          { onConflict: "user_id" }
        );
      if (roleError) {
        return serverError(c, roleError.message);
      }
    }

    await logAudit(c, "USER_UPDATED", "profiles", userId, undefined, parsed.data);

    return ok(c, { success: true });
  });
});

app.post("/users/:id/password", async (c) => {
  return requirePermission("users.manage", c, async () => {
    const userId = c.req.param("id");
    const body = await c.req.json();
    const parsed = setPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(c, parsed.error.errors[0]?.message || "Validation failed");
    }

    const supabase = c.get("supabase");

    const { error } = await supabase.auth.admin.updateUserById(userId, {
      password: parsed.data.password,
    });

    if (error) {
      log("error", { msg: "Admin set password failed", userId, error: error.message });
      return serverError(c, error.message);
    }

    await logAudit(c, "USER_PASSWORD_SET", "profiles", userId);

    return ok(c, { success: true });
  });
});

app.delete("/users/:id", async (c) => {
  return requirePermission("users.manage", c, async () => {
    const userId = c.req.param("id");
    const actorId = c.get("user")?.id;

    if (userId === actorId) {
      return badRequest(c, "You cannot delete your own account");
    }

    const supabase = c.get("supabase");

    const { error: roleDeleteError } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId);
    if (roleDeleteError) {
      return serverError(c, roleDeleteError.message);
    }

    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) {
      log("error", { msg: "Admin delete user failed", userId, error: error.message });
      return serverError(c, error.message);
    }

    await logAudit(c, "USER_DELETED", "profiles", userId);

    return ok(c, { success: true });
  });
});

app.get("/events", async (c) => {
  return requirePermission("events.view", c, async () => {
    const { page, limit, offset } = extractPaginationParams(c);
    const search = c.req.query("search");
    const supabase = c.get("supabase");
    let query = supabase.from("events").select("*", { count: "exact" });
    if (search) query = query.or(`title.ilike.%${search}%,short_description.ilike.%${search}%`);
    const { data, error, count } = await query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);
    if (error) return serverError(c, error.message);
    return paginatedResponse(c, data || [], page, limit, count || 0);
  });
});

app.post("/events", async (c) => {
  return requirePermission("events.create", c, async () => {
    const body = await c.req.json();
    const valid = eventSchema.safeParse(body);
    if (!valid.success) return badRequest(c, valid.error.errors[0]?.message || "Validation failed");
    const supabase = c.get("supabase");
    const userId = c.get("user")?.id;
    const isDevUser = userId === "00000000-0000-0000-0000-000000000000";
    const { data, error } = await supabase.from("events").insert({
      ...valid.data,
      created_by: isDevUser ? null : userId,
      updated_by: isDevUser ? null : userId,
    }).select().single();
    if (error) return serverError(c, error.message);
    await logAudit(c, "EVENT_CREATED", "events", data.id, undefined);
    return ok(c, data);
  });
});

app.get("/events/:id", async (c) => {
  return requirePermission("events.view", c, async () => {
    const supabase = c.get("supabase");
    const { data, error } = await supabase.from("events").select("*").eq("id", c.req.param("id")).single();
    if (error || !data) return badRequest(c, "Event not found");
    return ok(c, data);
  });
});

app.put("/events/:id", async (c) => {
  return requirePermission("events.update", c, async () => {
    const body = await c.req.json();
    const valid = eventSchema.safeParse(body);
    if (!valid.success) return badRequest(c, valid.error.errors[0]?.message || "Validation failed");
    const supabase = c.get("supabase");
    const userId = c.get("user")?.id;
    const isDevUser = userId === "00000000-0000-0000-0000-000000000000";
    const { data, error } = await supabase.from("events").update({ ...valid.data, updated_by: isDevUser ? null : userId, updated_at: new Date().toISOString() }).eq("id", c.req.param("id")).select().single();
    if (error) return serverError(c, error.message);
    await logAudit(c, "EVENT_UPDATED", "events", data.id, undefined);
    return ok(c, data);
  });
});

app.patch("/events/:id", async (c) => {
  return requirePermission("events.update", c, async () => {
    const body = await c.req.json();
    const valid = eventSchema.partial().safeParse(body);
    if (!valid.success) return badRequest(c, valid.error.errors[0]?.message || "Validation failed");
    const supabase = c.get("supabase");
    const updates: Record<string, unknown> = {};
    for (const key of Object.keys(valid.data)) {
      if (key in body) updates[key] = (valid.data as Record<string, unknown>)[key];
    }
    const userId = c.get("user")?.id;
    const isDevUser = userId === "00000000-0000-0000-0000-000000000000";
    updates.updated_by = isDevUser ? null : userId;
    updates.updated_at = new Date().toISOString();
    const { data, error } = await supabase.from("events").update(updates).eq("id", c.req.param("id")).select().single();
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
  return requirePermission("registrations.view", c, async () => {
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

app.delete("/events/:eventId/registrations/:regId", async (c) => {
  return requirePermission("registrations.manage", c, async () => {
    const supabase = c.get("supabase");
    const { error } = await supabase
      .from("event_registrations")
      .delete()
      .eq("id", c.req.param("regId"))
      .eq("event_id", c.req.param("eventId"));
    if (error) return serverError(c, error.message);
    await logAudit(c, "REGISTRATION_DELETED", "event_registrations", c.req.param("regId"));
    return ok(c, { success: true });
  });
});

app.get("/projects", async (c) => {
  return requirePermission("projects.update", c, async () => {
    const { page, limit, offset } = extractPaginationParams(c);
    const search = c.req.query("search");
    const supabase = c.get("supabase");
    let query = supabase.from("projects").select("*", { count: "exact" });
    if (search) query = query.or(`title.ilike.%${search}%`);
    const { data, error, count } = await query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);
    if (error) return serverError(c, error.message);
    return paginatedResponse(c, data || [], page, limit, count || 0);
  });
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
  return requirePermission("news.update", c, async () => {
    const { page, limit, offset } = extractPaginationParams(c);
    const search = c.req.query("search");
    const supabase = c.get("supabase");
    let query = supabase.from("news").select("*", { count: "exact" });
    if (search) query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    const { data, error, count } = await query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);
    if (error) return serverError(c, error.message);
    return paginatedResponse(c, data || [], page, limit, count || 0);
  });
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
  return requirePermission("gallery.manage", c, async () => {
    const { page, limit, offset } = extractPaginationParams(c);
    const search = c.req.query("search");
    const supabase = c.get("supabase");
    let query = supabase.from("gallery_items").select("*", { count: "exact" });
    if (search) query = query.or(`caption.ilike.%${search}%,alt_text.ilike.%${search}%`);
    const { data, error, count } = await query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);
    if (error) return serverError(c, error.message);
    return paginatedResponse(c, data || [], page, limit, count || 0);
  });
});

app.post("/gallery", async (c) => {
  return requirePermission("gallery.manage", c, async () => {
    const body = await c.req.json();
    const supabase = c.get("supabase");
    const user = c.get("user");
    const isDevBypass = user?.id === "00000000-0000-0000-0000-000000000000";
    const { data, error } = await supabase.from("gallery_items").insert({ ...body, uploaded_by: isDevBypass ? null : user?.id }).select().single();
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

app.post("/volunteers", async (c) => {
  return requirePermission("volunteers.manage", c, async () => {
    const body = await c.req.json();
    const valid = volunteerSchema.safeParse(body);
    if (!valid.success) return badRequest(c, valid.error.errors[0]?.message || "Validation failed");
    const supabase = c.get("supabase");
    const { data, error } = await supabase.from("volunteers").insert(valid.data).select().single();
    if (error) return serverError(c, error.message);
    await logAudit(c, "VOLUNTEER_CREATED", "volunteers", data.id, undefined, valid.data);
    return ok(c, data);
  });
});

app.get("/volunteers", async (c) => {
  return requirePermission("volunteers.manage", c, async () => {
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
  return requirePermission("donations.manage", c, async () => {
    const { page, limit, offset } = extractPaginationParams(c);
    const search = c.req.query("search");
    const supabase = c.get("supabase");
    let query = supabase.from("donations").select("*", { count: "exact" });
    if (search) query = query.or(`donor_name.ilike.%${search}%,donor_email.ilike.%${search}%,reference.ilike.%${search}%`);
    const { data, error, count } = await query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);
    if (error) return serverError(c, error.message);
    return paginatedResponse(c, data || [], page, limit, count || 0);
  });
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
  return requirePermission("contact.manage", c, async () => {
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
});

app.get("/contact/:id", async (c) => {
  return requirePermission("contact.manage", c, async () => {
    const supabase = c.get("supabase");
    const { data, error } = await supabase.from("contact_messages").select("*").eq("id", c.req.param("id")).single();
    if (error || !data) return badRequest(c, "Message not found");
    return ok(c, data);
  });
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
  return requirePermission("settings.manage", c, async () => {
    const supabase = c.get("supabase");
    const { data, error } = await supabase.from("site_settings").select("*")      .order("group_name");
    if (error) return serverError(c, error.message);
    return ok(c, data || []);
  });
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
