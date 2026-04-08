import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Shield, TrendingUp, FileText, Search, Users, ShoppingCart,
  MessageSquare, BarChart3, Bot, Cpu, Play, Loader2, CheckCircle2,
  Sparkles, Rocket, Eye, Pen, Globe, Target, Megaphone, LineChart,
  Zap, FileBarChart, Mic
} from "lucide-react";
import { VoiceInterface } from "@/components/VoiceInterface";

interface AIModule {
  id: string; name: string; description: string; icon: React.ElementType;
  action: string; color: string; category: string;
  fields: { key: string; label: string; type: "text" | "textarea" | "select"; options?: string[] }[];
}

const AI_MODULES: AIModule[] = [
  // ── Inteligência ──
  { id: "churn", name: "Anti-Churn AI", description: "Detecta risco de cancelamento e gera plano de retenção automático",
    icon: Shield, action: "analyze_churn", color: "text-red-400", category: "Inteligência",
    fields: [{ key: "tenant_id", label: "Tenant ID", type: "text" }] },
  { id: "competitors", name: "Radar Competitivo", description: "Monitora concorrentes e detecta mudanças de preço, features e posicionamento",
    icon: Eye, action: "monitor_competitors", color: "text-purple-400", category: "Inteligência",
    fields: [{ key: "competitor_name", label: "Nome do Concorrente", type: "text" }, { key: "competitor_url", label: "URL", type: "text" }] },
  { id: "market", name: "Market Prediction AI", description: "Previsão de tendências, scoring de oportunidades e análise de riscos",
    icon: TrendingUp, action: "predict_market", color: "text-violet-400", category: "Inteligência",
    fields: [{ key: "niche", label: "Nicho/Setor", type: "text" }, { key: "currentData", label: "Dados Atuais (JSON ou texto)", type: "textarea" }] },
  { id: "creative_score", name: "Creative Intelligence™", description: "Score preditivo de criativos antes de subir na plataforma — prevê CTR",
    icon: Sparkles, action: "score_creative", color: "text-yellow-400", category: "Inteligência",
    fields: [{ key: "headline", label: "Headline do Criativo", type: "text" }, { key: "body", label: "Corpo do Anúncio", type: "textarea" }, { key: "niche", label: "Nicho", type: "text" }, { key: "platform", label: "Plataforma", type: "select", options: ["meta_ads", "google_ads", "tiktok_ads", "instagram"] }] },

  // ── Marketing ──
  { id: "copy", name: "Copy Master AI", description: "Gera copies matadoras com gatilhos mentais, variações e score de conversão",
    icon: Pen, action: "generate_copy", color: "text-orange-400", category: "Marketing",
    fields: [{ key: "clientDescription", label: "Descrição do Cliente", type: "text" }, { key: "businessType", label: "Tipo de Negócio", type: "text" }, { key: "targetAudience", label: "Público-alvo", type: "text" }, { key: "platform", label: "Plataforma", type: "select", options: ["instagram", "facebook", "google_ads", "linkedin", "tiktok"] }, { key: "copyType", label: "Tipo de Copy", type: "select", options: ["anuncio", "landing_page", "email", "whatsapp", "stories"] }, { key: "objective", label: "Objetivo", type: "text" }] },
  { id: "viral", name: "Conteúdo Viral AI", description: "Calendário de conteúdo viral com ganchos, CTAs e prompts de imagem",
    icon: Megaphone, action: "generate_viral_content", color: "text-pink-400", category: "Marketing",
    fields: [{ key: "niche", label: "Nicho", type: "text" }, { key: "platform", label: "Plataforma", type: "select", options: ["instagram", "linkedin", "tiktok", "twitter"] }, { key: "days", label: "Dias de conteúdo", type: "text" }] },
  { id: "seo", name: "SEO Strategy AI", description: "Keywords, plano de conteúdo e correções técnicas para dominar buscas",
    icon: Search, action: "generate_seo_strategy", color: "text-green-400", category: "Marketing",
    fields: [{ key: "domain", label: "Domínio", type: "text" }, { key: "niche", label: "Nicho", type: "text" }, { key: "targetAudience", label: "Audiência", type: "text" }] },
  { id: "gmb", name: "Google Meu Negócio AI", description: "Otimização completa: posts, reviews, keywords, ranking no Maps",
    icon: Globe, action: "optimize_gmb", color: "text-blue-400", category: "Marketing",
    fields: [{ key: "businessName", label: "Nome do Negócio", type: "text" }, { key: "category", label: "Categoria", type: "text" }, { key: "location", label: "Localização", type: "text" }, { key: "websiteUrl", label: "Website (opcional)", type: "text" }] },

  // ── Tráfego ──
  { id: "campaign", name: "Campaign Analyzer", description: "Análise profunda de campanhas com recomendações e projeções de ROAS",
    icon: LineChart, action: "analyze_campaign", color: "text-cyan-400", category: "Tráfego",
    fields: [{ key: "campaignName", label: "Nome da Campanha", type: "text" }, { key: "platform", label: "Plataforma", type: "select", options: ["meta_ads", "google_ads", "tiktok_ads"] }, { key: "objective", label: "Objetivo", type: "text" }, { key: "spent", label: "Gasto (R$)", type: "text" }, { key: "impressions", label: "Impressões", type: "text" }, { key: "clicks", label: "Cliques", type: "text" }, { key: "leads", label: "Leads", type: "text" }, { key: "revenue", label: "Receita (R$)", type: "text" }, { key: "budget", label: "Budget Mensal (R$)", type: "text" }] },

  // ── Automação IA ──
  { id: "pipeline", name: "Orquestrador Multi-Agente", description: "Pipeline: pesquisa → análise → escrita → revisão automática",
    icon: Cpu, action: "run_pipeline", color: "text-blue-400", category: "Automação IA",
    fields: [{ key: "goal", label: "Objetivo do Pipeline", type: "textarea" }, { key: "agents", label: "Agentes (vírgula: pesquisador, analista, escritor)", type: "text" }] },
  { id: "automation", name: "Automation Builder", description: "Gera fluxo completo de automação com trigger, nós e sequência de follow-up",
    icon: Zap, action: "generate_automation", color: "text-amber-400", category: "Automação IA",
    fields: [{ key: "clientDescription", label: "Descrição do Negócio", type: "text" }, { key: "objective", label: "Objetivo", type: "text" }, { key: "platforms", label: "Plataformas (vírgula)", type: "text" }] },

  // ── Afiliados ──
  { id: "affiliate", name: "Affiliate Strategy AI", description: "Estratégia completa de afiliados: tráfego, copies, projeções e plano de 30 dias",
    icon: Target, action: "generate_affiliate_strategy", color: "text-emerald-400", category: "Afiliados",
    fields: [{ key: "productName", label: "Nome do Produto", type: "text" }, { key: "productDescription", label: "Descrição", type: "textarea" }, { key: "role", label: "Papel", type: "select", options: ["producer", "affiliate"] }, { key: "price", label: "Preço (R$)", type: "text" }, { key: "commissionRate", label: "Comissão (%)", type: "text" }, { key: "platforms", label: "Plataformas (vírgula)", type: "text" }] },

  // ── Relatórios ──
  { id: "report", name: "Auto-Report™", description: "Relatório profissional completo gerado em 60 segundos com destaques e projeções",
    icon: FileBarChart, action: "generate_report", color: "text-indigo-400", category: "Relatórios",
    fields: [{ key: "clientName", label: "Nome do Cliente", type: "text" }, { key: "period", label: "Período", type: "text" }, { key: "leads", label: "Leads", type: "text" }, { key: "conversions", label: "Conversões", type: "text" }, { key: "revenue", label: "Receita (R$)", type: "text" }, { key: "spend", label: "Investimento (R$)", type: "text" }] },

  // ── Governança ──
  { id: "governance", name: "Governança IA", description: "Diagnóstico executivo do programa com score de saúde e ações estratégicas",
    icon: Shield, action: "run_governance", color: "text-teal-400", category: "Governança",
    fields: [{ key: "totalClients", label: "Total Clientes", type: "text" }, { key: "activeClients", label: "Clientes Ativos", type: "text" }, { key: "totalBudget", label: "Budget Total (R$)", type: "text" }, { key: "totalLeads", label: "Total Leads", type: "text" }] },

  // ── Outros ──
  { id: "business", name: "Business Analyzer", description: "Analisa URL de site/Instagram e extrai inteligência de negócios",
    icon: Globe, action: "analyze_business", color: "text-sky-400", category: "Inteligência",
    fields: [{ key: "url", label: "URL do Site ou Instagram", type: "text" }] },
  { id: "contract", name: "Análise Jurídica AI", description: "Identifica cláusulas abusivas, riscos e cláusulas ausentes",
    icon: FileText, action: "analyze_contract", color: "text-amber-400", category: "Jurídico",
    fields: [{ key: "contractText", label: "Texto do Contrato", type: "textarea" }] },
  { id: "ecommerce", name: "E-Commerce Optimizer", description: "Otimiza título, descrição, bullet points e SEO de produtos",
    icon: ShoppingCart, action: "optimize_listing", color: "text-orange-400", category: "E-Commerce",
    fields: [{ key: "productName", label: "Nome do Produto", type: "text" }, { key: "rawDescription", label: "Descrição Atual", type: "textarea" }, { key: "category", label: "Categoria", type: "text" }] },
  { id: "hr", name: "Recrutamento AI", description: "Score de candidatos, gaps, pontos fortes e perguntas personalizadas",
    icon: Users, action: "screen_candidate", color: "text-indigo-400", category: "RH",
    fields: [{ key: "jobDescription", label: "Descrição da Vaga", type: "textarea" }, { key: "resumeText", label: "Currículo", type: "textarea" }] },
  { id: "support", name: "Suporte 24/7 AI", description: "Atendimento automático com base de conhecimento e escalação inteligente",
    icon: MessageSquare, action: "handle_support", color: "text-cyan-400", category: "Atendimento",
    fields: [{ key: "message", label: "Mensagem", type: "textarea" }, { key: "knowledgeBase", label: "Base de Conhecimento (separar por |||)", type: "textarea" }] },
  { id: "spreadsheet", name: "Planilhas AI", description: "Gera fórmulas complexas para Google Sheets e Excel",
    icon: BarChart3, action: "generate_formulas", color: "text-emerald-400", category: "Produtividade",
    fields: [{ key: "description", label: "O que calcular?", type: "textarea" }, { key: "headers", label: "Colunas (vírgula)", type: "text" }] },
  { id: "clone", name: "Clone Digital", description: "Analisa seu estilo e cria um clone digital que escreve como você",
    icon: Bot, action: "build_clone", color: "text-rose-400", category: "IA Pessoal",
    fields: [{ key: "userName", label: "Seu Nome", type: "text" }, { key: "samples", label: "Amostras de texto (separar por |||)", type: "textarea" }] },
  { id: "crack_lead", name: "Lead Cracking AI", description: "Enriquece leads com score, segmentação, intenção e melhor abordagem",
    icon: Users, action: "crack_lead", color: "text-lime-400", category: "Automação IA",
    fields: [{ key: "rawData", label: "Dados do Lead (JSON ou texto)", type: "textarea" }, { key: "businessNiche", label: "Nicho do Negócio", type: "text" }] },
  { id: "optimize_copy", name: "Copy Optimizer", description: "Otimiza copies existentes com base em dados de performance reais",
    icon: Pen, action: "optimize_copy", color: "text-fuchsia-400", category: "Marketing",
    fields: [{ key: "originalCopy", label: "Copy Original", type: "textarea" }, { key: "ctr", label: "CTR (%)", type: "text" }, { key: "conversions", label: "Conversões", type: "text" }, { key: "feedback", label: "Feedback (opcional)", type: "text" }] },
  { id: "respond_review", name: "Review Response AI", description: "Gera respostas profissionais para avaliações do Google Meu Negócio",
    icon: MessageSquare, action: "respond_review", color: "text-sky-400", category: "Marketing",
    fields: [{ key: "rating", label: "Estrelas (1-5)", type: "text" }, { key: "reviewText", label: "Texto da Avaliação", type: "textarea" }, { key: "authorName", label: "Nome do Autor", type: "text" }, { key: "businessName", label: "Nome do Negócio", type: "text" }] },
  { id: "manage_budget", name: "Budget Manager AI", description: "Realoca verba automaticamente para onde performa melhor",
    icon: TrendingUp, action: "manage_budget", color: "text-emerald-400", category: "Tráfego",
    fields: [{ key: "totalBudget", label: "Budget Total (R$)", type: "text" }, { key: "campaigns", label: "Campanhas (JSON)", type: "textarea" }] },
];

export default function AIProductionCenter() {
  const { toast } = useToast();
  const [selectedModule, setSelectedModule] = useState<AIModule | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<unknown>(null);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [showVoice, setShowVoice] = useState(false);

  const categories = ["Todos", ...Array.from(new Set(AI_MODULES.map(m => m.category)))];
  const filtered = activeCategory === "Todos" ? AI_MODULES : AI_MODULES.filter(m => m.category === activeCategory);

  async function runModule() {
    if (!selectedModule) return;
    setLoading(true);
    setResult(null);

    try {
      const payload: Record<string, unknown> = {};
      for (const field of selectedModule.fields) {
        const val = formData[field.key] || "";
        if (field.key === "knowledgeBase" || field.key === "samples") {
          payload[field.key] = val.split("|||").map(s => s.trim()).filter(Boolean);
        } else if (field.key === "competitor_name") {
          payload.competitors = [{ name: val, url: formData["competitor_url"] || "" }];
        } else if (field.key === "competitor_url") {
          continue;
        } else if (field.key === "agents") {
          payload.agents = val.split(",").map(s => ({ name: s.trim(), role: s.trim().toLowerCase() }));
        } else if (field.key === "headers" || field.key === "platforms") {
          payload[field.key] = val.split(",").map(s => s.trim());
        } else if (field.key === "days" || field.key === "price" || field.key === "commissionRate" ||
                   field.key === "totalClients" || field.key === "activeClients" || field.key === "totalBudget" ||
                   field.key === "totalLeads" || field.key === "spent" || field.key === "impressions" ||
                   field.key === "clicks" || field.key === "leads" || field.key === "revenue" ||
                   field.key === "budget" || field.key === "conversions" || field.key === "spend") {
          payload[field.key] = parseFloat(val) || 0;
        } else if (field.key === "currentData") {
          try { payload.currentData = JSON.parse(val); } catch { payload.currentData = { raw: val }; }
        } else if (field.key === "headline" || field.key === "body") {
          if (!payload.creative) payload.creative = {};
          (payload.creative as Record<string, string>)[field.key] = val;
          if (field.key === "body") (payload.creative as Record<string, string>).platform = formData["platform"] || "meta_ads";
        } else if (field.key === "spent" || field.key === "impressions" || field.key === "clicks" || field.key === "leads" || field.key === "revenue") {
          if (!payload.metrics) payload.metrics = {};
          (payload.metrics as Record<string, number>)[field.key] = parseFloat(val) || 0;
        } else {
          payload[field.key] = val;
        }
      }

      // Special handling for campaign analyzer metrics
      if (selectedModule.action === "analyze_campaign") {
        payload.metrics = {
          spent: parseFloat(formData["spent"] || "0"),
          impressions: parseInt(formData["impressions"] || "0"),
          clicks: parseInt(formData["clicks"] || "0"),
          leads: parseInt(formData["leads"] || "0"),
          revenue: parseFloat(formData["revenue"] || "0"),
          conversions: parseInt(formData["conversions"] || "0"),
        };
      }

      // Special handling for report data
      if (selectedModule.action === "generate_report") {
        payload.reportData = {
          leads: parseInt(formData["leads"] || "0"),
          conversions: parseInt(formData["conversions"] || "0"),
          revenue: parseFloat(formData["revenue"] || "0"),
          spend: parseFloat(formData["spend"] || "0"),
          campaigns: 0,
        };
      }

      const { data: response, error } = await supabase.functions.invoke("maestro-ai", {
        body: { action: selectedModule.action, data: payload },
      });

      if (error) throw error;
      setResult(response?.result || response);
      toast({ title: "✅ Concluído!", description: selectedModule.name + " processou com sucesso." });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      toast({ title: "Erro", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl overflow-hidden border border-primary/20 bg-gradient-to-r from-card via-card to-primary/5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Rocket className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">AI Production Center</h1>
              <span className="text-[10px] font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full">{AI_MODULES.length} MÓDULOS</span>
            </div>
            <p className="text-xs text-muted-foreground">Central de produção com IA — Copy Master, Creative Intelligence, Campaign Analyzer, Automation Builder e mais</p>
          </div>
          <button onClick={() => setShowVoice(!showVoice)}
            className={`p-3 rounded-xl border transition-colors ${showVoice ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
            <Mic className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showVoice && (
        <div className="rounded-xl border border-primary/20 bg-card">
          <VoiceInterface />
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground border-transparent" : "border-border text-muted-foreground hover:text-foreground"}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map((mod) => {
          const Icon = mod.icon;
          const isSelected = selectedModule?.id === mod.id;
          return (
            <button key={mod.id} onClick={() => { setSelectedModule(mod); setFormData({}); setResult(null); }}
              className={`p-4 rounded-xl border text-left transition-all hover:border-primary/40 ${isSelected ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border bg-card"}`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-5 h-5 ${mod.color}`} />
                <span className="text-[9px] font-mono bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">{mod.category}</span>
              </div>
              <p className="text-sm font-semibold text-foreground">{mod.name}</p>
              <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{mod.description}</p>
            </button>
          );
        })}
      </div>

      {selectedModule && (
        <div className="rounded-xl border border-primary/20 bg-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <selectedModule.icon className={`w-6 h-6 ${selectedModule.color}`} />
            <div>
              <h2 className="text-lg font-bold text-foreground">{selectedModule.name}</h2>
              <p className="text-xs text-muted-foreground">{selectedModule.description}</p>
            </div>
          </div>
          <div className="grid gap-3">
            {selectedModule.fields.map((field) => (
              <div key={field.key}>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea className="w-full p-3 rounded-lg bg-secondary/30 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary outline-none resize-none" rows={4}
                    value={formData[field.key] || ""} onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={`Digite ${field.label.toLowerCase()}...`} />
                ) : field.type === "select" ? (
                  <select className="w-full p-3 rounded-lg bg-secondary/30 border border-border text-sm text-foreground outline-none"
                    value={formData[field.key] || field.options?.[0] || ""} onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}>
                    {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input className="w-full p-3 rounded-lg bg-secondary/30 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary outline-none"
                    value={formData[field.key] || ""} onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={`Digite ${field.label.toLowerCase()}...`} />
                )}
              </div>
            ))}
          </div>
          <button onClick={runModule} disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {loading ? "Processando..." : "Executar Módulo"}
          </button>
        </div>
      )}

      {result && (
        <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-6">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <h3 className="text-sm font-bold text-foreground">Resultado</h3>
          </div>
          <pre className="text-xs text-muted-foreground bg-secondary/30 p-4 rounded-lg overflow-auto max-h-[500px] whitespace-pre-wrap">
            {typeof result === "string" ? result : JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
