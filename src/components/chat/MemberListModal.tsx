/**
 * Member List Modal Component
 * 
 * Shows group chat members with search functionality
 * Supports both desktop modal and mobile sheet layouts
 * Handles real data from Supabase and mock data in dev mode
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, UserPlus, Crown, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAppState } from "@/hooks/useAppState";
import { cn } from "@/lib/utils";

interface Member {
  user_id: string;
  display_name: string;
  username?: string;
  avatar_url?: string;
  role: 'member' | 'mod' | 'admin';
  joined_at: string;
  is_online?: boolean;
}

interface MemberListModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string;
  title: string;
  isDevMode?: boolean;
  isMobile?: boolean;
}

// Mock members for dev mode
const generateMockMembers = (count: number = 47): Member[] => {
  const names = [
    'Alex Johnson', 'Sam Chen', 'Jordan Taylor', 'Casey Martinez', 'Riley Thompson',
    'Avery Kim', 'Morgan Davis', 'Quinn Rodriguez', 'Sage Wilson', 'River Anderson',
    'Phoenix Lee', 'Skylar Brown', 'Rowan Garcia', 'Emery Martinez', 'Finley Jones',
    'Hayden Miller', 'Lennox Wilson', 'Remy Taylor', 'Sage Thompson', 'Wren Davis',
    'Blake Anderson', 'Cameron Kim', 'Drew Rodriguez', 'Ellis Brown', 'Frankie Lee',
    'Gray Martinez', 'Harper Johnson', 'Indie Chen', 'Jude Wilson', 'Kai Davis',
    'Lane Thompson', 'Max Rodriguez', 'Nova Anderson', 'Oakley Kim', 'Parker Lee',
    'Quinn Brown', 'Rain Martinez', 'Scout Johnson', 'Tate Chen', 'Uma Wilson',
    'Vale Davis', 'Wren Thompson', 'Xen Rodriguez', 'Yale Anderson', 'Zara Kim'
  ];

  const majors = [
    'Computer Science', 'Business Administration', 'Psychology', 'Biology', 'Engineering',
    'Economics', 'English Literature', 'Political Science', 'Mathematics', 'Art History',
    'Pre-Med', 'Communications', 'Philosophy', 'Chemistry', 'Physics'
  ];

  return Array.from({ length: count }, (_, i) => ({
    user_id: `mock-user-${i}`,
    display_name: names[i % names.length],
    username: `@${names[i % names.length].toLowerCase().replace(' ', '')}`,
    avatar_url: undefined,
    role: i === 0 ? 'admin' : i < 3 ? 'mod' : 'member',
    joined_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    is_online: Math.random() > 0.7
  }));
};

export const MemberListModal: React.FC<MemberListModalProps> = ({
  isOpen,
  onClose,
  conversationId,
  title,
  isDevMode = false,
  isMobile = false
}) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAppState();

  // Load members
  useEffect(() => {
    if (!isOpen) return;

    if (isDevMode) {
      setMembers(generateMockMembers());
      return;
    }

    const loadMembers = async () => {
      if (!conversationId || !currentUser) return;

      setLoading(true);
      try {
        // In a real implementation, you'd have an RPC to get conversation members
        // For now, we'll use a placeholder
        const { data, error } = await supabase
          .from('school_conversation_members')
          .select(`
            user_id,
            role,
            joined_at,
            profiles!inner(
              display_name,
              username,
              avatar_url
            )
          `)
          .eq('conversation_id', conversationId);

        if (error) throw error;

        const formattedMembers: Member[] = (data || []).map((item: any) => ({
          user_id: item.user_id,
          display_name: item.profiles.display_name || 'User',
          username: item.profiles.username,
          avatar_url: item.profiles.avatar_url,
          role: item.role || 'member',
          joined_at: item.joined_at,
          is_online: Math.random() > 0.7 // Mock online status
        }));

        setMembers(formattedMembers);
      } catch (error) {
        console.error('Error loading members:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, [isOpen, conversationId, currentUser, isDevMode]);

  // Filter members based on search
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return members;

    return members.filter(member =>
      member.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [members, searchQuery]);

  // Sort members by role and online status
  const sortedMembers = useMemo(() => {
    return [...filteredMembers].sort((a, b) => {
      // Admins first, then mods, then members
      const roleOrder = { admin: 0, mod: 1, member: 2 };
      if (roleOrder[a.role] !== roleOrder[b.role]) {
        return roleOrder[a.role] - roleOrder[b.role];
      }
      
      // Online users first
      if (a.is_online !== b.is_online) {
        return b.is_online ? 1 : -1;
      }
      
      // Alphabetical by name
      return a.display_name.localeCompare(b.display_name);
    });
  }, [filteredMembers]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-3 w-3 text-yellow-500" />;
      case 'mod':
        return <Shield className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Admin</Badge>;
      case 'mod':
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Mod</Badge>;
      default:
        return null;
    }
  };

  const content = (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Member count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'}
        </p>
        {isDevMode && (
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            DEV MODE
          </Badge>
        )}
      </div>

      {/* Members list */}
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedMembers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No members found</p>
          </div>
        ) : (
          <div className="space-y-1">
            {sortedMembers.map((member) => (
              <div
                key={member.user_id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors",
                  member.user_id === currentUser?.id && "bg-primary/5 border border-primary/20"
                )}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatar_url} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {member.display_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  {member.is_online && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-foreground truncate">
                      {member.display_name}
                      {member.user_id === currentUser?.id && ' (You)'}
                    </p>
                    {getRoleIcon(member.role)}
                  </div>
                  <div className="flex items-center gap-2">
                    {member.username && (
                      <p className="text-sm text-muted-foreground truncate">
                        {member.username}
                      </p>
                    )}
                    {getRoleBadge(member.role)}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {member.is_online ? 'Online' : 'Offline'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Joined {new Date(member.joined_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Actions */}
      <div className="mt-4 pt-4 border-t border-border">
        <Button
          variant="outline"
          className="w-full"
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return content;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};