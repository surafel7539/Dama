"use client";

import Profile from "@/views/Profile";
import RequireAuth from "@/components/RequireAuth";
import { useNavigateTo } from "@/context/NavigationContext";

export default function ProfilePage() {
  const navigateTo = useNavigateTo();
  return (
    <RequireAuth>
      <Profile navigateTo={navigateTo} />
    </RequireAuth>
  );
}
