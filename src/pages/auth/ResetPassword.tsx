import { useNavigate } from "react-router-dom";
import { useForm } from "@/hooks/useForm";
import { resetPasswordSchema } from "@/lib/validations";
import { FormField } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { Lock } from "lucide-react";
import { z } from "zod";

const resetPasswordSchemaExtended = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  });

export default function ResetPassword() {
  const { updateProfile } = useAuth();
  const { error: showError, success: showSuccess } = useToast();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: { password: "", confirm_password: "" },
    validationSchema: resetPasswordSchemaExtended,
    onSubmit: async (values) => {
      const { error } = await updateProfile({ password: values.password });
      if (error) {
        showError(error.message || "Failed to reset password.");
        return;
      }
      showSuccess("Password reset successfully.");
      navigate("/login");
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
