"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ConsoleLayout from "@/components/ConsoleLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

export default function NewHostedZonePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Hosted zone name is required.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/hosted-zones/", {
        name: name.trim(),
        comment: comment.trim() || null,
      });
      toast.success(`Hosted zone "${name}" created successfully.`);
      router.push("/hosted-zones");
    } catch (error: any) {
      console.error(error);
      const detail = error.response?.data?.detail || "Failed to create hosted zone.";
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConsoleLayout>
      <div className="space-y-6 max-w-2xl">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2">
          <Link href="/hosted-zones" className="text-sm text-blue-600 hover:underline flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            Back to Hosted Zones
          </Link>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create hosted zone</h1>
          <p className="text-sm text-gray-500">
            A hosted zone contains DNS records that define how you want to route traffic on the internet.
          </p>
        </div>

        {/* Form Card */}
        <Card className="aws-card bg-white">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="text-base font-bold text-gray-800">Hosted zone configuration</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 block">
                  Domain name <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="example.com"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="max-w-md"
                />
                <p className="text-xs text-gray-500">
                  Enter the name of the domain that you want to route traffic for.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 block">
                  Comment
                </label>
                <Input
                  placeholder="Optional comment about this zone"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  disabled={loading}
                  className="max-w-md"
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-2 bg-gray-50/50">
              <Link href="/hosted-zones">
                <Button type="button" variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="aws-orange" disabled={loading}>
                {loading ? "Creating..." : "Create hosted zone"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </ConsoleLayout>
  );
}
