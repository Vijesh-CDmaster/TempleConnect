
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";
import { OmIcon } from "../icons/om-icon";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/temples", label: "Temples" },
  { href: "/queue", label: "Virtual Queue" },
  { href: "/tokens", label: "My Tokens" },
  { href: "/history", label: "History" },
  { href: "/status", label: "Live Status" },
  { href: "/maps", label: "Maps" },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/');
  }

  const renderAuthButtons = () => {
    // We removed the loading spinner to fix the perpetual spinning issue.
    // We now directly check for the user object.
    if (user) {
      return (
        <div className="hidden md:flex items-center space-x-2">
          <Link
            href="/dashboard"
            className={cn(
              "text-sm font-medium transition-colors hover:text-foreground/80",
              pathname === "/dashboard" ? "text-foreground" : "text-foreground/60"
            )}
          >
            Dashboard
          </Link>
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Sign Out</span>
          </Button>
        </div>
      );
    }

    return (
      <div className="hidden md:flex items-center space-x-2">
        <Button asChild variant="ghost">
          <Link href="/signin">Sign In</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <OmIcon className="h-6 w-6 text-primary" />
            <span className="font-bold inline-block font-headline">
              TempleConnect
            </span>
          </Link>
          <nav className="hidden space-x-6 text-sm font-medium md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === link.href ? "text-foreground" : "text-foreground/60"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          {renderAuthButtons()}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <MobileNav onLinkClick={() => setIsMobileMenuOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
