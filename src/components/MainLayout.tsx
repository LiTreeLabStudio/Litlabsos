"use client";

import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UserSync from "@/components/UserSync";
import CookieConsent from "@/components/CookieConsent";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import AnimatedBackgroundWrapper from "@/components/AnimatedBackgroundWrapper";
import dynamicImport from "next/dynamic";
import { ThemeProvider } from "@/context/ThemeContext";
import { ProfileProvider } from "@/context/ProfileContext";

const NpcGuide = dynamicImport(() => import("@/components/NpcGuide"), {
  ssr: false,
});

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  let isSignedIn = false;
  try {
    const userContext = useUser();
    isSignedIn = !!userContext?.isSignedIn;
  } catch {
    // Treat as signed out during SSR / initialization
  }

  // Pages that should be full-screen "App" style without global footer
  const isAppPage =
    pathname?.startsWith("/studio") || pathname?.startsWith("/agent");

  // Determine if we are on a dashboard/social shell route and the user is authenticated
  const isDashboardRoute = pathname === "/" || pathname === "/social";
  const showDashboardLayout = isDashboardRoute && isSignedIn;

  // Pages where the content should fill remaining viewport height (flex-1 child fills)
  const isFullHeightPage = isAppPage || showDashboardLayout;
  const hideFooterAndGuide = isAppPage || showDashboardLayout;

  return (
    <ThemeProvider>
      <ProfileProvider>
        <AnimatedBackgroundWrapper />
        <div
          className={`relative z-10 flex flex-col w-full max-w-full ${isFullHeightPage ? "h-screen overflow-hidden" : "min-h-screen"}`}
        >
          <UserSync />

          <div className="shrink-0 w-full">
            <Navbar />
          </div>

          <main
            className={`w-full max-w-full flex flex-col ${isFullHeightPage ? "flex-1 overflow-hidden min-h-0" : ""}`}
          >
            {children}
          </main>

          {!hideFooterAndGuide && <Footer />}

          <CookieConsent />
          <ServiceWorkerRegistration />
          {!hideFooterAndGuide && <NpcGuide />}
        </div>
      </ProfileProvider>
    </ThemeProvider>
  );
}

