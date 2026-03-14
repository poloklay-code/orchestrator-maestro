import { useState } from "react";
import { toast } from "sonner";
import { Plus, Search, Briefcase, Pencil, Trash2, Eye, ChevronUp, FileText, Zap, Globe, Target, BarChart3, CheckCircle2 } from "lucide-react";

const SERVICE_TYPES = ["Gestão de Tráfego", "Automação", "Criação de Assistente IA", "Copywriting", "Gestão de Redes Sociais", "Email Marketing", "SEO", "Desenvolvimento Web", "Design Gráfico", "Consultoria", "Funil de Vendas", "Chatbot WhatsApp"];
const PLATFORMS = ["Meta Ads", "Google Ads", "TikTok Ads", "n8n", "Make", "ManyChat", "WhatsApp", "Instagram", "YouTube", "LinkedIn", "Hotmart", "Kiwify"];

interface Service {
  id: string; client_id: string | null; type: string; platform: string | null;
  description: string | null; status: string; priority: string;
  fee_gestao: number; verba: number; clientName?: string; created_at: string;
}

const demoServices: Service[] = [
  { id: "1", client_id: "1", type: "Gestão de Tráfego", platform: "Meta Ads", description: "Campanhas Facebook e Instagram", status: "active", priority: "high", fee_gestao: 2500, verba: 5000, clientName: "João Silva", created_at: new Date().toISOString() },
  { id: "2", client_id: "2", type: "Automação", platform: "n8n", description: "Fluxos de automação completos", status: "active", priority: "medium", fee_gestao: 3000, verba: 0, clientName: "Maria Santos", created_at: new Date().toISOString() },
  { id: "3", client_id: "1", type: "Copywriting", platform: "WhatsApp", description: "Copy para campanhas e mensagens", status: "pending", priority: "low", fee_gestao: 1200, verba: 0, clientName: "João Silva", created_at: new Date().toISOString() },
];

const demoClients = [{ id: "1", name: "João Silva" }, { id: "2", name: "Maria Santos" }, { id: "3", name: "Carlos Lima" }];

export default function ServicesManager() {
  const [services, setServices] = useState<Service[]>(demoServices);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState({ client_id: "", type: "", platform: "", description: "", status: "pending", priority: "medium", fee_gestao: 0, verba: 0 });

  const filtered = services.filter((s) =>
    s.type.toLowerCase().includes(search.toLowerCase()) || s.platform?.toLowerCase().includes(search.toLowerCase()) || s.clientName?.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => { setForm({ client_id: "", type: "", platform: "", description: "", status: "pending", priority: "medium", fee_gestao: 0, verba: 0 }); setEditing(null); setShowForm(false); };

  const handleSave = () => {
    if (!form.type) { toast.error("Tipo de serviço obrigatório"); return; }
    const clientName = demoClients.find(c => c.id === form.client_id)?.name;
    if (editing) {
      setServices(services.map((s) => s.id === editing.id ? { ...s, ...form, clientName } : s));
      toast.success("Serviço atualizado");
    } else {
      setServices([{ id: Date.now().toString(), ...form, clientName, created_at: new Date().toISOString() } as Service, ...services]);
      toast.success("Serviço cadastrado");
    }
    resetForm();
  };

  const handleDelete = (svc: Service) => { if (!confirm(`Excluir serviço ${svc.type}?`)) return; setServices(services.filter((s) => s.id !== svc.id)); toast.success("Serviço excluído"); };

  const statusColor = (s: string) => { if (s === "active") return "bg-green-500/10 text-green-400"; if (s === "pending") return "bg-yellow-500/10 text-yellow-400"; if (s === "completed") return "bg-blue-500/10 text-blue-400"; return "bg-muted text-muted-foreground"; };
  const priorityColor = (p: string) => { if (p === "high") return "bg-red-500/10 text-red-400"; if (p === "medium") return "bg-yellow-500/10 text-yellow-400"; return "bg-green-500/10 text-green-400"; };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar serviços..."
            className="w-full h-10 bg-card border border-border rounded-lg pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Novo Serviço
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-foreground">{editing ? "Editar Serviço" : "Novo Serviço"}</h2>
            <div className="grid gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Cliente</label>
                <select value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="">Selecionar cliente</option>
                  {demoClients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Tipo de Serviço *</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="">Selecionar</option>
                    {SERVICE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Plataforma</label>
                  <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="">Selecionar</option>
                    {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="pending">Pendente</option><option value="active">Ativo</option><option value="completed">Concluído</option><option value="paused">Pausado</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Fee Gestão (R$)</label>
                  <input type="number" value={form.fee_gestao} onChange={(e) => setForm({ ...form, fee_gestao: Number(e.target.value) })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Verba (R$)</label>
                  <input type="number" value={form.verba} onChange={(e) => setForm({ ...form, verba: Number(e.target.value) })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Descrição</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={resetForm} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">Salvar</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Nenhum serviço encontrado</p>
          </div>
        ) : (
          filtered.map((svc) => (
            <div key={svc.id}>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-all group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground">{svc.type}</p>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${statusColor(svc.status)}`}>
                      {svc.status === "active" ? "Ativo" : svc.status === "pending" ? "Pendente" : svc.status === "completed" ? "Concluído" : "Pausado"}
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${priorityColor(svc.priority)}`}>
                      {svc.priority === "high" ? "Alta" : svc.priority === "medium" ? "Média" : "Baixa"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground">{svc.clientName || "Sem cliente"}</span>
                    {svc.platform && <span className="text-xs text-primary font-mono">{svc.platform}</span>}
                    {(svc.fee_gestao > 0 || svc.verba > 0) && <span className="text-xs text-muted-foreground">Fee: R${svc.fee_gestao} | Verba: R${svc.verba}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setExpandedId(expandedId === svc.id ? null : svc.id)} className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                    {expandedId === svc.id ? <ChevronUp className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => { setEditing(svc); setForm({ client_id: svc.client_id || "", type: svc.type, platform: svc.platform || "", description: svc.description || "", status: svc.status, priority: svc.priority, fee_gestao: svc.fee_gestao, verba: svc.verba }); setShowForm(true); }}
                    className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(svc)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              {expandedId === svc.id && (
                <div className="mt-3 mx-4 mb-4 p-4 bg-secondary/20 rounded-xl border border-border/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-foreground flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-primary" />Produção e Entregáveis</h4>
                    <button onClick={() => toast.success("Produção registrada!")} className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-[10px] font-medium hover:bg-primary/20 transition-all">
                      <Plus className="w-3 h-3" />Registrar Produção
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center py-4">Nenhuma produção registrada para este serviço.</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
