
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MessageSquare, Send, Share2, AlertTriangle, Instagram, Phone, Users, ArrowLeft, Hash, Mail } from "lucide-react";
import IncomingRequests from "./IncomingRequests";
import SchoolChatPopup from "./SchoolChatPopup";
import VerificationModal from "./VerificationModal";
import SchoolGroupChat from "./SchoolGroupChat";
import SchoolGroupChatCTA from "./SchoolGroupChatCTA";
import GuestMessageDialog from "./GuestMessageDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAppState } from "@/hooks/useAppState";

const ChatInterface = () => {
  const { currentUser, isGuest, guestSchool, handleGuestAction, handleCreateAccount } = useAppState();
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [showSocialShare, setShowSocialShare] = useState(false);
  const [agreedToWarning, setAgreedToWarning] = useState(false);
  const [showSchoolChatPopup, setShowSchoolChatPopup] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showSchoolGroupChat, setShowSchoolGroupChat] = useState(false);
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [hasSeenPopup, setHasSeenPopup] = useState(false);
  const { toast } = useToast();
  const [incomingRequests, setIncomingRequests] = useState([
    {
      id: 1,
      name: "Jordan Smith",
      message: "Hey! 👋",
      avatar: "photo-1507003211169-0a1dd7228f2d",
      major: "Engineering",
      dorm: "East Campus"
    },
    {
      id: 2,
      name: "Emma Wilson",
      message: "Where are you from?",
      avatar: "photo-1494790108755-2616b612b47c",
      major: "Psychology",
      dorm: "West Hall"
    }
  ]);

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
    }
  ];

  const mockMessages = [
    {
      id: 1,
      text: "Hey! I saw we're both in CS 101",
      sender: "them",
      time: "2m ago"
    },
    {
      id: 2,
      text: "Yeah! Are you finding it challenging?",
      sender: "me",
      time: "1m ago"
    }
  ];

  // Get user profile from app state
  const userProfile = currentUser ? {
    user_id: currentUser.id,
    school: currentUser.college,
    name: currentUser.name,
    verified: true // Assume dev user is verified
  } : null;

  useEffect(() => {
    // Don't auto-open group chat, just ensure it's available for verified users
    if (userProfile?.verified) {
      setHasSeenPopup(true);
    }
  }, [userProfile]);

  const handleJoinSchoolChat = () => {
    setShowSchoolChatPopup(false);
    setShowSchoolGroupChat(true);
  };

  const handleStartVerification = () => {
    setShowVerificationModal(false);
    // In real app, this would navigate to verification flow
    toast({
      title: "Verification Started",
      description: "Check your email for verification instructions"
    });
  };

  const handleVerifyFromPopup = () => {
    setShowSchoolChatPopup(false);
    setShowVerificationModal(true);
  };

  const getUnsplashUrl = (photoId) => {
    return `https://images.unsplash.com/${photoId}?w=100&h=100&fit=crop&crop=face`;
  };

  const handleAcceptRequest = (request) => {
    setIncomingRequests(prev => prev.filter(r => r.id !== request.id));
    console.log("Accepted request from:", request.name);
  };

  const handleRejectRequest = (requestId) => {
    setIncomingRequests(prev => prev.filter(r => r.id !== requestId));
    console.log("Rejected request:", requestId);
  };

  const handleSendMessage = () => {
    if (isGuest) {
      handleGuestAction();
      return;
    }
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleGuestJoinChat = () => {
    setShowGuestDialog(true);
  };

  const SocialShareModal = ({ contact }) => (
    <Sheet open={showSocialShare} onOpenChange={setShowSocialShare}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Share Your Socials</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 mt-6">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <h4 className="font-medium text-destructive">Safety First!</h4>
                <p className="text-sm text-destructive/80 mt-1">
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

  // Guest view - show school group chat CTA
  if (isGuest) {
    return (
      <div className="max-w-4xl mx-auto pb-32">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Messages</h2>
          <p className="text-muted-foreground">Connect with your matches and study groups</p>
        </div>

        <SchoolGroupChatCTA 
          schoolSlug={guestSchool}
          onJoinClick={handleGuestJoinChat}
        />

        <GuestMessageDialog
          isOpen={showGuestDialog}
          onClose={() => setShowGuestDialog(false)}
          onCreateAccount={handleCreateAccount}
        />
      </div>
    );
  }

  const [showRequestedChats, setShowRequestedChats] = useState(false);

  if (!selectedChat) {
    return (
      <div className="max-w-4xl mx-auto pb-32">
        <div className="flex justify-between items-center mb-6">
          <div className="text-center flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-2">Messages</h2>
            <p className="text-muted-foreground">Connect with your matches and study groups</p>
          </div>
          {/* Requested Chats Icon - Top Right */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRequestedChats(true)}
            className="relative"
          >
            <Mail className="h-4 w-4 mr-2" />
            Requests
            {incomingRequests.length > 0 && (
              <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs min-w-[20px] h-5">
                {incomingRequests.length}
              </Badge>
            )}
          </Button>
        </div>

        <div className="grid gap-4">
          {/* School Group Chat - Pinned at top for logged in users */}
          {userProfile?.verified && (
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-primary/50 bg-primary/5"
              onClick={() => setShowSchoolGroupChat(true)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Hash className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-foreground flex items-center gap-2">
                        {userProfile.school} Group Chat
                        <Badge variant="secondary" className="text-xs">PINNED</Badge>
                      </h4>
                      <span className="text-xs text-muted-foreground">Now</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Connect with verified {userProfile.school} classmates</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Regular conversations */}
          {mockChats.map((chat) => (
            <Card 
              key={chat.id}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => setSelectedChat(chat)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={getUnsplashUrl(chat.avatar)}
                      alt={chat.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {chat.unread > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">{chat.unread}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-foreground truncate">{chat.name}</h4>
                      <span className="text-xs text-muted-foreground">{chat.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                    <div className="flex space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">{chat.major}</Badge>
                      <Badge variant="outline" className="text-xs">{chat.dorm}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Requested Chats Sheet */}
        <Sheet open={showRequestedChats} onOpenChange={setShowRequestedChats}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Requested Chats</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <IncomingRequests 
                requests={incomingRequests}
                onAccept={handleAcceptRequest}
                onReject={handleRejectRequest}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-32">
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedChat(null)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <img
                src={getUnsplashUrl(selectedChat.avatar)}
                alt={selectedChat.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium">{selectedChat.name}</h3>
                <p className="text-sm text-slate-600">{selectedChat.major} • {selectedChat.dorm}</p>
              </div>
            </div>
            {/* Desktop Share Socials Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSocialShare(true)}
              className="hidden md:flex"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Socials
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {mockMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === 'me'
                      ? 'bg-primary text-primary-foreground neon-glow'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        <div className="border-t p-4 space-y-3">
          {/* Mobile Share Socials Button - Above text input */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSocialShare(true)}
            className="md:hidden w-full"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Socials
          </Button>
          
          {/* Message Input */}
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
      
      {/* School Group Chat Popup */}
      {showSchoolChatPopup && userProfile && (
        <SchoolChatPopup
          schoolName={userProfile.school}
          isVerified={userProfile.verified}
          onJoinChat={handleJoinSchoolChat}
          onVerify={handleVerifyFromPopup}
          onDismiss={() => setShowSchoolChatPopup(false)}
        />
      )}

      {/* Verification Modal */}
      {showVerificationModal && userProfile && (
        <VerificationModal
          isOpen={showVerificationModal}
          onClose={() => setShowVerificationModal(false)}
          schoolName={userProfile.school}
          onStartVerification={handleStartVerification}
        />
      )}

      {/* School Group Chat Interface */}
      {showSchoolGroupChat && userProfile && (
        <SchoolGroupChat
          schoolName={userProfile.school}
          userProfile={userProfile}
          onClose={() => setShowSchoolGroupChat(false)}
        />
      )}
    </div>
  );
};

export default ChatInterface;
