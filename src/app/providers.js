"use client";

import { AuthProvider } from "@/context/AuthContext";
import { ShopProvider } from "@/context/ShopContext";
import { NavigationProvider } from "@/context/NavigationContext";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <ShopProvider>
        <NavigationProvider>{children}</NavigationProvider>
      </ShopProvider>
    </AuthProvider>
  );
}
