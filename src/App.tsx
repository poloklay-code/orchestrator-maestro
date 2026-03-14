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
import ClientsManager from "./pages/ClientsManager";
import ServicesManager from "./pages/ServicesManager";
import GovernancePanel from "./pages/GovernancePanel";
import AuditLog from "./pages/AuditLog";
import AutomationsManager from "./pages/AutomationsManager";
import CopyMasterPanel from "./pages/CopyMasterPanel";
import ProposalsManager from "./pages/ProposalsManager";
import FinancialPanel from "./pages/FinancialPanel";
import CredentialsPanel from "./pages/CredentialsPanel";
import GoogleBusinessPanel from "./pages/GoogleBusinessPanel";
import AssistantChat from "./pages/AssistantChat";
import InstallPanel from "./pages/InstallPanel";
import ApiKeysPanel from "./pages/ApiKeysPanel";
import AgentForgePanel from "./pages/AgentForgePanel";
import AffiliatesManager from "./pages/AffiliatesManager";
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
          <Route path="/dashboard/clients" element={<DashboardLayout><ClientsManager /></DashboardLayout>} />
          <Route path="/dashboard/services" element={<DashboardLayout><ServicesManager /></DashboardLayout>} />
          <Route path="/dashboard/governance" element={<DashboardLayout><GovernancePanel /></DashboardLayout>} />
          <Route path="/dashboard/audit" element={<DashboardLayout><AuditLog /></DashboardLayout>} />
          <Route path="/dashboard/automations" element={<DashboardLayout><AutomationsManager /></DashboardLayout>} />
          <Route path="/dashboard/copymaster" element={<DashboardLayout><CopyMasterPanel /></DashboardLayout>} />
          <Route path="/dashboard/proposals" element={<DashboardLayout><ProposalsManager /></DashboardLayout>} />
          <Route path="/dashboard/financial" element={<DashboardLayout><FinancialPanel /></DashboardLayout>} />
          <Route path="/dashboard/credentials" element={<DashboardLayout><CredentialsPanel /></DashboardLayout>} />
          <Route path="/dashboard/google-business" element={<DashboardLayout><GoogleBusinessPanel /></DashboardLayout>} />
          <Route path="/dashboard/assistant" element={<DashboardLayout><AssistantChat /></DashboardLayout>} />
          <Route path="/dashboard/install" element={<DashboardLayout><InstallPanel /></DashboardLayout>} />
          <Route path="/dashboard/affiliates" element={<DashboardLayout><AffiliatesManager /></DashboardLayout>} />
          <Route path="/dashboard/api-keys" element={<DashboardLayout><ApiKeysPanel /></DashboardLayout>} />
          <Route path="/dashboard/agent-forge" element={<DashboardLayout><AgentForgePanel /></DashboardLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
