import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { Loader2, CheckCircle } from "lucide-react";
import { useForm } from "@/hooks/useForm";
import { supportRequestSchema } from "@/lib/validations";
import { apiPost } from "@/services/api";

const supportTypes = [
  "Education support",
  "Food support",
  "Medical assistance",
  "Financial assistance",
  "Emergency assistance",
  "Family/community support",
  "Youth support",
  "Elderly support",
  "Disability-related support",
  "Housing/shelter assistance",
  "Business/livelihood support",
  "Other",
];

const urgencyLevels = ["Emergency", "Urgent", "Normal"];
const contactMethods = ["Phone call", "SMS", "WhatsApp", "Email"];

type SupportRequestInput = {
  full_name: string;
  id_number: string;
  phone_number: string;
  alternative_phone: string;
  email: string;
  country: string;
  county: string;
  sub_county: string;
  ward: string;
  location: string;
  current_location: string;
  support_type: string;
  support_description: string;
  urgency: string;
  people_needing_support: string;
  additional_information: string;
  preferred_contact_method: string;
};

export default function RequestSupport() {
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      full_name: "", id_number: "", phone_number: "", alternative_phone: "", email: "",
      country: "Kenya", county: "", sub_county: "", ward: "", location: "", current_location: "",
      support_type: "", support_description: "", urgency: "Normal",
      people_needing_support: "", additional_information: "", preferred_contact_method: "",
    },
    validationSchema: supportRequestSchema,
    onSubmit: async (values) => {
      const res = await apiPost<{ reference_number?: string; id?: string }>(
        "/support", { method: "POST", body: JSON.stringify(values as SupportRequestInput) }
      );
      setReference(res?.reference_number || res?.id || null);
      setSubmitted(true);
      success("Your support request has been submitted successfully");
    },
  });

  const resetForm = () => {
    form.reset();
    setSubmitted(false);
    setReference(null);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Request Submitted Successfully</h1>
            <p className="text-neutral-600 mb-4">
              Your support request has been received and will be reviewed by our team.
              We will contact you using the contact information you provided.
            </p>
            {reference && (
              <p className="text-sm text-neutral-500 mb-6">Reference: {reference}</p>
            )}
            <div className="flex gap-4 justify-center flex-wrap">
              <Button onClick={() => navigate("/")}>Return to Home</Button>
              <Button variant="outline" onClick={resetForm}>Submit Another Request</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Request Support</h1>
          <p className="text-neutral-600">Tell us how we can help. Please fill in the form below.</p>
        </div>
        <Card className="p-6 md:p-8">
          {form.errors._form && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {form.errors._form}
            </div>
          )}
          <form onSubmit={form.handleSubmit} className="space-y-8" noValidate>
            <section>
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Full Names <span className="text-red-600">*</span></label>
                  <Input
                    required
                    value={form.values.full_name as string}
                    onChange={(e) => form.handleChange("full_name", e.target.value)}
                    onBlur={() => form.handleBlur("full_name")}
                    aria-invalid={!!form.errors.full_name}
                    aria-describedby={form.errors.full_name ? "full_name-error" : undefined}
                  />
                  {form.errors.full_name && (
                    <p id="full_name-error" className="mt-1 text-sm text-red-600">{form.errors.full_name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ID Number <span className="text-red-600">*</span></label>
                  <Input
                    required
                    value={form.values.id_number as string}
                    onChange={(e) => form.handleChange("id_number", e.target.value)}
                    onBlur={() => form.handleBlur("id_number")}
                    aria-invalid={!!form.errors.id_number}
                  />
                  {form.errors.id_number && (
                    <p className="mt-1 text-sm text-red-600">{form.errors.id_number}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number <span className="text-red-600">*</span></label>
                  <Input
                    required
                    type="tel"
                    value={form.values.phone_number as string}
                    onChange={(e) => form.handleChange("phone_number", e.target.value)}
                    onBlur={() => form.handleBlur("phone_number")}
                    aria-invalid={!!form.errors.phone_number}
                    placeholder="e.g. 07XXXXXXXX"
                  />
                  {form.errors.phone_number && (
                    <p className="mt-1 text-sm text-red-600">{form.errors.phone_number}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Alternative Phone Number</label>
                  <Input
                    type="tel"
                    value={form.values.alternative_phone as string}
                    onChange={(e) => form.handleChange("alternative_phone", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <Input
                    type="email"
                    value={form.values.email as string}
                    onChange={(e) => form.handleChange("email", e.target.value)}
                    onBlur={() => form.handleBlur("email")}
                    aria-invalid={!!form.errors.email}
                  />
                  {form.errors.email && (
                    <p className="mt-1 text-sm text-red-600">{form.errors.email}</p>
                  )}
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Location Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Country <span className="text-red-600">*</span></label>
                  <Input
                    required
                    value={form.values.country as string}
                    onChange={(e) => form.handleChange("country", e.target.value)}
                    onBlur={() => form.handleBlur("country")}
                    aria-invalid={!!form.errors.country}
                  />
                  {form.errors.country && <p className="mt-1 text-sm text-red-600">{form.errors.country}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">County <span className="text-red-600">*</span></label>
                  <Input
                    required
                    value={form.values.county as string}
                    onChange={(e) => form.handleChange("county", e.target.value)}
                    onBlur={() => form.handleBlur("county")}
                    aria-invalid={!!form.errors.county}
                  />
                  {form.errors.county && <p className="mt-1 text-sm text-red-600">{form.errors.county}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sub-County <span className="text-red-600">*</span></label>
                  <Input
                    required
                    value={form.values.sub_county as string}
                    onChange={(e) => form.handleChange("sub_county", e.target.value)}
                    onBlur={() => form.handleBlur("sub_county")}
                    aria-invalid={!!form.errors.sub_county}
                  />
                  {form.errors.sub_county && <p className="mt-1 text-sm text-red-600">{form.errors.sub_county}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ward <span className="text-red-600">*</span></label>
                  <Input
                    required
                    value={form.values.ward as string}
                    onChange={(e) => form.handleChange("ward", e.target.value)}
                    onBlur={() => form.handleBlur("ward")}
                    aria-invalid={!!form.errors.ward}
                  />
                  {form.errors.ward && <p className="mt-1 text-sm text-red-600">{form.errors.ward}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location <span className="text-red-600">*</span></label>
                  <Input
                    required
                    value={form.values.location as string}
                    onChange={(e) => form.handleChange("location", e.target.value)}
                    onBlur={() => form.handleBlur("location")}
                    aria-invalid={!!form.errors.location}
                  />
                  {form.errors.location && <p className="mt-1 text-sm text-red-600">{form.errors.location}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Current Physical Location <span className="text-red-600">*</span></label>
                  <Input
                    required
                    value={form.values.current_location as string}
                    onChange={(e) => form.handleChange("current_location", e.target.value)}
                    onBlur={() => form.handleBlur("current_location")}
                    aria-invalid={!!form.errors.current_location}
                    placeholder="Where you currently live/stay"
                  />
                  {form.errors.current_location && <p className="mt-1 text-sm text-red-600">{form.errors.current_location}</p>}
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Support Needed</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type of Support Needed <span className="text-red-600">*</span></label>
                  <Select
                    required
                    value={form.values.support_type as string}
                    onChange={(e) => form.handleChange("support_type", e.target.value)}
                    onBlur={() => form.handleBlur("support_type")}
                    aria-invalid={!!form.errors.support_type}
                  >
                    <option value="" disabled>Select support type</option>
                    {supportTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </Select>
                  {form.errors.support_type && <p className="mt-1 text-sm text-red-600">{form.errors.support_type}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Urgency <span className="text-red-600">*</span></label>
                  <Select
                    required
                    value={form.values.urgency as string}
                    onChange={(e) => form.handleChange("urgency", e.target.value)}
                    onBlur={() => form.handleBlur("urgency")}
                    aria-invalid={!!form.errors.urgency}
                  >
                    {urgencyLevels.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </Select>
                  {form.errors.urgency && <p className="mt-1 text-sm text-red-600">{form.errors.urgency}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description of Support Needed <span className="text-red-600">*</span></label>
                  <Textarea
                    required
                    rows={4}
                    value={form.values.support_description as string}
                    onChange={(e) => form.handleChange("support_description", e.target.value)}
                    onBlur={() => form.handleBlur("support_description")}
                    aria-invalid={!!form.errors.support_description}
                    placeholder="Explain clearly what assistance you need..."
                  />
                  {form.errors.support_description && <p className="mt-1 text-sm text-red-600">{form.errors.support_description}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Number of People Requiring Support</label>
                  <Input
                    value={form.values.people_needing_support as string}
                    onChange={(e) => form.handleChange("people_needing_support", e.target.value)}
                    placeholder="e.g. 4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Preferred Contact Method</label>
                  <Select
                    value={form.values.preferred_contact_method as string}
                    onChange={(e) => form.handleChange("preferred_contact_method", e.target.value)}
                  >
                    <option value="" disabled>Select method</option>
                    {contactMethods.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Additional Information</label>
                  <Textarea
                    rows={3}
                    value={form.values.additional_information as string}
                    onChange={(e) => form.handleChange("additional_information", e.target.value)}
                    placeholder="Any other information we should know..."
                  />
                </div>
              </div>
            </section>

            <div className="flex items-start gap-2 text-sm text-neutral-500">
              <span className="text-red-600">*</span>
              <span>Required fields</span>
            </div>

            <Button type="submit" className="w-full md:w-auto" size="lg" disabled={form.isSubmitting}>
              {form.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Support Request
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export { RequestSupport };
