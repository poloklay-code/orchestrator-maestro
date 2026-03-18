import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Auth & Guards
import AuthPage from "./pages/AuthPage";
import AdminRoute from "./components/guards/AdminRoute";
import UserRoute from "./components/guards/UserRoute";

// Layouts
import DashboardShell from "./components/DashboardShell";
import UserShell from "./components/layouts/UserShell";

// Admin pages
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
import AICommandCenter from "./pages/AICommandCenter";
import AIProductionCenter from "./pages/AIProductionCenter";
import WorkflowViewer from "./pages/WorkflowViewer";
import StrategyEngine from "./pages/StrategyEngine";
import ROISimulator from "./pages/ROISimulator";
import CompetitorRadar from "./pages/CompetitorRadar";
import OpportunityDetector from "./pages/OpportunityDetector";
import AutoScaleAI from "./pages/AutoScaleAI";
import ContractsManager from "./pages/ContractsManager";
import ClientRiskAnalyzer from "./pages/ClientRiskAnalyzer";
import AIOperationsVisualizer from "./pages/AIOperationsVisualizer";
import ClientBriefing from "./pages/ClientBriefing";
import LeadManager from "./pages/LeadManager";
import AISalesAgent from "./pages/AISalesAgent";
import DominusAI from "./pages/DominusAI";
import MarketPrediction from "./pages/MarketPrediction";

// User pages
import UserDominus from "./pages/user/UserDominus";
import UserProfile from "./pages/user/UserProfile";
import UserSettings from "./pages/user/UserSettings";
import UserLeads from "./pages/user/UserLeads";
import UserSales from "./pages/user/UserSales";
import UserCampaigns from "./pages/user/UserCampaigns";
import UserReports from "./pages/user/UserReports";
import UserPayments from "./pages/user/UserPayments";
import UserChat from "./pages/user/UserChat";
import UserRequests from "./pages/user/UserRequests";

// Public pages
import LandingPage from "./pages/LandingPage";
import QuizPage from "./pages/QuizPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminRoute>
      <DashboardShell>{children}</DashboardShell>
    </AdminRoute>
  );
}

function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserRoute>
      <UserShell>{children}</UserShell>
    </UserRoute>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<AuthPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/quiz" element={<QuizPage />} />

          {/* ===== USER PANEL (/app/*) ===== */}
          <Route path="/app/dominus" element={<UserLayout><UserDominus /></UserLayout>} />
          <Route path="/app/leads" element={<UserLayout><UserLeads /></UserLayout>} />
          <Route path="/app/sales" element={<UserLayout><UserSales /></UserLayout>} />
          <Route path="/app/campaigns" element={<UserLayout><UserCampaigns /></UserLayout>} />
          <Route path="/app/reports" element={<UserLayout><UserReports /></UserLayout>} />
          <Route path="/app/chat" element={<UserLayout><UserChat /></UserLayout>} />
          <Route path="/app/requests" element={<UserLayout><UserRequests /></UserLayout>} />
          <Route path="/app/payments" element={<UserLayout><UserPayments /></UserLayout>} />
          <Route path="/app/profile" element={<UserLayout><UserProfile /></UserLayout>} />
          <Route path="/app/settings" element={<UserLayout><UserSettings /></UserLayout>} />

          {/* ===== ADMIN PANEL (/admin/*) ===== */}
          <Route path="/admin/dashboard" element={<AdminLayout><DashboardOverview /></AdminLayout>} />
          <Route path="/admin/dominus" element={<AdminLayout><DominusAI /></AdminLayout>} />
          <Route path="/admin/command-center" element={<AdminLayout><AICommandCenter /></AdminLayout>} />
          <Route path="/admin/production" element={<AdminLayout><AIProductionCenter /></AdminLayout>} />
          <Route path="/admin/workflows" element={<AdminLayout><WorkflowViewer /></AdminLayout>} />
          <Route path="/admin/operations" element={<AdminLayout><AIOperationsVisualizer /></AdminLayout>} />
          <Route path="/admin/themes" element={<AdminLayout><Themes /></AdminLayout>} />
          <Route path="/admin/strategy" element={<AdminLayout><StrategyEngine /></AdminLayout>} />
          <Route path="/admin/roi" element={<AdminLayout><ROISimulator /></AdminLayout>} />
          <Route path="/admin/competitors" element={<AdminLayout><CompetitorRadar /></AdminLayout>} />
          <Route path="/admin/opportunities" element={<AdminLayout><OpportunityDetector /></AdminLayout>} />
          <Route path="/admin/auto-scale" element={<AdminLayout><AutoScaleAI /></AdminLayout>} />
          <Route path="/admin/contracts" element={<AdminLayout><ContractsManager /></AdminLayout>} />
          <Route path="/admin/risk" element={<AdminLayout><ClientRiskAnalyzer /></AdminLayout>} />
          <Route path="/admin/briefing" element={<AdminLayout><ClientBriefing /></AdminLayout>} />
          <Route path="/admin/leads" element={<AdminLayout><LeadManager /></AdminLayout>} />
          <Route path="/admin/sales-agent" element={<AdminLayout><AISalesAgent /></AdminLayout>} />
          <Route path="/admin/market-prediction" element={<AdminLayout><MarketPrediction /></AdminLayout>} />
          <Route path="/admin/monitoring" element={<AdminLayout><MonitoringDashboard /></AdminLayout>} />
          <Route path="/admin/memory" element={<AdminLayout><StrategicMemory /></AdminLayout>} />
          <Route path="/admin/integrations" element={<AdminLayout><IntegrationsHub /></AdminLayout>} />
          <Route path="/admin/reports" element={<AdminLayout><ReportsPanel /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><SettingsPanel /></AdminLayout>} />
          <Route path="/admin/clients" element={<AdminLayout><ClientsManager /></AdminLayout>} />
          <Route path="/admin/services" element={<AdminLayout><ServicesManager /></AdminLayout>} />
          <Route path="/admin/governance" element={<AdminLayout><GovernancePanel /></AdminLayout>} />
          <Route path="/admin/audit" element={<AdminLayout><AuditLog /></AdminLayout>} />
          <Route path="/admin/automations" element={<AdminLayout><AutomationsManager /></AdminLayout>} />
          <Route path="/admin/copymaster" element={<AdminLayout><CopyMasterPanel /></AdminLayout>} />
          <Route path="/admin/proposals" element={<AdminLayout><ProposalsManager /></AdminLayout>} />
          <Route path="/admin/financial" element={<AdminLayout><FinancialPanel /></AdminLayout>} />
          <Route path="/admin/credentials" element={<AdminLayout><CredentialsPanel /></AdminLayout>} />
          <Route path="/admin/google-business" element={<AdminLayout><GoogleBusinessPanel /></AdminLayout>} />
          <Route path="/admin/assistant" element={<AdminLayout><AssistantChat /></AdminLayout>} />
          <Route path="/admin/install" element={<AdminLayout><InstallPanel /></AdminLayout>} />
          <Route path="/admin/affiliates" element={<AdminLayout><AffiliatesManager /></AdminLayout>} />
          <Route path="/admin/api-keys" element={<AdminLayout><ApiKeysPanel /></AdminLayout>} />
          <Route path="/admin/agent-forge" element={<AdminLayout><AgentForgePanel /></AdminLayout>} />

          {/* Legacy redirects */}
          <Route path="/dashboard" element={<AdminLayout><DashboardOverview /></AdminLayout>} />
          <Route path="/dashboard/*" element={<AdminLayout><DashboardOverview /></AdminLayout>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
