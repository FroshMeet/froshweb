"use client";

import { MOCK_PROFILES } from "./mockData";

interface MockDiscoverProps {
  schoolName?: string;
  schoolSlug?: string;
}

export default function MockDiscover({ schoolName, schoolSlug }: MockDiscoverProps){
  return (
    <main className="p-4">
      <div className="mb-3 rounded-xl border bg-yellow-50 px-4 py-2 text-sm">
        Dev Mode is ON — showing mock profiles & all group chats.
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_PROFILES.map(p=>(
          <article key={p.id} className="rounded-2xl border border-white/20 bg-card p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-primary/20" />
              <div>
                <div className="font-semibold text-foreground">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.school} • {p.major}</div>
              </div>
            </div>
            <p className="text-sm text-foreground">{p.bio}</p>
            <div className="mt-3 flex gap-2">
              <button className="rounded-xl border border-primary bg-primary/10 px-3 py-1 text-sm text-primary hover:bg-primary/20">Message</button>
              <button className="rounded-xl border border-white/20 px-3 py-1 text-sm text-foreground hover:bg-white/10">View Profile</button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}