import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrandingSettings } from "@/components/settings/branding-settings";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("branding");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600">Manage your account and application preferences</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-gray-200">
            <TabsList className="h-auto p-0">
              <TabsTrigger 
                value="branding" 
                className="px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
              >
                Branding
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
              >
                Notifications
              </TabsTrigger>
              <TabsTrigger 
                value="team" 
                className="px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
              >
                Team Members
              </TabsTrigger>
              <TabsTrigger 
                value="integrations" 
                className="px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
              >
                Integrations
              </TabsTrigger>
              <TabsTrigger 
                value="billing" 
                className="px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
              >
                Billing
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="branding" className="p-0 border-0">
            <BrandingSettings />
          </TabsContent>
          
          <TabsContent value="notifications" className="p-6">
            <div className="text-center py-12">
              <p className="text-gray-500">Notification settings will be available soon</p>
            </div>
          </TabsContent>
          
          <TabsContent value="team" className="p-6">
            <div className="text-center py-12">
              <p className="text-gray-500">Team management will be available soon</p>
            </div>
          </TabsContent>
          
          <TabsContent value="integrations" className="p-6">
            <div className="text-center py-12">
              <p className="text-gray-500">Integrations will be available soon</p>
            </div>
          </TabsContent>
          
          <TabsContent value="billing" className="p-6">
            <div className="text-center py-12">
              <p className="text-gray-500">Billing management will be available soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
