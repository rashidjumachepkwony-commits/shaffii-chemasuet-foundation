import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storageKey: "scf-auth-token",
  },
  global: {
    headers: {
      "x-application-name": "shaffii-chemasuet-foundation",
    },
  },
});

export type {
  Session,
  User,
  AuthError,
  AuthChangeEvent,
  WeakPassword,
} from "@supabase/supabase-js";
