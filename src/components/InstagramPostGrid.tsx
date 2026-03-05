import React, { useEffect, useState, useCallback } from "react";
import { Instagram, ExternalLink, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InstagramPost {
  thumbnailUrl: string;
  permalink: string;
  timestamp: string;
}

interface InstagramPostGridProps {
  handle: string;
  schoolName?: string;
}

const GRID_SIZE = 9;

const PlaceholderTile = ({ index }: { index: number }) => (
  <div
    className={cn(
      "aspect-square rounded-lg border border-border/30 bg-muted/30",
      "flex items-center justify-center transition-colors"
    )}
  >
    <ImageIcon className="h-6 w-6 text-muted-foreground/30" />
  </div>
);

const SkeletonTile = () => (
  <div className="aspect-square rounded-lg bg-muted/40 animate-pulse" />
);

const PostTile = ({ post, alt }: { post: InstagramPost; alt: string }) => (
  <a
    href={post.permalink}
    target="_blank"
    rel="noopener noreferrer"
    className={cn(
      "aspect-square rounded-lg overflow-hidden border border-border/30",
      "relative group cursor-pointer",
      "transition-transform duration-200 hover:scale-[1.03] hover:shadow-lg hover:shadow-primary/10"
    )}
  >
    <img
      src={post.thumbnailUrl}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="w-full h-full object-cover"
      style={{ filter: "none", transform: "none" }}
    />
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
      <ExternalLink className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
    </div>
  </a>
);

const InstagramPostGrid: React.FC<InstagramPostGridProps> = ({ handle, schoolName }) => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  const cleanHandle = handle.replace("@", "");
  const profileUrl = `https://www.instagram.com/${cleanHandle}/`;

  const fetchPosts = useCallback(async () => {
    setStatus("loading");
    try {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/instagram-posts?handle=${encodeURIComponent(cleanHandle)}`,
        {
          headers: {
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "",
          },
        }
      );
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setPosts(data.posts || []);
      setStatus("loaded");
    } catch {
      // Graceful degradation — show placeholder grid
      setPosts([]);
      setStatus("error");
    }
  }, [cleanHandle]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const isLoading = status === "loading";
  const isError = status === "error";
  const postCount = posts.length;

  // Build the 9-tile grid: real posts + placeholders
  const tiles = Array.from({ length: GRID_SIZE }, (_, i) => {
    if (isLoading) return <SkeletonTile key={i} />;
    if (i < postCount) {
      return (
        <PostTile
          key={posts[i].permalink}
          post={posts[i]}
          alt={`${schoolName || cleanHandle} Instagram post ${i + 1}`}
        />
      );
    }
    return <PlaceholderTile key={`placeholder-${i}`} index={i} />;
  });

  // Status message
  let statusMessage: string | null = null;
  if (isLoading) {
    statusMessage = "Loading posts…";
  } else if (isError) {
    statusMessage = "Posts unavailable right now";
  } else if (postCount === 0) {
    statusMessage = "No posts yet";
  }

  return (
    <section
      className="py-12 px-4"
      role="region"
      aria-label={`Instagram posts from ${schoolName || `@${cleanHandle}`}`}
    >
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Instagram className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">
              Class Instagram
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Real posts from your class account
          </p>
        </div>

        {/* Status message */}
        {statusMessage && (
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground">{statusMessage}</p>
            {postCount === 0 && !isLoading && (
              <p className="text-xs text-muted-foreground/60 mt-1">
                Be one of the first to get featured.
              </p>
            )}
          </div>
        )}

        {/* 3×3 Grid */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {tiles}
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3">
          <Button
            onClick={() => window.open(profileUrl, "_blank", "noopener,noreferrer")}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Instagram className="h-4 w-4 mr-2" />
            Follow @{cleanHandle}
          </Button>

          {postCount >= 9 && (
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              View more on Instagram
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default InstagramPostGrid;
