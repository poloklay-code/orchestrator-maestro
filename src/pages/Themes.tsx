import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "@/stores/themeStore";
import OrchestratorBust from "@/components/OrchestratorBust";
import { Palette, Image, Type, User, Monitor, Smartphone, RefreshCw, CheckCircle2, Upload } from "lucide-react";
import { toast } from "sonner";

export default function Themes() {
  const navigate = useNavigate();
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

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string | null) => void,
    label: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setter(reader.result as string);
      toast.success(`${label} atualizado com sucesso! Sincronizado Desktop ↔ Mobile.`);
    };
    reader.readAsDataURL(file);
  };

  const sections = [
    {
      icon: Image, title: "PAPEL DE PAREDE — TELA DE LOGIN", delay: 0,
      desc: "A imagem será aplicada como fundo completo da tela de login. Sincronizado automaticamente entre Desktop e Mobile.",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={() => wallpaperRef.current?.click()} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:brightness-110 transition-all">
              <Upload className="w-4 h-4" /> Enviar Imagem
            </button>
            {store.loginWallpaper && (
              <button onClick={() => { store.setLoginWallpaper(null); toast.success("Wallpaper removido"); }} className="px-4 py-2.5 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold uppercase tracking-wider hover:bg-destructive/20 transition-all">
                Remover
              </button>
            )}
            <input ref={wallpaperRef} type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, store.setLoginWallpaper, "Papel de parede")} />
            {store.loginWallpaper && (
              <span className="flex items-center gap-1 text-[10px] text-green-400"><CheckCircle2 className="w-3 h-3" /> Ativo</span>
            )}
          </div>
          {store.loginWallpaper && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1"><Monitor className="w-3 h-3" /> Desktop</p>
                <div className="rounded-lg overflow-hidden border border-border h-28">
                  <img src={store.loginWallpaper} alt="Desktop preview" className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1"><Smartphone className="w-3 h-3" /> Mobile</p>
                <div className="rounded-lg overflow-hidden border border-border h-28 w-16 mx-auto">
                  <img src={store.loginWallpaper} alt="Mobile preview" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      icon: Palette, title: "ÍCONE DO PROGRAMA — APP & NAVEGADOR", delay: 0.1,
      desc: "Altera o ícone principal do programa (robô) que aparece no login, sidebar e em todo o sistema. Sincronizado Desktop ↔ Mobile.",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl bg-secondary border-2 border-dashed border-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary/50 transition-all" onClick={() => appIconRef.current?.click()}>
              {store.appIcon ? (
                <img src={store.appIcon} alt="App Icon" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <div className="text-center">
                  <Upload className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
                  <p className="text-[8px] text-muted-foreground">Enviar</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <button onClick={() => appIconRef.current?.click()} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:brightness-110 transition-all">
                <Upload className="w-4 h-4" /> Alterar Ícone do Programa
              </button>
              {store.appIcon && (
                <button onClick={() => { store.setAppIcon(null); toast.success("Ícone resetado para padrão"); }} className="text-xs text-destructive hover:underline">
                  Restaurar ícone padrão
                </button>
              )}
              <p className="text-[10px] text-muted-foreground flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Auto-sincronizado em todos os dispositivos</p>
            </div>
            <input ref={appIconRef} type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, store.setAppIcon, "Ícone do programa")} />
          </div>
        </div>
      ),
    },
    {
      icon: Image, title: "FAVICON — NAVEGADOR", delay: 0.15,
      desc: "Altera o ícone da aba do navegador (favicon). Separado do ícone do programa.",
      content: (
        <div className="flex items-center gap-4">
          <button onClick={() => faviconRef.current?.click()} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:brightness-110 transition-all">
            <Upload className="w-4 h-4" /> Enviar Favicon
          </button>
          <input ref={faviconRef} type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, store.setFavicon, "Favicon")} />
          {store.favicon && <img src={store.favicon} alt="Favicon" className="w-10 h-10 rounded-lg border border-border" />}
        </div>
      ),
    },
    {
      icon: Type, title: "NOME DO PROGRAMA", delay: 0.18,
      desc: "Altere o nome do programa que aparece na sidebar, header e em todo o sistema.",
      content: (
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Nome do Programa</label>
            <input value={localProgramName} onChange={e => setLocalProgramName(e.target.value)} className="w-full h-10 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="ORQUESTRADOR" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Versão</label>
            <input value={localProgramVersion} onChange={e => setLocalProgramVersion(e.target.value)} className="w-full h-10 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="v2.0.0" />
          </div>
          <button onClick={() => { store.setProgramName(localProgramName); store.setProgramVersion(localProgramVersion); toast.success("Nome do programa atualizado em todo o sistema"); }} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:brightness-110 transition-all sm:col-span-2">
            Salvar Nome
          </button>
        </div>
      ),
    },
    {
      icon: Type, title: "SLOGAN DO PROGRAMA", delay: 0.22,
      desc: "Aparece na tela de login e no cabeçalho do sistema.",
      content: (
        <div className="flex gap-3">
          <input value={localSlogan} onChange={e => setLocalSlogan(e.target.value)} className="flex-1 h-10 px-4 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="SOVEREIGN AUTOMATION COMMAND CENTER" />
          <button onClick={() => { store.setSlogan(localSlogan); toast.success("Slogan atualizado"); }} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:brightness-110 transition-all">
            Salvar
          </button>
        </div>
      ),
    },
    {
      icon: User, title: "PERFIL DO COMANDANTE", delay: 0.3,
      desc: "Avatar, nome e slogan que aparecem no topo do dashboard ao lado do perfil.",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-secondary border-2 border-dashed border-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary/50 transition-all" onClick={() => avatarRef.current?.click()}>
              {store.profileAvatar ? (
                <img src={store.profileAvatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl text-muted-foreground">◉</span>
              )}
            </div>
            <div className="space-y-1">
              <button onClick={() => avatarRef.current?.click()} className="text-xs font-semibold text-primary hover:underline uppercase tracking-wider">
                Alterar Avatar
              </button>
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
          <button onClick={() => { store.setProfileName(localName); store.setProfileSlogan(localProfileSlogan); toast.success("Perfil atualizado"); }} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:brightness-110 transition-all">
            Salvar Perfil
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Palette className="w-7 h-7 text-primary" /> Temas & Customização
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Personalize o visual do programa — tudo sincronizado automaticamente entre Desktop e Mobile.</p>
      </div>

      {sections.map((section, idx) => {
        const Icon = section.icon;
        return (
          <motion.section
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: section.delay }}
            className="rounded-xl border border-border bg-card p-6 space-y-4"
          >
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">{section.title}</h3>
            </div>
            <p className="text-xs text-muted-foreground">{section.desc}</p>
            {section.content}
          </motion.section>
        );
      })}

      {/* Preview */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl border border-primary/20 bg-primary/5 p-6 space-y-4"
      >
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Pré-visualização</h3>
        <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border">
          <OrchestratorBust size="small" className="w-12 h-12" />
          <div>
            <span className="text-sm font-semibold text-foreground">{store.profileName}</span>
            <p className="text-[10px] text-muted-foreground">{store.profileSlogan}</p>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
          <RefreshCw className="w-3 h-3" /> Todas as alterações são sincronizadas em tempo real entre Desktop e Mobile via armazenamento persistente.
        </p>
      </motion.section>
    </div>
  );
}
