"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  BarChart3,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Leaf,
  Camera,
  Pencil,
} from "lucide-react";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { uploadAvatar } from "@/lib/upload";
import { toast } from "sonner";

interface FarmerProfileContentProps {
  user: any;
}

export function FarmerProfileContent({ user }: FarmerProfileContentProps) {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const farmer = user?.farmer || null;

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || null);

  // Editable account + farm fields
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [farmName, setFarmName] = useState(farmer?.farmName || farmer?.farm_name || "");
  const [province, setProvince] = useState(farmer?.province || "");
  const [municipality, setMunicipality] = useState(farmer?.municipality || "");
  const [barangay, setBarangay] = useState(farmer?.barangay || "");

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

  async function handleSave() {
    setSaving(true);
    try {
      // Update account (name)
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName }),
      });

      // Update farm details/location
      const farmRes = await fetch("/api/farmers/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ farmName, province, municipality, barangay }),
      });

      if (res.ok && farmRes.ok) {
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
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarUpload}
        />
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
              <Input placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <Input placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <p className="pt-1 text-xs font-semibold text-gray-500">Farm Details</p>
            <Input placeholder="Farm Name" value={farmName} onChange={(e) => setFarmName(e.target.value)} />
            <Input placeholder="Province" value={province} onChange={(e) => setProvince(e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Municipality/City" value={municipality} onChange={(e) => setMunicipality(e.target.value)} />
              <Input placeholder="Barangay" value={barangay} onChange={(e) => setBarangay(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1" onClick={handleSave} loading={saving}>Save</Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="mt-3 text-lg font-bold text-gray-900">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            {farmName && (
              <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                <Leaf className="h-3 w-3" />
                {farmName}
              </div>
            )}
            {(barangay || municipality || province) && (
              <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="h-3 w-3" />
                {[barangay, municipality, province].filter(Boolean).join(", ")}
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

      {/* Farm stats */}
      {farmer && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border bg-white p-3 text-center shadow-sm">
            <p className="text-lg font-bold text-gray-900">{farmer.farmSizeHectares ?? farmer.farm_size_hectares ?? 0}</p>
            <p className="text-[10px] text-gray-500">Hectares</p>
          </div>
          <div className="rounded-xl border bg-white p-3 text-center shadow-sm">
            <p className="text-lg font-bold text-gray-900">{farmer.totalSales ?? farmer.total_sales ?? 0}</p>
            <p className="text-[10px] text-gray-500">Total Sales</p>
          </div>
          <div className="rounded-xl border bg-white p-3 text-center shadow-sm">
            <p className="text-lg font-bold text-gray-900">{province || "—"}</p>
            <p className="text-[10px] text-gray-500">Province</p>
          </div>
        </div>
      )}

      {/* Menu */}
      <div className="rounded-2xl border bg-white divide-y">
        <button
          onClick={() => setIsEditing(true)}
          className="flex w-full items-center gap-3 px-4 py-3.5 transition-colors hover:bg-gray-50"
        >
          <Pencil className="h-5 w-5 text-gray-400" />
          <span className="flex-1 text-left text-sm font-medium text-gray-700">Account Settings</span>
          <ChevronRight className="h-4 w-4 text-gray-300" />
        </button>
        <a href="/dashboard/analytics" className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-gray-50">
          <BarChart3 className="h-5 w-5 text-gray-400" />
          <span className="flex-1 text-sm font-medium text-gray-700">Sales Analytics</span>
          <ChevronRight className="h-4 w-4 text-gray-300" />
        </a>
        <a href="/dashboard/messages" className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-gray-50">
          <Bell className="h-5 w-5 text-gray-400" />
          <span className="flex-1 text-sm font-medium text-gray-700">Messages</span>
          <ChevronRight className="h-4 w-4 text-gray-300" />
        </a>
        <a href="/help" className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-gray-50">
          <HelpCircle className="h-5 w-5 text-gray-400" />
          <span className="flex-1 text-sm font-medium text-gray-700">Help & Support</span>
          <ChevronRight className="h-4 w-4 text-gray-300" />
        </a>
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
