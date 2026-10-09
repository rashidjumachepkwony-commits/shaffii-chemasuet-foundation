import type { Context } from "hono";
import { verifyUserToken, getUserRole, getPermissionsForRole, createSupabaseServerClient } from "../services/supabase";
import type { RoleName } from "../../src/types";
import { log } from "../utils/logger";

export async function authenticate(context: Context, next: () => Promise<void>) {
  const authHeader = context.req.header("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    context.set("user", null);
    context.set("role", null);
    context.set("permissions", []);
    await next();
    return;
  }

  const accessToken = authHeader.substring(7);
  const supabase = createSupabaseServerClient(context);

  const user = await verifyUserToken(supabase, accessToken);
  if (!user) {
    return context.json({ success: false, error: "Invalid or expired token" }, 401);
  }

  const role = await getUserRole(supabase, user.id);
  const permissions = getPermissionsForRole(role);

  context.set("user", user);
  context.set("role", role);
  context.set("permissions", permissions);
  context.set("supabase", supabase);

  log("info", {
    msg: "User authenticated",
    userId: user.id,
    role,
  });

  await next();
}

export async function requireAuth(context: Context, next: () => Promise<Response>) {
  const user = context.var.user;
  if (!user) {
    return context.json({ success: false, error: "Authentication required" }, 401);
  }
  await next();
}

export async function requireRole(
  roles: RoleName | RoleName[],
  context: Context,
  next: () => Promise<Response>
) {
  const userRole = context.var.role;
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  if (!userRole || !allowedRoles.includes(userRole)) {
    log("warn", {
      msg: "Access denied - insufficient role",
      requiredRoles: allowedRoles,
      actualRole: userRole,
      userId: context.var.user?.id,
    });
    return context.json(
      { success: false, error: "Insufficient permissions" },
      403
    );
  }
  await next();
}

export async function requirePermission(
  permission: string,
  context: Context,
  next: () => Promise<Response>
) {
  const permissions = context.var.permissions;
  if (!permissions || !permissions.includes(permission)) {
    log("warn", {
      msg: "Access denied - insufficient permission",
      requiredPermission: permission,
      userId: context.var.user?.id,
    });
    return context.json(
      { success: false, error: "Insufficient permissions" },
      403
    );
  }
  await next();
}

export async function logAudit(
  context: Context,
  action: string,
  tableName?: string,
  recordId?: string,
  oldValues?: Record<string, unknown>,
  newValues?: Record<string, unknown>
) {
  try {
    const supabase = context.get("supabase") || createSupabaseServerClient(context);
    const user = context.var.user;

    await supabase.from("audit_logs").insert({
      actor_id: user?.id || null,
      action,
      table_name: tableName,
      record_id: recordId,
      old_values: oldValues,
      new_values: newValues,
      ip_address: context.req.header("cf-connecting-ip") || context.req.header("x-forwarded-for") || null,
      user_agent: context.req.header("user-agent") || null,
    });
  } catch (err) {
    log("error", { msg: "Failed to write audit log", error: err });
  }
}
