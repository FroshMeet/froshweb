
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MessageSquare, Send, Share2, AlertTriangle, Instagram, Phone, Users } from "lucide-react";

const ChatInterface = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [showSocialShare, setShowSocialShare] = useState(false);
  const [agreedToWarning, setAgreedToWarning] = useState(false);

  const mockChats = [
    {
      id: 1,
      name: "Alex Rivera",
      lastMessage: "Hey! I saw we're both in CS 101",
      time: "2m ago",
      unread: 2,
      avatar: "photo-1581091226825-a6a2a5aee158",
      major: "Business",
      dorm: "Warren Hall"
    },
    {
      id: 2,
      name: "Maya Patel",
      lastMessage: "Want to study together?",
      time: "1h ago",
      unread: 0,
      avatar: "photo-1581092795360-fd1ca04f0952",
      major: "Pre-Med",
      dorm: "North Campus"
    },
    {
      id: 3,
      name: "Study Group - CS 101",
      lastMessage: "Assignment due tomorrow!",
      time: "3h ago",
      unread: 5,
      avatar: null,
      isGroup: true
    }
  ];

  const icebreakers = [
    "What's your favorite spot on campus so far?",
    "How are you finding your classes?",
    "Want to grab coffee and study together?",
    "What's the best thing about being a freshman?",
    "Any favorite campus events you've been to?",
    "What made you choose this college?"
  ];

  const getUnsplashUrl = (photoId) => {
    return `https://images.unsplash.com/${photoId}?w=100&h=100&fit=crop&crop=face`;
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const SocialShareModal = ({ contact }) => (
    <Sheet open={showSocialShare} onOpenChange={setShowSocialShare}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Share Your Socials</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 mt-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">Safety First!</h4>
                <p className="text-sm text-red-700 mt-1">
                  Only share your personal information with people you trust. 
                  Be cautious about meeting strangers and always meet in public places.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Choose what to share with {contact?.name}:</h4>
            
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4"
                onClick={() => {
                  if (agreedToWarning) {
                    console.log("Sharing Instagram");
                    setShowSocialShare(false);
                  }
                }}
              >
                <Instagram className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <p className="font-medium">Instagram</p>
                  <p className="text-sm text-muted-foreground">@sarah_chen</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4"
                onClick={() => {
                  if (agreedToWarning) {
                    console.log("Sharing Snapchat");
                    setShowSocialShare(false);
                  }
                }}
              >
                <div className="w-5 h-5 bg-yellow-400 rounded-full mr-3"></div>
                <div className="text-left">
                  <p className="font-medium">Snapchat</p>
                  <p className="text-sm text-muted-foreground">sarah_c22</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4"
                onClick={() => {
                  if (agreedToWarning) {
                    console.log("Sharing Phone");
                    setShowSocialShare(false);
                  }
                }}
              >
                <Phone className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <p className="font-medium">Phone Number</p>
                  <p className="text-sm text-muted-foreground">(555) 123-4567</p>
                </div>
              </Button>
            </div>

            <div className="flex items-center space-x-2 mt-6">
              <input
                type="checkbox"
                id="safety-agreement"
                checked={agreedToWarning}
                onChange={(e) => setAgreedToWarning(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="safety-agreement" className="text-sm">
                I understand the safety guidelines and want to share my information
              </label>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  if (!selectedChat) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Messages</h2>
          <p className="text-slate-600">Connect with your matches and study groups</p>
        </div>

        <div className="grid gap-4">
          {mockChats.map((chat) => (
            <Card 
              key={chat.id}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => setSelectedChat(chat)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {chat.isGroup ? (
                      <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-slate-600" />
                      </div>
                    ) : (
                      <img
                        src={getUnsplashUrl(chat.avatar)}
                        alt={chat.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    {chat.unread > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">{chat.unread}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-slate-800 truncate">{chat.name}</h4>
                      <span className="text-xs text-slate-500">{chat.time}</span>
                    </div>
                    <p className="text-sm text-slate-600 truncate">{chat.lastMessage}</p>
                    {!chat.isGroup && (
                      <div className="flex space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">{chat.major}</Badge>
                        <Badge variant="outline" className="text-xs">{chat.dorm}</Badge>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedChat(null)}
              >
                ← Back
              </Button>
              {selectedChat.isGroup ? (
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-slate-600" />
                </div>
              ) : (
                <img
                  src={getUnsplashUrl(selectedChat.avatar)}
                  alt={selectedChat.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div>
                <h3 className="font-medium">{selectedChat.name}</h3>
                {!selectedChat.isGroup && (
                  <p className="text-sm text-slate-600">{selectedChat.major} • {selectedChat.dorm}</p>
                )}
              </div>
            </div>
            {!selectedChat.isGroup && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSocialShare(true)}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Socials
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-slate-500 mb-4">Start a conversation!</p>
              <div className="grid grid-cols-1 gap-2">
                {icebreakers.slice(0, 3).map((icebreaker, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setMessage(icebreaker)}
                    className="text-left justify-start h-auto p-3"
                  >
                    💬 {icebreaker}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>

        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <SocialShareModal contact={selectedChat} />
    </div>
  );
};

export default ChatInterface;
