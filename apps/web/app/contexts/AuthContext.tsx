"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'tutor' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      // Ensure cookie is set if localStorage has user but cookie doesn't
      document.cookie = `user=${storedUser}; path=/; max-age=${60 * 60 * 24 * 7}`;
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    // Set cookie for middleware
    document.cookie = `user=${JSON.stringify(userData)}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Remove cookie
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}