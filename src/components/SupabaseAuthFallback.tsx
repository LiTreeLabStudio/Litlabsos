"use client";

import { Component, type ReactNode } from "react"
import Link from "next/link"
import { useSupabaseAuthHook } from "@/hooks/useSupabaseAuth"

type NavAuthProps = {
  linkColor?: string
}

class ClerkBoundary extends Component<{ fallback: ReactNode; children: ReactNode }> {
  state = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

function CustomAuthFallback() {
  return (
    <div className="rounded-full animate-pulse" style={{ width: 28, height: 28, backgroundColor: "#4f46e520", border: "1px solid #4f46e540" }} />
  )
}

function AuthInner({ linkColor }: NavAuthProps) {
  const { user, loading, isSignedIn, signOut } = useSupabaseAuthHook()

  if (loading) {
    return (
      <div
        className="rounded-full animate-pulse"
        style={{
          width: 28,
          height: 28,
          backgroundColor: linkColor + "20",
          border: `1px solid ${linkColor}40`,
        }}
      />
    )
  }

  if (isSignedIn) {
    const firstName = (user?.user_metadata?.full_name as string)?.split(" ")[0] || user?.email?.split("@")[0] || ""
      return (
        <div className="flex items-center gap-1.5">
          {firstName && (
            <span className="text-[11px] font-bold truncate max-w-[80px]" style={{ color: linkColor }}>
              {firstName}
            </span>
          )}
          <button
            onClick={signOut}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition-all"
            aria-label="Sign out"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      )
  }

  return (
    <Link
      href="/sign-in"
      className="px-3.5 py-1.5 rounded-md text-[11px] font-bold cursor-pointer transition-all hover:opacity-90"
      style={{
        backgroundColor: linkColor,
        color: "#fff",
        letterSpacing: "0.05em",
      }}
    >
      Sign In
    </Link>
  )
}

export function NavAuth({ linkColor = "#4f46e5" }: NavAuthProps) {
  return (
    <ClerkBoundary fallback={<CustomAuthFallback />}>
      <AuthInner linkColor={linkColor} />
    </ClerkBoundary>
  )
}