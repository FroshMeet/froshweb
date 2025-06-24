
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, MessageSquare, Home, User, Search } from "lucide-react";
import WelcomeScreen from "@/components/WelcomeScreen";
import ProfileCard from "@/components/ProfileCard";
import ChatInterface from "@/components/ChatInterface";
import RoommateMatching from "@/components/RoommateMatching";
import SwipeCards from "@/components/SwipeCards";

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

  const getSchoolLogo = (college) => {
    // Simple colored circle as logo placeholder
    const colors = {
      "UCLA": "from-blue-600 to-yellow-400",
      "Harvard University": "from-red-700 to-red-900",
      "Stanford University": "from-red-600 to-red-800",
      "MIT": "from-gray-700 to-gray-900",
      "UC Berkeley": "from-blue-700 to-yellow-500",
      "Arizona State University (ASU)": "from-yellow-400 to-red-600"
    };
    return colors[college] || "from-blue-600 to-purple-600";
  };

  if (!currentUser) {
    return <WelcomeScreen onUserCreate={setCurrentUser} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "discover":
        return <SwipeCards profiles={mockProfiles} />;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-gradient-to-r ${getSchoolLogo(mockUser.college)} rounded-xl shadow-lg flex items-center justify-center`}>
              <span className="text-white font-bold text-lg">
                {mockUser.college.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">
                FroshMeet
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {mockUser.college}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-medium">
            Class of 2028
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200/50 shadow-lg">
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
                className={`flex flex-col items-center space-y-1 h-auto py-3 px-4 transition-all duration-200 ${
                  activeTab === tab.id 
                    ? "bg-slate-900 text-white shadow-lg" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{tab.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom padding to account for fixed nav */}
      <div className="h-24"></div>
    </div>
  );
};

export default Index;
