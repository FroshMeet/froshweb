
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Users, 
  Star, 
  Instagram, 
  Sparkles,
  ArrowRight,
  MapPin,
  GraduationCap,
  Heart,
  Zap,
  Trophy,
  Camera,
  MessageSquare,
  ChevronRight,
  Play
} from "lucide-react";
import { SCHOOL_DATABASE } from "@/config/schoolDatabase";
import { GetFeaturedFlow } from "@/components/GetFeaturedFlow";

const Homepage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showGetFeatured, setShowGetFeatured] = useState(false);
  const [currentHero, setCurrentHero] = useState(0);

  const heroSlides = [
    {
      title: "Meet Your Class of 2030",
      subtitle: "Connect with your future classmates before you even step on campus",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&h=1080&fit=crop&crop=center"
    },
    {
      title: "Discover Your Tribe",
      subtitle: "Find your roommate, study buddy, or lifelong friend",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=1920&h=1080&fit=crop&crop=center"
    },
    {
      title: "Get Featured & Stand Out",
      subtitle: "Showcase your personality and get noticed by your peers",
      image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1920&h=1080&fit=crop&crop=center"
    }
  ];

  const features = [
    {
      icon: Users,
      title: "Discover Peers",
      description: "Browse and connect with students from your school",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: Camera,
      title: "Showcase Yourself",
      description: "Create an amazing profile that represents you",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Trophy,
      title: "Earn Rewards",
      description: "Get featured and build your campus presence",
      color: "from-pink-500 to-red-600"
    }
  ];

  const howItWorks = [
    { 
      step: "01", 
      title: "Choose Your School", 
      description: "Select from 63+ universities",
      icon: GraduationCap 
    },
    { 
      step: "02", 
      title: "Create Your Profile", 
      description: "Add photos and tell your story",
      icon: Camera 
    },
    { 
      step: "03", 
      title: "Connect & Explore", 
      description: "Meet your future classmates",
      icon: Heart 
    },
    { 
      step: "04", 
      title: "Get Featured", 
      description: "Stand out on Instagram",
      icon: Star 
    }
  ];

  const testimonials = [
    {
      quote: "I met my roommate through FroshMeet before orientation!",
      author: "Sarah M.",
      school: "UCLA '30",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c1e0?w=100&h=100&fit=crop&crop=face"
    },
    {
      quote: "The best way to connect with your class before college starts.",
      author: "Alex R.",
      school: "Stanford '30", 
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      quote: "Got featured on my school's Instagram and made tons of friends!",
      author: "Emma L.",
      school: "Harvard '30",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    }
  ];

  // Auto-rotate hero slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Smart search function
  const searchSchools = (query: string) => {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase().trim();
    const results = [];
    
    for (const school of SCHOOL_DATABASE) {
      for (const keyword of school.searchTerms) {
        if (keyword.toLowerCase().includes(searchTerm)) {
          results.push({ school, score: keyword.toLowerCase() === searchTerm ? 100 : 50 });
          break;
        }
      }
    }
    
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(r => r.school);
  };

  const filteredSchools = searchSchools(searchTerm);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Images */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentHero ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          </div>
        ))}

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {heroSlides[currentHero].title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              {heroSlides[currentHero].subtitle}
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                <Input
                  placeholder="Search schools, cities, or acronyms like 'UCLA', 'Harvard'..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-16 pl-16 pr-6 text-lg bg-white/90 backdrop-blur-md border-0 rounded-2xl shadow-2xl focus:bg-white transition-all"
                />
                {searchTerm && filteredSchools.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white rounded-2xl mt-2 shadow-2xl border border-gray-200 z-50 animate-fade-scale-in">
                    {filteredSchools.map((school) => {
                      const acronyms = school.searchTerms.filter((term: string) => 
                        term === term.toUpperCase() && term.length <= 6 && /^[A-Z]+$/.test(term)
                      );
                      const acronym = acronyms.length > 0 ? acronyms[0] : school.label.split(' ').map((word: string) => word.charAt(0)).join('').toUpperCase();
                      
                      return (
                        <div
                          key={school.value}
                          className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                          onClick={() => {
                            window.location.href = `/${school.value}`;
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                              <span className="text-white font-bold text-sm">{acronym}</span>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{school.label}</div>
                              <div className="text-sm text-gray-600">View school page</div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="h-14 px-8 text-lg bg-gradient-primary hover:scale-105 transition-transform shadow-glow rounded-2xl"
              >
                <Users className="w-6 h-6 mr-2" />
                Explore Schools
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setShowGetFeatured(true)}
                className="h-14 px-8 text-lg bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all rounded-2xl"
              >
                <Sparkles className="w-6 h-6 mr-2" />
                Get Featured
              </Button>
            </div>
          </div>
        </div>

        {/* Hero Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHero(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentHero 
                  ? 'bg-white shadow-glow' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Why Choose <span className="text-gradient">FroshMeet</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The most engaging way to connect with your future classmates and build your college network
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="glass-card border-0 p-8 text-center card-hover group"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="pt-0">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-muted/30 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get started in minutes and begin connecting with your future classmates
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{step.step}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              What Students Are <span className="text-gradient">Saying</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Real stories from students who found their community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass-card border-0 p-8 card-hover">
                <CardContent className="pt-0">
                  <div className="flex items-center mb-6">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.author}</div>
                      <div className="text-primary text-sm font-medium">{testimonial.school}</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-lg italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Get Featured CTA Section */}
      <section className="py-24 px-4 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="animate-float">
            <Instagram className="w-16 h-16 text-white mx-auto mb-6" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Featured?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of students showcasing their personalities and getting featured on their school's Instagram
          </p>
          <Button 
            size="lg"
            onClick={() => setShowGetFeatured(true)}
            className="h-16 px-12 text-lg bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all shadow-2xl rounded-2xl"
          >
            <Sparkles className="w-6 h-6 mr-2" />
            Get Featured Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gradient mb-4">FroshMeet</h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connecting the Class of 2030, one friendship at a time
            </p>
            <div className="flex justify-center space-x-6 mb-8">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                About
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                How It Works
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                FAQs
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                Contact
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 FroshMeet. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Get Featured Modal */}
      <GetFeaturedFlow
        open={showGetFeatured}
        onOpenChange={setShowGetFeatured}
      />
    </div>
  );
};

export default Homepage;
