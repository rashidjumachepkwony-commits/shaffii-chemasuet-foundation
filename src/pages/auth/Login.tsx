import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "@/hooks/useForm";
import { loginSchema } from "@/lib/validations";
import { FormField } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { Mail, Lock, LogIn } from "lucide-react";

export default function Login() {
  const { signIn } = useAuth();
  const { error: showError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string })?.from || "/dashboard";

  const form = useForm({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      const { error } = await signIn(values.email, values.password);
      if (error) {
        showError(error.message || "Login failed. Please check your credentials.");
        return;
      }
      navigate(from, { replace: true });
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-foundation-700 text-white font-bold">
            SC
          </div>
          <h1 className="font-display text-3xl font-bold text-neutral-900">
            Sign In
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Welcome back. Sign in to access your account.
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
              placeholder="you@example.com"
              autoComplete="email"
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
              value={form.values.password as string}
              onChange={(e) => form.handleChange("password", e.target.value)}
              onBlur={() => form.handleBlur("password")}
              aria-invalid={!!form.errors.password}
              icon={<Lock className="h-4 w-4 text-neutral-400" />}
            />
          </FormField>

          {form.errors.root && (
            <p className="mb-4 text-sm text-red-600" role="alert">
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
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-neutral-600">
          <Link
            to="/forgot-password"
            className="text-foundation-700 hover:underline"
          >
            Forgot your password?
          </Link>
          <p className="mt-2">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-foundation-700 hover:underline font-medium"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
