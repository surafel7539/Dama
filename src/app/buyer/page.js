"use client";

import BuyerDashboard from "@/views/BuyerDashboard";
import RequireAuth from "@/components/RequireAuth";
import { useNavigateTo } from "@/context/NavigationContext";

export default function BuyerPage() {
  const navigateTo = useNavigateTo();
  return (
    <RequireAuth>
      <BuyerDashboard navigateTo={navigateTo} />
    </RequireAuth>
  );
}
