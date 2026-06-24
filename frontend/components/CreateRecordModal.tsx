"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/lib/api";

interface RecordData {
  id?: number;
  name: string;
  type: string;
  value: string;
  ttl: number;
}

interface CreateRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  hostedZoneId: number;
  recordToEdit?: RecordData | null;
}

const RECORD_TYPES = ["A", "AAAA", "CNAME", "TXT", "MX", "NS", "PTR", "SRV", "CAA"];

export default function CreateRecordModal({
  isOpen,
  onClose,
  onSuccess,
  hostedZoneId,
  recordToEdit,
}: CreateRecordModalProps) {
  const isEdit = !!recordToEdit;
  const [name, setName] = useState("");
  const [type, setType] = useState("A");
  const [value, setValue] = useState("");
  const [ttl, setTtl] = useState(300);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (recordToEdit) {
      setName(recordToEdit.name);
      setType(recordToEdit.type);
      setValue(recordToEdit.value);
      setTtl(recordToEdit.ttl);
    } else {
      setName("");
      setType("A");
      setValue("");
      setTtl(300);
    }
  }, [recordToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Record name is required.");
      return;
    }
    if (!value.trim()) {
      toast.error("Record value is required.");
      return;
    }
    if (ttl < 0) {
      toast.error("TTL must be a positive number.");
      return;
    }

    setLoading(true);
    try {
      if (isEdit && recordToEdit) {
        await api.put(`/records/${recordToEdit.id}`, {
          name: name.trim(),
          type,
          value: value.trim(),
          ttl: Number(ttl),
        });
        toast.success(`Record updated successfully.`);
      } else {
        await api.post(`/hosted-zones/${hostedZoneId}/records`, {
          name: name.trim(),
          type,
          value: value.trim(),
          ttl: Number(ttl),
          hosted_zone_id: hostedZoneId,
        });
        toast.success(`Record created successfully.`);
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      const detail = error.response?.data?.detail || "Failed to save record.";
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit record" : "Create record"}</DialogTitle>
          <DialogDescription>
            Configure routing settings for your domain name. Choose the record type and add value destination.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Record Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700 block">
              Record name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="e.g. www"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-gray-500">
              The subdomain name (e.g. "www" for www.example.com).
            </p>
          </div>

          {/* Type & TTL Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 block">
                Record type <span className="text-red-500">*</span>
              </label>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value)}
                disabled={loading}
              >
                {RECORD_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 block">
                TTL (Seconds) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                min="0"
                value={ttl}
                onChange={(e) => setTtl(Number(e.target.value))}
                disabled={loading}
              />
            </div>
          </div>

          {/* Record Value */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700 block">
              Value/Route traffic to <span className="text-red-500">*</span>
            </label>
            <textarea
              className="flex min-h-[80px] w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="e.g. 192.0.2.1"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-gray-500">
              The destination address (e.g. IPv4 for A, domain name for CNAME, or quotes-surrounded text for TXT).
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="aws-orange"
              disabled={loading}
            >
              {loading ? "Saving..." : isEdit ? "Save record" : "Create record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
