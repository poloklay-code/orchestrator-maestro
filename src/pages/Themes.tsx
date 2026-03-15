import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useThemeStore } from "@/stores/themeStore";
import OrchestratorBust from "@/components/OrchestratorBust";
import { Palette, Image, Type, User, Monitor, Smartphone, RefreshCw, CheckCircle2, Upload, Sparkles, Sun, Moon, Zap } from "lucide-react";
import { toast } from "sonner";

const PRESET_THEMES = [
  {
    name: "Obsidian Gold", desc: "Elegância escura com acentos dourados", preview: "from-amber-900/30 to-zinc-900",
    vars: { "--background": "230 30% 6%", "--primary": "35 80% 55%", "--accent": "195 90% 45%", "--card": "230 25% 10%", "--border": "230 15% 18%" },
  },
  {
    name: "Cyber Neon", desc: "Futurista com neon vibrante", preview: "from-cyan-900/40 to-slate-950",
    vars: { "--background": "220 40% 5%", "--primary": "180 100% 50%", "--accent": "300 80% 60%", "--card": "220 35% 9%", "--border": "220 20% 16%" },
  },
  {
    name: "Blood Matrix", desc: "Poder absoluto em vermelho", preview: "from-red-900/40 to-zinc-950",
    vars: { "--background": "0 20% 5%", "--primary": "0 80% 50%", "--accent": "15 90% 55%", "--card": "0 15% 10%", "--border": "0 10% 18%" },
  },
  {
    name: "Royal Sapphire", desc: "Azul real com profundidade", preview: "from-blue-900/40 to-slate-950",
    vars: { "--background": "225 35% 6%", "--primary": "215 90% 55%", "--accent": "195 80% 50%", "--card": "225 30% 10%", "--border": "225 18% 18%" },
  },
  {
    name: "Emerald Ops", desc: "Verde operacional militar", preview: "from-emerald-900/40 to-zinc-950",
    vars: { "--background": "160 25% 5%", "--primary": "155 75% 45%", "--accent": "180 70% 50%", "--card": "160 20% 9%", "--border": "160 15% 16%" },
  },
  {
    name: "Purple Haze", desc: "Misterioso e sofisticado", preview: "from-purple-900/40 to-slate-950",
    vars: { "--background": "270 30% 6%", "--primary": "270 75% 55%", "--accent": "300 70% 60%", "--card": "270 25% 10%", "--border": "270 15% 18%" },
  },
];

export default function Themes() {
  const store = useThemeStore();
  const wallpaperRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLInputElement>(null);
  const appIconRef = useRef<HTMLInputElement>(null);

  const [localSlogan, setLocalSlogan] = useState(store.slogan);
  const [localName, setLocalName] = useState(store.profileName);
  const [localProfileSlogan, setLocalProfileSlogan] = useState(store.profileSlogan);
  const [localProgramName, setLocalProgramName] = useState(store.programName);
  const [localProgramVersion, setLocalProgramVersion] = useState(store.programVersion);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string | null) => void, label: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setter(reader.result as string);
      toast.success(`${label} atualizado! Sincronizado Desktop ↔ Mobile.`);
    };
    reader.readAsDataURL(file);
  };

  const applyTheme = (theme: typeof PRESET_THEMES[0]) => {
    const root = document.documentElement;
    Object.entries(theme.vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    store.setActiveTheme(theme.name);
    toast.success(`Tema "${theme.name}" aplicado com sucesso!`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Palette className="w-7 h-7 text-primary" /> Temas & Customização
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Personalize o visual — tudo sincronizado automaticamente entre Desktop e Mobile.</p>
      </div>

      {/* PRESET THEMES */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">TEMAS PREDEFINIDOS</h3>
        </div>
        <p className="text-xs text-muted-foreground">Selecione um tema refinado — aplicado instantaneamente em todo o programa.</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {PRESET_THEMES.map((theme) => (
            <button key={theme.name} onClick={() => applyTheme(theme)}
              className={`relative p-4 rounded-xl border transition-all text-left hover:scale-[1.02] ${store.activeTheme === theme.name ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-secondary/30 hover:border-primary/30"}`}>
              <div className={`w-full h-10 rounded-lg bg-gradient-to-br ${theme.preview} mb-3`} />
              <p className="text-xs font-bold text-foreground">{theme.name}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{theme.desc}</p>
              {store.activeTheme === theme.name && (
                <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-primary" />
              )}
            </button>
          ))}
        </div>
      </motion.section>

      {/* WALLPAPER */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2"><Image className="w-4 h-4 text-primary" /><h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">PAPEL DE PAREDE — TELA DE LOGIN</h3></div>
        <p className="text-xs text-muted-foreground">A imagem será aplicada como fundo completo da tela de login. Sincronizado Desktop ↔ Mobile.</p>
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={() => wallpaperRef.current?.click()} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:brightness-110 transition-all">
            <Upload className="w-4 h-4" /> Enviar Imagem
          </button>
          {store.loginWallpaper && (
            <button onClick={() => { store.setLoginWallpaper(null); toast.success("Wallpaper removido"); }} className="px-4 py-2.5 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold uppercase tracking-wider hover:bg-destructive/20 transition-all">Remover</button>
          )}
          <input ref={wallpaperRef} type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, store.setLoginWallpaper, "Papel de parede")} />
          {store.loginWallpaper && <span className="flex items-center gap-1 text-[10px] text-green-400"><CheckCircle2 className="w-3 h-3" /> Ativo</span>}
        </div>
        {store.loginWallpaper && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1"><Monitor className="w-3 h-3" /> Desktop</p>
              <div className="rounded-lg overflow-hidden border border-border h-28"><img src={store.loginWallpaper} alt="Desktop" className="w-full h-full object-cover" /></div>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1"><Smartphone className="w-3 h-3" /> Mobile</p>
              <div className="rounded-lg overflow-hidden border border-border h-28 w-16 mx-auto"><img src={store.loginWallpaper} alt="Mobile" className="w-full h-full object-cover" /></div>
            </div>
          </div>
        )}
      </motion.section>

      {/* APP ICON */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2"><Palette className="w-4 h-4 text-primary" /><h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">ÍCONE DO PROGRAMA — APP & NAVEGADOR</h3></div>
        <p className="text-xs text-muted-foreground">Altera o ícone principal que aparece no login, sidebar, desktop e mobile. Sincronizado automaticamente.</p>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl bg-secondary border-2 border-dashed border-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary/50 transition-all" onClick={() => appIconRef.current?.click()}>
            {store.appIcon ? <img src={store.appIcon} alt="Icon" className="w-full h-full object-cover rounded-xl" /> : <OrchestratorBust size="small" className="w-14 h-14" />}
          </div>
          <div className="space-y-2">
            <button onClick={() => appIconRef.current?.click()} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:brightness-110 transition-all">
              <Upload className="w-4 h-4" /> Alterar Ícone
            </button>
            {store.appIcon && <button onClick={() => { store.setAppIcon(null); toast.success("Ícone restaurado"); }} className="text-xs text-destructive hover:underline">Restaurar padrão</button>}
            <p className="text-[10px] text-muted-foreground flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Auto-sincronizado</p>
          </div>
          <input ref={appIconRef} type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, store.setAppIcon, "Ícone do programa")} />
        </div>
      </motion.section>

      {/* FAVICON */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2"><Image className="w-4 h-4 text-primary" /><h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">FAVICON — NAVEGADOR</h3></div>
        <div className="flex items-center gap-4">
          <button onClick={() => faviconRef.current?.click()} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:brightness-110 transition-all"><Upload className="w-4 h-4" /> Enviar Favicon</button>
          <input ref={faviconRef} type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, store.setFavicon, "Favicon")} />
          {store.favicon && <img src={store.favicon} alt="Favicon" className="w-10 h-10 rounded-lg border border-border" />}
        </div>
      </motion.section>

      {/* PROGRAM NAME */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2"><Type className="w-4 h-4 text-primary" /><h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">NOME DO PROGRAMA</h3></div>
        <p className="text-xs text-muted-foreground">Aparece na sidebar, header e tela de login.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Nome do Programa</label>
            <input value={localProgramName} onChange={e => setLocalProgramName(e.target.value)} className="w-full h-10 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="AETHER ORCHESTRATOR" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Versão</label>
            <input value={localProgramVersion} onChange={e => setLocalProgramVersion(e.target.value)} className="w-full h-10 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="v2.0.0" />
          </div>
          <button onClick={() => { store.setProgramName(localProgramName); store.setProgramVersion(localProgramVersion); toast.success("Nome atualizado em todo o sistema (sidebar, header, login)"); }} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:brightness-110 transition-all sm:col-span-2">Salvar Nome</button>
        </div>
      </motion.section>

      {/* SLOGAN */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2"><Type className="w-4 h-4 text-primary" /><h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">SLOGAN DO PROGRAMA</h3></div>
        <div className="flex gap-3">
          <input value={localSlogan} onChange={e => setLocalSlogan(e.target.value)} className="flex-1 h-10 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="SOVEREIGN AUTOMATION COMMAND CENTER" />
          <button onClick={() => { store.setSlogan(localSlogan); toast.success("Slogan atualizado"); }} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:brightness-110 transition-all">Salvar</button>
        </div>
      </motion.section>

      {/* PROFILE */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2"><User className="w-4 h-4 text-primary" /><h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">PERFIL DO COMANDANTE</h3></div>
        <p className="text-xs text-muted-foreground">Avatar, nome e slogan que aparecem no topo do dashboard.</p>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-secondary border-2 border-dashed border-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary/50 transition-all" onClick={() => avatarRef.current?.click()}>
            {store.profileAvatar ? <img src={store.profileAvatar} alt="Avatar" className="w-full h-full object-cover" /> : <span className="text-2xl text-muted-foreground">◉</span>}
          </div>
          <div className="space-y-1">
            <button onClick={() => avatarRef.current?.click()} className="text-xs font-semibold text-primary hover:underline uppercase tracking-wider">Alterar Avatar</button>
            <p className="text-[10px] text-muted-foreground">Clique para enviar imagem</p>
          </div>
          <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, store.setProfileAvatar, "Avatar")} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Nome do Operador</label>
            <input value={localName} onChange={e => setLocalName(e.target.value)} className="w-full h-10 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Slogan do Perfil</label>
            <input value={localProfileSlogan} onChange={e => setLocalProfileSlogan(e.target.value)} className="w-full h-10 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
        </div>
        <button onClick={() => { store.setProfileName(localName); store.setProfileSlogan(localProfileSlogan); toast.success("Perfil atualizado"); }} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:brightness-110 transition-all">Salvar Perfil</button>
      </motion.section>

      {/* USER MANAGEMENT (Admin Only) */}
      {localStorage.getItem("auth_role") === "admin" && <UserManagement />}

      {/* Preview */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border border-primary/20 bg-primary/5 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Pré-visualização</h3>
        <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border">
          <OrchestratorBust size="small" className="w-12 h-12" />
          <div>
            <span className="text-sm font-semibold text-foreground">{store.profileName}</span>
            <p className="text-[10px] text-muted-foreground">{store.profileSlogan}</p>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
          <RefreshCw className="w-3 h-3" /> Todas as alterações são sincronizadas em tempo real entre Desktop e Mobile.
        </p>
      </motion.section>
    </div>
  );
}

function UserManagement() {
  const [users, setUsers] = useState<Array<{ name: string; email: string; password: string; active: boolean }>>(
    JSON.parse(localStorage.getItem("app_users") || "[]")
  );
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const saveUsers = (updated: typeof users) => {
    setUsers(updated);
    localStorage.setItem("app_users", JSON.stringify(updated));
  };

  const handleAdd = () => {
    if (!form.email || !form.password || !form.name) { toast.error("Preencha todos os campos"); return; }
    if (users.find(u => u.email === form.email)) { toast.error("Email já cadastrado"); return; }
    const updated = [...users, { ...form, active: true }];
    saveUsers(updated);
    setForm({ name: "", email: "", password: "" });
    setShowAdd(false);
    toast.success(`Usuário ${form.name} adicionado com sucesso!`);
  };

  const toggleUser = (email: string) => {
    const updated = users.map(u => u.email === email ? { ...u, active: !u.active } : u);
    saveUsers(updated);
    toast.success("Status do usuário atualizado");
  };

  const removeUser = (email: string) => {
    if (!confirm("Remover este usuário?")) return;
    saveUsers(users.filter(u => u.email !== email));
    toast.success("Usuário removido");
  };

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-xl border border-primary/20 bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><User className="w-4 h-4 text-primary" /><h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">GESTÃO DE USUÁRIOS</h3></div>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:brightness-110">
          <Zap className="w-3.5 h-3.5" /> Adicionar Usuário
        </button>
      </div>
      <p className="text-xs text-muted-foreground">Usuários podem usar todas as funcionalidades mas NÃO podem alterar configurações, temas ou gerenciar outros usuários. Apenas o Admin tem acesso total.</p>

      {showAdd && (
        <div className="p-4 rounded-lg border border-primary/20 bg-secondary/20 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nome" className="h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground" />
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" className="h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground" />
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Senha" className="h-9 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground" />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 text-xs text-muted-foreground">Cancelar</button>
            <button onClick={handleAdd} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold">Salvar</button>
          </div>
        </div>
      )}

      {users.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">Nenhum usuário adicional cadastrado</p>
      ) : (
        <div className="space-y-2">
          {users.map(u => (
            <div key={u.email} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20 border border-border">
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${u.active ? "bg-green-500" : "bg-muted-foreground"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{u.name}</p>
                <p className="text-[10px] text-muted-foreground">{u.email} • Papel: Usuário</p>
              </div>
              <button onClick={() => toggleUser(u.email)} className="text-[10px] px-2 py-1 rounded bg-secondary text-muted-foreground hover:text-foreground">{u.active ? "Desativar" : "Ativar"}</button>
              <button onClick={() => removeUser(u.email)} className="text-[10px] px-2 py-1 rounded bg-destructive/10 text-destructive hover:bg-destructive/20">Remover</button>
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
}
