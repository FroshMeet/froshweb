
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAppState } from "@/hooks/useAppState";
import { mockConversations, mockMessageRequests, mockMessages } from "@/data/mockConversations";
import { Skeleton } from "@/components/ui/skeleton";
import ModernChatInterface from "../ModernChatInterface";

interface ChatsTabContentProps {
  schoolName?: string;
}

const ChatsTabContent = ({ schoolName }: ChatsTabContentProps) => {
  const [realConversations, setRealConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { isDevMode, currentUser } = useAppState();
  
  // Use dev mode logic: mock data if dev mode is on, real data if off
  const effectiveConversations = isDevMode ? mockConversations : realConversations;

  useEffect(() => {
    const fetchRealConversations = async () => {
      if (isDevMode || !currentUser) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select(`
            *,
            user1:user_profiles!conversations_user1_id_fkey(name, avatar_url, school),
            user2:user_profiles!conversations_user2_id_fkey(name, avatar_url, school)
          `)
          .or(`user1_id.eq.${currentUser.id},user2_id.eq.${currentUser.id}`)
          .order('last_message_at', { ascending: false });

        if (error) throw error;
        setRealConversations(data || []);
      } catch (error) {
        console.error('Error fetching real conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRealConversations();
  }, [isDevMode, currentUser]);

  // Show loading state for real data
  if (!isDevMode && loading) {
    return (
      <div className="h-full w-full">
        <div className="flex h-full">
          {/* Sidebar Skeleton */}
          <div className="w-80 border-r border-border p-4 space-y-4">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            
            {/* Conversations List Skeleton */}
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-3 p-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Main Area Skeleton */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center px-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading conversations...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state when dev mode is OFF and no real data
  if (!isDevMode && effectiveConversations.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center px-6">
          <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-50" />
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Start the first chat at {schoolName}
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Be the first to break the ice! Connect with classmates and start conversations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-sm mx-auto">
            <Button 
              onClick={() => navigate(`/meet`)}
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              <Users className="h-5 w-5 mr-2" />
              Message a classmate
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/signup')}
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Invite friends
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <ModernChatInterface 
    schoolName={schoolName} 
    conversations={effectiveConversations}
    isDevMode={isDevMode}
  />;
};

export default ChatsTabContent;
