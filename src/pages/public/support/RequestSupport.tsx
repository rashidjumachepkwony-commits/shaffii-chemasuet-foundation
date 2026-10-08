import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { Loader2, CheckCircle } from "lucide-react";
import { apiPost } from "@/services/api";

const supportTypes: readonly string[] = [
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

const urgencyLevels: readonly string[] = ["Emergency", "Urgent", "Normal"];
const contactMethods: readonly string[] = ["Phone call", "SMS", "WhatsApp", "Email"];

type FormData = {
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
  const [formData, setFormData] = useState<FormData>({
    full_name: "", id_number: "", phone_number: "", alternative_phone: "", email: "",
    country: "Kenya", county: "", sub_county: "", ward: "", location: "", current_location: "",
    support_type: "", support_description: "", urgency: "Normal",
    people_needing_support: "", additional_information: "", preferred_contact_method: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiPost<{ reference_number?: string; id?: string }>("/support", { method: "POST", body: JSON.stringify(formData) });
      success("Your support request has been submitted successfully");
      setReference(res?.reference_number || res?.id || null);
      setSubmitted(true);
    } catch (err: any) {
      showError(err.message || "Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: "", id_number: "", phone_number: "", alternative_phone: "", email: "",
      country: "Kenya", county: "", sub_county: "", ward: "", location: "", current_location: "",
      support_type: "", support_description: "", urgency: "Normal",
      people_needing_support: "", additional_information: "", preferred_contact_method: "",
    });
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
          <form onSubmit={handleSubmit} className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Full Names <span className="text-red-600">*</span></label>
                  <Input required value={formData.full_name} onChange={(e) => handleChange("full_name", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ID Number <span className="text-red-600">*</span></label>
                  <Input required value={formData.id_number} onChange={(e) => handleChange("id_number", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number <span className="text-red-600">*</span></label>
                  <Input required type="tel" value={formData.phone_number} onChange={(e) => handleChange("phone_number", e.target.value)} placeholder="e.g. 07XXXXXXXX" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Alternative Phone Number</label>
                  <Input type="tel" value={formData.alternative_phone} onChange={(e) => handleChange("alternative_phone", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <Input type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Location Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Country <span className="text-red-600">*</span></label>
                  <Input required value={formData.country} onChange={(e) => handleChange("country", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">County <span className="text-red-600">*</span></label>
                  <Input required value={formData.county} onChange={(e) => handleChange("county", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sub-County <span className="text-red-600">*</span></label>
                  <Input required value={formData.sub_county} onChange={(e) => handleChange("sub_county", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ward <span className="text-red-600">*</span></label>
                  <Input required value={formData.ward} onChange={(e) => handleChange("ward", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location <span className="text-red-600">*</span></label>
                  <Input required value={formData.location} onChange={(e) => handleChange("location", e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Current Physical Location <span className="text-red-600">*</span></label>
                  <Input required value={formData.current_location} onChange={(e) => handleChange("current_location", e.target.value)} placeholder="Where you currently live/stay" />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Support Needed</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type of Support Needed <span className="text-red-600">*</span></label>
                  <Select required value={formData.support_type} onChange={(e) => handleChange("support_type", e.target.value)}>
                    <option value="" disabled>Select support type</option>
                    {supportTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Urgency <span className="text-red-600">*</span></label>
                  <Select required value={formData.urgency} onChange={(e) => handleChange("urgency", e.target.value)}>
                    {urgencyLevels.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description of Support Needed <span className="text-red-600">*</span></label>
                  <Textarea required rows={4} value={formData.support_description} onChange={(e) => handleChange("support_description", e.target.value)} placeholder="Explain clearly what assistance you need..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Number of People Requiring Support</label>
                  <Input value={formData.people_needing_support} onChange={(e) => handleChange("people_needing_support", e.target.value)} placeholder="e.g. 4" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Preferred Contact Method</label>
                  <Select value={formData.preferred_contact_method} onChange={(e) => handleChange("preferred_contact_method", e.target.value)}>
                    <option value="" disabled>Select method</option>
                    {contactMethods.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Additional Information</label>
                  <Textarea rows={3} value={formData.additional_information} onChange={(e) => handleChange("additional_information", e.target.value)} placeholder="Any other information we should know..." />
                </div>
              </div>
            </section>

            <div className="flex items-start gap-2 mb-2 text-sm text-neutral-500">
              <span className="text-red-600">*</span>
              <span>Required fields</span>
            </div>

            <Button type="submit" className="w-full md:w-auto" size="lg" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Support Request
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export { RequestSupport };

