"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

const ROLES: { value: UserRole; label: string; icon: string; desc: string }[] = [
  { value: "consumer", label: "Buyer", icon: "🛒", desc: "Buy fresh produce" },
  { value: "farmer", label: "Farmer", icon: "🌾", desc: "Sell your harvest" },
  { value: "restaurant", label: "Restaurant", icon: "🍽️", desc: "Bulk ordering" },
  { value: "grocery", label: "Grocery", icon: "🏪", desc: "Wholesale supply" },
];

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<"role" | "details" | "otp">("role");
  const [role, setRole] = useState<UserRole>("consumer");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendOTP(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const formattedPhone = phone.startsWith("0")
      ? "+63" + phone.slice(1)
      : "+63" + phone;

    const { error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
      options: {
        data: { first_name: firstName, last_name: lastName, role },
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("OTP sent to your phone");
      setStep("otp");
    }
    setLoading(false);
  }

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const formattedPhone = phone.startsWith("0")
      ? "+63" + phone.slice(1)
      : "+63" + phone;

    const { error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: otp,
      type: "sms",
    });

    if (error) {
      toast.error("Invalid OTP code");
    } else {
      toast.success("Account created! Welcome to AgriPulse 🌱");
      router.push(role === "farmer" ? "/dashboard" : "/marketplace");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100">
          <span className="text-2xl">🌱</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
        <p className="mt-2 text-sm text-gray-600">
          Join AgriPulse as a buyer or farmer
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        {/* Step 1: Role selection */}
        {step === "role" && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-700">I want to:</p>
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  className={cn(
                    "flex flex-col items-center rounded-xl border-2 p-4 transition-colors",
                    role === r.value
                      ? "border-primary bg-primary-50"
                      : "border-gray-100 hover:border-gray-200"
                  )}
                >
                  <span className="text-2xl">{r.icon}</span>
                  <span className="mt-1 text-sm font-medium">{r.label}</span>
                  <span className="mt-0.5 text-[10px] text-gray-500">{r.desc}</span>
                </button>
              ))}
            </div>
            <Button size="xl" className="w-full" onClick={() => setStep("details")}>
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: Personal info */}
        {step === "details" && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">First Name</label>
                <Input
                  placeholder="Juan"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">Last Name</label>
                <Input
                  placeholder="Dela Cruz"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">Phone Number</label>
              <div className="flex gap-2">
                <div className="flex h-12 items-center rounded-xl border bg-gray-50 px-3 text-sm text-gray-500">
                  +63
                </div>
                <Input
                  type="tel"
                  placeholder="917 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  maxLength={11}
                />
              </div>
            </div>
            <Button type="submit" size="xl" className="w-full" loading={loading}>
              Send OTP Code
            </Button>
            <button type="button" onClick={() => setStep("role")} className="w-full text-center text-sm text-gray-500">
              ← Back
            </button>
          </form>
        )}

        {/* Step 3: OTP */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Enter 6-digit code</label>
              <Input
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                maxLength={6}
                className="text-center text-lg tracking-[0.5em]"
              />
            </div>
            <Button type="submit" size="xl" className="w-full" loading={loading}>
              Create Account
            </Button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
