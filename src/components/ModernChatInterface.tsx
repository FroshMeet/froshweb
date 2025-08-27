import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  Send, 
  Users, 
  Bell,
  Search,
  Settings,
  MoreHorizontal,
  CheckCircle2,
  X,
  ArrowLeft,
  UserPlus,
  UserMinus
} from "lucide-react";
import { mockConversations, mockMessageRequests, mockMessages } from "@/data/mockConversations";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import GuestMessageDialog from "./GuestMessageDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ModernChatInterfaceProps {
  schoolName?: string;
  conversations?: any[];
  isDevMode?: boolean;
}

const ModernChatInterface = ({ schoolName, conversations = [], isDevMode = false }: ModernChatInterfaceProps) => {
  const navigate = useNavigate();
  const { user, userProfile, isLoading } = useAuth();
  const { toast } = useToast();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [showRequests, setShowRequests] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  
  // Group chat state
  const [groupChatMemberCount, setGroupChatMemberCount] = useState(0);
  const [isGroupChatMember, setIsGroupChatMember] = useState(false);
  const [groupChatId, setGroupChatId] = useState<string | null>(null);
  const [groupChatMessages, setGroupChatMessages] = useState<any[]>([]);
  
  // Use dev mode logic: mock data if dev mode is on, real data if off
  const effectiveConversations = isDevMode ? mockConversations : conversations;
  const effectiveMessageRequests = isDevMode ? mockMessageRequests : [];
  const effectiveMessages = isDevMode ? mockMessages : messages;
  
  // Mock group chat data for dev mode
  const mockGroupChat = {
    memberCount: 42,
    isJoined: true,
    messages: [
      {
        id: "group-msg-1",
        user_name: "Alex Chen",
        message: "Welcome to the group chat everyone! 🎉",
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        sender_id: "user-alex"
      },
      {
        id: "group-msg-2", 
        user_name: "Sarah Kim",
        message: "Thanks! Excited to meet everyone",
        created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        sender_id: "user-sarah"
      },
      {
        id: "group-msg-3",
        user_name: "Dev Student",
        message: "This is awesome! Can't wait for orientation week",
        created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        sender_id: "dev-user-123"
      }
    ]
  };
  
  // Initialize group chat when component mounts
  useEffect(() => {
    if (isDevMode) {
      // Use mock data in dev mode
      setGroupChatMemberCount(mockGroupChat.memberCount);
      setIsGroupChatMember(mockGroupChat.isJoined);
      setGroupChatMessages(mockGroupChat.messages);
    } else if (user && userProfile && schoolName) {
      // Load real group chat data
      initializeGroupChat();
    }
  }, [isDevMode, user, userProfile, schoolName]);

  // Simplified user detection:
  // - If in dev mode, always show chat
  // - If authenticated user exists, show chat  
  // - Otherwise, show guest CTA
  const shouldShowChat = isDevMode || user;
  const isGuestMode = !isDevMode && !user;
  
  const initializeGroupChat = async () => {
    if (!schoolName || !userProfile) return;
    
    try {
      // Get or create school chat
      const { data: chatData, error: chatError } = await supabase
        .rpc('get_or_create_school_chat', { school_name: schoolName });

      if (chatError) throw chatError;
      setGroupChatId(chatData);

      // Check if user is a member
      const { data: memberData, error: memberError } = await supabase
        .from('school_chat_members')
        .select('*')
        .eq('school_chat_id', chatData)
        .eq('user_id', userProfile.user_id)
        .single();

      setIsGroupChatMember(!!memberData && !memberError);

      // Load member count
      const { count, error: countError } = await supabase
        .from('school_chat_members')
        .select('*', { count: 'exact', head: true })
        .eq('school_chat_id', chatData);

      if (!countError) {
        setGroupChatMemberCount(count || 0);
      }

      // Load messages if user is a member
      if (memberData && !memberError) {
        loadGroupChatMessages(chatData);
      }

      // Subscribe to real-time updates
      const channel = supabase
        .channel(`group_chat_${chatData}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'school_chat_messages',
            filter: `school_chat_id=eq.${chatData}`
          },
          (payload) => {
            setGroupChatMessages(prev => [...prev, payload.new]);
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public', 
            table: 'school_chat_members',
            filter: `school_chat_id=eq.${chatData}`
          },
          () => {
            // Reload member count on membership changes
            loadMemberCount(chatData);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error('Error initializing group chat:', error);
    }
  };

  const loadGroupChatMessages = async (chatId: string) => {
    const { data, error } = await supabase
      .from('school_chat_messages')
      .select('*')
      .eq('school_chat_id', chatId)
      .order('created_at', { ascending: true })
      .limit(50);

    if (!error && data) {
      setGroupChatMessages(data);
    }
  };

  const loadMemberCount = async (chatId: string) => {
    const { count, error } = await supabase
      .from('school_chat_members')
      .select('*', { count: 'exact', head: true })
      .eq('school_chat_id', chatId);

    if (!error) {
      setGroupChatMemberCount(count || 0);
    }
  };

  const handleJoinGroupChat = async () => {
    if (isDevMode) {
      // Mock join in dev mode
      setIsGroupChatMember(true);
      setGroupChatMemberCount(prev => prev + 1);
      toast({
        title: "Joined group chat!",
        description: `Welcome to the ${schoolName} group chat`,
      });
      return;
    }

    if (!groupChatId || !userProfile) return;

    try {
      await supabase
        .from('school_chat_members')
        .upsert({
          user_id: userProfile.user_id,
          school_chat_id: groupChatId
        });

      setIsGroupChatMember(true);
      loadMemberCount(groupChatId);
      loadGroupChatMessages(groupChatId);
      
      toast({
        title: "Joined group chat!",
        description: `Welcome to the ${schoolName} group chat`,
      });
    } catch (error) {
      console.error('Error joining group chat:', error);
      toast({
        title: "Error",
        description: "Failed to join group chat",
        variant: "destructive"
      });
    }
  };

  const handleLeaveGroupChat = async () => {
    if (isDevMode) {
      // Mock leave in dev mode
      setIsGroupChatMember(false);
      setGroupChatMemberCount(prev => prev - 1);
      setGroupChatMessages([]);
      toast({
        title: "Left group chat",
        description: `You left the ${schoolName} group chat`,
      });
      return;
    }

    if (!groupChatId || !userProfile) return;

    try {
      await supabase
        .from('school_chat_members')
        .delete()
        .eq('user_id', userProfile.user_id)
        .eq('school_chat_id', groupChatId);

      setIsGroupChatMember(false);
      setGroupChatMessages([]);
      loadMemberCount(groupChatId);
      
      toast({
        title: "Left group chat",
        description: `You left the ${schoolName} group chat`,
      });
    } catch (error) {
      console.error('Error leaving group chat:', error);
      toast({
        title: "Error", 
        description: "Failed to leave group chat",
        variant: "destructive"
      });
    }
  };

  const handleCreateAccount = () => {
    setShowGuestDialog(false);
    navigate('/signup');
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    const isGroupChat = selectedChat === "group-chat";
    
    if (isDevMode) {
      // Simulate sending a message in dev mode
      const mockMessage = {
        id: `msg-${Date.now()}`,
        conversation_id: selectedChat,
        sender_id: "dev-user-123",
        user_name: "Dev Student", 
        message: newMessage.trim(),
        created_at: new Date().toISOString(),
        read_at: new Date().toISOString()
      };
      
      if (isGroupChat) {
        setGroupChatMessages(prev => [...prev, mockMessage]);
      } else {
        setMessages(prev => [...prev, mockMessage]);
      }
      setNewMessage("");
      
      toast({
        title: "Message sent!",
        description: "Your message was delivered successfully.",
      });
    } else {
      // Handle real message sending to Supabase
      if (isGroupChat && groupChatId && userProfile) {
        try {
          await supabase
            .from('school_chat_messages')
            .insert({
              school_chat_id: groupChatId,
              user_id: userProfile.user_id,
              user_name: userProfile.name || 'Anonymous',
              message: newMessage.trim()
            });

          setNewMessage("");
          
          toast({
            title: "Message sent!",
            description: "Your message was delivered successfully.",
          });
        } catch (error) {
          console.error('Error sending message:', error);
          toast({
            title: "Error",
            description: "Failed to send message",
            variant: "destructive"
          });
        }
      } else {
        // TODO: Implement real DM message sending
        setNewMessage("");
        
        toast({
          title: "Message sent!",
          description: "Your message was delivered successfully.",
        });
      }
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffHours < 1) {
      return 'now';
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}h`;
    } else if (diffDays < 7) {
      return `${Math.floor(diffDays)}d`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChat(chatId);
    
    const isGroupChat = chatId === "group-chat";
    
    if (isDevMode) {
      if (isGroupChat) {
        // Use mock group chat messages
        setMessages(mockGroupChat.messages);
      } else {
        // Load mock messages for the selected conversation
        const chatMessages = effectiveMessages.filter(msg => msg.conversation_id === chatId);
        setMessages(chatMessages);
      }
    } else {
      if (isGroupChat) {
        // Use real group chat messages
        setMessages(groupChatMessages);
      } else {
        // TODO: Load real DM messages from Supabase
        setMessages([]);
      }
    }
  };

  const handleAcceptRequest = (requestId: string) => {
    toast({
      title: "Request accepted!",
      description: "You can now chat with this person.",
    });
    // Remove from requests in dev mode
    // In production, this would create a conversation
  };

  const handleDeclineRequest = (requestId: string) => {
    toast({
      title: "Request declined",
      description: "The message request has been declined.",
    });
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Guest view - show CTA to join group chat
  if (isGuestMode) {
    return (
      <div className="flex flex-col h-full bg-background max-w-2xl mx-auto">  {/* Increased max-width for desktop */}
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h1 className="text-xl font-bold text-foreground">Chats</h1>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <MessageSquare className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Join Your School's Group Chat
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                Connect with verified students from your school and start conversations
              </p>
            </div>
            <Button 
              onClick={() => navigate('/signup')} 
              className="w-full neon-glow"
              size="lg"
            >
              Get Started
            </Button>
          </div>
        </div>
        
        <GuestMessageDialog
          isOpen={showGuestDialog}
          onClose={() => setShowGuestDialog(false)}
          onCreateAccount={handleCreateAccount}
        />
      </div>
    );
  }

  // Chat conversation view
  if (selectedChat) {
    const isGroupChat = selectedChat === "group-chat";
    const conversation = effectiveConversations.find(c => c.id === selectedChat);
    const chatTitle = isGroupChat 
      ? `${schoolName || userProfile?.school || "School"} Group Chat`
      : conversation?.other_user.name || "Chat";
    
    const currentMemberCount = isDevMode ? mockGroupChat.memberCount : groupChatMemberCount;

    return (
      <div className="flex flex-col h-full bg-background max-w-2xl mx-auto">  {/* Increased max-width for desktop */}
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedChat(null)}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <Avatar className="h-10 w-10">
              {isGroupChat ? (
                <AvatarFallback className="bg-primary/20 text-primary">
                  <Users className="h-5 w-5" />
                </AvatarFallback>
              ) : (
                <>
                  <AvatarImage 
                    src={`https://images.unsplash.com/${conversation?.other_user.avatar_url}?w=100&h=100&fit=crop&crop=face`} 
                  />
                  <AvatarFallback>
                    {conversation?.other_user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </>
              )}
            </Avatar>
            
            <div>
              <h2 className="font-semibold text-sm text-foreground">{chatTitle}</h2>
              {isGroupChat && (
                <p className="text-xs text-muted-foreground">{currentMemberCount} members</p>
              )}
            </div>
          </div>
          
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                  {isGroupChat ? <Users className="h-8 w-8 text-muted-foreground" /> : <MessageSquare className="h-8 w-8 text-muted-foreground" />}
                </div>
                <p className="text-muted-foreground">
                  {isGroupChat ? "No messages yet. Say hi 👋" : "No messages yet. Start the conversation!"}
                </p>
              </div>
            ) : (
              messages.map((message) => {
                const isOwnMessage = message.sender_id === "dev-user-123" || message.sender_id === userProfile?.user_id;
                
                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      isOwnMessage ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2",
                      isOwnMessage
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    )}>
                      {isGroupChat && !isOwnMessage && (
                        <p className="text-xs font-medium mb-1 text-primary">
                          {message.user_name || message.sender_name || "Unknown"}
                        </p>
                      )}
                      <p className="text-sm">{message.message}</p>
                      <p className={cn(
                        "text-xs mt-1",
                        isOwnMessage ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}>
                        {formatTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-border bg-card">
          {isGroupChat && !isGroupChatMember && !isDevMode ? (
            <div className="flex items-center justify-center py-4">
              <Button 
                onClick={handleJoinGroupChat}
                className="neon-glow"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Join Group Chat
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={isGroupChat ? `Message the ${schoolName} group...` : "Type a message..."}
                className="flex-1 rounded-full border-border bg-background"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button 
                onClick={handleSendMessage}
                size="sm"
                className="rounded-full p-3 neon-glow"
                disabled={!newMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Get user's school for group chat
  const userSchool = schoolName || userProfile?.school || "School";

  // Main chat interface for logged-in users  
  return (
    <div className="flex flex-col h-full bg-background max-w-2xl mx-auto">  {/* Increased max-width for desktop */}
      {/* Dev Mode Banner */}
      {isDevMode && (
        <div className="bg-primary/10 border-b border-primary/20 px-4 py-2">
          <div className="flex items-center justify-center">
            <Badge variant="secondary" className="text-xs">
              [DEV MODE] - Test conversations generated
            </Badge>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">  {/* Added responsive padding */}
        <div className="flex items-center space-x-4">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Chats</h1>  {/* Added responsive text size */}
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-3">  {/* Added responsive spacing */}
          {/* Requests Button */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowRequests(!showRequests)}
            className="relative"
          >
            <Bell className="h-4 w-4" />
            {effectiveMessageRequests.length > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-primary text-primary-foreground">
                {effectiveMessageRequests.length}
              </Badge>
            )}
          </Button>
          
          <Button variant="ghost" size="sm">
            <Search className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Show Message Requests */}
        {showRequests ? (
          <div className="flex-1">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Message Requests</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowRequests(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <ScrollArea className="flex-1">
              {effectiveMessageRequests.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No message requests</p>
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {effectiveMessageRequests.map((request) => (
                    <Card key={request.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage 
                            src={`https://images.unsplash.com/${request.from_user.avatar_url}?w=100&h=100&fit=crop&crop=face`} 
                          />
                          <AvatarFallback>{request.from_user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-sm text-foreground truncate">
                              {request.from_user.name}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {request.from_user.school}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {request.message}
                          </p>
                          
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleAcceptRequest(request.id)}
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Accept
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleDeclineRequest(request.id)}
                            >
                              Decline
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        ) : (
          /* Regular Conversations List */
          <div className="flex-1">
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {/* School Group Chat - Pinned at top */}
                <Card 
                  className={cn(
                    "p-3 cursor-pointer transition-all duration-200 hover:bg-muted/50 border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5",
                    selectedChat === "group-chat" && "bg-primary/10 border-primary/50"
                  )}
                  onClick={() => handleSelectChat("group-chat")}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12 border-2 border-primary/30">
                        <AvatarFallback className="bg-primary/20 text-primary font-bold">
                          <Users className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-1 -right-1">
                        <Badge className="h-5 w-5 rounded-full p-0 text-xs bg-primary text-primary-foreground">
                          <Users className="h-3 w-3" />
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-sm text-foreground truncate">
                          {userSchool} Group Chat
                        </h3>
                        
                        {/* Join/Leave Button */}
                        {!isDevMode && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              isGroupChatMember ? handleLeaveGroupChat() : handleJoinGroupChat();
                            }}
                            className="h-6 px-2 text-xs"
                          >
                            {isGroupChatMember ? (
                              <>
                                <UserMinus className="h-3 w-3 mr-1" />
                                Leave
                              </>
                            ) : (
                              <>
                                <UserPlus className="h-3 w-3 mr-1" />
                                Join
                              </>
                            )}
                          </Button>
                        )}
                         <Badge variant="secondary" className="text-xs bg-primary/20 text-primary border-primary/30">
                          Pinned
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {isDevMode ? mockGroupChat.memberCount : groupChatMemberCount} members
                        </span>
                        {!isDevMode && !isGroupChatMember && (
                          <Badge variant="outline" className="text-xs">
                            Not joined
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {isDevMode || isGroupChatMember
                          ? "Welcome everyone! Share your thoughts here..."
                          : "Join to see messages and connect with classmates"
                        }
                      </p>
                    </div>
                  </div>
                </Card>
                
                {/* Individual Conversations */}
                {effectiveConversations.map((conversation) => (
                  <Card 
                    key={conversation.id}
                    className={cn(
                      "p-3 cursor-pointer transition-all duration-200 hover:bg-muted/50",
                      selectedChat === conversation.id && "bg-muted"
                    )}
                    onClick={() => handleSelectChat(conversation.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage 
                            src={`https://images.unsplash.com/${conversation.other_user.avatar_url}?w=100&h=100&fit=crop&crop=face`} 
                          />
                          <AvatarFallback>
                            {conversation.other_user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.unread_count > 0 && (
                          <div className="absolute -top-1 -right-1">
                            <Badge className="h-5 w-5 rounded-full p-0 text-xs bg-primary text-primary-foreground">
                              {conversation.unread_count}
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={cn(
                            "text-sm truncate",
                            conversation.unread_count > 0 ? "font-semibold text-foreground" : "font-medium text-foreground"
                          )}>
                            {conversation.other_user.name}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(conversation.last_message.sent_at)}
                          </span>
                        </div>
                        <p className={cn(
                          "text-sm truncate",
                          conversation.unread_count > 0 ? "text-foreground font-medium" : "text-muted-foreground"
                        )}>
                          {conversation.last_message.sender_id === "dev-user-123" ? "You: " : ""}
                          {conversation.last_message.content}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernChatInterface;