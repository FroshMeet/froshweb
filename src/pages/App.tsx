import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, MessageSquare, User, Grid, Newspaper, ArrowDown } from "lucide-react";
import WelcomeScreen from "@/components/WelcomeScreen";
import MeetTabContent from "@/components/tabs/MeetTabContent";
import DiscoverTabContent from "@/components/tabs/DiscoverTabContent";
import CommunityTabContent from "@/components/tabs/CommunityTabContent";
import ChatsTabContent from "@/components/tabs/ChatsTabContent";
import ProfileTabContent from "@/components/tabs/ProfileTabContent";
import GuestProfile from "@/components/GuestProfile";
import GuestMessageDialog from "@/components/GuestMessageDialog";
const Index = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [guestSchool, setGuestSchool] = useState("");
  const [activeTab, setActiveTab] = useState("meet");
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const mockUser = {
    id: 1,
    name: "Sarah Chen",
    age: 18,
    college: "UCLA",
    classOf: "2029",
    major: "Computer Science",
    dorm: "Warren Hall",
    bio: "Love hiking, coding, and bubble tea! Looking for study buddies and new friends 🌟",
    interests: ["Programming", "Hiking", "Photography", "Music"],
    photos: [],
    lookingFor: ["Friends", "Study Buddy", "Roommate"],
    location: null,
    instagram: "@sarah_chen",
    snapchat: "@sarah_c22",
    phoneNumber: "(555) 123-4567",
    instagramPublic: true,
    snapchatPublic: false,
    phonePublic: false,
    isInMeet: false,
    isInDiscover: false
  };
  const mockProfiles = [{
    id: 2,
    name: "Alex Rivera",
    age: 18,
    college: "UCLA",
    classOf: "2029",
    major: "Business",
    dorm: "North Campus",
    bio: "Entrepreneur at heart, love meeting new people and exploring LA!",
    interests: ["Business", "Networking", "Basketball", "Travel"],
    photos: ["photo-1581091226825-a6a2a5aee158"],
    lookingFor: ["Friends", "Networking"],
    location: "Los Angeles, CA",
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
    college: "UCLA",
    classOf: "2029",
    major: "Pre-Med",
    dorm: "South Campus",
    bio: "Future doctor, current coffee addict ☕ Looking for study partners!",
    interests: ["Medicine", "Yoga", "Reading", "Volunteering"],
    photos: ["photo-1581092795360-fd1ca04f0952"],
    lookingFor: ["Study Buddy", "Friends", "Roommate"],
    location: "Los Angeles, CA",
    instagram: "@maya_patel_md",
    snapchat: "",
    phoneNumber: "(555) 345-6789",
    instagramPublic: false,
    snapchatPublic: false,
    phonePublic: false
  }];
  const getSchoolLogo = college => {
    const colors = {
      "Alabama": "from-red-700 to-red-900",
      "ASU": "from-yellow-400 to-red-600",
      "Berkeley": "from-blue-700 to-yellow-500",
      "Boston University": "from-red-700 to-red-900",
      "Brown": "from-red-700 to-yellow-600",
      "Cal Poly Pomona": "from-green-600 to-yellow-400",
      "Cal Poly SLO": "from-green-600 to-yellow-400",
      "Caltech": "from-orange-500 to-red-600",
      "Carnegie Mellon": "from-red-600 to-gray-700",
      "Chico State": "from-red-600 to-yellow-400",
      "Columbia": "from-blue-600 to-blue-800",
      "Cornell": "from-red-600 to-red-800",
      "CSULB": "from-yellow-400 to-black",
      "Dartmouth": "from-green-600 to-green-800",
      "Duke": "from-blue-600 to-blue-800",
      "Florida State": "from-yellow-400 to-red-600",
      "Georgetown": "from-blue-600 to-gray-600",
      "Georgia": "from-red-600 to-black",
      "Harvard": "from-red-700 to-red-900",
      "Indiana": "from-red-600 to-white",
      "Iowa State": "from-red-600 to-yellow-400",
      "MIT": "from-gray-700 to-gray-900",
      "Michigan": "from-blue-600 to-yellow-400",
      "Michigan State": "from-green-600 to-white",
      "Minnesota": "from-yellow-400 to-red-600",
      "Northeastern": "from-red-600 to-black",
      "Northwestern": "from-purple-600 to-purple-800",
      "NYU": "from-purple-600 to-purple-800",
      "Ohio State": "from-red-600 to-gray-600",
      "Penn State": "from-blue-600 to-blue-800",
      "Princeton": "from-orange-500 to-black",
      "Purdue": "from-yellow-400 to-black",
      "Rice": "from-blue-600 to-gray-600",
      "Sac State": "from-green-600 to-yellow-400",
      "San Diego State": "from-red-600 to-black",
      "San Francisco State": "from-blue-600 to-yellow-400",
      "SJSU": "from-blue-600 to-yellow-400",
      "Stanford": "from-red-600 to-red-800",
      "Texas A&M": "from-red-700 to-red-900",
      "UC Davis": "from-blue-600 to-yellow-400",
      "UC Irvine": "from-blue-600 to-yellow-400",
      "UCLA": "from-blue-600 to-yellow-400",
      "UC Merced": "from-blue-600 to-yellow-400",
      "UC Riverside": "from-blue-600 to-yellow-400",
      "UC San Diego": "from-blue-600 to-yellow-400",
      "UC Santa Barbara": "from-blue-600 to-yellow-400",
      "UC Santa Cruz": "from-blue-600 to-yellow-400",
      "UCF": "from-yellow-400 to-black",
      "UChicago": "from-red-700 to-red-900",
      "UIUC": "from-blue-600 to-orange-500",
      "UNC": "from-blue-600 to-blue-800",
      "University of Arizona": "from-red-600 to-blue-600",
      "University of Central Florida": "from-yellow-400 to-black",
      "University of Colorado Boulder": "from-yellow-400 to-black",
      "University of Florida": "from-blue-600 to-orange-500",
      "University of Miami": "from-orange-500 to-green-600",
      "University of Oregon": "from-green-600 to-yellow-400",
      "University of Texas": "from-orange-500 to-orange-700",
      "University of Virginia": "from-blue-600 to-orange-500",
      "University of Washington": "from-purple-600 to-yellow-400",
      "UPenn": "from-blue-600 to-red-600",
      "USC": "from-red-700 to-yellow-400",
      "Vanderbilt": "from-yellow-400 to-black",
      "Virginia Tech": "from-red-700 to-orange-500",
      "Wisconsin": "from-red-600 to-white",
      "Yale": "from-blue-600 to-blue-800"
    };
    return colors[college] || "from-blue-600 to-purple-600";
  };
  const handleGuestContinue = selectedSchool => {
    setIsGuest(true);
    setGuestSchool(selectedSchool);
    setCurrentUser(null);
  };
  const handleCreateAccount = () => {
    setIsGuest(false);
    setCurrentUser(null);
    setShowGuestDialog(false);
  };
  const handleGuestAction = () => {
    setShowGuestDialog(true);
  };
  if (!currentUser && !isGuest) {
    return <WelcomeScreen onUserCreate={setCurrentUser} onGuestContinue={handleGuestContinue} />;
  }
  const displayUser = currentUser || {
    ...mockUser,
    college: guestSchool || "Arizona State University"
  };
  const renderContent = () => {
    switch (activeTab) {
      case "meet":
        return <MeetTabContent profiles={mockProfiles} isGuest={isGuest} onGuestAction={handleGuestAction} />;
      case "discover":
        return <DiscoverTabContent profiles={mockProfiles} isGuest={isGuest} onGuestAction={handleGuestAction} currentUser={currentUser} onUpdateUser={setCurrentUser} />;
      case "community":
        return <CommunityTabContent />;
      case "chats":
        return isGuest ? <div className="max-w-lg mx-auto pb-32 text-center">
            <p className="text-slate-600 mt-8 text-lg">Create an account to view your chats</p>
          </div> : <ChatsTabContent />;
      case "profile":
        return isGuest ? <GuestProfile onCreateAccount={handleCreateAccount} /> : <ProfileTabContent currentUser={displayUser} onUpdateUser={setCurrentUser} />;
      default:
        return null;
    }
  };
  return <div className="h-screen w-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-slate-200/50 flex-shrink-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${getSchoolLogo(displayUser.college)} rounded-xl shadow-lg flex items-center justify-center`}>
              <span className="text-white font-bold text-xl">
                {displayUser.college.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                FroshMeet
              </h1>
              <p className="text-sm text-slate-600 font-semibold">
                {displayUser.college}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-semibold px-4 py-2 text-sm">
            {isGuest ? "Guest" : `Class of ${displayUser.classOf}`}
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200/50 shadow-2xl z-50">
        <div className="max-w-md mx-auto px-6 py-4">
          {/* Tooltip for Meet */}
          {activeTab !== "meet" && <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-lg shadow-lg cursor-pointer" onClick={() => setActiveTab("meet")}>
              <div className="flex items-center space-x-2">
                <ArrowDown className="h-4 w-4" />
                <span className="text-sm font-bold">Tap to meet students from your school!</span>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
            </div>}
          
          <div className="flex justify-between items-center">
            <Button variant={activeTab === "discover" ? "default" : "ghost"} size="sm" onClick={() => setActiveTab("discover")} className={`flex flex-col items-center justify-center h-16 w-16 transition-all duration-200 ${activeTab === "discover" ? "bg-slate-900 text-white shadow-lg scale-105" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}>
              <Grid className="h-8 w-8" />
            </Button>
            
            <Button variant={activeTab === "community" ? "default" : "ghost"} size="sm" onClick={() => setActiveTab("community")} className={`flex flex-col items-center justify-center h-16 w-16 transition-all duration-200 ${activeTab === "community" ? "bg-slate-900 text-white shadow-lg scale-105" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}>
              <Newspaper className="h-8 w-8" />
            </Button>
            
            <Button variant={activeTab === "meet" ? "default" : "ghost"} size="lg" onClick={() => setActiveTab("meet")} className={`flex flex-col items-center justify-center h-16 w-16 transition-all duration-200 ${activeTab === "meet" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}>
              <Heart className="h-8 w-8" />
            </Button>
            
            <Button variant={activeTab === "chats" ? "default" : "ghost"} size="sm" onClick={() => setActiveTab("chats")} className={`flex flex-col items-center justify-center h-16 w-16 transition-all duration-200 ${activeTab === "chats" ? "bg-slate-900 text-white shadow-lg scale-105" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}>
              <MessageSquare className="h-8 w-8" />
            </Button>
            
            <Button variant={activeTab === "profile" ? "default" : "ghost"} size="sm" onClick={() => setActiveTab("profile")} className={`flex flex-col items-center justify-center h-16 w-16 transition-all duration-200 ${activeTab === "profile" ? "bg-slate-900 text-white shadow-lg scale-105" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}>
              <User className="h-8 w-8" />
            </Button>
          </div>
        </div>
      </nav>

      <GuestMessageDialog isOpen={showGuestDialog} onClose={() => setShowGuestDialog(false)} onCreateAccount={handleCreateAccount} />
    </div>;
};
export default Index;