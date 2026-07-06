import type { Metadata } from "next";
import { FarmerDashboardContent } from "./dashboard-content";

export const metadata: Metadata = {
  title: "Farmer Dashboard",
};

export default function FarmerDashboardPage() {
  return <FarmerDashboardContent />;
}
