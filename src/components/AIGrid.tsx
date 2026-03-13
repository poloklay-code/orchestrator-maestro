import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface AIAgent {
  id: number;
  name: string;
  status: "processing" | "standby" | "idle";
  task: string;
  category: string;
}

const AI_CATEGORIES = [
  "Segurança", "Análise", "Automação", "Dados", "Rede",
  "Storage", "Deploy", "Monitor", "Backup", "Sync",
  "Cache", "Auth", "Logs", "API", "ML",
  "NLP", "Vision", "Audio", "Search", "Optimize"
];

const AI_TASKS = [
  "Escaneando rede...", "Otimizando cache...", "Analisando dados...",
  "Monitorando sistema...", "Sincronizando...", "Processando ML...",
  "Backup em andamento...", "Compressão ativa...", "Verificando auth...",
  "Indexando busca...", "Balanceando carga...", "Compilando assets...",
  "Encriptando dados...", "Validando inputs...", "Gerando relatório..."
];

function generateAgents(): AIAgent[] {
  return Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    name: `AETHER-${String(i + 1).padStart(3, "0")}`,
    status: Math.random() > 0.3 ? "processing" : Math.random() > 0.5 ? "standby" : "idle",
    task: AI_TASKS[Math.floor(Math.random() * AI_TASKS.length)],
    category: AI_CATEGORIES[i % AI_CATEGORIES.length],
  }));
}

export default function AIGrid() {
  const [agents, setAgents] = useState<AIAgent[]>(generateAgents);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev =>
        prev.map(a => ({
          ...a,
          status: Math.random() > 0.25 ? "processing" : Math.random() > 0.5 ? "standby" : "idle",
          task: AI_TASKS[Math.floor(Math.random() * AI_TASKS.length)],
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getColor = useCallback((status: string) => {
    switch (status) {
      case "processing": return "bg-ai-processing";
      case "standby": return "bg-ai-active";
      default: return "bg-ai-standby";
    }
  }, []);

  const activeCount = agents.filter(a => a.status === "processing").length;
  const standbyCount = agents.filter(a => a.status === "standby").length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="flex gap-6 font-display text-sm">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-ai-processing glow-pulse" />
          <span className="text-muted-foreground">ATIVAS:</span>
          <span className="text-foreground">{activeCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-ai-active" />
          <span className="text-muted-foreground">STANDBY:</span>
          <span className="text-foreground">{standbyCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-ai-standby" />
          <span className="text-muted-foreground">IDLE:</span>
          <span className="text-foreground">{200 - activeCount - standbyCount}</span>
        </div>
      </div>

      {/* Neural Grid */}
      <div className="grid grid-cols-20 gap-[2px] p-4 card-aether rounded-lg relative">
        {agents.map(agent => (
          <motion.button
            key={agent.id}
            className={`aspect-square rounded-[2px] ${getColor(agent.status)} transition-colors relative`}
            onMouseEnter={() => setHoveredId(agent.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => setSelectedAgent(agent)}
            whileHover={{ scale: 1.8, zIndex: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              animation: agent.status === "processing" ? "grid-pulse 2s ease-in-out infinite" : undefined,
              animationDelay: `${(agent.id % 20) * 0.1}s`,
            }}
          />
        ))}

        {/* Tooltip on hover */}
        {hoveredId && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 glass-surface px-3 py-1.5 rounded text-xs font-display pointer-events-none z-20">
            {agents[hoveredId - 1]?.name} — {agents[hoveredId - 1]?.task}
          </div>
        )}
      </div>

      {/* Selected Agent Detail */}
      {selectedAgent && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-aether rounded-lg p-4 space-y-2"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm text-foreground">{selectedAgent.name}</h3>
            <button onClick={() => setSelectedAgent(null)} className="text-muted-foreground hover:text-foreground text-xs">✕</button>
          </div>
          <div className="grid grid-cols-3 gap-4 text-xs font-display">
            <div>
              <span className="text-muted-foreground block">STATUS</span>
              <span className="text-foreground uppercase">{selectedAgent.status}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">CATEGORIA</span>
              <span className="text-foreground">{selectedAgent.category}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">TAREFA</span>
              <span className="text-foreground">{selectedAgent.task}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
