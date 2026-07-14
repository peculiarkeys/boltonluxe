
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export type UserRole = 'director' | 'group_gm' | 'property_gm' | 'manager' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  propertyId?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (requiredRole: UserRole) => boolean;
}

const roleHierarchy: Record<UserRole, number> = {
  director: 5,
  group_gm: 4,
  property_gm: 3,
  manager: 2,
  staff: 1
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for stored user session
    const storedUser = localStorage.getItem('boltonhq_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('boltonhq_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    setLoading(true);
    
    try {
      // For demo purposes, accept any credentials
      // In a real app, this would validate against a backend
      if (email && password) {
        // Mock user data
        const mockUsers: Record<string, User> = {
          'director@boltonhq.com': {
            id: '1',
            name: 'John Doe',
            email: 'director@boltonhq.com',
            role: 'director',
            avatar: 'JD'
          },
          'gm@boltonhq.com': {
            id: '2',
            name: 'Sarah Chen',
            email: 'gm@boltonhq.com',
            role: 'group_gm',
            avatar: 'SC'
          },
          'manager@boltonhq.com': {
            id: '3',
            name: 'Mike Johnson',
            email: 'manager@boltonhq.com',
            role: 'manager',
            propertyId: '1',
            avatar: 'MJ'
          },
          'staff@boltonhq.com': {
            id: '4',
            name: 'Emma Wilson',
            email: 'staff@boltonhq.com',
            role: 'staff',
            propertyId: '1',
            avatar: 'EW'
          }
        };
        
        const foundUser = mockUsers[email.toLowerCase()];
        if (foundUser) {
          setUser(foundUser);
          localStorage.setItem('boltonhq_user', JSON.stringify(foundUser));
          toast.success(`Welcome back, ${foundUser.name}`);
        } else {
          // Demo user
          const demoUser: User = {
            id: '5',
            name: 'Demo User',
            email: email,
            role: 'staff',
            avatar: email.substring(0, 2).toUpperCase()
          };
          setUser(demoUser);
          localStorage.setItem('boltonhq_user', JSON.stringify(demoUser));
          toast.success(`Welcome, ${demoUser.name}`);
        }
      } else {
        toast.error('Please enter both email and password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('boltonhq_user');
    toast.info('You have been logged out');
  };

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    
    const userRoleLevel = roleHierarchy[user.role];
    const requiredRoleLevel = roleHierarchy[requiredRole];
    
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
