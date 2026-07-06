import { BottomNav } from "@/components/layout/bottom-nav";

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pb-16">
      <main>{children}</main>
      <BottomNav />
    </div>
  );
}
