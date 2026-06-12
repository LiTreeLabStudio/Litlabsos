import React from 'react';
import Link from 'next/link';

interface Colors {
  bgColor: string;
  textColor: string;
  accentColor: string;
  linkColor: string;
  headerColor: string;
  borderColor: string;
  boxBg: string;
}

export const PricingPlans = ({ colors }: { colors: Colors }) => {
  const plans = [
    { name: "Alpha", price: "0", tokens: "500", desc: "Basic agent testing", features: ["1 Active Agent", "Basic Support", "Public Gallery"] },
    { name: "Galaxy", price: "49", tokens: "25k", desc: "For professional builders", features: ["10 Active Agents", "Priority Processing", "Private Models", "Custom Workflows"] },
    { name: "Universe", price: "199", tokens: "150k", desc: "Enterprise orchestration", features: ["Unlimited Agents", "Dedicated Support", "API Access", "White-label Deploy"] }
  ];

  return (
    <div className="py-20 border-t border-white/5">
      <div className="text-center mb-16">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Subscription Plans</h2>
        <p className="text-white/60 max-w-2xl mx-auto">Scale your AI operations from a single agent to a global swarm.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        {plans.map((plan, i) => (
          <div key={i} className={'glass-card p-8 rounded-2xl flex flex-col border border-white/10 ' + (i === 1 ? 'border-cyan-500/30' : '')} style={i === 1 ? { boxShadow: '0 0 30px rgba(6,182,212,0.1)' } : {}}>
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <p className="text-xs text-white/50">{plan.desc}</p>
            </div>
            <div className="mb-8">
              <span className="text-4xl font-black">${plan.price}</span>
              <span className="text-white/40 text-sm"> / mo</span>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center gap-2 text-sm text-white/70">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/sign-up" className="btn btn-primary w-full py-4 font-bold" style={{ background: i === 1 ? colors.linkColor : 'rgba(255,255,255,0.05)', color: i === 1 ? '#000' : 'white', border: i === 1 ? 'none' : '1px solid rgba(255,255,255,0.1)' }}>
              Choose {plan.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
