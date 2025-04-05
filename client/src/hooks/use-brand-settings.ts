import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export type BrandSettings = {
  id?: number;
  businessName: string;
  contactEmail: string;
  websiteUrl: string;
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  fontFamily: string;
  buttonStyle: string;
  emailFooter: string;
  businessId?: number;
};

export function useBrandSettings() {
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery<BrandSettings>({
    queryKey: ['/api/brand-settings'],
  });

  const updateMutation = useMutation({
    mutationFn: async (settings: Partial<BrandSettings>) => {
      const res = await apiRequest('PUT', '/api/brand-settings', settings);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/brand-settings'] });
      toast({
        title: "Settings updated",
        description: "Your brand settings have been saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Failed to update settings",
        description: "There was a problem saving your brand settings",
        variant: "destructive",
      });
    }
  });

  return {
    brandSettings: data,
    isLoading,
    error,
    updateBrandSettings: updateMutation.mutate,
    isUpdating: updateMutation.isPending
  };
}
