import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  Send, 
  ArrowLeft, 
  Hash, 
  Mail, 
  Check, 
  X,
  Circle,
  CheckCheck
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import SchoolGroupChat from "./SchoolGroupChat";
import GuestMessageDialog from "./GuestMessageDialog";
import { mockConversations, mockMessageRequests } from "@/data/mockConversations";
import { useAppState } from "@/hooks/useAppState";

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

const EnhancedChatInterface = () => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const { isDevMode } = useAppState();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messageRequests, setMessageRequests] = useState<MessageRequest[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showRequestedChats, setShowRequestedChats] = useState(false);
  const [showSchoolGroupChat, setShowSchoolGroupChat] = useState(false);
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isGuest = !user;

  useEffect(() => {
    if (user || isDevMode) {
      if (isDevMode) {
        // Use mock data in dev mode
        setConversations(mockConversations);
        setMessageRequests(mockMessageRequests);
        setIsLoading(false);
      } else {
        loadConversations();
        loadMessageRequests();
        subscribeToRealtime();
      }
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
    if (!newMessage.trim() || !selectedConversation || !user) return;

    if (isGuest) {
      setShowGuestDialog(true);
      return;
    }

    try {
      const { error } = await supabase
        .from('private_messages')
        .insert({
          conversation_id: selectedConversation.id,
          sender_id: user.id,
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

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (isGuest) {
    return (
      <div className="max-w-4xl mx-auto pb-32">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Messages</h2>
          <p className="text-muted-foreground">Sign up to start chatting with classmates</p>
        </div>

        <Card className="bg-muted/50 border-border/60">
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Join the Conversation</h3>
            <p className="text-muted-foreground mb-4">
              Create an account to message classmates and join your school's group chat
            </p>
            <Button onClick={() => setShowGuestDialog(true)} className="neon-glow">
              Sign Up to Chat
            </Button>
          </CardContent>
        </Card>

        <GuestMessageDialog
          isOpen={showGuestDialog}
          onClose={() => setShowGuestDialog(false)}
          onCreateAccount={() => setShowGuestDialog(false)}
        />
      </div>
    );
  }

  if (selectedConversation) {
    return (
      <div className="max-w-4xl mx-auto pb-32">
        <Card className="h-[600px] flex flex-col">
          {/* Chat Header */}
          <div className="flex-shrink-0 bg-card border-b border-border px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {selectedConversation.other_user.name[0]}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium">{selectedConversation.other_user.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedConversation.other_user.major} • {selectedConversation.other_user.school}
                  </p>
                </div>
              </div>
              {selectedConversation.is_matched && (
                <Badge variant="secondary" className="text-xs">Matched</Badge>
              )}
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.sender_id === user?.id
                        ? 'bg-primary text-primary-foreground neon-glow'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <p className="text-xs opacity-70">{formatTime(message.created_at)}</p>
                      {message.sender_id === user?.id && (
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
          <div className="flex-shrink-0 p-4 border-t border-border bg-card">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="neon-glow"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-32">
      <div className="flex justify-between items-center mb-6">
        <div className="text-center flex-1">
          <h2 className="text-2xl font-bold text-foreground mb-2">Messages</h2>
          <p className="text-muted-foreground">Connect with your matches and classmates</p>
        </div>
        {/* Requested Chats Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowRequestedChats(true)}
          className="relative"
        >
          <Mail className="h-4 w-4 mr-2" />
          Requests
          {messageRequests.length > 0 && (
            <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs min-w-[20px] h-5">
              {messageRequests.length}
            </Badge>
          )}
        </Button>
      </div>

      <div className="grid gap-4">
        {/* School Group Chat - Pinned */}
        {(user && userProfile) || isDevMode ? (
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
                      {isDevMode ? "Boston University" : userProfile?.school} Group Chat
                      <Badge variant="secondary" className="text-xs">PINNED</Badge>
                    </h4>
                    <span className="text-xs text-muted-foreground">Now</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {(userProfile?.verified || isDevMode) ? `Connect with verified ${isDevMode ? "Boston University" : userProfile?.school} classmates` : "View-only until verified"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
        
        {/* Private Conversations */}
        {conversations.map((conversation) => (
          <Card 
            key={conversation.id}
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => setSelectedConversation(conversation)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {conversation.other_user.name[0]}
                    </span>
                  </div>
                  {conversation.unread_count > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">
                        {conversation.unread_count}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-foreground truncate flex items-center gap-2">
                      {conversation.other_user.name}
                      {conversation.is_matched && (
                        <Badge variant="secondary" className="text-xs">Match</Badge>
                      )}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {conversation.last_message && formatTime(conversation.last_message.sent_at)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.last_message?.content || "No messages yet"}
                  </p>
                  <div className="flex space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {conversation.other_user.major}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {conversation.other_user.school}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {conversations.length === 0 && !isLoading && (
          <Card className="bg-muted/50 border-border/60">
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
              <p className="text-muted-foreground">
                Start swiping to match with classmates and begin chatting!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Requested Chats Sheet */}
      <Sheet open={showRequestedChats} onOpenChange={setShowRequestedChats}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Message Requests</SheetTitle>
          </SheetHeader>
          <ScrollArea className="mt-6">
            <div className="space-y-4">
              {messageRequests.map((request) => (
                <Card key={request.id} className="border-border/60">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium">
                          {request.from_user.name[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{request.from_user.name}</h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {request.from_user.major} • {request.from_user.school}
                        </p>
                        <p className="text-sm text-foreground mb-3">{request.message}</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAcceptRequest(request)}
                            className="h-8 px-3 text-xs neon-glow"
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
      {showSchoolGroupChat && ((userProfile && user) || isDevMode) && (
        <SchoolGroupChat
          schoolName={isDevMode ? "Boston University" : userProfile!.school!}
          userProfile={{
            user_id: isDevMode ? "dev-user" : user!.id,
            name: isDevMode ? "Dev User" : userProfile!.name!,
            verified: isDevMode ? true : userProfile!.verified
          }}
          onClose={() => setShowSchoolGroupChat(false)}
        />
      )}
    </div>
  );
};

export default EnhancedChatInterface;