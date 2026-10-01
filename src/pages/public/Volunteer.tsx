import { useForm } from "@/hooks/useForm";
import { volunteerSchema } from "@/lib/validations";
import { FormField } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { SectionWrapper } from "@/components/ui/ErrorBoundary";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useToast } from "@/components/ui/Toast";
import { volunteersService } from "@/services/index";
import { User, Mail, Phone, MapPin, CalendarDays, FileText } from "lucide-react";
import { useState } from "react";

const availabilityOptions = [
  "Weekdays",
  "Evenings",
  "Weekends",
  "Flexible",
];

export default function Volunteer() {
  const { success, error } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    initialValues: {
      full_name: "",
      email: "",
      phone: "",
      location: "",
      area_of_interest: "",
      availability: "",
      experience: "",
      message: "",
    },
    validationSchema: volunteerSchema,
    onSubmit: async (values) => {
      await volunteersService.create({
        full_name: values.full_name,
        email: values.email || undefined,
        phone: values.phone || undefined,
        location: values.location || undefined,
        area_of_interest: values.area_of_interest || undefined,
        availability: values.availability || undefined,
        experience: values.experience || undefined,
        message: values.message || undefined,
      });
      success("Your volunteer application has been submitted successfully.");
      setSubmitted(true);
    },
  });

  if (submitted) {
    return (
      <SectionWrapper spacing="lg">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <User className="h-8 w-8" />
            </div>
          </div>
          <h1 className="font-display text-3xl font-bold text-neutral-900">
            Thank You!
          </h1>
          <p className="mt-4 text-neutral-600">
            Your volunteer application has been submitted. We will contact you
            soon regarding next steps.
          </p>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper spacing="lg">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl font-bold text-neutral-900 sm:text-5xl">
          Volunteer With Us
        </h1>
        <p className="mt-4 text-lg text-neutral-600">
          Join our community of dedicated volunteers making a real difference.
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
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
          >
            <Input
              type="email"
              placeholder="john@example.com"
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
            label="Location"
            name="location"
            error={form.errors.location}
          >
            <Input
              type="text"
              placeholder="City, Country"
              value={form.values.location as string}
              onChange={(e) => form.handleChange("location", e.target.value)}
              onBlur={() => form.handleBlur("location")}
              icon={<MapPin className="h-4 w-4 text-neutral-400" />}
            />
          </FormField>

          <FormField
            label="Area of Interest"
            name="area_of_interest"
            error={form.errors.area_of_interest}
          >
            <Input
              type="text"
              placeholder="e.g. Education, Health, Environment"
              value={form.values.area_of_interest as string}
              onChange={(e) => form.handleChange("area_of_interest", e.target.value)}
              onBlur={() => form.handleBlur("area_of_interest")}
              icon={<FileText className="h-4 w-4 text-neutral-400" />}
            />
          </FormField>

          <FormField
            label="Availability"
            name="availability"
            error={form.errors.availability}
          >
            <Select
              value={form.values.availability as string}
              onChange={(e) => form.handleChange("availability", e.target.value)}
            >
              <option value="">Select availability</option>
              {availabilityOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Experience"
            name="experience"
            error={form.errors.experience}
            helpText="Briefly describe your relevant experience or skills"
          >
            <Textarea
              placeholder="Tell us about your experience..."
              value={form.values.experience as string}
              onChange={(e) => form.handleChange("experience", e.target.value)}
              onBlur={() => form.handleBlur("experience")}
              rows={3}
            />
          </FormField>

          <FormField
            label="Additional Message"
            name="message"
            error={form.errors.message}
          >
            <Textarea
              placeholder="Any additional information..."
              value={form.values.message as string}
              onChange={(e) => form.handleChange("message", e.target.value)}
              onBlur={() => form.handleBlur("message")}
              rows={4}
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
            Submit Application
          </Button>
        </form>
      </div>
    </SectionWrapper>
  );
}
