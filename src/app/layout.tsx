import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "LitLabs — AI Agent Platform",
    template: "%s | LitLabs",
  },
  description: "Build, deploy, and manage custom AI agents. Create automations, connect tools, and scale your workflow from one clean platform.",
  metadataBase: new URL("https://litlabs.net"),
  authors: [{ name: "Larry Bol", url: "https://litlabs.net" }],
  keywords: ["AI agents", "automation", "AI platform", "LitLabs", "AI builder"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://litlabs.net",
    title: "LitLabs — AI Agent Platform",
    description: "Build and deploy custom AI agents from one clean platform.",
    siteName: "LitLabs",
  },
  twitter: {
    card: "summary_large_image",
    title: "LitLabs — AI Agent Platform",
    description: "Build and deploy custom AI agents.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#050505] text-[#fafafa] antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
