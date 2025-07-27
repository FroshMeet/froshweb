import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  Send, 
  ArrowLeft, 
  Hash, 
  Mail, 
  Check, 
  X,
  CheckCheck,
  Users,
  MoreHorizontal
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useAppState } from "@/hooks/useAppState";
import SchoolGroupChat from "./SchoolGroupChat";
import GuestMessageDialog from "./GuestMessageDialog";
import { mockConversations, mockMessageRequests, mockMessages } from "@/data/mockConversations";

interface Conversation {
  id: string;
  other_user: {
    id: string;
    name: string;
    avatar_url?: string;
    school?: string;
    major?: string;
  };
  last_message?: {
    content: string;
    sent_at: string;
    sender_id: string;
    read_at?: string;
  };
  unread_count: number;
  is_matched: boolean;
}

interface MessageRequest {
  id: string;
  from_user: {
    id: string;
    name: string;
    avatar_url?: string;
    school?: string;
    major?: string;
  };
  message: string;
  created_at: string;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  read_at?: string;
}

const ModernChatInterface = () => {
  const { user, userProfile } = useAuth();
  const { isDevMode, currentUser } = useAppState();
  const { toast } = useToast();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messageRequests, setMessageRequests] = useState<MessageRequest[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showRequestedChats, setShowRequestedChats] = useState(false);
  const [showSchoolGroupChat, setShowSchoolGroupChat] = useState(false);
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isGuest = !user && !isDevMode;

  useEffect(() => {
    if (user) {
      loadConversations();
      loadMessageRequests();
      subscribeToRealtime();
    } else if (isDevMode) {
      // Load mock data in dev mode
      setConversations(mockConversations);
      setMessageRequests(mockMessageRequests);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [user, isDevMode]);

  const loadConversations = async () => {
    if (!user) return;

    try {
      // Load conversations with last message and unread count
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          user1_id,
          user2_id,
          match_id,
          last_message_at,
          user_profiles!conversations_user1_id_fkey(id, name, avatar_url, school, major),
          user_profiles!conversations_user2_id_fkey(id, name, avatar_url, school, major)
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      // Transform data to include other user info
      const transformedConversations: Conversation[] = await Promise.all(
        (data || []).map(async (conv) => {
          const otherUserId = conv.user1_id === user.id ? conv.user2_id : conv.user1_id;
          const otherUserProfile = conv.user1_id === user.id 
            ? (conv as any).user_profiles?.find((p: any) => p?.id !== user.id)
            : (conv as any).user_profiles?.find((p: any) => p?.id === user.id);

          // Get last message
          const { data: lastMessage } = await supabase
            .from('private_messages')
            .select('message, created_at, sender_id, read_at')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Get unread count
          const { count: unreadCount } = await supabase
            .from('private_messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .neq('sender_id', user.id)
            .is('read_at', null);

          return {
            id: conv.id,
            other_user: {
              id: otherUserId,
              name: otherUserProfile?.name || 'Unknown User',
              avatar_url: otherUserProfile?.avatar_url,
              school: otherUserProfile?.school,
              major: otherUserProfile?.major,
            },
            last_message: lastMessage ? {
              content: lastMessage.message,
              sent_at: lastMessage.created_at,
              sender_id: lastMessage.sender_id,
              read_at: lastMessage.read_at
            } : undefined,
            unread_count: unreadCount || 0,
            is_matched: !!conv.match_id
          };
        })
      );

      setConversations(transformedConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessageRequests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('message_requests')
        .select(`
          id,
          message,
          created_at,
          from_user_id,
          user_profiles!message_requests_from_user_id_fkey(id, name, avatar_url, school, major)
        `)
        .eq('to_user_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedRequests: MessageRequest[] = (data || []).map(req => ({
        id: req.id,
        message: req.message,
        created_at: req.created_at,
        from_user: {
          id: req.from_user_id,
          name: (req as any).user_profiles?.[0]?.name || 'Unknown User',
          avatar_url: (req as any).user_profiles?.[0]?.avatar_url,
          school: (req as any).user_profiles?.[0]?.school,
          major: (req as any).user_profiles?.[0]?.major,
        }
      }));

      setMessageRequests(transformedRequests);
    } catch (error) {
      console.error('Error loading message requests:', error);
    }
  };

  const subscribeToRealtime = () => {
    if (!user) return;

    // Subscribe to new messages
    const messagesChannel = supabase
      .channel('private_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'private_messages'
        },
        (payload) => {
          const newMessage = payload.new as Message;
          if (selectedConversation?.id === newMessage.conversation_id) {
            setMessages(prev => [...prev, newMessage]);
          }
          loadConversations(); // Refresh conversation list
        }
      )
      .subscribe();

    // Subscribe to message requests
    const requestsChannel = supabase
      .channel('message_requests')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'message_requests'
        },
        () => {
          loadMessageRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(requestsChannel);
    };
  };

  const handleAcceptRequest = async (request: MessageRequest) => {
    if (isDevMode && !user) {
      console.log("🧪 Dev Mode: Accepting request from", request.from_user.name);
      setMessageRequests(prev => prev.filter(req => req.id !== request.id));
      return;
    }

    try {
      // Update request status
      const { error: updateError } = await supabase
        .from('message_requests')
        .update({ status: 'accepted' })
        .eq('id', request.id);

      if (updateError) throw updateError;

      // Create conversation
      const user1_id = request.from_user.id < user!.id ? request.from_user.id : user!.id;
      const user2_id = request.from_user.id < user!.id ? user!.id : request.from_user.id;

      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          user1_id,
          user2_id,
          status: 'active'
        })
        .select()
        .single();

      if (convError) throw convError;

      // Create first message
      await supabase
        .from('private_messages')
        .insert({
          conversation_id: conversation.id,
          sender_id: request.from_user.id,
          message: request.message
        });

      toast({
        title: "Request Accepted",
        description: `You can now chat with ${request.from_user.name}`,
      });

      loadConversations();
      loadMessageRequests();
    } catch (error) {
      console.error('Error accepting request:', error);
      toast({
        title: "Error",
        description: "Failed to accept message request",
        variant: "destructive"
      });
    }
  };

  const handleIgnoreRequest = async (requestId: string) => {
    if (isDevMode && !user) {
      console.log("🧪 Dev Mode: Ignoring request", requestId);
      setMessageRequests(prev => prev.filter(req => req.id !== requestId));
      return;
    }

    try {
      const { error } = await supabase
        .from('message_requests')
        .update({ status: 'ignored' })
        .eq('id', requestId);

      if (error) throw error;

      setMessageRequests(prev => prev.filter(req => req.id !== requestId));
      
      toast({
        title: "Request Ignored",
        description: "Message request has been ignored",
      });
    } catch (error) {
      console.error('Error ignoring request:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    if (isGuest) {
      setShowGuestDialog(true);
      return;
    }

    if (isDevMode && !user) {
      console.log("🧪 Dev Mode: Sending message:", newMessage);
      const mockMessage: Message = {
        id: `mock-msg-${Date.now()}`,
        conversation_id: selectedConversation.id,
        sender_id: "dev-user-123",
        message: newMessage.trim(),
        created_at: new Date().toISOString(),
        read_at: undefined
      };
      setMessages(prev => [...prev, mockMessage]);
      setNewMessage("");
      return;
    }

    try {
      const { error } = await supabase
        .from('private_messages')
        .insert({
          conversation_id: selectedConversation.id,
          sender_id: user!.id,
          message: newMessage.trim()
        });

      if (error) throw error;

      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    
    if (isDevMode && !user) {
      // Load mock messages for this conversation
      const convMessages = mockMessages.filter(msg => msg.conversation_id === conversation.id);
      setMessages(convMessages);
      return;
    }

    // Load real messages
    loadMessagesForConversation(conversation.id);
  };

  const loadMessagesForConversation = async (conversationId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('private_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = Math.abs(now.getTime() - messageTime.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return messageTime.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 24) {
      return messageTime.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return messageTime.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getUnsplashUrl = (photoId: string, width = 400, height = 400) => {
    return `https://images.unsplash.com/${photoId}?w=${width}&h=${height}&fit=crop&crop=face`;
  };

  // Guest view
  if (isGuest) {
    return (
      <div className="flex flex-col h-full max-w-md mx-auto bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">Chats</h1>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-20 h-20 rounded-full bg-froshmeet-blue/10 flex items-center justify-center mb-6">
            <MessageSquare className="h-10 w-10 text-froshmeet-blue" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Join Group Chat
          </h2>
          <p className="text-muted-foreground text-center mb-6 text-sm leading-relaxed">
            Connect with verified students from your school and start conversations
          </p>
          <Button 
            onClick={() => setShowGuestDialog(true)} 
            className="w-full bg-froshmeet-blue hover:bg-froshmeet-blue/90 text-white font-medium h-12 rounded-xl"
          >
            Get Started
          </Button>
        </div>

        <GuestMessageDialog
          isOpen={showGuestDialog}
          onClose={() => setShowGuestDialog(false)}
          onCreateAccount={() => setShowGuestDialog(false)}
        />
      </div>
    );
  }

  // Chat conversation view
  if (selectedConversation) {
    return (
      <div className="flex flex-col h-full max-w-md mx-auto bg-background">
        {/* Chat Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedConversation(null)}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarImage 
                  src={selectedConversation.other_user.avatar_url ? 
                    getUnsplashUrl(selectedConversation.other_user.avatar_url, 80, 80) : 
                    undefined
                  } 
                />
                <AvatarFallback className="bg-muted text-foreground">
                  {selectedConversation.other_user.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">
                  {selectedConversation.other_user.name}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {selectedConversation.other_user.major} • {selectedConversation.other_user.school}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="p-2">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === (user?.id || "dev-user-123") ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                    message.sender_id === (user?.id || "dev-user-123")
                      ? 'bg-froshmeet-blue text-white rounded-br-md'
                      : 'bg-muted text-foreground rounded-bl-md'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.message}</p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <p className="text-xs opacity-70">{formatTime(message.created_at)}</p>
                    {message.sender_id === (user?.id || "dev-user-123") && (
                      message.read_at ? (
                        <CheckCheck className="h-3 w-3 opacity-70" />
                      ) : (
                        <Check className="h-3 w-3 opacity-70" />
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="sticky bottom-0 bg-background border-t border-border/50 p-4">
          <div className="flex items-center space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-muted border-0 rounded-full h-10 px-4"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-froshmeet-blue hover:bg-froshmeet-blue/90 text-white rounded-full h-10 w-10 p-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main chat list view
  return (
    <div className="flex flex-col h-full max-w-md mx-auto bg-background">
      {/* Dev Mode Banner */}
      {isDevMode && !user && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2">
          <p className="text-xs text-yellow-600 text-center font-medium">
            [DEV MODE] • Test conversations loaded
          </p>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Chats</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowRequestedChats(true)}
            className="relative p-2"
          >
            <Mail className="h-5 w-5" />
            {messageRequests.length > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">
                  {messageRequests.length}
                </span>
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* Pinned School Group Chat */}
          {(userProfile?.verified || (isDevMode && !user)) && (
            <div className="mb-2">
              <Card 
                className="cursor-pointer hover:bg-muted/50 transition-colors duration-200 border-froshmeet-blue/20 bg-froshmeet-blue/5"
                onClick={() => setShowSchoolGroupChat(true)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-froshmeet-blue/20 flex items-center justify-center">
                      <Hash className="h-6 w-6 text-froshmeet-blue" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-foreground">
                            {userProfile?.school || "UCLA"} Group Chat
                          </h4>
                          <Badge variant="secondary" className="text-xs bg-froshmeet-blue/10 text-froshmeet-blue">
                            PINNED
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">now</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Connect with verified classmates
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Private Conversations */}
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <Card 
                key={conversation.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors duration-200 border-0 shadow-none"
                onClick={() => handleSelectConversation(conversation)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage 
                          src={conversation.other_user.avatar_url ? 
                            getUnsplashUrl(conversation.other_user.avatar_url, 96, 96) : 
                            undefined
                          } 
                        />
                        <AvatarFallback className="bg-muted text-foreground">
                          {conversation.other_user.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.unread_count > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-froshmeet-blue rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-bold">
                            {conversation.unread_count}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-foreground truncate">
                            {conversation.other_user.name}
                          </h4>
                          {conversation.is_matched && (
                            <Badge variant="secondary" className="text-xs bg-pink-100 text-pink-700">
                              Match
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {conversation.last_message && formatTime(conversation.last_message.sent_at)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mb-1">
                        {conversation.last_message?.content || "No messages yet"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {conversation.other_user.major} • {conversation.other_user.school}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {conversations.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
              <p className="text-muted-foreground text-sm">
                Start swiping to match with classmates and begin chatting!
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Message Requests Sheet */}
      <Sheet open={showRequestedChats} onOpenChange={setShowRequestedChats}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Message Requests</SheetTitle>
          </SheetHeader>
          <ScrollArea className="mt-6 h-full">
            <div className="space-y-4">
              {messageRequests.map((request) => (
                <Card key={request.id} className="border-border/60">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage 
                          src={request.from_user.avatar_url ? 
                            getUnsplashUrl(request.from_user.avatar_url, 80, 80) : 
                            undefined
                          } 
                        />
                        <AvatarFallback className="bg-muted text-foreground">
                          {request.from_user.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm">{request.from_user.name}</h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {request.from_user.major} • {request.from_user.school}
                        </p>
                        <p className="text-sm text-foreground mb-3 leading-relaxed">{request.message}</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAcceptRequest(request)}
                            className="h-8 px-3 text-xs bg-froshmeet-blue hover:bg-froshmeet-blue/90 text-white"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleIgnoreRequest(request.id)}
                            className="h-8 px-3 text-xs"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Ignore
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {messageRequests.length === 0 && (
                <div className="text-center py-8">
                  <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No message requests</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* School Group Chat */}
      {showSchoolGroupChat && (userProfile || (isDevMode && !user)) && (
        <SchoolGroupChat
          schoolName={userProfile?.school || "UCLA"}
          userProfile={{
            user_id: user?.id || "dev-user-123",
            name: userProfile?.name || "Dev Student",
            verified: userProfile?.verified || true
          }}
          onClose={() => setShowSchoolGroupChat(false)}
        />
      )}
    </div>
  );
};

export default ModernChatInterface;