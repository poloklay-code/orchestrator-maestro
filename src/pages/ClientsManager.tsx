import { useState } from "react";
import { toast } from "sonner";
import { Plus, Search, Pencil, Trash2, Phone, Mail, Building2, User } from "lucide-react";

interface Client {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  document: string | null;
  type: string;
  status: string;
  notes: string | null;
  created_at: string;
}

const demoClients: Client[] = [
  { id: "1", name: "João Silva", company: "Studio Digital", email: "joao@studio.com", phone: "(11) 99999-0001", document: "123.456.789-00", type: "pj", status: "active", notes: "Cliente premium", created_at: new Date().toISOString() },
  { id: "2", name: "Maria Santos", company: "E-commerce Plus", email: "maria@ecommerce.com", phone: "(11) 98888-0002", document: "987.654.321-00", type: "pj", status: "active", notes: null, created_at: new Date().toISOString() },
  { id: "3", name: "Carlos Lima", company: null, email: "carlos@gmail.com", phone: "(21) 97777-0003", document: null, type: "pf", status: "inactive", notes: "Pausou servicos", created_at: new Date().toISOString() },
];

export default function ClientsManager() {
  const [clients, setClients] = useState<Client[]>(demoClients);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", document: "", type: "pf", notes: "" });

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setForm({ name: "", company: "", email: "", phone: "", document: "", type: "pf", notes: "" });
    setEditingClient(null);
    setShowForm(false);
  };

  const handleSave = () => {
    if (!form.name) { toast.error("Nome é obrigatório"); return; }
    if (editingClient) {
      setClients(clients.map((c) => c.id === editingClient.id ? { ...c, ...form } : c));
      toast.success("Cliente atualizado");
    } else {
      const newClient: Client = { id: Date.now().toString(), ...form, status: "active", created_at: new Date().toISOString() };
      setClients([newClient, ...clients]);
      toast.success("Cliente cadastrado");
    }
    resetForm();
  };

  const handleDelete = (client: Client) => {
    if (!confirm(`Excluir cliente ${client.name}?`)) return;
    setClients(clients.filter((c) => c.id !== client.id));
    toast.success("Cliente excluído");
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setForm({ name: client.name, company: client.company || "", email: client.email || "", phone: client.phone || "", document: client.document || "", type: client.type, notes: client.notes || "" });
    setShowForm(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar clientes..."
            className="w-full h-10 bg-card border border-border rounded-lg pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Novo Cliente
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-foreground">{editingClient ? "Editar Cliente" : "Novo Cliente"}</h2>
            <div className="grid gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Nome *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Empresa</label>
                <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Telefone</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Documento (CPF/CNPJ)</label>
                  <input value={form.document} onChange={(e) => setForm({ ...form, document: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Tipo</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="pf">Pessoa Física</option>
                    <option value="pj">Pessoa Jurídica</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Observações</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={resetForm} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">Salvar</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <User className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Nenhum cliente encontrado</p>
            <p className="text-xs mt-1">Clique em "Novo Cliente" para cadastrar</p>
          </div>
        ) : (
          filtered.map((client) => (
            <div key={client.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-all group">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary">{client.name[0]?.toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground truncate">{client.name}</p>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${client.status === "active" ? "bg-green-500/10 text-green-400" : "bg-muted text-muted-foreground"}`}>
                    {client.status === "active" ? "Ativo" : "Inativo"}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  {client.company && <span className="flex items-center gap-1 text-xs text-muted-foreground"><Building2 className="w-3 h-3" />{client.company}</span>}
                  {client.email && <span className="flex items-center gap-1 text-xs text-muted-foreground"><Mail className="w-3 h-3" />{client.email}</span>}
                  {client.phone && <span className="flex items-center gap-1 text-xs text-muted-foreground hidden sm:flex"><Phone className="w-3 h-3" />{client.phone}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(client)} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(client)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
