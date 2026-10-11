import * as React from "react";
import { setTokenProvider, setUnauthorizedHandler } from "@/services/api";
import type { RoleName, Permission } from "@/types";
import { hasPermission } from "@/lib/utils";
import { authService } from "@/services";
import { supabase } from "@/lib/supabase";

type AuthSession = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
};

type AuthUser = {
  id: string;
  email: string;
};

type AuthProfile = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  organization: string | null;
  avatar_url: string | null;
};

interface AuthContextType {
  user: AuthUser | null;
  session: AuthSession | null;
  profile: AuthProfile | null;
  role: RoleName | null;
  permissions: Permission[];
  loading: boolean;
  initialized: boolean;
  /** True when a Google sign-in is waiting for admin approval. */
  pendingApproval: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{
    error: Error | null;
    data: { needsEmailConfirmation?: boolean; role?: string | null; permissions?: string[]; pending?: boolean } | null;
  }>;
  register: (
    email: string,
    password: string,
    metadata: { full_name?: string; phone?: string; organization?: string }
  ) => Promise<{ error: Error | null; data: { message: string; user: { id: string; email: string } } | null }>;
  updateProfile: (
    data: { full_name?: string; phone?: string; organization?: string; password?: string }
  ) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  refreshSession: () => Promise<void>;
  /** Starts the Google OAuth redirect for member sign-in. */
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  /** Completes a Google sign-in after the OAuth redirect returns. */
  completeGoogleSignIn: () => Promise<{ error: Error | null; pending: boolean }>;
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

const STORAGE_SESSION_KEY = "scf-auth-session";
const STORAGE_USER_KEY = "scf-auth-user";

function isTokenExpired(expiresAt: number): boolean {
  const bufferMs = 5 * 60 * 1000;
  return Date.now() + bufferMs >= expiresAt;
}

function getStoredSession(): { session: AuthSession | null; user: AuthUser | null } {
  try {
    const sessionJson = localStorage.getItem(STORAGE_SESSION_KEY);
    const userJson = localStorage.getItem(STORAGE_USER_KEY);
    const session = sessionJson ? (JSON.parse(sessionJson) as AuthSession) : null;
    const user = userJson ? (JSON.parse(userJson) as AuthUser) : null;
    return { session, user };
  } catch {
    localStorage.removeItem(STORAGE_SESSION_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    return { session: null, user: null };
  }
}

function storeSession(session: AuthSession | null, user: AuthUser | null) {
  if (session && user) {
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_SESSION_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
  }
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [session, setSession] = React.useState<AuthSession | null>(null);
  const [profile, setProfile] = React.useState<AuthProfile | null>(null);
  const [role, setRole] = React.useState<RoleName | null>(null);
  const [permissions, setPermissions] = React.useState<Permission[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [initialized, setInitialized] = React.useState(false);
  const [pendingApproval, setPendingApproval] = React.useState(false);
  const logoutRef = React.useRef<(() => Promise<void>) | null>(null) as React.MutableRefObject<
    (() => Promise<void>) | null
  >;
  const didInitialize = React.useRef(false);

  const loadProfileAndRole = React.useCallback(
    async (token: string) => {
      try {
        const result = await authService.getMe();
        setProfile(result.profile);
        setRole(result.role ? (result.role as RoleName) : null);
        setPermissions(result.permissions as Permission[]);
      } catch {
        // A transient failure must NOT demote a signed-in user to null, or the
        // admin guard will bounce them to /unauthorized. Keep current state;
        // the 401 handler in api.ts already covers real auth expiry.
      }
    },
    []
  );

  const isDevelopment = React.useMemo(
    () => import.meta.env.VITE_APP_ENV === "development",
    []
  );

  const refreshAccessToken = React.useCallback(async (): Promise<AuthSession | null> => {
    if (!session?.refresh_token) return null;

    try {
      const result = await authService.refreshToken(session.refresh_token);
      if (!result?.access_token) return null;

      const newSession: AuthSession = {
        access_token: result.access_token,
        refresh_token: result.refresh_token ?? session.refresh_token,
        expires_at: result.expires_at ?? Math.floor(Date.now() / 1000) + 3600,
      };

      setSession(newSession);
      setTokenProvider(async () => newSession.access_token);
      storeSession(newSession, user);
      return newSession;
    } catch {
      return null;
    }
  }, [session, user]);

  const refreshAccessTokenRef = React.useRef(refreshAccessToken);
  refreshAccessTokenRef.current = refreshAccessToken;

  /**
   * Completes a Google (OAuth) sign-in after the redirect returns tokens to the
   * browser Supabase client. Exchanges them with the worker for app session
   * state, and creates the profile on first sign-in.
   */
  const completeGoogleSignIn = React.useCallback(async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const googleSession = data?.session;

      if (!googleSession?.access_token) {
        return { error: null, pending: false };
      }

      const result = await authService.oauthSession({
        access_token: googleSession.access_token,
        refresh_token: googleSession.refresh_token,
        expires_at: googleSession.expires_at,
      });

      const normalizedSession: AuthSession = {
        access_token: result.session.access_token,
        refresh_token: result.session.refresh_token || googleSession.refresh_token,
        expires_at: result.session.expires_at,
      };

      const isPending = result.pending || !result.role;

      setTokenProvider(async () => normalizedSession.access_token);
      setSession(normalizedSession);
      setUser(result.user);
      setProfile(result.profile);
      setPermissions(result.permissions as Permission[]);
      setRole(isPending ? null : (result.role as RoleName));
      setPendingApproval(isPending);
      storeSession(normalizedSession, result.user);

      // Clear the browser client's session so a later page load does not
      // re-process the same OAuth callback.
      await supabase.auth.signOut({ scope: "local" });

      return { error: null, pending: isPending };
    } catch (err: any) {
      return { error: err, pending: false };
    }
  }, []);

  const signInWithGoogle = React.useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/login`,
        },
      });
      return { error: error ? new Error(error.message) : null };
    } catch (err: any) {
      return { error: err };
    }
  }, []);

  React.useEffect(() => {
    if (isDevelopment) return;

    setUnauthorizedHandler(async () => {
      const refreshed = await refreshAccessTokenRef.current();
      if (!refreshed && logoutRef.current) {
        await logoutRef.current();
      }
      return refreshed !== null;
    });

    return () => setUnauthorizedHandler(null);
  }, [isDevelopment]);

  const initializeFromStorage = React.useCallback(async () => {
    const { session: storedSession, user: storedUser } = getStoredSession();

    if (storedSession && storedUser) {
      let activeSession = storedSession;

      if (isTokenExpired(storedSession.expires_at * 1000)) {
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
          storeSession(null, null);
          setSession(null);
          setUser(null);
          setProfile(null);
          setRole(null);
          setPermissions([]);
          setPendingApproval(false);
          setInitialized(true);
          return;
        }
        activeSession = refreshed;
      }

      setTokenProvider(async () => activeSession.access_token);
      setSession(activeSession);
      setUser(storedUser);
      setPendingApproval(false);
      await loadProfileAndRole(activeSession.access_token);
    } else {
      // No app session stored — this may be a Google OAuth redirect returning.
      await completeGoogleSignIn();
    }

    setInitialized(true);
  }, [refreshAccessToken, loadProfileAndRole, completeGoogleSignIn]);

  React.useEffect(() => {
    if (didInitialize.current) return;
    didInitialize.current = true;

    const initialize = async () => {
      if (isDevelopment) {
        const devSession: AuthSession = {
          access_token: "dev-token",
          refresh_token: "dev-refresh",
          expires_at: Math.floor(Date.now() / 1000) + 86400,
        };
        const devUser: AuthUser = { id: "dev-user", email: "dev@admin.local" };
        setTokenProvider(async () => devSession.access_token);
        setSession(devSession);
        setUser(devUser);
        setProfile({
          id: "dev-user",
          full_name: "Dev Admin",
          email: "dev@admin.local",
          phone: null,
          organization: null,
          avatar_url: null,
        });
        setRole("SUPER_ADMIN");
        setPermissions(["*"] as unknown as Permission[]);
        storeSession(devSession, devUser);
        setInitialized(true);
        return;
      }

      await initializeFromStorage();
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await authService.login(email, password);

      if (!result.session) {
        return {
          error: new Error("Login failed: no session returned. Please try again."),
          data: { needsEmailConfirmation: false },
        };
      }

      const { session: authSession, user: authUser, profile: authProfile, role: authRole, permissions: authPermissions } = result;

      const normalizedSession: AuthSession = {
        access_token: authSession.access_token,
        refresh_token: authSession.refresh_token,
        expires_at: authSession.expires_at,
      };

      setTokenProvider(async () => normalizedSession.access_token);
      setSession(normalizedSession);
      setUser(authUser);
      setProfile(authProfile);
      setRole(authRole ? (authRole as RoleName) : null);
      setPermissions(authPermissions as Permission[]);
      setPendingApproval(!authRole);
      storeSession(normalizedSession, authUser);

      return {
        error: null,
        data: {
          needsEmailConfirmation: false,
          role: authRole ?? null,
          permissions: authPermissions,
          pending: !authRole,
        },
      };
    } catch (err: any) {
      return { error: err, data: null };
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    metadata: { full_name?: string; phone?: string; organization?: string }
  ) => {
    setLoading(true);
    try {
      const result = await authService.register({
        email,
        password,
        full_name: metadata.full_name || "",
        phone: metadata.phone,
        organization: metadata.organization,
      });
      return { error: null, data: result };
    } catch (err: any) {
      return { error: err, data: null };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch {
      // ignore network errors during logout
    } finally {
      setTokenProvider(async () => null);
      setUser(null);
      setSession(null);
      setProfile(null);
      setRole(null);
      setPermissions([]);
      setPendingApproval(false);
      storeSession(null, null);
      setLoading(false);
    }
  };

  logoutRef.current = logout;

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      await authService.resetPassword(email);
      return { error: null };
    } catch (err: any) {
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    const refreshed = await refreshAccessToken();
    const activeSession = refreshed ?? session;
    if (activeSession) {
      await loadProfileAndRole(activeSession.access_token);
    }
  };

  const updateProfile = async (
    data: { full_name?: string; phone?: string; organization?: string; password?: string }
  ) => {
    setLoading(true);
    try {
      await authService.updateProfile(data);
      await loadProfileAndRole(session?.access_token || "");
      return { error: null };
    } catch (err: any) {
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    role,
    permissions,
    loading,
    initialized,
    pendingApproval,
    login,
    register,
    logout,
    resetPassword,
    refreshSession,
    updateProfile,
    signInWithGoogle,
    completeGoogleSignIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
