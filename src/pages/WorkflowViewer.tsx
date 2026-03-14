import { useState } from "react";
import {
  GitBranch, Play, Pause, CheckCircle2, AlertTriangle, Clock,
  Webhook, Users, MessageSquare, Mail, Database, Zap, Filter,
  ArrowDown, Globe, ShoppingCart, Phone, BarChart3
} from "lucide-react";

interface WorkflowStep {
  id: string;
  label: string;
  icon: typeof Webhook;
  status: "completed" | "running" | "pending";
}

interface Workflow {
  id: string;
  name: string;
  platform: string;
  status: "active" | "paused" | "error";
  lastRun: string;
  executions: number;
  successRate: number;
  steps: WorkflowStep[];
  client: string;
}

const workflows: Workflow[] = [
  {
    id: "1", name: "Captura → CRM → WhatsApp", platform: "n8n", status: "active",
    lastRun: "2 min atrás", executions: 1247, successRate: 99.2, client: "Tech Solutions",
    steps: [
      { id: "s1", label: "Webhook Recebe Lead", icon: Webhook, status: "completed" },
      { id: "s2", label: "Valida Dados", icon: Filter, status: "completed" },
      { id: "s3", label: "Salva no CRM", icon: Database, status: "completed" },
      { id: "s4", label: "Envia WhatsApp", icon: MessageSquare, status: "completed" },
      { id: "s5", label: "Notifica Equipe", icon: Users, status: "completed" },
    ],
  },
  {
    id: "2", name: "Email Nurture Sequence", platform: "Make", status: "active",
    lastRun: "15 min atrás", executions: 856, successRate: 97.8, client: "StartupXYZ",
    steps: [
      { id: "s1", label: "Trigger: Novo Cadastro", icon: Users, status: "completed" },
      { id: "s2", label: "Email Boas-Vindas", icon: Mail, status: "completed" },
      { id: "s3", label: "Espera 2 Dias", icon: Clock, status: "running" },
      { id: "s4", label: "Email Valor", icon: Mail, status: "pending" },
      { id: "s5", label: "Email Oferta", icon: ShoppingCart, status: "pending" },
    ],
  },
  {
    id: "3", name: "Chatbot → Qualificação → Venda", platform: "ManyChat", status: "active",
    lastRun: "5 min atrás", executions: 2341, successRate: 94.5, client: "E-commerce Plus",
    steps: [
      { id: "s1", label: "Mensagem Recebida", icon: MessageSquare, status: "completed" },
      { id: "s2", label: "IA Qualifica Lead", icon: Zap, status: "completed" },
      { id: "s3", label: "Classifica Interesse", icon: Filter, status: "completed" },
      { id: "s4", label: "Redireciona Vendedor", icon: Phone, status: "running" },
    ],
  },
  {
    id: "4", name: "Relatório Automático Semanal", platform: "n8n", status: "active",
    lastRun: "1h atrás", executions: 52, successRate: 100, client: "Todos",
    steps: [
      { id: "s1", label: "Cron: Segunda 8h", icon: Clock, status: "completed" },
      { id: "s2", label: "Coleta Métricas", icon: BarChart3, status: "completed" },
      { id: "s3", label: "Gera Relatório PDF", icon: Globe, status: "completed" },
      { id: "s4", label: "Envia por Email", icon: Mail, status: "completed" },
    ],
  },
  {
    id: "5", name: "Monitoramento de Anúncios", platform: "Zapier", status: "paused",
    lastRun: "3h atrás", executions: 389, successRate: 96.1, client: "Agência Digital",
    steps: [
      { id: "s1", label: "Verifica Meta Ads", icon: Globe, status: "completed" },
      { id: "s2", label: "Analisa ROAS", icon: BarChart3, status: "completed" },
      { id: "s3", label: "Alerta se ROAS < 2", icon: AlertTriangle, status: "pending" },
      { id: "s4", label: "Pausa Campanha", icon: Pause, status: "pending" },
    ],
  },
];

const platformColors: Record<string, string> = {
  n8n: "bg-orange-500/10 text-orange-400",
  Make: "bg-purple-500/10 text-purple-400",
  ManyChat: "bg-blue-500/10 text-blue-400",
  Zapier: "bg-amber-500/10 text-amber-400",
  Automa: "bg-green-500/10 text-green-400",
};

export default function WorkflowViewer() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>(workflows[0].id);
  const selected = workflows.find((w) => w.id === selectedWorkflow)!;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <GitBranch className="w-7 h-7 text-primary" /> Workflow Viewer
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Visualizador completo de automações — n8n, Make, ManyChat, Zapier, Automa</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{workflows.length}</p>
          <p className="text-[10px] text-muted-foreground">Workflows Ativos</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-green-400">{workflows.reduce((a, w) => a + w.executions, 0).toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">Total Execuções</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-accent">{(workflows.reduce((a, w) => a + w.successRate, 0) / workflows.length).toFixed(1)}%</p>
          <p className="text-[10px] text-muted-foreground">Taxa de Sucesso</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-primary">5</p>
          <p className="text-[10px] text-muted-foreground">Plataformas</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Workflow List */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Workflows</h3>
          {workflows.map((w) => (
            <button
              key={w.id}
              onClick={() => setSelectedWorkflow(w.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedWorkflow === w.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${platformColors[w.platform] || "bg-secondary text-muted-foreground"}`}>{w.platform}</span>
                <span className={`w-2 h-2 rounded-full ${w.status === "active" ? "bg-green-400" : w.status === "paused" ? "bg-amber-400" : "bg-destructive"}`} />
              </div>
              <p className="text-sm font-semibold text-foreground">{w.name}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{w.client} • {w.executions} execuções</p>
            </button>
          ))}
        </div>

        {/* Flow Visualization */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">{selected.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">Última execução: {selected.lastRun} • {selected.successRate}% sucesso</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all">
                <Play className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all">
                <Pause className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Visual Flow */}
          <div className="flex flex-col items-center gap-2">
            {selected.steps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div key={step.id} className="w-full">
                  <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    step.status === "completed" ? "border-green-500/30 bg-green-500/5" :
                    step.status === "running" ? "border-primary/30 bg-primary/5 animate-pulse" :
                    "border-border bg-secondary/20"
                  }`}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      step.status === "completed" ? "bg-green-500/10" :
                      step.status === "running" ? "bg-primary/10" : "bg-secondary"
                    }`}>
                      <StepIcon className={`w-5 h-5 ${
                        step.status === "completed" ? "text-green-400" :
                        step.status === "running" ? "text-primary" : "text-muted-foreground"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{step.label}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {step.status === "completed" ? "✓ Concluído" : step.status === "running" ? "⟳ Executando..." : "◦ Pendente"}
                      </p>
                    </div>
                    {step.status === "completed" && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                  </div>
                  {idx < selected.steps.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ArrowDown className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
