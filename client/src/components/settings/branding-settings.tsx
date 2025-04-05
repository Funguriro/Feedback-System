import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useBrandSettings } from "@/hooks/use-brand-settings";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/color-picker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";

const brandSettingsSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  contactEmail: z.string().email("Invalid email address"),
  websiteUrl: z.string().url("Invalid URL"),
  primaryColor: z.string().min(1, "Primary color is required"),
  secondaryColor: z.string().min(1, "Secondary color is required"),
  fontFamily: z.string().min(1, "Font family is required"),
  buttonStyle: z.string().min(1, "Button style is required"),
  emailFooter: z.string().min(1, "Email footer is required"),
});

type BrandSettingsValues = z.infer<typeof brandSettingsSchema>;

export function BrandingSettings() {
  const { brandSettings, updateBrandSettings, isLoading, isUpdating } = useBrandSettings();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm<BrandSettingsValues>({
    resolver: zodResolver(brandSettingsSchema),
    defaultValues: {
      businessName: brandSettings?.businessName || "Your Business",
      contactEmail: brandSettings?.contactEmail || "contact@yourbusiness.com",
      websiteUrl: brandSettings?.websiteUrl || "https://yourbusiness.com",
      primaryColor: brandSettings?.primaryColor || "#3B82F6",
      secondaryColor: brandSettings?.secondaryColor || "#10B981",
      fontFamily: brandSettings?.fontFamily || "Inter",
      buttonStyle: brandSettings?.buttonStyle || "rounded",
      emailFooter: brandSettings?.emailFooter || "© 2023 Your Business. All rights reserved.",
    },
  });

  const onSubmit = (data: BrandSettingsValues) => {
    updateBrandSettings({
      ...data,
      logo: logoPreview || brandSettings?.logo || "",
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, we would upload the file to a server
      // For now, just create a data URL for preview
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          <div className="h-12 bg-gray-100 rounded"></div>
          <div className="h-12 bg-gray-100 rounded"></div>
          <div className="h-12 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Brand Settings</h2>
        <p className="text-gray-600 text-sm mb-6">
          Customize how your feedback forms and emails appear to customers.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Business Details */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Business Details</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="websiteUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <Input type="url" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Brand Identity */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Brand Identity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FormLabel>Logo</FormLabel>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <div className="w-24 h-24 mx-auto mb-3 rounded-md flex items-center justify-center overflow-hidden bg-gray-200">
                      {logoPreview || brandSettings?.logo ? (
                        <img 
                          src={logoPreview || brandSettings?.logo} 
                          alt="Logo preview" 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Upload className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="relative"
                      onClick={() => document.getElementById('logo-upload')?.click()}
                    >
                      Upload Logo
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleLogoUpload}
                      />
                    </Button>
                    <p className="mt-2 text-xs text-gray-500">Recommended size: 200x200px</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="primaryColor"
                    render={({ field }) => (
                      <ColorPicker
                        label="Primary Color"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="secondaryColor"
                    render={({ field }) => (
                      <ColorPicker
                        label="Secondary Color"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Font Settings */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Typography</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="fontFamily"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Font Family</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select font" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                          <SelectItem value="Open Sans">Open Sans</SelectItem>
                          <SelectItem value="Poppins">Poppins</SelectItem>
                          <SelectItem value="Lato">Lato</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="buttonStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Button Style</FormLabel>
                      <div className="grid grid-cols-3 gap-3">
                        <div 
                          className={`border rounded-md p-3 flex items-center justify-center cursor-pointer ${
                            field.value === 'rounded' ? 'border-primary' : 'border-gray-200'
                          }`}
                          onClick={() => field.onChange('rounded')}
                        >
                          <button className="px-3 py-1 bg-primary text-white text-sm rounded-md">
                            Rounded
                          </button>
                        </div>
                        <div 
                          className={`border rounded-md p-3 flex items-center justify-center cursor-pointer ${
                            field.value === 'square' ? 'border-primary' : 'border-gray-200'
                          }`}
                          onClick={() => field.onChange('square')}
                        >
                          <button className="px-3 py-1 bg-gray-200 text-gray-700 text-sm">
                            Square
                          </button>
                        </div>
                        <div 
                          className={`border rounded-md p-3 flex items-center justify-center cursor-pointer ${
                            field.value === 'outline' ? 'border-primary' : 'border-gray-200'
                          }`}
                          onClick={() => field.onChange('outline')}
                        >
                          <button className="px-3 py-1 bg-white text-gray-700 text-sm border border-gray-300">
                            Outline
                          </button>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Email Footer */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Email Footer</h3>
              <FormField
                control={form.control}
                name="emailFooter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Footer Text</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="Enter your email footer text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Save Button */}
            <div className="pt-6">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
