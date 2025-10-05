
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useFirebase } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const { auth, user, isUserLoading } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("dr.niharroy@gmail.com");
  const [password, setPassword] = useState("Shaon@5823");
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const isFirebaseConfigured = !!auth;

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace("/");
    }
  }, [user, isUserLoading, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setError("Firebase is not configured. Please check your setup.");
      toast({
          variant: "destructive",
          title: "Configuration Error",
          description: "Firebase is not configured. Please check your setup.",
      });
      return;
    }
    if (!email || !password) {
        setError("Please enter both email and password.");
        return;
    }
    setError(null);
    setIsSigningIn(true);
    try {
        await signInWithEmailAndPassword(auth, email, password);
        // The useEffect will handle the redirect on successful sign-in.
        toast({
            title: "Login Successful",
            description: "You are now logged in.",
        });
    } catch (err: any) {
        let errorMessage = "An unknown error occurred.";
        switch (err.code) {
            case 'auth/invalid-credential':
            case 'auth/wrong-password':
            case 'auth/user-not-found':
                errorMessage = "Invalid email or password. Please try again.";
                break;
            case 'auth/invalid-email':
                errorMessage = "Please enter a valid email address.";
                break;
            case 'auth/too-many-requests':
                errorMessage = "Too many login attempts. Please try again later.";
                break;
             case 'auth/api-key-not-valid':
                errorMessage = "Firebase API Key is not valid. Please check your configuration in src/firebase/config.ts.";
                break;
            default:
                errorMessage = "Failed to sign in. Please check your credentials.";
                break;
        }
        setError(errorMessage);
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: errorMessage,
        });
    } finally {
        setIsSigningIn(false);
    }
  };

  if (isUserLoading || (!isUserLoading && user)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">লগইন করুন</CardTitle>
          <CardDescription>আপনার অ্যাকাউন্টে প্রবেশ করতে আপনার ইমেল এবং পাসওয়ার্ড দিন।</CardDescription>
        </CardHeader>
        <CardContent>
          {!isFirebaseConfigured && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                Firebase is not configured. Please add your Firebase project configuration to <strong>src/firebase/config.ts</strong>.
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">ইমেল</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={!isFirebaseConfigured}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">পাসওয়ার্ড</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={!isFirebaseConfigured}
              />
            </div>
             {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={isSigningIn || !isFirebaseConfigured}>
              {isSigningIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "লগইন"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
