'use client';

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { Toaster } from "@/components/ui/toaster";
import { RoleSwitcher } from "@/components/role-switcher";
import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";

// Define which routes are protected
const protectedRoutes = ["/dashboard", "/queue", "/tokens", "/history", "/status", "/maps"];

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading, trueRole } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && protectedRoutes.includes(pathname)) {
      router.push('/signin');
    }
  }, [user, loading, pathname, router]);

  if (loading && protectedRoutes.includes(pathname)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // If user is not authenticated and tries to access a protected route, we render null while redirecting
  if (!user && protectedRoutes.includes(pathname)) {
    return null;
  }

  return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          {trueRole === 'admin' && user && (
            <div className="container py-4">
               <RoleSwitcher />
            </div>
          )}
          {children}
        </main>
        <Footer />
        <Toaster />
      </div>
  );
}
