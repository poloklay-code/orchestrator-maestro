import { useState } from "react";
import { Key, Plus, Eye, EyeOff, RefreshCw, Trash2, Zap, Shield } from "lucide-react";
import { toast } from "sonner";

const API_PLATFORMS = [
  { name: "OpenAI", prefix: "sk-", category: "IA", color: "hsl(160 69% 35%)" },
  { name: "Google Cloud", prefix: "AIza", category: "IA / Servicos", color: "hsl(217 89% 61%)" },
  { name: "Anthropic (Claude)", prefix: "sk-ant-", category: "IA", color: "hsl(20 65% 59%)" },
  { name: "Meta Ads", prefix: "", category: "Trafego", color: "hsl(214 89% 52%)" },
  { name: "Google Ads", prefix: "", category: "Trafego", color: "hsl(142 53% 42%)" },
  { name: "TikTok Ads", prefix: "", category: "Trafego", color: "hsl(340 100% 50%)" },
  { name: "Hotmart", prefix: "", category: "Afiliados", color: "hsl(10 90% 52%)" },
  { name: "Monetizze", prefix: "", category: "Afiliados", color: "hsl(193 90% 43%)" },
  { name: "Eduzz", prefix: "", category: "Afiliados", color: "hsl(20 100% 60%)" },
  { name: "Kiwify", prefix: "", category: "Afiliados", color: "hsl(245 96% 60%)" },
  { name: "Braip", prefix: "", category: "Afiliados", color: "hsl(145 100% 39%)" },
  { name: "n8n", prefix: "", category: "Automacao", color: "hsl(8 100% 67%)" },
  { name: "Make (Integromat)", prefix: "", category: "Automacao", color: "hsl(261 100% 61%)" },
  { name: "ManyChat", prefix: "", category: "Automacao", color: "hsl(211 100% 50%)" },
  { name: "Zapier", prefix: "", category: "Automacao", color: "hsl(16 100% 50%)" },
  { name: "WhatsApp Business", prefix: "", category: "Mensageria", color: "hsl(142 70% 49%)" },
  { name: "Twilio", prefix: "", category: "Mensageria", color: "hsl(350 91% 62%)" },
  { name: "SendGrid", prefix: "SG.", category: "Email", color: "hsl(207 77% 49%)" },
  { name: "Stripe", prefix: "sk_", category: "Pagamentos", color: "hsl(245 85% 67%)" },
  { name: "ElevenLabs", prefix: "", category: "IA", color: "hsl(0 0% 20%)" },
  { name: "Stability AI", prefix: "", category: "IA", color: "hsl(271 91% 65%)" },
  { name: "Supabase", prefix: "", category: "Infraestrutura", color: "hsl(153 67% 53%)" },
];

type ApiKey = {
  id: string; platform: string; key_name: string; api_key: string;
  status: string; last_synced: string | null; created_at: string;
};

const DEMO_KEYS: ApiKey[] = [
  { id: "1", platform: "OpenAI", key_name: "Conta Principal", api_key: "sk-proj-abc123...xyz789", status: "active", last_synced: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "2", platform: "n8n", key_name: "Servidor Automacoes", api_key: "n8n_api_key_demo_456", status: "active", last_synced: new Date(Date.now() - 3600000).toISOString(), created_at: new Date().toISOString() },
  { id: "3", platform: "WhatsApp Business", key_name: "API Oficial", api_key: "EAAG...demo...token", status: "pending", last_synced: null, created_at: new Date().toISOString() },
];

export default function ApiKeysPanel() {
  const [keys, setKeys] = useState<ApiKey[]>(DEMO_KEYS);
  const [showForm, setShowForm] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [syncing, setSyncing] = useState<string | null>(null);
  const [form, setForm] = useState({ platform: "", key_name: "", api_key: "" });

  function handleSave() {
    if (!form.platform || !form.api_key) { toast.error("Preencha plataforma e chave de API"); return; }
    const newKey: ApiKey = {
      id: Date.now().toString(), platform: form.platform, key_name: form.key_name || form.platform,
      api_key: form.api_key, status: "pending", last_synced: null, created_at: new Date().toISOString(),
    };
    setKeys([newKey, ...keys]);
    toast.success(`Chave da ${form.platform} salva com sucesso`);
    setForm({ platform: "", key_name: "", api_key: "" });
    setShowForm(false);
  }

  function handleSync(key: ApiKey) {
    setSyncing(key.id);
    setTimeout(() => {
      setKeys(prev => prev.map(k => k.id === key.id ? { ...k, status: "active", last_synced: new Date().toISOString() } : k));
      toast.success(`${key.platform} sincronizada com sucesso!`);
      setSyncing(null);
    }, 2000);
  }

  function handleDelete(id: string) {
    setKeys(prev => prev.filter(k => k.id !== id));
    toast.success("Chave removida");
  }

  function maskKey(key: string) { return key.length > 12 ? key.slice(0, 8) + "..." + key.slice(-4) : "••••••••"; }
  function toggleVisible(id: string) { setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] })); }
  function getPlatformInfo(name: string) { return API_PLATFORMS.find(p => p.name === name); }

  const groupedByCategory = keys.reduce((acc, key) => {
    const info = getPlatformInfo(key.platform);
    const cat = info?.category || "Outros";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(key);
    return acc;
  }, {} as Record<string, ApiKey[]>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><Key className="w-5 h-5 text-primary" /> Chaves de API</h2>
          <p className="text-xs text-muted-foreground mt-1">Insira as chaves e o sistema sincroniza automaticamente para iniciar os servicos</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90">
          <Plus className="w-3.5 h-3.5" /> Nova Chave de API
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total de Chaves</p>
          <p className="text-2xl font-bold text-foreground mt-1">{keys.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Ativas</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{keys.filter(k => k.status === "active").length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Plataformas</p>
          <p className="text-2xl font-bold text-primary mt-1">{new Set(keys.map(k => k.platform)).size}</p>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-sm font-bold text-foreground">Adicionar Chave de API</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Plataforma *</label>
                <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}
                  className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground mt-1">
                  <option value="">Selecione</option>
                  {API_PLATFORMS.map(p => <option key={p.name} value={p.name}>{p.name} ({p.category})</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Nome (opcional)</label>
                <input value={form.key_name} onChange={e => setForm({ ...form, key_name: e.target.value })}
                  className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground mt-1" placeholder="Ex: Conta principal" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Chave de API *</label>
                <input value={form.api_key} onChange={e => setForm({ ...form, api_key: e.target.value })}
                  className="w-full h-10 bg-secondary border border-border rounded-lg px-3 text-sm font-mono text-foreground mt-1" placeholder="sk-..." />
                {form.platform && getPlatformInfo(form.platform)?.prefix && (
                  <p className="text-[10px] text-muted-foreground mt-1">Formato esperado: {getPlatformInfo(form.platform)?.prefix}...</p>
                )}
              </div>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <div className="flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-primary" /><p className="text-[10px] text-primary font-semibold">Sincronizacao Automatica</p></div>
                <p className="text-[10px] text-muted-foreground mt-1">Ao salvar, o sistema valida e sincroniza a chave com a plataforma.</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Salvar e Sincronizar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keys List */}
      {Object.keys(groupedByCategory).length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <Key className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-sm text-muted-foreground">Nenhuma chave cadastrada. Adicione sua primeira chave de API.</p>
        </div>
      ) : (
        Object.entries(groupedByCategory).map(([category, catKeys]) => (
          <div key={category} className="rounded-xl border border-border bg-card">
            <div className="px-4 py-3 border-b border-border"><h4 className="text-sm font-semibold text-foreground">{category}</h4></div>
            <div className="p-3 space-y-2">
              {catKeys.map(key => {
                const info = getPlatformInfo(key.platform);
                return (
                  <div key={key.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10">
                        <Key className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium text-foreground">{key.platform}</p>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${key.status === "active" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                            {key.status === "active" ? "Ativa" : "Pendente"}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-mono">{visibleKeys[key.id] ? key.api_key : maskKey(key.api_key)}</p>
                        {key.last_synced && <p className="text-[9px] text-muted-foreground">Sync: {new Date(key.last_synced).toLocaleString("pt-BR")}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => toggleVisible(key.id)} className="p-1.5 rounded text-muted-foreground hover:text-foreground">
                        {visibleKeys[key.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => handleSync(key)} disabled={syncing === key.id} className="p-1.5 rounded text-primary hover:text-foreground">
                        <RefreshCw className={`w-3.5 h-3.5 ${syncing === key.id ? "animate-spin" : ""}`} />
                      </button>
                      <button onClick={() => handleDelete(key.id)} className="p-1.5 rounded text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
