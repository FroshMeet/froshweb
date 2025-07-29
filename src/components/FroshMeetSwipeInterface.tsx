import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, X, MessageSquare, MapPin, BookOpen, Instagram, ChevronLeft, ChevronRight, Filter, Users, Globe, School, User } from "lucide-react";
import IcebreakerModal from "./IcebreakerModal";
interface FroshMeetSwipeInterfaceProps {
  profiles: any[];
  onShowIcebreakers: () => void;
  onSwipeAction: (action: string) => void;
  isGuest?: boolean;
  onGuestAction?: () => void;
  meetMode?: string;
  setMeetMode?: (mode: string) => void;
  schoolName?: string;
}
const FroshMeetSwipeInterface = ({
  profiles,
  onShowIcebreakers,
  onSwipeAction,
  isGuest = false,
  onGuestAction,
  meetMode = "everyone",
  setMeetMode,
  schoolName = "BU"
}: FroshMeetSwipeInterfaceProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showIcebreakers, setShowIcebreakers] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [scopeMode, setScopeMode] = useState("school"); // "school" or "worldwide"
  const [filters, setFilters] = useState({
    classYears: [] as string[],
    majors: [] as string[],
    genderPreference: "",
    lookingForRoommate: false
  });
  const getUnsplashUrl = (photoId: string) => {
    return `https://images.unsplash.com/${photoId}?w=600&h=800&fit=crop&crop=face`;
  };
  // Filter profiles based on scope mode
  const filteredProfiles = profiles.filter(profile => {
    if (scopeMode === "school") {
      // Show only students from the same school
      return profile.school === schoolName;
    }
    // Worldwide: show all students
    return true;
  });

  const currentProfile = filteredProfiles[currentIndex];
  const photos = currentProfile?.photos || ["photo-1649972904349-6e44c42644a7"];
  const currentPhoto = photos[currentPhotoIndex];
  const handleSwipe = (action: 'like' | 'skip') => {
    if (action === 'like' && isGuest && onGuestAction) {
      onGuestAction();
      return;
    }
    onSwipeAction(action);
    setCurrentPhotoIndex(0);
    if (currentIndex < filteredProfiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };
  const handleMessage = () => {
    if (isGuest && onGuestAction) {
      onGuestAction();
      return;
    }
    setShowIcebreakers(true);
  };
  const nextPhoto = () => {
    if (currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };
  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };
  const handleSendMessage = (message: string) => {
    if (isGuest && onGuestAction) {
      onGuestAction();
      return;
    }
    console.log("Sending message:", message, "to", currentProfile?.name);
  };
  if (!filteredProfiles || filteredProfiles.length === 0 || !currentProfile) {
    return <div className="h-full flex items-center justify-center bg-background">
        <p className="text-muted-foreground">No profiles to show right now</p>
      </div>;
  }
  return <div className="h-full w-full bg-background overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          {/* Navigation Tabs */}
          
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-col space-y-3 mt-4">
          {/* Mode Buttons */}
          <div className="flex space-x-2">
            <button onClick={() => setMeetMode && setMeetMode("everyone")} className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${meetMode === "everyone" ? "bg-froshmeet-blue text-white shadow-lg" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              Everyone
            </button>
            <button onClick={() => setMeetMode && setMeetMode("roommates")} className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${meetMode === "roommates" ? "bg-froshmeet-blue text-white shadow-lg" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              Roommates
            </button>
          </div>

          {/* Scope Toggle and Filter */}
          <div className="flex items-center justify-between">
            {/* Scope Toggle (only for Everyone mode) */}
            {meetMode === "everyone" && (
              <div className="flex items-center space-x-2">
                <button onClick={() => setScopeMode("school")} className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${scopeMode === "school" ? "bg-froshmeet-blue/20 text-froshmeet-blue" : "text-muted-foreground hover:text-foreground"}`}>
                  <School className="h-3 w-3 inline mr-1" />
                  Your School
                </button>
                <button onClick={() => setScopeMode("worldwide")} className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${scopeMode === "worldwide" ? "bg-froshmeet-blue/20 text-froshmeet-blue" : "text-muted-foreground hover:text-foreground"}`}>
                  <Globe className="h-3 w-3 inline mr-1" />
                  Worldwide
                </button>
              </div>
            )}

            {/* Filter Button */}
            <Button variant="outline" size="sm" onClick={() => setShowFilters(true)} className="border-froshmeet-blue/20 text-froshmeet-blue hover:bg-froshmeet-blue/10 ml-auto">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100%-120px)]">
        {/* Mobile Layout */}
        <div className="md:hidden w-full flex flex-col">
          {/* Photo Section */}
          <div className="flex-1 relative">
            <img src={getUnsplashUrl(currentPhoto)} alt={currentProfile.name || "Profile"} className="w-full h-full object-cover" />
            
            {/* Photo Navigation */}
            {photos.length > 1 && <>
                <button onClick={prevPhoto} disabled={currentPhotoIndex === 0} className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full ${currentPhotoIndex === 0 ? 'opacity-30' : 'hover:bg-black/70'}`}>
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button onClick={nextPhoto} disabled={currentPhotoIndex === photos.length - 1} className={`absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full ${currentPhotoIndex === photos.length - 1 ? 'opacity-30' : 'hover:bg-black/70'}`}>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>}

            {/* Photo Indicators */}
            {photos.length > 1 && <div className="absolute top-4 left-1/2 -translate-x-1/2 flex space-x-1">
                {photos.map((_, index) => <div key={index} className={`w-2 h-1 rounded-full ${index === currentPhotoIndex ? 'bg-white' : 'bg-white/40'}`} />)}
              </div>}

            {/* Profile Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 text-white">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">
                    {currentProfile.name.split(' ')[0]} {currentProfile.name.split(' ')[1]?.[0]}.
                  </h2>
                  <Badge className="bg-froshmeet-blue text-white border-0">
                    Class of {currentProfile.classOf || "2029"}
                  </Badge>
                </div>
                
                <div className="text-lg font-medium text-white/90">
                  {currentProfile.major}
                </div>
                
                <div className="flex items-center space-x-2 text-white/80">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">{currentProfile.location || schoolName}</span>
                </div>

                {currentProfile.lookingFor?.includes("Roommate") && <Badge className="bg-purple-600/80 text-white border-0">
                    <Users className="h-3 w-3 mr-1" />
                    Looking for Roommate
                  </Badge>}

                <div className="text-white/90 text-sm leading-relaxed">
                  "{currentProfile.bio || 'No bio added yet.'}"
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-card p-4 flex justify-between space-x-2">
            <Button variant="outline" className="w-20 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-700 h-12" onClick={() => handleSwipe('skip')}>
              <X className="h-5 w-5" />
            </Button>
            <Button className="flex-1 bg-froshmeet-blue hover:bg-froshmeet-blue-dark text-white h-12 hover:shadow-[var(--glow-blue)] transition-all duration-300" onClick={handleMessage}>
              <MessageSquare className="h-5 w-5 mr-2" />
              Message
            </Button>
            <Button className="w-20 bg-pink-500 hover:bg-pink-600 text-white h-12" onClick={() => handleSwipe('like')}>
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex w-full">
          {/* Left side - Photo */}
          <div className="flex-1 relative">
            <img src={getUnsplashUrl(currentPhoto)} alt={currentProfile.name || "Profile"} className="w-full h-full object-cover rounded-2xl m-4" />
            
            {/* Photo Navigation */}
            {photos.length > 1 && <>
                <button onClick={prevPhoto} disabled={currentPhotoIndex === 0} className={`absolute left-8 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full ${currentPhotoIndex === 0 ? 'opacity-30' : 'hover:bg-black/70'}`}>
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button onClick={nextPhoto} disabled={currentPhotoIndex === photos.length - 1} className={`absolute right-8 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full ${currentPhotoIndex === photos.length - 1 ? 'opacity-30' : 'hover:bg-black/70'}`}>
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>}

            {/* Photo Indicators */}
            {photos.length > 1 && <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
                {photos.map((_, index) => <div key={index} className={`w-3 h-1.5 rounded-full ${index === currentPhotoIndex ? 'bg-white' : 'bg-white/40'}`} />)}
              </div>}
          </div>

          {/* Right side - Student Info Card */}
          <div className="w-96 p-4">
            <Card className="h-full bg-card border border-border rounded-2xl shadow-lg">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="space-y-6 flex-1">
                  {/* Header */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-foreground">
                        {currentProfile.name.split(' ')[0]} {currentProfile.name.split(' ')[1]?.[0]}.
                      </h2>
                      <Badge className="bg-froshmeet-blue text-white border-0 text-sm px-3 py-1">
                        Class of {currentProfile.classOf || "2029"}
                      </Badge>
                    </div>
                    
                    <div className="text-lg font-semibold text-foreground">
                      {currentProfile.major}
                    </div>
                    
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <School className="h-4 w-4" />
                      <button className="font-medium text-froshmeet-blue hover:underline">
                        {currentProfile.location || schoolName}
                      </button>
                    </div>
                  </div>

                  {/* Roommate Badge */}
                  {currentProfile.lookingFor?.includes("Roommate") && <Badge className="bg-purple-600/10 text-purple-600 border border-purple-600/20 w-fit">
                      <Users className="h-3 w-3 mr-1" />
                      Looking for Roommate
                    </Badge>}

                  {/* Bio */}
                  <div>
                    <p className="text-foreground leading-relaxed">
                      "{currentProfile.bio || 'No bio added yet.'}"
                    </p>
                  </div>

                  {/* Interests */}
                  {currentProfile.interests && currentProfile.interests.length > 0 && <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        Interests
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {currentProfile.interests.slice(0, 6).map((interest: string) => <Badge key={interest} variant="outline" className="text-xs px-3 py-1 border-border text-muted-foreground">
                            {interest}
                          </Badge>)}
                      </div>
                    </div>}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-6 border-t border-border">
                  <Button className="w-full bg-froshmeet-blue hover:bg-froshmeet-blue-dark text-white h-12 hover:shadow-[var(--glow-blue)] transition-all duration-300 rounded-xl" onClick={handleMessage}>
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Message
                  </Button>
                  <div className="flex space-x-3">
                    <Button variant="outline" className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-700 h-11 rounded-xl" onClick={() => handleSwipe('skip')}>
                      <X className="h-4 w-4 mr-1" />
                      Skip
                    </Button>
                    <Button className="flex-1 bg-pink-500 hover:bg-pink-600 text-white h-11 rounded-xl" onClick={() => handleSwipe('like')}>
                      <Heart className="h-4 w-4 mr-1" />
                      Like
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Filters</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">Class Year</label>
              <div className="grid grid-cols-2 gap-2">
                {["2025", "2026", "2027", "2028", "2029", "2030"].map(year => <div key={year} className="flex items-center space-x-2">
                    <Checkbox id={year} checked={filters.classYears.includes(year)} onCheckedChange={checked => {
                  if (checked) {
                    setFilters(prev => ({
                      ...prev,
                      classYears: [...prev.classYears, year]
                    }));
                  } else {
                    setFilters(prev => ({
                      ...prev,
                      classYears: prev.classYears.filter(y => y !== year)
                    }));
                  }
                }} />
                    <label htmlFor={year} className="text-sm text-foreground">
                      Class of {year}
                    </label>
                  </div>)}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <Checkbox id="roommate" checked={filters.lookingForRoommate} onCheckedChange={checked => {
                setFilters(prev => ({
                  ...prev,
                  lookingForRoommate: checked as boolean
                }));
              }} />
                <label htmlFor="roommate" className="text-sm font-medium text-foreground">
                  Looking for Roommate
                </label>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" className="flex-1" onClick={() => setFilters({
              classYears: [],
              majors: [],
              genderPreference: "",
              lookingForRoommate: false
            })}>
                Clear All
              </Button>
              <Button className="flex-1 bg-froshmeet-blue hover:bg-froshmeet-blue-dark text-white" onClick={() => setShowFilters(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Icebreaker Modal */}
      <IcebreakerModal isOpen={showIcebreakers} onClose={() => setShowIcebreakers(false)} onSendMessage={handleSendMessage} targetName={currentProfile?.name} isGuest={isGuest} onGuestAction={onGuestAction} />
    </div>;
};
export default FroshMeetSwipeInterface;