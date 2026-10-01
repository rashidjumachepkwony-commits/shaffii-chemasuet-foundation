import { Hono } from "hono";
import {
  ok,
  badRequest,
  serverError,
  paginatedResponse,
  extractPaginationParams,
} from "../utils/response";
import { requirePermission } from "../middleware/auth";
import { logAudit } from "../middleware/auth";
import type { SiteSetting } from "../../src/types";

const app = new Hono<{
  Bindings: { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string };
  Variables: { user: any; supabase: any; role: string; permissions: string[] };
}>();

app.get("/public", async (c) => {
  const supabase = c.get("supabase");
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("is_public", true);

  if (error) {
    return serverError(c, error.message);
  }

  return ok(c, data || []);
});

app.get("/admin", async (c) => {
  return requirePermission("settings.manage", c, async () => {
    const supabase = c.get("supabase");
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .order("group");

    if (error) {
      return serverError(c, error.message);
    }
    return ok(c, data || []);
  });
});

app.patch("/admin/:key", async (c) => {
  return requirePermission("settings.manage", c, async () => {
    const key = c.req.param("key");
    const body = await c.req.json<{ value: string }>();

    if (!body.value && body.value !== "") {
      return badRequest(c, "Value is required");
    }

    const supabase = c.get("supabase");
    const { data, error } = await supabase
      .from("site_settings")
      .update({ value: body.value, updated_at: new Date().toISOString() })
      .eq("key", key)
      .select()
      .single();

    if (error) {
      return serverError(c, error.message);
    }

    await logAudit(c, "SETTING_UPDATED", "site_settings", data.id, null, { key, value: body.value });

    return ok(c, data);
  });
});

app.get("/admin/keys/:key", async (c) => {
  return requirePermission("settings.manage", c, async () => {
    const supabase = c.get("supabase");
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("key", c.req.param("key"))
      .single();

    if (error) {
      return badRequest(c, "Setting not found");
    }
    return ok(c, data as SiteSetting);
  });
});

export default app;
