import * as React from "react";
import { setTokenProvider } from "@/services/api";
import type { RoleName, Permission } from "@/types";
import { hasPermission } from "@/lib/utils";
import { authService } from "@/services";

interface AuthContextType {
  user: {
    id: string;
    email: string;
  } | null;
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  } | null;
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
   login: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null; data: { needsEmailConfirmation?: boolean } }>;
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
  const [user, setUser] = React.useState<AuthContextType["user"]>(null);
  const [session, setSession] = React.useState<AuthContextType["session"]>(null);
  const [profile, setProfile] = React.useState<AuthContextType["profile"] | null>(null);
  const [role, setRole] = React.useState<RoleName | null>(null);
  const [permissions, setPermissions] = React.useState<Permission[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [initialized, setInitialized] = React.useState(false);

  const loadProfileAndRole = React.useCallback(async () => {
    try {
      const result = await authService.getMe();
      setProfile(result.profile);
      setRole(result.role as RoleName | null);
      setPermissions(result.permissions as Permission[]);
    } catch {
      setProfile(null);
      setRole(null);
      setPermissions([]);
    }
  }, []);

  React.useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      const storedSession = localStorage.getItem("auth_session");
      const storedUser = localStorage.getItem("auth_user");

      if (storedSession && storedUser) {
        try {
          const sessionData = JSON.parse(storedSession);
          const userData = JSON.parse(storedUser);

          if (sessionData.access_token) {
            setTokenProvider(async () => sessionData.access_token);
            setSession(sessionData);
            setUser(userData);
            await loadProfileAndRole();
          }
        } catch {
          localStorage.removeItem("auth_session");
          localStorage.removeItem("auth_user");
        }
      }

      if (mounted) {
        setInitialized(true);
      }
    };

    initialize();
  }, [loadProfileAndRole]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await authService.login(email, password);
      setTokenProvider(async () => result.session.access_token);
      setUser({ id: result.user.id, email: result.user.email });
      setSession(result.session);
      setProfile(result.profile);
      setRole(result.role as RoleName);
      setPermissions(result.permissions as Permission[]);
      localStorage.setItem("auth_session", JSON.stringify(result.session));
      localStorage.setItem("auth_user", JSON.stringify({ id: result.user.id, email: result.user.email }));
      return { error: null, data: { needsEmailConfirmation: false } };
    } catch (err: any) {
      return { error: err, data: { needsEmailConfirmation: false } };
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
      localStorage.removeItem("auth_session");
      localStorage.removeItem("auth_user");
      setTokenProvider(async () => null);
      setUser(null);
      setSession(null);
      setProfile(null);
      setRole(null);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    return { error: new Error("Password reset not implemented") };
  };

  const refreshSession = async () => {
    await loadProfileAndRole();
  };

  const updateProfile = async (
    data: { full_name?: string; phone?: string; organization?: string; password?: string }
  ) => {
    setLoading(true);
    try {
      await authService.updateProfile(data);
      await loadProfileAndRole();
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
    login,
    register,
    logout,
    resetPassword,
    refreshSession,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}