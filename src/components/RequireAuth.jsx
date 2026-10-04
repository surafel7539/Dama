"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function RequireAuth({ children, seller = false }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      toast.error("Please sign in to continue.");
      router.replace("/login");
      return;
    }

    if (seller) {
      const isPremium =
        user?.isPremium || localStorage.getItem("isPremium") === "true";
      if (!isPremium) router.replace("/upgrade");
    }
  }, [user, loading, seller, router]);

  if (loading || !user) return null;

  if (seller) {
    const isPremium =
      user?.isPremium || localStorage.getItem("isPremium") === "true";
    if (!isPremium) return null;
  }

  return children;
}
