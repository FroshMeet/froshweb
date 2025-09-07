
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAppState } from "@/hooks/useAppState";
import { useDevMode } from "@/components/dev-mode/DevModeProvider";
import { mockConversations, mockMessageRequests, mockMessages } from "@/data/mockConversations";
import { Skeleton } from "@/components/ui/skeleton";
import ProductionChatInterface from "../chat/ProductionChatInterface";
import { useStartDM } from "@/hooks/useStartDM";

interface ChatsTabContentProps {
  schoolName?: string;
  schoolSlug?: string;
}

const ChatsTabContent = ({ schoolName, schoolSlug }: ChatsTabContentProps) => {
  const [realConversations, setRealConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { devMode: isDevMode } = useDevMode();
  const { currentUser } = useAppState();
  const { startDM } = useStartDM(schoolSlug || '');
  
  // Use dev mode logic: mock data if dev mode is on, real data if off
  const effectiveConversations = isDevMode ? mockConversations : realConversations;

  useEffect(() => {
    const fetchRealConversations = async () => {
      if (isDevMode || !currentUser) return;
      
      setLoading(true);
      try {
        // Use new school conversation system
        const { data, error } = await supabase.rpc('list_school_conversations', {
          school_slug_param: schoolSlug || '',
          user_id_param: currentUser.id,
          limit_count: 20
        });

        if (error) throw error;
        setRealConversations(data || []);
      } catch (error) {
        console.error('Error fetching real conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRealConversations();
  }, [isDevMode, currentUser, schoolSlug]);

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

  const handleStartDM = async (otherUserId: string) => {
    if (!schoolSlug) return;
    
    const conversationId = await startDM(otherUserId);
    if (conversationId) {
      // Refresh conversations to show the new one
      if (!isDevMode && currentUser) {
        const { data } = await supabase.rpc('list_school_conversations', {
          school_slug_param: schoolSlug,
          user_id_param: currentUser.id,
          limit_count: 20
        });
        if (data) setRealConversations(data);
      }
    }
  };

  // Always show ProductionChatInterface - it handles the pinned group chat + empty states
  return <ProductionChatInterface 
    schoolName={schoolName}
    schoolSlug={schoolSlug}
    conversations={effectiveConversations}
    isDevMode={isDevMode}
    onStartDM={handleStartDM}
  />;
};

export default ChatsTabContent;
