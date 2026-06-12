"use client";

import Link from "next/link";
import { LogOutIcon, TrophyIcon, UserIcon } from "lucide-react";

import { useAuth } from "@/components/auth/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { rankForXp } from "@/lib/gamification/config";

export function UserMenu() {
  const { user, profile, signOut } = useAuth();
  const name = profile?.display_name || user?.email?.split("@")[0] || "You";
  const initials = name.slice(0, 2).toUpperCase();
  const xp = profile?.xp ?? 0;
  const rank = rankForXp(xp);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="rounded-full" aria-label="Account" />
        }
      >
        <Avatar size="sm">
          {profile?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt="" className="size-full rounded-full object-cover" />
          ) : (
            <AvatarFallback className="bg-brand-gradient text-xs text-white">
              {initials}
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">{name}</span>
            <span className="text-xs">
              {rank.name} &middot; {xp.toLocaleString()} XP
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/profile" />}>
          <UserIcon /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/leaderboard" />}>
          <TrophyIcon /> Leaderboard
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => void signOut()}>
          <LogOutIcon /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
