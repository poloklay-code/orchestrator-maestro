import { useState } from "react";
import {
  Radar, Globe, Eye, TrendingUp, AlertTriangle, Target, Search,
  ExternalLink, BarChart3, Megaphone, Video, ShoppingCart, Clock
} from "lucide-react";

interface Competitor {
  id: string;
  name: string;
  domain: string;
  threat: "high" | "medium" | "low";
  activeAds: number;
  socialFollowers: string;
  seoScore: number;
  adSpend: string;
  platforms: string[];
  lastDetected: string;
  strategies: string[];
}

const competitors: Competitor[] = [
  {
    id: "1", name: "MarketingPro Agency", domain: "marketingpro.com.br", threat: "high",
    activeAds: 47, socialFollowers: "125K", seoScore: 87, adSpend: "R$ 45.000/mês",
    platforms: ["Meta Ads", "Google Ads", "Instagram", "YouTube"],
    lastDetected: "2 min atrás",
    strategies: ["Remarketing agressivo", "VSLs longos", "Funil de webinar", "Google Shopping"],
  },
  {
    id: "2", name: "Digital Boost", domain: "digitalboost.com.br", threat: "medium",
    activeAds: 23, socialFollowers: "45K", seoScore: 72, adSpend: "R$ 18.000/mês",
    platforms: ["Meta Ads", "TikTok", "Instagram"],
    lastDetected: "15 min atrás",
    strategies: ["Conteúdo orgânico", "Influencers micro", "Stories ads"],
  },
  {
    id: "3", name: "Growth Lab", domain: "growthlab.io", threat: "high",
    activeAds: 62, socialFollowers: "200K", seoScore: 91, adSpend: "R$ 80.000/mês",
    platforms: ["Meta Ads", "Google Ads", "YouTube", "TikTok", "LinkedIn"],
    lastDetected: "5 min atrás",
    strategies: ["Escala com IA", "A/B testing massivo", "Landing pages dinâmicas", "Chatbot automático"],
  },
  {
    id: "4", name: "Click Agency", domain: "clickagency.com", threat: "low",
    activeAds: 8, socialFollowers: "12K", seoScore: 55, adSpend: "R$ 5.000/mês",
    platforms: ["Meta Ads", "Instagram"],
    lastDetected: "1h atrás",
    strategies: ["Boost de posts", "Catálogo de produtos"],
  },
];

const threatColors = { high: "text-destructive bg-destructive/10", medium: "text-amber-400 bg-amber-500/10", low: "text-green-400 bg-green-500/10" };
const threatLabels = { high: "Alto Risco", medium: "Médio", low: "Baixo" };

const detectedAds = [
  { id: "1", competitor: "Growth Lab", type: "Video Ad", platform: "Meta Ads", headline: "Escale seu negócio com IA", spend: "R$ 2.500/dia", ctr: "4.2%", detected: "3h atrás" },
  { id: "2", competitor: "MarketingPro", type: "Carrossel", platform: "Instagram", headline: "Cases de sucesso — 300% ROI", spend: "R$ 800/dia", ctr: "3.1%", detected: "5h atrás" },
  { id: "3", competitor: "Growth Lab", type: "Search Ad", platform: "Google Ads", headline: "Agência de Marketing #1 do Brasil", spend: "R$ 1.200/dia", ctr: "6.8%", detected: "8h atrás" },
  { id: "4", competitor: "Digital Boost", type: "Stories", platform: "Instagram", headline: "Resultados em 30 dias ou devolvemos", spend: "R$ 400/dia", ctr: "2.9%", detected: "12h atrás" },
];

export default function CompetitorRadar() {
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Radar className="w-7 h-7 text-primary" /> Competitor Radar
        </h1>
        <p className="text-sm text-muted-foreground mt-1">IA que monitora concorrentes em tempo real — anúncios, estratégias, posicionamento digital.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <Eye className="w-5 h-5 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold text-foreground">{competitors.length}</p>
          <p className="text-[10px] text-muted-foreground">Monitorados</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <Megaphone className="w-5 h-5 mx-auto mb-2 text-accent" />
          <p className="text-2xl font-bold text-foreground">{competitors.reduce((a, c) => a + c.activeAds, 0)}</p>
          <p className="text-[10px] text-muted-foreground">Anúncios Ativos</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <AlertTriangle className="w-5 h-5 mx-auto mb-2 text-destructive" />
          <p className="text-2xl font-bold text-foreground">{competitors.filter(c => c.threat === "high").length}</p>
          <p className="text-[10px] text-muted-foreground">Alto Risco</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <TrendingUp className="w-5 h-5 mx-auto mb-2 text-green-400" />
          <p className="text-2xl font-bold text-foreground">24/7</p>
          <p className="text-[10px] text-muted-foreground">Monitoramento</p>
        </div>
      </div>

      {/* Competitors Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {competitors.map((c) => (
          <div
            key={c.id}
            onClick={() => setSelectedCompetitor(selectedCompetitor === c.id ? null : c.id)}
            className={`rounded-xl border bg-card p-5 cursor-pointer transition-all ${
              selectedCompetitor === c.id ? "border-primary" : "border-border hover:border-primary/30"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{c.name}</h3>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Globe className="w-3 h-3" /> {c.domain}</p>
              </div>
              <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${threatColors[c.threat]}`}>{threatLabels[c.threat]}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="text-center p-2 rounded-lg bg-secondary/30">
                <p className="text-sm font-bold text-foreground">{c.activeAds}</p>
                <p className="text-[10px] text-muted-foreground">Anúncios</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-secondary/30">
                <p className="text-sm font-bold text-foreground">{c.socialFollowers}</p>
                <p className="text-[10px] text-muted-foreground">Seguidores</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-secondary/30">
                <p className="text-sm font-bold text-foreground">{c.seoScore}</p>
                <p className="text-[10px] text-muted-foreground">SEO Score</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-secondary/30">
                <p className="text-sm font-bold text-primary">{c.adSpend}</p>
                <p className="text-[10px] text-muted-foreground">Ad Spend</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {c.platforms.map((p) => (
                <span key={p} className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{p}</span>
              ))}
            </div>

            {selectedCompetitor === c.id && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-[10px] font-semibold text-foreground mb-2">Estratégias Detectadas:</p>
                <div className="space-y-1">
                  {c.strategies.map((s, i) => (
                    <p key={i} className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                      <Target className="w-3 h-3 text-primary" /> {s}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <p className="text-[9px] text-muted-foreground mt-2 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Detectado: {c.lastDetected}
            </p>
          </div>
        ))}
      </div>

      {/* Detected Ads */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-primary" /> Anúncios Detectados
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="p-3 text-left text-xs text-muted-foreground">Concorrente</th>
                <th className="p-3 text-left text-xs text-muted-foreground">Tipo</th>
                <th className="p-3 text-left text-xs text-muted-foreground">Plataforma</th>
                <th className="p-3 text-left text-xs text-muted-foreground">Headline</th>
                <th className="p-3 text-left text-xs text-muted-foreground">Gasto/Dia</th>
                <th className="p-3 text-left text-xs text-muted-foreground">CTR</th>
              </tr>
            </thead>
            <tbody>
              {detectedAds.map((ad) => (
                <tr key={ad.id} className="border-b border-border/50 hover:bg-secondary/20">
                  <td className="p-3 text-xs font-semibold text-foreground">{ad.competitor}</td>
                  <td className="p-3 text-xs text-muted-foreground">{ad.type}</td>
                  <td className="p-3"><span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{ad.platform}</span></td>
                  <td className="p-3 text-xs text-foreground max-w-xs truncate">{ad.headline}</td>
                  <td className="p-3 text-xs text-primary">{ad.spend}</td>
                  <td className="p-3 text-xs text-green-400">{ad.ctr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
