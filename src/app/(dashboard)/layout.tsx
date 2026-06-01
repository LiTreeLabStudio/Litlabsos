import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/jwt";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ChatWidget from "@/components/ChatWidget";

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

  const payload = await verifyToken(token);
  if (!payload) {
    redirect("/login");
  }

  const user = {
    id: (payload.id as string) || "",
    email: (payload.email as string) || "",
    name: (payload.name as string) || null,
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050508] text-zinc-300">
      {/* Volcanic Ambient Glow */}
      <div className="fixed top-0 left-0 w-full h-1 bg-linear-to-r from-orange-600 via-red-600 to-orange-600 shadow-[0_0_15px_rgba(234,88,12,0.5)] z-50" />
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-orange-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />
      
      <Navbar user={user} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto relative">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-20" />
          <div className="relative z-10">{children}</div>
        </main>
      </div>
      <ChatWidget />
    </div>
  );
}
