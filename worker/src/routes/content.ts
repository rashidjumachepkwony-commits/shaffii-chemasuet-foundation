import { Hono } from "hono";
import { z } from "zod";
import { ok, badRequest, serverError, paginatedResponse, extractPaginationParams, created } from "../utils/response";
import { requirePermission, logAudit } from "../middleware/auth";

const contentSectionSchema = z.object({
  section_key: z.string().min(1).max(100),
  title: z.string().max(200).optional(),
  type: z.enum(["section", "hero", "stat", "team_member", "testimonial"]).default("section"),
  content: z.record(z.any()).default({}),
  sort_order: z.coerce.number().default(0),
  is_published: z.boolean().default(false),
  published_at: z.string().datetime().optional(),
});

const updateSchema = contentSectionSchema.partial().extend({
  section_key: z.string().max(100).optional(),
});

const adminApp = new Hono<{
  Bindings: { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string };
  Variables: { user: any; supabase: any; role: string; permissions: string[] };
}>();

const publicApp = new Hono<{
  Bindings: { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string };
  Variables: { supabase: any };
}>();

publicApp.get("/", async (c) => {
  const { page, limit, offset } = extractPaginationParams(c);
  const sectionType = c.req.query("type");
  const key = c.req.query("key");
  const supabase = c.get("supabase");

  let query = supabase.from("content_sections").select("*", { count: "exact" });

  query = query.eq("is_published", true);

  if (sectionType) {
    query = query.eq("type", sectionType);
  }
  if (key) {
    query = query.eq("section_key", key);
  }

  const { data, error, count } = await query
    .order("sort_order", { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    return serverError(c, error.message);
  }

  return paginatedResponse(c, data || [], page, limit, count || 0);
});

publicApp.get("/:key", async (c) => {
  const key = c.req.param("key");
  const supabase = c.get("supabase");

  const { data, error } = await supabase
    .from("content_sections")
    .select("*")
    .eq("section_key", key)
    .eq("is_published", true)
    .single();

  if (error || !data) {
    return badRequest(c, "Content section not found");
  }

  return ok(c, data);
});

adminApp.get("/", async (c) => {
  return requirePermission("settings.manage", c, async () => {
    const { page, limit, offset } = extractPaginationParams(c);
    const search = c.req.query("search");
    const sectionType = c.req.query("type");
    const supabase = c.get("supabase");

    let query = supabase.from("content_sections").select("*", { count: "exact" });

    if (search) {
      query = query.or(`section_key.ilike.%${search}%,title.ilike.%${search}%`);
    }
    if (sectionType) {
      query = query.eq("type", sectionType);
    }

    const { data, error, count } = await query
      .order("sort_order", { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      return serverError(c, error.message);
    }

    return paginatedResponse(c, data || [], page, limit, count || 0);
  });
});

adminApp.post("/", async (c) => {
  return requirePermission("settings.manage", c, async () => {
    const body = await c.req.json();
    const parsed = contentSectionSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(c, parsed.error.errors[0]?.message || "Validation failed");
    }

    const supabase = c.get("supabase");
    const { data: existing } = await supabase
      .from("content_sections")
      .select("id")
      .eq("section_key", parsed.data.section_key)
      .single();

    if (existing) {
      return badRequest(c, `Section with key "${parsed.data.section_key}" already exists`);
    }

    const { data, error } = await supabase
      .from("content_sections")
      .insert({
        ...parsed.data,
        created_by: c.get("user")?.id,
        updated_by: c.get("user")?.id,
      })
      .select()
      .single();

    if (error) {
      return serverError(c, error.message);
    }

    await logAudit(c, "CONTENT_SECTION_CREATED", "content_sections", data.id, undefined);

    return created(c, data);
  });
});

adminApp.get("/:id", async (c) => {
  return requirePermission("settings.manage", c, async () => {
    const supabase = c.get("supabase");
    const { data, error } = await supabase
      .from("content_sections")
      .select("*")
      .eq("id", c.req.param("id"))
      .single();

    if (error || !data) {
      return badRequest(c, "Content section not found");
    }

    return ok(c, data);
  });
});

adminApp.put("/:id", async (c) => {
  return requirePermission("settings.manage", c, async () => {
    const body = await c.req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(c, parsed.error.errors[0]?.message || "Validation failed");
    }

    const supabase = c.get("supabase");
    const updateData = {
      ...parsed.data,
      updated_by: c.get("user")?.id,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("content_sections")
      .update(updateData)
      .eq("id", c.req.param("id"))
      .select()
      .single();

    if (error) {
      return serverError(c, error.message);
    }

    await logAudit(c, "CONTENT_SECTION_UPDATED", "content_sections", data.id, undefined);

    return ok(c, data);
  });
});

adminApp.delete("/:id", async (c) => {
  return requirePermission("settings.manage", c, async () => {
    const supabase = c.get("supabase");
    const { error } = await supabase
      .from("content_sections")
      .delete()
      .eq("id", c.req.param("id"));

    if (error) {
      return serverError(c, error.message);
    }

    await logAudit(c, "CONTENT_SECTION_DELETED", "content_sections", c.req.param("id"));

    return ok(c, { success: true });
  });
});

export { adminApp as adminContentRouter, publicApp as publicContentRouter };
