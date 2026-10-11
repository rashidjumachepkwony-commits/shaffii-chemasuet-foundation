import { useNavigate } from "react-router-dom";
import * as React from "react";
import { useForm } from "@/hooks/useForm";
import { resetPasswordSchema } from "@/lib/validations";
import { FormField } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { authService } from "@/services";
import { Link } from "react-router-dom";
import { Lock, AlertTriangle } from "lucide-react";

function getRecoveryToken(): string | null {
  const hash = window.location.hash.replace(/^#/, "");
  const params = new URLSearchParams(hash);
  const token = params.get("access_token");
  return token;
}

export default function ResetPassword() {
  const { error: showError, success: showSuccess } = useToast();
  const navigate = useNavigate();
  const [recoveryToken, setRecoveryToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    setRecoveryToken(getRecoveryToken());
  }, []);

  const form = useForm({
    initialValues: { password: "", confirm_password: "" },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      if (!recoveryToken) {
        showError("Invalid or expired reset link. Please request a new one.");
        return;
      }

      try {
        await authService.confirmResetPassword(recoveryToken, values.password);
        showSuccess("Password reset successfully. You can now sign in.");
        window.history.replaceState(null, "", "/reset-password");
        navigate("/login", { replace: true });
      } catch (err: any) {
        showError(err.message || "Failed to reset password.");
      }
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
            Set New Password
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Enter a new password for your account.
          </p>
          {!recoveryToken && (
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-left text-sm text-amber-800">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>
                This page needs a valid password reset link. Open the "Reset
                Password" email we sent you and click the link inside.
              </p>
            </div>
          )}
        </div>

        <form onSubmit={form.handleSubmit} noValidate>
          <FormField
            label="New Password"
            name="password"
            error={form.errors.password}
            required
            helpText="Min 8 characters with uppercase, lowercase, and number"
          >
            <Input
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              value={form.values.password as string}
              onChange={(e) => form.handleChange("password", e.target.value)}
              onBlur={() => form.handleBlur("password")}
              aria-invalid={!!form.errors.password}
              icon={<Lock className="h-4 w-4 text-neutral-400" />}
            />
          </FormField>

          <FormField
            label="Confirm Password"
            name="confirm_password"
            error={form.errors.confirm_password}
            required
          >
            <Input
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              value={form.values.confirm_password as string}
              onChange={(e) => form.handleChange("confirm_password", e.target.value)}
              onBlur={() => form.handleBlur("confirm_password")}
              aria-invalid={!!form.errors.confirm_password}
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
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
}
