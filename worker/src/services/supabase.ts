import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Context } from "hono";
import type { RoleName } from "../types";
import { ROLE_PERMISSIONS } from "../types";

function normalizeEnvValue(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function isMissingConfig(url: string | undefined, key: string | undefined): boolean {
  if (!url || !key) return true;
  try {
    new URL(url);
    return false;
  } catch {
    return true;
  }
}

export class SupabaseConfigError extends Error {
  constructor() {
    super(
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
    this.name = "SupabaseConfigError";
  }
}

export function isSupabaseConfigured(c: Context): boolean {
  const url = normalizeEnvValue((c.env as any)?.SUPABASE_URL);
  const key = normalizeEnvValue((c.env as any)?.SUPABASE_SERVICE_ROLE_KEY);
  return !isMissingConfig(url, key);
}

export function createSupabaseServerClient(c: Context): SupabaseClient {
  const url = normalizeEnvValue((c.env as any)?.SUPABASE_URL);
  const key = normalizeEnvValue((c.env as any)?.SUPABASE_SERVICE_ROLE_KEY);

  if (isMissingConfig(url, key)) {
    throw new SupabaseConfigError();
  }

  return createClient(url as string, key as string, {
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
  });
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
): Promise<RoleName | "PENDING"> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    // No role row means the account has not been approved by an admin yet.
    return "PENDING";
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
