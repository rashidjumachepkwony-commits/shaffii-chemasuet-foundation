import * as React from "react";
import { useForm } from "@/hooks/useForm";
import { eventRegistrationSchema } from "@/lib/validations";
import { eventsService } from "@/services/events";
import { FormField } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { User, Mail, Phone, Building, Users } from "lucide-react";

interface RegistrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
  userId?: string;
  userEmail?: string;
  onSuccess: () => void;
}

export function RegistrationDialog({
  isOpen,
  onClose,
  eventId,
  eventTitle,
  userId,
  userEmail,
  onSuccess,
}: RegistrationDialogProps) {
  const { success, error: showError } = useToast();
  const [registrationRef, setRegistrationRef] = React.useState<string | null>(null);

  const form = useForm({
    initialValues: {
      full_name: "",
      email: userEmail || "",
      phone: "",
      organization: "",
      attendee_count: 1,
      notes: "",
    },
    validationSchema: eventRegistrationSchema,
    onSubmit: async (values) => {
      try {
        const result = await eventsService.register(eventId, {
          full_name: values.full_name,
          email: values.email,
          phone: values.phone,
          organization: values.organization || undefined,
          attendee_count: values.attendee_count,
          notes: values.notes || undefined,
        });
        setRegistrationRef(result.registration_reference);
        success("Registration successful!");
        onSuccess();
      } catch (err: any) {
        showError(err.message || "Registration failed.");
      }
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        full_name: "",
        email: userEmail || "",
        phone: "",
        organization: "",
        attendee_count: 1,
        notes: "",
      });
      setRegistrationRef(null);
    }
  }, [isOpen, userEmail]);

  if (registrationRef) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Registration Successful"
        showCloseButton
      >
        <div className="text-center py-6">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              ✓
            </div>
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-4">
            You are registered!
          </h3>
          <p className="text-neutral-600 mb-2">
            You have successfully registered for:
          </p>
          <p className="font-medium text-neutral-900 mb-4">"{eventTitle}"</p>
          <div className="bg-neutral-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-neutral-500">Registration Reference</p>
            <p className="text-2xl font-bold text-foundation-700">
              {registrationRef}
            </p>
          </div>
          <p className="text-sm text-neutral-500">
            A confirmation has been sent to your email.
          </p>
        </div>
        <div className="mt-6 flex justify-center">
          <Button onClick={onClose} variant="secondary" rounded="full">
            Close
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Register: ${eventTitle}`}
      size="lg"
    >
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
        >
          <Input
            type="tel"
            placeholder="+254 700 000 000"
            value={form.values.phone as string}
            onChange={(e) => form.handleChange("phone", e.target.value)}
            onBlur={() => form.handleBlur("phone")}
            aria-invalid={!!form.errors.phone}
            icon={<Phone className="h-4 w-4 text-neutral-400" />}
          />
        </FormField>

        <FormField
          label="Organization (Optional)"
          name="organization"
          error={form.errors.organization}
        >
          <Input
            type="text"
            placeholder="Your organization"
            value={form.values.organization as string}
            onChange={(e) => form.handleChange("organization", e.target.value)}
            onBlur={() => form.handleBlur("organization")}
            icon={<Building className="h-4 w-4 text-neutral-400" />}
          />
        </FormField>

        <FormField
          label="Attendee Count"
          name="attendee_count"
          error={form.errors.attendee_count}
          helpText="Number of people attending"
        >
          <Input
            type="number"
            min="1"
            max="20"
            value={String(form.values.attendee_count)}
            onChange={(e) => form.handleChange("attendee_count", parseInt(e.target.value) || 1)}
            onBlur={() => form.handleBlur("attendee_count")}
            icon={<Users className="h-4 w-4 text-neutral-400" />}
          />
        </FormField>

        <FormField
          label="Notes (Optional)"
          name="notes"
          error={form.errors.notes}
          helpText="Any special requirements or dietary restrictions"
        >
          <Textarea
            placeholder="Your notes..."
            value={form.values.notes as string}
            onChange={(e) => form.handleChange("notes", e.target.value)}
            onBlur={() => form.handleBlur("notes")}
            rows={3}
          />
        </FormField>

        {form.errors.root && (
          <p className="mb-4 text-sm text-red-600" role="alert">
            {form.errors.root}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3 border-t border-neutral-200 pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={form.isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={form.isSubmitting}
            loading={form.isSubmitting}
            rounded="full"
          >
            Complete Registration
          </Button>
        </div>
      </form>
    </Modal>
  );
}
