import { useLocation } from "react-router-dom";
import { Construction } from "lucide-react";

export default function PlaceholderPage() {
  const { pathname } = useLocation();
  const pageName = pathname.split("/").pop()?.replace(/-/g, " ") || "Pagina";

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
        <Construction className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-xl font-bold text-foreground capitalize">{pageName}</h2>
      <p className="text-sm text-muted-foreground max-w-md">
        Este modulo esta sendo construido pelas 200 IAs autonomas do ORQUESTRADOR MAESTRO.
        Em breve estara totalmente operacional.
      </p>
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-display">
        <span className="w-2 h-2 rounded-full bg-ai-processing glow-pulse" />
        EM DESENVOLVIMENTO
      </div>
    </div>
  );
}
