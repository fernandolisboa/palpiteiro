import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import "./globals.css";

import { BottomNav } from "@/components/bottom-nav";

const display = Sora({
  variable: "--font-display",
  subsets: ["latin"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Palpiteiro",
    template: "%s | Palpiteiro",
  },
  description:
    "Motor probabilistico e comparacao entre multiplas IAs para analise de partidas do futebol brasileiro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`}>
      <body>
        <div className="page-shell">
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}

