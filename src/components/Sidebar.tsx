"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProfile } from "@/context/ProfileContext";
import { useUser } from "@clerk/nextjs";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Wrench, 
  ShoppingBag, 
  Image as ImageIcon, 
  Sparkles, 
  Settings,
  Users
} from "lucide-react";

const NAV_LINKS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Agent Chat", icon: MessageSquare, href: "/agent-chat" },
  { label: "AI Builder", icon: Wrench, href: "/builder" },
  { label: "Marketplace", icon: ShoppingBag, href: "/marketplace" },
  { label: "Gallery", icon: ImageIcon, href: "/gallery" },
  { label: "Event Ledger", icon: Activity, href: "/dashboard/events" },
  { label: "Showcase", icon: Sparkles, href: "/showcase" },
  { label: "Social", icon: Users, href: "/social" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { profile } = useProfile();
  const { user } = useUser();

  const displayName = profile?.displayName || user?.fullName || user?.username || "Agent";
  const userInitials = displayName.charAt(0).toUpperCase();

  return (
    <aside className="hidden lg:flex w-64 flex-col gap-4 shrink-0 h-full overflow-y-auto bg-volcanic-bg border-r border-volcanic-border p-4">
      {/* Mini Profile Card */}
      <Link href="/profile" className="p-3 volcanic-glass border border-volcanic-border hover:border-volcanic-accent rounded-lg transition-all cursor-pointer group mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-volcanic-accent to-volcanic-red flex items-center justify-center text-white text-sm font-black shadow-lg volcanic-glow">
            {userInitials}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-volcanic-text truncate">
              {displayName}
            </div>
            <div className="text-[10px] text-volcanic-text/50">View Node Profile</div>
          </div>
        </div>
      </Link>

      {/* Nav Links */}
      <nav className="flex flex-col gap-1">
        {NAV_LINKS.map(link => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          const Icon = link.icon;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-all group ${
                isActive
                  ? "bg-volcanic-accent/10 text-volcanic-accent font-semibold border border-volcanic-accent/20"
                  : "text-volcanic-text/60 hover:bg-volcanic-surface hover:text-volcanic-text border border-transparent"
              }`}
            >
              <Icon size={18} className={`${isActive ? "text-volcanic-accent" : "opacity-50 group-hover:opacity-100"} transition-opacity`} />
              <span className="text-sm">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4">
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-volcanic-text/50 hover:bg-volcanic-surface hover:text-volcanic-text transition-all border border-transparent ${
            pathname.startsWith("/settings") ? "text-volcanic-accent" : ""
          }`}
        >
          <Settings size={18} />
          <span className="text-sm">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
