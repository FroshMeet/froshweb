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
          <article key={p.id} className="rounded-2xl border p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-gray-200" />
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-xs text-gray-500">{p.school} • {p.major}</div>
              </div>
            </div>
            <p className="text-sm">{p.bio}</p>
            <div className="mt-3 flex gap-2">
              <button className="rounded-xl border px-3 py-1 text-sm">Message</button>
              <button className="rounded-xl border px-3 py-1 text-sm">View Profile</button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}