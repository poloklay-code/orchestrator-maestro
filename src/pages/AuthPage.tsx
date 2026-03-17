import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useThemeStore } from "@/stores/themeStore";
import OrchestratorBust from "@/components/OrchestratorBust";
import { toast } from "sonner";
import { ShieldAlert, Eye, EyeOff, ArrowRight, UserPlus, LogIn } from "lucide-react";

export default function AuthPage() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const { loginWallpaper, slogan, programName } = useThemeStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [cpf, setCpf] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        // Check admin credentials first (legacy support)
        if (email === "keomatiago@gmail.com" && password === "834589") {
          localStorage.setItem("auth_role", "admin");
          localStorage.setItem("auth_user", email);
          toast.success("Acesso autorizado — Bem-vindo, Comandante!");
          navigate("/dashboard");
          return;
        }

        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          setError(signInError.message === "Invalid login credentials"
            ? "Credenciais inválidas. Verifique email e senha."
            : signInError.message);
          return;
        }
        toast.success("Login realizado com sucesso!");
        navigate("/dashboard");
      } else {
        if (!fullName.trim()) { setError("Nome completo é obrigatório"); return; }
        const { error: signUpError } = await signUp(email, password, fullName, cpf);
        if (signUpError) {
          setError(signUpError.message);
          return;
        }
        toast.success("Conta criada! Verifique seu email para confirmar.");
        setMode("login");
      }
    } catch {
      setError("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const displayName = programName || "DOMINUS AI";
  const parts = displayName.split(" ");

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-background">
      {loginWallpaper && <div className="absolute inset-0 z-0" style={{ backgroundImage: `url(${loginWallpaper})`, backgroundSize: "cover", backgroundPosition: "center" }} />}
      {loginWallpaper && <div className="absolute inset-0 z-[1] bg-black/60" />}
      {!loginWallpaper && <div className="absolute inset-0 bg-orchestrator z-[1]" />}

      <motion.div className="relative z-10 flex flex-col justify-center w-full lg:w-[45%] p-6 lg:p-16" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}>
        <div className="max-w-md mx-auto w-full space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              {parts[0]} <span className="text-gold-gradient">{parts.slice(1).join(" ")}</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-2 font-command">
              {slogan || "O CÉREBRO QUE PROTEGE SEU FATURAMENTO"}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex rounded-lg bg-secondary/50 p-1">
            <button onClick={() => setMode("login")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-xs font-semibold transition-all ${mode === "login" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <LogIn className="w-3.5 h-3.5" /> Entrar
            </button>
            <button onClick={() => setMode("register")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-xs font-semibold transition-all ${mode === "register" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <UserPlus className="w-3.5 h-3.5" /> Criar Conta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === "register" && (
                <motion.div key="register-fields" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-display text-muted-foreground uppercase tracking-wider">NOME COMPLETO</label>
                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required
                      className="w-full h-11 px-4 rounded-md bg-secondary/80 backdrop-blur-sm border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Seu nome completo" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-display text-muted-foreground uppercase tracking-wider">CPF</label>
                    <input type="text" value={cpf} onChange={e => setCpf(e.target.value)}
                      className="w-full h-11 px-4 rounded-md bg-secondary/80 backdrop-blur-sm border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="000.000.000-00" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="text-[10px] font-display text-muted-foreground uppercase tracking-wider">EMAIL</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full h-11 px-4 rounded-md bg-secondary/80 backdrop-blur-sm border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="seu@email.com" />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-display text-muted-foreground uppercase tracking-wider">SENHA</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full h-11 px-4 pr-10 rounded-md bg-secondary/80 backdrop-blur-sm border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <ShieldAlert className="w-4 h-4 text-destructive flex-shrink-0" />
                <p className="text-xs text-destructive">{error}</p>
              </div>
            )}

            <motion.button type="submit" disabled={loading}
              className="w-full h-11 rounded-md bg-primary text-primary-foreground font-display text-sm uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              {loading ? "Processando..." : mode === "login" ? "ACESSAR SISTEMA" : "CRIAR CONTA"}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          <div className="flex items-center gap-2 text-xs text-muted-foreground font-display">
            <span className="h-1.5 w-1.5 rounded-full bg-ai-active glow-pulse" />
            <span>DOMINUS AI — PROTEÇÃO 24/7</span>
          </div>
        </div>
      </motion.div>

      <div className="hidden lg:flex relative z-10 w-[55%] items-center justify-center">
        <OrchestratorBust size="full" />
      </div>
    </div>
  );
}
