/**
 * Typing Indicator Component
 * 
 * Shows when users are typing in the chat
 * Animated dots for visual feedback
 * Supports multiple users typing simultaneously
 */

import React from 'react';
import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  users: string[];
  className?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ 
  users, 
  className 
}) => {
  if (users.length === 0) return null;

  const formatUsers = () => {
    if (users.length === 1) {
      return `${users[0]} is typing`;
    } else if (users.length === 2) {
      return `${users[0]} and ${users[1]} are typing`;
    } else {
      return `${users.slice(0, 2).join(', ')} and ${users.length - 2} other${users.length - 2 === 1 ? '' : 's'} are typing`;
    }
  };

  return (
    <div className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
      <span>{formatUsers()}</span>
      <div className="flex space-x-1">
        <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
      </div>
    </div>
  );
};