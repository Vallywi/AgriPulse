"use client";

import { useRouter } from "next/navigation";
import {
  User,
  MapPin,
  Store,
  BarChart3,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Leaf,
} from "lucide-react";
import { UserAvatar } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface FarmerProfileContentProps {
  user: any;
}

const MENU_ITEMS = [
  { icon: User, label: "Account Settings", href: "/dashboard/profile/settings" },
  { icon: Store, label: "Farm Details", href: "/dashboard/profile/farm" },
  { icon: MapPin, label: "Farm Location", href: "/dashboard/profile/location" },
  { icon: BarChart3, label: "Sales Analytics", href: "/dashboard/analytics" },
  { icon: Bell, label: "Notifications", href: "/dashboard/profile/notifications" },
  { icon: HelpCircle, label: "Help & Support", href: "/help" },
];

export function FarmerProfileContent({ user }: FarmerProfileContentProps) {
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
        <p className="text-sm text-gray-500">{user.email}</p>
        {user.farmer && (
          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
            <Leaf className="h-3 w-3" />
            {user.farmer.farmName}
          </div>
        )}
      </div>

      {/* Farm stats */}
      {user.farmer && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border bg-white p-3 text-center shadow-sm">
            <p className="text-lg font-bold text-gray-900">{user.farmer.farmSizeHectares || 0}</p>
            <p className="text-[10px] text-gray-500">Hectares</p>
          </div>
          <div className="rounded-xl border bg-white p-3 text-center shadow-sm">
            <p className="text-lg font-bold text-gray-900">{user.farmer.farmingExperienceYears || 0}</p>
            <p className="text-[10px] text-gray-500">Years Exp.</p>
          </div>
          <div className="rounded-xl border bg-white p-3 text-center shadow-sm">
            <p className="text-lg font-bold text-gray-900">{user.farmer.province || "—"}</p>
            <p className="text-[10px] text-gray-500">Province</p>
          </div>
        </div>
      )}

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
