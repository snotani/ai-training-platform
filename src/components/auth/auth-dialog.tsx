"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  ArrowLeftIcon,
  Loader2Icon,
  MailIcon,
  SparklesIcon,
  WandSparklesIcon,
} from "lucide-react";

import { useAuth } from "@/components/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Step = "choose" | "email" | "magic";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden focusable="false">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export function AuthDialog({
  open,
  onOpenChange,
  reason,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason?: string;
}) {
  const {
    signInWithPassword,
    signUpWithPassword,
    signInWithMagicLink,
    signInWithGoogle,
    isConfigured,
  } = useAuth();
  const [step, setStep] = React.useState<Step>("choose");
  const [tab, setTab] = React.useState("signin");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [busy, setBusy] = React.useState<"password" | "magic" | "google" | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Always start at the method chooser when the dialog (re)opens.
  React.useEffect(() => {
    if (open) {
      setStep("choose");
      setError(null);
      setBusy(null);
    }
  }, [open]);

  function goTo(next: Step) {
    setError(null);
    setStep(next);
  }

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

  async function handleMagic(e: React.FormEvent) {
    e.preventDefault();
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

  async function handleGoogle() {
    setError(null);
    setBusy("google");
    const res = await signInWithGoogle();
    // On success the browser redirects to Google, so we only land here on error.
    if (res.error) {
      setBusy(null);
      setError(res.error);
    }
  }

  const title =
    step === "email" ? "Continue with email" : step === "magic" ? "Magic link" : "Save your progress";
  const description =
    step === "email"
      ? "Use your email and password to sign in or create an account."
      : step === "magic"
        ? "We'll email you a one-tap link to sign in - no password needed."
        : (reason ??
          "Sign in to earn XP, keep your streak, and climb the leaderboard. All lessons stay free either way.");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {step !== "choose" && (
              <Button
                variant="ghost"
                size="icon-sm"
                className="-ml-1 shrink-0"
                onClick={() => goTo("choose")}
                aria-label="Back"
              >
                <ArrowLeftIcon />
              </Button>
            )}
            <DialogTitle className="text-lg">{title}</DialogTitle>
          </div>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {!isConfigured && (
          <p className="rounded-lg bg-warning/10 px-3 py-2 text-xs text-warning-foreground">
            Gamification isn&apos;t connected yet. Add Supabase keys to enable sign-in - see the README.
          </p>
        )}

        {step === "choose" && (
          <div className="flex flex-col gap-2.5">
            <Button
              variant="outline"
              className="h-11 justify-center gap-3 text-sm"
              onClick={() => goTo("email")}
              disabled={!isConfigured}
            >
              <MailIcon className="size-4" /> Email
            </Button>
            <Button
              variant="outline"
              className="h-11 justify-center gap-3 text-sm"
              onClick={handleGoogle}
              disabled={!isConfigured || busy !== null}
            >
              {busy === "google" ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <GoogleIcon className="size-4" />
              )}
              Google
            </Button>
            <Button
              variant="outline"
              className="h-11 justify-center gap-3 text-sm"
              onClick={() => goTo("magic")}
              disabled={!isConfigured}
            >
              <WandSparklesIcon className="size-4" /> Magic link
            </Button>

            {error && <p className="text-xs text-destructive">{error}</p>}

            <p className="mt-1 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
              <SparklesIcon className="size-3" />
              All lessons stay free either way.
            </p>
          </div>
        )}

        {step === "email" && (
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
        )}

        {step === "magic" && (
          <form onSubmit={handleMagic} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="auth-magic-email">Email</Label>
              <Input
                id="auth-magic-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>

            {error && <p className="text-xs text-destructive">{error}</p>}

            <Button type="submit" disabled={busy !== null}>
              {busy === "magic" ? (
                <>
                  <Loader2Icon className="animate-spin" /> Sending
                </>
              ) : (
                <>
                  <MailIcon /> Email me a magic link
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
