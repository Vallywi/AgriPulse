"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ShoppingCart, Wheat, UtensilsCrossed, Store, Sprout, Mail, Eye, EyeOff } from "lucide-react";
import type { UserRole } from "@/types";

const ROLES: { value: UserRole; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
  { value: "consumer", label: "Buyer", icon: ShoppingCart, desc: "Buy fresh produce" },
  { value: "farmer", label: "Farmer", icon: Wheat, desc: "Sell your harvest" },
  { value: "restaurant", label: "Restaurant", icon: UtensilsCrossed, desc: "Bulk ordering" },
  { value: "grocery", label: "Grocery", icon: Store, desc: "Wholesale supply" },
];

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

function isValidEmail(email: string): boolean {
  if (email.length > 255) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

export default function RegisterPage() {
  const supabase = createClient();
  const router = useRouter();

  const [step, setStep] = useState<"role" | "details" | "pending">("role");
  const [role, setRole] = useState<UserRole>("consumer");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Countdown timer for resend throttle
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const sendVerificationEmail = useCallback(async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + "/auth/callback",
        data: {
          first_name: firstName,
          last_name: lastName,
          role,
          age: age ? parseInt(age) : null,
          gender: gender || null,
        },
      },
    });

    // If signup succeeded and we got a session, user is auto-confirmed
    if (!error && data?.session) {
      return { error: null, autoConfirmed: true };
    }

    return { error, autoConfirmed: false };
  }, [supabase, email, password, firstName, lastName, role, age, gender]);

  async function handleSubmitDetails(e: React.FormEvent) {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address (e.g. name@example.com)");
      return;
    }

    if (!isValidPassword(password)) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error, autoConfirmed } = await sendVerificationEmail();

    if (error) {
      if (error.message?.toLowerCase().includes("already registered") || error.message?.toLowerCase().includes("already been registered")) {
        setEmailError("This email is already in use");
      } else if (error.message?.toLowerCase().includes("rate_limit") || error.message?.toLowerCase().includes("rate limit")) {
        toast.error("Too many attempts. Please wait a few minutes and try again.");
      } else if (error.message?.toLowerCase().includes("email_address_invalid")) {
        setEmailError("Please use a valid email address");
      } else {
        toast.error(error.message || "Something went wrong. Please try again.");
      }
    } else if (autoConfirmed) {
      // User was auto-confirmed (email confirmation disabled in Supabase)
      // Sync user to database
      await fetch("/api/auth/sync-user", { method: "POST" });
      toast.success("Account created! Welcome to AgriPulse");
      router.push(role === "farmer" ? "/dashboard" : "/marketplace");
      router.refresh();
    } else {
      // Email confirmation required — try signing in directly first
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (!signInError) {
        await fetch("/api/auth/sync-user", { method: "POST" });
        toast.success("Account created! Welcome to AgriPulse");
        router.push(role === "farmer" ? "/dashboard" : "/marketplace");
        router.refresh();
      } else {
        // Truly requires email confirmation
        setResendCooldown(60);
        setStep("pending");
      }
    }

    setLoading(false);
  }

  async function handleResend() {
    if (resendCooldown > 0) return;

    setLoading(true);
    const { error } = await sendVerificationEmail();

    if (error) {
      toast.error(error.message || "Failed to resend. Please try again.");
    } else {
      toast.success("Verification email resent");
      setResendCooldown(60);
    }

    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary">
          <Sprout className="h-7 w-7" />
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
              {ROLES.map((r) => {
                const Icon = r.icon;
                return (
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
                    <Icon className="h-6 w-6" />
                    <span className="mt-1 text-sm font-medium">{r.label}</span>
                    <span className="mt-0.5 text-[10px] text-gray-500">{r.desc}</span>
                  </button>
                );
              })}
            </div>
            <Button size="xl" className="w-full" onClick={() => setStep("details")}>
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: Personal details with email */}
        {step === "details" && (
          <form onSubmit={handleSubmitDetails} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">First Name</label>
                <Input
                  placeholder="Juan"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  maxLength={50}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">Last Name</label>
                <Input
                  placeholder="Dela Cruz"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  maxLength={50}
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">Email Address</label>
              <Input
                type="email"
                placeholder="juan@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                required
                maxLength={255}
              />
              {emailError && (
                <p className="mt-1.5 text-xs text-red-600">{emailError}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">Age</label>
                <Input
                  type="number"
                  placeholder="25"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min={13}
                  max={120}
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                  className="flex h-12 w-full rounded-xl border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="" disabled>Select</option>
                  {GENDER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">Confirm Password</label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (passwordError) setPasswordError("");
                }}
                required
                minLength={8}
              />
              {passwordError && (
                <p className="mt-1.5 text-xs text-red-600">{passwordError}</p>
              )}
            </div>
            <Button type="submit" size="xl" className="w-full" loading={loading}>
              Create Account
            </Button>
            <button type="button" onClick={() => setStep("role")} className="w-full text-center text-sm text-gray-500">
              ← Back
            </button>
          </form>
        )}

        {/* Step 3: Pending verification */}
        {step === "pending" && (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Check your inbox</h2>
              <p className="mt-2 text-sm text-gray-600">
                We sent a verification link to{" "}
                <span className="font-medium text-gray-900">{email}</span>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Click the link in the email to complete your registration.
              </p>
            </div>
            <Button
              variant="outline"
              size="xl"
              className="w-full"
              onClick={handleResend}
              disabled={resendCooldown > 0 || loading}
              loading={loading}
            >
              {resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : "Resend verification email"}
            </Button>
          </div>
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
