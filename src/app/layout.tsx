import type { Metadata } from "next";
import { Inter, Orbitron, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import JsonLd from "@/components/JsonLd";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  preload: true,
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
  weight: ["600", "700", "800", "900"],
  preload: true,
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "700"],
  preload: true,
});

export const metadata: Metadata = {
  title: "LitLabs — AI Agent Platform",
  description: "Build, deploy, and manage custom AI agents. Create automations, connect tools, and scale your workflow from one clean platform.",
  authors: [{ name: "LitLabs" }],
  keywords: ["AI agents", "automation", "no-code AI", "LitLabs", "AI builder", "agent platform"],
  openGraph: {
    title: "LitLabs — AI Agent Platform",
    description: "Build, deploy, and manage custom AI agents. Create automations, connect tools, and scale your workflow.",
    url: "https://litlabs.net",
    siteName: "LitLabs",
    locale: "en_US",
    type: "website",
    images: [{
      url: "https://litlabs.net/og-image.svg",
      width: 1200,
      height: 630,
      alt: "LitLabs — AI Agent Platform",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LitLabs — AI Agent Platform",
    description: "Build, deploy, and manage custom AI agents on one clean platform.",
    images: ["https://litlabs.net/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://litlabs.net",
  },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "LitLabs",
  url: "https://litlabs.net",
  logo: "https://litlabs.net/logo.svg",
  description: "Build, deploy, and manage custom AI agents on one clean platform.",
  foundingDate: "2025",
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@litlabs.net",
    contactType: "customer support",
  },
  sameAs: [],
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
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.svg" />
      </head>
      <body className="min-h-full flex flex-col bg-brand-dark text-white">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <JsonLd data={jsonLdData} />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
