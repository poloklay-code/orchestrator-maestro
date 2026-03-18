import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Megaphone, TrendingUp, DollarSign, Eye, Target } from "lucide-react";

export default function UserCampaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("autoscale_campaigns").select("*").order("created_at", { ascending: false }).limit(50)
      .then(({ data }) => setCampaigns(data || []));
  }, []);

  const totalBudget = campaigns.reduce((s, c) => s + (c.budget || 0), 0);
  const totalLeads = campaigns.reduce((s, c) => s + (c.leads || 0), 0);
  const avgRoas = campaigns.length > 0 ? (campaigns.reduce((s, c) => s + (c.roas || 0), 0) / campaigns.length).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
          <Megaphone className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Campanhas</h1>
          <p className="text-xs text-muted-foreground">Visão das suas campanhas ativas (somente leitura)</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Campanhas Ativas", value: campaigns.filter(c => c.status === "active" || c.status === "monitoring").length, icon: Megaphone, color: "text-purple-400" },
          { label: "Investimento", value: `R$ ${totalBudget.toLocaleString()}`, icon: DollarSign, color: "text-green-400" },
          { label: "Leads Gerados", value: totalLeads, icon: Target, color: "text-primary" },
          { label: "ROAS Médio", value: `${avgRoas}x`, icon: TrendingUp, color: "text-amber-400" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-border bg-card p-4">
              <Icon className={`w-5 h-5 ${s.color} mb-2`} />
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="space-y-2">
        {campaigns.map((camp, i) => (
          <motion.div key={camp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Megaphone className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{camp.name}</p>
                  <p className="text-[10px] text-muted-foreground">{camp.platform}</p>
                </div>
              </div>
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${
                camp.status === "active" || camp.status === "monitoring" ? "bg-green-500/10 text-green-400" :
                camp.status === "paused" ? "bg-amber-500/10 text-amber-400" :
                "bg-secondary text-muted-foreground"
              }`}>{camp.status || "Ativo"}</span>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-3">
              <div><p className="text-[10px] text-muted-foreground">Budget</p><p className="text-xs font-bold text-foreground">R$ {(camp.budget || 0).toLocaleString()}</p></div>
              <div><p className="text-[10px] text-muted-foreground">Leads</p><p className="text-xs font-bold text-foreground">{camp.leads || 0}</p></div>
              <div><p className="text-[10px] text-muted-foreground">CPL</p><p className="text-xs font-bold text-foreground">R$ {(camp.cpl || 0).toFixed(2)}</p></div>
              <div><p className="text-[10px] text-muted-foreground">ROAS</p><p className="text-xs font-bold text-foreground">{(camp.roas || 0).toFixed(1)}x</p></div>
            </div>
          </motion.div>
        ))}
        {campaigns.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm">
            <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-20" />
            Nenhuma campanha ativa no momento
          </div>
        )}
      </div>
    </div>
  );
}
