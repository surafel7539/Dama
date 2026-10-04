"use client";

import UpgradePayment from "@/views/UpgradePayment";
import RequireAuth from "@/components/RequireAuth";
import { useNavigateTo } from "@/context/NavigationContext";

export default function UpgradePage() {
  const navigateTo = useNavigateTo();
  return (
    <RequireAuth>
      <UpgradePayment navigateTo={navigateTo} />
    </RequireAuth>
  );
}
