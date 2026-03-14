import { useState } from "react";
import { toast } from "sonner";
import { Plus, Search, Zap, Trash2, Play, Pause } from "lucide-react";

const AUTOMATION_PLATFORMS = ["n8n", "Make (Integromat)", "ManyChat", "Zapier", "ActiveCampaign", "RD Station", "HubSpot", "Kommo (amoCRM)", "Typebot", "BotConversa", "WhatsApp Business API", "Twilio", "Evolution API", "Chatwoot"];

interface Automation {
  id: string; platform: string; workflow_name: string | null; status: string;
  trigger_type: string | null; executions: number; clientName?: string; created_at: string;
}

const demoAutomations: Automation[] = [
  { id: "1", platform: "n8n", workflow_name: "Lead Capture WhatsApp", status: "active", trigger_type: "webhook", executions: 1247, clientName: "João Silva", created_at: new Date().toISOString() },
  { id: "2", platform: "ManyChat", workflow_name: "Follow-up Automatico", status: "active", trigger_type: "event", executions: 834, clientName: "Maria Santos", created_at: new Date().toISOString() },
  { id: "3", platform: "Make (Integromat)", workflow_name: "Sync CRM", status: "paused", trigger_type: "schedule", executions: 456, clientName: null, created_at: new Date().toISOString() },
];

const demoClients = [{ id: "1", name: "João Silva" }, { id: "2", name: "Maria Santos" }];

export default function AutomationsManager() {
  const [automations, setAutomations] = useState<Automation[]>(demoAutomations);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ client_id: "", platform: "", workflow_name: "", status: "active", trigger_type: "webhook" });

  const filtered = automations.filter((a) =>
    a.platform.toLowerCase().includes(search.toLowerCase()) || a.workflow_name?.toLowerCase().includes(search.toLowerCase()) || a.clientName?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!form.platform) { toast.error("Plataforma obrigatória"); return; }
    const clientName = demoClients.find(c => c.id === form.client_id)?.name;
    setAutomations([{ id: Date.now().toString(), ...form, executions: 0, clientName, created_at: new Date().toISOString() } as Automation, ...automations]);
    toast.success("Automação cadastrada");
    setShowForm(false);
  };

  const toggleStatus = (auto: Automation) => {
    const newStatus = auto.status === "active" ? "paused" : "active";
    setAutomations(automations.map((a) => a.id === auto.id ? { ...a, status: newStatus } : a));
    toast.success(`Automação ${newStatus === "active" ? "ativada" : "pausada"}`);
  };

  const handleDelete = (auto: Automation) => {
    if (!confirm(`Excluir automação ${auto.workflow_name || auto.platform}?`)) return;
    setAutomations(automations.filter((a) => a.id !== auto.id));
    toast.success("Automação excluída");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar automações..."
            className="w-full h-10 bg-card border border-border rounded-lg pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> Nova Automação
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Nova Automação</h2>
            <div className="grid gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Plataforma *</label>
                <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="">Selecionar</option>
                  {AUTOMATION_PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Cliente</label>
                <select value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="">Geral</option>
                  {demoClients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Nome do Workflow</label>
                  <input value={form.workflow_name} onChange={(e) => setForm({ ...form, workflow_name: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Trigger</label>
                  <select value={form.trigger_type} onChange={(e) => setForm({ ...form, trigger_type: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="webhook">Webhook</option><option value="schedule">Agendado</option><option value="manual">Manual</option><option value="event">Evento</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">Salvar</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground"><Zap className="w-10 h-10 mx-auto mb-3 opacity-40" /><p className="text-sm">Nenhuma automação encontrada</p></div>
        ) : (
          filtered.map((auto) => (
            <div key={auto.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-all group">
              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${auto.status === "active" ? "bg-green-500 animate-pulse" : "bg-muted-foreground"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{auto.workflow_name || auto.platform}</p>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                  <span className="text-primary font-mono">{auto.platform}</span>
                  <span>{auto.clientName || "Geral"}</span>
                  <span>{auto.executions} execuções</span>
                  {auto.trigger_type && <span className="font-mono">{auto.trigger_type}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => toggleStatus(auto)} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground">
                  {auto.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button onClick={() => handleDelete(auto)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
