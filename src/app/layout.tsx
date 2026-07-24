import type { Metadata } from "next";
import "./globals.css";
import SideNav from "@/components/SideNav";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "TJSP Estudos — Escrevente Técnico Judiciário",
  description:
    "Plataforma pessoal de estudos para o concurso de Escrevente Técnico Judiciário do TJSP (VUNESP).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)] font-sans">
        <div className="mx-auto flex min-h-screen max-w-7xl">
          <SideNav />
          <div className="flex-1">
            <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-6 md:px-8 md:pb-10 md:pt-8">
              {children}
            </main>
          </div>
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
