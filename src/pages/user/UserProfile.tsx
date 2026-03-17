import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { User, Camera, Save } from "lucide-react";
import { toast } from "sonner";

export default function UserProfile() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name, phone, avatar_url").eq("id", user.id).single()
      .then(({ data }) => {
        if (data) {
          setFullName(data.full_name || "");
          setPhone(data.phone || "");
          setAvatarUrl(data.avatar_url || "");
        }
      });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("profiles").update({
      full_name: fullName,
      phone,
      avatar_url: avatarUrl,
    }).eq("id", user.id);
    setLoading(false);
    if (error) { toast.error("Erro ao salvar"); return; }
    toast.success("Perfil atualizado!");
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-primary" /> Meu Perfil
        </h2>

        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-secondary border-2 border-primary/30 flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center">
              <Camera className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">{user?.email}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider">URL do Avatar</label>
            <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-sm text-foreground mt-1"
              placeholder="https://..." />
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider">Nome Completo</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-sm text-foreground mt-1"
              placeholder="Seu nome" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider">Telefone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-sm text-foreground mt-1"
              placeholder="(11) 99999-9999" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider">Email</label>
            <input value={user?.email || ""} disabled
              className="w-full h-10 px-3 rounded-lg bg-muted border border-border text-sm text-muted-foreground mt-1 cursor-not-allowed" />
          </div>
        </div>

        <button onClick={handleSave} disabled={loading}
          className="mt-6 w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-50">
          <Save className="w-4 h-4" />
          {loading ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>
    </div>
  );
}
