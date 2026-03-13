import { useState } from "react";
import { toast } from "sonner";
import { Brain, Plus, Search, Lightbulb, Trophy, AlertTriangle, Trash2, Tag } from "lucide-react";

interface Decision {
  id: string;
  title: string;
  pattern: string;
  outcome: string;
  category: "golden" | "pattern" | "risk" | "insight";
  tags: string[];
  created_at: string;
}

const CATEGORY_CONFIG = {
  golden: { label: "Decisao de Ouro", color: "text-ai-processing bg-ai-processing/10", icon: Trophy },
  pattern: { label: "Padrao Identificado", color: "text-primary bg-primary/10", icon: Brain },
  risk: { label: "Risco Mapeado", color: "text-destructive bg-destructive/10", icon: AlertTriangle },
  insight: { label: "Insight Estrategico", color: "text-accent bg-accent/10", icon: Lightbulb },
};

export default function StrategicMemory() {
  const [decisions, setDecisions] = useState<Decision[]>([
    { id: "1", title: "Escalar gradualmente sempre", pattern: "Escalar trafego acima de 30% de uma vez causa bloqueio em 60% dos casos", outcome: "Escala progressiva de 15% por semana com monitoramento diario manteve todas as contas ativas", category: "golden", tags: ["trafego", "escala", "seguranca"], created_at: new Date().toISOString() },
    { id: "2", title: "Copy humanizada converte mais", pattern: "Copies com linguagem natural tem CTR 2x maior que copies agressivas em Facebook Ads", outcome: "Todas as campanhas migraram para tom conversacional com melhoria media de 35% no CTR", category: "pattern", tags: ["copy", "facebook", "conversao"], created_at: new Date().toISOString() },
    { id: "3", title: "Automacoes pausam se improdutivas", pattern: "Fluxos ManyChat sem resposta em 72h devem ser pausados automaticamente", outcome: "Reducao de 50% em custos de mensageria e melhoria na qualidade do lead", category: "insight", tags: ["automacao", "manychat", "otimizacao"], created_at: new Date().toISOString() },
  ]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [filterCat, setFilterCat] = useState<string>("all");
  const [form, setForm] = useState({ title: "", pattern: "", outcome: "", category: "pattern" as Decision["category"], tagsInput: "" });

  const filtered = decisions.filter((d) => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) || d.pattern.toLowerCase().includes(search.toLowerCase()) || d.tags.some((t) => t.includes(search.toLowerCase()));
    const matchCat = filterCat === "all" || d.category === filterCat;
    return matchSearch && matchCat;
  });

  const handleSave = () => {
    if (!form.title || !form.pattern) { toast.error("Preencha titulo e padrao"); return; }
    const newDec: Decision = {
      id: Date.now().toString(), ...form,
      tags: form.tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
      created_at: new Date().toISOString(),
    };
    setDecisions([newDec, ...decisions]);
    setShowForm(false);
    setForm({ title: "", pattern: "", outcome: "", category: "pattern", tagsInput: "" });
    toast.success("Padrao registrado na memoria!");
  };

  const handleDelete = (id: string) => {
    setDecisions(decisions.filter((d) => d.id !== id));
    toast.success("Registro removido");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(Object.entries(CATEGORY_CONFIG) as [Decision["category"], typeof CATEGORY_CONFIG.golden][]).map(([key, cfg]) => {
          const Icon = cfg.icon;
          const count = decisions.filter((d) => d.category === key).length;
          return (
            <button key={key} onClick={() => setFilterCat(filterCat === key ? "all" : key)}
              className={`p-3 rounded-xl border transition-all text-left ${filterCat === key ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/20"}`}>
              <Icon className={`w-4 h-4 mb-1 ${cfg.color.split(" ")[0]}`} />
              <p className="text-xl font-bold text-foreground">{count}</p>
              <p className="text-[10px] text-muted-foreground">{cfg.label}</p>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar padroes, tags..."
            className="w-full h-10 bg-card border border-border rounded-lg pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> Novo Registro
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Registrar Padrao / Decisao</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <input placeholder="Titulo *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Decision["category"] })}
              className="h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
              {Object.entries(CATEGORY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <textarea placeholder="Padrao identificado *" value={form.pattern} onChange={(e) => setForm({ ...form, pattern: e.target.value })} rows={2}
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground resize-none placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <textarea placeholder="Resultado / Acao tomada" value={form.outcome} onChange={(e) => setForm({ ...form, outcome: e.target.value })} rows={2}
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground resize-none placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <input placeholder="Tags (separadas por virgula)" value={form.tagsInput} onChange={(e) => setForm({ ...form, tagsInput: e.target.value })}
            className="w-full h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-3 py-1.5 text-xs text-muted-foreground">Cancelar</button>
            <button onClick={handleSave} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90">Salvar</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Brain className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Nenhum registro encontrado</p>
          </div>
        ) : (
          filtered.map((dec) => {
            const cfg = CATEGORY_CONFIG[dec.category];
            const Icon = cfg.icon;
            return (
              <div key={dec.id} className="p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 text-[10px] font-display px-2 py-0.5 rounded-full ${cfg.color}`}>
                      <Icon className="w-3 h-3" /> {cfg.label}
                    </span>
                    <h4 className="text-sm font-semibold text-foreground">{dec.title}</h4>
                  </div>
                  <button onClick={() => handleDelete(dec.id)} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-1.5"><strong className="text-foreground">Padrao:</strong> {dec.pattern}</p>
                {dec.outcome && <p className="text-xs text-muted-foreground leading-relaxed"><strong className="text-ai-active">Resultado:</strong> {dec.outcome}</p>}
                {dec.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <Tag className="w-3 h-3 text-muted-foreground" />
                    {dec.tags.map((t) => <span key={t} className="text-[10px] font-display px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{t}</span>)}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
