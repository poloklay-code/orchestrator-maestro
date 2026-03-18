import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Download, Calendar, Eye } from "lucide-react";

export default function UserReports() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("reports").select("*").order("created_at", { ascending: false }).limit(50)
      .then(({ data }) => setReports(data || []));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
          <FileText className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Relatórios</h1>
          <p className="text-xs text-muted-foreground">Relatórios de performance gerados pela IA</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total", value: reports.length, color: "text-primary" },
          { label: "Enviados", value: reports.filter(r => r.status === "sent").length, color: "text-green-400" },
          { label: "Pendentes", value: reports.filter(r => r.status === "draft").length, color: "text-amber-400" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {reports.map((report, i) => (
          <motion.div key={report.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
            className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-all">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{report.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-muted-foreground">{report.type}</span>
                {report.period_start && <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />{report.period_start}</span>}
              </div>
            </div>
            <span className={`text-[10px] px-2 py-1 rounded-full ${
              report.status === "sent" ? "bg-green-500/10 text-green-400" : "bg-secondary text-muted-foreground"
            }`}>{report.status === "sent" ? "Enviado" : "Rascunho"}</span>
            {report.pdf_url && (
              <a href={report.pdf_url} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground">
                <Download className="w-4 h-4" />
              </a>
            )}
          </motion.div>
        ))}
        {reports.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
            Nenhum relatório disponível ainda
          </div>
        )}
      </div>
    </div>
  );
}
