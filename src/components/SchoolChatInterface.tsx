import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, Users, Hash } from "lucide-react";

interface SchoolChatInterfaceProps {
  schoolName: string;
  isGuest?: boolean;
  onGuestAction?: () => void;
  onClose: () => void;
}

const SchoolChatInterface = ({ schoolName, isGuest = true, onGuestAction, onClose }: SchoolChatInterfaceProps) => {
  const [message, setMessage] = useState("");

  // Mock chat data
  const mockChannels = [
    { id: 1, name: "general", type: "public", members: 342 },
    { id: 2, name: "roommates", type: "public", members: 156 },
    { id: 3, name: "study-groups", type: "public", members: 89 },
    { id: 4, name: "events", type: "public", members: 234 },
    { id: 5, name: "freshman-help", type: "public", members: 445 },
  ];

  const mockMessages = [
    { id: 1, user: "Sarah M.", time: "2:34 PM", message: "Anyone want to grab lunch at the dining hall?" },
    { id: 2, user: "Mike T.", time: "2:36 PM", message: "I'm down! Which one?" },
    { id: 3, user: "Emma L.", time: "2:37 PM", message: "Count me in too!" },
    { id: 4, user: "You", time: "2:40 PM", message: "The new one by the library is really good" },
  ];

  const handleSendMessage = () => {
    if (isGuest && onGuestAction) {
      onGuestAction();
      return;
    }
    // Handle message sending
    setMessage("");
  };

  if (isGuest) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 bg-card border-b border-border/50 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">{schoolName} Chat</h2>
              <p className="text-sm text-muted-foreground">Community discussions</p>
            </div>
            <Button variant="ghost" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Locked Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Join the conversation</h3>
            <p className="text-muted-foreground mb-8">
              Create your profile to start chatting with real students at {schoolName}. It's free and takes just 2 minutes.
            </p>
            <Button 
              size="lg" 
              onClick={onGuestAction}
              className="neon-glow"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex">
      {/* Sidebar with channels */}
      <div className="w-64 bg-card border-r border-border/50 flex flex-col">
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">{schoolName}</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2">
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-muted-foreground mb-2 px-2">CHANNELS</h4>
              {mockChannels.map((channel) => (
                <div
                  key={channel.id}
                  className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted/50 cursor-pointer"
                >
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{channel.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{channel.members}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="p-4 border-b border-border/50 bg-card">
          <div className="flex items-center gap-2">
            <Hash className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold">general</h2>
            <span className="text-sm text-muted-foreground">342 members</span>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {mockMessages.map((msg) => (
              <div key={msg.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xs font-medium">{msg.user[0]}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{msg.user}</span>
                    <span className="text-xs text-muted-foreground">{msg.time}</span>
                  </div>
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message input */}
        <div className="p-4 border-t border-border/50 bg-card">
          <div className="flex gap-2">
            <Input
              placeholder="Message #general"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolChatInterface;