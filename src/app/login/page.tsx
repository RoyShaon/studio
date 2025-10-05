
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFirebase, initiateEmailSignIn } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const { auth, user, isUserLoading } = useFirebase();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace("/");
    }
  }, [user, isUserLoading, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setError("Firebase Auth not available.");
      return;
    }
    if (!email || !password) {
        setError("Please enter both email and password.");
        return;
    }
    setError(null);
    setIsSigningIn(true);
    try {
        // We are not awaiting this to avoid blocking, auth state is handled by the provider
        initiateEmailSignIn(auth, email, password);
        // The useEffect will handle the redirect on successful sign-in.
    } catch (err: any) {
        // This catch block might not be hit if initiateEmailSignIn is fully non-blocking
        // and errors are handled by listeners, but it's good practice.
        setError(err.message || "Failed to sign in.");
        setIsSigningIn(false);
    }
    // We can't immediately know if the sign-in failed here with the non-blocking approach.
    // For a better UX with immediate feedback, a different strategy might be needed,
    // but for now, we'll rely on the auth state listener.
    // A simple timeout to reset the button and show a generic error if not redirected.
    setTimeout(() => {
        if (!user) { // If user is still not set after a short delay
            setIsSigningIn(false);
            setError("Login failed. Please check your credentials.");
        }
    }, 3000);
  };

  if (isUserLoading || user) {
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
              />
            </div>
             {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={isSigningIn}>
              {isSigningIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "লগইন"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
