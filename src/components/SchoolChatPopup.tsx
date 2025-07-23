import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Users, Sparkles } from "lucide-react";

interface SchoolChatPopupProps {
  schoolName: string;
  isVerified: boolean;
  onJoinChat: () => void;
  onVerify: () => void;
  onDismiss: () => void;
}

const SchoolChatPopup = ({ 
  schoolName, 
  isVerified, 
  onJoinChat, 
  onVerify, 
  onDismiss 
}: SchoolChatPopupProps) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">🎉 Big News!</h3>
                <p className="text-sm text-muted-foreground">New exclusive chat</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onDismiss}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h4 className="text-xl font-bold mb-2">
              📣 {schoolName} Exclusive GC
            </h4>
            <p className="text-muted-foreground text-sm">
              {isVerified 
                ? `Connect with verified students at ${schoolName}! Your exclusive group chat is now live.`
                : `Only verified ${schoolName} students can join this group. Verify now to unlock the group chat.`
              }
            </p>
          </div>

          <div className="space-y-3">
            {isVerified ? (
              <Button 
                onClick={onJoinChat}
                className="w-full neon-glow"
                size="lg"
              >
                Join Chat Now
              </Button>
            ) : (
              <Button 
                onClick={onVerify}
                className="w-full neon-glow"
                size="lg"
              >
                🔒 Verify Now
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              onClick={onDismiss}
              className="w-full"
            >
              Maybe Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchoolChatPopup;