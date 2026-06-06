"use client";
import { useState } from "react";
import SocialMatrix from "@/components/SocialMatrix";
import { useAuth } from "@/context/AuthContext";

export default function SocialPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — Profile Card */}
          <div className="lg:col-span-1">
            <div className="card p-6 text-center">
              <div className="avatar w-20 h-20 text-2xl mx-auto mb-4">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
              </div>
              <h2 className="text-lg font-bold text-white">{user?.name || user?.email?.split("@")[0] || "Builder"}</h2>
              <p className="text-sm text-[#71717a] mt-1">AI Developer & Architect</p>
              <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-[#1a1a1a]">
                <div>
                  <div className="text-lg font-bold text-white">142</div>
                  <div className="text-xs text-[#71717a]">Projects</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-white">1.2K</div>
                  <div className="text-xs text-[#71717a]">Followers</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-white">842</div>
                  <div className="text-xs text-[#71717a]">Following</div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="card p-4 mt-4">
              <div className="text-xs font-medium text-[#555] uppercase tracking-wider mb-3">Quick Links</div>
              <div className="space-y-1">
                <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#a1a1aa] hover:bg-white/5 hover:text-white transition-colors">
                  <span>🏠</span> Dashboard
                </a>
                <a href="/chat" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#a1a1aa] hover:bg-white/5 hover:text-white transition-colors">
                  <span>💬</span> Chat
                </a>
                <a href="/builder" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#a1a1aa] hover:bg-white/5 hover:text-white transition-colors">
                  <span>🛠️</span> Builder
                </a>
                <a href="/marketplace" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#a1a1aa] hover:bg-white/5 hover:text-white transition-colors">
                  <span>🔧</span> Marketplace
                </a>
              </div>
            </div>
          </div>

          {/* Right — Feed */}
          <div className="lg:col-span-2">
            <SocialMatrix />
          </div>
        </div>
      </div>
    </div>
  );
}
