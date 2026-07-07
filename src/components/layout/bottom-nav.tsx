"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, ShoppingCart, Package, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/marketplace", label: "Shop", icon: ShoppingBag },
  { href: "/cart", label: "Cart", icon: ShoppingCart, badge: true },
  { href: "/orders", label: "Orders", icon: Package },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.getItemCount());

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/95 backdrop-blur-sm safe-bottom">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-1.5 transition-all duration-200 ease-out",
                isActive
                  ? "text-primary"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                {item.badge && itemCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
              <span
                className={cn(
                  "absolute bottom-0.5 h-1 w-1 rounded-full bg-primary transition-all duration-200 ease-out",
                  isActive ? "scale-100 opacity-100" : "scale-0 opacity-0"
                )}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
