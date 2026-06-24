"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import ConsoleLayout from "@/components/ConsoleLayout";
import RecordTable from "@/components/RecordTable";
import CreateRecordModal from "@/components/CreateRecordModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, RefreshCw, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

interface HostedZone {
  id: number;
  name: string;
  comment: string | null;
  caller_reference: string;
  created_at: string;
}

interface RecordData {
  id: number;
  name: string;
  type: string;
  value: string;
  ttl: number;
}

interface PageProps {
  params: Promise<{ zoneId: string }>;
}

export default function HostedZoneDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const zoneId = Number(resolvedParams.zoneId);

  const [zone, setZone] = useState<HostedZone | null>(null);
  const [records, setRecords] = useState<RecordData[]>([]);
  const [loadingZone, setLoadingZone] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(true);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RecordData | null>(null);

  const fetchZoneDetails = async () => {
    setLoadingZone(true);
    try {
      const res = await api.get(`/hosted-zones/${zoneId}`);
      setZone(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load hosted zone details.");
    } finally {
      setLoadingZone(false);
    }
  };

  const fetchRecords = async () => {
    setLoadingRecords(true);
    try {
      const res = await api.get(`/hosted-zones/${zoneId}/records`);
      setRecords(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load DNS records.");
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    if (zoneId) {
      fetchZoneDetails();
      fetchRecords();
    }
  }, [zoneId]);

  const handleEditTrigger = (record: RecordData) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleCreateTrigger = () => {
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  const handleDeleteRecord = async (id: number) => {
    const targetRecord = records.find((r) => r.id === id);
    if (!targetRecord) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the record "${targetRecord.name}" (${targetRecord.type})?`
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/records/${id}`);
      toast.success(`Record deleted successfully.`);
      fetchRecords();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete record.");
    }
  };

  if (loadingZone && !zone) {
    return (
      <ConsoleLayout>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </ConsoleLayout>
    );
  }

  if (!zone) {
    return (
      <ConsoleLayout>
        <div className="space-y-4">
          <Link href="/hosted-zones" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to Hosted Zones
          </Link>
          <div className="bg-red-50 border border-red-200 p-4 rounded text-red-800">
            Hosted Zone not found or access denied.
          </div>
        </div>
      </ConsoleLayout>
    );
  }

  return (
    <ConsoleLayout>
      <div className="space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2">
          <Link href="/hosted-zones" className="text-sm text-blue-600 hover:underline flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            Hosted zones
          </Link>
          <span className="text-gray-400 text-sm">/</span>
          <span className="text-gray-500 text-sm">{zone.name}</span>
        </div>

        {/* Title bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{zone.name}</h1>
            <p className="text-sm text-gray-500">Hosted zone details and records configuration.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={fetchRecords}
              className="bg-white"
              disabled={loadingRecords}
              title="Refresh records"
            >
              <RefreshCw className={`h-4 w-4 text-gray-600 ${loadingRecords ? "animate-spin" : ""}`} />
            </Button>
            <Button
              variant="aws-orange"
              className="flex items-center gap-1.5 cursor-pointer"
              onClick={handleCreateTrigger}
            >
              <Plus className="h-4 w-4" />
              Create record
            </Button>
          </div>
        </div>

        {/* Hosted Zone metadata summary */}
        <Card className="aws-card bg-white">
          <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500 font-bold uppercase text-xs tracking-wider">Hosted zone ID</p>
              <p className="text-gray-900 font-mono mt-1 font-semibold">{zone.id}</p>
            </div>
            <div>
              <p className="text-gray-500 font-bold uppercase text-xs tracking-wider">Domain name</p>
              <p className="text-gray-900 mt-1 font-semibold">{zone.name}</p>
            </div>
            <div>
              <p className="text-gray-500 font-bold uppercase text-xs tracking-wider">Created at</p>
              <p className="text-gray-900 mt-1">{new Date(zone.created_at).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500 font-bold uppercase text-xs tracking-wider">Caller reference</p>
              <p className="text-gray-900 font-mono mt-1 text-xs truncate" title={zone.caller_reference}>
                {zone.caller_reference}
              </p>
            </div>
          </div>
          {zone.comment && (
            <div className="px-5 pb-5 border-t border-gray-100 pt-3 text-sm text-gray-600">
              <span className="font-bold text-gray-700">Comment:</span> {zone.comment}
            </div>
          )}
        </Card>

        {/* Records list header */}
        <div className="space-y-4 pt-2">
          <h2 className="text-lg font-bold text-gray-800">Records ({records.length})</h2>

          {loadingRecords && records.length === 0 ? (
            <div className="flex justify-center items-center py-20 bg-white border rounded">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <RecordTable
              records={records}
              onEdit={handleEditTrigger}
              onDelete={handleDeleteRecord}
            />
          )}
        </div>

        {/* Create/Edit Record Modal */}
        <CreateRecordModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchRecords}
          hostedZoneId={zone.id}
          recordToEdit={editingRecord}
        />
      </div>
    </ConsoleLayout>
  );
}
