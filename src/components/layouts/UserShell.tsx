import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Brain, User, Settings, LogOut, Menu, X, Users, ShoppingCart,
  Megaphone, FileText, CreditCard, MessageCircle, MessageSquarePlus
} from "lucide-react";
import OrchestratorBust from "@/components/OrchestratorBust";
import { useAuth } from "@/hooks/useAuth";
import { useThemeStore } from "@/stores/themeStore";

const userNav = [
  { section: "PRINCIPAL", items: [
    { href: "/app/dominus", label: "Dashboard", icon: Brain },
    { href: "/app/leads", label: "Leads", icon: Users },
    { href: "/app/sales", label: "Vendas", icon: ShoppingCart },
    { href: "/app/campaigns", label: "Campanhas", icon: Megaphone },
  ]},
  { section: "INTELIGÊNCIA", items: [
    { href: "/app/reports", label: "Relatórios", icon: FileText },
    { href: "/app/chat", label: "Chat com IA", icon: MessageCircle },
    { href: "/app/requests", label: "Solicitações", icon: MessageSquarePlus },
  ]},
  { section: "CONTA", items: [
    { href: "/app/payments", label: "Pagamentos", icon: CreditCard },
    { href: "/app/profile", label: "Meu Perfil", icon: User },
    { href: "/app/settings", label: "Configurações", icon: Settings },
  ]},
];

const allItems = userNav.flatMap(s => s.items);

export default function UserShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { programName } = useThemeStore();

  const handleLogout = async () => {
    localStorage.removeItem("auth_role");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_user_name");
    await signOut();
    navigate("/");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {mobileOpen && <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      <aside className={`fixed lg:relative z-50 h-full flex flex-col border-r border-border bg-card w-60 transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex items-center gap-3 p-4 border-b border-border min-h-[64px]">
          <OrchestratorBust size="small" className="w-8 h-8 flex-shrink-0" />
          <div className="overflow-hidden">
            <h2 className="text-sm font-bold text-foreground truncate font-display">{programName}</h2>
            <p className="text-[10px] font-semibold text-primary truncate">Painel do Usuário</p>
          </div>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden ml-auto text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {userNav.map((section) => (
            <div key={section.section} className="mb-2">
              <p className="px-3 py-1.5 text-[9px] font-bold tracking-[0.2em] text-muted-foreground uppercase">{section.section}</p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} to={item.href} onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs transition-all ${
                        isActive ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      }`}>
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-2 border-t border-border space-y-1">
          <div className="px-3 py-1.5">
            <span className="text-[9px] px-2 py-0.5 bg-accent/10 text-accent rounded-full font-semibold">USUÁRIO</span>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all w-full">
            <LogOut className="w-3.5 h-3.5 flex-shrink-0" /><span>Sair</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden text-muted-foreground hover:text-foreground"><Menu className="w-5 h-5" /></button>
            <div>
              <h1 className="text-sm font-semibold text-foreground">
                {allItems.find(n => pathname === n.href)?.label || "DOMINUS AI"}
              </h1>
              <p className="text-[10px] font-display text-muted-foreground">Seu painel inteligente</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-display">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-muted-foreground hidden sm:inline">DOMINUS Ativo</span>
            </div>
            <Link to="/app/chat" className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-primary text-xs hover:bg-primary/20 transition-all">
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Chat IA</span>
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-background">{children}</main>
      </div>
    </div>
  );
}
