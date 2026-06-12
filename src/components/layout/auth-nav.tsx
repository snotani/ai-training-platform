"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/link-button";
import { useAuth } from "@/components/auth/auth-context";
import { UserMenu } from "@/components/auth/user-menu";

// All content is public; this is only the entry point to gamification.
export function AuthNav({ className }: { className?: string }) {
  const { user, openAuth } = useAuth();

  if (user) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <UserMenu />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant="ghost"
        onClick={() => openAuth()}
        className={cn(className && "flex-1")}
      >
        Sign in
      </Button>
      <LinkButton href="/#curriculum" className={cn(className && "flex-1")}>
        Start learning
      </LinkButton>
    </div>
  );
}
