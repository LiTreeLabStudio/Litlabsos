
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { renderSupabaseLayout } from "@/app/supabase-layout";
import { ClerkProvider } from "@clerk/nextjs";

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

const clerkKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  "pk_live_Y2xlcmsubGl0bGFicy5uZXQk";

const clerkAppearance = {
  variables: {
    colorPrimary: "#00f0ff",
    colorBackground: "#0d0d15",
    colorText: "#e2e8f0",
    colorTextSecondary: "#94a3b8",
    colorInputBackground: "#07070a",
    colorInputText: "#e2e8f0",
    borderRadius: "10px",
  },
  elements: {
    card: {
      border: "1px solid #1a1a2e",
      boxShadow: "0 0 30px rgba(0, 240, 255, 0.05)",
    },
    formButtonPrimary: {
      background: "linear-gradient(135deg, #00f0ff, #ff00a0)",
      color: "#000",
      fontWeight: "800",
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      "&:hover": {
        opacity: "0.9",
      },
    },
    userButtonPopoverCard: {
      backgroundColor: "#151520",
      border: "1px solid #2a2a45",
    },
    userButtonPopoverActionButton: {
      "&:hover": {
        backgroundColor: "rgba(0,240,255,0.1)",
      },
    },
    badge: {
      backgroundColor: "#ff00a0",
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const body = await renderSupabaseLayout({
    children,
  });

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <ClerkProvider
        publishableKey={clerkKey}
        signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in"}
        signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "/sign-up"}
        signInFallbackRedirectUrl={
          process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL ?? "/"
        }
        signUpFallbackRedirectUrl={
          process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL ?? "/"
        }
        appearance={clerkAppearance as any}
      >
        <body className="antialiased min-h-screen" style={{ backgroundColor: "#0a0a0f" }}>
          {body}
        </body>
      </ClerkProvider>
    </html>
  );
}