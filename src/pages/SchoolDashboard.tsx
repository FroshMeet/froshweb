
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Instagram, 
  Star, 
  MapPin, 
  GraduationCap,
  Heart,
  MessageSquare,
  Share2,
  Camera,
  Sparkles,
  ArrowRight,
  ExternalLink,
  TrendingUp,
  Award,
  Calendar,
  BookOpen
} from "lucide-react";
import { APPROVED_SCHOOLS } from "@/config/approvedSchools";
import { GetFeaturedFlow } from "@/components/GetFeaturedFlow";
import AppHeader from "@/components/layout/AppHeader";
import BottomNavigation from "@/components/layout/BottomNavigation";

const SchoolDashboard = () => {
  const { school: schoolSlug } = useParams();
  const [showGetFeatured, setShowGetFeatured] = useState(false);
  const [activeTab, setActiveTab] = useState("discover");
  const [isFollowing, setIsFollowing] = useState(false);

  const school = schoolSlug ? APPROVED_SCHOOLS[schoolSlug] : null;
  
  // Mock data - in real app, this would come from API
  const schoolStats = {
    followers: 2847,
    posts: 156,
    featured: 43,
    engagement: 8.2
  };

  const featuredProfiles = [
    {
      id: 1,
      name: "Alex Chen",
      major: "Computer Science",
      bio: "Love coding, hiking, and making new friends! Looking for study buddies and roommates 🤓",
      photos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face"],
      interests: ["Coding", "Hiking", "Gaming"],
      year: "2030"
    },
    {
      id: 2,
      name: "Sarah Kim",
      major: "Pre-Med",
      bio: "Future doctor with a passion for helping others. Love volleyball and coffee ☕",
      photos: ["https://images.unsplash.com/photo-1494790108755-2616b332c1e0?w=400&h=600&fit=crop&crop=face"],
      interests: ["Medicine", "Volleyball", "Coffee"],
      year: "2030"
    },
    {
      id: 3,
      name: "Mike Johnson",
      major: "Business",
      bio: "Entrepreneur mindset, always looking for the next big opportunity! 🚀",
      photos: ["https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face"],
      interests: ["Business", "Startups", "Basketball"],
      year: "2030"
    }
  ];

  const instagramPosts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=400&fit=crop",
      caption: "Welcome Class of 2030! 🎉",
      likes: 234,
      comments: 18
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=400&h=400&fit=crop",
      caption: "Campus tour highlights ✨",
      likes: 189,
      comments: 12
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=400&fit=crop",
      caption: "Study spots you need to know 📚",
      likes: 156,
      comments: 8
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
      caption: "Meet your future classmates! 🤝",
      likes: 298,
      comments: 24
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=400&h=400&fit=crop",
      caption: "Dorm life preview 🏠",
      likes: 167,
      comments: 15
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=400&h=400&fit=crop",
      caption: "Campus events coming up! 🎊",
      likes: 203,
      comments: 19
    }
  ];

  const displayUser = {
    college: school?.name || "University",
    classOf: "2030"
  };

  if (!school) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">School Not Found</h1>
          <p className="text-muted-foreground">The school you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader displayUser={displayUser} isGuest={true} />
      
      {/* Hero Section */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative h-full flex items-center justify-center px-4">
          <div className="text-center text-white max-w-4xl mx-auto">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {school.name}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-6">
              Class of 2030 • {schoolStats.followers.toLocaleString()} Members
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => setIsFollowing(!isFollowing)}
                className={`h-12 px-8 rounded-2xl transition-all ${
                  isFollowing 
                    ? 'bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30' 
                    : 'bg-white text-primary hover:bg-white/90'
                }`}
              >
                <Heart className={`w-5 h-5 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
              <Button 
                onClick={() => setShowGetFeatured(true)}
                className="h-12 px-8 bg-gradient-primary hover:scale-105 transition-transform rounded-2xl shadow-glow"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Get Featured
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="py-8 px-4 bg-card/50 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{schoolStats.followers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{schoolStats.posts}</div>
              <div className="text-sm text-muted-foreground">Posts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{schoolStats.featured}</div>
              <div className="text-sm text-muted-foreground">Featured</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{schoolStats.engagement}%</div>
              <div className="text-sm text-muted-foreground">Engagement</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-card/50 p-1 rounded-2xl">
            <TabsTrigger 
              value="discover" 
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Users className="w-4 h-4 mr-2" />
              Discover
            </TabsTrigger>
            <TabsTrigger 
              value="instagram"
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Instagram className="w-4 h-4 mr-2" />
              Instagram
            </TabsTrigger>
            <TabsTrigger 
              value="featured"
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Star className="w-4 h-4 mr-2" />
              Featured
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-6">
            <Card className="glass-card border-0 p-6">
              <CardContent className="pt-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Discover Classmates</h3>
                    <p className="text-muted-foreground">Connect with your future peers</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-muted/30 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-primary mb-1">2.8K+</div>
                    <div className="text-sm text-muted-foreground">Active Students</div>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-primary mb-1">156</div>
                    <div className="text-sm text-muted-foreground">New This Week</div>
                  </div>
                </div>
                <Button className="w-full h-12 bg-gradient-primary hover:scale-105 transition-transform rounded-xl">
                  <Users className="w-5 h-5 mr-2" />
                  Start Discovering
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="glass-card border-0 p-4 card-hover cursor-pointer">
                <CardContent className="pt-0 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">Chat</h4>
                  <p className="text-xs text-muted-foreground">Message classmates</p>
                </CardContent>
              </Card>
              <Card className="glass-card border-0 p-4 card-hover cursor-pointer">
                <CardContent className="pt-0 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">Events</h4>
                  <p className="text-xs text-muted-foreground">Campus activities</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="instagram" className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">Instagram Feed</h3>
              <p className="text-muted-foreground">Latest posts from @{schoolSlug}class2030</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {instagramPosts.map((post) => (
                <Card key={post.id} className="glass-card border-0 overflow-hidden card-hover group cursor-pointer">
                  <div className="relative aspect-square">
                    <img
                      src={post.image}
                      alt={post.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute bottom-2 left-2 right-2 bg-black/50 backdrop-blur-sm rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center justify-between text-white text-xs">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {post.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {post.comments}
                          </span>
                        </div>
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="glass-card border-0 p-6">
              <CardContent className="pt-0 text-center">
                <Instagram className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h4 className="text-lg font-semibold text-foreground mb-2">Want to be featured?</h4>
                <p className="text-muted-foreground mb-4">Get your profile featured on the official Instagram</p>
                <Button 
                  onClick={() => setShowGetFeatured(true)}
                  className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 hover:scale-105 transition-transform rounded-xl"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Get Featured Now
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="featured" className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">Featured Students</h3>
              <p className="text-muted-foreground">Students who got featured this month</p>
            </div>

            <div className="space-y-6">
              {featuredProfiles.map((profile) => (
                <Card key={profile.id} className="glass-card border-0 p-6 card-hover">
                  <CardContent className="pt-0">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <img
                          src={profile.photos[0]}
                          alt={profile.name}
                          className="w-16 h-16 rounded-2xl object-cover"
                        />
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Star className="w-3 h-3 text-white fill-current" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-semibold text-foreground">{profile.name}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {profile.major}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                          {profile.bio}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {profile.interests.map((interest) => (
                            <Badge key={interest} variant="outline" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="glass-card border-0 p-6">
              <CardContent className="pt-0 text-center">
                <Award className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h4 className="text-lg font-semibold text-foreground mb-2">Join the Featured List</h4>
                <p className="text-muted-foreground mb-4">Showcase your personality and get noticed</p>
                <Button 
                  onClick={() => setShowGetFeatured(true)}
                  className="bg-gradient-primary hover:scale-105 transition-transform rounded-xl"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Featured
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <GetFeaturedFlow
        open={showGetFeatured}
        onOpenChange={setShowGetFeatured}
        preSelectedSchool={schoolSlug}
      />
    </div>
  );
};

export default SchoolDashboard;
