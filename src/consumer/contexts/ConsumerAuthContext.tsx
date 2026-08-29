import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface ConsumerAuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
}

const ConsumerAuthContext = createContext<ConsumerAuthContextType | undefined>(undefined);

export const ConsumerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAndSetConsumer = async (session: Session | null) => {
    if (!session) {
      setSession(null);
      setUser(null);
      setIsLoading(false);
      return;
    }

    // Check if the user is an admin. If so, they are not allowed here.
    try {
      const { data: adminProfile, error } = await supabase
        .from('admin_profiles')
        .select('id')
        .eq('auth_user_id', session.user.id)
        .maybeSingle();

      if (adminProfile) {
        console.error('Admins cannot access the consumer portal.');
        setSession(null);
        setUser(null);
      } else {
        setSession(session);
        setUser(session.user);
      }
    } catch (err) {
      console.error('Error verifying consumer session', err);
      setSession(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      checkAndSetConsumer(session);
    }).catch((error) => {
      console.error('Error getting session:', error);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      checkAndSetConsumer(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setIsLoading(false);
      return { error };
    }

    if (data.user) {
      // Pre-flight check before allowing the login flow to proceed
      const { data: adminProfile } = await supabase
        .from('admin_profiles')
        .select('id')
        .eq('auth_user_id', data.user.id)
        .maybeSingle();

      if (adminProfile) {
        await supabase.auth.signOut();
        setIsLoading(false);
        return { error: new Error('Administrators must use the Admin Portal.') };
      }
    }

    if (data.session) {
      setSession(data.session);
      setUser(data.user);
    }

    setIsLoading(false);
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <ConsumerAuthContext.Provider value={{ session, user, isLoading, signOut, login }}>
      {children}
    </ConsumerAuthContext.Provider>
  );
};

export const useConsumerAuth = () => {
  const context = useContext(ConsumerAuthContext);
  if (context === undefined) {
    throw new Error('useConsumerAuth must be used within a ConsumerAuthProvider');
  }
  return context;
};
