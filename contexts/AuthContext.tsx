import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../services/supabaseClient';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null; // This is our app's user profile
  loading: boolean;
  updateUser: (updatedUser: Partial<User>) => Promise<void>;
  // Note: login and logout are now handled by Supabase UI or direct calls,
  // the context just reflects the state.
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setLoading(true);
        setSession(session);
        if (session?.user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error('Error fetching profile:', error);
            setUser(null);
          } else {
            setUser(profile as User);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const updateUser = async (updatedData: Partial<User>) => {
    if (!user) throw new Error("No user to update");
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updatedData)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }

    setUser(data as User);
  };
  
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
  };


  return (
    <AuthContext.Provider value={{ session, user, loading, updateUser, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
