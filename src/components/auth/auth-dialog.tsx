"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2Icon, MailIcon, SparklesIcon } from "lucide-react";

import { useAuth } from "@/components/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AuthDialog({
  open,
  onOpenChange,
  reason,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason?: string;
}) {
  const { signInWithPassword, signUpWithPassword, signInWithMagicLink, isConfigured } = useAuth();
  const [tab, setTab] = React.useState("signin");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [busy, setBusy] = React.useState<"password" | "magic" | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy("password");
    const res =
      tab === "signin"
        ? await signInWithPassword(email, password)
        : await signUpWithPassword(email, password, name || undefined);
    setBusy(null);
    if (res.error) {
      setError(res.error);
      return;
    }
    toast.success(tab === "signin" ? "Welcome back!" : "Account created - you're in!");
    onOpenChange(false);
  }

  async function handleMagic() {
    if (!email) {
      setError("Enter your email first.");
      return;
    }
    setError(null);
    setBusy("magic");
    const res = await signInWithMagicLink(email);
    setBusy(null);
    if (res.error) {
      setError(res.error);
      return;
    }
    toast.success("Magic link sent", { description: "Check your inbox to finish signing in." });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">Save your progress</DialogTitle>
          <DialogDescription>
            {reason ??
              "Sign in to earn XP, keep your streak, and climb the leaderboard. All lessons stay free either way."}
          </DialogDescription>
        </DialogHeader>

        {!isConfigured && (
          <p className="rounded-lg bg-warning/10 px-3 py-2 text-xs text-warning-foreground">
            Gamification isn&apos;t connected yet. Add Supabase keys to enable sign-in - see the README.
          </p>
        )}

        <Tabs value={tab} onValueChange={(v) => setTab(v as string)}>
          <TabsList className="w-full">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Create account</TabsTrigger>
          </TabsList>

          <form onSubmit={handlePassword} className="mt-4 flex flex-col gap-3">
            <TabsContent value="signup" className="m-0">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="auth-name">Name</Label>
                <Input
                  id="auth-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ada Lovelace"
                  autoComplete="name"
                />
              </div>
            </TabsContent>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="auth-email">Email</Label>
              <Input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="auth-password">Password</Label>
              <Input
                id="auth-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                autoComplete={tab === "signin" ? "current-password" : "new-password"}
              />
            </div>

            {error && <p className="text-xs text-destructive">{error}</p>}

            <Button type="submit" disabled={busy !== null} className="mt-1">
              {busy === "password" ? (
                <>
                  <Loader2Icon className="animate-spin" /> Please wait
                </>
              ) : tab === "signin" ? (
                "Sign in"
              ) : (
                "Create account"
              )}
            </Button>
          </form>
        </Tabs>

        <div className="relative my-1 flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>

        <Button variant="outline" onClick={handleMagic} disabled={busy !== null}>
          {busy === "magic" ? <Loader2Icon className="animate-spin" /> : <MailIcon />}
          Email me a magic link
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <SparklesIcon className="size-3" />
          No email verification needed - you&apos;re in instantly.
        </p>
      </DialogContent>
    </Dialog>
  );
}
