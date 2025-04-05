import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface BrandSettings {
  businessName: string;
  contactEmail: string;
  websiteUrl: string;
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  fontFamily: string;
  buttonStyle: string;
  emailFooter: string;
}

interface BrandContextType {
  settings: BrandSettings;
  isLoading: boolean;
  updateSettings: (newSettings: Partial<BrandSettings>) => Promise<void>;
}

const defaultSettings: BrandSettings = {
  businessName: "Your Business",
  contactEmail: "contact@yourbusiness.com",
  websiteUrl: "https://yourbusiness.com",
  primaryColor: "#3B82F6",
  secondaryColor: "#10B981",
  logo: "",
  fontFamily: "Inter",
  buttonStyle: "rounded",
  emailFooter: "© 2023 Your Business. All rights reserved.",
};

const BrandContext = createContext<BrandContextType>({
  settings: defaultSettings,
  isLoading: true,
  updateSettings: async () => {},
});

export function BrandProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<BrandSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/brand-settings");
        if (response.ok) {
          const data = await response.json();
          if (Object.keys(data).length > 0) {
            setSettings(data);
          }
        }
      } catch (error) {
        console.error("Error fetching brand settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<BrandSettings>) => {
    try {
      setIsLoading(true);
      const updatedSettings = { ...settings, ...newSettings };
      
      const response = await apiRequest("PUT", "/api/brand-settings", updatedSettings);
      const data = await response.json();
      
      setSettings(data);
      toast({
        title: "Settings updated",
        description: "Your brand settings have been saved successfully.",
      });
    } catch (error) {
      console.error("Error updating brand settings:", error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your brand settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BrandContext.Provider value={{ settings, isLoading, updateSettings }}>
      {children}
    </BrandContext.Provider>
  );
}

export const useBrand = () => useContext(BrandContext);
