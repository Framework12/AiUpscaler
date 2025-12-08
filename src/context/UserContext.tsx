'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  credits: number;
  isPremium: boolean;
  firstName?: string;
  lastName?: string;
  email?: string;
  totalUpscales?: number;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchUserProfile = async (authUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
        
        // Return a default user object if profile doesn't exist yet
        return {
          id: authUser.id,
          email: authUser.email,
          firstName: authUser.user_metadata?.first_name || '',
          lastName: authUser.user_metadata?.last_name || '',
          credits: 10,
          isPremium: false,
          totalUpscales: 0,
        };
      }

      return {
        id: authUser.id,
        email: authUser.email,
        firstName: profile?.first_name,
        lastName: profile?.last_name,
        credits: profile?.credits ?? 10,
        isPremium: profile?.is_premium ?? false,
        totalUpscales: profile?.total_upscales ?? 0,
      };
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      
      // Return a default user object on error
      return {
        id: authUser.id,
        email: authUser.email,
        firstName: authUser.user_metadata?.first_name || '',
        lastName: authUser.user_metadata?.last_name || '',
        credits: 10,
        isPremium: false,
        totalUpscales: 0,
      };
    }
  };

  const refreshUser = async () => {
    try {
      console.log('refreshUser: Starting...');
      const { data: { user: authUser }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('refreshUser: Error getting user:', error);
        setUser(null);
        return;
      }
      
      if (authUser) {
        console.log('refreshUser: Auth user found, fetching profile...');
        const userProfile = await fetchUserProfile(authUser);
        console.log('refreshUser: Profile fetched, credits:', userProfile.credits);
        setUser(userProfile);
        console.log('refreshUser: User state updated');
      } else {
        console.log('refreshUser: No auth user found');
        setUser(null);
      }
    } catch (error) {
      console.error('refreshUser: Error:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    console.log('UserProvider: Initializing...');
    
    // Check active session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('UserProvider: Session check result:', {
        hasSession: !!session,
        hasUser: !!session?.user,
        error: error?.message,
      });
      
      if (session?.user) {
        console.log('UserProvider: Session found, fetching profile...');
        fetchUserProfile(session.user).then((profile) => {
          console.log('UserProvider: Profile loaded, credits:', profile.credits);
          setUser(profile);
        });
      } else {
        console.log('UserProvider: No session found');
      }
      setLoading(false);
      setIsInitialized(true);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('UserProvider: Auth state changed:', event, {
          hasSession: !!session,
          hasUser: !!session?.user,
        });
        
        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user);
          console.log('UserProvider: Profile updated, credits:', userProfile.credits);
          setUser(userProfile);
        } else {
          console.log('UserProvider: Session cleared');
          setUser(null);
        }
      }
    );

    return () => {
      console.log('UserProvider: Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, logout, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
