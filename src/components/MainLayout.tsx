"use client";

import { usePathname } from "next/navigation";
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

  // Pages that should be full-screen "App" style without global footer
  const isAppPage =
    pathname?.startsWith("/studio") || pathname?.startsWith("/agent");

  // Pages where the content should fill remaining viewport height (flex-1 child fills)
  const isFullHeightPage = isAppPage || pathname === "/";

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

          {!isAppPage && <Footer />}

          <CookieConsent />
          <ServiceWorkerRegistration />
          {!isAppPage && <NpcGuide />}
        </div>
      </ProfileProvider>
    </ThemeProvider>
  );
}
