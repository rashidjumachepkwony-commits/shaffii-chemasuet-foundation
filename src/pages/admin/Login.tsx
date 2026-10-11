import { useNavigate } from "react-router-dom";
import * as React from "react";
import { useForm } from "@/hooks/useForm";
import { loginSchema } from "@/lib/validations";
import { FormField } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, Shield } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "EVENT_MANAGER", "CONTENT_MANAGER"];

export default function AdminLogin() {
  const { success, error: showError } = useToast();
  const { login, logout, user, role, initialized } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        const { error, data } = await login(values.email, values.password);
        if (error) {
          showError(error.message || "Login failed. Please check your credentials.");
          return;
        }

        const userRole = data?.role;
        if (!userRole || !ADMIN_ROLES.includes(userRole)) {
          showError("This account does not have administrator privileges. Please use the member login.");
          await logout();
          return;
        }

        success("Admin login successful!");
        navigate("/admin", { replace: true });
      } catch (err: any) {
        showError(err.message || "Login failed.");
      }
    },
  });

  React.useEffect(() => {
    if (initialized && user && role && ADMIN_ROLES.includes(role)) {
      navigate("/admin", { replace: true });
    }
  }, [initialized, user, role, navigate]);

  if (!initialized) {
    return <LoadingSpinner label="Loading..." />;
  }

  if (user && role && ADMIN_ROLES.includes(role)) {
    return <LoadingSpinner label="Redirecting to admin panel..." />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-900 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-foundation-700 text-white">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">
            Admin Portal
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Authorized administrators only.
          </p>
        </div>

        <form onSubmit={form.handleSubmit} noValidate>
          <FormField
            label="Email Address"
            name="email"
            error={form.errors.email}
            required
          >
            <Input
              type="email"
              placeholder="admin@example.com"
              autoComplete="email"
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
              value={form.values.email as string}
              onChange={(e) => form.handleChange("email", e.target.value)}
              onBlur={() => form.handleBlur("email")}
              aria-invalid={!!form.errors.email}
              icon={<Mail className="h-4 w-4 text-neutral-400" />}
            />
          </FormField>

          <FormField
            label="Password"
            name="password"
            error={form.errors.password}
            required
          >
            <Input
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
              value={form.values.password as string}
              onChange={(e) => form.handleChange("password", e.target.value)}
              onBlur={() => form.handleBlur("password")}
              aria-invalid={!!form.errors.password}
              icon={<Lock className="h-4 w-4 text-neutral-400" />}
            />
          </FormField>

          {form.errors.root && (
            <p className="mb-4 text-sm text-red-400" role="alert">
              {form.errors.root}
            </p>
          )}

          <Button
            type="submit"
            disabled={form.isSubmitting}
            loading={form.isSubmitting}
            className="w-full"
            size="lg"
            rounded="full"
          >
            <Shield className="mr-2 h-4 w-4" />
            Sign In as Admin
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login", { replace: true })}
            className="text-sm text-neutral-400 hover:text-neutral-200"
          >
            ← Back to member login
          </button>
        </div>
      </div>
    </div>
  );
}
