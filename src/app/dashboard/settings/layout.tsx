"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  User, 
  Palette, 
  CreditCard, 
  Shield, 
  Bell, 
  Smartphone,
  ChevronRight
} from "lucide-react";

const SETTINGS_SECTIONS = [
  { id: "profile", label: "Profile", icon: User, href: "/dashboard/settings/profile" },
  { id: "appearance", label: "Appearance", icon: Palette, href: "/dashboard/settings/appearance" },
  { id: "billing", label: "Billing", icon: CreditCard, href: "/dashboard/settings/billing" },
  { id: "account", label: "Account", icon: Shield, href: "/dashboard/settings/account" },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Settings Navigation */}
      <aside className="w-full lg:w-64 shrink-0">
        <div className="space-y-1">
          {SETTINGS_SECTIONS.map((section) => {
            const isActive = pathname === section.href;
            const Icon = section.icon;
            return (
              <Link
                key={section.id}
                href={section.href}
                className={`flex items-center justify-between px-4 py-3 rounded-md transition-all group ${
                  isActive
                    ? "bg-volcanic-accent/10 text-volcanic-accent border border-volcanic-accent/20"
                    : "text-volcanic-text/60 hover:bg-volcanic-surface hover:text-volcanic-text border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? "text-volcanic-accent" : "opacity-50 group-hover:opacity-100"} />
                  <span className="text-sm font-bold">{section.label}</span>
                </div>
                {isActive && <ChevronRight size={14} className="text-volcanic-accent" />}
              </Link>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-volcanic-border">
          <h3 className="text-[10px] font-mono text-volcanic-text/40 uppercase tracking-widest mb-4 px-4">
            Preferences
          </h3>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-2 text-volcanic-text/50 hover:text-volcanic-text transition-colors">
              <Bell size={16} />
              <span className="text-xs">Notifications</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 text-volcanic-text/50 hover:text-volcanic-text transition-colors">
              <Smartphone size={16} />
              <span className="text-xs">Sessions</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Settings Content */}
      <div className="flex-1 min-w-0">
        <div className="volcanic-glass border border-volcanic-border rounded-lg p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
