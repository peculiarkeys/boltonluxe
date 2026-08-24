import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface ConsumerAuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const ConsumerAuthContext = createContext<ConsumerAuthContextType | undefined>(undefined);

export const ConsumerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    }).catch((error) => {
      console.error('Error getting session:', error);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <ConsumerAuthContext.Provider value={{ session, user, isLoading, signOut }}>
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
