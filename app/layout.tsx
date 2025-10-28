import type { Metadata } from "next";
import "./globals.css";
import RegisterSW from "./register-sw";

export const metadata: Metadata = {
  title: "Mi App iPhone",
  description: "App web progresiva (PWA) desarrollada en Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* Manifest y configuración PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#003057" />

        {/* iOS específico */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/icons/icon-512.png" />

        {/* Puedes agregar otros metas si quieres */}
      </head>
      <body suppressHydrationWarning>
        {/* Registro del Service Worker */}
        <RegisterSW />

        {/* Contenido principal de la app */}
        {children}
      </body>
    </html>
  );
}