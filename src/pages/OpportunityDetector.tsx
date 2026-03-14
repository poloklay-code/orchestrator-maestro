import { useState } from "react";
import {
  Sparkles, TrendingUp, Search, Globe, Video, ShoppingCart, Flame,
  ArrowUpRight, Star, Zap, Target, BarChart3, Clock, Filter
} from "lucide-react";

interface Opportunity {
  id: string;
  title: string;
  source: string;
  category: "niche" | "product" | "keyword" | "trend";
  score: number;
  growth: string;
  volume: string;
  competition: "low" | "medium" | "high";
  description: string;
  detectedAt: string;
  platforms: string[];
}

const opportunities: Opportunity[] = [
  { id: "1", title: "IA para Pequenos Negócios", source: "Google Trends", category: "niche", score: 95, growth: "+340%", volume: "18K/mês", competition: "low", description: "Busca por ferramentas de IA acessíveis para PMEs crescendo exponencialmente.", detectedAt: "1h atrás", platforms: ["Google Ads", "YouTube", "Blog"] },
  { id: "2", title: "Automação de WhatsApp Business", source: "TikTok Trends", category: "trend", score: 92, growth: "+280%", volume: "45K/mês", competition: "medium", description: "Conteúdo viral sobre automação de atendimento via WhatsApp.", detectedAt: "3h atrás", platforms: ["Meta Ads", "TikTok", "Instagram"] },
  { id: "3", title: "Curso de Marketing com IA", source: "YouTube Trends", category: "product", score: 88, growth: "+200%", volume: "12K/mês", competition: "medium", description: "Demanda crescente por educação em marketing com inteligência artificial.", detectedAt: "5h atrás", platforms: ["YouTube", "Google Ads"] },
  { id: "4", title: "Chatbot Inteligente para E-commerce", source: "Google Trends", category: "product", score: 85, growth: "+175%", volume: "8K/mês", competition: "low", description: "Lojistas buscando soluções de chatbot com IA para vendas automáticas.", detectedAt: "6h atrás", platforms: ["Meta Ads", "Google Ads"] },
  { id: "5", title: "social selling", source: "Hotmart", category: "keyword", score: 82, growth: "+150%", volume: "22K/mês", competition: "high", description: "Palavra-chave emergente em plataformas de afiliados.", detectedAt: "8h atrás", platforms: ["Instagram", "TikTok"] },
  { id: "6", title: "Funil de Vendas Automatizado", source: "Kiwify", category: "trend", score: 79, growth: "+120%", volume: "15K/mês", competition: "medium", description: "Tendência forte em infoprodutos de marketing digital.", detectedAt: "12h atrás", platforms: ["YouTube", "Meta Ads", "Email"] },
  { id: "7", title: "SEO Local para Restaurantes", source: "Google Trends", category: "niche", score: 76, growth: "+95%", volume: "6K/mês", competition: "low", description: "Restaurantes buscando otimização no Google Maps.", detectedAt: "1d atrás", platforms: ["Google Business", "Google Ads"] },
  { id: "8", title: "Reels para Negócios Locais", source: "TikTok Trends", category: "trend", score: 74, growth: "+88%", volume: "32K/mês", competition: "high", description: "Formato de vídeo curto dominando engajamento local.", detectedAt: "1d atrás", platforms: ["Instagram", "TikTok"] },
];

const categoryConfig = {
  niche: { label: "Novo Nicho", color: "text-green-400 bg-green-500/10" },
  product: { label: "Produto Quente", color: "text-primary bg-primary/10" },
  keyword: { label: "Palavra-Chave", color: "text-accent bg-accent/10" },
  trend: { label: "Tendência", color: "text-amber-400 bg-amber-500/10" },
};

const competitionConfig = { low: "text-green-400", medium: "text-amber-400", high: "text-destructive" };
const competitionLabels = { low: "Baixa", medium: "Média", high: "Alta" };

export default function OpportunityDetector() {
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? opportunities : opportunities.filter(o => o.category === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Sparkles className="w-7 h-7 text-primary" /> Opportunity Detector
        </h1>
        <p className="text-sm text-muted-foreground mt-1">IA que detecta oportunidades de mercado — Google Trends, TikTok, YouTube, plataformas de afiliados.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <Sparkles className="w-5 h-5 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold text-foreground">{opportunities.length}</p>
          <p className="text-[10px] text-muted-foreground">Detectadas</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <Flame className="w-5 h-5 mx-auto mb-2 text-destructive" />
          <p className="text-2xl font-bold text-foreground">{opportunities.filter(o => o.score >= 85).length}</p>
          <p className="text-[10px] text-muted-foreground">Alta Prioridade</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <TrendingUp className="w-5 h-5 mx-auto mb-2 text-green-400" />
          <p className="text-2xl font-bold text-green-400">+340%</p>
          <p className="text-[10px] text-muted-foreground">Maior Crescimento</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <Globe className="w-5 h-5 mx-auto mb-2 text-accent" />
          <p className="text-2xl font-bold text-foreground">6</p>
          <p className="text-[10px] text-muted-foreground">Fontes Analisadas</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["all", "niche", "product", "keyword", "trend"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "all" ? "Todas" : categoryConfig[f as keyof typeof categoryConfig].label}
          </button>
        ))}
      </div>

      {/* Opportunities */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((opp) => (
          <div key={opp.id} className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${categoryConfig[opp.category].color}`}>
                    {categoryConfig[opp.category].label}
                  </span>
                  <span className="text-[9px] text-muted-foreground">{opp.source}</span>
                </div>
                <h3 className="text-sm font-semibold text-foreground">{opp.title}</h3>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10">
                <Star className="w-3 h-3 text-primary" />
                <span className="text-xs font-bold text-primary">{opp.score}</span>
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground mb-3">{opp.description}</p>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center p-2 rounded-lg bg-secondary/30">
                <p className="text-xs font-bold text-green-400">{opp.growth}</p>
                <p className="text-[9px] text-muted-foreground">Crescimento</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-secondary/30">
                <p className="text-xs font-bold text-foreground">{opp.volume}</p>
                <p className="text-[9px] text-muted-foreground">Volume</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-secondary/30">
                <p className={`text-xs font-bold ${competitionConfig[opp.competition]}`}>{competitionLabels[opp.competition]}</p>
                <p className="text-[9px] text-muted-foreground">Competição</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {opp.platforms.map((p) => (
                <span key={p} className="text-[8px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{p}</span>
              ))}
            </div>

            <p className="text-[9px] text-muted-foreground mt-2 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {opp.detectedAt}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
