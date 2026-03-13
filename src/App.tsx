import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Login from "./pages/Login";
import DashboardShell from "./components/DashboardShell";
import DashboardOverview from "./pages/DashboardOverview";
import MonitoringDashboard from "./pages/MonitoringDashboard";
import StrategicMemory from "./pages/StrategicMemory";
import IntegrationsHub from "./pages/IntegrationsHub";
import ReportsPanel from "./pages/ReportsPanel";
import SettingsPanel from "./pages/SettingsPanel";
import Themes from "./pages/Themes";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<DashboardLayout><DashboardOverview /></DashboardLayout>} />
          <Route path="/dashboard/monitoring" element={<DashboardLayout><MonitoringDashboard /></DashboardLayout>} />
          <Route path="/dashboard/memory" element={<DashboardLayout><StrategicMemory /></DashboardLayout>} />
          <Route path="/dashboard/integrations" element={<DashboardLayout><IntegrationsHub /></DashboardLayout>} />
          <Route path="/dashboard/reports" element={<DashboardLayout><ReportsPanel /></DashboardLayout>} />
          <Route path="/dashboard/settings" element={<DashboardLayout><SettingsPanel /></DashboardLayout>} />
          <Route path="/themes" element={<Themes />} />
          {/* Placeholder pages for modules in development */}
          <Route path="/dashboard/clients" element={<DashboardLayout><PlaceholderPage /></DashboardLayout>} />
          <Route path="/dashboard/services" element={<DashboardLayout><PlaceholderPage /></DashboardLayout>} />
          <Route path="/dashboard/governance" element={<DashboardLayout><PlaceholderPage /></DashboardLayout>} />
          <Route path="/dashboard/audit" element={<DashboardLayout><PlaceholderPage /></DashboardLayout>} />
          <Route path="/dashboard/automations" element={<DashboardLayout><PlaceholderPage /></DashboardLayout>} />
          <Route path="/dashboard/affiliates" element={<DashboardLayout><PlaceholderPage /></DashboardLayout>} />
          <Route path="/dashboard/copymaster" element={<DashboardLayout><PlaceholderPage /></DashboardLayout>} />
          <Route path="/dashboard/proposals" element={<DashboardLayout><PlaceholderPage /></DashboardLayout>} />
          <Route path="/dashboard/financial" element={<DashboardLayout><PlaceholderPage /></DashboardLayout>} />
          <Route path="/dashboard/api-keys" element={<DashboardLayout><PlaceholderPage /></DashboardLayout>} />
          <Route path="/dashboard/credentials" element={<DashboardLayout><PlaceholderPage /></DashboardLayout>} />
          <Route path="/dashboard/google-business" element={<DashboardLayout><PlaceholderPage /></DashboardLayout>} />
          <Route path="/dashboard/agent-forge" element={<DashboardLayout><PlaceholderPage /></DashboardLayout>} />
          <Route path="/dashboard/assistant" element={<DashboardLayout><PlaceholderPage /></DashboardLayout>} />
          <Route path="/dashboard/install" element={<DashboardLayout><PlaceholderPage /></DashboardLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
