
import Link from "next/link";
import { OmIcon } from "../icons/om-icon";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/temples", label: "Temples" },
  { href: "/queue", label: "Virtual Queue" },
  { href: "/tokens", label: "My Tokens" },
  { href: "/history", label: "History" },
  { href: "/status", label: "Live Status" },
  { href: "/maps", label: "Maps" },
];

interface MobileNavProps {
  onLinkClick?: () => void;
}

export function MobileNav({ onLinkClick }: MobileNavProps) {
  const { user } = useAuth();
  
  const renderAuthButtons = () => {
    // We removed the loading spinner to fix the perpetual spinning issue.
    // We now directly check for the user object.
    if (!user) {
      return (
        <div className="flex flex-col space-y-2 mt-6">
           <Button asChild variant="ghost" onClick={onLinkClick}>
                <Link href="/signin">Sign In</Link>
            </Button>
            <Button asChild onClick={onLinkClick}>
                <Link href="/signup">Sign Up</Link>
            </Button>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center border-b pb-4">
        <Link href="/" className="flex items-center space-x-2" onClick={onLinkClick}>
          <OmIcon className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline">TempleConnect</span>
        </Link>
      </div>
      <nav className="flex flex-col space-y-4 mt-6 flex-grow">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-lg font-medium text-foreground/80 hover:text-foreground"
            onClick={onLinkClick}
          >
            {link.label}
          </Link>
        ))}
         {user && (
            <Link
                href="/dashboard"
                 className="text-lg font-medium text-foreground/80 hover:text-foreground"
                onClick={onLinkClick}
              >
                Dashboard
            </Link>
        )}
      </nav>
      {renderAuthButtons()}
    </div>
  );
}
