import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  full_name: string;
  class_year: number;
  bio?: string;
  pfp_url?: string;
  cover_url?: string;
  school_slug: string;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
  images?: string[];
  school_name?: string;
}

export interface FriendRequest {
  id: string;
  from_user: string;
  to_user: string;
  status: 'pending' | 'accepted' | 'declined' | 'canceled';
  created_at: string;
}

export interface Friendship {
  id: string;
  user_a: string;
  user_b: string;
  created_at: string;
}

export const useProfiles = (schoolSlug: string) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchProfiles = async (limit = 24, offset = 0) => {
    setLoading(true);
    try {
      // Get profiles with their images
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          username,
          full_name,
          class_year,
          bio,
          pfp_url,
          cover_url,
          school_slug,
          is_visible,
          created_at,
          updated_at,
          profile_images (
            image_url,
            position
          )
        `)
        .eq('school_slug', schoolSlug)
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const profilesWithImages = profileData?.map(profile => ({
        ...profile,
        images: profile.profile_images
          ?.sort((a: any, b: any) => a.position - b.position)
          ?.map((img: any) => img.image_url) || []
      })) || [];

      if (offset === 0) {
        setProfiles(profilesWithImages);
      } else {
        setProfiles(prev => [...prev, ...profilesWithImages]);
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast({
        title: "Error",
        description: "Failed to load profiles. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getProfileByUsername = async (username: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          username,
          full_name,
          class_year,
          bio,
          pfp_url,
          cover_url,
          school_slug,
          is_visible,
          created_at,
          updated_at,
          schools (name),
          profile_images (
            image_url,
            position
          )
        `)
        .eq('username', username)
        .single();

      if (error) throw error;

      return {
        ...data,
        school_name: data.schools?.name,
        images: data.profile_images
          ?.sort((a: any, b: any) => a.position - b.position)
          ?.map((img: any) => img.image_url) || []
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  useEffect(() => {
    if (schoolSlug) {
      fetchProfiles();
    }
  }, [schoolSlug]);

  return {
    profiles,
    loading,
    fetchProfiles,
    getProfileByUsername,
    refetch: () => fetchProfiles()
  };
};

export const useFriendRequests = () => {
  const { toast } = useToast();

  const sendFriendRequest = async (toUserId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if friendship or request already exists
      const [{ data: existingFriendship }, { data: existingRequest }] = await Promise.all([
        supabase
          .from('friendships')
          .select('*')
          .or(`and(user_a.eq.${user.id},user_b.eq.${toUserId}),and(user_a.eq.${toUserId},user_b.eq.${user.id})`),
        supabase
          .from('friend_requests')
          .select('*')
          .or(`and(from_user.eq.${user.id},to_user.eq.${toUserId}),and(from_user.eq.${toUserId},to_user.eq.${user.id})`)
      ]);

      if (existingFriendship?.length > 0) {
        return { success: false, message: 'Already friends' };
      }

      if (existingRequest?.length > 0) {
        const request = existingRequest[0];
        if (request.from_user === user.id) {
          return { success: false, message: 'Request already sent' };
        } else {
          return { success: false, message: 'You have a pending request from this user' };
        }
      }

      const { error } = await supabase
        .from('friend_requests')
        .insert({
          from_user: user.id,
          to_user: toUserId,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Friend request sent!"
      });

      return { success: true, message: 'Friend request sent' };
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Error",
        description: "Failed to send friend request. Please try again.",
        variant: "destructive"
      });
      return { success: false, message: 'Failed to send request' };
    }
  };

  const getFriendshipStatus = async (userId: string): Promise<'none' | 'pending_sent' | 'pending_received' | 'friends'> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 'none';

      // Check friendship
      const { data: friendship } = await supabase
        .from('friendships')
        .select('*')
        .or(`and(user_a.eq.${user.id},user_b.eq.${userId}),and(user_a.eq.${userId},user_b.eq.${user.id})`)
        .maybeSingle();

      if (friendship) return 'friends';

      // Check friend requests
      const { data: request } = await supabase
        .from('friend_requests')
        .select('*')
        .or(`and(from_user.eq.${user.id},to_user.eq.${userId}),and(from_user.eq.${userId},to_user.eq.${user.id})`)
        .eq('status', 'pending')
        .maybeSingle();

      if (request) {
        return request.from_user === user.id ? 'pending_sent' : 'pending_received';
      }

      return 'none';
    } catch (error) {
      console.error('Error checking friendship status:', error);
      return 'none';
    }
  };

  return {
    sendFriendRequest,
    getFriendshipStatus
  };
};

export const useMessages = () => {
  const { toast } = useToast();

  const createMessageThread = async (recipientUserId: string) => {
    // Create a deterministic thread_id from both user IDs
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const sortedIds = [user.id, recipientUserId].sort();
    return sortedIds.join('_');
  };

  const sendMessage = async (recipientUserId: string, body: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const threadId = await createMessageThread(recipientUserId);

      const { error } = await supabase
        .from('messages')
        .insert({
          thread_id: threadId,
          sender: user.id,
          recipient: recipientUserId,
          body
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Message sent!"
      });

      return { success: true };
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
      return { success: false };
    }
  };

  return {
    sendMessage,
    createMessageThread
  };
};