import React, { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, ExternalLink } from "lucide-react";

interface InstagramSectionProps {
  schoolName: string;
  instagramHandle: string;
}

const InstagramSection: React.FC<InstagramSectionProps> = ({ schoolName, instagramHandle }) => {
  const [status, setStatus] = useState<"loading" | "loaded" | "failed">("loading");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const cleanHandle = instagramHandle.replace("@", "");
  const profileUrl = `https://www.instagram.com/${cleanHandle}/`;
  // Use the iframe-based embed endpoint with dark theme
  const embedUrl = `https://www.instagram.com/${cleanHandle}/embed/`;

  const handleIframeLoad = useCallback(() => {
    clearTimeout(timerRef.current);
    setStatus("loaded");
  }, []);

  const handleIframeError = useCallback(() => {
    clearTimeout(timerRef.current);
    if (import.meta.env.DEV) {
      console.warn(`[InstagramSection] Embed failed for @${cleanHandle}`);
    }
    setStatus("failed");
  }, [cleanHandle]);

  useEffect(() => {
    setStatus("loading");
    // Timeout fallback: if iframe doesn't load within 8s, show fallback
    timerRef.current = setTimeout(() => {
      if (import.meta.env.DEV) {
        console.warn(`[InstagramSection] Embed timed out for @${cleanHandle}`);
      }
      setStatus("failed");
    }, 6000);

    return () => clearTimeout(timerRef.current);
  }, [cleanHandle]);

  const showFallback = status === "failed";

  return (
    <section
      className="py-12 px-4"
      role="region"
      aria-label={`Instagram posts from the ${schoolName} Class of 2030 community`}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {schoolName} Class Instagram
          </h2>
          <p className="text-muted-foreground">Real posts from your class community</p>
        </div>

        <Card className="bg-card/80 border-border/40 rounded-2xl overflow-hidden shadow-lg">
          <CardContent className="py-8 px-4 md:px-6">
            {/* Embed / Fallback area */}
            <div className="flex justify-center mb-6 overflow-hidden max-w-full">
              {!showFallback ? (
                <div className="relative w-full max-w-[540px] rounded-xl overflow-hidden border border-border/30 bg-card">
                  {/* Dark overlay wrapper to blend with dark theme */}
                <div className="relative" style={{ minHeight: 400 }}>
                    {status === "loading" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-card z-10">
                        <div className="flex flex-col items-center gap-3">
                          <Instagram className="h-8 w-8 text-muted-foreground/50 animate-pulse" />
                          <p className="text-sm text-muted-foreground">Loading preview…</p>
                        </div>
                      </div>
                    )}
                    <iframe
                      ref={iframeRef}
                      src={embedUrl}
                      className="w-full border-0"
                      style={{
                        minHeight: 480,
                        maxHeight: 600,
                        filter: "none",
                        transform: "none",
                      }}
                      loading="lazy"
                      scrolling="no"
                      onLoad={handleIframeLoad}
                      onError={handleIframeError}
                      title={`Instagram feed for @${cleanHandle}`}
                    />
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center w-full">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-5">
                    <Instagram className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-foreground font-semibold text-lg mb-1">No posts yet</p>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-1">
                    This class Instagram is just getting started. Be one of the first to get featured.
                  </p>
                  <p className="text-muted-foreground/60 text-xs">
                    Preview unavailable.{" "}
                    <a
                      href={profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Open on Instagram <ExternalLink className="h-3 w-3" />
                    </a>
                  </p>
                </div>
              )}
            </div>

            {/* Follow CTA — always visible */}
            <div className="flex justify-center">
              <Button
                onClick={() => window.open(profileUrl, "_blank", "noopener,noreferrer")}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Instagram className="h-4 w-4 mr-2" />
                Follow @{cleanHandle}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default InstagramSection;
