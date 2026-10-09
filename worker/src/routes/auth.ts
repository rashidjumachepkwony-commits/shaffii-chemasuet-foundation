import { Hono } from "hono";
import { z } from "zod";
import { ok, badRequest, serverError, unauthorized, created } from "../utils/response";
import { getUserRole, getPermissionsForRole, createSupabaseServerClient } from "../services/supabase";
import type { RoleName } from "../../src/types";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string().min(2),
  phone: z.string().optional(),
  organization: z.string().optional(),
});

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

app.post("/login", async (c) => {
  const body = await c.req.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return badRequest(c, parsed.error.errors[0]?.message || "Validation failed");
  }

  const { email, password } = parsed.data;
  const supabase = createSupabaseServerClient(c);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return unauthorized(c, "Invalid email or password");
  }

  const role = await getUserRole(supabase, data.user.id);
  const permissions = getPermissionsForRole(role);

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  return ok(c, {
    user: {
      id: data.user.id,
      email: data.user.email,
    },
    session: {
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
      expires_at: data.session?.expires_at,
    },
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

app.post("/register", async (c) => {
  const body = await c.req.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return badRequest(c, parsed.error.errors[0]?.message || "Validation failed");
  }

  const { email, password, full_name, phone, organization } = parsed.data;
  const supabase = createSupabaseServerClient(c);

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name },
  });

  if (error || !data.user) {
    return serverError(c, error?.message || "Failed to create user");
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: data.user.id,
      full_name,
      email,
      phone: phone || null,
      organization: organization || null,
    });

  if (profileError) {
    await supabase.auth.admin.deleteUser(data.user.id);
    return serverError(c, "Failed to create profile");
  }

  await supabase
    .from("user_roles")
    .insert({
      user_id: data.user.id,
      role: "USER",
    });

  return created(c, {
    message: "Registration successful. Your account is pending admin approval.",
    user: {
      id: data.user.id,
      email: data.user.email,
    },
  });
});

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
