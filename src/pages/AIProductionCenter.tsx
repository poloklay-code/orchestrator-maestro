import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Shield, TrendingUp, FileText, Search, Users, ShoppingCart,
  MessageSquare, BarChart3, Bot, Cpu, Play, Loader2, CheckCircle2,
  Sparkles, Rocket, Eye
} from "lucide-react";

interface AIModule {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  action: string;
  color: string;
  category: string;
  fields: { key: string; label: string; type: "text" | "textarea" | "select"; options?: string[] }[];
}

const AI_MODULES: AIModule[] = [
  {
    id: "churn", name: "Anti-Churn AI", description: "Detecta risco de cancelamento e gera plano de retenção automático",
    icon: Shield, action: "analyze_churn", color: "text-red-400", category: "Inteligência",
    fields: [{ key: "tenant_id", label: "Tenant ID", type: "text" }],
  },
  {
    id: "competitors", name: "Radar Competitivo", description: "Monitora concorrentes e detecta mudanças de preço, features e posicionamento",
    icon: Eye, action: "monitor_competitors", color: "text-purple-400", category: "Inteligência",
    fields: [
      { key: "competitor_name", label: "Nome do Concorrente", type: "text" },
      { key: "competitor_url", label: "URL do Concorrente", type: "text" },
    ],
  },
  {
    id: "pipeline", name: "Orquestrador Multi-Agente", description: "Pipeline sequencial: pesquisa → análise → escrita → revisão automática",
    icon: Cpu, action: "run_pipeline", color: "text-blue-400", category: "Automação IA",
    fields: [
      { key: "goal", label: "Objetivo do Pipeline", type: "textarea" },
      { key: "agents", label: "Agentes (separar por vírgula: pesquisador, analista, escritor)", type: "text" },
    ],
  },
  {
    id: "viral", name: "Conteúdo Viral AI", description: "Calendário de conteúdo viral com ganchos, CTAs e prompts de imagem",
    icon: Sparkles, action: "generate_viral_content", color: "text-pink-400", category: "Marketing",
    fields: [
      { key: "niche", label: "Nicho", type: "text" },
      { key: "platform", label: "Plataforma", type: "select", options: ["instagram", "linkedin", "tiktok", "twitter"] },
      { key: "days", label: "Dias de conteúdo", type: "text" },
    ],
  },
  {
    id: "contract", name: "Análise Jurídica AI", description: "Identifica cláusulas abusivas, riscos e cláusulas ausentes em contratos",
    icon: FileText, action: "analyze_contract", color: "text-amber-400", category: "Jurídico",
    fields: [{ key: "contractText", label: "Texto do Contrato", type: "textarea" }],
  },
  {
    id: "seo", name: "SEO Strategy AI", description: "Keywords de baixa concorrência, plano de conteúdo e correções técnicas",
    icon: Search, action: "generate_seo_strategy", color: "text-green-400", category: "Marketing",
    fields: [
      { key: "domain", label: "Domínio", type: "text" },
      { key: "niche", label: "Nicho", type: "text" },
      { key: "targetAudience", label: "Audiência Alvo", type: "text" },
    ],
  },
  {
    id: "ecommerce", name: "E-Commerce Optimizer", description: "Otimiza título, descrição, bullet points e SEO de produtos",
    icon: ShoppingCart, action: "optimize_listing", color: "text-orange-400", category: "E-Commerce",
    fields: [
      { key: "productName", label: "Nome do Produto", type: "text" },
      { key: "rawDescription", label: "Descrição Atual", type: "textarea" },
      { key: "category", label: "Categoria", type: "text" },
    ],
  },
  {
    id: "hr", name: "Recrutamento AI", description: "Score de candidatos, gaps, pontos fortes e perguntas personalizadas",
    icon: Users, action: "screen_candidate", color: "text-indigo-400", category: "RH",
    fields: [
      { key: "jobDescription", label: "Descrição da Vaga", type: "textarea" },
      { key: "resumeText", label: "Currículo do Candidato", type: "textarea" },
    ],
  },
  {
    id: "support", name: "Suporte 24/7 AI", description: "Atendimento automático com base de conhecimento e escalação inteligente",
    icon: MessageSquare, action: "handle_support", color: "text-cyan-400", category: "Atendimento",
    fields: [
      { key: "message", label: "Mensagem do Cliente", type: "textarea" },
      { key: "knowledgeBase", label: "Base de Conhecimento (separar por |||)", type: "textarea" },
    ],
  },
  {
    id: "spreadsheet", name: "Planilhas AI", description: "Gera fórmulas complexas para Google Sheets e Excel automaticamente",
    icon: BarChart3, action: "generate_formulas", color: "text-emerald-400", category: "Produtividade",
    fields: [
      { key: "description", label: "O que você precisa calcular?", type: "textarea" },
      { key: "headers", label: "Colunas (separar por vírgula)", type: "text" },
    ],
  },
  {
    id: "market", name: "Market Prediction AI", description: "Previsão de tendências, scoring de oportunidades e análise de riscos",
    icon: TrendingUp, action: "predict_market", color: "text-violet-400", category: "Inteligência",
    fields: [
      { key: "niche", label: "Nicho/Setor", type: "text" },
      { key: "currentData", label: "Dados Atuais (opcional, JSON ou texto)", type: "textarea" },
    ],
  },
  {
    id: "clone", name: "Clone Digital", description: "Analisa seu estilo de escrita e cria um clone digital que escreve como você",
    icon: Bot, action: "build_clone", color: "text-rose-400", category: "IA Pessoal",
    fields: [
      { key: "userName", label: "Seu Nome", type: "text" },
      { key: "samples", label: "Amostras de texto (separar por |||)", type: "textarea" },
    ],
  },
];

export default function AIProductionCenter() {
  const { toast } = useToast();
  const [selectedModule, setSelectedModule] = useState<AIModule | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<unknown>(null);
  const [activeCategory, setActiveCategory] = useState("Todos");

  const categories = ["Todos", ...Array.from(new Set(AI_MODULES.map(m => m.category)))];
  const filtered = activeCategory === "Todos" ? AI_MODULES : AI_MODULES.filter(m => m.category === activeCategory);

  async function runModule() {
    if (!selectedModule) return;
    setLoading(true);
    setResult(null);

    try {
      const data: Record<string, unknown> = {};
      for (const field of selectedModule.fields) {
        const val = formData[field.key] || "";
        if (field.key === "knowledgeBase" || field.key === "samples") {
          data[field.key] = val.split("|||").map(s => s.trim()).filter(Boolean);
        } else if (field.key === "competitor_name") {
          data.competitors = [{ name: val, url: formData["competitor_url"] || "" }];
        } else if (field.key === "competitor_url") {
          continue;
        } else if (field.key === "agents") {
          data.agents = val.split(",").map(s => ({ name: s.trim(), role: s.trim().toLowerCase() }));
        } else if (field.key === "headers") {
          data.headers = val.split(",").map(s => s.trim());
        } else if (field.key === "days") {
          data.days = parseInt(val) || 7;
        } else if (field.key === "currentData") {
          try { data.currentData = JSON.parse(val); } catch { data.currentData = { raw: val }; }
        } else {
          data[field.key] = val;
        }
      }

      const { data: response, error } = await supabase.functions.invoke("maestro-ai", {
        body: { action: selectedModule.action, data },
      });

      if (error) throw error;
      setResult(response?.result || response);
      toast({ title: "✅ Análise concluída!", description: selectedModule.name + " processou com sucesso." });
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
        <div className="flex items-center gap-3 mb-2">
          <Rocket className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">AI Production Center</h1>
          <span className="text-[10px] font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full">12 MÓDULOS</span>
        </div>
        <p className="text-xs text-muted-foreground">Central de produção com 12 módulos de IA — Anti-Churn, Radar Competitivo, Orquestrador Multi-Agente, Clone Digital e mais</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground border-transparent" : "border-border text-muted-foreground hover:text-foreground"}`}
          >{cat}</button>
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
