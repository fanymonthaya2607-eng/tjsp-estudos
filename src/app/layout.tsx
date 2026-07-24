import type { Metadata } from "next";
import "./globals.css";
import { auth } from "@/lib/auth";
import { getOrCreateUserStreak } from "@/lib/queries";
import SideNav from "@/components/SideNav";
import BottomNav from "@/components/BottomNav";
import SignInScreen from "@/components/SignInScreen";
import ThemeToggle from "@/components/ThemeToggle";

// Roda antes da hidratação para aplicar o tema salvo (ou a preferência do
// sistema) sem "flash" da cor errada na primeira pintura da página.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var dark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (dark) document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

export const metadata: Metadata = {
  title: "TJSP Estudos — Escrevente Técnico Judiciário",
  description:
    "Plataforma pessoal de estudos para o concurso de Escrevente Técnico Judiciário do TJSP (VUNESP).",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const streak = session?.user ? await getOrCreateUserStreak(session.user.id) : null;

  return (
    <html lang="pt-BR" className="h-full antialiased">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)] font-sans">
        <ThemeToggle />
        {session?.user && streak ? (
          <>
            <div className="mx-auto flex min-h-screen max-w-7xl">
              <SideNav user={session.user} streak={streak} />
              <div className="flex-1">
                <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-6 md:px-8 md:pb-10 md:pt-8">
                  {children}
                </main>
              </div>
            </div>
            <BottomNav />
          </>
        ) : (
          <SignInScreen />
        )}
      </body>
    </html>
  );
}
