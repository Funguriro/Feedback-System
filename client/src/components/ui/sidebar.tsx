import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useBrandSettings } from "@/hooks/use-brand-settings";
import { cn } from "@/lib/utils";
import { 
  LucideHome, 
  MessageSquare, 
  Mail, 
  FileText, 
  BarChart2, 
  Settings,
  Menu,
  X,
  Send
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: <LucideHome className="w-5 h-5" /> },
  { href: "/feedback", label: "Feedback", icon: <MessageSquare className="w-5 h-5" /> },
  { href: "/submit-feedback", label: "Submit Feedback", icon: <Send className="w-5 h-5" /> },
  { href: "/templates", label: "Email Templates", icon: <Mail className="w-5 h-5" /> },
  { href: "/forms", label: "Feedback Forms", icon: <FileText className="w-5 h-5" /> },
  { href: "/reports", label: "Reports", icon: <BarChart2 className="w-5 h-5" /> },
  { href: "/settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
];

export default function Sidebar() {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { brandSettings, isLoading } = useBrandSettings();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-40 lg:hidden flex items-center p-2 text-gray-600 rounded-md"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transition-transform transform bg-white border-r border-gray-200 lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <div 
              className="w-8 h-8 rounded-full" 
              style={{ backgroundColor: brandSettings?.primaryColor || "#3B82F6" }}
            ></div>
            <span className="text-lg font-bold">Feedback Sentinel</span>
          </div>
          <button 
            onClick={closeSidebar} 
            className="p-2 rounded-md lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col h-full p-4 space-y-4 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeSidebar}
            >
              <a
                className={cn(
                  "flex items-center px-4 py-2 rounded-md hover:bg-gray-100",
                  location === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700"
                )}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            </Link>
          ))}

          <div className="flex-grow"></div>

          <div className="p-4 mt-6 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Free plan</p>
            <div className="w-full h-2 mt-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary" 
                style={{ 
                  width: "35%", 
                  backgroundColor: brandSettings?.primaryColor || "#3B82F6"
                }}
              ></div>
            </div>
            <p className="mt-2 text-xs text-gray-500">35/100 responses this month</p>
            <a href="#" className="block mt-3 text-xs text-center text-primary font-medium">
              Upgrade Plan
            </a>
          </div>

          <div className="flex items-center px-4 py-2 mt-auto text-gray-600">
            <div className="w-8 h-8 rounded-full bg-gray-300 mr-3"></div>
            <div>
              <p className="text-sm font-medium">John Smith</p>
              <p className="text-xs text-gray-500">Business Owner</p>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
