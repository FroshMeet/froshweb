import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Instagram, Users, MessageSquare, Heart, Search, ArrowLeft } from "lucide-react";
import DiscoverGrid from "@/components/DiscoverGrid";
import EnhancedSwipeInterface from "@/components/EnhancedSwipeInterface";
import SchoolChatInterface from "@/components/SchoolChatInterface";
import { getSchoolName } from "@/config/schoolNameMapping";
import { schools } from "@/data/schools";
import { useIsMobile } from "@/hooks/use-mobile";
import { getSchoolByApprovedSlug, getApprovedSchoolData } from "@/utils/schoolNavigation";
import froshLogo from "@/assets/frosh-logo-new.png";

const EnhancedSchoolPage = () => {
  const { school } = useParams<{ school: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [studentSearch, setStudentSearch] = useState("");
  const [activeInterface, setActiveInterface] = useState<null | "swipe-meet" | "swipe-roommate" | "chat">(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would come from auth context
  
  // Get school data using reverse lookup for proper mapping
  const schoolData = getSchoolByApprovedSlug(school as string);
  const approvedSchoolData = schoolData ? getApprovedSchoolData(schoolData) : null;
  const schoolName = (schoolData ? (schoolData.shortName || schoolData.name) : '') ||
                    approvedSchoolData?.displayName || 
                    school || '';

  // Mock student profiles for the school
  const mockProfiles = [{
    id: 2,
    name: "Alex Rivera",
    age: 18,
    college: schoolName,
    classOf: "2029",
    major: "Business",
    dorm: "North Campus",
    bio: "Entrepreneur at heart, love meeting new people and exploring!",
    interests: ["Business", "Networking", "Basketball", "Travel"],
    photos: ["photo-1581091226825-a6a2a5aee158"],
    lookingFor: ["Friends", "Networking"],
    location: "Campus",
    instagram: "@alex_rivera",
    snapchat: "@alex_r2029",
    phoneNumber: "(555) 234-5678",
    instagramPublic: true,
    snapchatPublic: true,
    phonePublic: false
  }, {
    id: 3,
    name: "Maya Patel",
    age: 18,
    college: schoolName,
    classOf: "2029",
    major: "Pre-Med",
    dorm: "South Campus",
    bio: "Future doctor, current coffee addict ☕ Looking for study partners!",
    interests: ["Medicine", "Yoga", "Reading", "Volunteering"],
    photos: ["photo-1581092795360-fd1ca04f0952"],
    lookingFor: ["Study Buddy", "Friends", "Roommate"],
    location: "Campus",
    instagram: "@maya_patel_md",
    snapchat: "",
    phoneNumber: "(555) 345-6789",
    instagramPublic: false,
    snapchatPublic: false,
    phonePublic: false
  }, {
    id: 4,
    name: "Jordan Smith",
    age: 19,
    college: schoolName,
    classOf: "2028",
    major: "Computer Science",
    dorm: "Tech Hall",
    bio: "Coding enthusiast, love hackathons and building cool projects!",
    interests: ["Programming", "Gaming", "Music", "Tech"],
    photos: ["photo-1507003211169-0a1dd7228f2d"],
    lookingFor: ["Study Buddy", "Friends", "Roommate"],
    location: "Campus",
    instagram: "@jordan_codes",
    snapchat: "@jordan_s28",
    phoneNumber: "(555) 456-7890",
    instagramPublic: true,
    snapchatPublic: false,
    phonePublic: false
  }, {
    id: 5,
    name: "Sarah Kim",
    age: 18,
    college: schoolName,
    classOf: "2029",
    major: "Art & Design",
    dorm: "Creative Hall",
    bio: "Artist by day, dreamer by night. Love painting and photography!",
    interests: ["Art", "Photography", "Music", "Travel"],
    photos: ["photo-1494790108755-2616b612b47c"],
    lookingFor: ["Friends", "Creative Partners"],
    location: "Campus",
    instagram: "@sarah_creates",
    snapchat: "@sarahk29",
    phoneNumber: "(555) 567-8901",
    instagramPublic: true,
    snapchatPublic: true,
    phonePublic: false
  }, {
    id: 6,
    name: "David Chen",
    age: 19,
    college: schoolName,
    classOf: "2028",
    major: "Engineering",
    dorm: "Engineering Quad",
    bio: "Building the future, one project at a time. Always up for a good challenge!",
    interests: ["Engineering", "Robotics", "Sports", "Tech"],
    photos: ["photo-1472099645785-5658abf4ff4e"],
    lookingFor: ["Study Buddy", "Project Partners", "Roommate"],
    location: "Campus",
    instagram: "@davidbuilds",
    snapchat: "",
    phoneNumber: "(555) 678-9012",
    instagramPublic: false,
    snapchatPublic: false,
    phonePublic: false
  }];

  const filteredProfiles = mockProfiles.filter(profile =>
    profile.name.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const handleGuestAction = () => {
    // Set the user as a guest for this school instead of redirecting to signin
    setIsLoggedIn(false); // Keep as guest but allow them to use the interface
    // You could also set a guest state here if needed
  };

  const handleActionClick = (action: "meet" | "roommate" | "chat" | "feed") => {
    if (action === "meet") {
      setActiveInterface("swipe-meet");
    } else if (action === "roommate") {
      setActiveInterface("swipe-roommate");
    } else if (action === "chat") {
      setActiveInterface("chat");
    } else if (action === "feed") {
      navigate(`/${school}/insta`);
    }
  };

  if (activeInterface === "swipe-meet" || activeInterface === "swipe-roommate") {
    return (
      <EnhancedSwipeInterface
        schoolName={schoolName}
        profiles={mockProfiles}
        isGuest={!isLoggedIn}
        onGuestAction={handleGuestAction}
        onClose={() => setActiveInterface(null)}
        mode={activeInterface === "swipe-meet" ? "meet" : "roommate"}
      />
    );
  }

  if (activeInterface === "chat") {
    return (
      <SchoolChatInterface
        schoolName={schoolName}
        isGuest={!isLoggedIn}
        onGuestAction={handleGuestAction}
        onClose={() => setActiveInterface(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/50">
      {/* Header */}
      <header className="sticky top-0 border-b bg-background/80 backdrop-blur-xl z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => navigate('/community')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div 
                className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate('/')}
              >
                <img 
                  src={froshLogo}
                  alt="Frosh Logo" 
                  className={isMobile ? "h-10 w-auto" : "h-16 w-auto"}
                />
              </div>
            </div>
            <Button onClick={() => navigate('/signin')}>
              {isLoggedIn ? "Dashboard" : "Sign In"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* School Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-6 neon-glow">
              <span className="text-primary-foreground font-bold text-2xl">
                {schoolName.charAt(0)}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {schoolName}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with fellow students, find roommates, and build lasting friendships 
              in your {schoolName} community.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Card 
              className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 border-2 border-transparent hover:border-primary/30"
              onClick={() => handleActionClick("meet")}
            >
              <CardContent className="p-6 text-center">
                <Heart className="h-8 w-8 text-primary mx-auto mb-3 group-hover:neon-glow transition-all duration-300" />
                <h3 className="font-semibold group-hover:text-primary transition-colors">Meet Students</h3>
              </CardContent>
            </Card>
            
            <Card 
              className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 border-2 border-transparent hover:border-primary/30"
              onClick={() => handleActionClick("roommate")}
            >
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-3 group-hover:neon-glow transition-all duration-300" />
                <h3 className="font-semibold group-hover:text-primary transition-colors">Find Roommates</h3>
              </CardContent>
            </Card>
            
            <Card 
              className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 border-2 border-transparent hover:border-primary/30"
              onClick={() => handleActionClick("chat")}
            >
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-8 w-8 text-primary mx-auto mb-3 group-hover:neon-glow transition-all duration-300" />
                <h3 className="font-semibold group-hover:text-primary transition-colors">Chat</h3>
              </CardContent>
            </Card>
            
            <Card 
              className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 border-2 border-transparent hover:border-primary/30"
              onClick={() => handleActionClick("feed")}
            >
              <CardContent className="p-6 text-center">
                <Instagram className="h-8 w-8 text-primary mx-auto mb-3 group-hover:neon-glow transition-all duration-300" />
                <h3 className="font-semibold group-hover:text-primary transition-colors">Campus Feed</h3>
              </CardContent>
            </Card>
          </div>

          {/* Guest Warning Banner */}
          {!isLoggedIn && (
            <div className="mb-8 p-4 bg-primary/5 border border-primary/20 rounded-2xl text-center">
              <p className="text-primary mb-4">
                💡 Want to message and match with other {schoolName} students? Create your profile — it's free.
              </p>
              <Button onClick={handleGuestAction} className="neon-glow">
                Get Started
              </Button>
            </div>
          )}

          {/* Student Profiles Section */}
          <div className="mb-12">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">Students at {schoolName}</h2>
                <p className="text-muted-foreground">Discover and connect with your fellow students</p>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students by name..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="pl-10 h-12 text-lg rounded-2xl"
                />
              </div>
              
              {/* Student Profiles Grid */}
              <DiscoverGrid profiles={filteredProfiles} isGuest={!isLoggedIn} onGuestAction={handleGuestAction} />
              
              {filteredProfiles.length === 0 && studentSearch && (
                <div className="text-center py-8 text-muted-foreground">
                  No students found matching "{studentSearch}"
                </div>
              )}
            </div>
          </div>

          {/* End of Results CTA */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 rounded-3xl">
              <CardContent className="py-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Ready to join the {schoolName} community?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join hundreds of {schoolName} students who are already connecting, 
                  studying together, and building friendships that last.
                </p>
                <Button size="lg" onClick={handleGuestAction} className="neon-glow">
                  Get Started Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EnhancedSchoolPage;