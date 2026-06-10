"use client";

import { CreditCard, ExternalLink, Package, History } from "lucide-react";

export default function BillingSettings() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-black text-volcanic-text uppercase tracking-wider mb-1">
          Credit Allocation
        </h1>
        <p className="text-xs text-volcanic-text/40">
          Manage your subscription and LiTBit fuel.
        </p>
      </div>

      <div className="p-6 bg-gradient-to-br from-volcanic-accent/20 to-volcanic-red/20 border border-volcanic-accent/30 rounded-lg volcanic-glow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-[10px] font-mono font-bold text-volcanic-accent uppercase tracking-widest mb-1">Current Plan</div>
            <div className="text-2xl font-black text-volcanic-text">HIVE_COMMANDER</div>
          </div>
          <div className="bg-volcanic-accent text-black px-2 py-1 rounded text-[10px] font-bold">PRO</div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-volcanic-text/60 font-mono">
            <span>Neural Tokens</span>
            <span>842,000 / 1,000,000</span>
          </div>
          <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
            <div className="h-full bg-volcanic-accent" style={{ width: "84.2%" }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button className="flex items-center justify-between p-4 bg-black/40 border border-volcanic-border rounded hover:border-volcanic-accent transition-all group">
          <div className="flex items-center gap-3">
            <Package size={20} className="text-volcanic-text/40 group-hover:text-volcanic-accent" />
            <div className="text-left">
              <div className="text-sm font-bold text-volcanic-text">Manage Plan</div>
              <div className="text-[10px] text-volcanic-text/40">Upgrade or downgrade</div>
            </div>
          </div>
          <ExternalLink size={16} className="text-volcanic-text/20" />
        </button>

        <button className="flex items-center justify-between p-4 bg-black/40 border border-volcanic-border rounded hover:border-volcanic-accent transition-all group">
          <div className="flex items-center gap-3">
            <History size={20} className="text-volcanic-text/40 group-hover:text-volcanic-accent" />
            <div className="text-left">
              <div className="text-sm font-bold text-volcanic-text">Transaction Logs</div>
              <div className="text-[10px] text-volcanic-text/40">View billing history</div>
            </div>
          </div>
          <ExternalLink size={16} className="text-volcanic-text/20" />
        </button>
      </div>

      <div className="pt-6 border-t border-volcanic-border">
        <div className="text-[10px] font-mono text-volcanic-text/40 uppercase tracking-widest mb-4">
          Payment Method
        </div>
        <div className="flex items-center gap-4 p-4 bg-volcanic-surface border border-volcanic-border rounded">
          <div className="w-12 h-8 bg-black/40 border border-volcanic-border rounded flex items-center justify-center">
            <CreditCard size={20} className="text-volcanic-text/20" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold text-volcanic-text">Visa ending in 4242</div>
            <div className="text-[10px] text-volcanic-text/40">Expires 12/28</div>
          </div>
          <button className="text-[10px] font-mono text-volcanic-accent hover:underline uppercase font-bold">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
