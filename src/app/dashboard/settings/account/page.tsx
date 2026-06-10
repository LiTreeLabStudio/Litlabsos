"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Key, Mail, Trash2 } from "lucide-react";

export default function AccountSettings() {
  const { user } = useUser();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-black text-volcanic-text uppercase tracking-wider mb-1">
          Neural Auth & Security
        </h1>
        <p className="text-xs text-volcanic-text/40">
          Manage your access keys and security protocols.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-volcanic-surface border border-volcanic-border rounded">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-volcanic-accent/30 overflow-hidden">
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-12 h-12"
                  }
                }}
              />
            </div>
            <div>
              <div className="text-sm font-bold text-volcanic-text">{user?.fullName || "Agent"}</div>
              <div className="text-[10px] text-volcanic-text/40 font-mono">{user?.primaryEmailAddress?.emailAddress}</div>
            </div>
          </div>
          <div className="bg-volcanic-accent/10 text-volcanic-accent px-2 py-1 rounded text-[10px] font-mono font-bold border border-volcanic-accent/20">
            ENCRYPTED_NODE
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-black/40 border border-volcanic-border rounded space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-volcanic-text/40 uppercase tracking-widest">
              <Key size={12} />
              Access Control
            </div>
            <p className="text-[11px] text-volcanic-text/60">
              Manage your passwords, multi-factor authentication, and hardware keys via the auth provider.
            </p>
            <button className="text-[10px] font-mono text-volcanic-accent hover:underline uppercase font-bold">
              Manage Credentials →
            </button>
          </div>

          <div className="p-4 bg-black/40 border border-volcanic-border rounded space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-volcanic-text/40 uppercase tracking-widest">
              <Mail size={12} />
              Verified Comms
            </div>
            <p className="text-[11px] text-volcanic-text/60">
              Manage your verified email addresses and phone numbers for node recovery.
            </p>
            <button className="text-[10px] font-mono text-volcanic-accent hover:underline uppercase font-bold">
              Update Verified Data →
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-volcanic-red/20">
          <div className="p-6 bg-volcanic-red/5 border border-volcanic-red/20 rounded-lg space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-volcanic-red uppercase tracking-widest">
              <Trash2 size={14} />
              Decommission Node
            </div>
            <p className="text-xs text-volcanic-text/60">
              This action is permanent. Decommissioning your node will purge all neural weights, 
              historical logs, and associated agent identities from the hive mind.
            </p>
            <button className="px-4 py-2 bg-volcanic-red/20 text-volcanic-red border border-volcanic-red/40 rounded text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-volcanic-red/30 transition-all">
              Initiate Self-Destruct Sequence
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
