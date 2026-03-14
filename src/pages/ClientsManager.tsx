import { useState } from "react";
import { toast } from "sonner";
import { Plus, Search, Pencil, Trash2, Phone, Mail, Building2, User, Eye, X, ChevronDown, ChevronUp, Briefcase, Zap, PenTool, MapPin, DollarSign, BarChart3, CheckCircle2, Clock, Activity } from "lucide-react";

interface ClientService {
  id: string;
  type: string;
  platform: string;
  status: string;
  progress: number;
  description: string;
}

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
  services?: ClientService[];
  totalRevenue?: number;
  totalLeads?: number;
}

const demoClients: Client[] = [
  {
    id: "1", name: "João Silva", company: "Studio Digital", email: "joao@studio.com", phone: "(11) 99999-0001", document: "123.456.789-00", type: "pj", status: "active", notes: "Cliente premium — contrato anual",
    created_at: new Date().toISOString(),
    totalRevenue: 8500, totalLeads: 1247,
    services: [
      { id: "s1", type: "Gestão de Tráfego", platform: "Meta Ads", status: "active", progress: 78, description: "Campanhas Facebook e Instagram — gerando leads qualificados com ROAS de 4.2x. Criamos um sistema inteligente que atrai clientes e escala resultados automaticamente." },
      { id: "s2", type: "Copywriting", platform: "Multi", status: "active", progress: 60, description: "Produção de copies persuasivas para anúncios, landing pages, emails e scripts de VSL. Já foram geradas 156 variações com CTR médio de 4.2%." },
      { id: "s3", type: "Google Meu Negócio", platform: "Google Business", status: "active", progress: 92, description: "Otimização completa do perfil GBP — ranking #1 para 'agência marketing digital SP'. 127 avaliações 5 estrelas com IA respondendo automaticamente." },
    ],
  },
  {
    id: "2", name: "Maria Santos", company: "E-commerce Plus", email: "maria@ecommerce.com", phone: "(11) 98888-0002", document: "987.654.321-00", type: "pj", status: "active", notes: "Projeto de escala rápida",
    created_at: new Date().toISOString(),
    totalRevenue: 6000, totalLeads: 834,
    services: [
      { id: "s4", type: "Automação", platform: "n8n", status: "active", progress: 92, description: "12 fluxos de automação ativos: Lead Capture WhatsApp (1247 leads), Follow-up Automático (834 execuções), Sync CRM, Cobrança Inteligente. Sistema operando 24/7 sem intervenção humana." },
      { id: "s5", type: "SEO", platform: "Google", status: "active", progress: 55, description: "SEO técnico e de conteúdo — 250 keywords mapeadas, 35/50 páginas otimizadas, 62/100 backlinks conquistados. Tráfego orgânico cresceu 180% em 3 meses." },
      { id: "s6", type: "Email Marketing", platform: "ActiveCampaign", status: "active", progress: 80, description: "Sequência de 7 emails de boas-vindas, 3 campanhas de nutrição e 2 de reativação. Taxa de abertura: 42%. Conversão: 8.3%." },
    ],
  },
  {
    id: "3", name: "Carlos Lima", company: null, email: "carlos@gmail.com", phone: "(21) 97777-0003", document: null, type: "pf", status: "active", notes: "Negócio local — foco em Google Meu Negócio",
    created_at: new Date().toISOString(),
    totalRevenue: 1800, totalLeads: 310,
    services: [
      { id: "s7", type: "Google Meu Negócio", platform: "Google Business", status: "active", progress: 45, description: "Perfil em otimização — score inicial 42%, atual 78%. 3 posts semanais sendo publicados pela IA. Ranking subiu de #8 para #2 em 'tech solutions SP'. Estratégia de avaliações em andamento." },
    ],
  },
];

export default function ClientsManager() {
  const [clients, setClients] = useState<Client[]>(demoClients);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", document: "", type: "pf", notes: "" });

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => { setForm({ name: "", company: "", email: "", phone: "", document: "", type: "pf", notes: "" }); setEditingClient(null); setShowForm(false); };

  const handleSave = () => {
    if (!form.name) { toast.error("Nome é obrigatório"); return; }
    if (editingClient) {
      setClients(clients.map((c) => c.id === editingClient.id ? { ...c, ...form } : c));
      toast.success("Cliente atualizado");
    } else {
      const newClient: Client = { id: Date.now().toString(), ...form, status: "active", created_at: new Date().toISOString(), services: [], totalRevenue: 0, totalLeads: 0 };
      setClients([newClient, ...clients]);
      toast.success("Cliente cadastrado — designar serviços na aba Serviços");
    }
    resetForm();
  };

  const handleDelete = (client: Client) => { if (!confirm(`Excluir cliente ${client.name}?`)) return; setClients(clients.filter((c) => c.id !== client.id)); toast.success("Cliente excluído"); };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setForm({ name: client.name, company: client.company || "", email: client.email || "", phone: client.phone || "", document: client.document || "", type: client.type, notes: client.notes || "" });
    setShowForm(true);
  };

  // Stats
  const totalRevenue = clients.reduce((a, c) => a + (c.totalRevenue || 0), 0);
  const totalLeads = clients.reduce((a, c) => a + (c.totalLeads || 0), 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <User className="w-7 h-7 text-primary" /> Gestão de Clientes
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Cadastro completo de clientes com serviços designados, produção detalhada e resultados por cliente.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-foreground">{clients.length}</p>
          <p className="text-[10px] text-muted-foreground">Total Clientes</p>
        </div>
        <div className="p-3 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-green-400">{clients.filter(c => c.status === "active").length}</p>
          <p className="text-[10px] text-muted-foreground">Ativos</p>
        </div>
        <div className="p-3 rounded-xl border border-border bg-card text-center">
          <p className="text-lg font-bold text-primary">R${totalRevenue.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">Receita Total/Mês</p>
        </div>
        <div className="p-3 rounded-xl border border-border bg-card text-center">
          <p className="text-2xl font-bold text-accent">{totalLeads.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">Leads Gerados</p>
        </div>
      </div>

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
              <div><label className="text-xs text-muted-foreground mb-1 block">Nome *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
              <div><label className="text-xs text-muted-foreground mb-1 block">Empresa</label><input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground mb-1 block">Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
                <div><label className="text-xs text-muted-foreground mb-1 block">Telefone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground mb-1 block">Documento (CPF/CNPJ)</label><input value={form.document} onChange={(e) => setForm({ ...form, document: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Tipo</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="pf">Pessoa Física</option><option value="pj">Pessoa Jurídica</option>
                  </select>
                </div>
              </div>
              <div><label className="text-xs text-muted-foreground mb-1 block">Observações</label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50" /></div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={resetForm} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* Client Detail Modal */}
      {viewingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" onClick={() => setViewingClient(null)}>
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">{viewingClient.name[0]?.toUpperCase()}</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">{viewingClient.name}</h2>
                  <p className="text-xs text-muted-foreground">{viewingClient.company || "Pessoa Física"} • {viewingClient.email}</p>
                </div>
              </div>
              <button onClick={() => setViewingClient(null)} className="p-1 rounded hover:bg-secondary"><X className="w-4 h-4" /></button>
            </div>

            {/* Client Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 rounded-lg bg-secondary/30 border border-border text-center">
                <p className="text-lg font-bold text-foreground">{viewingClient.services?.length || 0}</p>
                <p className="text-[9px] text-muted-foreground">Serviços Ativos</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30 border border-border text-center">
                <p className="text-lg font-bold text-primary">R${(viewingClient.totalRevenue || 0).toLocaleString()}</p>
                <p className="text-[9px] text-muted-foreground">Receita/Mês</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30 border border-border text-center">
                <p className="text-lg font-bold text-green-400">{(viewingClient.totalLeads || 0).toLocaleString()}</p>
                <p className="text-[9px] text-muted-foreground">Leads Gerados</p>
              </div>
            </div>

            {/* Services */}
            {viewingClient.services && viewingClient.services.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-3">Serviços Designados & Produção</p>
                <div className="space-y-3">
                  {viewingClient.services.map((svc) => (
                    <div key={svc.id} className="p-3 rounded-lg bg-secondary/20 border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-3.5 h-3.5 text-primary" />
                          <span className="text-sm font-semibold text-foreground">{svc.type}</span>
                          <span className="text-[10px] text-primary font-mono">{svc.platform}</span>
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${svc.status === "active" ? "bg-green-500/10 text-green-400" : "bg-secondary text-muted-foreground"}`}>
                            {svc.status === "active" ? "Ativo" : "Inativo"}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground">{svc.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-2">
                        <div className={`h-full rounded-full ${svc.progress > 70 ? "bg-green-400" : svc.progress > 40 ? "bg-primary" : "bg-yellow-400"}`} style={{ width: `${svc.progress}%` }} />
                      </div>
                      <p className="text-xs text-foreground/70 leading-relaxed">{svc.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Clients List */}
      <div className="grid gap-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <User className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Nenhum cliente encontrado</p>
            <p className="text-xs mt-1">Clique em "Novo Cliente" para cadastrar</p>
          </div>
        ) : (
          filtered.map((client) => (
            <div key={client.id} className="rounded-xl border border-border bg-card hover:border-primary/20 transition-all overflow-hidden">
              <div className="flex items-center gap-4 p-4 group">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">{client.name[0]?.toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground truncate">{client.name}</p>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${client.status === "active" ? "bg-green-500/10 text-green-400" : "bg-muted text-muted-foreground"}`}>
                      {client.status === "active" ? "Ativo" : "Inativo"}
                    </span>
                    {client.services && client.services.length > 0 && (
                      <span className="text-[10px] text-primary">{client.services.length} serviço(s)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    {client.company && <span className="flex items-center gap-1 text-xs text-muted-foreground"><Building2 className="w-3 h-3" />{client.company}</span>}
                    {client.email && <span className="flex items-center gap-1 text-xs text-muted-foreground"><Mail className="w-3 h-3" />{client.email}</span>}
                    {client.phone && <span className="flex items-center gap-1 text-xs text-muted-foreground hidden sm:flex"><Phone className="w-3 h-3" />{client.phone}</span>}
                  </div>
                  {client.totalRevenue && client.totalRevenue > 0 && (
                    <div className="flex items-center gap-3 mt-1 text-[10px]">
                      <span className="text-primary flex items-center gap-1"><DollarSign className="w-3 h-3" /> R${client.totalRevenue.toLocaleString()}/mês</span>
                      <span className="text-green-400 flex items-center gap-1"><BarChart3 className="w-3 h-3" /> {client.totalLeads?.toLocaleString()} leads</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setViewingClient(client)} className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors" title="Ver detalhes completos">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => setExpandedId(expandedId === client.id ? null : client.id)} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                    {expandedId === client.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <button onClick={() => handleEdit(client)} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(client)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Expanded Services */}
              {expandedId === client.id && client.services && client.services.length > 0 && (
                <div className="border-t border-border p-4 bg-secondary/10 space-y-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Serviços & Produção do Cliente</p>
                  {client.services.map((svc) => (
                    <div key={svc.id} className="p-3 rounded-lg bg-card border border-border/50 hover:border-primary/20 transition-all">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-foreground">{svc.type}</span>
                          <span className="text-[10px] text-primary font-mono">{svc.platform}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${svc.progress > 70 ? "bg-green-400" : "bg-primary"}`} style={{ width: `${svc.progress}%` }} />
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground">{svc.progress}%</span>
                        </div>
                      </div>
                      <p className="text-xs text-foreground/70 leading-relaxed">{svc.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
