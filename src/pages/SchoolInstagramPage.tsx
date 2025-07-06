import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Instagram, ExternalLink } from "lucide-react";

// School Instagram accounts mapping
const SCHOOL_INSTAGRAM_ACCOUNTS: Record<string, string> = {
  'ucla': 'ucla',
  'harvard': 'harvard',
  'stanford': 'stanford',
  'mit': 'mit',
  'uc-berkeley': 'ucberkeley',
  'nyu': 'nyuniversity',
  'columbia': 'columbia',
  'yale': 'yale',
  'princeton': 'princeton',
  'duke': 'dukeu',
  'northwestern': 'northwesternu',
  'usc': 'uscedu'
};

const SchoolInstagramPage = () => {
  const { school } = useParams<{ school: string }>();
  const navigate = useNavigate();
  
  const schoolName = school?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';
  const instagramHandle = school ? SCHOOL_INSTAGRAM_ACCOUNTS[school] || school : '';

  useEffect(() => {
    // Load Instagram embed script
    const script = document.createElement('script');
    script.async = true;
    script.src = '//www.instagram.com/embed.js';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/50">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => navigate(`/${school}`)}>
                ← Back to {schoolName}
              </Button>
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">F</span>
              </div>
              <span className="font-semibold text-foreground">FroshMeet</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" asChild>
                <a 
                  href={`https://instagram.com/${instagramHandle}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>View on Instagram</span>
                </a>
              </Button>
              <Button onClick={() => navigate('/app')}>
                Join Community
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Instagram className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {schoolName} Campus Life
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Stay connected with what's happening at {schoolName}
            </p>
          </div>

          {/* Instagram Feed */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Instagram embed posts - these would be dynamically loaded */}
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div key={index} className="bg-card rounded-lg border overflow-hidden">
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <Instagram className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Instagram post #{index}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      @{instagramHandle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Instagram Embed Script Alternative */}
          <div className="mt-12 text-center">
            <div className="bg-card border rounded-lg p-8">
              <Instagram className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Follow @{instagramHandle}
              </h3>
              <p className="text-muted-foreground mb-6">
                For the latest updates and campus life content from {schoolName}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <a 
                    href={`https://instagram.com/${instagramHandle}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Follow on Instagram
                  </a>
                </Button>
                <Button variant="outline" onClick={() => navigate(`/${school}`)}>
                  Back to {schoolName} Page
                </Button>
              </div>
            </div>
          </div>

          {/* Note about Instagram integration */}
          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Note:</strong> Instagram posts will be embedded here automatically. 
              To customize the Instagram feed for each school, update the SCHOOL_INSTAGRAM_ACCOUNTS 
              mapping in the SchoolInstagramPage component.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SchoolInstagramPage;