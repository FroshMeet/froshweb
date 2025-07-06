import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share, MoreHorizontal } from "lucide-react";

interface PostCardProps {
  post: {
    id: number;
    author: {
      name: string;
      avatar?: string;
      school: string;
    };
    content: string;
    image?: string;
    likes: number;
    comments: number;
    timestamp: string;
    tags?: string[];
  };
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  isGuest?: boolean;
  onGuestAction?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onLike, 
  onComment, 
  onShare, 
  isGuest, 
  onGuestAction 
}) => {
  const handleAction = (action: () => void) => {
    if (isGuest) {
      onGuestAction?.();
    } else {
      action();
    }
  };

  return (
    <Card className="overflow-hidden bg-card card-shadow border-0 rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback className="bg-primary/20 text-primary font-semibold">
              {post.author.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm text-foreground">{post.author.name}</p>
            <p className="text-xs text-muted-foreground">{post.author.school} • {post.timestamp}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="rounded-full w-8 h-8 p-0">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm text-foreground leading-relaxed">{post.content}</p>
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="bg-muted text-muted-foreground text-xs rounded-full px-2 py-1"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Image */}
      {post.image && (
        <div className="relative">
          <img 
            src={post.image}
            alt="Post content"
            className="w-full aspect-square object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="p-4 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAction(onLike || (() => {}))}
              className="flex items-center gap-2 rounded-full px-3 py-2 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <Heart className="w-5 h-5" />
              <span className="text-sm font-medium">{post.likes}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAction(onComment || (() => {}))}
              className="flex items-center gap-2 rounded-full px-3 py-2 hover:bg-blue-50 hover:text-blue-500 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{post.comments}</span>
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAction(onShare || (() => {}))}
            className="rounded-full px-3 py-2 hover:bg-muted transition-colors"
          >
            <Share className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};