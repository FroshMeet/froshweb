
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Users, MessageSquare, Heart } from "lucide-react";

interface GuestProfileProps {
  onCreateAccount: () => void;
}

const GuestProfile = ({ onCreateAccount }: GuestProfileProps) => {
  return (
    <div className="max-w-lg mx-auto pb-32">
      <Card className="overflow-hidden bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-slate-300 to-slate-400 rounded-full mx-auto mb-4 flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-xl">Guest User</CardTitle>
          <p className="text-sm text-muted-foreground">
            Create an account to build your profile and connect with classmates
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
              <Users className="h-5 w-5 text-slate-600" />
              <div>
                <p className="font-medium">Connect with peers</p>
                <p className="text-sm text-slate-600">Message and meet classmates</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
              <MessageSquare className="h-5 w-5 text-slate-600" />
              <div>
                <p className="font-medium">Build your profile</p>
                <p className="text-sm text-slate-600">Share your interests and bio</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
              <Heart className="h-5 w-5 text-slate-600" />
              <div>
                <p className="font-medium">Smart matching</p>
                <p className="text-sm text-slate-600">Find study buddies and friends</p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={onCreateAccount}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3"
          >
            Create Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuestProfile;
