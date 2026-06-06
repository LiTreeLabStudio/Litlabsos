import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/jwt";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/RightSidebar";
import ChatWidget from "@/components/ChatWidget";
import DMInboxWrapper from "@/components/DMInboxWrapper";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    redirect("/login");
  }

  // Decode user from token for the Sidebar
  let user: { name: string | null; email: string } | null = null;
  try {
    const payload = await verifyToken(token);
    if (payload) {
      user = {
        name: (payload.name as string) || null,
        email: (payload.email as string) || "",
      };
    }
  } catch {
    // ignore — sidebar handles null user
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-zinc-300 hud-scanlines overflow-hidden">
      {/* Volcanic Ambient Glow & Grid */}
      <div className="fixed inset-0 hud-grid opacity-10 pointer-events-none z-0" />
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 shadow-[0_0_15px_rgba(234,88,12,0.5)] z-50" />
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-orange-600/5 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-red-600/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <Navbar />

      {/* 3-Column Social Architecture */}
      <div className="flex flex-1 max-w-[1600px] mx-auto w-full pt-4 relative z-10 h-[calc(100vh-3.5rem)] overflow-hidden">
        <Sidebar user={user} />

        <main className="flex-1 px-4 lg:px-8 overflow-y-auto custom-scrollbar h-full pb-20">
          <div className="max-w-[700px] mx-auto w-full">
            {children}
          </div>
        </main>

        <RightSidebar />
      </div>

      <ChatWidget />
      <DMInboxWrapper />
    </div>
  );
}
