import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// In-memory cache: handle -> { data, timestamp }
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

// De-duplication: pending fetches
const pending = new Map<string, Promise<unknown>>();

interface PostData {
  thumbnailUrl: string;
  permalink: string;
  timestamp: string;
}

async function fetchInstagramPosts(handle: string): Promise<PostData[]> {
  // Try Instagram Graph API if token is available
  const accessToken = Deno.env.get("INSTAGRAM_GRAPH_TOKEN");
  const igUserId = Deno.env.get("INSTAGRAM_USER_ID");

  if (accessToken && igUserId) {
    try {
      // Graph API: get recent media
      const url = `https://graph.instagram.com/v18.0/${igUserId}/media?fields=id,media_type,media_url,thumbnail_url,permalink,timestamp&limit=9&access_token=${accessToken}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        return (data.data || [])
          .filter((m: any) => m.media_url || m.thumbnail_url)
          .slice(0, 9)
          .map((m: any) => ({
            thumbnailUrl: m.thumbnail_url || m.media_url,
            permalink: m.permalink,
            timestamp: m.timestamp,
          }));
      }
      await res.text(); // consume body
    } catch {
      // Fall through to fallback
    }
  }

  // Fallback: try to fetch from Instagram's public oEmbed-like endpoints
  // Since reliable public APIs don't exist without auth, return empty
  // This ensures the UI gracefully shows the placeholder grid
  return [];
}

async function getPostsForHandle(handle: string): Promise<unknown> {
  // Check cache
  const cached = cache.get(handle);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  // De-duplicate concurrent requests
  const inflight = pending.get(handle);
  if (inflight) return inflight;

  const promise = (async () => {
    try {
      const posts = await fetchInstagramPosts(handle);
      const result = { handle, posts };
      cache.set(handle, { data: result, timestamp: Date.now() });
      return result;
    } finally {
      pending.delete(handle);
    }
  })();

  pending.set(handle, promise);
  return promise;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const handle = url.searchParams.get("handle");

    if (!handle || !/^[a-zA-Z0-9._]{1,60}$/.test(handle)) {
      return new Response(
        JSON.stringify({ error: "Invalid handle" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await getPostsForHandle(handle.toLowerCase());

    return new Response(JSON.stringify(data), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=1800",
      },
    });
  } catch (error) {
    console.error("instagram-posts error:", error);
    return new Response(
      JSON.stringify({ handle: "", posts: [] }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
