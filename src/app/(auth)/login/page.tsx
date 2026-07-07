"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/logo";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  function validateEmail(value: string): boolean {
    if (!value.trim()) {
      setEmailError("Email address is required");
      return false;
    }
    if (value.length > 255) {
      setEmailError("Email must be 255 characters or fewer");
      return false;
    }
    if (!EMAIL_REGEX.test(value)) {
      setEmailError("Please enter a valid email address (e.g. name@example.com)");
      return false;
    }
    setEmailError("");
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");

    if (!validateEmail(email)) return;
    if (!password) {
      setPasswordError("Password is required");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message?.toLowerCase().includes("invalid login credentials")) {
        setPasswordError("Invalid email or password");
      } else if (error.message?.toLowerCase().includes("email not confirmed")) {
        toast.error("Please verify your email before signing in. Check your inbox.");
      } else {
        toast.error(error.message || "Something went wrong. Please try again.");
      }
      setLoading(false);
      return;
    }

    if (data.user) {
      // Sync user to database (creates record if missing)
      await fetch("/api/auth/sync-user", { method: "POST" });
      const role = data.user.user_metadata?.role;
      toast.success("Welcome back!");
      router.push(role === "farmer" ? "/dashboard" : "/marketplace");
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Logo className="justify-center mb-2" showText={true} iconSize="h-14 w-14" imageWidth={56} imageHeight={56} />
        <h1 className="mt-3 text-2xl font-bold text-gray-900">Welcome back!</h1>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to your AgriPulse account
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <Input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) validateEmail(e.target.value);
              }}
              aria-invalid={!!emailError}
              aria-describedby={emailError ? "login-email-error" : undefined}
            />
            {emailError && (
              <p
                id="login-email-error"
                className="mt-1.5 text-xs text-red-600"
                role="alert"
              >
                {emailError}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="login-password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError("");
                }}
                aria-invalid={!!passwordError}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {passwordError && (
              <p className="mt-1.5 text-xs text-red-600" role="alert">
                {passwordError}
              </p>
            )}
          </div>
          <Button type="submit" size="xl" className="w-full" loading={loading}>
            Sign In
          </Button>
        </form>

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
