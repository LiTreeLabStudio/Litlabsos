import type { Metadata } from "next";
import { Inter, Orbitron, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
  weight: ["700", "900"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "LitLabs — Build AI Agents",
  description: "Build, deploy, and manage custom AI agents. Create automations, connect tools, and scale your workflow from one clean platform.",
  authors: [{ name: "Larry Bol" }],
  keywords: ["AI agents", "automation", "no-code AI", "LitLabs", "AI builder"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${orbitron.variable} ${jetbrains.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0f] text-white">
        <AuthProvider>
          <ThemeProvider>
            <main id="main-content" className="flex-1">
              {children}
            </main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
