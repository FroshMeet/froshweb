import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Instagram, Users, MessageSquare, Heart, Search } from "lucide-react";
import DiscoverGrid from "@/components/DiscoverGrid";

const SchoolPage = () => {
  const { school } = useParams<{ school: string }>();
  const navigate = useNavigate();
  const [studentSearch, setStudentSearch] = useState("");
  
  const schoolName = school?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';

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
    lookingFor: ["Study Buddy", "Friends"],
    location: "Campus",
    instagram: "@jordan_codes",
    snapchat: "@jordan_s28",
    phoneNumber: "(555) 456-7890",
    instagramPublic: true,
    snapchatPublic: false,
    phonePublic: false
  }];

  const filteredProfiles = mockProfiles.filter(profile =>
    profile.name.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/50">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => navigate('/')}>
                ← Back
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* School Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-primary-foreground font-bold text-2xl">
                {schoolName.charAt(0)}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {schoolName}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with fellow students, find study groups, roommates, and build lasting friendships 
              in your {schoolName} community.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Card className="hover:shadow-lg transition-shadow text-center py-6">
              <CardContent className="p-3">
                <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm">Meet Students</h3>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow text-center py-6">
              <CardContent className="p-3">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm">Find Roommates</h3>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow text-center py-6">
              <CardContent className="p-3">
                <MessageSquare className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm">Study Groups</h3>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer text-center py-6" 
                  onClick={() => navigate(`/${school}/insta`)}>
              <CardContent className="p-3">
                <Instagram className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm">Campus Feed</h3>
              </CardContent>
            </Card>
          </div>

          {/* Student Posts Grid */}
          <div className="mb-12">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-2">Students at {schoolName}</h2>
                <p className="text-muted-foreground">Connect with your fellow students</p>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students by name..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
              
              {/* Student Profiles Grid */}
              <DiscoverGrid profiles={filteredProfiles} isGuest={true} />
              
              {filteredProfiles.length === 0 && studentSearch && (
                <div className="text-center py-8 text-muted-foreground">
                  No students found matching "{studentSearch}"
                </div>
              )}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="py-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Ready to join the {schoolName} community?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join hundreds of {schoolName} students who are already connecting, 
                  studying together, and building friendships that last.
                </p>
                <Button size="lg" onClick={() => navigate('/app')}>
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

export default SchoolPage;