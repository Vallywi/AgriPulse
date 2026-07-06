import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { ShieldCheck, FileText, ExternalLink } from "lucide-react";

export const metadata: Metadata = { title: "Farmer Verification" };

export default async function AdminVerificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: verifications } = await supabase
    .from("farmer_verification")
    .select(`*, farmers!inner(farm_name, province, municipality, users!inner(first_name, last_name, phone))`)
    .order("submitted_at", { ascending: false })
    .limit(50);

  const pending = (verifications ?? []).filter((v: any) => v.status === "pending");
  const reviewed = (verifications ?? []).filter((v: any) => v.status !== "pending");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Farmer Verification</h1>
        <p className="text-sm text-gray-500">{pending.length} pending review</p>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-700">Pending Review</h2>
          {pending.map((v: any) => (
            <Card key={v.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {v.farmers?.users?.first_name} {v.farmers?.users?.last_name}
                  </p>
                  <p className="text-sm text-gray-600">{v.farmers?.farm_name}</p>
                  <p className="text-xs text-gray-500">
                    {v.farmers?.municipality}, {v.farmers?.province}
                  </p>
                </div>
                <Badge variant="warning">Pending</Badge>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="flex items-center gap-1 text-gray-500">
                  <FileText className="h-3 w-3" /> {v.valid_id_type}
                </span>
                <span className="text-gray-400">Submitted {formatDate(v.submitted_at)}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 gap-1">
                  <ShieldCheck className="h-3 w-3" /> Approve
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Reject
                </Button>
                {v.valid_id_url && (
                  <Button size="sm" variant="ghost" className="gap-1" asChild>
                    <a href={v.valid_id_url} target="_blank" rel="noopener">
                      <ExternalLink className="h-3 w-3" /> View ID
                    </a>
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Reviewed */}
      {reviewed.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-700">Previously Reviewed</h2>
          {reviewed.map((v: any) => (
            <Card key={v.id} className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-gray-900">{v.farmers?.farm_name}</p>
                <p className="text-xs text-gray-500">{formatDate(v.submitted_at)}</p>
              </div>
              <Badge variant={v.status === "approved" ? "success" : "destructive"}>
                {v.status}
              </Badge>
            </Card>
          ))}
        </div>
      )}

      {(!verifications || verifications.length === 0) && (
        <div className="py-12 text-center text-sm text-gray-400">
          <ShieldCheck className="mx-auto mb-2 h-8 w-8" />
          No verification requests
        </div>
      )}
    </div>
  );
}
