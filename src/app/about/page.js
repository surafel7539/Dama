"use client";

import About from "@/views/About";
import { useNavigateTo } from "@/context/NavigationContext";

export default function AboutPage() {
  const navigateTo = useNavigateTo();
  return <About navigateTo={navigateTo} />;
}
