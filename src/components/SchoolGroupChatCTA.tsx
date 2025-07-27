import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Sparkles, Lock } from "lucide-react";
import { getSchoolDisplayName } from "@/config/schoolDisplayMapping";

interface SchoolGroupChatCTAProps {
  schoolSlug: string;
  onJoinClick: () => void;
}

const SchoolGroupChatCTA = ({ schoolSlug, onJoinClick }: SchoolGroupChatCTAProps) => {
  const schoolAcronym = getSchoolDisplayName(schoolSlug);

  return (
    <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          {/* Icon */}
          <div className="relative inline-flex">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-primary-foreground" />
            </div>
          </div>

          {/* Title */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">
              Join {schoolAcronym}'s Group Chat
            </h3>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-3 w-3" />
              <span>Verified {schoolAcronym} Students Only</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Connect with your verified classmates in an exclusive group chat. Share study tips, campus events, and make lasting friendships.
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="text-xs">Real Students</Badge>
            <Badge variant="secondary" className="text-xs">Verified Only</Badge>
            <Badge variant="secondary" className="text-xs">School Exclusive</Badge>
          </div>

          {/* CTA Button */}
          <Button 
            onClick={onJoinClick}
            className="w-full neon-glow"
            size="lg"
          >
            <Users className="h-4 w-4 mr-2" />
            Join {schoolAcronym} Chat
          </Button>

          <p className="text-xs text-muted-foreground">
            Sign up required • Free to join
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SchoolGroupChatCTA;