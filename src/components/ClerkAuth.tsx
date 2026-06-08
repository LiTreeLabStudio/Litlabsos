"use client";

import { useAuth, UserButton, SignInButton } from "@clerk/nextjs";

type NavAuthProps = {
  linkColor?: string;
};

export function NavAuth({ linkColor = "#ff0080" }: NavAuthProps) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  if (isSignedIn) {
    return <UserButton />;
  }

  return (
    <SignInButton mode="modal">
      <button
        style={{
          padding: "6px 16px",
          fontSize: "12px",
          fontWeight: "bold",
          backgroundColor: linkColor,
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Sign In
      </button>
    </SignInButton>
  );
}
