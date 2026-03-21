import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Package, Lock, Unlock, Zap, TrendingUp, Brain, Eye, MapPin, MessageCircle, PenTool, Rocket, Bot, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

const iconMap: Record<string, any> = { TrendingUp, Brain, Eye, MapPin, MessageCircle, PenTool, Rocket, Bot, Zap, Package };

export default function UserServices() {
  const { user } = useAuth();
  const [modules, setModules] = useState<any[]>([]);
  const [myModules, setMyModules] = useState<any[]>([]);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [activating, setActivating] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single();
      if (profile?.tenant_id) {
        setTenantId(profile.tenant_id);
        const [{ data: mods }, { data: mySubs }] = await Promise.all([
          supabase.from("modules").select("*").eq("is_active", true).order("price"),
          supabase.from("module_subscriptions").select("*, modules(*)").eq("tenant_id", profile.tenant_id),
        ]);
        setModules(mods || []);
        setMyModules(mySubs || []);
      }
    };
    load();
  }, [user]);

  const isActive = (moduleId: string) => myModules.some(m => m.module_id === moduleId && m.status === "active");
  const isSuspended = (moduleId: string) => myModules.some(m => m.module_id === moduleId && m.status === "suspended");

  const activate = async (mod: any) => {
    if (!tenantId) return;
    setActivating(mod.id);
    try {
      // Create module subscription
      await supabase.from("module_subscriptions").upsert({
        tenant_id: tenantId,
        module_id: mod.id,
        price: mod.price,
        status: "active",
        next_billing_date: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      }, { onConflict: "tenant_id,module_id" });

      // Create invoice
      await supabase.from("invoices").insert({
        tenant_id: tenantId,
        amount: mod.price,
        status: "pending",
        description: `Ativação: ${mod.name}`,
        due_date: new Date().toISOString().split("T")[0],
        reference_type: "module_subscription",
      });

      toast.success(`${mod.name} ativado com sucesso!`);

      // Reload
      const { data: mySubs } = await supabase.from("module_subscriptions").select("*, modules(*)").eq("tenant_id", tenantId);
      setMyModules(mySubs || []);
    } catch (e) {
      toast.error("Erro ao ativar módulo");
    }
    setActivating(null);
  };

  const activeCount = myModules.filter(m => m.status === "active").length;
  const totalMensal = myModules.filter(m => m.status === "active").reduce((s, m) => s + (m.price || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <Package className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Meus Serviços</h1>
          <p className="text-xs text-muted-foreground">Gerencie seus módulos ativos e ative novos</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <span className="text-[10px] text-muted-foreground uppercase">Módulos Ativos</span>
          <p className="text-2xl font-bold text-primary mt-1">{activeCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <span className="text-[10px] text-muted-foreground uppercase">Total Mensal</span>
          <p className="text-2xl font-bold text-green-400 mt-1">R$ {totalMensal.toLocaleString()}</p>
        </div>
      </div>

      {/* Modules */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((m, i) => {
          const active = isActive(m.id);
          const suspended = isSuspended(m.id);
          const Icon = iconMap[m.icon] || Package;
          return (
            <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className={`rounded-xl border p-5 transition-all ${
                active ? "border-green-500/30 bg-green-500/5" :
                suspended ? "border-amber-500/30 bg-amber-500/5" :
                "border-border bg-card hover:border-primary/20"
              }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  active ? "bg-green-500/10 border-green-500/20" :
                  suspended ? "bg-amber-500/10 border-amber-500/20" :
                  "bg-secondary border-border"
                }`}>
                  <Icon className={`w-5 h-5 ${active ? "text-green-400" : suspended ? "text-amber-400" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-foreground">{m.name}</h3>
                  <span className={`text-[10px] font-semibold uppercase ${
                    active ? "text-green-400" : suspended ? "text-amber-400" : "text-muted-foreground"
                  }`}>
                    {active ? "✓ ATIVO" : suspended ? "⚠ SUSPENSO" : "DISPONÍVEL"}
                  </span>
                </div>
                {active ? <Unlock className="w-4 h-4 text-green-400" /> : <Lock className="w-4 h-4 text-muted-foreground" />}
              </div>

              <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{m.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">R$ {m.price}<span className="text-xs text-muted-foreground font-normal">/mês</span></span>
                {active ? (
                  <span className="px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg text-[10px] font-semibold border border-green-500/20">
                    <Check className="w-3 h-3 inline mr-1" /> Ativo
                  </span>
                ) : (
                  <button onClick={() => activate(m)} disabled={activating === m.id}
                    className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-[10px] font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all">
                    {activating === m.id ? <Loader2 className="w-3 h-3 animate-spin inline mr-1" /> : <Zap className="w-3 h-3 inline mr-1" />}
                    Ativar Agora
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
