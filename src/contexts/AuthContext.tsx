import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'GENERAL_MANAGER' | 'GSA' | 'FRONT_OFFICE_MANAGER' | 'OPERATIONS_MANAGER' | 'director' | 'group_gm' | 'manager' | 'staff';

export interface Property {
  id: string;
  name: string;
  code: string;
  slug: string;
}

export interface User {
  id: string; // from auth.users
  name: string;
  email: string;
  role: UserRole;
  propertyId?: string;
  property?: Property;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (requiredRole: UserRole) => boolean;
}

const roleHierarchy: Record<string, number> = {
  director: 5,
  group_gm: 4,
  GENERAL_MANAGER: 3,
  property_gm: 3,
  FRONT_OFFICE_MANAGER: 2,
  OPERATIONS_MANAGER: 2,
  manager: 2,
  GSA: 1,
  staff: 1
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchAdminProfile(session.user.id, session.user.email || '');
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchAdminProfile(session.user.id, session.user.email || '');
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchAdminProfile = async (authUserId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_profiles')
        .select(`
          *,
          property:properties (*)
        `)
        .eq('auth_user_id', authUserId)
        .single();

      if (error || !data) {
        console.error('Failed to load admin profile:', error);
        await supabase.auth.signOut();
        setUser(null);
        setLoading(false);
        return;
      }

      if (!data.is_active) {
        toast.error('Your admin account is inactive.');
        setUser(null);
        setLoading(false);
        return;
      }

      setUser({
        id: data.auth_user_id,
        name: data.display_name || data.username,
        email: email,
        role: data.role as UserRole,
        propertyId: data.property_id,
        property: data.property as Property,
        avatar: data.display_name?.substring(0, 2).toUpperCase() || data.username.substring(0, 2).toUpperCase()
      });
    } catch (e) {
      console.error(e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error('Login failed: ' + error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // Explicitly check for admin profile before allowing success
        const { data: profile, error: profileError } = await supabase
          .from('admin_profiles')
          .select('id, is_active')
          .eq('auth_user_id', data.user.id)
          .single();

        if (profileError || !profile) {
          await supabase.auth.signOut();
          setUser(null);
          toast.error('Access Denied: You do not have administrator privileges.');
          setLoading(false);
          return;
        }

        if (!profile.is_active) {
          await supabase.auth.signOut();
          setUser(null);
          toast.error('Access Denied: Your admin account is inactive.');
          setLoading(false);
          return;
        }

        toast.success(`Welcome back`);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.info('You have been logged out');
  };

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    
    const userRoleLevel = roleHierarchy[user.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;
    
    return userRoleLevel >= requiredRoleLevel;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
