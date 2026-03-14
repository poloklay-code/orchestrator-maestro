import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import OrchestratorBust from "@/components/OrchestratorBust";
import { useThemeStore } from "@/stores/themeStore";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginWallpaper, slogan } = useThemeStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-background">
      {/* Full wallpaper background */}
      {loginWallpaper && (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${loginWallpaper})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      {/* Dark overlay on wallpaper */}
      {loginWallpaper && (
        <div className="absolute inset-0 z-[1] bg-black/60" />
      )}

      {/* Default gradient overlay (no wallpaper) */}
      {!loginWallpaper && (
        <div className="absolute inset-0 bg-orchestrator z-[1]" />
      )}

      {/* Login Form — Left */}
      <motion.div
        className="relative z-10 flex flex-col justify-center w-full lg:w-[40%] p-8 lg:p-16"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-sm mx-auto w-full space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              AETHER <span className="text-gold-gradient">ORCHESTRATOR</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-2 font-command">
              {slogan || "SOVEREIGN AUTOMATION COMMAND CENTER"}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-display text-muted-foreground uppercase tracking-wider">
                IDENTIFICAÇÃO
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full h-11 px-4 rounded-md bg-secondary/80 backdrop-blur-sm border border-border text-foreground font-body text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                placeholder="operador@aether.cmd"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-display text-muted-foreground uppercase tracking-wider">
                CÓDIGO DE ACESSO
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full h-11 px-4 rounded-md bg-secondary/80 backdrop-blur-sm border border-border text-foreground font-body text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                placeholder="••••••••"
              />
            </div>
            <motion.button
              type="submit"
              className="w-full h-11 rounded-md bg-primary text-primary-foreground font-display text-sm uppercase tracking-wider hover:brightness-110 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              INICIAR SESSÃO
            </motion.button>
          </form>

          <div className="flex items-center gap-2 text-xs text-muted-foreground font-display">
            <span className="h-1.5 w-1.5 rounded-full bg-ai-active glow-pulse" />
            <span>200 IAs OPERACIONAIS — SISTEMA 24/7</span>
          </div>
        </div>
      </motion.div>

      {/* Robot — Right (Desktop) */}
      <div className="hidden lg:flex relative z-10 w-[60%] items-center justify-center">
        <OrchestratorBust size="full" />
      </div>

      {/* Robot — Mobile (Background) */}
      <div className="lg:hidden absolute inset-0 z-[2] flex items-center justify-center opacity-20 pointer-events-none">
        <OrchestratorBust size="full" />
      </div>
    </div>
  );
}
