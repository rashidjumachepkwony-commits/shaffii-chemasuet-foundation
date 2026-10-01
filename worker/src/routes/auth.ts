import { Hono } from "hono";
import { ok, badRequest, serverError, unauthorized } from "../utils/response";
import { getUserRole, getPermissionsForRole } from "../services/supabase";
import type { RoleName } from "../../src/types";

const app = new Hono<{
  Bindings: {
    SUPABASE_URL: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    ENVIRONMENT: string;
  };
  Variables: {
    user: any;
    supabase: any;
    role: string | null;
    permissions: string[];
  };
}>();

app.get("/me", async (c) => {
  const user = c.get("user");
  if (!user) {
    return unauthorized(c);
  }

  const supabase = c.get("supabase");
  const role = await getUserRole(supabase, user.id);
  const permissions = getPermissionsForRole(role);

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError && profileError.code !== "PGRST116") {
    console.error("Profile lookup error:", profileError.message);
  }

  return ok(c, {
    profile: profile ? {
      id: profile.id,
      full_name: profile.full_name,
      email: profile.email,
      phone: profile.phone,
      organization: profile.organization,
      avatar_url: profile.avatar_url,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    } : null,
    role,
    permissions,
  });
});

app.get("/verify-admin", async (c) => {
  const user = c.get("user");
  if (!user) {
    return unauthorized(c);
  }

  const role = c.get("role");
  const adminRoles: RoleName[] = ["SUPER_ADMIN", "ADMIN", "EVENT_MANAGER", "CONTENT_MANAGER"];

  if (!role || !adminRoles.includes(role as RoleName)) {
    return badRequest(c, "Access denied: administrator privileges required");
  }

  return ok(c, { role, permissions: c.get("permissions") });
});

app.get("/roles", async (c) => {
  const user = c.get("user");
  if (!user) {
    return unauthorized(c);
  }
  return ok(c, { role: c.get("role"), permissions: c.get("permissions") });
});

export default app;
