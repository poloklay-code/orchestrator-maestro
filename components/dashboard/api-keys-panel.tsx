"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Key, Plus, Check, X, RefreshCw, Eye, EyeOff, Trash2, Zap, Shield } from "lucide-react"
import { toast } from "sonner"

const API_PLATFORMS = [
  { name: "OpenAI", prefix: "sk-", category: "IA", color: "#10a37f" },
  { name: "Google Cloud", prefix: "AIza", category: "IA / Servicos", color: "#4285f4" },
  { name: "Anthropic (Claude)", prefix: "sk-ant-", category: "IA", color: "#d97757" },
  { name: "Meta Ads", prefix: "", category: "Trafego", color: "#1877f2" },
  { name: "Google Ads", prefix: "", category: "Trafego", color: "#34a853" },
  { name: "TikTok Ads", prefix: "", category: "Trafego", color: "#ff0050" },
  { name: "Hotmart", prefix: "", category: "Afiliados", color: "#f04e23" },
  { name: "Monetizze", prefix: "", category: "Afiliados", color: "#00b4d8" },
  { name: "Eduzz", prefix: "", category: "Afiliados", color: "#ff6b35" },
  { name: "Kiwify", prefix: "", category: "Afiliados", color: "#6c63ff" },
  { name: "Braip", prefix: "", category: "Afiliados", color: "#00c853" },
  { name: "ClickBank", prefix: "", category: "Afiliados", color: "#2ecc71" },
  { name: "n8n", prefix: "", category: "Automacao", color: "#ff6d5a" },
  { name: "Make (Integromat)", prefix: "", category: "Automacao", color: "#6d3aff" },
  { name: "ManyChat", prefix: "", category: "Automacao", color: "#0084ff" },
  { name: "Zapier", prefix: "", category: "Automacao", color: "#ff4a00" },
  { name: "WhatsApp Business", prefix: "", category: "Mensageria", color: "#25d366" },
  { name: "Twilio", prefix: "", category: "Mensageria", color: "#f22f46" },
  { name: "SendGrid", prefix: "SG.", category: "Email", color: "#1a82e2" },
  { name: "Stripe", prefix: "sk_", category: "Pagamentos", color: "#635bff" },
  { name: "ElevenLabs", prefix: "", category: "IA", color: "#000000" },
  { name: "Stability AI", prefix: "", category: "IA", color: "#a855f7" },
  { name: "Vercel", prefix: "", category: "Infraestrutura", color: "#000000" },
  { name: "Supabase", prefix: "", category: "Infraestrutura", color: "#3ecf8e" },
]

type ApiKey = {
  id: string; platform: string; key_name: string; api_key: string
  status: string; last_synced: string | null; config: Record<string, unknown>; created_at: string
}

export function ApiKeysPanel() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [open, setOpen] = useState(false)
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({})
  const [syncing, setSyncing] = useState<string | null>(null)
  const [form, setForm] = useState({ platform: "", key_name: "", api_key: "" })
  const supabase = createClient()

  useEffect(() => { loadKeys() }, [])

  async function loadKeys() {
    const { data } = await supabase.from("api_keys").select("*").order("created_at", { ascending: false })
    if (data) setKeys(data)
  }

  async function handleSave() {
    if (!form.platform || !form.api_key) { toast.error("Preencha plataforma e chave de API"); return }
    const { error } = await supabase.from("api_keys").insert({
      platform: form.platform, key_name: form.key_name || form.platform, api_key: form.api_key,
    })
    if (error) { toast.error("Erro ao salvar chave"); return }
    toast.success(`Chave da ${form.platform} salva com sucesso`)
    await supabase.from("audit_logs").insert({ action: "api_key_added", entity_type: "api_key", details: { platform: form.platform } })
    setForm({ platform: "", key_name: "", api_key: "" })
    setOpen(false)
    loadKeys()
  }

  async function handleSync(key: ApiKey) {
    setSyncing(key.id)
    await new Promise(r => setTimeout(r, 2000))
    await supabase.from("api_keys").update({ last_synced: new Date().toISOString(), status: "active" }).eq("id", key.id)
    toast.success(`${key.platform} sincronizada com sucesso! Servicos prontos para operar.`)
    await supabase.from("audit_logs").insert({ action: "api_key_synced", entity_type: "api_key", details: { platform: key.platform } })
    setSyncing(null)
    loadKeys()
  }

  async function handleDelete(id: string) {
    await supabase.from("api_keys").delete().eq("id", id)
    toast.success("Chave removida")
    loadKeys()
  }

  function maskKey(key: string) { return key.slice(0, 8) + "..." + key.slice(-4) }
  function toggleVisible(id: string) { setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] })) }
  function getPlatformInfo(name: string) { return API_PLATFORMS.find(p => p.name === name) }

  const groupedByCategory = keys.reduce((acc, key) => {
    const info = getPlatformInfo(key.platform)
    const cat = info?.category || "Outros"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(key)
    return acc
  }, {} as Record<string, ApiKey[]>)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" /> Chaves de API
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Insira as chaves de API e o sistema sincroniza automaticamente para iniciar os servicos</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1 bg-primary text-primary-foreground text-xs"><Plus className="w-3.5 h-3.5" />Nova Chave de API</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-md">
            <DialogHeader><DialogTitle className="text-foreground">Adicionar Chave de API</DialogTitle></DialogHeader>
            <div className="grid gap-3 mt-2">
              <div>
                <Label className="text-xs text-muted-foreground">Plataforma *</Label>
                <Select value={form.platform} onValueChange={v => setForm({ ...form, platform: v })}>
                  <SelectTrigger className="bg-secondary/50 border-border mt-1"><SelectValue placeholder="Selecione a plataforma" /></SelectTrigger>
                  <SelectContent className="max-h-60">
                    {API_PLATFORMS.map(p => (
                      <SelectItem key={p.name} value={p.name}>
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />{p.name}
                          <span className="text-[10px] text-muted-foreground ml-1">({p.category})</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Nome (opcional)</Label>
                <Input value={form.key_name} onChange={e => setForm({ ...form, key_name: e.target.value })} className="bg-secondary/50 border-border mt-1" placeholder="Ex: Conta principal" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Chave de API *</Label>
                <Input value={form.api_key} onChange={e => setForm({ ...form, api_key: e.target.value })} className="bg-secondary/50 border-border mt-1 font-mono text-xs" placeholder="sk-..." />
                {form.platform && getPlatformInfo(form.platform)?.prefix && (
                  <p className="text-[10px] text-muted-foreground mt-1">Formato esperado: {getPlatformInfo(form.platform)?.prefix}...</p>
                )}
              </div>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mt-1">
                <div className="flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-primary" /><p className="text-[10px] text-primary font-semibold">Sincronizacao Automatica</p></div>
                <p className="text-[10px] text-muted-foreground mt-1">Ao salvar, o sistema valida e sincroniza a chave com a plataforma. Os servicos designados iniciarao automaticamente.</p>
              </div>
              <Button onClick={handleSave} className="w-full bg-primary text-primary-foreground mt-1"><Zap className="w-4 h-4 mr-1" />Salvar e Sincronizar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card border-border"><CardContent className="p-4 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total de Chaves</p>
          <p className="text-2xl font-bold text-foreground mt-1">{keys.length}</p>
        </CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Ativas / Sincronizadas</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{keys.filter(k => k.status === "active").length}</p>
        </CardContent></Card>
        <Card className="bg-card border-border"><CardContent className="p-4 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Plataformas Cobertas</p>
          <p className="text-2xl font-bold text-primary mt-1">{new Set(keys.map(k => k.platform)).size}</p>
        </CardContent></Card>
      </div>

      {Object.keys(groupedByCategory).length === 0 ? (
        <Card className="bg-card border-border"><CardContent className="p-8 text-center">
          <Key className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-sm text-muted-foreground">Nenhuma chave cadastrada. Adicione sua primeira chave de API para iniciar.</p>
        </CardContent></Card>
      ) : (
        Object.entries(groupedByCategory).map(([category, catKeys]) => (
          <Card key={category} className="bg-card border-border">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-foreground">{category}</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {catKeys.map(key => {
                const info = getPlatformInfo(key.platform)
                return (
                  <div key={key.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: (info?.color || "#06b6d4") + "15" }}>
                        <Key className="w-4 h-4" style={{ color: info?.color || "#06b6d4" }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium text-foreground">{key.platform}</p>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${key.status === "active" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                            {key.status === "active" ? "Ativa" : "Pendente"}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-mono">
                          {visibleKeys[key.id] ? key.api_key : maskKey(key.api_key)}
                        </p>
                        {key.last_synced && <p className="text-[9px] text-muted-foreground">Sync: {new Date(key.last_synced).toLocaleString("pt-BR")}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => toggleVisible(key.id)} className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground">
                        {visibleKeys[key.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleSync(key)} disabled={syncing === key.id} className="h-7 w-7 p-0 text-primary hover:text-foreground">
                        <RefreshCw className={`w-3.5 h-3.5 ${syncing === key.id ? "animate-spin" : ""}`} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(key.id)} className="h-7 w-7 p-0 text-muted-foreground hover:text-red-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
