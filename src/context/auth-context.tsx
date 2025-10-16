
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
    // Simulate loading user from a session
    setTimeout(() => {
      const mockUser = { email: 'test@example.com', role: 'admin' as const };
      setUser(mockUser);
      setTrueRole(mockUser.role);
      setLoading(false);
    }, 1000);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setTrueRole(userData.role);
  };

  const logout = () => {
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
