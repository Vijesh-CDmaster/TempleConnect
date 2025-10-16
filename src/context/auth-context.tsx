
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Role = 'user' | 'worker' | 'admin';

// A basic user type. In a real app, you'd have more fields.
interface User {
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  role: Role | null;
  trueRole: Role | null;
  isImpersonating: boolean;
  login: (userData: User) => void;
  logout: () => void;
  setImpersonatedRole: (role: Role | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [trueRole, setTrueRole] = useState<Role | null>(null);
  const [impersonatedRole, setImpersonatedRole] = useState<Role | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setTrueRole(parsedUser.role);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      // If parsing fails, treat as no user logged in.
      setUser(null);
      setTrueRole(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData: User) => {
    try {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setTrueRole(userData.role);
    } catch (error) {
      console.error("Failed to save user to localStorage", error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('user');
    } catch (error) {
      console.error("Failed to remove user from localStorage", error);
    }
    setUser(null);
    setTrueRole(null);
    setImpersonatedRole(null);
  };

  const role = impersonatedRole || (user ? user.role : null);
  const isImpersonating = !!impersonatedRole;

  return (
    <AuthContext.Provider value={{ user, loading, role, trueRole, isImpersonating, login, logout, setImpersonatedRole }}>
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
