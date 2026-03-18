import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Users, Flame, Thermometer, Snowflake, Search, Eye } from "lucide-react";

export default function UserLeads() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadLeads();
  }, [user]);

  const loadLeads = async () => {
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(100);
    setLeads(data || []);
  };

  const filtered = leads.filter(l => {
    const matchSearch = l.name?.toLowerCase().includes(search.toLowerCase()) || l.email?.toLowerCase().includes(search.toLowerCase());
    if (filter === "all") return matchSearch;
    return matchSearch && l.status === filter;
  });

  const getScoreIcon = (score: number) => {
    if (score >= 70) return <Flame className="w-3.5 h-3.5 text-red-400" />;
    if (score >= 40) return <Thermometer className="w-3.5 h-3.5 text-amber-400" />;
    return <Snowflake className="w-3.5 h-3.5 text-blue-400" />;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return "Quente";
    if (score >= 40) return "Morno";
    return "Frio";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Meus Leads</h1>
          <p className="text-xs text-muted-foreground">Leads gerados e qualificados pela IA</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total", value: leads.length, color: "text-primary" },
          { label: "Quentes", value: leads.filter(l => (l.score || 0) >= 70).length, color: "text-red-400" },
          { label: "Mornos", value: leads.filter(l => (l.score || 0) >= 40 && (l.score || 0) < 70).length, color: "text-amber-400" },
          { label: "Frios", value: leads.filter(l => (l.score || 0) < 40).length, color: "text-blue-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar leads..."
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        {["all", "new", "contacted", "qualified", "converted"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${filter === f ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:text-foreground"}`}>
            {f === "all" ? "Todos" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Leads List */}
      <div className="space-y-2">
        {filtered.map((lead, i) => (
          <motion.div key={lead.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-all">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-foreground">
              {lead.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{lead.name}</p>
              <p className="text-[11px] text-muted-foreground truncate">{lead.email || lead.phone || "Sem contato"}</p>
            </div>
            <div className="flex items-center gap-1.5">
              {getScoreIcon(lead.score || 0)}
              <span className="text-[10px] font-medium text-muted-foreground">{getScoreLabel(lead.score || 0)}</span>
            </div>
            <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${
              lead.status === "qualified" ? "bg-green-500/10 text-green-400" :
              lead.status === "contacted" ? "bg-blue-500/10 text-blue-400" :
              "bg-secondary text-muted-foreground"
            }`}>{lead.status || "Novo"}</span>
            <span className="text-[10px] text-muted-foreground">{lead.source || "—"}</span>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">Nenhum lead encontrado</div>
        )}
      </div>
    </div>
  );
}
