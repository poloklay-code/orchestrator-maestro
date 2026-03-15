import { useState } from "react";
import { Plus, Search, Store, Trash2, DollarSign, ShoppingCart, Bot, Globe, Sparkles, RefreshCw, Target, Eye, X, TrendingUp, TrendingDown, Pause, Play, BarChart3, AlertTriangle, Zap, PieChart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RPieChart, Pie, Cell, LineChart, Line } from "recharts";
import { toast } from "sonner";

const AFFILIATE_PLATFORMS = ["Hotmart", "Monetizze", "Eduzz", "Kiwify", "Braip", "Dig Store", "BuyGoods", "ClickBank", "MaxWeb"];
const TRAFFIC_TYPES = ["Tráfego Pago", "Tráfego Orgânico", "Ambos"];
const DESTINATIONS = ["E-commerce", "Site/Landing Page", "Instagram", "YouTube", "TikTok", "WhatsApp", "VSL", "Webinar"];
const ROLES = ["Produtor", "Afiliado"];
const AD_PLATFORMS = ["Facebook Ads", "Google Ads", "TikTok Ads", "YouTube Ads", "Instagram Ads", "Pinterest Ads", "Taboola", "Kwai Ads"];

interface Campaign {
  id: string; name: string; platform: string; status: "active" | "paused" | "optimizing";
  spend: number; revenue: number; roas: number; conversions: number; clicks: number; cpc: number;
}

interface Affiliate {
  id: string; platform: string; product_name: string; product_id: string;
  commission_type: string; commission_value: number; total_sales: number;
  total_revenue: number; status: string; client_name: string; role: string;
  campaigns: Campaign[];
  totalSpend: number;
}

const demoCampaigns: Campaign[] = [
  { id: "c1", name: "Campanha Principal — Conversão", platform: "Facebook Ads", status: "active", spend: 2450, revenue: 12800, roas: 5.22, conversions: 89, clicks: 3420, cpc: 0.72 },
  { id: "c2", name: "Retargeting — Carrinho Abandonado", platform: "Facebook Ads", status: "active", spend: 680, revenue: 4200, roas: 6.18, conversions: 34, clicks: 1890, cpc: 0.36 },
  { id: "c3", name: "Lookalike — Compradores", platform: "Google Ads", status: "optimizing", spend: 1200, revenue: 3100, roas: 2.58, conversions: 21, clicks: 2100, cpc: 0.57 },
  { id: "c4", name: "Teste Criativo A/B", platform: "TikTok Ads", status: "paused", spend: 450, revenue: 320, roas: 0.71, conversions: 3, clicks: 890, cpc: 0.51 },
];

const DEMO_AFFILIATES: Affiliate[] = [
  { id: "1", platform: "Hotmart", product_name: "Curso IA Avancada", product_id: "HOT-001", commission_type: "percentage", commission_value: 40, total_sales: 127, total_revenue: 25400, status: "active", client_name: "Tech Academy", role: "Produtor", campaigns: demoCampaigns, totalSpend: 4780 },
  { id: "2", platform: "Kiwify", product_name: "Mentoria Digital", product_id: "KWF-042", commission_type: "percentage", commission_value: 50, total_sales: 89, total_revenue: 17800, status: "active", client_name: "Digital Pro", role: "Afiliado", campaigns: [demoCampaigns[0], demoCampaigns[1]], totalSpend: 3130 },
  { id: "3", platform: "Eduzz", product_name: "Pack Templates", product_id: "EDZ-103", commission_type: "fixed", commission_value: 97, total_sales: 45, total_revenue: 4365, status: "active", client_name: "Geral", role: "Produtor", campaigns: [demoCampaigns[2]], totalSpend: 1200 },
];

const PIE_COLORS = ["hsl(195, 90%, 45%)", "hsl(35, 80%, 55%)", "hsl(155, 75%, 45%)", "hsl(270, 75%, 55%)", "hsl(0, 80%, 50%)"];

export default function AffiliatesManager() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>(DEMO_AFFILIATES);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showAiGenerator, setShowAiGenerator] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedCopy, setGeneratedCopy] = useState<string | null>(null);
  const [viewingAff, setViewingAff] = useState<Affiliate | null>(null);
  const [aiForm, setAiForm] = useState({ clientName: "", businessDescription: "", siteUrl: "", instagramUrl: "", trafficType: "Tráfego Pago", destination: "E-commerce", platform: "Hotmart", role: "Produtor", adPlatforms: ["Facebook Ads"] });
  const [form, setForm] = useState({ platform: "", product_name: "", product_id: "", client_name: "", commission_type: "percentage", commission_value: 0, role: "Produtor" });

  const filtered = affiliates.filter(a =>
    a.platform.toLowerCase().includes(search.toLowerCase()) ||
    a.product_name.toLowerCase().includes(search.toLowerCase()) ||
    a.client_name.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = affiliates.reduce((a, b) => a + b.total_revenue, 0);
  const totalSales = affiliates.reduce((a, b) => a + b.total_sales, 0);
  const totalSpend = affiliates.reduce((a, b) => a + b.totalSpend, 0);
  const overallROAS = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) : "0";

  const chartData = AFFILIATE_PLATFORMS.map(p => {
    const pAff = affiliates.filter(a => a.platform === p);
    return { name: p.length > 8 ? p.slice(0, 8) + ".." : p, vendas: pAff.reduce((a, b) => a + b.total_sales, 0), receita: pAff.reduce((a, b) => a + b.total_revenue, 0) };
  }).filter(d => d.vendas > 0 || d.receita > 0);

  const roasHistory = [
    { day: "Seg", roas: 3.2, spend: 450 }, { day: "Ter", roas: 4.1, spend: 520 }, { day: "Qua", roas: 3.8, spend: 480 },
    { day: "Qui", roas: 5.2, spend: 610 }, { day: "Sex", roas: 4.7, spend: 550 }, { day: "Sab", roas: 6.1, spend: 380 }, { day: "Dom", roas: 5.5, spend: 320 },
  ];

  const spendByPlatform = AD_PLATFORMS.slice(0, 4).map((p, i) => ({ name: p.replace(" Ads", ""), value: [2450, 1200, 450, 680][i] || 0 })).filter(d => d.value > 0);

  function handleSave() {
    if (!form.platform) { toast.error("Plataforma obrigatória"); return; }
    const newAff: Affiliate = { id: Date.now().toString(), ...form, total_sales: 0, total_revenue: 0, status: "active", campaigns: [], totalSpend: 0 };
    setAffiliates([newAff, ...affiliates]);
    toast.success("Integração cadastrada");
    setShowForm(false);
  }

  function handleDelete(aff: Affiliate) {
    setAffiliates(affiliates.filter(a => a.id !== aff.id));
    toast.success("Integração excluída");
  }

  function toggleCampaign(affId: string, campId: string) {
    setAffiliates(affiliates.map(a => {
      if (a.id !== affId) return a;
      return { ...a, campaigns: a.campaigns.map(c => c.id === campId ? { ...c, status: c.status === "paused" ? "active" : "paused" } : c) };
    }));
    toast.success("Status da campanha atualizado — IA otimizando...");
  }

  async function handleAiGenerate() {
    if (!aiForm.clientName || !aiForm.businessDescription) { toast.error("Preencha nome do cliente e descrição do produto"); return; }
    setGenerating(true);
    await new Promise(r => setTimeout(r, 2500));

    const roleText = aiForm.role === "Produtor" ? "PRODUTOR" : "AFILIADO";
    const copy = `🔥 CAMPANHA ${roleText} — ${aiForm.clientName}\n\n📦 Produto: ${aiForm.businessDescription}\n📍 Plataforma: ${aiForm.platform} | Destino: ${aiForm.destination}\n🎯 Tipo: ${aiForm.trafficType} | Mídia: ${aiForm.adPlatforms.join(", ")}\n\n` +
      `━━━ COPY PARA ANÚNCIO (HEADLINE) ━━━\n"Descubra como ${aiForm.clientName} está transformando resultados com um método que seus concorrentes ainda não conhecem."\n\n` +
      `━━━ COPY PARA ANÚNCIO (BODY) ━━━\nEnquanto a maioria luta para fazer uma venda, nosso sistema inteligente:\n✅ Atrai compradores qualificados automaticamente\n✅ Converte visitantes em clientes 24/7\n✅ Escala resultados sem aumentar gastos\n\n${aiForm.businessDescription}\n\n` +
      `👉 CTA: QUERO COMEÇAR AGORA — OFERTA LIMITADA\n\n` +
      `━━━ ESTRATÉGIA DE CAMPANHA ━━━\n🎯 Fase 1 (Dia 1-3): Teste de criativos — 5 variações com budget de R$50/dia\n🎯 Fase 2 (Dia 4-7): Escalar vencedores — Budget +30% nos top 2 criativos\n🎯 Fase 3 (Dia 8-14): Lookalike audiences + Retargeting\n🎯 Fase 4 (Dia 15+): Escala vertical — Aumentar budget 20%/dia nos ROAS > 3x\n\n` +
      `━━━ REGRAS DE OTIMIZAÇÃO IA ━━━\n⚡ ROAS < 1.5x por 48h → PAUSAR campanha automaticamente\n⚡ ROAS 1.5x-2.5x → IA reformula copy e criativos\n⚡ ROAS > 3x → ESCALAR +20% budget/dia\n⚡ CPC > R$2.00 → IA testa novos públicos\n⚡ CTR < 1% → IA gera novos criativos\n\n` +
      `${aiForm.siteUrl ? `🌐 Site analisado: ${aiForm.siteUrl}\n` : ""}${aiForm.instagramUrl ? `📱 Instagram: ${aiForm.instagramUrl}\n` : ""}` +
      `\n🤖 IA monitorando campanhas 24/7 — Foco total: VENDAS E RESULTADOS`;

    setGeneratedCopy(copy);
    setGenerating(false);
    toast.success(`Copy e estratégia de campanha gerada como ${roleText} para ${aiForm.clientName}!`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Store className="w-7 h-7 text-primary" /> Afiliados & Vendas — Central de Performance
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Gerenciamento completo de campanhas como Produtor e Afiliado. Foco 100% em vendas, otimização e escala.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2"><Store className="w-4 h-4 text-primary" /><span className="text-[10px] text-muted-foreground">Integrações</span></div>
          <p className="text-xl font-bold text-foreground">{affiliates.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2"><ShoppingCart className="w-4 h-4 text-green-400" /><span className="text-[10px] text-muted-foreground">Total Vendas</span></div>
          <p className="text-xl font-bold text-foreground">{totalSales}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2"><DollarSign className="w-4 h-4 text-yellow-400" /><span className="text-[10px] text-muted-foreground">Receita Total</span></div>
          <p className="text-xl font-bold text-foreground">R$ {totalRevenue.toLocaleString("pt-BR")}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2"><TrendingDown className="w-4 h-4 text-red-400" /><span className="text-[10px] text-muted-foreground">Gastos Ads</span></div>
          <p className="text-xl font-bold text-foreground">R$ {totalSpend.toLocaleString("pt-BR")}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-green-400" /><span className="text-[10px] text-muted-foreground">ROAS Geral</span></div>
          <p className="text-xl font-bold text-green-400">{overallROAS}x</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Vendas por Plataforma</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(230 15% 16%)" />
              <XAxis dataKey="name" tick={{ fill: "hsl(230 10% 55%)", fontSize: 9 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(230 10% 55%)", fontSize: 9 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(230 25% 10%)", border: "1px solid hsl(230 15% 18%)", borderRadius: "8px", color: "hsl(230 10% 93%)" }} />
              <Bar dataKey="vendas" fill="hsl(195 90% 45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">ROAS Semanal</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={roasHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(230 15% 16%)" />
              <XAxis dataKey="day" tick={{ fill: "hsl(230 10% 55%)", fontSize: 9 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(230 10% 55%)", fontSize: 9 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(230 25% 10%)", border: "1px solid hsl(230 15% 18%)", borderRadius: "8px", color: "hsl(230 10% 93%)" }} />
              <Line type="monotone" dataKey="roas" stroke="hsl(155 75% 45%)" strokeWidth={2} dot={{ fill: "hsl(155 75% 45%)", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Gastos por Mídia</h3>
          <ResponsiveContainer width="100%" height={180}>
            <RPieChart>
              <Pie data={spendByPlatform} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} innerRadius={35} strokeWidth={0}>
                {spendByPlatform.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(230 25% 10%)", border: "1px solid hsl(230 15% 18%)", borderRadius: "8px", color: "hsl(230 10% 93%)" }} />
            </RPieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-1">
            {spendByPlatform.map((d, i) => (
              <span key={d.name} className="flex items-center gap-1 text-[9px] text-muted-foreground">
                <span className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i] }} /> {d.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* AI Generator */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /><h3 className="text-sm font-semibold text-foreground">IA — Gerador de Campanhas & Copy (Produtor / Afiliado)</h3></div>
          <button onClick={() => setShowAiGenerator(!showAiGenerator)} className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90">
            <Bot className="w-3.5 h-3.5" /> {showAiGenerator ? "Fechar" : "Gerar com IA"}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">Descreva o produto, escolha Produtor ou Afiliado — a IA gera copy matadora + estratégia de campanha + regras de otimização automática.</p>

        {showAiGenerator && (
          <div className="mt-3 space-y-3 p-4 rounded-lg border border-primary/20 bg-card">
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Nome do Cliente *</label>
                <input value={aiForm.clientName} onChange={e => setAiForm({ ...aiForm, clientName: e.target.value })} placeholder="Ex: Digital Pro" className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Papel</label>
                <select value={aiForm.role} onChange={e => setAiForm({ ...aiForm, role: e.target.value })} className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Plataforma de Vendas</label>
                <select value={aiForm.platform} onChange={e => setAiForm({ ...aiForm, platform: e.target.value })} className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  {AFFILIATE_PLATFORMS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Descrição do Produto *</label>
              <textarea value={aiForm.businessDescription} onChange={e => setAiForm({ ...aiForm, businessDescription: e.target.value })} placeholder="Ex: Curso completo de marketing digital. Preço R$497. Comissão 50%. Público: empreendedores que querem escalar vendas online." rows={2} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            </div>
            <div className="grid sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Tráfego</label>
                <select value={aiForm.trafficType} onChange={e => setAiForm({ ...aiForm, trafficType: e.target.value })} className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  {TRAFFIC_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Destino</label>
                <select value={aiForm.destination} onChange={e => setAiForm({ ...aiForm, destination: e.target.value })} className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  {DESTINATIONS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1"><Globe className="w-3 h-3" /> Site</label>
                <input value={aiForm.siteUrl} onChange={e => setAiForm({ ...aiForm, siteUrl: e.target.value })} placeholder="https://..." className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Instagram</label>
                <input value={aiForm.instagramUrl} onChange={e => setAiForm({ ...aiForm, instagramUrl: e.target.value })} placeholder="@perfil" className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Plataformas de Anúncio (multi-seleção)</label>
              <div className="flex flex-wrap gap-2">
                {AD_PLATFORMS.map(p => (
                  <button key={p} onClick={() => {
                    const has = aiForm.adPlatforms.includes(p);
                    setAiForm({ ...aiForm, adPlatforms: has ? aiForm.adPlatforms.filter(x => x !== p) : [...aiForm.adPlatforms, p] });
                  }} className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold border transition-all ${aiForm.adPlatforms.includes(p) ? "bg-primary/10 border-primary/30 text-primary" : "bg-secondary border-border text-muted-foreground hover:border-primary/20"}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleAiGenerate} disabled={generating} className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
              {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {generating ? "IA Analisando Produto e Gerando Estratégia..." : "Gerar Copy + Estratégia de Campanha com IA"}
            </button>
            {generatedCopy && (
              <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold text-primary uppercase">Estratégia Gerada pela IA</p>
                  <button onClick={() => { navigator.clipboard.writeText(generatedCopy); toast.success("Copiado!"); }} className="text-xs text-primary hover:underline">Copiar</button>
                </div>
                <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">{generatedCopy}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search + Add */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar integrações..." className="w-full h-10 bg-card border border-border rounded-lg pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90"><Plus className="w-4 h-4" /> Nova Integração</button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-foreground">Nova Integração</h2>
            <div className="grid gap-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Papel</label>
                  <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground">{ROLES.map(r => <option key={r}>{r}</option>)}</select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Plataforma *</label>
                  <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground"><option value="">Selecionar</option>{AFFILIATE_PLATFORMS.map(p => <option key={p}>{p}</option>)}</select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Cliente</label>
                  <input value={form.client_name} onChange={e => setForm({ ...form, client_name: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground" placeholder="Geral" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground mb-1 block">Produto</label><input value={form.product_name} onChange={e => setForm({ ...form, product_name: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground" /></div>
                <div><label className="text-xs text-muted-foreground mb-1 block">ID Produto</label><input value={form.product_id} onChange={e => setForm({ ...form, product_id: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground mb-1 block">Tipo Comissão</label><select value={form.commission_type} onChange={e => setForm({ ...form, commission_type: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground"><option value="percentage">Percentual</option><option value="fixed">Fixo (CPA)</option></select></div>
                <div><label className="text-xs text-muted-foreground mb-1 block">Valor</label><input type="number" value={form.commission_value} onChange={e => setForm({ ...form, commission_value: Number(e.target.value) })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground" /></div>
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Detail Modal */}
      {viewingAff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" onClick={() => setViewingAff(null)}>
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-3xl max-h-[85vh] overflow-y-auto space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary" /> {viewingAff.product_name} — Campanhas</h2>
                <p className="text-xs text-muted-foreground">{viewingAff.platform} • {viewingAff.client_name} • {viewingAff.role}</p>
              </div>
              <button onClick={() => setViewingAff(null)} className="p-1 rounded hover:bg-secondary"><X className="w-4 h-4" /></button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div className="p-3 rounded-lg bg-secondary/30 border border-border text-center"><p className="text-lg font-bold text-foreground">{viewingAff.total_sales}</p><p className="text-[9px] text-muted-foreground">Vendas</p></div>
              <div className="p-3 rounded-lg bg-secondary/30 border border-border text-center"><p className="text-lg font-bold text-green-400">R$ {viewingAff.total_revenue.toLocaleString("pt-BR")}</p><p className="text-[9px] text-muted-foreground">Receita</p></div>
              <div className="p-3 rounded-lg bg-secondary/30 border border-border text-center"><p className="text-lg font-bold text-red-400">R$ {viewingAff.totalSpend.toLocaleString("pt-BR")}</p><p className="text-[9px] text-muted-foreground">Gastos</p></div>
              <div className="p-3 rounded-lg bg-secondary/30 border border-border text-center"><p className="text-lg font-bold text-primary">{viewingAff.totalSpend > 0 ? (viewingAff.total_revenue / viewingAff.totalSpend).toFixed(2) : "0"}x</p><p className="text-[9px] text-muted-foreground">ROAS</p></div>
            </div>

            {viewingAff.campaigns.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Campanhas Ativas</p>
                {viewingAff.campaigns.map(c => (
                  <div key={c.id} className={`p-3 rounded-lg border ${c.status === "paused" ? "border-red-500/20 bg-red-500/5" : c.status === "optimizing" ? "border-yellow-500/20 bg-yellow-500/5" : "border-border bg-secondary/20"}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${c.status === "active" ? "bg-green-500 animate-pulse" : c.status === "optimizing" ? "bg-yellow-500 animate-pulse" : "bg-red-500"}`} />
                        <p className="text-sm font-semibold text-foreground">{c.name}</p>
                        <span className="text-[9px] font-mono text-muted-foreground">{c.platform}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {c.roas < 1.5 && <AlertTriangle className="w-3.5 h-3.5 text-red-400" title="ROAS baixo — IA recomenda pausar" />}
                        <button onClick={() => toggleCampaign(viewingAff.id, c.id)} className="p-1.5 rounded hover:bg-secondary">
                          {c.status === "paused" ? <Play className="w-3.5 h-3.5 text-green-400" /> : <Pause className="w-3.5 h-3.5 text-yellow-400" />}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      <div><p className="text-[9px] text-muted-foreground">Gasto</p><p className="text-xs font-bold text-foreground">R$ {c.spend}</p></div>
                      <div><p className="text-[9px] text-muted-foreground">Receita</p><p className="text-xs font-bold text-green-400">R$ {c.revenue}</p></div>
                      <div><p className="text-[9px] text-muted-foreground">ROAS</p><p className={`text-xs font-bold ${c.roas >= 3 ? "text-green-400" : c.roas >= 1.5 ? "text-yellow-400" : "text-red-400"}`}>{c.roas}x</p></div>
                      <div><p className="text-[9px] text-muted-foreground">Conv.</p><p className="text-xs font-bold text-foreground">{c.conversions}</p></div>
                      <div><p className="text-[9px] text-muted-foreground">CPC</p><p className="text-xs font-bold text-foreground">R$ {c.cpc}</p></div>
                    </div>
                    {c.roas < 1.5 && <p className="text-[10px] text-red-400 mt-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> IA recomenda: PAUSAR e reformular criativos. ROAS abaixo do mínimo (1.5x) por 48h.</p>}
                    {c.roas >= 3 && <p className="text-[10px] text-green-400 mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> IA recomenda: ESCALAR budget +20%/dia. Performance excelente!</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground"><Store className="w-10 h-10 mx-auto mb-3 opacity-40" /><p className="text-sm">Nenhuma integração encontrada</p></div>
        ) : (
          filtered.map(aff => (
            <div key={aff.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Store className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{aff.platform}</p>
                  <span className="text-[10px] font-mono text-primary">{aff.product_name}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${aff.role === "Produtor" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>{aff.role}</span>
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                  <span>{aff.client_name}</span>
                  <span>{aff.total_sales} vendas</span>
                  <span className="text-green-400">R$ {aff.total_revenue.toLocaleString("pt-BR")}</span>
                  <span className="text-red-400">Gastos: R$ {aff.totalSpend.toLocaleString("pt-BR")}</span>
                  <span className={`font-bold ${aff.totalSpend > 0 && aff.total_revenue / aff.totalSpend >= 3 ? "text-green-400" : "text-yellow-400"}`}>
                    ROAS: {aff.totalSpend > 0 ? (aff.total_revenue / aff.totalSpend).toFixed(1) : "0"}x
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setViewingAff(aff)} className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"><Eye className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(aff)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
