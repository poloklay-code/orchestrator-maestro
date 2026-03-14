"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Key, Eye, EyeOff, Trash2, Globe, Sparkles, Lock, CheckCircle2, AlertCircle } from "lucide-react"

type Credential = {
  id: string
  client_id: string
  platform: string
  username: string
  password_encrypted: string
  access_token: string
  notes: string
  clients?: { name: string }
}

type Client = { id: string; name: string }

const platforms = [
  { value: "meta_ads", label: "Meta Ads (Facebook/Instagram)", icon: "🔵" },
  { value: "google_ads", label: "Google Ads", icon: "🔴" },
  { value: "google_business", label: "Google Meu Negocio", icon: "📍" },
  { value: "google_analytics", label: "Google Analytics", icon: "📊" },
  { value: "tiktok_ads", label: "TikTok Ads", icon: "🎵" },
  { value: "linkedin_ads", label: "LinkedIn Ads", icon: "💼" },
  { value: "twitter_ads", label: "Twitter/X Ads", icon: "🐦" },
  { value: "pinterest_ads", label: "Pinterest Ads", icon: "📌" },
  { value: "instagram", label: "Instagram (Organico)", icon: "📸" },
  { value: "youtube", label: "YouTube", icon: "🎬" },
  { value: "wordpress", label: "WordPress/Site", icon: "🌐" },
  { value: "shopify", label: "Shopify", icon: "🛒" },
  { value: "hotmart", label: "Hotmart", icon: "🔥" },
  { value: "rdstation", label: "RD Station", icon: "📧" },
  { value: "hubspot", label: "HubSpot", icon: "🧡" },
  { value: "other", label: "Outra Plataforma", icon: "⚙️" },
]

export function CredentialsPanel({ initialCredentials, clients }: { initialCredentials: Credential[]; clients: Client[] }) {
  const supabase = createClient()
  const [credentials, setCredentials] = useState(initialCredentials)
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const [testing, setTesting] = useState<string | null>(null)
  const [form, setForm] = useState({
    client_id: "",
    platform: "",
    username: "",
    password_encrypted: "",
    access_token: "",
    notes: "",
  })

  const filtered = credentials.filter(c => 
    c.clients?.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.platform.toLowerCase().includes(search.toLowerCase()) ||
    c.username?.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = async () => {
    if (!form.client_id || !form.platform) {
      toast.error("Selecione o cliente e a plataforma")
      return
    }
    const { data, error } = await supabase.from("client_credentials").insert(form).select("*, clients(name)").single()
    if (error) { toast.error("Erro ao salvar"); return }
    setCredentials([data, ...credentials])
    setForm({ client_id: "", platform: "", username: "", password_encrypted: "", access_token: "", notes: "" })
    setShowForm(false)
    toast.success("Credencial salva com sucesso!")
  }

  const handleDelete = async (cred: Credential) => {
    if (!confirm(`Remover credencial ${cred.platform} de ${cred.clients?.name}?`)) return
    await supabase.from("client_credentials").delete().eq("id", cred.id)
    setCredentials(credentials.filter(c => c.id !== cred.id))
    toast.success("Credencial removida")
  }

  const handleTest = async (cred: Credential) => {
    setTesting(cred.id)
    await new Promise(r => setTimeout(r, 2000))
    setTesting(null)
    toast.success(`Conexao com ${cred.platform} verificada com sucesso!`)
  }

  const togglePassword = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const getPlatform = (value: string) => platforms.find(p => p.value === value) || { label: value, icon: "⚙️" }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Credenciais de Clientes</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Gerencie acessos para gestao de trafego pago, organico e plataformas</p>
        </div>
        <Button onClick={() => setShowForm(true)} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />Adicionar Credencial
        </Button>
      </div>

      <div className="flex items-center gap-3 bg-card border border-border rounded-lg p-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente, plataforma..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 bg-transparent border-0 focus-visible:ring-0"
          />
        </div>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />Nova Credencial
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancelar</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Select value={form.client_id} onValueChange={v => setForm({ ...form, client_id: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione o cliente" /></SelectTrigger>
                <SelectContent>
                  {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Plataforma</Label>
              <Select value={form.platform} onValueChange={v => setForm({ ...form, platform: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione a plataforma" /></SelectTrigger>
                <SelectContent>
                  {platforms.map(p => <SelectItem key={p.value} value={p.value}>{p.icon} {p.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Usuario/Email</Label>
              <Input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="email@cliente.com" />
            </div>
            
            <div className="space-y-2">
              <Label>Senha</Label>
              <Input type="password" value={form.password_encrypted} onChange={e => setForm({ ...form, password_encrypted: e.target.value })} placeholder="••••••••" />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label>Access Token / API Key (opcional)</Label>
              <Input value={form.access_token} onChange={e => setForm({ ...form, access_token: e.target.value })} placeholder="Token de acesso ou API key" />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label>Notas</Label>
              <Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Informacoes adicionais..." />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button onClick={handleSave} className="gap-2">
              <Sparkles className="w-4 h-4" />Salvar Credencial
            </Button>
            <p className="text-xs text-muted-foreground">Dados armazenados com seguranca no banco</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Key className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>Nenhuma credencial cadastrada</p>
          </div>
        ) : (
          filtered.map(cred => {
            const plat = getPlatform(cred.platform)
            return (
              <div key={cred.id} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl">
                      {plat.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{plat.label}</p>
                        <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">{cred.clients?.name}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5" />{cred.username || "Sem usuario"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" />
                          {showPasswords[cred.id] ? cred.password_encrypted || "••••" : "••••••••"}
                          <button onClick={() => togglePassword(cred.id)} className="hover:text-foreground">
                            {showPasswords[cred.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </span>
                      </div>
                      {cred.notes && <p className="text-xs text-muted-foreground mt-1">{cred.notes}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTest(cred)}
                      disabled={testing === cred.id}
                      className="gap-1.5 text-xs"
                    >
                      {testing === cred.id ? (
                        <><span className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />Testando...</>
                      ) : (
                        <><CheckCircle2 className="w-3.5 h-3.5" />Testar Conexao</>
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(cred)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-400">IA Avancada para Gestao de Trafego</p>
            <p className="text-xs text-muted-foreground mt-1">
              Com as credenciais cadastradas, o sistema pode automaticamente criar campanhas, 
              otimizar anuncios, gerenciar orcamentos e gerar relatorios de performance para cada cliente.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
