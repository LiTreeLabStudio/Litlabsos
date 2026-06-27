"use client";

import { useSupabaseAuth, SupabaseAuthProvider } from "@/app/supabase-auth";
import { Suspense } from "react";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import AnimatedBackgroundWrapper from "@/components/AnimatedBackgroundWrapper";
import LeftDock from "@/components/LeftDock";
import dynamic from "next/dynamic";
import { ThemeProvider } from "@/context/ThemeContext";
import { ProfileProvider } from "@/context/ProfileContext";

const NpcGuide = dynamic(() => import("@/components/NpcGuide"), { ssr: false });

// Inner component that reads auth — must live inside SupabaseAuthProvider.
// Does NOT block rendering — content shows immediately while auth resolves.
function MainContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSupabaseAuth();
  const isSignedIn = !loading && !!user;

  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const isDashboardRoute = pathname === "/" || pathname === "/social";
  const showDashboardLayout = isDashboardRoute && isSignedIn;
  const isAppPage = pathname?.startsWith("/studio") || pathname?.startsWith("/agent");
  const hideFooterAndGuide = isAppPage || showDashboardLayout;

  return (
    <div
      className={`relative z-10 flex flex-col w-full max-w-full ${
        hideFooterAndGuide ? "h-screen overflow-hidden" : "min-h-screen"
      }`}
    >
      {/* LeftDock only renders once auth is confirmed — no blocking */}
      {isSignedIn && (
        <Suspense fallback={null}>
          <LeftDock />
        </Suspense>
      )}

      <main className="flex flex-1 min-h-0 w-full max-w-full">
        {children}
      </main>

      {!hideFooterAndGuide && <Footer />}
      <CookieConsent />
      <ServiceWorkerRegistration />
      {!hideFooterAndGuide && <NpcGuide />}
    </div>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SupabaseAuthProvider>
      <ThemeProvider>
        <ProfileProvider>
          <div className="relative z-10 min-h-screen">
            {/* Animated background sits behind everything */}
            <AnimatedBackgroundWrapper />

            {/* Content renders immediately — no auth gate */}
            <MainContent>{children}</MainContent>
          </div>
        </ProfileProvider>
      </ThemeProvider>
    </SupabaseAuthProvider>
  );
}