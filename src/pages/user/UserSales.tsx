import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, TrendingUp, ShoppingCart, ArrowUpRight, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function UserSales() {
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("sales_conversations").select("*").order("created_at", { ascending: false }).limit(50)
      .then(({ data }) => setConversations(data || []));
  }, []);

  const totalRevenue = conversations.reduce((s, c) => s + (c.deal_value || 0), 0);
  const converted = conversations.filter(c => c.status === "converted");
  const convRate = conversations.length > 0 ? ((converted.length / conversations.length) * 100).toFixed(1) : "0";

  const chartData = [
    { name: "Sem 1", vendas: 4200 }, { name: "Sem 2", vendas: 6800 },
    { name: "Sem 3", vendas: 5400 }, { name: "Sem 4", vendas: 9200 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
          <ShoppingCart className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Vendas</h1>
          <p className="text-xs text-muted-foreground">Resultados de vendas do seu negócio</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Receita Total", value: `R$ ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-green-400" },
          { label: "Conversões", value: converted.length.toString(), icon: TrendingUp, color: "text-primary" },
          { label: "Taxa de Conversão", value: `${convRate}%`, icon: ArrowUpRight, color: "text-amber-400" },
          { label: "Em Negociação", value: conversations.filter(c => c.status === "active").length.toString(), icon: Calendar, color: "text-blue-400" },
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

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Vendas por Semana</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} formatter={(v: number) => `R$ ${v.toLocaleString()}`} />
            <Bar dataKey="vendas" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Últimas Negociações</h3>
        {conversations.slice(0, 10).map((conv, i) => (
          <motion.div key={conv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
            className="flex items-center gap-4 p-3 rounded-xl border border-border bg-card">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground">
              {conv.lead_name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{conv.lead_name}</p>
              <p className="text-[10px] text-muted-foreground">{conv.channel} • {conv.messages_count || 0} msgs</p>
            </div>
            <span className="text-sm font-bold text-green-400">R$ {(conv.deal_value || 0).toLocaleString()}</span>
            <span className={`text-[10px] px-2 py-1 rounded-full ${
              conv.status === "converted" ? "bg-green-500/10 text-green-400" :
              conv.status === "active" ? "bg-blue-500/10 text-blue-400" :
              "bg-secondary text-muted-foreground"
            }`}>{conv.status || "Ativo"}</span>
          </motion.div>
        ))}
        {conversations.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">Nenhuma negociação encontrada</div>
        )}
      </div>
    </div>
  );
}
