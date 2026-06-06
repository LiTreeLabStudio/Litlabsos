"use client";

import { useState } from "react";
import DMInbox from "./DMInbox";

export default function DMInboxWrapper() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Message Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-6 z-40 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 flex items-center justify-center text-white text-xl transition-all hover:scale-105 active:scale-95"
        title="Messages"
      >
        💬
      </button>

      {/* DM Inbox */}
      {open && <DMInbox onClose={() => setOpen(false)} />}
    </>
  );
}
