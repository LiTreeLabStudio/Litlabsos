import React from 'react';
import { ShieldCheck, Lock, CreditCard } from 'lucide-react';

export const TrustBadges = ({ colors }: { colors: any }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 mt-12 opacity-60 hover:opacity-100 transition-opacity">
      <div className="flex items-center gap-2">
        <ShieldCheck size={16} className="text-cyan-400" />
        <span className="text-[10px] font-bold tracking-widest uppercase">SOC 2 TYPE II</span>
      </div>
      <div className="flex items-center gap-2">
        <Lock size={16} className="text-cyan-400" />
        <span className="text-[10px] font-bold tracking-widest uppercase">GDPR COMPLIANT</span>
      </div>
      <div className="flex items-center gap-2">
        <CreditCard size={16} className="text-cyan-400" />
        <span className="text-[10px] font-bold tracking-widest uppercase">CRYPTO & STRIPE</span>
      </div>
    </div>
  );
};
