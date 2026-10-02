import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vzllyjcezlladzxharhw.supabase.co";
const supabaseAnonKey = "sb_publishable_pIfSn_anYPoGEXKv5JIFJA_LxvkL_ux";

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
