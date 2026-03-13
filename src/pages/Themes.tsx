import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "@/stores/themeStore";
import OrchestratorBust from "@/components/OrchestratorBust";

export default function Themes() {
  const navigate = useNavigate();
  const store = useThemeStore();
  const wallpaperRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLInputElement>(null);

  const [localSlogan, setLocalSlogan] = useState(store.slogan);
  const [localName, setLocalName] = useState(store.profileName);
  const [localProfileSlogan, setLocalProfileSlogan] = useState(store.profileSlogan);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setter(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-background bg-orchestrator">
      {/* Header */}
      <header className="h-14 border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground text-sm">
            ← VOLTAR
          </button>
          <span className="font-display text-sm text-foreground tracking-wider">TEMAS & CUSTOMIZAÇÃO</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-8">
        {/* Login Wallpaper */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-aether rounded-lg p-6 space-y-4"
        >
          <h3 className="text-sm font-display text-foreground uppercase tracking-wider">
            PAPEL DE PAREDE — TELA DE LOGIN
          </h3>
          <p className="text-xs text-muted-foreground">
            A imagem será aplicada como fundo da tela de login com efeito blur + escurecimento automático.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => wallpaperRef.current?.click()}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-display text-xs uppercase tracking-wider hover:brightness-110 transition-all"
            >
              ENVIAR IMAGEM
            </button>
            {store.loginWallpaper && (
              <button
                onClick={() => store.setLoginWallpaper(null)}
                className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground font-display text-xs uppercase tracking-wider"
              >
                REMOVER
              </button>
            )}
            <input
              ref={wallpaperRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => handleFileUpload(e, store.setLoginWallpaper)}
            />
          </div>
          {store.loginWallpaper && (
            <div className="mt-4 rounded-lg overflow-hidden border border-border h-32">
              <img src={store.loginWallpaper} alt="Wallpaper preview" className="w-full h-full object-cover" />
            </div>
          )}
        </motion.section>

        {/* Favicon / App Icon */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-aether rounded-lg p-6 space-y-4"
        >
          <h3 className="text-sm font-display text-foreground uppercase tracking-wider">
            ÍCONE DO PROGRAMA — FAVICON
          </h3>
          <p className="text-xs text-muted-foreground">
            Altera o favicon do navegador e o ícone do app. Sincronizado entre Desktop e Mobile.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => faviconRef.current?.click()}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-display text-xs uppercase tracking-wider hover:brightness-110 transition-all"
            >
              ENVIAR ÍCONE
            </button>
            <input
              ref={faviconRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => handleFileUpload(e, store.setFavicon)}
            />
            {store.favicon && (
              <img src={store.favicon} alt="Favicon" className="w-8 h-8 rounded border border-border" />
            )}
          </div>
        </motion.section>

        {/* Slogan */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-aether rounded-lg p-6 space-y-4"
        >
          <h3 className="text-sm font-display text-foreground uppercase tracking-wider">
            SLOGAN DO PROGRAMA
          </h3>
          <div className="flex gap-3">
            <input
              value={localSlogan}
              onChange={e => setLocalSlogan(e.target.value)}
              className="flex-1 h-10 px-4 rounded-md bg-secondary border border-border text-foreground font-body text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="SOVEREIGN AUTOMATION COMMAND CENTER"
            />
            <button
              onClick={() => store.setSlogan(localSlogan)}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-display text-xs uppercase tracking-wider hover:brightness-110 transition-all"
            >
              SALVAR
            </button>
          </div>
        </motion.section>

        {/* Profile Customization */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-aether rounded-lg p-6 space-y-4"
        >
          <h3 className="text-sm font-display text-foreground uppercase tracking-wider">
            PERFIL DO COMANDANTE
          </h3>

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full bg-secondary border border-border flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={() => avatarRef.current?.click()}
            >
              {store.profileAvatar ? (
                <img src={store.profileAvatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl text-muted-foreground">◉</span>
              )}
            </div>
            <div className="space-y-1">
              <button
                onClick={() => avatarRef.current?.click()}
                className="text-xs font-display text-primary hover:underline"
              >
                ALTERAR AVATAR
              </button>
              <p className="text-[10px] text-muted-foreground">Clique para enviar imagem</p>
            </div>
            <input
              ref={avatarRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => handleFileUpload(e, store.setProfileAvatar)}
            />
          </div>

          {/* Name & Slogan */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <label className="text-[10px] font-display text-muted-foreground uppercase tracking-wider">
                NOME DO OPERADOR
              </label>
              <input
                value={localName}
                onChange={e => setLocalName(e.target.value)}
                className="w-full h-10 px-4 rounded-md bg-secondary border border-border text-foreground font-body text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-display text-muted-foreground uppercase tracking-wider">
                SLOGAN DO PERFIL
              </label>
              <input
                value={localProfileSlogan}
                onChange={e => setLocalProfileSlogan(e.target.value)}
                className="w-full h-10 px-4 rounded-md bg-secondary border border-border text-foreground font-body text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <button
            onClick={() => {
              store.setProfileName(localName);
              store.setProfileSlogan(localProfileSlogan);
            }}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-display text-xs uppercase tracking-wider hover:brightness-110 transition-all"
          >
            SALVAR PERFIL
          </button>
        </motion.section>

        {/* Preview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-aether rounded-lg p-6 space-y-4"
        >
          <h3 className="text-sm font-display text-foreground uppercase tracking-wider">
            PRÉ-VISUALIZAÇÃO
          </h3>
          <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 border border-border">
            <OrchestratorBust size="small" className="w-12 h-12" />
            <div>
              <span className="text-sm font-display text-foreground">{store.profileName}</span>
              <p className="text-[10px] text-muted-foreground font-command">{store.profileSlogan}</p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
