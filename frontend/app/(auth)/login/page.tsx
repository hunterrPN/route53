"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { Globe, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import api from "@/lib/api";

export default function LoginPage() {
  const { setAuth, token } = useAuthStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      router.replace("/dashboard");
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      // Authenticate
      const res = await api.post("/auth/login", { email, password });
      const { access_token } = res.data;

      // Fetch user profile using token
      const profileRes = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      setAuth(access_token, profileRes.data);
      toast.success("Signed in successfully.");
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      const detail = err.response?.data?.detail || "Authentication failed. Check your credentials.";
      setErrorMsg(detail);
      toast.error("Sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#19222d] flex flex-col items-center justify-center p-4">
      {/* Container */}
      <div className="w-full max-w-[420px] space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center space-y-2">
          <div className="bg-[#ec7211] p-2 rounded flex items-center justify-center">
            <Globe className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-white font-bold text-lg tracking-wide uppercase">
            Amazon Web Services
          </h1>
          <p className="text-gray-400 text-sm">Sign in to AWS Route 53 Console</p>
        </div>

        {/* Card */}
        <div className="bg-[#232f3e] border border-gray-700/50 p-8 rounded shadow-2xl space-y-6">
          <h2 className="text-white font-bold text-xl">Sign in</h2>

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-200 text-xs p-3 rounded flex items-start gap-2">
              <ShieldAlert className="h-4.5 w-4.5 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-300 block">
                Email address
              </label>
              <Input
                type="email"
                placeholder="admin@demo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="bg-[#19222d] border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-300 block">
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="bg-[#19222d] border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-blue-500"
              />
            </div>

            <Button
              type="submit"
              variant="aws-orange"
              className="w-full text-sm py-2 font-bold shadow-md cursor-pointer"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* Seed credentials tips */}
          <div className="pt-4 border-t border-gray-700/50 text-xs text-gray-400 space-y-1">
            <p className="font-bold text-gray-300">Demo Credentials:</p>
            <p>Email: <code className="bg-[#19222d] px-1 py-0.5 rounded text-white select-all">admin@demo.com</code></p>
            <p>Password: <code className="bg-[#19222d] px-1 py-0.5 rounded text-white select-all">admin123</code></p>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-gray-500">
          <p>© 2026, Amazon Web Services, Inc. or its affiliates.</p>
        </div>
      </div>
    </main>
  );
}
