import { useState } from "react";
import {
  Compass, Target, TrendingUp, DollarSign, Globe, Users, Search,
  CheckCircle2, ArrowRight, Zap, BarChart3, Megaphone, ShoppingCart,
  Video, Mail, MessageSquare, Lightbulb, Layers, PieChart
} from "lucide-react";

interface StrategyClient {
  id: string;
  name: string;
  niche: string;
  budget: string;
  status: "generated" | "pending" | "approved";
}

const clients: StrategyClient[] = [
  { id: "1", name: "Tech Solutions", niche: "SaaS B2B", budget: "R$ 15.000/mês", status: "approved" },
  { id: "2", name: "E-commerce Plus", niche: "E-commerce Moda", budget: "R$ 8.000/mês", status: "generated" },
  { id: "3", name: "Clínica Saúde", niche: "Saúde e Bem-estar", budget: "R$ 5.000/mês", status: "pending" },
  { id: "4", name: "Restaurante Sabor", niche: "Alimentação", budget: "R$ 3.000/mês", status: "generated" },
];

const strategyResult = {
  channels: [
    { name: "Google Ads", percentage: 35, icon: Globe, reason: "Alto intent de compra no nicho" },
    { name: "Meta Ads", percentage: 25, icon: Megaphone, reason: "Público frio e remarketing" },
    { name: "Instagram Orgânico", percentage: 15, icon: Video, reason: "Prova social e autoridade" },
    { name: "Email Marketing", percentage: 10, icon: Mail, reason: "Nutrição e retenção" },
    { name: "WhatsApp", percentage: 10, icon: MessageSquare, reason: "Conversão direta" },
    { name: "YouTube", percentage: 5, icon: Video, reason: "Conteúdo educativo" },
  ],
  funnel: [
    { stage: "Topo", action: "Conteúdo educativo + Tráfego pago", leads: "5.000", conversion: "3%" },
    { stage: "Meio", action: "Email nurture + Remarketing", leads: "150", conversion: "20%" },
    { stage: "Fundo", action: "Oferta direta + WhatsApp", leads: "30", conversion: "33%" },
    { stage: "Venda", action: "Checkout otimizado + Follow-up", leads: "10", conversion: "100%" },
  ],
  competitors: [
    { name: "Concorrente A", strength: "Forte em Google Ads", weakness: "Fraco em social media" },
    { name: "Concorrente B", strength: "Brand forte", weakness: "Sem automação" },
    { name: "Concorrente C", strength: "Preço baixo", weakness: "Sem suporte" },
  ],
  recommendations: [
    "Investir 60% do budget em tráfego pago (Google + Meta)",
    "Criar funil de nutrição com 7 emails automatizados",
    "Publicar 4x/semana no Instagram com Reels",
    "Implementar chatbot de qualificação no WhatsApp",
    "Criar VSL de 5 minutos para landing page principal",
    "Otimizar Google Meu Negócio para SEO local",
  ],
};

export default function StrategyEngine() {
  const [selectedClient, setSelectedClient] = useState<string>(clients[0].id);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Compass className="w-7 h-7 text-primary" /> Strategy Engine
        </h1>
        <p className="text-sm text-muted-foreground mt-1">IA que cria estratégia completa de marketing — análise de nicho, concorrência, canais e funil.</p>
      </div>

      {/* Client Selector */}
      <div className="grid md:grid-cols-4 gap-3">
        {clients.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedClient(c.id)}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedClient === c.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/30"
            }`}
          >
            <p className="text-sm font-semibold text-foreground">{c.name}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{c.niche}</p>
            <p className="text-[10px] text-primary mt-1">{c.budget}</p>
          </button>
        ))}
      </div>

      <button
        onClick={handleGenerate}
        disabled={generating}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50"
      >
        {generating ? <Zap className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
        {generating ? "Gerando Estratégia..." : "Gerar Estratégia com IA"}
      </button>

      {/* Strategy Output */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Channel Distribution */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-primary" /> Canais Recomendados
          </h3>
          <div className="space-y-3">
            {strategyResult.channels.map((ch) => (
              <div key={ch.name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground flex items-center gap-2">
                    <ch.icon className="w-3.5 h-3.5 text-primary" /> {ch.name}
                  </span>
                  <span className="text-xs font-bold text-primary">{ch.percentage}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${ch.percentage}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground">{ch.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Funnel */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-accent" /> Funil de Vendas
          </h3>
          <div className="space-y-3">
            {strategyResult.funnel.map((f, idx) => (
              <div key={f.stage} className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-foreground">{f.stage}</span>
                  <span className="text-[10px] text-primary font-mono">{f.conversion} conversão</span>
                </div>
                <p className="text-[10px] text-muted-foreground">{f.action}</p>
                <p className="text-[10px] text-accent mt-1">~{f.leads} leads</p>
                {idx < strategyResult.funnel.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-muted-foreground mx-auto mt-2 rotate-90" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Competitor Analysis */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Search className="w-4 h-4 text-accent" /> Análise de Concorrência
        </h3>
        <div className="grid md:grid-cols-3 gap-3">
          {strategyResult.competitors.map((c) => (
            <div key={c.name} className="p-4 rounded-lg bg-secondary/30 border border-border/50">
              <p className="text-sm font-semibold text-foreground mb-2">{c.name}</p>
              <p className="text-[10px] text-green-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {c.strength}</p>
              <p className="text-[10px] text-destructive flex items-center gap-1 mt-1"><Target className="w-3 h-3" /> {c.weakness}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-primary" /> Recomendações da IA
        </h3>
        <div className="grid md:grid-cols-2 gap-2">
          {strategyResult.recommendations.map((r, i) => (
            <div key={i} className="flex items-start gap-2 p-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-foreground">{r}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
