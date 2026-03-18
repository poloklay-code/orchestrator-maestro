import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquarePlus, Send, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface UserRequest {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  created_at: string;
}

export default function UserRequests() {
  const [requests, setRequests] = useState<UserRequest[]>([
    { id: "1", title: "Criar campanha Meta Ads", description: "Preciso de uma campanha para o lançamento do produto X", status: "completed", created_at: "2026-03-15" },
    { id: "2", title: "Relatório mensal detalhado", description: "Gostaria de um relatório com métricas de ROI e CPL", status: "in_progress", created_at: "2026-03-17" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;
    setRequests(prev => [{
      id: Date.now().toString(), title, description, status: "pending", created_at: new Date().toISOString().split("T")[0]
    }, ...prev]);
    setTitle(""); setDescription(""); setShowForm(false);
    toast.success("Solicitação enviada com sucesso!");
  };

  const statusConfig = {
    pending: { label: "Pendente", icon: Clock, color: "text-amber-400 bg-amber-500/10" },
    in_progress: { label: "Em Andamento", icon: AlertCircle, color: "text-blue-400 bg-blue-500/10" },
    completed: { label: "Concluído", icon: CheckCircle, color: "text-green-400 bg-green-500/10" },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
            <MessageSquarePlus className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Solicitações</h1>
            <p className="text-xs text-muted-foreground">Envie pedidos e acompanhe o status</p>
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:brightness-110">
          <MessageSquarePlus className="w-3.5 h-3.5" /> Nova Solicitação
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-primary/20 bg-card p-5 space-y-3">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título da solicitação"
            className="w-full h-10 px-4 rounded-lg bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Descreva o que você precisa..."
            className="w-full h-24 px-4 py-3 rounded-lg bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground">Cancelar</button>
            <button onClick={handleSubmit} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
              <Send className="w-3.5 h-3.5" /> Enviar
            </button>
          </div>
        </motion.div>
      )}

      <div className="space-y-2">
        {requests.map((req, i) => {
          const config = statusConfig[req.status];
          const Icon = config.icon;
          return (
            <motion.div key={req.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
              className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-all">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{req.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{req.description}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{req.created_at}</p>
              </div>
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${config.color}`}>{config.label}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
