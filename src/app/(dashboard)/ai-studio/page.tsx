"use client";
import AIStudioHub from "@/components/AIStudioHub";
import Navbar from "@/components/Navbar";

export default function AIStudioPage() {
  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">AI Studio</h1>
          <p className="text-sm text-[#71717a]">Design and preview AI interfaces.</p>
        </div>
        <AIStudioHub />
      </main>
    </div>
  );
}
