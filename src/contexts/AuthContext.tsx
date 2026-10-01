import * as React from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session, AuthError, AuthChangeEvent } from "@supabase/supabase-js";
import { setTokenProvider } from "@/services/api";
import { apiRequest } from "@/services/api";
import type { RoleName, Permission } from "@/types";
import { hasPermission } from "@/lib/utils";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: {
    id: string;
    full_name: string | null;
    email: string | null;
    phone: string | null;
    organization: string | null;
    avatar_url: string | null;
  } | null;
  role: RoleName | null;
  permissions: Permission[];
  loading: boolean;
  initialized: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null; data: { needsEmailConfirmation?: boolean } }>;
  signUp: (
    email: string,
    password: string,
    metadata: { full_name?: string; phone?: string }
  ) => Promise<{ error: AuthError | null; data: unknown }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Record<string, unknown>) => Promise<{ error: AuthError | null }>;
  refreshSession: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function usePermissions() {
  const { permissions, role, user } = useAuth();
  return {
    permissions,
    role,
    isAuthenticated: !!user,
    can: (permission: Permission) => hasPermission(permissions, permission),
    hasRole: (r: RoleName) => role === r,
    hasAnyRole: (roles: RoleName[]) => role !== null && roles.includes(role),
  };
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = React.useState<User | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [profile, setProfile] = React.useState<AuthContextType["profile"] | null>(null);
  const [role, setRole] = React.useState<RoleName | null>(null);
  const [permissions, setPermissions] = React.useState<Permission[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [initialized, setInitialized] = React.useState(false);

  const loadProfileAndRole = React.useCallback(async (userId: string) => {
    try {
      const profileRes = await apiRequest<{
        profile: AuthContextType["profile"];
        role: RoleName | null;
        permissions: Permission[];
      } | null>("/auth/me");
      if (profileRes) {
        setProfile(profileRes.profile);
        setRole(profileRes.role);
        setPermissions(profileRes.permissions);
      } else {
        setProfile(null);
        setRole(null);
        setPermissions([]);
      }
    } catch {
      setProfile(null);
      setRole(null);
      setPermissions([]);
    }
  }, []);

  React.useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user && session?.access_token) {
          setTokenProvider(async () => session.access_token);
          await loadProfileAndRole(session.user.id);
        }
      }

      if (mounted) {
        setInitialized(true);
      }
    };

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, newSession: Session | null) => {
        if (mounted) {
          setSession(newSession);
          setUser(newSession?.user ?? null);

          if (newSession?.access_token) {
            setTokenProvider(async () => newSession.access_token);
          } else {
            setTokenProvider(async () => null);
            setProfile(null);
            setRole(null);
            setPermissions([]);
          }

          if (newSession?.user && event !== "SIGNED_OUT") {
            await loadProfileAndRole(newSession.user.id);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfileAndRole]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (!error && data.session?.access_token) {
        setTokenProvider(async () => data.session!.access_token);
        if (data.user) {
          await loadProfileAndRole(data.user.id);
        }
      }
      return { error, data: { needsEmailConfirmation: false } };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    metadata: { full_name?: string; phone?: string }
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      if (!error && data.session?.access_token) {
        setTokenProvider(async () => data.session!.access_token);
        if (data.user) {
          await loadProfileAndRole(data.user.id);
        }
      }
      return { error, data };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setProfile(null);
      setRole(null);
      setPermissions([]);
      setTokenProvider(async () => null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  };

  const updateProfile = async (updates: Record<string, unknown>) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: updates,
      });
      if (!error && user?.id) {
        await loadProfileAndRole(user.id);
      }
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    await supabase.auth.getSession();
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    role,
    permissions,
    loading,
    initialized,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
