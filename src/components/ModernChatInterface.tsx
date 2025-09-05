import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Send, Users, MessageSquare, ArrowLeft, Plus, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAppState } from "@/hooks/useAppState";
import { validateMessage } from "@/utils/security";

interface ModernChatInterfaceProps {
  schoolName?: string;
  schoolSlug?: string;
  conversations?: any[];
  isDevMode?: boolean;
  onStartDM?: (otherUserId: string) => void;
}

interface ChatMessage {
  id: string;
  sender_name: string;
  message: string;
  timestamp: string;
  is_own?: boolean;
  sender_id?: string;
}

interface GroupChatSummary {
  conversation_id: string;
  title: string;
  member_count: number;
  is_member: boolean;
}

interface Conversation {
  conversation_id: string;
  title: string;
  type: string;
  last_message_at: string;
  last_message_text: string;
  unread_count: number;
}

const ModernChatInterface = ({ 
  schoolName, 
  schoolSlug, 
  conversations = [], 
  isDevMode = false,
  onStartDM 
}: ModernChatInterfaceProps) => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [selectedConversationType, setSelectedConversationType] = useState<'dm' | 'group' | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showGroupChat, setShowGroupChat] = useState(false);
  const [groupChatMessages, setGroupChatMessages] = useState<ChatMessage[]>([]);
  const [groupChatSummary, setGroupChatSummary] = useState<GroupChatSummary | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [loadingGroupChat, setLoadingGroupChat] = useState(false);
  const [realConversations, setRealConversations] = useState<Conversation[]>([]);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { currentUser } = useAppState();

  // Mock group chat data for dev mode
  const mockGroupChat = {
    conversation_id: "mock_group",
    title: `${schoolName} Group Chat`,
    member_count: 47,
    is_member: true
  };

  // Mock messages for dev mode
  const mockGroupMessages: ChatMessage[] = [
    {
      id: "1",
      sender_name: "Alex Johnson",
      message: "Hey everyone! Anyone know what time the library closes today?",
      timestamp: "2:30 PM",
      is_own: false
    },
    {
      id: "2", 
      sender_name: "Sam Chen",
      message: "I think it's 11 PM on weekdays. You can check their website to be sure!",
      timestamp: "2:32 PM",
      is_own: false
    },
    {
      id: "3",
      sender_name: "Jordan Taylor",
      message: "Perfect, thanks! Working on my econ paper.",
      timestamp: "2:35 PM", 
      is_own: true
    }
  ];

  const mockConversationMessages: { [key: string]: ChatMessage[] } = {
    "conv_1": [
      {
        id: "1",
        sender_name: "Emma Wilson",
        message: "Hey! Are you free to study for the midterm tomorrow?",
        timestamp: "1:45 PM",
        is_own: false
      },
      {
        id: "2",
        sender_name: "You",
        message: "Yes! Want to meet at the library around 3?",
        timestamp: "1:47 PM",
        is_own: true
      }
    ]
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, groupChatMessages]);

  // Load conversations and group chat summary
  useEffect(() => {
    const loadData = async () => {
      if (isDevMode) {
        setGroupChatSummary(mockGroupChat);
        return;
      }
      
      if (!currentUser || !schoolSlug) return;

      try {
        // Load group chat summary
        const { data: groupData, error: groupError } = await supabase.rpc('get_school_group_chat_summary', {
          school_slug_param: schoolSlug,
          user_id_param: currentUser.id
        });

        if (groupError) throw groupError;
        setGroupChatSummary(groupData?.[0] || null);

        // Load user's conversations
        const { data: convData, error: convError } = await supabase.rpc('list_school_conversations', {
          school_slug_param: schoolSlug,
          user_id_param: currentUser.id,
          limit_count: 20
        });

        if (convError) throw convError;
        setRealConversations(convData || []);
      } catch (error) {
        console.error('Error loading chat data:', error);
      }
    };

    loadData();
  }, [isDevMode, currentUser, schoolSlug, schoolName]);

  // Set up realtime subscriptions
  useEffect(() => {
    if (isDevMode || !currentUser || !schoolSlug) return;

    const channel = supabase
      .channel('school_chat_updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'school_messages'
        },
        (payload) => {
          const newMessage = payload.new as any;
          if (newMessage.conversation_id === selectedConversation || 
              (showGroupChat && newMessage.conversation_id === groupChatSummary?.conversation_id)) {
            
            const formattedMessage: ChatMessage = {
              id: newMessage.id,
              sender_name: newMessage.sender_name || 'User',
              message: newMessage.content_text,
              timestamp: new Date(newMessage.created_at).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              }),
              is_own: newMessage.sender_id === currentUser.id,
              sender_id: newMessage.sender_id
            };

            if (showGroupChat) {
              setGroupChatMessages(prev => [...prev, formattedMessage]);
            } else {
              setMessages(prev => [...prev, formattedMessage]);
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'school_conversations'
        },
        () => {
          // Refresh conversations list when last_message_at updates
          if (!isDevMode && currentUser && schoolSlug) {
            supabase.rpc('list_school_conversations', {
              school_slug_param: schoolSlug,
              user_id_param: currentUser.id,
              limit_count: 20
            }).then(({ data }) => {
              if (data) setRealConversations(data);
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'school_conversation_members'
        },
        () => {
          // Refresh group chat summary when members change
          if (!isDevMode && currentUser && schoolSlug) {
            supabase.rpc('get_school_group_chat_summary', {
              school_slug_param: schoolSlug,
              user_id_param: currentUser.id
            }).then(({ data }) => {
              if (data?.[0]) setGroupChatSummary(data[0]);
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isDevMode, currentUser, schoolSlug, selectedConversation, showGroupChat, groupChatSummary?.conversation_id]);

  const handleJoinGroupChat = async () => {
    if (!groupChatSummary) return;
    
    // In dev mode, just toggle state locally
    if (isDevMode) {
      setShowGroupChat(true);
      setGroupChatMessages(mockGroupMessages);
      toast.success("Joined group chat!");
      return;
    }

    if (!currentUser) return;

    setLoadingGroupChat(true);
    try {
      const { error } = await supabase.rpc('join_school_group_chat', {
        conversation_id_param: groupChatSummary.conversation_id,
        user_id_param: currentUser.id
      });

      if (error) throw error;
      
      // Update the summary to reflect membership
      setGroupChatSummary(prev => prev ? {
        ...prev,
        is_member: true,
        member_count: prev.member_count + 1
      } : null);
      
      toast.success("Joined group chat!");
    } catch (error) {
      console.error('Error joining group chat:', error);
      toast.error("Failed to join group chat");
    } finally {
      setLoadingGroupChat(false);
    }
  };

  const handleOpenGroupChat = async () => {
    setShowGroupChat(true);
    setSelectedConversation(null);
    
    if (isDevMode) {
      setGroupChatMessages(mockGroupMessages);
      return;
    }

    if (!groupChatSummary) return;

    try {
      const { data, error } = await supabase.rpc('list_school_messages', {
        conversation_id_param: groupChatSummary.conversation_id,
        limit_count: 50
      });

      if (error) throw error;
      
      const formattedMessages: ChatMessage[] = (data || []).map((msg: any) => ({
        id: msg.message_id,
        sender_name: msg.sender_name || 'User',
        message: msg.content_text,
        timestamp: new Date(msg.created_at).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        is_own: msg.sender_id === currentUser?.id
      }));

      setGroupChatMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading group chat messages:', error);
      toast.error("Failed to load messages");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    // Validate message content
    const validation = validateMessage(newMessage.trim());
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    const messageText = newMessage.trim();
    const optimisticId = `opt-${Date.now()}`;
    
    const message: ChatMessage = {
      id: optimisticId,
      sender_name: currentUser?.name || "You",
      message: messageText,
      timestamp: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      is_own: true,
      sender_id: currentUser?.id
    };

    // Add message optimistically
    if (showGroupChat) {
      setGroupChatMessages(prev => [...prev, message]);
    } else if (selectedConversation) {
      setMessages(prev => [...prev, message]);
    }

    setNewMessage("");
    setSending(true);

    // In dev mode, simulate response
    if (isDevMode) {
      setTimeout(() => {
        const response: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender_name: showGroupChat ? "System" : "Other User",
          message: "This is a mock response in dev mode!",
          timestamp: new Date().toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          is_own: false
        };
        
        if (showGroupChat) {
          setGroupChatMessages(prev => [...prev, response]);
        } else {
          setMessages(prev => [...prev, response]);
        }
        setSending(false);
      }, 1000);
      return;
    }

    // Send real message
    try {
      if (showGroupChat && groupChatSummary && currentUser) {
        const { data, error } = await supabase.rpc('send_school_message', {
          conversation_id_param: groupChatSummary.conversation_id,
          sender_id_param: currentUser.id,
          content_text_param: messageText
        });

        if (error) throw error;
        
        // Update optimistic message with real ID
        if (data) {
          setGroupChatMessages(prev => 
            prev.map(msg => 
              msg.id === optimisticId 
                ? { ...msg, id: data } 
                : msg
            )
          );
        }
      } else if (selectedConversation && currentUser) {
        const { data, error } = await supabase.rpc('send_school_message', {
          conversation_id_param: selectedConversation,
          sender_id_param: currentUser.id,
          content_text_param: messageText
        });

        if (error) throw error;

        if (data) {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === optimisticId 
                ? { ...msg, id: data } 
                : msg
            )
          );
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message");
      
      // Remove optimistic message
      if (showGroupChat) {
        setGroupChatMessages(prev => prev.filter(msg => msg.id !== optimisticId));
      } else {
        setMessages(prev => prev.filter(msg => msg.id !== optimisticId));
      }
    } finally {
      setSending(false);
    }
  };

  const handleConversationSelect = async (convId: string, type: 'dm' | 'group' = 'dm') => {
    setSelectedConversation(convId);
    setSelectedConversationType(type);
    setShowGroupChat(false);
    
    if (isDevMode && mockConversationMessages[convId]) {
      setMessages(mockConversationMessages[convId]);
      return;
    }

    // Load real messages for the conversation
    if (!isDevMode && currentUser) {
      try {
        const { data, error } = await supabase.rpc('list_school_messages', {
          conversation_id_param: convId,
          limit_count: 50
        });

        if (error) throw error;
        
        const formattedMessages: ChatMessage[] = (data || []).map((msg: any) => ({
          id: msg.message_id,
          sender_name: msg.sender_name || 'User',
          message: msg.content_text,
          timestamp: new Date(msg.created_at).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }),
          is_own: msg.sender_id === currentUser.id,
          sender_id: msg.sender_id
        }));

        setMessages(formattedMessages);

        // Mark conversation as read
        await supabase.rpc('mark_school_read', {
          conversation_id_param: convId,
          user_id_param: currentUser.id
        });
      } catch (error) {
        console.error('Error loading messages:', error);
        toast.error("Failed to load messages");
      }
    }
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
    setShowGroupChat(false);
    setMessages([]);
  };

  const showChatList = !selectedConversation && !showGroupChat;
  const showChat = selectedConversation || showGroupChat;

  // Use real conversations in production, mock in dev mode
  const displayConversations = isDevMode ? conversations : realConversations;
  
  // Empty state for when no conversations exist
  const showEmptyState = displayConversations.length === 0;

  const handleStartDM = useCallback(() => {
    if (onStartDM) {
      // This would open a user picker or redirect to discover
      toast.info("Feature coming soon - browse profiles in the Meet tab to start chatting!");
    }
  }, [onStartDM]);

  return (
    <div className="h-full flex">
      {/* Left Sidebar - Conversation List */}
      <div className={cn(
        "flex flex-col border-r border-border",
        isMobile ? (showChatList ? "w-full" : "hidden") : "w-80"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Chats</h2>
            <Button size="sm" variant="ghost">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Pinned Group Chat */}
        {groupChatSummary && (
          <div className="p-4 border-b border-border">
            <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary-glow/10 border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">{groupChatSummary.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {groupChatSummary.member_count} member{groupChatSummary.member_count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={groupChatSummary.is_member ? handleOpenGroupChat : handleJoinGroupChat}
                  disabled={loadingGroupChat}
                >
                  {groupChatSummary.is_member ? "Open" : "Join"}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          {showEmptyState ? (
            <div className="p-6 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No conversations yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Start chatting with your classmates</p>
              <Button size="sm" onClick={handleStartDM} className="gap-2">
                <UserPlus className="h-4 w-4" />
                Message a classmate
              </Button>
            </div>
          ) : (
            <div className="p-2">
              {displayConversations.map((conv) => {
                // Handle both mock data format and real data format
                const convId = conv.id || conv.conversation_id;
                const convTitle = conv.name || conv.title;
                const convTime = conv.time || (conv.last_message_at ? 
                  new Date(conv.last_message_at).toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit' 
                  }) : '');
                const convLastMessage = conv.lastMessage || conv.last_message_text;
                const convUnread = conv.unread || conv.unread_count || 0;
                const convAvatar = conv.avatar;
                
                return (
                  <div
                    key={convId}
                    onClick={() => handleConversationSelect(convId, conv.type || 'dm')}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors",
                      selectedConversation === convId && "bg-accent"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={convAvatar} />
                        <AvatarFallback>{convTitle?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium truncate">{convTitle}</h4>
                          <span className="text-xs text-muted-foreground">{convTime}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {convLastMessage || "No messages yet"}
                        </p>
                      </div>
                      {convUnread > 0 && (
                        <Badge variant="default" className="h-5 min-w-5 text-xs">
                          {convUnread}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Right - Chat Area */}
      <div className={cn(
        "flex-1 flex flex-col",
        isMobile && showChatList && "hidden"
      )}>
        {showChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex items-center gap-3">
              {isMobile && (
                <Button variant="ghost" size="sm" onClick={handleBackToList}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div className="flex items-center gap-3 flex-1">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                  {showGroupChat ? (
                    <Users className="h-5 w-5 text-white" />
                  ) : (
                    <MessageSquare className="h-5 w-5 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">
                    {showGroupChat ? groupChatSummary?.title : "Chat"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {showGroupChat ? 
                      `${groupChatSummary?.member_count || 0} members` : 
                      "Online"
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {(showGroupChat ? groupChatMessages : messages).length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No messages yet. Say hi 👋</p>
                  </div>
                ) : (
                  (showGroupChat ? groupChatMessages : messages).map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3",
                        message.is_own ? "justify-end" : "justify-start"
                      )}
                    >
                      {!message.is_own && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {message.sender_name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          "max-w-xs lg:max-w-md px-4 py-2 rounded-2xl",
                          message.is_own
                            ? "bg-primary text-primary-foreground"
                            : "bg-accent"
                        )}
                      >
                        {!message.is_own && showGroupChat && (
                          <p className="text-xs font-medium mb-1 opacity-70">
                            {message.sender_name}
                          </p>
                        )}
                        <p className="text-sm">{message.message}</p>
                        <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                      </div>
                      {message.is_own && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">You</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                  disabled={sending}
                  maxLength={1000}
                />
                <Button type="submit" size="sm" disabled={sending || !newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernChatInterface;