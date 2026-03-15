import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import OrchestratorBust from "@/components/OrchestratorBust";
import { useThemeStore } from "@/stores/themeStore";
import { toast } from "sonner";
import { ShieldAlert } from "lucide-react";

const ADMIN_EMAIL = "keomatiago@gmail.com";
const ADMIN_PASS = "834589";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { loginWallpaper, slogan, programName } = useThemeStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      localStorage.setItem("auth_role", "admin");
      localStorage.setItem("auth_user", email);
      toast.success("Acesso autorizado — Bem-vindo, Comandante!");
      navigate("/dashboard");
    } else {
      // Check stored users
      const users = JSON.parse(localStorage.getItem("app_users") || "[]");
      const user = users.find((u: any) => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem("auth_role", "user");
        localStorage.setItem("auth_user", email);
        localStorage.setItem("auth_user_name", user.name);
        toast.success(`Acesso autorizado — Bem-vindo, ${user.name}!`);
        navigate("/dashboard");
      } else {
        setError("Credenciais inválidas. Acesso restrito.");
        toast.error("Acesso negado — Credenciais inválidas");
      }
    }
  };

  const displayName = programName || "AETHER ORCHESTRATOR";
  const parts = displayName.split(" ");
  const firstWord = parts[0] || "";
  const rest = parts.slice(1).join(" ");

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-background">
      {loginWallpaper && (
        <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${loginWallpaper})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      )}
      {loginWallpaper && <div className="absolute inset-0 z-[1] bg-black/60" />}
      {!loginWallpaper && <div className="absolute inset-0 bg-orchestrator z-[1]" />}

      <motion.div className="relative z-10 flex flex-col justify-center w-full lg:w-[40%] p-8 lg:p-16" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
        <div className="max-w-sm mx-auto w-full space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              {firstWord} <span className="text-gold-gradient">{rest}</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-2 font-command">
              {slogan || "SOVEREIGN AUTOMATION COMMAND CENTER"}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-display text-muted-foreground uppercase tracking-wider">IDENTIFICAÇÃO</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full h-11 px-4 rounded-md bg-secondary/80 backdrop-blur-sm border border-border text-foreground font-body text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                placeholder="seu@email.com" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-display text-muted-foreground uppercase tracking-wider">CÓDIGO DE ACESSO</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full h-11 px-4 rounded-md bg-secondary/80 backdrop-blur-sm border border-border text-foreground font-body text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                placeholder="••••••••" />
            </div>
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <ShieldAlert className="w-4 h-4 text-destructive flex-shrink-0" />
                <p className="text-xs text-destructive">{error}</p>
              </div>
            )}
            <motion.button type="submit" className="w-full h-11 rounded-md bg-primary text-primary-foreground font-display text-sm uppercase tracking-wider hover:brightness-110 transition-all" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              INICIAR SESSÃO
            </motion.button>
          </form>

          <div className="flex items-center gap-2 text-xs text-muted-foreground font-display">
            <span className="h-1.5 w-1.5 rounded-full bg-ai-active glow-pulse" />
            <span>ACESSO PRIVADO — SISTEMA 24/7</span>
          </div>
        </div>
      </motion.div>

      <div className="hidden lg:flex relative z-10 w-[60%] items-center justify-center">
        <OrchestratorBust size="full" />
      </div>

      <div className="lg:hidden absolute inset-0 z-[2] flex items-center justify-center opacity-20 pointer-events-none">
        <OrchestratorBust size="full" />
      </div>
    </div>
  );
}
