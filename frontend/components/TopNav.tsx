"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { Globe, LogOut, User, Search, HelpCircle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TopNav() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="h-[50px] bg-[#19222d] text-white flex items-center justify-between px-4 select-none z-40 relative">
      {/* Brand Logo */}
      <div className="flex items-center gap-2">
        <div className="bg-[#ec7211] p-1 rounded-sm flex items-center justify-center">
          <Globe className="h-4 w-4 text-white" />
        </div>
        <span className="font-bold text-sm tracking-wide hover:text-gray-200 cursor-pointer">
          aws
        </span>
        <span className="text-gray-400 text-xs px-2 border-l border-gray-600">
          Route 53
        </span>
      </div>

      {/* Global Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-lg mx-8 relative">
        <Search className="absolute left-3 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search for resources, services, and docs (e.g. Route 53)"
          className="w-full bg-[#2e3b4e] text-sm text-white placeholder-gray-400 rounded-sm py-1.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-transparent focus:border-transparent transition-all"
        />
      </div>

      {/* Action Icons & User Profile */}
      <div className="flex items-center gap-4">
        {/* Help & notifications */}
        <button className="text-gray-300 hover:text-white transition-colors cursor-pointer">
          <HelpCircle className="h-4.5 w-4.5" />
        </button>
        <button className="text-gray-300 hover:text-white transition-colors cursor-pointer relative">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute -top-1 -right-1 bg-[#ec7211] h-2 w-2 rounded-full"></span>
        </button>

        {/* User profile dropdown / indicator */}
        {mounted && user ? (
          <div className="flex items-center gap-3 pl-3 border-l border-gray-600">
            <div className="flex items-center gap-1.5 bg-[#2e3b4e] px-3 py-1 rounded-sm hover:bg-[#3e4f66] transition-colors cursor-pointer text-xs font-semibold">
              <User className="h-3.5 w-3.5 text-gray-300" />
              <span>{user.email}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-300 hover:text-white hover:bg-transparent h-auto p-1 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
