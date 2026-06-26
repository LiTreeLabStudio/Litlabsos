
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { renderSupabaseLayout } from "@/app/supabase-layout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0d0d0d",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://litlabs.net"),
  title: {
    default: "LiTTree Lab Studios — AI Agent Platform",
    template: "%s | LiTTree Lab Studios",
  },
  description:
    "Deploy specialized AI agents, build no-code workflows, and automate your business with LiTTree Lab Studios — the AI-first creator platform.",
  keywords: [
    "AI agents",
    "automation",
    "workflow",
    "artificial intelligence",
    "NoCode",
    "LiTTree",
    "LiTPage",
    "Gemini",
    "AI platform",
  ],
  authors: [{ name: "LiTTree Lab Studios", url: "https://litlabs.net" }],
  creator: "LiTTree Lab Studios",
  publisher: "LiTTree Lab Studios",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://litlabs.net",
    siteName: "LiTTree Lab Studios",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LiTTree Lab Studios",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LiTTree Lab Studios — AI Agent Platform",
    description: "Deploy specialized AI agents and automate your business.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const body = await renderSupabaseLayout({
    children,
    metadata,
  });

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      {body}
    </html>
  );
}