"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Separator } from "../ui/separator";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M21.35 11.1h-9.17v2.73h5.22c-.22 1.68-1.33 3.4-3.4 3.4-2.04 0-3.7-1.68-3.7-3.73s1.66-3.73 3.7-3.73c1.1 0 2.08.4 2.76 1.04l2.1-2.1c-1.28-1.2-3-1.9-4.86-1.9-4.04 0-7.3 3.28-7.3 7.33s3.26 7.33 7.3 7.33c4.2 0 6.9-2.9 6.9-7.07 0-.5-.04-1-.13-1.47z"/>
    </svg>
)

const GitHubIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
)

export function SignInForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<null | 'google' | 'github'>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSocialSignIn = async (provider: 'google' | 'github') => {
    setIsSocialLoading(provider);
    const authProvider = provider === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider();

    try {
        const result = await signInWithPopup(auth, authProvider);
        const user = result.user;

        // Check if user exists in Firestore, if not create them
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
             await setDoc(userDocRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                role: 'user', // Default role
                createdAt: new Date().toISOString(),
            });
        }
        
        toast({ title: "Signed In", description: "You have successfully signed in." });
        router.push('/dashboard');
    } catch (error: any) {
        console.error(`${provider} sign in error:`, error);
        toast({
            variant: "destructive",
            title: "Sign In Failed",
            description: error.message || `Could not sign in with ${provider}.`
        });
    } finally {
        setIsSocialLoading(null);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({
        title: "Signed In",
        description: "You have successfully signed in.",
      });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Sign in error:", error);
      let description = "An unexpected error occurred. Please try again.";
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        description = "Invalid credentials. Please check your email and password.";
      } else if (error.message) {
        description = error.message;
      }
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: description,
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (!isMounted) {
    return null;
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Sign In</CardTitle>
        <CardDescription>
          Choose your preferred sign-in method below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => handleSocialSignIn('google')} disabled={!!isSocialLoading}>
                {isSocialLoading === 'google' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <GoogleIcon />}
                Google
            </Button>
            <Button variant="outline" onClick={() => handleSocialSignIn('github')} disabled={!!isSocialLoading}>
                {isSocialLoading === 'github' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <GitHubIcon />}
                GitHub
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : "Sign In with Email"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
