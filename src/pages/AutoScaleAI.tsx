import { useState } from "react";
import {
  Rocket, TrendingUp, DollarSign, AlertTriangle, CheckCircle2,
  Pause, Play, Shield, BarChart3, Zap, Clock, ArrowUpRight, Target
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Campaign {
  id: string;
  name: string;
  client: string;
  platform: string;
  budget: number;
  originalBudget: number;
  roas: number;
  leads: number;
  cpl: number;
  status: "scaling" | "monitoring" | "paused" | "limit_reached";
  scaleHistory: { date: string; budget: number; roas: number }[];
  autoScaleEnabled: boolean;
}

const campaigns: Campaign[] = [
  {
    id: "1", name: "Campanha Lead Gen - SaaS", client: "Tech Solutions", platform: "Google Ads",
    budget: 8500, originalBudget: 3000, roas: 5.2, leads: 234, cpl: 12.5, status: "scaling", autoScaleEnabled: true,
    scaleHistory: [
      { date: "Dia 1", budget: 3000, roas: 3.1 }, { date: "Dia 5", budget: 3600, roas: 3.8 },
      { date: "Dia 10", budget: 4320, roas: 4.2 }, { date: "Dia 15", budget: 5184, roas: 4.7 },
      { date: "Dia 20", budget: 6220, roas: 5.0 }, { date: "Dia 25", budget: 7464, roas: 5.2 },
      { date: "Dia 30", budget: 8500, roas: 5.2 },
    ],
  },
  {
    id: "2", name: "E-commerce Fashion", client: "Moda Fashion", platform: "Meta Ads",
    budget: 12000, originalBudget: 5000, roas: 4.8, leads: 456, cpl: 8.3, status: "scaling", autoScaleEnabled: true,
    scaleHistory: [
      { date: "Dia 1", budget: 5000, roas: 2.5 }, { date: "Dia 7", budget: 6000, roas: 3.2 },
      { date: "Dia 14", budget: 7200, roas: 3.9 }, { date: "Dia 21", budget: 8640, roas: 4.3 },
      { date: "Dia 28", budget: 10368, roas: 4.6 }, { date: "Dia 30", budget: 12000, roas: 4.8 },
    ],
  },
  {
    id: "3", name: "Clínica - Agendamentos", client: "Clínica Saúde", platform: "Google Ads",
    budget: 3000, originalBudget: 3000, roas: 1.8, leads: 45, cpl: 22, status: "monitoring", autoScaleEnabled: true,
    scaleHistory: [
      { date: "Dia 1", budget: 3000, roas: 1.5 }, { date: "Dia 15", budget: 3000, roas: 1.8 },
    ],
  },
  {
    id: "4", name: "Infoproduto Launch", client: "InfoProduto BR", platform: "Meta Ads",
    budget: 2000, originalBudget: 5000, roas: 0.8, leads: 89, cpl: 35, status: "paused", autoScaleEnabled: false,
    scaleHistory: [
      { date: "Dia 1", budget: 5000, roas: 1.2 }, { date: "Dia 7", budget: 4000, roas: 0.9 },
      { date: "Dia 14", budget: 2000, roas: 0.8 },
    ],
  },
];

const statusConfig = {
  scaling: { label: "Escalando ↑", color: "text-green-400 bg-green-500/10", icon: TrendingUp },
  monitoring: { label: "Monitorando", color: "text-accent bg-accent/10", icon: BarChart3 },
  paused: { label: "Pausada", color: "text-amber-400 bg-amber-500/10", icon: Pause },
  limit_reached: { label: "Limite Atingido", color: "text-primary bg-primary/10", icon: Shield },
};

export default function AutoScaleAI() {
  const [selectedCampaign, setSelectedCampaign] = useState<string>(campaigns[0].id);
  const selected = campaigns.find((c) => c.id === selectedCampaign)!;
  const cfg = statusConfig[selected.status];

  const totalBudget = campaigns.reduce((a, c) => a + c.budget, 0);
  const avgRoas = (campaigns.reduce((a, c) => a + c.roas, 0) / campaigns.length).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Rocket className="w-7 h-7 text-primary" /> Auto Scale AI
        </h1>
        <p className="text-sm text-muted-foreground mt-1">IA que escala campanhas automaticamente — limite de segurança: +20%/dia.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <Rocket className="w-5 h-5 mx-auto mb-2 text-green-400" />
          <p className="text-2xl font-bold text-foreground">{campaigns.filter(c => c.status === "scaling").length}</p>
          <p className="text-[10px] text-muted-foreground">Escalando</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <DollarSign className="w-5 h-5 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold text-foreground">R$ {totalBudget.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">Budget Total</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <ArrowUpRight className="w-5 h-5 mx-auto mb-2 text-accent" />
          <p className="text-2xl font-bold text-foreground">{avgRoas}x</p>
          <p className="text-[10px] text-muted-foreground">ROAS Médio</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <Shield className="w-5 h-5 mx-auto mb-2 text-amber-400" />
          <p className="text-2xl font-bold text-foreground">20%</p>
          <p className="text-[10px] text-muted-foreground">Limite Diário</p>
        </div>
      </div>

      {/* Safety Limit Info */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-foreground">Limite de Segurança Ativo</p>
          <p className="text-[10px] text-muted-foreground mt-1">A IA aumenta no máximo 20% do orçamento por dia. Campanhas com ROAS abaixo de 2.0x são automaticamente pausadas. Campanhas lucrativas são escaladas progressivamente.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Campaign List */}
        <div className="space-y-3">
          {campaigns.map((c) => {
            const s = statusConfig[c.status];
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCampaign(c.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedCampaign === c.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{c.platform}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${s.color}`}>{s.label}</span>
                </div>
                <p className="text-sm font-semibold text-foreground">{c.name}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{c.client}</p>
                <div className="flex justify-between mt-2">
                  <span className="text-[10px] text-primary font-bold">R$ {c.budget.toLocaleString()}</span>
                  <span className="text-[10px] text-green-400 font-bold">{c.roas}x ROAS</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Scale Chart */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{selected.name}</h3>
                <p className="text-xs text-muted-foreground">{selected.client} • {selected.platform}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${cfg.color}`}>{cfg.label}</span>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="text-center p-2 rounded-lg bg-secondary/30">
                <p className="text-sm font-bold text-foreground">R$ {selected.originalBudget.toLocaleString()}</p>
                <p className="text-[9px] text-muted-foreground">Budget Inicial</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-secondary/30">
                <p className="text-sm font-bold text-primary">R$ {selected.budget.toLocaleString()}</p>
                <p className="text-[9px] text-muted-foreground">Budget Atual</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-secondary/30">
                <p className="text-sm font-bold text-green-400">{selected.roas}x</p>
                <p className="text-[9px] text-muted-foreground">ROAS</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-secondary/30">
                <p className="text-sm font-bold text-accent">{selected.leads}</p>
                <p className="text-[9px] text-muted-foreground">Leads</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={selected.scaleHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                <YAxis yAxisId="budget" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                <YAxis yAxisId="roas" orientation="right" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))" }} />
                <Line yAxisId="budget" type="monotone" dataKey="budget" stroke="hsl(var(--primary))" strokeWidth={2} dot />
                <Line yAxisId="roas" type="monotone" dataKey="roas" stroke="hsl(var(--ai-active))" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Scale Flow */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" /> Fluxo de Auto-Escala
            </h3>
            <div className="flex flex-wrap gap-2 items-center text-[10px]">
              {["Monitoramento 24/7", "→", "Detecta ROAS > 2.0x", "→", "+20% Budget/dia", "→", "Monitora Resultado", "→", "Se ROAS cai → Pausa"].map((step, i) => (
                <span key={i} className={step === "→" ? "text-primary font-bold" : "px-2 py-1 rounded-lg bg-card border border-border text-foreground"}>{step}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
