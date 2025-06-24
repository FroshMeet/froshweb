
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, MessageSquare, Clock, Moon, Volume2, Thermometer } from "lucide-react";

const RoommateMatching = ({ currentUser }) => {
  const roommateProfiles = [
    {
      id: 4,
      name: "Emma Thompson",
      age: 18,
      college: "UCLA",
      major: "Psychology",
      bio: "Early bird, clean, and love studying with music on!",
      photo: "photo-1649972904349-6e44c42644a7",
      compatibility: 92,
      preferences: {
        sleepSchedule: "Early Bird",
        cleanliness: "Very Clean",
        socialLevel: "Moderate",
        studyHabits: "Quiet",
        temperature: "Cool"
      },
      commonInterests: ["Reading", "Music", "Hiking"]
    },
    {
      id: 5,
      name: "Jordan Kim",
      age: 18,
      college: "UCLA",
      major: "Engineering",
      bio: "Night owl programmer, respectful of space, love coffee!",
      photo: "photo-1581091226825-a6a2a5aee158",
      compatibility: 85,
      preferences: {
        sleepSchedule: "Night Owl",
        cleanliness: "Clean",
        socialLevel: "Low-Moderate",
        studyHabits: "Background Music",
        temperature: "Warm"
      },
      commonInterests: ["Programming", "Gaming"]
    },
    {
      id: 6,
      name: "Riley Martinez",
      age: 18,
      college: "UCLA",
      major: "Business",
      bio: "Social butterfly, organized, love hosting study sessions!",
      photo: "photo-1581092795360-fd1ca04f0952",
      compatibility: 78,
      preferences: {
        sleepSchedule: "Moderate",
        cleanliness: "Very Clean",
        socialLevel: "High",
        studyHabits: "Group Study",
        temperature: "Moderate"
      },
      commonInterests: ["Business", "Networking", "Travel"]
    }
  ];

  const getUnsplashUrl = (photoId) => {
    return `https://images.unsplash.com/${photoId}?w=300&h=300&fit=crop&crop=face`;
  };

  const getCompatibilityColor = (score) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 80) return "text-blue-600 bg-blue-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getProgressColor = (score) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 80) return "bg-blue-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Find Your Perfect Roommate</h2>
        <p className="text-muted-foreground">Based on lifestyle compatibility and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {roommateProfiles.map((profile) => (
          <Card key={profile.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-start space-x-4">
                <img
                  src={getUnsplashUrl(profile.photo)}
                  alt={profile.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{profile.name}, {profile.age}</CardTitle>
                    <Badge className={`${getCompatibilityColor(profile.compatibility)} font-bold`}>
                      {profile.compatibility}% Match
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{profile.major}</p>
                  <Progress 
                    value={profile.compatibility} 
                    className="mt-2 h-2" 
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{profile.bio}</p>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">LIFESTYLE PREFERENCES</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{profile.preferences.sleepSchedule}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Moon className="h-3 w-3" />
                      <span>{profile.preferences.cleanliness}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Volume2 className="h-3 w-3" />
                      <span>{profile.preferences.studyHabits}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Thermometer className="h-3 w-3" />
                      <span>{profile.preferences.temperature}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">COMMON INTERESTS</p>
                  <div className="flex flex-wrap gap-1">
                    {profile.commonInterests.map((interest) => (
                      <Badge key={interest} variant="outline" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 hover:bg-red-50 hover:border-red-200"
                >
                  <Heart className="h-4 w-4 mr-1" />
                  Interested
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Compatibility Tips</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Our matching algorithm considers sleep schedules, cleanliness levels, social preferences, and study habits to find your perfect roommate match.
          </p>
          <Button variant="outline" size="sm">
            Learn More About Matching
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoommateMatching;
