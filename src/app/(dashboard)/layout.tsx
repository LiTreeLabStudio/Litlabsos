import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

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

  return (
    <div className="min-h-screen flex flex-col bg-[#050505]">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
