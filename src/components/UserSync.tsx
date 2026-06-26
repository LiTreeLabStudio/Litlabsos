"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";
import { useSupabaseAuth } from "@/app/supabase-auth";
import { LogOut, User } from "lucide-react";

export default function UserSync({
  onUserUpdate,
}: {
  onUserUpdate?: () => void;
}) {
  const { user, loading } = useSupabaseAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [sessionClaims, setSessionClaims] = useState({});
  const [localUser, setLocalUser] = useState(null);

  // Track if we've loaded the session and sync user details
  useEffect(() => {
    if (!loading) {
      Promise.resolve().then(() => {
        setIsLoaded(true);
        setIsSignedIn(user !== null);
        if (user) {
          setLocalUser(user);
          const metadata = user.user_metadata || {};
          setSessionClaims({
            name: metadata.full_name || metadata.name || null,
            username: metadata.username || metadata.email || null,
            avatar_url: metadata.avatar_url || null,
            provider: metadata.provider || null,
          });
        }
      });
    }
  }, [loading, user]);

  // Handle sign out
  const handleSignOut = async () => {
    if (localUser) {
      const { error } = await supabase.auth.signOut();
      if (error) console.error("Sign out error:", error);
      onUserUpdate?.();
    }
  };

  // Set up session listener for real-time updates
  useEffect(() => {
    if (!loading && user) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setLocalUser(session.user);
          setIsSignedIn(true);
          const { name, username, avatar_url } = session.user.user_metadata || {};
          setSessionClaims({
            name,
            username,
            avatar_url,
          });
        } else {
          setLocalUser(null);
          setIsSignedIn(false);
          setSessionClaims({});
        }
        onUserUpdate?.();
      });

      return () => {
        data.subscription?.unsubscribe();
      };
    }
  }, [loading, user, onUserUpdate]);

  // Generate avatar URL from email if no avatar_url exists
  const getAvatarUrl = (email: string) => {
    if (!email) return "/default-avatar.png";
    let hash = 0;
    const str = email.toLowerCase();
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return `/avatar/${Math.abs(hash) % 1000}.png`;
  };

  if (!localUser) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-16 h-16 rounded-full border-2 border-white/10 animate-pulse">
          <span className="text-3xl font-bold text-white">?</span>
        </div>
        <p className="text-sm text-white/60 mt-1">
          Sign in to sync your profile across sessions.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-4">
      {/* Profile Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src={localUser.user_metadata?.avatar_url || getAvatarUrl(localUser.email || "")}
            alt={localUser.user_metadata?.name || "Profile"}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white">
            {localUser.user_metadata?.name || localUser.email}
          </p>
          <p className="text-xs text-white/70 capitalize mt-1">
            {localUser.user_metadata?.role || "Builder"}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={handleSignOut}
          aria-label="Sign out"
          className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm transition-all hover:bg-white/30"
        >
          <span className="w-5 h-5">
            <LogOut className="w-4 h-4 text-red-400" aria-hidden="true" />
          </span>
          <span className="ml-1 text-white">Sign Out</span>
        </button>

        <Link
          href="/profile"
          className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm transition-all hover:bg-white/30"
        >
          <span className="w-5 h-5">
            <User className="w-4 h-4 text-white" aria-hidden="true" />
          </span>
          <span className="ml-1 text-white">View Profile</span>
        </Link>
      </div>

      {/* Session Claims */}
      <div className="space-y-2 text-sm">
        <div className="text-white/70">
          <span>Session Claims</span>
          <div className="font-mono text-xs mt-1">
            {JSON.stringify(sessionClaims, null, 2)}
            {sessionClaims && (
              <div className="text-white/60 mt-1 text-xs">
                (Extracted from auth metadata)
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-3 flex gap-3">
          <div className="text-white/60">
            <span>•</span> Signed In:{' '}
            {isSignedIn ? <span className="text-white font-medium">Yes</span> : (
              <span className="text-white/50">No</span>
            )}
          </div>

          <div className="text-white/60">
            <span>•</span> Profile Complete:{' '}
            {localUser?.user_metadata?.full_name ? <span className="text-white font-medium">Yes</span> : (
              <span className="text-white/50">No</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}