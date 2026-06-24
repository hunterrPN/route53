"use client";

import { useEffect, useState } from "react";
import ConsoleLayout from "@/components/ConsoleLayout";
import HostedZoneTable from "@/components/HostedZoneTable";
import CreateZoneModal from "@/components/CreateZoneModal";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

interface HostedZone {
  id: number;
  name: string;
  comment: string | null;
  caller_reference: string;
  created_at: string;
}

export default function HostedZonesPage() {
  const [zones, setZones] = useState<HostedZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchHostedZones = async () => {
    setLoading(true);
    try {
      const res = await api.get("/hosted-zones/");
      setZones(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load hosted zones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostedZones();
  }, []);

  const handleDelete = async (id: number) => {
    const targetZone = zones.find((z) => z.id === id);
    if (!targetZone) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the hosted zone "${targetZone.name}"? This action will also delete all associated DNS records and cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/hosted-zones/${id}`);
      toast.success(`Hosted zone "${targetZone.name}" deleted successfully.`);
      // Refresh list
      fetchHostedZones();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete hosted zone.");
    }
  };

  return (
    <ConsoleLayout>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hosted zones</h1>
            <p className="text-sm text-gray-500">
              A hosted zone is a container for records, which define how you want to route traffic for a domain.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={fetchHostedZones}
              className="cursor-pointer bg-white"
              title="Refresh list"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 text-gray-600 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button
              variant="aws-orange"
              className="flex items-center gap-1.5 cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Create hosted zone
            </Button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded text-sm text-blue-800 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Public hosted zones</span> route traffic on the internet. 
            When you create a hosted zone, a set of 4 default NS records and an SOA record are mock-created by default. You can configure further records below.
          </div>
        </div>

        {/* Hosted Zones List Table */}
        {loading && zones.length === 0 ? (
          <div className="flex justify-center items-center py-20 bg-white border rounded">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <HostedZoneTable zones={zones} onDelete={handleDelete} />
        )}

        {/* Create Zone Modal */}
        <CreateZoneModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchHostedZones}
        />
      </div>
    </ConsoleLayout>
  );
}
