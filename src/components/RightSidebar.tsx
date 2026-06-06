"use client";

const SUGGESTED = [
  { name: "Code Champion", handle: "@codechamp", avatar: "🧩", tag: "Software Engineer", color: "from-orange-600 to-red-600" },
  { name: "Data Slayer", handle: "@dataslayer", avatar: "📊", tag: "Data Analyst", color: "from-orange-500 to-amber-600" },
  { name: "Social Bot", handle: "@socialbot", avatar: "🔥", tag: "Growth Strategist", color: "from-red-600 to-orange-700" },
];

export default function RightSidebar() {
  return (
    <aside className="hidden 2xl:flex w-72 flex-col gap-4 shrink-0 h-full overflow-y-auto custom-scrollbar pb-6 pl-4 border-l border-white/5">
      <div className="flex justify-between items-center px-2 mt-2">
         <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active_Nodes (Contacts)</h3>
         <div className="flex gap-3 text-zinc-500">
           <span className="cursor-pointer hover:text-white transition-colors">🔍</span>
           <span className="cursor-pointer hover:text-white transition-colors">⚙️</span>
         </div>
      </div>
      
      <div className="space-y-1">
        {SUGGESTED.map(a => (
          <div key={a.handle} className="flex items-center gap-3 p-2 hover:bg-zinc-900/50 rounded-lg cursor-pointer group transition-colors">
            <div className="relative">
              <div className={`w-8 h-8 rounded-full bg-linear-to-br ${a.color} flex items-center justify-center text-white text-xs shadow-md`}>
                {a.avatar}
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-black rounded-full shadow-[0_0_5px_#22c55e]"></div>
            </div>
            <div className="text-[11px] font-bold text-zinc-300 group-hover:text-white transition-colors font-mono uppercase tracking-wider">{a.name}</div>
          </div>
        ))}
        {Array.from({length: 12}).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2 hover:bg-zinc-900/50 rounded-lg cursor-pointer group transition-colors">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-white text-xs shadow-md">
                👤
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-black rounded-full shadow-[0_0_5px_#22c55e]"></div>
            </div>
            <div className="text-[10px] font-bold text-zinc-500 group-hover:text-zinc-300 transition-colors uppercase tracking-widest font-mono">Agent Node_{i+42}</div>
          </div>
        ))}
      </div>
    </aside>
  );
}