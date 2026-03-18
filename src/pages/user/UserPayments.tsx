import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CreditCard, DollarSign, Check, Clock, AlertTriangle, Crown } from "lucide-react";

export default function UserPayments() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("subscriptions").select("*").limit(1).maybeSingle().then(({ data }) => setSubscription(data));
    supabase.from("financial_records").select("*").order("created_at", { ascending: false }).limit(20)
      .then(({ data }) => setRecords(data || []));
  }, [user]);

  const planLabels: Record<string, string> = { premium: "Premium", pro: "Pro", elite: "Elite", free: "Gratuito" };
  const planPrices: Record<string, string> = { premium: "R$ 297/mês", pro: "R$ 697/mês", elite: "R$ 1.500/mês", free: "R$ 0" };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
          <CreditCard className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Pagamentos & Plano</h1>
          <p className="text-xs text-muted-foreground">Gerencie seu plano e histórico de pagamentos</p>
        </div>
      </div>

      {/* Current Plan */}
      <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 via-card to-accent/5 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="w-8 h-8 text-primary" />
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Plano {planLabels[subscription?.plan || "free"]}
              </h2>
              <p className="text-sm text-muted-foreground">{planPrices[subscription?.plan || "free"]}</p>
            </div>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
            subscription?.status === "active" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
            "bg-amber-500/10 text-amber-400 border border-amber-500/20"
          }`}>{subscription?.status === "active" ? "Ativo" : "Inativo"}</span>
        </div>
        {subscription?.current_period_end && (
          <p className="text-[11px] text-muted-foreground mt-3">
            Próxima renovação: {new Date(subscription.current_period_end).toLocaleDateString("pt-BR")}
          </p>
        )}
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { plan: "premium", price: "R$ 297", features: ["Dashboard DOMINUS", "Lead Scoring", "Alertas IA", "Relatórios Básicos"] },
          { plan: "pro", price: "R$ 697", features: ["Tudo do Premium", "Automações Avançadas", "Agente de Vendas IA", "Suporte Prioritário"] },
          { plan: "elite", price: "R$ 1.500", features: ["Tudo do Pro", "Serviço Incluso", "Consultoria IA", "Acesso Total"] },
        ].map((p) => (
          <div key={p.plan} className={`rounded-xl border p-5 transition-all ${
            subscription?.plan === p.plan ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/20"
          }`}>
            <h3 className="text-sm font-bold text-foreground uppercase">{planLabels[p.plan]}</h3>
            <p className="text-2xl font-bold text-primary mt-1">{p.price}<span className="text-xs text-muted-foreground font-normal">/mês</span></p>
            <ul className="mt-4 space-y-2">
              {p.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="w-3.5 h-3.5 text-green-400" /> {f}
                </li>
              ))}
            </ul>
            {subscription?.plan === p.plan ? (
              <div className="mt-4 text-center text-xs text-primary font-semibold">Plano Atual</div>
            ) : (
              <button className="mt-4 w-full py-2 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-all">
                Fazer Upgrade
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Payment History */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Histórico de Pagamentos</h3>
        <div className="space-y-2">
          {records.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
              className="flex items-center gap-4 p-3 rounded-xl border border-border bg-card">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                r.payment_status === "paid" ? "bg-green-500/10" : "bg-amber-500/10"
              }`}>
                {r.payment_status === "paid" ? <Check className="w-4 h-4 text-green-400" /> : <Clock className="w-4 h-4 text-amber-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{r.description || r.type}</p>
                <p className="text-[10px] text-muted-foreground">{new Date(r.created_at).toLocaleDateString("pt-BR")}</p>
              </div>
              <span className="text-sm font-bold text-foreground">R$ {(r.amount || 0).toLocaleString()}</span>
            </motion.div>
          ))}
          {records.length === 0 && <p className="text-center py-8 text-muted-foreground text-sm">Nenhum pagamento registrado</p>}
        </div>
      </div>
    </div>
  );
}
