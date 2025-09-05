import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAppState } from './useAppState';

export const useStartDM = (schoolSlug: string) => {
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAppState();

  const startDM = async (otherUserId: string): Promise<string | null> => {
    if (!currentUser || !schoolSlug) {
      toast.error("Authentication required");
      return null;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('start_school_dm_or_get', {
        school_slug_param: schoolSlug,
        user_a_param: currentUser.id,
        user_b_param: otherUserId
      });

      if (error) throw error;
      
      toast.success("Chat started!");
      return data;
    } catch (error) {
      console.error('Error starting DM:', error);
      toast.error("Failed to start chat");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { startDM, loading };
};