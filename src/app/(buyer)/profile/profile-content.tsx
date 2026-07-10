"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { User, MapPin, Heart, Star, Bell, HelpCircle, LogOut, ChevronRight, Camera, Pencil } from "lucide-react";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { uploadAvatar } from "@/lib/upload";
import { toast } from "sonner";
import type { User as UserType } from "@/types";

interface ProfileContentProps {
  user: UserType | null;
  address?: any;
}

const MENU_ITEMS = [
  { icon: MapPin, label: "My Addresses", href: "/profile/addresses" },
  { icon: Heart, label: "Wishlist", href: "/profile/wishlist" },
  { icon: Star, label: "My Reviews", href: "/profile/reviews" },
  { icon: Bell, label: "Notifications", href: "/profile/notifications" },
  { icon: HelpCircle, label: "Help & Support", href: "/help" },
];

export function ProfileContent({ user, address }: ProfileContentProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Address fields
  const [streetAddress, setStreetAddress] = useState(address?.street_address || address?.streetAddress || "");
  const [barangay, setBarangay] = useState(address?.barangay || "");
  const [municipality, setMunicipality] = useState(address?.municipality || "");
  const [province, setProvince] = useState(address?.province || "");
  const [phone, setPhone] = useState(address?.phone || "");

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    const toastId = toast.loading("Uploading photo...");
    const { url, error } = await uploadAvatar(file, user.id);

    if (error || !url) {
      toast.error("Upload failed: " + (error || "unknown error"), { id: toastId });
      return;
    }

    // Update the user profile with new avatar URL
    const res = await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatarUrl: url }),
    });

    let data: any = null;
    try { data = await res.json(); } catch { /* ignore */ }

    if (res.ok) {
      setAvatarUrl(url);
      toast.success("Profile photo updated!", { id: toastId });
      router.refresh();
    } else {
      toast.error(data?.error || "Failed to save photo", { id: toastId });
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    router.push("/login");
    router.refresh();
  }

  async function handleSaveProfile() {
    if (!user) return;
    setSaving(true);

    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          address: {
            streetAddress,
            barangay,
            municipality,
            province,
            phone,
          },
        }),
      });

      if (res.ok) {
        toast.success("Profile updated!");
        setIsEditing(false);
        router.refresh();
      } else {
        toast.error("Failed to update profile");
      }
    } catch {
      toast.error("Something went wrong");
    }

    setSaving(false);
  }

  if (!user) {
    return (
      <div className="container px-4 py-16 text-center space-y-4">
        <User className="mx-auto h-12 w-12 text-gray-300" />
        <h2 className="text-lg font-semibold text-gray-900">Not Signed In</h2>
        <p className="text-sm text-gray-500">Sign in to view your profile</p>
        <a
          href="/login"
          className="inline-block rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary/90"
        >
          Sign In
        </a>
      </div>
    );
  }

  return (
    <div className="container px-4 py-6 space-y-6">
      {/* User info with edit */}
      <div className="animate-fade-in-up relative flex flex-col items-center text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarUpload}
        />
        {/* Avatar with edit button */}
        <div className="relative">
          <UserAvatar
            name={`${user.firstName} ${user.lastName}`}
            imageUrl={avatarUrl}
            className="h-20 w-20 text-lg"
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            aria-label="Change profile photo"
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shadow-md transition-transform hover:scale-110"
          >
            <Camera className="h-3.5 w-3.5" />
          </button>
        </div>

        {isEditing ? (
          <div className="mt-4 w-full max-w-sm space-y-3 text-left">
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <Input
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <p className="pt-1 text-xs font-semibold text-gray-500">Delivery Address</p>
            <Input
              placeholder="Street / House No."
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Barangay"
                value={barangay}
                onChange={(e) => setBarangay(e.target.value)}
              />
              <Input
                placeholder="Municipality/City"
                value={municipality}
                onChange={(e) => setMunicipality(e.target.value)}
              />
            </div>
            <Input
              placeholder="Province"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
            />
            <div className="flex gap-2">
              <Button size="sm" className="flex-1" onClick={handleSaveProfile} loading={saving}>
                Save
              </Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="mt-3 text-lg font-bold text-gray-900">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            {(streetAddress || municipality || province) && (
              <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="h-3 w-3" />
                {[streetAddress, barangay, municipality, province].filter(Boolean).join(", ")}
              </p>
            )}
            <button
              onClick={() => setIsEditing(true)}
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <Pencil className="h-3 w-3" />
              Edit Profile
            </button>
          </>
        )}
      </div>

      {/* Menu */}
      <div className="animate-fade-in-up rounded-2xl border bg-white divide-y" style={{ animationDelay: "100ms", opacity: 0 }}>
        {MENU_ITEMS.map((item, index) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3.5 transition-all duration-150 hover:bg-gray-50 hover:pl-5"
            style={{ animationDelay: `${(index + 2) * 50}ms` }}
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
        className="animate-fade-in-up flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 py-3.5 text-sm font-medium text-red-600 transition-all duration-150 hover:bg-red-100 hover:scale-[1.01] active:scale-95"
        style={{ animationDelay: "200ms", opacity: 0 }}
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>

      <p className="text-center text-xs text-gray-400">AgriPulse v0.1.0</p>
    </div>
  );
}
