import { useState } from "react";
import { toast } from "sonner";
import { Plus, Search, FileText, Mail, MessageCircle, Copy } from "lucide-react";

const SERVICE_OPTIONS = [
  { name: "Gestão de Tráfego", price: 2500 }, { name: "Automação Completa", price: 3000 },
  { name: "Assistente IA WhatsApp", price: 1500 }, { name: "Copywriting", price: 1200 },
  { name: "Funil de Vendas", price: 2000 }, { name: "Gestão Redes Sociais", price: 1800 },
  { name: "SEO", price: 1500 }, { name: "Email Marketing", price: 1000 },
];

interface Proposal {
  id: string; title: string; services: Array<{ name: string; price: number }>; fee_gestao: number; verba: number; total: number; discount: number; status: string; clientName?: string; created_at: string;
}

const demoProposals: Proposal[] = [
  { id: "1", title: "Pacote Digital Completo", services: [{ name: "Gestão de Tráfego", price: 2500 }, { name: "Automação Completa", price: 3000 }], fee_gestao: 1000, verba: 5000, total: 11500, discount: 0, status: "sent", clientName: "João Silva", created_at: new Date().toISOString() },
  { id: "2", title: "Starter Pack Marketing", services: [{ name: "Gestão Redes Sociais", price: 1800 }], fee_gestao: 500, verba: 2000, total: 4300, discount: 0, status: "draft", clientName: "Maria Santos", created_at: new Date().toISOString() },
];

const demoClients = [{ id: "1", name: "João Silva" }, { id: "2", name: "Maria Santos" }];

export default function ProposalsManager() {
  const [proposals, setProposals] = useState<Proposal[]>(demoProposals);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedServices, setSelectedServices] = useState<Array<{ name: string; price: number }>>([]);
  const [form, setForm] = useState({ client_id: "", title: "", description: "", fee_gestao: 0, verba: 0, discount: 0 });

  const filtered = proposals.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.clientName?.toLowerCase().includes(search.toLowerCase()));
  const servicesTotal = selectedServices.reduce((a, b) => a + b.price, 0);
  const grandTotal = servicesTotal + Number(form.fee_gestao) + Number(form.verba) - Number(form.discount);

  const toggleService = (svc: { name: string; price: number }) => setSelectedServices(prev => prev.find(s => s.name === svc.name) ? prev.filter(s => s.name !== svc.name) : [...prev, svc]);

  const handleSave = () => {
    if (!form.title) { toast.error("Título obrigatório"); return; }
    const clientName = demoClients.find(c => c.id === form.client_id)?.name;
    setProposals([{ id: Date.now().toString(), title: form.title, services: selectedServices, fee_gestao: Number(form.fee_gestao), verba: Number(form.verba), discount: Number(form.discount), total: grandTotal, status: "draft", clientName, created_at: new Date().toISOString() }, ...proposals]);
    toast.success("Proposta criada");
    setShowForm(false);
    setSelectedServices([]);
  };

  const shareVia = (proposal: Proposal, method: string) => {
    const text = `Proposta: ${proposal.title}\nCliente: ${proposal.clientName || "N/A"}\nTotal: R$ ${proposal.total.toLocaleString("pt-BR")}`;
    if (method === "whatsapp") window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    else if (method === "email") window.open(`mailto:?subject=${encodeURIComponent(proposal.title)}&body=${encodeURIComponent(text)}`, "_blank");
    else { navigator.clipboard.writeText(text); toast.success("Copiado!"); }
  };

  const statusColor = (s: string) => { if (s === "sent") return "bg-blue-500/10 text-blue-400"; if (s === "accepted") return "bg-green-500/10 text-green-400"; if (s === "rejected") return "bg-red-500/10 text-red-400"; return "bg-muted text-muted-foreground"; };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar propostas..."
            className="w-full h-10 bg-card border border-border rounded-lg pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90"><Plus className="w-4 h-4" /> Nova Proposta</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-foreground">Nova Proposta</h2>
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground mb-1 block">Título *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
                <div><label className="text-xs text-muted-foreground mb-1 block">Cliente</label>
                  <select value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="">Selecionar</option>{demoClients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="text-xs text-muted-foreground mb-1 block">Serviços (selecione)</label>
                <div className="grid grid-cols-2 gap-2">{SERVICE_OPTIONS.map(svc => (
                  <button key={svc.name} onClick={() => toggleService(svc)} className={`p-2 rounded-lg border text-left text-xs transition-all ${selectedServices.find(s => s.name === svc.name) ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                    <p className="font-medium">{svc.name}</p><p className="font-mono mt-0.5">R$ {svc.price.toLocaleString("pt-BR")}</p>
                  </button>
                ))}</div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="text-xs text-muted-foreground mb-1 block">Fee Gestão (R$)</label><input type="number" value={form.fee_gestao} onChange={(e) => setForm({ ...form, fee_gestao: Number(e.target.value) })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
                <div><label className="text-xs text-muted-foreground mb-1 block">Verba (R$)</label><input type="number" value={form.verba} onChange={(e) => setForm({ ...form, verba: Number(e.target.value) })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
                <div><label className="text-xs text-muted-foreground mb-1 block">Desconto (R$)</label><input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
              </div>
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20"><p className="text-xs text-muted-foreground">Total da Proposta</p><p className="text-xl font-bold text-primary">R$ {grandTotal.toLocaleString("pt-BR")}</p></div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">Criar Proposta</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground"><FileText className="w-10 h-10 mx-auto mb-3 opacity-40" /><p className="text-sm">Nenhuma proposta encontrada</p></div>
        ) : filtered.map(prop => (
          <div key={prop.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-all group">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap"><p className="text-sm font-semibold text-foreground">{prop.title}</p><span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${statusColor(prop.status)}`}>{prop.status === "draft" ? "Rascunho" : prop.status === "sent" ? "Enviada" : prop.status === "accepted" ? "Aceita" : "Rejeitada"}</span></div>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground"><span>{prop.clientName || "Sem cliente"}</span><span className="text-primary font-bold">R$ {prop.total.toLocaleString("pt-BR")}</span><span>{new Date(prop.created_at).toLocaleDateString("pt-BR")}</span></div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => shareVia(prop, "whatsapp")} className="p-2 rounded-lg hover:bg-green-500/10 text-muted-foreground hover:text-green-400" title="WhatsApp"><MessageCircle className="w-4 h-4" /></button>
              <button onClick={() => shareVia(prop, "email")} className="p-2 rounded-lg hover:bg-blue-500/10 text-muted-foreground hover:text-blue-400" title="Email"><Mail className="w-4 h-4" /></button>
              <button onClick={() => shareVia(prop, "copy")} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground" title="Copiar"><Copy className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
