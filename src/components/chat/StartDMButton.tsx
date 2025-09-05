import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Loader2 } from 'lucide-react';
import { useStartDM } from '@/hooks/useStartDM';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface StartDMButtonProps {
  otherUserId: string;
  schoolSlug: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export const StartDMButton = ({ 
  otherUserId, 
  schoolSlug, 
  variant = 'default',
  size = 'default',
  className,
  children 
}: StartDMButtonProps) => {
  const { startDM, loading } = useStartDM(schoolSlug);
  const navigate = useNavigate();

  const handleStartDM = async () => {
    const conversationId = await startDM(otherUserId);
    if (conversationId) {
      // Navigate to chat tab to show the conversation
      navigate(`/school/${schoolSlug}?tab=chats`);
    }
  };

  return (
    <Button 
      onClick={handleStartDM}
      disabled={loading}
      variant={variant}
      size={size}
      className={cn("gap-2", className)}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <MessageSquare className="h-4 w-4" />
      )}
      {children || "Message"}
    </Button>
  );
};