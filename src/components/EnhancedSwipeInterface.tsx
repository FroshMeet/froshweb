import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  Users, 
  Heart, 
  X, 
  MessageSquare, 
  Settings,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Building2
} from "lucide-react";
import IcebreakerModal from "./IcebreakerModal";

interface EnhancedSwipeInterfaceProps {
  schoolName: string;
  profiles: any[];
  isGuest?: boolean;
  onGuestAction?: () => void;
  onClose: () => void;
  mode: "meet" | "roommate";
}

const EnhancedSwipeInterface = ({ 
  schoolName, 
  profiles, 
  isGuest = true, 
  onGuestAction, 
  onClose,
  mode: initialMode
}: EnhancedSwipeInterfaceProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [meetMode, setMeetMode] = useState<"meet" | "roommate">(initialMode);
  const [scopeMode, setScopeMode] = useState<"school" | "any">("school");
  const [showFilters, setShowFilters] = useState(false);
  const [showIcebreakers, setShowIcebreakers] = useState(false);
  const [likedProfiles, setLikedProfiles] = useState<Set<number>>(new Set());
  const [passedProfiles, setPassedProfiles] = useState<Set<number>>(new Set());
  const [viewHistory, setViewHistory] = useState<number[]>([0]);
  
  // Filters
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [majorFilter, setMajorFilter] = useState<string>("all");

  // Touch handling for mobile swipe
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const getUnsplashUrl = (photoId: string) => {
    return `https://images.unsplash.com/${photoId}?w=400&h=600&fit=crop&crop=face`;
  };

  const filteredProfiles = profiles.filter(profile => {
    // Filter by meet/roommate mode
    if (meetMode === "roommate" && !profile.lookingFor?.includes("Roommate")) {
      return false;
    }
    
    // Apply advanced filters
    if (genderFilter !== "all" && profile.gender !== genderFilter) return false;
    if (yearFilter !== "all" && profile.classOf !== yearFilter) return false;
    if (majorFilter !== "all" && profile.major !== majorFilter) return false;
    
    return true;
  });

  const currentProfile = filteredProfiles[currentIndex];
  const photos = currentProfile?.photos || ["photo-1649972904349-6e44c42644a7"];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleAction("pass");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleAction("like");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, filteredProfiles.length]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setTouchEnd(null);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart || !isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    
    // Only allow horizontal dragging
    if (Math.abs(deltaX) > 10) {
      setDragOffset(deltaX);
      setTouchEnd({ x: touch.clientX, y: touch.clientY });
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || !isDragging) {
      setIsDragging(false);
      setDragOffset(0);
      return;
    }

    const deltaX = touchEnd.x - touchStart.x;
    const threshold = 100;

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        handleAction("like");
      } else {
        handleAction("pass");
      }
    }

    setIsDragging(false);
    setDragOffset(0);
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleAction = (action: "like" | "pass" | "message") => {
    if (isGuest && onGuestAction && action !== "pass") {
      onGuestAction();
      return;
    }

    if (action === "message") {
      setShowIcebreakers(true);
      return;
    }

    const profileId = currentProfile?.id;
    if (profileId) {
      if (action === "like") {
        setLikedProfiles(prev => new Set([...prev, profileId]));
      } else if (action === "pass") {
        setPassedProfiles(prev => new Set([...prev, profileId]));
      }
    }

    goToNext();
  };

  const goToNext = () => {
    setCurrentPhotoIndex(0);
    const nextIndex = (currentIndex + 1) % filteredProfiles.length;
    setCurrentIndex(nextIndex);
    setViewHistory(prev => [...prev, nextIndex]);
  };

  const goToPrevious = () => {
    if (viewHistory.length > 1) {
      const newHistory = [...viewHistory];
      newHistory.pop(); // Remove current
      const prevIndex = newHistory[newHistory.length - 1];
      setCurrentIndex(prevIndex);
      setViewHistory(newHistory);
      setCurrentPhotoIndex(0);
    }
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
    setShowIcebreakers(false);
    handleAction("like");
  };

  if (!filteredProfiles || filteredProfiles.length === 0) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        <div className="flex-shrink-0 bg-card border-b border-border/50 px-4 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">{schoolName}</h2>
            <Button variant="ghost" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">No profiles match your current filters</p>
            <Button onClick={() => setShowFilters(true)}>
              Adjust Filters
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <p className="text-muted-foreground">Loading profiles...</p>
      </div>
    );
  }

  const cardStyle = {
    transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.1}deg)`,
    transition: isDragging ? 'none' : 'transform 0.3s ease-out'
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-card border-b border-border/50 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">{schoolName}</h2>
            <p className="text-sm text-muted-foreground">
              {filteredProfiles.length} profiles • {currentIndex + 1} of {filteredProfiles.length}
            </p>
          </div>
          <Button variant="ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Primary Toggles */}
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Meet Students vs Find Roommates */}
          <ToggleGroup 
            type="single" 
            value={meetMode} 
            onValueChange={(value) => value && setMeetMode(value as "meet" | "roommate")}
            className="bg-muted rounded-lg p-1"
          >
            <ToggleGroupItem 
              value="meet" 
              className="data-[state=on]:bg-background data-[state=on]:text-foreground"
            >
              <Heart className="h-4 w-4 mr-1" />
              Meet Students
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="roommate" 
              className="data-[state=on]:bg-background data-[state=on]:text-foreground"
            >
              <Users className="h-4 w-4 mr-1" />
              Find Roommates
            </ToggleGroupItem>
          </ToggleGroup>

          {/* Your School vs Any Student */}
          <ToggleGroup 
            type="single" 
            value={scopeMode} 
            onValueChange={(value) => value && setScopeMode(value as "school" | "any")}
            className="bg-muted rounded-lg p-1"
          >
            <ToggleGroupItem 
              value="school" 
              className="data-[state=on]:bg-background data-[state=on]:text-foreground flex items-center gap-1"
            >
              <Building2 className="h-4 w-4" />
              Your School
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="any" 
              className="data-[state=on]:bg-background data-[state=on]:text-foreground flex items-center gap-1"
            >
              <Globe className="h-4 w-4" />
              Any Student
            </ToggleGroupItem>
          </ToggleGroup>

          {/* Advanced Filters */}
          <Button variant="outline" onClick={() => setShowFilters(true)}>
            <Settings className="h-4 w-4 mr-1" />
            Filters
          </Button>
        </div>

        {scopeMode === "any" && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 Looking beyond your campus? You're now seeing students from all schools nationwide.
            </p>
          </div>
        )}

        {/* Guest Warning */}
        {isGuest && (
          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              You're browsing as a guest. Create an account to match and message students.
            </p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Mobile Layout */}
        <div className="md:hidden h-full flex flex-col relative">
          {/* Card Stack */}
          <div className="flex-1 relative p-4">
            {/* Next cards in background */}
            {filteredProfiles.slice(currentIndex + 1, currentIndex + 3).map((profile, idx) => (
              <div
                key={profile.id}
                className="absolute inset-4 bg-card rounded-2xl shadow-lg border"
                style={{
                  transform: `scale(${1 - (idx + 1) * 0.05}) translateY(${(idx + 1) * 10}px)`,
                  zIndex: 10 - idx,
                  opacity: 0.8 - idx * 0.2
                }}
              />
            ))}

            {/* Current card */}
            <div
              ref={cardRef}
              className="absolute inset-4 bg-card rounded-2xl shadow-xl border overflow-hidden"
              style={{ zIndex: 20, ...cardStyle }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="relative h-full">
                <img
                  src={getUnsplashUrl(photos[currentPhotoIndex])}
                  alt={currentProfile.name}
                  className="w-full h-full object-cover"
                />

                {/* Photo navigation */}
                {photos.length > 1 && (
                  <>
                    <button
                      onClick={prevPhoto}
                      disabled={currentPhotoIndex === 0}
                      className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full z-30 ${
                        currentPhotoIndex === 0 ? 'opacity-30' : 'hover:bg-black/90'
                      }`}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={nextPhoto}
                      disabled={currentPhotoIndex === photos.length - 1}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 text-white p-2 rounded-full z-30 ${
                        currentPhotoIndex === photos.length - 1 ? 'opacity-30' : 'hover:bg-black/90'
                      }`}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}

                {/* Photo indicators */}
                {photos.length > 1 && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 flex space-x-1 z-20">
                    {photos.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-1 rounded-full ${
                          index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Profile overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{currentProfile.name}, {currentProfile.age}</h3>
                  <p className="text-sm opacity-90 mb-3">{currentProfile.bio}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {currentProfile.interests?.slice(0, 3).map((interest: string) => (
                      <Badge key={interest} variant="outline" className="bg-white/20 text-white border-white/30 text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                  {meetMode === "roommate" && (
                    <div className="text-xs opacity-75">
                      💰 Budget: $800-1200 • 📅 Move-in: Fall 2024
                    </div>
                  )}
                </div>

                {/* Class year badge */}
                <div className="absolute top-16 right-4 z-20">
                  <Badge className="bg-white/90 text-black">
                    Class of {currentProfile.classOf || "2029"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="glass-card flex-shrink-0 border-t">
            <div className="glass-content px-6 py-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                size="lg"
                className="w-16 h-16 rounded-full hover:bg-red-50 hover:border-red-200"
                onClick={() => handleAction("pass")}
              >
                <X className="h-6 w-6 text-red-500" />
              </Button>
              
              <Button 
                size="lg"
                className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => handleAction("message")}
              >
                <MessageSquare className="h-6 w-6" />
              </Button>
              
              <Button 
                size="lg"
                className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
                onClick={() => handleAction("like")}
              >
                <Heart className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="flex items-center justify-center mt-4 space-x-4">
              <Button
                variant="ghost"
                onClick={goToPrevious}
                disabled={viewHistory.length <= 1}
                className="flex items-center space-x-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Previous</span>
              </Button>
              
              <Button
                variant="ghost"
                onClick={goToNext}
                className="flex items-center space-x-1"
              >
                <span className="text-sm">Next</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex h-full">
          {/* Left side - Photo */}
          <div className="flex-1 relative">
            <img
              src={getUnsplashUrl(photos[currentPhotoIndex])}
              alt={currentProfile.name}
              className="w-full h-full object-cover"
            />
            
            {/* Photo navigation */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  disabled={currentPhotoIndex === 0}
                  className={`absolute left-6 top-1/2 -translate-y-1/2 bg-black/70 text-white p-3 rounded-full z-20 ${
                    currentPhotoIndex === 0 ? 'opacity-30' : 'hover:bg-black/90'
                  }`}
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextPhoto}
                  disabled={currentPhotoIndex === photos.length - 1}
                  className={`absolute right-6 top-1/2 -translate-y-1/2 bg-black/70 text-white p-3 rounded-full z-20 ${
                    currentPhotoIndex === photos.length - 1 ? 'opacity-30' : 'hover:bg-black/90'
                  }`}
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Photo indicators */}
            {photos.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                {photos.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-1.5 rounded-full ${
                      index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Navigation arrows */}
            <div className="absolute bottom-6 right-6 flex space-x-2 z-10">
              <Button
                variant="secondary"
                onClick={goToPrevious}
                disabled={viewHistory.length <= 1}
                className="bg-black/70 text-white hover:bg-black/90"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                onClick={goToNext}
                className="bg-black/70 text-white hover:bg-black/90"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right side - Profile Info */}
          <div className="w-80 bg-card flex flex-col h-full">
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              <div>
                <h3 className="text-2xl font-bold">{currentProfile.name}, {currentProfile.age}</h3>
                <p className="text-muted-foreground">{currentProfile.major} • Class of {currentProfile.classOf}</p>
              </div>

              <div>
                <p className="text-sm">{currentProfile.bio}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">INTERESTS</p>
                <div className="flex flex-wrap gap-2">
                  {currentProfile.interests?.map((interest: string) => (
                    <Badge key={interest} variant="outline" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">LOOKING FOR</p>
                <div className="flex flex-wrap gap-2">
                  {currentProfile.lookingFor?.map((item: string) => (
                    <Badge key={item} className="text-xs bg-primary/10 text-primary">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>

              {meetMode === "roommate" && (
                <div className="border-t pt-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2">ROOMMATE PREFERENCES</p>
                  <div className="space-y-2 text-sm">
                    <div>💰 Budget: $800-1200/month</div>
                    <div>📅 Move-in: Fall 2024</div>
                    <div>🏠 Looking for: 2BR apartment</div>
                    <div>🚫 Non-smoker preferred</div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex-shrink-0 p-6 space-y-3 border-t">
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12"
                onClick={() => handleAction("message")}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Button>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  className="flex-1 hover:bg-red-50 hover:border-red-200 h-12"
                  onClick={() => handleAction("pass")}
                >
                  <X className="h-4 w-4 mr-1" />
                  Pass
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 h-12"
                  onClick={() => handleAction("like")}
                >
                  <Heart className="h-4 w-4 mr-1" />
                  Like
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters Modal */}
      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Advanced Filters</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="year">Class Year</Label>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="2028">Class of 2028</SelectItem>
                  <SelectItem value="2029">Class of 2029</SelectItem>
                  <SelectItem value="2030">Class of 2030</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="major">Major</Label>
              <Select value={majorFilter} onValueChange={setMajorFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select major" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Majors</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Pre-Med">Pre-Med</SelectItem>
                  <SelectItem value="Art & Design">Art & Design</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {meetMode === "roommate" && (
              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Roommate Preferences</p>
                <p className="text-xs text-muted-foreground">
                  Same-sex roommates are shown by default in roommate mode
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Icebreaker Modal */}
      <IcebreakerModal
        isOpen={showIcebreakers}
        onClose={() => setShowIcebreakers(false)}
        onSendMessage={handleSendMessage}
        targetName={currentProfile?.name}
        isGuest={isGuest}
        onGuestAction={onGuestAction}
      />
    </div>
  );
};

export default EnhancedSwipeInterface;