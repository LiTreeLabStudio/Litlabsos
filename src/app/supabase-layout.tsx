import type { Metadata } from "next";
import MainLayout from "@/components/MainLayout"

export async function renderSupabaseLayout({
  children,
  metadata,
}: {
  children: React.ReactNode
  metadata: Metadata
}) {
  return (
    <body className="antialiased min-h-screen" style={{ backgroundColor: "#0a0a0f" }}>
      <MainLayout>{children}</MainLayout>
    </body>
  )
}