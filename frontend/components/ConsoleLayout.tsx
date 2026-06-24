"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import TopNav from "./TopNav";
import Sidebar from "./Sidebar";

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (mounted && !token) {
      router.replace("/login");
    }
  }, [token, router, mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#f2f3f3] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0066cc]"></div>
      </div>
    );
  }

  if (!token) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f2f3f3] text-gray-900">
      <TopNav />
      <div className="flex flex-1 h-[calc(100vh-50px)]">
        <Sidebar className="shrink-0" />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
