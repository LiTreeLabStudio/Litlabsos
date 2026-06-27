import type { Metadata } from "next";
import MainLayout from "@/components/MainLayout"

export async function renderSupabaseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}