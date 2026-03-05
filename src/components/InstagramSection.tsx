import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";

interface InstagramSectionProps {
  schoolName: string;
  instagramHandle: string;
}

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

const InstagramSection: React.FC<InstagramSectionProps> = ({ schoolName, instagramHandle }) => {
  const [embedLoaded, setEmbedLoaded] = useState(false);
  const [embedFailed, setEmbedFailed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const cleanHandle = instagramHandle.replace("@", "");
  const profileUrl = `https://www.instagram.com/${cleanHandle}/`;

  useEffect(() => {
    // Try to load embed script and render profile embed
    const timeout = setTimeout(() => {
      if (!embedLoaded) setEmbedFailed(true);
    }, 6000);

    const loadEmbed = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
        setEmbedLoaded(true);
        clearTimeout(timeout);
        return;
      }

      const existing = document.querySelector('script[src*="instagram.com/embed.js"]');
      if (!existing) {
        const script = document.createElement("script");
        script.src = "https://www.instagram.com/embed.js";
        script.async = true;
        script.onload = () => {
          if (window.instgrm) {
            window.instgrm.Embeds.process();
            setEmbedLoaded(true);
            clearTimeout(timeout);
          }
        };
        script.onerror = () => {
          setEmbedFailed(true);
          clearTimeout(timeout);
        };
        document.body.appendChild(script);
      }
    };

    // Small delay so the blockquote is in the DOM
    const raf = requestAnimationFrame(loadEmbed);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, [cleanHandle, embedLoaded]);

  const showEmptyState = embedFailed;

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

        <Card className="bg-card/50 border-border/40 rounded-2xl overflow-hidden">
          <CardContent className="py-8 px-4 md:px-6">
            {/* Embed area */}
            <div
              ref={containerRef}
              className="flex justify-center mb-6 overflow-hidden max-w-full"
            >
              {!showEmptyState ? (
                <blockquote
                  className="instagram-media"
                  data-instgrm-permalink={profileUrl}
                  data-instgrm-version="14"
                  style={{
                    background: "transparent",
                    border: "0",
                    margin: "0 auto",
                    maxWidth: "540px",
                    width: "100%",
                    minWidth: "326px",
                  }}
                />
              ) : (
                <div className="py-8 text-center w-full">
                  <Instagram className="h-10 w-10 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2 font-medium">No posts yet</p>
                  <p className="text-muted-foreground/70 text-sm max-w-sm mx-auto">
                    This class Instagram is just getting started. Be one of the first to get featured.
                  </p>
                </div>
              )}
            </div>

            {/* Follow CTA — always visible */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => window.open(profileUrl, "_blank", "noopener,noreferrer")}
                className="border-primary/30 text-primary hover:bg-primary/10"
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
