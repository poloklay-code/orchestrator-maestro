import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Toaster } from "sonner"
import { ServiceWorkerRegister } from "@/components/sw-register"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" })

export const metadata: Metadata = {
  title: "ORQUESTRADOR MAESTRO | Command Center",
  description: "Sistema privado de comando e controle para operacoes digitais com IA",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Maestro",
  },
}

export const viewport: Viewport = {
  themeColor: "#0B0F14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/images/orquestrador-robot.jpg" />
      </head>
      <body className={`${inter.variable} ${jetbrains.variable} font-sans antialiased min-h-screen`}>
        {children}
        <ServiceWorkerRegister />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "hsl(210 18% 8%)",
              border: "1px solid hsl(210 15% 16%)",
              color: "hsl(200 20% 95%)",
            },
          }}
        />
      </body>
    </html>
  )
}
