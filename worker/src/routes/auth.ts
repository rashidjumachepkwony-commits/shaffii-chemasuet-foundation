import { Hono } from "hono";
import { z } from "zod";
import { ok, badRequest, serverError, unauthorized, forbidden, created } from "../utils/response";
import { getUserRole, getPermissionsForRole, createSupabaseServerClient } from "../services/supabase";
import { log } from "../utils/logger";
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
    log("warn", { msg: "Login attempt failed", error: error?.message || "Invalid credentials" });
    return unauthorized(c, "Invalid email or password");
  }

  const role = await getUserRole(supabase, data.user.id);
  const permissions = getPermissionsForRole(role);

  log("info", { msg: "Login successful", userId: data.user.id, role });

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (profileError && profileError.code !== "PGRST116") {
    log("warn", { msg: "Profile lookup error during login", userId: data.user.id, error: profileError.message });
  }

  return ok(c, {
    user: {
      id: data.user.id,
      email: data.user.email,
    },
    session: data.session
      ? {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at ?? Math.floor(Date.now() / 1000) + 3600,
        }
      : null,
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
    log("warn", {
      msg: "Admin verification denied",
      userId: user?.id,
      actualRole: role,
      requiredRoles: adminRoles,
    });
    return forbidden(c, "Access denied: administrator privileges required");
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

app.patch("/profile", async (c) => {
  const user = c.get("user");
  if (!user) {
    return unauthorized(c);
  }

  const body = await c.req.json();
  const { full_name, phone, organization, password } = body;

  const supabase = c.get("supabase");
  const updates: Record<string, unknown> = {};

  if (full_name !== undefined) updates.full_name = full_name;
  if (phone !== undefined) updates.phone = phone;
  if (organization !== undefined) updates.organization = organization;

  if (Object.keys(updates).length > 0) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    if (profileError) {
      log("error", { msg: "Profile update failed", userId: user.id, error: profileError.message });
      return serverError(c, profileError.message);
    }
  }

  if (password) {
    const { error: passwordError } = await supabase.auth.admin.updateUser(user.id, {
      password,
    });
    if (passwordError) {
      log("error", { msg: "Password update failed", userId: user.id, error: passwordError.message });
      return serverError(c, passwordError.message);
    }
  }

  return ok(c, { success: true });
});

const refreshSchema = z.object({
  refresh_token: z.string(),
});

app.post("/refresh", async (c) => {
  const body = await c.req.json();
  const parsed = refreshSchema.safeParse(body);
  if (!parsed.success) {
    return badRequest(c, "Invalid request");
  }

  const supabase = createSupabaseServerClient(c);
  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: parsed.data.refresh_token,
  });

  if (error || !data.session) {
    log("warn", { msg: "Token refresh failed", error: error?.message });
    return unauthorized(c, "Invalid or expired refresh token");
  }

  return ok(c, {
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token ?? parsed.data.refresh_token,
    expires_at: data.session.expires_at ?? Math.floor(Date.now() / 1000) + 3600,
  });
});

app.post("/logout", async (c) => {
  const user = c.get("user");
  if (user) {
    const supabase = c.get("supabase");
    try {
      await supabase.auth.signOut();
    } catch (err) {
      log("warn", { msg: "Logout: supabase signOut failed", error: err });
    }
  }
  return ok(c, { success: true });
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
});

app.post("/reset-password", async (c) => {
  const body = await c.req.json();
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return badRequest(c, "Invalid email address");
  }

  const supabase = createSupabaseServerClient(c);
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${c.req.header("origin") || ""}/reset-password`,
  });

  if (error) {
    return serverError(c, error.message);
  }

  return ok(c, { message: "Password reset email sent. Please check your inbox." });
});

app.post("/update-password", async (c) => {
  const user = c.get("user");
  if (!user) {
    return unauthorized(c);
  }

  const body = await c.req.json();
  const { password } = body;
  if (!password || password.length < 8) {
    return badRequest(c, "Password must be at least 8 characters");
  }

  const supabase = c.get("supabase");
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return serverError(c, error.message);
  }

  return ok(c, { success: true });
});

export default app;
