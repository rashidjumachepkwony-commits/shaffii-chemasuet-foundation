import { createClient } from "@supabase/supabase-js";
import type { Context } from "hono";
import type { RoleName } from "../types";
import { ROLE_PERMISSIONS } from "../types";

export function createSupabaseServerClient(c: Context) {
  return createClient(
    c.env.SUPABASE_URL,
    c.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: {
          "x-application-name": "foundation-worker",
        },
      },
      db: {
        schema: "public",
      },
    }
  );
}

export async function verifyUserToken(
  supabase: ReturnType<typeof createSupabaseServerClient>,
  accessToken: string
) {
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return null;
  }
  return user;
}

export async function getUserRole(
  supabase: ReturnType<typeof createSupabaseServerClient>,
  userId: string
): Promise<RoleName> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return "USER";
  }
  return data.role as RoleName;
}

export function getPermissionsForRole(role: RoleName): string[] {
  return ROLE_PERMISSIONS[role] || [];
}

export async function authenticateToken(
  supabase: ReturnType<typeof createSupabaseServerClient>,
  accessToken: string
) {
  const user = await verifyUserToken(supabase, accessToken);
  if (!user) {
    return null;
  }
  const role = await getUserRole(supabase, user.id);
  const permissions = getPermissionsForRole(role);
  return { user, role, permissions };
}
