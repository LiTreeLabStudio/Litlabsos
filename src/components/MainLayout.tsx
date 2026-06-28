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

// Inner layout — reads auth from SupabaseAuthProvider above it
function MainLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useSupabaseAuth();
  const isSignedIn = !loading && !!user;
  const authReady = !loading;

  // Get pathname for route-based logic
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";

  // Check if user is signed in (replicate Clerk's isSignedIn behavior)
  const isDashboardRoute = pathname === "/" || pathname === "/social";
  const showDashboardLayout = isDashboardRoute && isSignedIn;

  const isAppPage =
    pathname?.startsWith("/studio") || pathname?.startsWith("/agent");

  const hideFooterAndGuide = isAppPage || showDashboardLayout;

  return (
    <div className="relative z-10 min-h-screen">
      <ThemeProvider>
        <ProfileProvider>
          <div className="flex flex-col">
            {/* Background */}
            <AnimatedBackgroundWrapper />

            {/* Main Content - always render */}
            <div
              className={`relative z-10 flex flex-col w-full max-w-full ${
                hideFooterAndGuide
                  ? "h-screen overflow-hidden"
                  : "min-h-screen"
              }`}
            >
              {/* Protected layouts */}
              {isSignedIn && (
                <Suspense fallback={null}>
                  <LeftDock />
                </Suspense>
              )}

              <main className="flex flex-1 min-h-0 w-full max-w-full">
                {children}
              </main>

              {/* Footer and extras */}
              {!hideFooterAndGuide && <Footer />}
              <CookieConsent />
              <ServiceWorkerRegistration />
              {!hideFooterAndGuide && <NpcGuide />}
            </div>
          </div>
        </ProfileProvider>
      </ThemeProvider>
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
      <MainLayoutInner>{children}</MainLayoutInner>
    </SupabaseAuthProvider>
  );
}