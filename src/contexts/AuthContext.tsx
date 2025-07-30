import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  user_id: string;
  name: string | null;
  avatar_url: string | null;
  school: string | null;
  verified: boolean;
  major: string | null;
  bio: string | null;
  class_year: string | null;
  looking_for_roommate: boolean;
  interests: string[] | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Clean up auth state utility
  const cleanupAuthState = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  // Detect school from email domain
  const detectSchoolFromEmail = (email: string): string | null => {
    const domain = email.split('@')[1]?.toLowerCase();
    const schoolMapping: Record<string, string> = {
      'bu.edu': 'Boston University',
      'harvard.edu': 'Harvard University',
      'mit.edu': 'MIT',
      'ucla.edu': 'UCLA',
      'berkeley.edu': 'UC Berkeley',
      'stanford.edu': 'Stanford University',
      'yale.edu': 'Yale University',
      'princeton.edu': 'Princeton University',
      'columbia.edu': 'Columbia University',
      'nyu.edu': 'NYU',
      'upenn.edu': 'University of Pennsylvania',
      'northwestern.edu': 'Northwestern University',
      'duke.edu': 'Duke University',
      'umich.edu': 'University of Michigan',
      'usc.edu': 'USC'
    };
    return schoolMapping[domain] || null;
  };

  // Load user profile
  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user profile:', error);
        return;
      }

      setUserProfile(data);
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Defer profile loading to prevent potential deadlocks
          setTimeout(() => {
            loadUserProfile(session.user.id);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setUserProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          loadUserProfile(session.user.id);
        }, 0);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Enhanced input validation and security
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  };

  const validatePassword = (password: string): { isValid: boolean; message?: string } => {
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { isValid: false, message: 'Password must contain uppercase, lowercase, and numeric characters' };
    }
    return { isValid: true };
  };

  const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[<>]/g, '');
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Input validation
      if (!validateEmail(email)) {
        return { error: new Error('Please enter a valid email address') };
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        return { error: new Error(passwordValidation.message) };
      }

      const sanitizedName = sanitizeInput(name);
      if (sanitizedName.length < 1 || sanitizedName.length > 100) {
        return { error: new Error('Name must be between 1 and 100 characters') };
      }

      // Rate limiting check
      await supabase.rpc('check_rate_limit', {
        user_identifier: email,
        action_type: 'signup'
      });

      cleanupAuthState();
      
      const redirectUrl = `${window.location.origin}/`;
      const detectedSchool = detectSchoolFromEmail(email);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: sanitizedName,
            school: detectedSchool
          }
        }
      });

      if (error) throw error;

      // If user is created, update their profile with school info
      if (data.user && detectedSchool) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .update({ 
            school: detectedSchool,
            name 
          })
          .eq('user_id', data.user.id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
        }
      }

      toast({
        title: "Account Created!",
        description: "Please check your email to verify your account.",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Input validation
      if (!validateEmail(email)) {
        return { error: new Error('Please enter a valid email address') };
      }

      if (password.length === 0) {
        return { error: new Error('Password is required') };
      }

      // Rate limiting check
      await supabase.rpc('check_rate_limit', {
        user_identifier: email,
        action_type: 'signin'
      });

      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Welcome back!",
          description: "You've been signed in successfully.",
        });
        
        // Force page reload for clean state
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      }

      return { error: null };
    } catch (error: any) {
      console.error('Signin error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Ignore errors
      }
      
      toast({
        title: "Signed Out",
        description: "You've been signed out successfully.",
      });
      
      // Force page reload for clean state
      window.location.href = '/signin';
    } catch (error) {
      console.error('Signout error:', error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;

      // Reload profile
      await loadUserProfile(user.id);
      
      return { error: null };
    } catch (error: any) {
      console.error('Profile update error:', error);
      return { error };
    }
  };

  const value = {
    user,
    session,
    userProfile,
    isLoading,
    signUp,
    signIn,
    signOut,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};