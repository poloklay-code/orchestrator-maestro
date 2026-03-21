import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Package, Plus, Edit2, Trash2, DollarSign, Zap, Check, X, TrendingUp, Brain, Eye, MapPin, MessageCircle, PenTool, Rocket, Bot } from "lucide-react";
import { toast } from "sonner";

const iconMap: Record<string, any> = { TrendingUp, Brain, Eye, MapPin, MessageCircle, PenTool, Rocket, Bot, Zap, Package };

export default function AdminModules() {
  const [modules, setModules] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [stats, setStats] = useState({ mrr: 0, activeClients: 0, pendingInvoices: 0, totalRevenue: 0 });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "", price: 0, category: "addon", icon: "Zap" });
  const [editId, setEditId] = useState<string | null>(null);

  const load = async () => {
    const [{ data: mods }, { data: pls }, { data: modSubs }, { data: invs }] = await Promise.all([
      supabase.from("modules").select("*").order("created_at"),
      supabase.from("plans").select("*").order("price"),
      supabase.from("module_subscriptions").select("*").eq("status", "active"),
      supabase.from("invoices").select("*"),
    ]);
    setModules(mods || []);
    setPlans(pls || []);
    const mrr = (modSubs || []).reduce((s, m) => s + (m.price || 0), 0);
    const pending = (invs || []).filter(i => i.status === "pending").length;
    const totalRev = (invs || []).filter(i => i.status === "paid").reduce((s, i) => s + (i.amount || 0), 0);
    setStats({ mrr, activeClients: (modSubs || []).length, pendingInvoices: pending, totalRevenue: totalRev });
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.name || !form.slug) { toast.error("Nome e slug obrigatórios"); return; }
    if (editId) {
      await supabase.from("modules").update(form).eq("id", editId);
      toast.success("Módulo atualizado");
    } else {
      await supabase.from("modules").insert(form);
      toast.success("Módulo criado");
    }
    setShowForm(false);
    setEditId(null);
    setForm({ name: "", slug: "", description: "", price: 0, category: "addon", icon: "Zap" });
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("modules").delete().eq("id", id);
    toast.success("Módulo removido");
    load();
  };

  const edit = (m: any) => {
    setForm({ name: m.name, slug: m.slug, description: m.description || "", price: m.price, category: m.category, icon: m.icon });
    setEditId(m.id);
    setShowForm(true);
  };

  const statCards = [
    { label: "MRR", value: `R$ ${stats.mrr.toLocaleString()}`, icon: DollarSign, color: "text-green-400" },
    { label: "Módulos Ativos", value: stats.activeClients, icon: Package, color: "text-primary" },
    { label: "Faturas Pendentes", value: stats.pendingInvoices, icon: Zap, color: "text-amber-400" },
    { label: "Receita Total", value: `R$ ${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-cyan-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Módulos & Receita</h1>
            <p className="text-xs text-muted-foreground">Gerencie módulos pagos, planos e cobrança automática</p>
          </div>
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm({ name: "", slug: "", description: "", price: 0, category: "addon", icon: "Zap" }); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Novo Módulo
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</span>
            </div>
            <p className="text-xl font-bold text-foreground">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
          className="rounded-xl border border-primary/20 bg-card p-5 space-y-4">
          <h3 className="text-sm font-bold text-foreground">{editId ? "Editar" : "Novo"} Módulo</h3>
          <div className="grid md:grid-cols-3 gap-3">
            <input placeholder="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground" />
            <input placeholder="Slug (ex: trafego)" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground" />
            <input type="number" placeholder="Preço" value={form.price} onChange={e => setForm({ ...form, price: +e.target.value })}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground" />
          </div>
          <textarea placeholder="Descrição" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground" rows={2} />
          <div className="flex gap-2">
            <button onClick={save} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold">
              <Check className="w-3.5 h-3.5 inline mr-1" /> Salvar
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-secondary text-foreground rounded-lg text-xs">
              <X className="w-3.5 h-3.5 inline mr-1" /> Cancelar
            </button>
          </div>
        </motion.div>
      )}

      {/* Modules Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((m, i) => {
          const Icon = iconMap[m.icon] || Package;
          return (
            <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="rounded-xl border border-border bg-card p-5 hover:border-primary/20 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{m.name}</h3>
                    <span className="text-[10px] text-muted-foreground uppercase">{m.category}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => edit(m)} className="p-1.5 rounded-lg hover:bg-secondary"><Edit2 className="w-3.5 h-3.5 text-muted-foreground" /></button>
                  <button onClick={() => remove(m.id)} className="p-1.5 rounded-lg hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{m.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">R$ {m.price}<span className="text-xs text-muted-foreground font-normal">/mês</span></span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${m.is_active ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                  {m.is_active ? "ATIVO" : "INATIVO"}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Plans */}
      <div>
        <h2 className="text-sm font-bold text-foreground mb-3">Planos Base</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map(p => (
            <div key={p.id} className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-bold text-foreground uppercase">{p.name}</h3>
              <p className="text-2xl font-bold text-primary mt-1">R$ {p.price}<span className="text-xs text-muted-foreground font-normal">/mês</span></p>
              <p className="text-xs text-muted-foreground mt-2">{p.description}</p>
              <ul className="mt-3 space-y-1">
                {(p.features || []).map((f: string) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="w-3 h-3 text-green-400" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
