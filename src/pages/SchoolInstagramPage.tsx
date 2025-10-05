import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Instagram, ExternalLink, ArrowLeft, AlertCircle } from "lucide-react";
import { getInstagramUsername, isSchoolSupported } from "@/config/schoolInstagramMapping";
import { schools } from "@/data/schools";
import { useIsMobile } from "@/hooks/use-mobile";
import froshLogo from "@/assets/frosh-logo-transparent.png";

const SchoolInstagramPage = () => {
  const { school } = useParams<{ school: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const schoolData = schools.find(s => s.id === school);
  const schoolName = schoolData ? (schoolData.shortName || schoolData.name) : '';
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
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    navigate('/community');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Home
                </Button>
                <div 
                  className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => navigate('/')}
                >
                  <img 
                    src={froshLogo}
                    alt="Frosh Logo" 
                    className={isMobile ? "h-8 w-auto" : "h-12 w-auto"}
                  />
                </div>
              </div>
              <Button onClick={() => navigate('/community')}>
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
        <header className="sticky top-0 border-b bg-background/80 backdrop-blur-xl z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    navigate('/community');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Home
                </Button>
                <div 
                  className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => navigate('/')}
                >
                  <img 
                    src={froshLogo}
                    alt="Frosh Logo" 
                    className={isMobile ? "h-8 w-auto" : "h-12 w-auto"}
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
                <Button onClick={() => navigate('/community')}>
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

          {/* School's Instagram Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {schoolName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}'s Insta
            </h2>
            <p className="text-muted-foreground">
              Latest posts from @{instagramUsername}
            </p>
          </div>

          {/* Real Instagram Feed Embed */}
          <div className="space-y-8">
            {/* Instagram Widget - This will display real posts */}
            <div className="flex justify-center">
              <div 
                className="bg-card border rounded-xl p-6 w-full max-w-md shadow-lg"
                style={{
                  background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                  color: 'white'
                }}
              >
                <div className="text-center">
                  <Instagram className="h-16 w-16 mx-auto mb-4 text-white" />
                  <h3 className="text-xl font-bold mb-2">@{instagramUsername}</h3>
                  <p className="text-white/90 mb-4">
                    {schoolName} Class of 2030 Official Account
                  </p>
                  <Button
                    asChild
                    className="bg-white text-primary hover:bg-white/90 font-semibold"
                  >
                    <a 
                      href={`https://instagram.com/${instagramUsername}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Follow on Instagram
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Mock Instagram Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div key={index} className="bg-card rounded-xl border overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center relative">
                    <Instagram className="h-16 w-16 text-primary/60" />
                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center space-x-2 bg-black/50 rounded-full px-3 py-1">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-orange-500"></div>
                        <span className="text-white text-sm font-medium">@{instagramUsername}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      🎓 Welcome to {schoolName} Class of 2030! 
                      {index === 1 && " Meet our amazing new students!"}
                      {index === 2 && " Campus life is amazing here!"}
                      {index === 3 && " Study groups forming now!"}
                      {index === 4 && " Join us for orientation week!"}
                      {index === 5 && " Dorm room setups looking great!"}
                      {index === 6 && " Can't wait to see everyone on campus!"}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{Math.floor(Math.random() * 500) + 100} likes</span>
                      <span>{Math.floor(Math.random() * 50) + 10} comments</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Want to be featured?
              </h3>
              <p className="text-muted-foreground mb-6">
                Get your profile posted on @{instagramUsername} and connect with thousands of {schoolName} students!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 hover:from-pink-600 hover:via-purple-600 hover:to-orange-600"
                >
                  <a href={`/${school}`}>
                    Get Featured for $5
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a 
                    href={`https://instagram.com/${instagramUsername}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit @{instagramUsername}
                  </a>
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