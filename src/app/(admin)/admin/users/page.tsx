import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "User Management" };

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: users } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">User Management</h1>
        <p className="text-sm text-gray-500">{users?.length ?? 0} users registered</p>
      </div>

      <div className="space-y-3">
        {(users ?? []).map((u: any) => (
          <Card key={u.id} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary">
                {(u.first_name?.[0] ?? "").toUpperCase()}{(u.last_name?.[0] ?? "").toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {u.first_name} {u.last_name}
                </p>
                <p className="text-xs text-gray-500">{u.phone || u.email}</p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant={u.role === "admin" ? "destructive" : u.role === "farmer" ? "success" : "default"}>
                {u.role}
              </Badge>
              <p className="mt-1 text-[10px] text-gray-400">{formatDate(u.created_at)}</p>
            </div>
          </Card>
        ))}
        {(!users || users.length === 0) && (
          <p className="py-8 text-center text-sm text-gray-400">No users yet</p>
        )}
      </div>
    </div>
  );
}
