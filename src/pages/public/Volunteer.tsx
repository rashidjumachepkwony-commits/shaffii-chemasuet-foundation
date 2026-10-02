import { useForm } from "@/hooks/useForm";
import { volunteerSchema } from "@/lib/validations";
import { FormField } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionWrapper } from "@/components/ui/ErrorBoundary";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useToast } from "@/components/ui/Toast";
import { volunteersService } from "@/services/index";
import { User, Mail, Phone, MapPin, CalendarDays, FileText, Heart, Users, GraduationCap, Leaf, Shield, Sparkles } from "lucide-react";
import { useState } from "react";

const availabilityOptions = [
  "Weekdays",
  "Evenings",
  "Weekends",
  "Flexible",
];

const volunteerAreas = [
  { value: "youth_mentorship", label: "Youth Mentorship", description: "Guide and inspire young people" },
  { value: "education_support", label: "Education Support", description: "Help with tutoring and learning" },
  { value: "digital_skills", label: "Digital Skills Support", description: "Teach computer and tech skills" },
  { value: "community_outreach", label: "Community Outreach", description: "Engage with local communities" },
  { value: "event_support", label: "Event Support", description: "Help organize and run events" },
  { value: "women_girls_programs", label: "Women & Girls Programs", description: "Support gender equality initiatives" },
  { value: "environmental_activities", label: "Environmental Activities", description: "Promote sustainability" },
  { value: "communications", label: "Communications & Media", description: "Help with content and storytelling" },
  { value: "fundraising", label: "Fundraising Support", description: "Help raise resources" },
  { value: "administration", label: "Administration", description: "Office and operational support" },
];

export default function Volunteer() {
  const { success, error } = useToast();
  const [submitted, setSubmitted] = React.useState(false);

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
              <Heart className="h-8 w-8" />
            </div>
          </div>
          <h1 className="font-display text-3xl font-bold text-neutral-900">
            Thank You for Your Interest
          </h1>
          <p className="mt-4 text-neutral-600">
            Your volunteer application has been received. Our team will review
            it and be in touch with the next steps that match your skills,
            availability, and areas of interest.
          </p>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper spacing="lg">
      <section className="relative overflow-hidden rounded-[2rem] bg-neutral-900 px-5 py-12 text-white shadow-[0_30px_80px_rgba(23,33,27,0.12)] md:px-8 md:py-16">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60" style={{ backgroundImage: "url('/images/shaffi888.jpg')" }} aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-900/80 to-foundation-900/55" />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <span className="section-label border-gold-300/30 bg-white/5 text-gold-200">Volunteer With Us</span>
          <h1 className="mt-6 font-display text-4xl font-bold sm:text-5xl md:text-6xl">
            Join our community of change-makers
          </h1>
          <p className="mt-4 text-lg text-neutral-200 md:text-xl">
            Bring your time, talents, and lived experience to help families,
            learners, and communities thrive with dignity, care, and opportunity.
          </p>
        </div>
      </section>

      <div className="mx-auto mt-10 max-w-4xl">
        <Card variant="elevated" padding="lg" className="mb-8 bg-gradient-to-br from-white to-foundation-50/70">
          <h2 className="mb-6 flex items-center gap-3 font-display text-2xl font-bold text-neutral-900">
            <Users className="h-7 w-7 text-gold-500" />
            How You Can Help
          </h2>
          <p className="mb-6 text-neutral-600">
            There are many meaningful ways to contribute. Choose the area where
            your time, experience, and heart can create the most impact:
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {volunteerAreas.map((area) => (
              <div
                key={area.value}
                className="rounded-2xl border border-neutral-200 bg-white p-4 transition-all duration-200 hover:border-gold-300 hover:bg-gold-50"
              >
                <h4 className="font-medium text-neutral-900">{area.label}</h4>
                <p className="mt-1 text-sm leading-relaxed text-neutral-600">{area.description}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card variant="elevated" padding="lg" className="bg-white">
          <h2 className="mb-2 flex items-center gap-3 font-display text-2xl font-bold text-neutral-900">
            <User className="h-7 w-7 text-gold-500" />
            Volunteer Application
          </h2>
          <p className="mb-6 text-neutral-600">
            Share a little about yourself and we’ll be in touch about opportunities
            that align with your interests and availability.
          </p>

          <form onSubmit={form.handleSubmit} noValidate>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                  placeholder="+254 769 020 852"
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
                <Select
                  value={form.values.area_of_interest as string}
                  onChange={(e) => form.handleChange("area_of_interest", e.target.value)}
                >
                  <option value="">Select area of interest</option>
                  {volunteerAreas.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Select>
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
            </div>

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
              className="w-full bg-foundation-500 text-neutral-900 hover:bg-foundation-400"
              size="lg"
              rounded="full"
            >
              Apply to Volunteer
            </Button>
          </form>
        </Card>
      </div>
    </SectionWrapper>
  );
}