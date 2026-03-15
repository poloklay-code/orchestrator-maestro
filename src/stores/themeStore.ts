import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  loginWallpaper: string | null;
  favicon: string | null;
  appIcon: string | null;
  slogan: string;
  programName: string;
  programVersion: string;
  profileName: string;
  profileSlogan: string;
  profileAvatar: string | null;
  activeTheme: string;
  setLoginWallpaper: (url: string | null) => void;
  setFavicon: (url: string | null) => void;
  setAppIcon: (url: string | null) => void;
  setSlogan: (s: string) => void;
  setProgramName: (n: string) => void;
  setProgramVersion: (v: string) => void;
  setProfileName: (n: string) => void;
  setProfileSlogan: (s: string) => void;
  setProfileAvatar: (url: string | null) => void;
  setActiveTheme: (t: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      loginWallpaper: null,
      favicon: null,
      appIcon: null,
      slogan: "SOVEREIGN AUTOMATION COMMAND CENTER",
      programName: "AETHER ORCHESTRATOR",
      programVersion: "v2.0.0",
      profileName: "OPERADOR",
      profileSlogan: "Comandante da Frota",
      profileAvatar: null,
      activeTheme: "Obsidian Gold",
      setLoginWallpaper: (url) => set({ loginWallpaper: url }),
      setFavicon: (url) => {
        set({ favicon: url });
        if (url) {
          const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
          if (link) { link.href = url; } else {
            const newLink = document.createElement("link");
            newLink.rel = "icon";
            newLink.href = url;
            document.head.appendChild(newLink);
          }
        }
      },
      setAppIcon: (url) => set({ appIcon: url }),
      setSlogan: (s) => set({ slogan: s }),
      setProgramName: (n) => set({ programName: n }),
      setProgramVersion: (v) => set({ programVersion: v }),
      setProfileName: (n) => set({ profileName: n }),
      setProfileSlogan: (s) => set({ profileSlogan: s }),
      setProfileAvatar: (url) => set({ profileAvatar: url }),
      setActiveTheme: (t) => set({ activeTheme: t }),
    }),
    { name: "aether-theme" }
  )
);
