import { useForm } from "@/hooks/useForm";
import { contactMessageSchema } from "@/lib/validations";
import { FormField } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { SectionWrapper } from "@/components/ui/ErrorBoundary";
import { useToast } from "@/components/ui/Toast";
import { contactService } from "@/services/index";
import { User, Mail, Phone, FileText, MessageCircle } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const { success } = useToast();
  const [submitted, setSubmitted] = useState(false);

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

      <div className="mx-auto max-w-2xl">
        <form onSubmit={form.handleSubmit} noValidate>
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
              placeholder="+254 700 000 000"
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
            Send Message
          </Button>
        </form>
      </div>
    </SectionWrapper>
  );
}
