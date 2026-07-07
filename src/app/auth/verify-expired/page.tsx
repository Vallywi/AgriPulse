"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyExpiredPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary-50 to-white px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
            <Clock className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Link Expired</h1>
          <p className="mt-2 text-sm text-gray-600">
            Your verification link has expired or is invalid. Please request a
            new one.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="space-y-3">
            <Button asChild size="lg" className="w-full">
              <Link href="/login">Back to Login</Link>
            </Button>
            <p className="text-center text-xs text-gray-500">
              Sign in again to request a new verification link
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
