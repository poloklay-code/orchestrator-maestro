import { useState } from "react";
import { Plus, Search, Store, Trash2, DollarSign, ShoppingCart, Bot, Globe, Sparkles, RefreshCw, Target, Eye, X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

const AFFILIATE_PLATFORMS = [
  "Hotmart", "Monetizze", "Eduzz", "Kiwify", "Braip", "Dig Store", "BuyGoods", "ClickBank", "MaxWeb",
];
const TRAFFIC_TYPES = ["Tráfego Pago", "Tráfego Orgânico", "Ambos"];
const DESTINATIONS = ["E-commerce", "Site/Landing Page", "Instagram", "YouTube", "TikTok", "WhatsApp"];

interface Affiliate {
  id: string; platform: string; product_name: string; product_id: string;
  commission_type: string; commission_value: number; total_sales: number;
  total_revenue: number; status: string; client_name: string;
}

const DEMO_AFFILIATES: Affiliate[] = [
  { id: "1", platform: "Hotmart", product_name: "Curso IA Avancada", product_id: "HOT-001", commission_type: "percentage", commission_value: 40, total_sales: 127, total_revenue: 25400, status: "active", client_name: "Tech Academy" },
  { id: "2", platform: "Kiwify", product_name: "Mentoria Digital", product_id: "KWF-042", commission_type: "percentage", commission_value: 50, total_sales: 89, total_revenue: 17800, status: "active", client_name: "Digital Pro" },
  { id: "3", platform: "Eduzz", product_name: "Pack Templates", product_id: "EDZ-103", commission_type: "fixed", commission_value: 97, total_sales: 45, total_revenue: 4365, status: "active", client_name: "Geral" },
];

export default function AffiliatesManager() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>(DEMO_AFFILIATES);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    platform: "", product_name: "", product_id: "", client_name: "",
    commission_type: "percentage", commission_value: 0,
  });

  const filtered = affiliates.filter(a =>
    a.platform.toLowerCase().includes(search.toLowerCase()) ||
    a.product_name.toLowerCase().includes(search.toLowerCase()) ||
    a.client_name.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = affiliates.reduce((a, b) => a + b.total_revenue, 0);
  const totalSales = affiliates.reduce((a, b) => a + b.total_sales, 0);

  const chartData = AFFILIATE_PLATFORMS.map(p => {
    const platformAff = affiliates.filter(a => a.platform === p);
    return {
      name: p.length > 8 ? p.slice(0, 8) + ".." : p,
      vendas: platformAff.reduce((a, b) => a + b.total_sales, 0),
      receita: platformAff.reduce((a, b) => a + b.total_revenue, 0),
    };
  }).filter(d => d.vendas > 0 || d.receita > 0);

  function handleSave() {
    if (!form.platform) { toast.error("Plataforma obrigatória"); return; }
    const newAff: Affiliate = {
      id: Date.now().toString(), platform: form.platform, product_name: form.product_name,
      product_id: form.product_id, commission_type: form.commission_type,
      commission_value: form.commission_value, total_sales: 0, total_revenue: 0,
      status: "active", client_name: form.client_name || "Geral",
    };
    setAffiliates([newAff, ...affiliates]);
    toast.success("Integração cadastrada");
    setForm({ platform: "", product_name: "", product_id: "", client_name: "", commission_type: "percentage", commission_value: 0 });
    setShowForm(false);
  }

  function handleDelete(aff: Affiliate) {
    setAffiliates(affiliates.filter(a => a.id !== aff.id));
    toast.success("Integração excluída");
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2"><Store className="w-4 h-4 text-primary" /><span className="text-xs text-muted-foreground">Integrações</span></div>
          <p className="text-xl font-bold text-foreground">{affiliates.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2"><ShoppingCart className="w-4 h-4 text-green-400" /><span className="text-xs text-muted-foreground">Total Vendas</span></div>
          <p className="text-xl font-bold text-foreground">{totalSales}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2"><DollarSign className="w-4 h-4 text-yellow-400" /><span className="text-xs text-muted-foreground">Receita Total</span></div>
          <p className="text-xl font-bold text-foreground">R$ {totalRevenue.toLocaleString("pt-BR")}</p>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Vendas por Plataforma</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(230 15% 16%)" />
              <XAxis dataKey="name" tick={{ fill: "hsl(230 10% 55%)", fontSize: 10 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(230 10% 55%)", fontSize: 10 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(230 25% 10%)", border: "1px solid hsl(230 15% 18%)", borderRadius: "8px", color: "hsl(230 10% 93%)" }} />
              <Bar dataKey="vendas" fill="hsl(195 90% 45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Search + Add */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar integracoes..."
            className="w-full h-10 bg-card border border-border rounded-lg pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> Nova Integração
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-foreground">Nova Integração Afiliado</h2>
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Plataforma *</label>
                  <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}
                    className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground">
                    <option value="">Selecionar</option>
                    {AFFILIATE_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Cliente</label>
                  <input value={form.client_name} onChange={e => setForm({ ...form, client_name: e.target.value })}
                    className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground" placeholder="Geral" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Nome do Produto</label>
                  <input value={form.product_name} onChange={e => setForm({ ...form, product_name: e.target.value })}
                    className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">ID do Produto</label>
                  <input value={form.product_id} onChange={e => setForm({ ...form, product_id: e.target.value })}
                    className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Tipo Comissão</label>
                  <select value={form.commission_type} onChange={e => setForm({ ...form, commission_type: e.target.value })}
                    className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground">
                    <option value="percentage">Percentual</option>
                    <option value="fixed">Fixo (CPA)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Valor</label>
                  <input type="number" value={form.commission_value} onChange={e => setForm({ ...form, commission_value: Number(e.target.value) })}
                    className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground" />
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

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Store className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Nenhuma integração de afiliado encontrada</p>
          </div>
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
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                  <span>{aff.client_name}</span>
                  <span>{aff.total_sales} vendas</span>
                  <span className="text-green-400">R$ {aff.total_revenue.toLocaleString("pt-BR")}</span>
                  <span>{aff.commission_value}{aff.commission_type === "percentage" ? "%" : " fixo"}</span>
                </div>
              </div>
              <button onClick={() => handleDelete(aff)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
