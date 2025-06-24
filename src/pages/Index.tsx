
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, MessageSquare, Home, User, Search } from "lucide-react";
import WelcomeScreen from "@/components/WelcomeScreen";
import ProfileCard from "@/components/ProfileCard";
import ChatInterface from "@/components/ChatInterface";
import RoommateMatching from "@/components/RoommateMatching";

const Index = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("discover");

  // Mock user data for demonstration
  const mockUser = {
    id: 1,
    name: "Sarah Chen",
    age: 18,
    college: "UCLA",
    year: "Freshman",
    major: "Computer Science",
    bio: "Love hiking, coding, and bubble tea! Looking for study buddies and new friends 🌟",
    interests: ["Programming", "Hiking", "Photography", "Music"],
    photos: ["photo-1649972904349-6e44c42644a7"],
    lookingFor: ["Friends", "Study Buddy", "Roommate"],
    location: "Los Angeles, CA"
  };

  const mockProfiles = [
    {
      id: 2,
      name: "Alex Rivera",
      age: 18,
      college: "UCLA",
      year: "Freshman",
      major: "Business",
      bio: "Entrepreneur at heart, love meeting new people and exploring LA!",
      interests: ["Business", "Networking", "Basketball", "Travel"],
      photos: ["photo-1581091226825-a6a2a5aee158"],
      lookingFor: ["Friends", "Networking"],
      location: "Los Angeles, CA"
    },
    {
      id: 3,
      name: "Maya Patel",
      age: 18,
      college: "UCLA",
      year: "Freshman",
      major: "Pre-Med",
      bio: "Future doctor, current coffee addict ☕ Looking for study partners!",
      interests: ["Medicine", "Yoga", "Reading", "Volunteering"],
      photos: ["photo-1581092795360-fd1ca04f0952"],
      lookingFor: ["Study Buddy", "Friends"],
      location: "Los Angeles, CA"
    }
  ];

  if (!currentUser) {
    return <WelcomeScreen onUserCreate={setCurrentUser} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "discover":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Discover New Friends</h2>
              <p className="text-muted-foreground">Connect with fellow UCLA freshmen</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockProfiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          </div>
        );
      case "roommates":
        return <RoommateMatching currentUser={mockUser} />;
      case "chats":
        return <ChatInterface />;
      case "profile":
        return <ProfileCard profile={mockUser} isOwnProfile />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FreshConnect
            </h1>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {mockUser.college}
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t">
        <div className="max-w-md mx-auto px-4 py-2">
          <div className="flex justify-around">
            {[
              { id: "discover", icon: Search, label: "Discover" },
              { id: "roommates", icon: Home, label: "Roommates" },
              { id: "chats", icon: MessageSquare, label: "Chats" },
              { id: "profile", icon: User, label: "Profile" }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center space-y-1 h-auto py-2 ${
                  activeTab === tab.id 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                    : ""
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="text-xs">{tab.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom padding to account for fixed nav */}
      <div className="h-20"></div>
    </div>
  );
};

export default Index;
