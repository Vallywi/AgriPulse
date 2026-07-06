"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  async function handleSendOTP(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const formattedPhone = phone.startsWith("0")
      ? "+63" + phone.slice(1)
      : phone.startsWith("+63")
      ? phone
      : "+63" + phone;

    const { error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
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
      : phone.startsWith("+63")
      ? phone
      : "+63" + phone;

    const { error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: otp,
      type: "sms",
    });

    if (error) {
      toast.error("Invalid OTP code. Please try again.");
    } else {
      toast.success("Welcome back!");
      router.push("/marketplace");
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
        <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to your AgriPulse account
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        {step === "phone" ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Phone Number
              </label>
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
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Enter 6-digit code
              </label>
              <Input
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                maxLength={6}
                className="text-center text-lg tracking-[0.5em]"
              />
              <p className="mt-2 text-xs text-gray-500">
                Code sent to +63{phone.replace(/^0/, "")}
              </p>
            </div>
            <Button type="submit" size="xl" className="w-full" loading={loading}>
              Verify & Sign In
            </Button>
            <button
              type="button"
              onClick={() => setStep("phone")}
              className="w-full text-center text-sm text-gray-500 hover:text-primary"
            >
              Use a different number
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
