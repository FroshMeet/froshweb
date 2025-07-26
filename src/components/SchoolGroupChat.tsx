import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, Hash, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SchoolGroupChatProps {
  schoolName: string;
  userProfile: {
    user_id: string;
    name: string;
    verified: boolean;
  };
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  user_name: string;
  message: string;
  created_at: string;
}

const SchoolGroupChat = ({ schoolName, userProfile, onClose }: SchoolGroupChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [memberCount, setMemberCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [chatId, setChatId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    initializeChat();
  }, [schoolName]);

  const initializeChat = async () => {
    try {
      // Get or create school chat
      const { data: chatData, error: chatError } = await supabase
        .rpc('get_or_create_school_chat', { school_name: schoolName });

      if (chatError) throw chatError;

      setChatId(chatData);

      // Join the chat if not already a member
      await supabase
        .from('school_chat_members')
        .upsert({
          user_id: userProfile.user_id,
          school_chat_id: chatData
        }, {
          onConflict: 'user_id,school_chat_id'
        });

      // Load messages
      await loadMessages(chatData);
      await loadMemberCount(chatData);

      // Subscribe to new messages
      const channel = supabase
        .channel(`school_chat_${chatData}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'school_chat_messages',
            filter: `school_chat_id=eq.${chatData}`
          },
          (payload) => {
            setMessages(prev => [...prev, payload.new as ChatMessage]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error('Error initializing chat:', error);
      toast({
        title: "Error",
        description: "Failed to load group chat",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (chatId: string) => {
    const { data, error } = await supabase
      .from('school_chat_messages')
      .select('*')
      .eq('school_chat_id', chatId)
      .order('created_at', { ascending: true })
      .limit(50);

    if (error) throw error;
    setMessages(data || []);
  };

  const loadMemberCount = async (chatId: string) => {
    const { count, error } = await supabase
      .from('school_chat_members')
      .select('*', { count: 'exact', head: true })
      .eq('school_chat_id', chatId);

    if (error) throw error;
    setMemberCount(count || 0);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatId) return;

    try {
      const { error } = await supabase
        .from('school_chat_messages')
        .insert({
          school_chat_id: chatId,
          user_id: userProfile.user_id,
          user_name: userProfile.name || 'Anonymous',
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

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading group chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-card border-b border-border px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Hash className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold">📣 {schoolName}'s GC</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{memberCount} verified members</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                Welcome to {schoolName}'s GC! 
                <br />
                Start the conversation with your verified classmates.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium">{message.user_name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{message.user_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(message.created_at)}
                    </span>
                  </div>
                  <p className="text-sm break-words">{message.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="flex-shrink-0 p-4 border-t border-border bg-card">
        {userProfile.verified ? (
          <div className="flex gap-2">
            <Input
              placeholder={`Message the ${schoolName} group...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="neon-glow"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              Verify your {schoolName} email to send messages
            </p>
            <Button variant="outline" size="sm">
              Verify Email
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolGroupChat;