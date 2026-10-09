import { Link, useNavigate } from "react-router-dom";
import { useForm } from "@/hooks/useForm";
import { registerSchema } from "@/lib/validations";
import { FormField } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { User, Mail, Phone, Lock, UserPlus } from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const { error: showError, success: showSuccess } = useToast();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      full_name: "",
      email: "",
      phone: "",
      password: "",
      confirm_password: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      const { error, data } = await register(values.email, values.password, {
        full_name: values.full_name,
        phone: values.phone,
      });

      if (error) {
        showError(error.message || "Registration failed. Please try again.");
        return;
      }

      // New API returns { message: string; user: { id: string; email: string } }
      if (data?.user) {
        showSuccess(
          "Registration successful! Your account is pending admin approval."
        );
        navigate("/login");
        return;
      }

      showSuccess("Registration successful! Welcome.");
      navigate("/dashboard");
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
            Create Your Account
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Join the Shafie Chemasuet Foundation community.
          </p>
        </div>

        <form onSubmit={form.handleSubmit} noValidate>
          <FormField
            label="Full Name"
            name="full_name"
            error={form.errors.full_name}
            required
          >
            <Input
              type="text"
              placeholder="John Doe"
              autoComplete="name"
              value={form.values.full_name as string}
              onChange={(e) => form.handleChange("full_name", e.target.value)}
              onBlur={() => form.handleBlur("full_name")}
              aria-invalid={!!form.errors.full_name}
              icon={<User className="h-4 w-4 text-neutral-400" />}
            />
          </FormField>

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
            label="Phone Number"
            name="phone"
            error={form.errors.phone}
            required
            helpText="Used for event notifications"
          >
            <Input
              type="tel"
              placeholder="+254 700 000 000"
              autoComplete="tel"
              value={form.values.phone as string}
              onChange={(e) => form.handleChange("phone", e.target.value)}
              onBlur={() => form.handleBlur("phone")}
              aria-invalid={!!form.errors.phone}
              icon={<Phone className="h-4 w-4 text-neutral-400" />}
            />
          </FormField>

          <FormField
            label="Password"
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
            <UserPlus className="mr-2 h-4 w-4" />
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-neutral-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-foundation-700 hover:underline font-medium"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
