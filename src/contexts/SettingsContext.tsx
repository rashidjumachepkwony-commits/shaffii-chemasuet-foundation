import * as React from "react";
import { ApiError, apiGet } from "@/services/api";
import type { SiteSetting } from "@/types";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface SettingsContextType {
  settings: Record<string, SiteSetting>;
  loading: boolean;
  refetch: () => Promise<void>;
  getSetting: (key: string, fallback?: string) => string;
}

const SettingsContext = React.createContext<SettingsContextType | undefined>(undefined);

export function useSettings() {
  const context = React.useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState<Record<string, SiteSetting>>({});
  const [loading, setLoading] = React.useState(true);

  const fetchSettings = React.useCallback(async () => {
    try {
      const data = await apiGet<SiteSetting[]>("/public/settings");
      const map: Record<string, SiteSetting> = {};
      data.forEach((s) => {
        map[s.key] = s;
      });
      setSettings(map);
    } catch (error) {
      if (error instanceof ApiError) {
        console.warn("Could not load settings:", error.message);
      }
      setSettings({});
    } finally {
      setLoading(false);
    }
  }, []);

  const getSetting = React.useCallback(
    (key: string, fallback = ""): string => {
      const setting = settings[key];
      if (!setting || !setting.is_public) {
        return fallback;
      }
      return setting.value;
    },
    [settings]
  );

  React.useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const value = {
    settings,
    loading,
    refetch: fetchSettings,
    getSetting,
  };

  if (loading && Object.keys(settings).length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" label="Loading..." />
      </div>
    );
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
