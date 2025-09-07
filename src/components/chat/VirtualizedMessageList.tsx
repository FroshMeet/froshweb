/**
 * Virtualized Message List Component
 * 
 * High-performance message rendering using react-window
 * Handles 10k+ messages smoothly with infinite scroll
 * Optimized for both mobile and desktop layouts
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  avatar_url?: string;
  message: string;
  timestamp: string;
  created_at: string;
  is_own: boolean;
  reply_to_id?: string;
}

interface MessageItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    messages: ChatMessage[];
    currentUserId: string;
  };
}

const MessageItem = React.memo(({ index, style, data }: MessageItemProps) => {
  const { messages, currentUserId } = data;
  const message = messages[index];
  
  if (!message) return null;

  const isOwn = message.is_own || message.sender_id === currentUserId;
  const showAvatar = !isOwn && (index === 0 || messages[index - 1]?.sender_id !== message.sender_id);
  
  return (
    <div style={style} className="px-4 py-1">
      <div className={cn(
        "flex gap-3 max-w-4xl",
        isOwn ? "justify-end ml-auto" : "justify-start"
      )}>
        {/* Avatar for others */}
        {!isOwn && (
          <div className="flex-shrink-0 w-8">
            {showAvatar ? (
              <Avatar className="h-8 w-8">
                <AvatarImage src={message.avatar_url} />
                <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                  {message.sender_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            ) : null}
          </div>
        )}
        
        {/* Message bubble */}
        <div className={cn(
          "group max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl",
          isOwn ? "ml-auto" : ""
        )}>
          {/* Sender name for others */}
          {!isOwn && showAvatar && (
            <div className="text-xs text-muted-foreground mb-1 px-3">
              {message.sender_name}
            </div>
          )}
          
          {/* Message content */}
          <div className={cn(
            "rounded-xl px-4 py-2 break-words",
            isOwn 
              ? "bg-primary text-primary-foreground rounded-br-md" // FroshMeet Blue for own messages
              : "bg-muted text-foreground rounded-bl-md"
          )}>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.message}
            </p>
          </div>
          
          {/* Timestamp */}
          <div className={cn(
            "text-xs text-muted-foreground mt-1 px-1",
            isOwn ? "text-right" : "text-left"
          )}>
            {message.timestamp}
          </div>
        </div>
      </div>
    </div>
  );
});

MessageItem.displayName = 'MessageItem';

interface VirtualizedMessageListProps {
  messages: ChatMessage[];
  currentUserId: string;
  onLoadMore?: () => Promise<void>;
  hasNextPage?: boolean;
  isLoading?: boolean;
}

export const VirtualizedMessageList: React.FC<VirtualizedMessageListProps> = ({
  messages,
  currentUserId,
  onLoadMore,
  hasNextPage = false,
  isLoading = false
}) => {
  const listRef = useRef<List>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (listRef.current && messages.length > 0) {
      listRef.current.scrollToItem(messages.length - 1, 'end');
    }
  }, [messages.length]);

  const itemData = {
    messages,
    currentUserId
  };

  const isItemLoaded = useCallback((index: number) => {
    return !!messages[index];
  }, [messages]);

  const loadMoreItems = useCallback(async () => {
    if (onLoadMore && hasNextPage && !isLoading) {
      await onLoadMore();
    }
  }, [onLoadMore, hasNextPage, isLoading]);

  // Calculate container height
  const containerHeight = containerRef.current?.clientHeight || 400;
  
  return (
    <div ref={containerRef} className="h-full w-full">
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={hasNextPage ? messages.length + 1 : messages.length}
        loadMoreItems={loadMoreItems}
      >
        {({ onItemsRendered, ref }) => (
          <List
            ref={(list) => {
              listRef.current = list;
              ref(list);
            }}
            height={containerHeight}
            itemCount={messages.length}
            itemSize={80} // Approximate item height
            itemData={itemData}
            onItemsRendered={onItemsRendered}
            className="scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
          >
            {MessageItem}
          </List>
        )}
      </InfiniteLoader>
    </div>
  );
};