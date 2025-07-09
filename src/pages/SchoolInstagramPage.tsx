import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Instagram, ExternalLink, ArrowLeft, AlertCircle } from "lucide-react";
import { getInstagramUsername, isSchoolSupported } from "@/config/schoolInstagramMapping";
import { getSchoolName } from "@/config/schoolNameMapping";

const SchoolInstagramPage = () => {
  const { school } = useParams<{ school: string }>();
  const navigate = useNavigate();
  
  const schoolName = school ? getSchoolName(school) : '';
  const instagramUsername = school ? getInstagramUsername(school) : null;
  const isSupported = school ? isSchoolSupported(school) : false;
  
  useEffect(() => {
    // Load Instagram embed script
    const script = document.createElement('script');
    script.async = true;
    script.src = '//www.instagram.com/embed.js';
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="//www.instagram.com/embed.js"]');
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };
  }, []);

  // If school is not supported, show error state
  if (school && !isSupported) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/50">
        {/* Header */}
        <header className="sticky top-0 border-b bg-background/80 backdrop-blur-xl z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button variant="ghost" onClick={() => navigate(`/${school}`)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div 
                  className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => navigate('/')}
                >
                  <img 
                    src="/lovable-uploads/70c5411f-00f7-43f3-9004-7c6c2fc6cb12.png" 
                    alt="FroshMeet Logo" 
                    className="h-8 w-auto"
                  />
                </div>
              </div>
              <Button onClick={() => navigate('/app')}>
                Join Community
              </Button>
            </div>
          </div>
        </header>

        {/* Error Content */}
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">Instagram Feed Not Available</h1>
            <p className="text-lg text-muted-foreground mb-8">
              We don't have Instagram content configured for {schoolName} yet.
            </p>
            <div className="space-y-4">
              <Button onClick={() => navigate(`/${school}`)} size="lg">
                Back to {schoolName}
              </Button>
              <div>
                <Button variant="outline" onClick={() => navigate('/')}>
                  Explore Other Schools
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/50">
      {/* Header */}
      <header className="sticky top-0 border-b bg-background/80 backdrop-blur-xl z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => navigate(`/${school}`)}>
                ← Back to {schoolName}
              </Button>
              <div 
                className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate('/')}
              >
                <img 
                  src="/lovable-uploads/70c5411f-00f7-43f3-9004-7c6c2fc6cb12.png" 
                  alt="FroshMeet Logo" 
                  className="h-8 w-auto"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" asChild>
                <a 
                  href={`https://instagram.com/${instagramUsername}`} 
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
                      @{instagramUsername}
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
                Follow @{instagramUsername}
              </h3>
              <p className="text-muted-foreground mb-6">
                For the latest updates and campus life content from {schoolName}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <a 
                    href={`https://instagram.com/${instagramUsername}`} 
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
              To add new schools or update Instagram handles, edit the mapping in 
              <code className="mx-1 px-2 py-1 bg-background rounded">src/config/schoolInstagramMapping.ts</code>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SchoolInstagramPage;