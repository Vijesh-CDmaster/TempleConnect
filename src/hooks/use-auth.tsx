
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';

type Role = 'admin' | 'worker' | 'user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  role: Role | null;
  trueRole: Role | null;
  setImpersonatedRole: (role: Role | null) => void;
  isImpersonating: boolean;
}

const AuthContext = createContext<AuthContextType>({ 
    user: null, 
    loading: true, 
    role: null,
    trueRole: null,
    setImpersonatedRole: () => {},
    isImpersonating: false
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [trueRole, setTrueRole] = useState<Role | null>(null);
  const [impersonatedRole, setImpersonatedRole] = useState<Role | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        const userRole = userDoc.exists() ? userDoc.data().role as Role : 'user';
        setTrueRole(userRole);
        setUser(currentUser);
        if (pathname === '/signin' || pathname === '/signup') {
            router.push('/temples');
        }
      } else {
        setUser(null);
        setTrueRole(null);
        setImpersonatedRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [pathname, router]);

  useEffect(() => {
    // Safely access localStorage only on the client side after mounting
    if (typeof window !== 'undefined') {
      const storedImpersonation = localStorage.getItem('impersonatedRole');
      if (storedImpersonation) {
        setImpersonatedRole(storedImpersonation as Role);
      }
    }
  }, []);

  const currentRole = impersonatedRole || trueRole;
  const isImpersonating = !!impersonatedRole;

  const handleSetImpersonatedRole = (role: Role | null) => {
    if (trueRole === 'admin') {
        if (role === 'admin' || role === null) {
            setImpersonatedRole(null);
            localStorage.removeItem('impersonatedRole');
        } else {
            setImpersonatedRole(role);
            localStorage.setItem('impersonatedRole', role);
        }
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, role: currentRole, trueRole, setImpersonatedRole: handleSetImpersonatedRole, isImpersonating }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
