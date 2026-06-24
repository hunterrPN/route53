"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ConsoleLayout from "@/components/ConsoleLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, ShieldAlert, HeartPulse, Network, Plus, ArrowRight } from "lucide-react";
import api from "@/lib/api";

export default function DashboardPage() {
  const [zoneCount, setZoneCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get("/hosted-zones/");
        setZoneCount(res.data.length);
      } catch (err) {
        console.error("Error fetching dashboard statistics", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <ConsoleLayout>
      <div className="space-y-6">
        {/* Title bar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Route 53 Dashboard</h1>
            <p className="text-sm text-gray-500">
              Centralized DNS routing, traffic management, and availability monitoring.
            </p>
          </div>
          <Link href="/hosted-zones">
            <Button variant="aws-orange" className="flex items-center gap-1.5 cursor-pointer">
              <Plus className="h-4 w-4" />
              Create hosted zone
            </Button>
          </Link>
        </div>

        {/* Resources Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="aws-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                Hosted zones
              </CardTitle>
              <Globe className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {loading ? (
                  <span className="text-gray-400 text-lg">Loading...</span>
                ) : (
                  zoneCount
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">DNS domains configured</p>
            </CardContent>
          </Card>

          <Card className="aws-card opacity-80">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                Health checks
              </CardTitle>
              <HeartPulse className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">0</div>
              <p className="text-xs text-gray-500 mt-1">Endpoint monitoring status</p>
            </CardContent>
          </Card>

          <Card className="aws-card opacity-80">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                Traffic policies
              </CardTitle>
              <ShieldAlert className="h-5 w-5 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">0</div>
              <p className="text-xs text-gray-500 mt-1">Advanced routing policy logs</p>
            </CardContent>
          </Card>

          <Card className="aws-card opacity-80">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                Resolvers
              </CardTitle>
              <Network className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">0</div>
              <p className="text-xs text-gray-500 mt-1">Inbound/Outbound VPC endpoints</p>
            </CardContent>
          </Card>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* DNS Management Panel */}
          <Card className="aws-card bg-white">
            <CardHeader>
              <CardTitle className="text-base font-bold text-gray-800">
                DNS Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                Route traffic for your domains (such as example.com) to websites, web servers, Amazon S3 buckets, or EC2 instances. You can configure routing policies like Simple, Weighted, Latency-based, or Failover.
              </p>
              <div className="pt-2">
                <Link href="/hosted-zones">
                  <Button variant="outline" size="sm" className="flex items-center gap-1 cursor-pointer">
                    Manage Hosted Zones
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Guides & Tips */}
          <Card className="aws-card bg-white">
            <CardHeader>
              <CardTitle className="text-base font-bold text-gray-800">
                Route 53 Cheat Sheet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600">
              <div className="border-b pb-2.5">
                <p className="font-bold text-gray-800">A Record</p>
                <p className="text-xs text-gray-500">Maps a domain name to an IPv4 address (e.g. 192.0.2.1).</p>
              </div>
              <div className="border-b pb-2.5">
                <p className="font-bold text-gray-800">AAAA Record</p>
                <p className="text-xs text-gray-500">Maps a domain name to an IPv6 address.</p>
              </div>
              <div className="border-b pb-2.5">
                <p className="font-bold text-gray-800">CNAME Record</p>
                <p className="text-xs text-gray-500">Redirects DNS queries to another domain name (alias).</p>
              </div>
              <div>
                <p className="font-bold text-gray-800">TXT Record</p>
                <p className="text-xs text-gray-500">Provides text information to sources outside your domain (often for verification).</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ConsoleLayout>
  );
}
