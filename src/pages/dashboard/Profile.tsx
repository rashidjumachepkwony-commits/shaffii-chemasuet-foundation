import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SectionWrapper } from "@/components/ui/ErrorBoundary";
import { RequireAuth } from "@/hooks/useAuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { User, Mail, Phone, Building } from "lucide-react";

export default function DashboardProfile() {
  return (
    <RequireAuth>
      <ProfileContent />
    </RequireAuth>
  );
}

function ProfileContent() {
  const { profile, updateProfile, loading: authLoading } = useAuth();
  const { success, error: showError } = useToast();
  const [isSaving, setIsSaving] = React.useState(false);
  const [formData, setFormData] = React.useState({
    full_name: profile?.full_name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    organization: profile?.organization || "",
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        organization: profile.organization || "",
      });
    }
  }, [profile]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await updateProfile({
        full_name: formData.full_name,
        phone: formData.phone,
        organization: formData.organization,
      });
      if (error) {
        showError(error.message || "Failed to update profile");
      } else {
        success("Profile updated successfully!");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) {
    return (
      <SectionWrapper>
        <p className="text-center">Loading profile...</p>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper spacing="lg">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-neutral-900">
          Profile Settings
        </h1>
        <p className="mt-2 text-neutral-600">
          Update your personal information.
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <Card variant="elevated" padding="lg">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Full Name
              </label>
              <Input
                type="text"
                value={formData.full_name}
                onChange={(e) => handleChange("full_name", e.target.value)}
                icon={<User className="h-4 w-4 text-neutral-400" />}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Email Address (cannot be changed)
              </label>
              <Input
                type="email"
                value={formData.email}
                disabled
                icon={<Mail className="h-4 w-4 text-neutral-400" />}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Phone Number
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                icon={<Phone className="h-4 w-4 text-neutral-400" />}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Organization
              </label>
              <Input
                type="text"
                value={formData.organization}
                onChange={(e) => handleChange("organization", e.target.value)}
                icon={<Building className="h-4 w-4 text-neutral-400" />}
              />
            </div>

            <div className="border-t border-neutral-200 pt-6 flex justify-end gap-3">
              <Button variant="outline" rounded="full">
                Cancel
              </Button>
              <Button
                variant="primary"
                loading={isSaving}
                disabled={isSaving || authLoading}
                rounded="full"
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </SectionWrapper>
  );
}
