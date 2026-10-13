import * as React from "react";
import { ApiError, apiGet, extractData } from "@/services/api";
import type { ApiResponse, SiteSetting } from "@/types";

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
      const response = await apiGet<ApiResponse<SiteSetting[]>>("/public/settings");
      const settingsArray = extractData(response);
      const map: Record<string, SiteSetting> = {};
      settingsArray.forEach((s) => {
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
    let cancelled = false;
    fetchSettings().finally(() => {
      if (!cancelled) {
        setLoading(false);
      }
    });
    const timeout = setTimeout(() => {
      if (!cancelled) {
        setLoading(false);
      }
    }, 10000);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [fetchSettings]);

  const value = {
    settings,
    loading,
    refetch: fetchSettings,
    getSetting,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
