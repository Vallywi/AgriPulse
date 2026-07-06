"use client";

import { useRouter } from "next/navigation";
import { User, MapPin, Heart, Star, Moon, Globe, Bell, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import { UserAvatar } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { User as UserType } from "@/types";

interface ProfileContentProps {
  user: UserType | null;
}

const MENU_ITEMS = [
  { icon: MapPin, label: "My Addresses", href: "/profile/addresses" },
  { icon: Heart, label: "Wishlist", href: "/profile/wishlist" },
  { icon: Star, label: "My Reviews", href: "/profile/reviews" },
  { icon: Bell, label: "Notifications", href: "/profile/notifications" },
  { icon: Globe, label: "Language", href: "/profile/language" },
  { icon: HelpCircle, label: "Help & Support", href: "/help" },
];

export function ProfileContent({ user }: ProfileContentProps) {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    router.push("/login");
    router.refresh();
  }

  if (!user) return null;

  return (
    <div className="container px-4 py-6 space-y-6">
      {/* User info */}
      <div className="flex flex-col items-center text-center">
        <UserAvatar
          name={`${user.firstName} ${user.lastName}`}
          imageUrl={user.avatarUrl}
          className="h-20 w-20 text-lg"
        />
        <h2 className="mt-3 text-lg font-bold text-gray-900">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-sm text-gray-500">{user.phone || user.email}</p>
      </div>

      {/* Menu */}
      <div className="rounded-2xl border bg-white divide-y">
        {MENU_ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-gray-50"
          >
            <item.icon className="h-5 w-5 text-gray-400" />
            <span className="flex-1 text-sm font-medium text-gray-700">{item.label}</span>
            <ChevronRight className="h-4 w-4 text-gray-300" />
          </a>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 py-3.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>

      <p className="text-center text-xs text-gray-400">AgriPulse v0.1.0</p>
    </div>
  );
}
