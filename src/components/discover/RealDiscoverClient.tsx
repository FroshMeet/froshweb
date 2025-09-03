"use client";

// IMPORTANT: All Supabase imports/hooks go here, NOT in ClientShell or other components.
import { useEffect, useState } from "react";
import { useProfiles } from "@/hooks/useProfiles";

interface RealDiscoverClientProps {
  schoolName?: string;
  schoolSlug?: string;
}

export default function RealDiscoverClient({ schoolName, schoolSlug }: RealDiscoverClientProps){
  const { profiles, loading } = useProfiles(schoolSlug || '');
  const [posts,setPosts] = useState<any[]|null>(null);
  
  useEffect(()=>{ 
    let alive = true; 
    // Simulate real data fetching - replace with actual Supabase calls
    (async()=>{
      try{
        // const supabase = createClient();
        // const { data, error } = await supabase.from("posts").select("*").limit(20);
        // if(error) throw error;
        const data:any[] = profiles; // use real profiles from hook
        if(alive) setPosts(data);
      }catch{ 
        if(alive) setPosts([]); 
      }
    })(); 
    return()=>{alive=false}; 
  },[profiles]);
  
  if(loading) return null;
  
  const has = (posts?.length ?? 0) > 0;
  
  return (
    <main className="p-4">
      {has ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {posts!.map((p,i)=>(
            <div key={i} className="rounded-xl border p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div>
                  <div className="font-semibold">{p.full_name || `Profile ${i+1}`}</div>
                  <div className="text-xs text-gray-500">Class of {p.class_year || '2028'}</div>
                </div>
              </div>
              <p className="text-sm">{p.bio || 'Real profile from Supabase'}</p>
              <div className="mt-3 flex gap-2">
                <button className="rounded-xl border px-3 py-1 text-sm">Message</button>
                <button className="rounded-xl border px-3 py-1 text-sm">View Profile</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border p-6 text-center">
          No profiles yet for {schoolName} — <button className="underline">Be the First Posted!</button>
        </div>
      )}
    </main>
  );
}