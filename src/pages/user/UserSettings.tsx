import { useState } from "react";
import { Settings, Moon, Sun, Monitor } from "lucide-react";
import { toast } from "sonner";

export default function UserSettings() {
  const [theme, setTheme] = useState<"dark" | "light" | "system">(
    () => (localStorage.getItem("user_theme") as any) || "dark"
  );

  const applyTheme = (t: "dark" | "light" | "system") => {
    setTheme(t);
    localStorage.setItem("user_theme", t);
    const root = document.documentElement;
    if (t === "light") {
      root.style.setProperty("--background", "0 0% 98%");
      root.style.setProperty("--foreground", "230 30% 10%");
      root.style.setProperty("--card", "0 0% 100%");
      root.style.setProperty("--card-foreground", "230 30% 10%");
      root.style.setProperty("--secondary", "230 10% 92%");
      root.style.setProperty("--secondary-foreground", "230 20% 20%");
      root.style.setProperty("--muted", "230 10% 94%");
      root.style.setProperty("--muted-foreground", "230 10% 45%");
      root.style.setProperty("--border", "230 10% 88%");
    } else {
      root.style.setProperty("--background", "230 30% 6%");
      root.style.setProperty("--foreground", "230 10% 93%");
      root.style.setProperty("--card", "230 25% 10%");
      root.style.setProperty("--card-foreground", "230 10% 93%");
      root.style.setProperty("--secondary", "230 20% 15%");
      root.style.setProperty("--secondary-foreground", "230 10% 85%");
      root.style.setProperty("--muted", "230 15% 14%");
      root.style.setProperty("--muted-foreground", "230 10% 55%");
      root.style.setProperty("--border", "230 15% 18%");
    }
    toast.success(`Tema ${t === "dark" ? "escuro" : t === "light" ? "claro" : "do sistema"} aplicado`);
  };

  const themes = [
    { key: "dark" as const, label: "Escuro", icon: Moon, desc: "Interface escura, ideal para uso prolongado" },
    { key: "light" as const, label: "Claro", icon: Sun, desc: "Interface clara e luminosa" },
    { key: "system" as const, label: "Sistema", icon: Monitor, desc: "Segue a preferência do dispositivo" },
  ];

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-primary" /> Configurações
        </h2>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Aparência</h3>
          <div className="space-y-2">
            {themes.map((t) => {
              const Icon = t.icon;
              return (
                <button key={t.key} onClick={() => applyTheme(t.key)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                    theme === t.key
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/30 bg-secondary/30"
                  }`}>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    theme === t.key ? "bg-primary/20" : "bg-secondary"
                  }`}>
                    <Icon className={`w-4 h-4 ${theme === t.key ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.label}</p>
                    <p className="text-[10px] text-muted-foreground">{t.desc}</p>
                  </div>
                  {theme === t.key && (
                    <div className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-xs text-primary font-semibold mb-1">DOMINUS AI Ativo</p>
          <p className="text-[10px] text-muted-foreground">
            Seu serviço DOMINUS está funcionando 24/7, protegendo e analisando seus dados em tempo real.
          </p>
        </div>
      </div>
    </div>
  );
}
