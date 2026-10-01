import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useToast } from "@/components/ui/Toast";
import { adminService } from "@/services/index";
import type { SiteSetting } from "@/types";
import { Save, Settings } from "lucide-react";

const settingGroups = [
  {
    name: "Foundation Information",
    keys: [
      "foundation_name",
      "mission",
      "vision",
      "foundation_address",
      "foundation_phone",
      "foundation_email",
      "registration_number",
    ],
  },
  {
    name: "Social Media",
    keys: [
      "social_facebook",
      "social_twitter",
      "social_instagram",
      "social_linkedin",
      "social_youtube",
    ],
  },
  {
    name: "Donation Information",
    keys: ["donation_info", "donation_bank", "donation_mpesa"],
  },
  {
    name: "Footer",
    keys: ["footer_text"],
  },
  {
    name: "Appearance",
    keys: ["site_title", "site_description"],
  },
];

export default function AdminSettings() {
  const { success, error: showError } = useToast();
  const [settings, setSettings] = React.useState<Record<string, SiteSetting>>({});
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const loadSettings = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getSettings();
      const map: Record<string, SiteSetting> = {};
      data.forEach((s) => {
        map[s.key] = s;
      });
      setSettings(map);
    } catch (err: any) {
      showError(err.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, [showError]);

  React.useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleValueChange = (key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: { ...prev[key], value } as SiteSetting,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const key of Object.keys(settings)) {
        await adminService.updateSetting(key, settings[key].value);
      }
      success("Settings saved successfully");
    } catch (err: any) {
      showError(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading settings..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-neutral-900">
          Settings
        </h1>
        <Button onClick={handleSave} disabled={saving} loading={saving}>
          <Save className="mr-2 h-4 w-4" />
          Save All
        </Button>
      </div>

      {settingGroups.map((group) => (
        <Card key={group.name} variant="elevated" padding="lg">
          <h2 className="font-display text-lg font-bold text-neutral-900 mb-4">
            {group.name}
          </h2>
          <div className="space-y-4">
            {group.keys.map((key) => {
              const setting = settings[key];
              if (!setting) {
                return (
                  <div key={key} className="text-sm text-neutral-500">
                    Setting not found: {key}
                  </div>
                );
              }
              return (
                <div key={key}>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    {setting.label || key.replace(/_/g, " ").toUpperCase()}
                  </label>
                  {setting.type === "textarea" ||
                    ["mission", "vision", "footer_text", "donation_info"].includes(key) ? (
                    <Textarea
                      value={setting.value || ""}
                      onChange={(e) => handleValueChange(key, e.target.value)}
                      placeholder={setting.description || ""}
                      rows={key === "mission" || key === "vision" ? 4 : 3}
                    />
                  ) : (
                    <Input
                      type="text"
                      value={setting.value || ""}
                      onChange={(e) => handleValueChange(key, e.target.value)}
                      placeholder={setting.description || ""}
                    />
                  )}
                  {setting.description && (
                    <p className="mt-1 text-xs text-neutral-500">{setting.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}
