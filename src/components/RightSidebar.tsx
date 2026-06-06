"use client";

const CONTACTS = [
  { name: "Code Champion", avatar: "🧩", color: "from-orange-600 to-red-600" },
  { name: "Data Slayer", avatar: "📊", color: "from-blue-600 to-cyan-600" },
  { name: "Social Bot", avatar: "🔥", color: "from-red-600 to-orange-700" },
  { name: "UX Wizard", avatar: "🎨", color: "from-purple-600 to-pink-600" },
  { name: "ML Engineer", avatar: "🤖", color: "from-green-600 to-emerald-600" },
  { name: "Cloud Arch", avatar: "☁️", color: "from-sky-600 to-blue-700" },
  { name: "DevOps Pro", avatar: "🔧", color: "from-amber-600 to-orange-600" },
  { name: "Security Bot", avatar: "🛡️", color: "from-rose-600 to-red-700" },
];

export default function RightSidebar() {
  return (
    <aside className="hidden 2xl:flex w-64 flex-col gap-4 shrink-0 h-full overflow-y-auto custom-scrollbar pb-6 pl-4 border-l border-white/5">
      <div className="flex justify-between items-center px-2 mt-2">
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Contacts</h3>
        <div className="flex gap-3 text-zinc-500">
          <span className="cursor-pointer hover:text-white transition-colors text-sm">🔍</span>
          <span className="cursor-pointer hover:text-white transition-colors text-sm">⚙️</span>
        </div>
      </div>

      <div className="space-y-0.5">
        {CONTACTS.map(c => (
          <div key={c.name} className="flex items-center gap-3 p-2 hover:bg-zinc-900/50 rounded-lg cursor-pointer group transition-colors">
            <div className="relative">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center text-white text-xs shadow-md`}>
                {c.avatar}
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-black rounded-full" />
            </div>
            <div className="text-[12px] font-semibold text-zinc-400 group-hover:text-white transition-colors truncate">
              {c.name}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
