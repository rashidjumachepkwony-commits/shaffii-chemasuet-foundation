import { useForm } from "@/hooks/useForm";
import { contactMessageSchema } from "@/lib/validations";
import { FormField } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionWrapper } from "@/components/ui/ErrorBoundary";
import { useToast } from "@/components/ui/Toast";
import { contactService } from "@/services/index";
import { useSettings } from "@/contexts/SettingsContext";
import { User, Mail, Phone, FileText, MessageCircle, MapPin } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const { success } = useToast();
  const { getSetting } = useSettings();
  const [submitted, setSubmitted] = useState(false);

  const foundationEmail = getSetting("foundation_email", "info@shaffiichemasuetfoundation.org");
  const foundationPhone = getSetting("foundation_phone", "+254 769 020 852");
  const foundationAddress = getSetting("foundation_address", "Nairobi, Kenya");

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
    validationSchema: contactMessageSchema,
    onSubmit: async (values) => {
      await contactService.create({
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        subject: values.subject,
        message: values.message,
      });
      success("Your message has been sent successfully. We will respond soon.");
      setSubmitted(true);
    },
  });

  if (submitted) {
    return (
      <SectionWrapper spacing="lg">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <MessageCircle className="h-8 w-8" />
            </div>
          </div>
          <h1 className="font-display text-3xl font-bold text-neutral-900">
            Message Sent!
          </h1>
          <p className="mt-4 text-neutral-600">
            Thank you for reaching out. We have received your message and
            will get back to you as soon as possible.
          </p>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper spacing="lg">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl font-bold text-neutral-900 sm:text-5xl">
          Contact Us
        </h1>
        <p className="mt-4 text-lg text-neutral-600">
          Have questions? Get in touch with our team.
        </p>
      </div>

      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-12">
          <Card variant="elevated" padding="lg" className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold-100">
              <MapPin className="h-6 w-6 text-gold-500" />
            </div>
            <h3 className="font-display text-lg font-bold text-neutral-900">Visit Us</h3>
            <p className="mt-2 text-sm text-neutral-600">{foundationAddress}</p>
          </Card>

          <Card variant="elevated" padding="lg" className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold-100">
              <Phone className="h-6 w-6 text-gold-500" />
            </div>
            <h3 className="font-display text-lg font-bold text-neutral-900">Call Us</h3>
            <p className="mt-2 text-sm text-neutral-600">{foundationPhone}</p>
          </Card>

          <Card variant="elevated" padding="lg" className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold-100">
              <Mail className="h-6 w-6 text-gold-500" />
            </div>
            <h3 className="font-display text-lg font-bold text-neutral-900">Email Us</h3>
            <p className="mt-2 text-sm text-neutral-600">{foundationEmail}</p>
          </Card>
        </div>

        <div className="mx-auto max-w-2xl">
          <Card variant="elevated" padding="lg">
            <h2 className="font-display text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
              <MessageCircle className="h-6 w-6 text-gold-500" />
              Send Us a Message
            </h2>

            <form onSubmit={form.handleSubmit} noValidate>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField
                  label="Full Name"
                  name="name"
                  error={form.errors.name}
                  required
                >
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={form.values.name as string}
                    onChange={(e) => form.handleChange("name", e.target.value)}
                    onBlur={() => form.handleBlur("name")}
                    aria-invalid={!!form.errors.name}
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
                  label="Subject"
                  name="subject"
                  error={form.errors.subject}
                  required
                >
                  <Input
                    type="text"
                    placeholder="How can we help you?"
                    value={form.values.subject as string}
                    onChange={(e) => form.handleChange("subject", e.target.value)}
                    onBlur={() => form.handleBlur("subject")}
                    aria-invalid={!!form.errors.subject}
                    icon={<FileText className="h-4 w-4 text-neutral-400" />}
                  />
                </FormField>
              </div>

              <FormField
                label="Message"
                name="message"
                error={form.errors.message}
                required
              >
                <Textarea
                  placeholder="Write your message here..."
                  value={form.values.message as string}
                  onChange={(e) => form.handleChange("message", e.target.value)}
                  onBlur={() => form.handleBlur("message")}
                  aria-invalid={!!form.errors.message}
                  rows={6}
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
                <MessageCircle className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </SectionWrapper>
  );
}