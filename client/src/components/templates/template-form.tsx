import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { type EmailTemplate } from "@shared/schema";
import { useBrandSettings } from "@/hooks/use-brand-settings";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const templateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  status: z.enum(["active", "draft"]),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

interface TemplateFormProps {
  template?: EmailTemplate;
  onSubmit: (data: TemplateFormValues) => void;
  isLoading?: boolean;
}

export function TemplateForm({ 
  template, 
  onSubmit, 
  isLoading = false 
}: TemplateFormProps) {
  const { brandSettings } = useBrandSettings();
  const [activeTab, setActiveTab] = useState("edit");
  
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: template?.name || "",
      subject: template?.subject || "",
      content: template?.content || 
        `Hi [Customer Name],\n\nThank you for your recent [interaction/purchase] with ${brandSettings?.businessName || "[Your Business]"}.\n\nWe'd love to hear your feedback to help us improve our service.\n\n[Share Feedback Button]\n\nRegards,\nThe ${brandSettings?.businessName || "[Your Business]"} Team`,
      status: template?.status || "draft",
    },
  });
  
  const handleSubmit = (data: TemplateFormValues) => {
    onSubmit(data);
  };
  
  const previewContent = form.watch("content").replace(
    "[Share Feedback Button]",
    `<div class="mt-3 text-center">
      <button 
        class="px-4 py-1 text-white rounded-md text-sm"
        style="background-color: ${brandSettings?.primaryColor || "#3B82F6"}"
      >
        Share Feedback
      </button>
    </div>`
  );
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Post-Purchase Follow-up" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select template status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Subject</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g. How was your recent purchase?" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="edit">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your email content here..."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-2 text-xs text-gray-500">
              <p>Available placeholders:</p>
              <ul className="list-disc list-inside mt-1">
                <li>[Customer Name] - Customer's name</li>
                <li>[Share Feedback Button] - Button that links to your feedback form</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="preview">
            <div className="border border-gray-200 rounded-md p-4 min-h-[200px] bg-white">
              <div className="mb-2 pb-2 border-b">
                <div className="text-sm font-medium text-gray-600">
                  Subject: {form.watch("subject")}
                </div>
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-wrap" 
                dangerouslySetInnerHTML={{ 
                  __html: previewContent.replace(/\n/g, "<br />") 
                }} 
              />
              {brandSettings?.emailFooter && (
                <div className="mt-6 pt-2 border-t text-xs text-gray-500">
                  {brandSettings.emailFooter}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              if (activeTab === "preview") {
                setActiveTab("edit");
              } else {
                // Handle cancel - close dialog
                form.reset();
              }
            }}
          >
            {activeTab === "preview" ? "Back to Edit" : "Cancel"}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Template"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
