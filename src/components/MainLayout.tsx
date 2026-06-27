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

// Inner component that reads auth — must live inside SupabaseAuthProvider
function MainContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSupabaseAuth();
  const isSignedIn = !loading && !!user;

  // Get pathname for route-based logic
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";

  const isDashboardRoute = pathname === "/" || pathname === "/social";
  const showDashboardLayout = isDashboardRoute && isSignedIn;
  const isAppPage = pathname?.startsWith("/studio") || pathname?.startsWith("/agent");
  const hideFooterAndGuide = isAppPage || showDashboardLayout;

  // While auth is resolving, show a minimal spinner (don't block page paint)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <span className="text-white text-3xl animate-pulse">Loading...</span>
      </div>
    );
  }

  return (
    <div
      className={`relative z-10 flex flex-col w-full max-w-full ${
        hideFooterAndGuide ? "h-screen overflow-hidden" : "min-h-screen"
      }`}
    >
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

// Outer shell — mounts providers, then renders MainContent inside them
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
            <div className="flex flex-col">
              {/* Background */}
              <AnimatedBackgroundWrapper />

              {/* App content (reads auth from provider above) */}
              <MainContent>{children}</MainContent>
            </div>
          </div>
        </ProfileProvider>
      </ThemeProvider>
    </SupabaseAuthProvider>
  );
}