
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Users, MessageSquare, Heart } from "lucide-react";

interface GuestProfileProps {
  onCreateAccount: () => void;
}

const GuestProfile = ({ onCreateAccount }: GuestProfileProps) => {
  return (
    <div className="max-w-lg mx-auto pb-32">
      <Card className="overflow-hidden bg-card/90 backdrop-blur-sm neon-glow border-border frosted-card">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary/30 to-primary/50 rounded-full mx-auto mb-4 flex items-center justify-center neon-glow">
            <User className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl text-foreground">Guest User</CardTitle>
          <p className="text-sm text-muted-foreground">
            Create an account to build your profile and connect with classmates
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg border border-border">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Connect with peers</p>
                <p className="text-sm text-muted-foreground">Message and meet classmates</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg border border-border">
              <MessageSquare className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Build your profile</p>
                <p className="text-sm text-muted-foreground">Share your interests and bio</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg border border-border">
              <Heart className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Smart matching</p>
                <p className="text-sm text-muted-foreground">Find study buddies and friends</p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={onCreateAccount}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 neon-glow-strong"
          >
            Create Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestProfile;
