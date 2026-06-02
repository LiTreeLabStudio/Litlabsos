import type { Metadata, Viewport } from "next";
import { Inter, Orbitron, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "600", "700", "800"],
  preload: true,
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
  weight: ["700", "900"],
  preload: true,
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "700"],
  preload: true,
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "LiTTreeLabStudios — The Hive Mind AI Orchestrator",
    template: "%s | LiTTreeLabStudios",
  },
  description: "Build, deploy, and manage custom AI agents. Create automations, connect tools, and scale your workflow from one clean platform. Optimized for high-performance neural orchestration.",
  metadataBase: new URL("https://litlabs.net"),
  authors: [{ name: "Larry Bol", url: "https://litlabs.net" }],
  keywords: ["AI agents", "automation", "no-code AI", "LiTTreeLabStudios", "AI builder", "Hive Mind", "Volcanic Cyber"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://litlabs.net",
    title: "LiTTreeLabStudios — Build AI Agents",
    description: "The ultimate autonomous AI agent platform with Volcanic Cyber aesthetics.",
    siteName: "LiTTreeLabStudios",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LiTTreeLabStudios Hive Mind",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LiTTreeLabStudios — Build AI Agents",
    description: "Autonomous AI agent platform for the elite builder.",
    images: ["/og-image.png"],
    creator: "@litlabs",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${orbitron.variable} ${jetbrains.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-black text-zinc-300 antialiased selection:bg-orange-500/40 selection:text-orange-100 relative">
        {/* Global Volcanic Cyber Overlay */}
        <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />
        
        <AuthProvider>
          {children}
        </AuthProvider>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
