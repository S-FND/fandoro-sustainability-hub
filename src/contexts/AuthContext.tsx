import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types/user";
import { PartnerProfile, PartnerType } from "@/types/partner";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('fandoro_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      let mockUser: User;
      
      if (email.includes('fandoro.com')) {
        mockUser = {
          id: '1',
          email,
          role: 'fandoro_admin',
          name: 'Fandoro Admin',
        };
      } else if (email.includes('enterprise')) {
        mockUser = {
          id: '2',
          email,
          role: 'enterprise',
          name: 'Enterprise User',
          organization: 'Demo Enterprise',
          phoneNumber: '1234567890',
        };
      } else if (email.includes('employee')) {
        mockUser = {
          id: '3',
          email,
          role: 'employee',
          name: 'Employee User',
        };
      } else if (email.includes('supplier')) {
        mockUser = {
          id: '4',
          email,
          role: 'supplier',
          name: 'Supplier User',
          organization: 'Demo Supplier',
        };
      } else if (email.includes('partner')) {
        mockUser = {
          id: '5',
          email,
          role: 'partner',
          name: 'Partner User',
          organization: 'Demo Partner',
          partnerType: 'solution_provider',
        };
      } else if (email.includes('investor')) {
        mockUser = {
          id: '6',
          email,
          role: 'investor',
          name: 'Investor User',
          organization: 'Demo Investor',
        };
      } else {
        mockUser = {
          id: '7',
          email,
          role: 'partner',
          name: 'Partner User',
          organization: 'Demo Partner',
          partnerType: 'solution_provider',
        };
      }
      
      setUser(mockUser);
      localStorage.setItem('fandoro_user', JSON.stringify(mockUser));
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fandoro_user');
  };

  const register = async (userData: any) => {
    try {
      setLoading(true);
      const newUser = {
        id: Date.now().toString(),
        ...userData,
      };
      
      setUser(newUser);
      localStorage.setItem('fandoro_user', JSON.stringify(newUser));
      
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
