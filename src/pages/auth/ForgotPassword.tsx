import { Link } from "react-router-dom";
import { useForm } from "@/hooks/useForm";
import { forgotPasswordSchema } from "@/lib/validations";
import { FormField } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { Mail, Send } from "lucide-react";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const { error: showError, success: showSuccess } = useToast();

  const form = useForm({
    initialValues: { email: "" },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      const { error } = await resetPassword(values.email);
      if (error) {
        showError(error.message || "Failed to send reset email.");
        return;
      }
      showSuccess("Password reset instructions sent to your email.");
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
            Reset Password
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Enter your email address and we'll send you instructions to reset your password.
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
            <Send className="mr-2 h-4 w-4" />
            Send Reset Instructions
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-neutral-600">
          <Link
            to="/login"
            className="text-foundation-700 hover:underline font-medium"
          >
            ← Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
