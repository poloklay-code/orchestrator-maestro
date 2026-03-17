import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Brain, User, Settings, LogOut, Menu, X, Bell, Moon, Sun } from "lucide-react";
import OrchestratorBust from "@/components/OrchestratorBust";
import { useAuth } from "@/hooks/useAuth";
import { useThemeStore } from "@/stores/themeStore";

const userNav = [
  { href: "/app/dominus", label: "DOMINUS AI", icon: Brain },
  { href: "/app/profile", label: "Meu Perfil", icon: User },
  { href: "/app/settings", label: "Configurações", icon: Settings },
];

export default function UserShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const { signOut } = useAuth();
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
      {mobileOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:relative z-50 h-full flex flex-col border-r border-border bg-card w-60 transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex items-center gap-3 p-4 border-b border-border min-h-[64px]">
          <OrchestratorBust size="small" className="w-8 h-8 flex-shrink-0" />
          <div className="overflow-hidden">
            <h2 className="text-sm font-bold text-foreground truncate font-display">{programName}</h2>
            <p className="text-[10px] font-semibold text-primary truncate">Painel do Usuário</p>
          </div>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden ml-auto text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {userNav.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} to={item.href} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-2 border-t border-border space-y-1">
          <div className="px-3 py-1.5">
            <span className="text-[9px] px-2 py-0.5 bg-accent/10 text-accent rounded-full font-semibold">USUÁRIO</span>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all w-full">
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden text-muted-foreground hover:text-foreground">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-sm font-semibold text-foreground">
                {userNav.find((n) => pathname === n.href)?.label || "DOMINUS AI"}
              </h1>
              <p className="text-[10px] font-display text-muted-foreground">Seu painel inteligente</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-display">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-muted-foreground hidden sm:inline">DOMINUS Ativo</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-background">{children}</main>
      </div>
    </div>
  );
}
