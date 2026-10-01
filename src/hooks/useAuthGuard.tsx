import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { RoleName, Permission } from "@/types";

interface RequireAuthProps {
  children: ReactNode;
  roles?: RoleName[];
  permissions?: Permission[];
  redirectTo?: string;
}

export function RequireAuth({
  children,
  roles,
  permissions: requiredPermissions,
  redirectTo = "/login",
}: RequireAuthProps) {
  const { user, role, permissions, initialized } = useAuth();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!initialized) return;

    if (!user) {
      navigate(redirectTo, { replace: true });
      return;
    }

    if (roles) {
      const hasRole = roles.includes(role as RoleName);
      if (!hasRole) {
        navigate("/unauthorized", { replace: true });
        return;
      }
    }

    if (requiredPermissions) {
      const hasAll = requiredPermissions.every((p) =>
        permissions.includes(p)
      );
      if (!hasAll) {
        navigate("/unauthorized", { replace: true });
        return;
      }
    }

    setChecked(true);
  }, [
    user,
    role,
    permissions,
    initialized,
    navigate,
    redirectTo,
    roles,
    requiredPermissions,
  ]);

  if (!initialized || !checked) {
    return null;
  }

  return <>{children}</>;
}

interface AdminGateProps {
  children: ReactNode;
  permission?: Permission;
  role?: RoleName | RoleName[];
}

export function AdminGate({ children, permission, role: requiredRole }: AdminGateProps) {
  const { role: userRole, permissions } = useAuth();

  if (permission && !permissions.includes(permission)) {
    return null;
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(userRole as RoleName)) {
      return null;
  }
  }

  return <>{children}</>;
}
