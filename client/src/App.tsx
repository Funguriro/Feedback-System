import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Feedback from "@/pages/feedback";
import Templates from "@/pages/templates";
import Forms from "@/pages/forms";
import Settings from "@/pages/settings";

import Sidebar from "@/components/ui/sidebar";

function Router() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="bg-white border-b border-gray-200 flex items-center justify-between px-4 py-3 lg:hidden">
          <div>
            <h1 className="text-xl font-bold">Feedback Sentinel</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 rounded-md hover:bg-gray-100">
              <i className="ri-notification-3-line text-lg"></i>
            </button>
            <button className="p-2 text-gray-600 rounded-md hover:bg-gray-100">
              <i className="ri-question-line text-lg"></i>
            </button>
          </div>
        </div>
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/feedback" component={Feedback} />
            <Route path="/templates" component={Templates} />
            <Route path="/forms" component={Forms} />
            <Route path="/settings" component={Settings} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
