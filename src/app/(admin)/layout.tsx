import Link from "next/link";
import { LayoutDashboard, Users, ShieldCheck, Package, BarChart3, FileText } from "lucide-react";
import { Logo } from "@/components/logo";

const ADMIN_NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/verifications", label: "Verification", icon: ShieldCheck },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/reports", label: "Reports", icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 lg:pl-64">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 border-r bg-white lg:block">
        <div className="flex h-14 items-center gap-2 border-b px-6">
          <Logo showText={true} iconSize="h-8 w-8" imageWidth={32} imageHeight={32} />
          <span className="ml-auto rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">ADMIN</span>
        </div>
        <nav className="p-4 space-y-1">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-primary-50 hover:text-primary"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="p-4 lg:p-6">{children}</main>
    </div>
  );
}
