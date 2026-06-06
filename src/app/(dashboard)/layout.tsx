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
    <div className="min-h-screen flex flex-col bg-ide-bg text-zinc-300 overflow-hidden font-sans">
      <Navbar />

      {/* Main Architecture */}
      <div className="flex flex-1 max-w-[1600px] mx-auto w-full pt-4 relative z-10 h-[calc(100vh-3.5rem)] overflow-hidden">
        <Sidebar user={user} />

        <main className="flex-1 px-4 lg:px-8 overflow-y-auto custom-scrollbar h-full pb-20 border-l border-ide-border">
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
