"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import api from "@/lib/api";

interface CreateZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateZoneModal({ isOpen, onClose, onSuccess }: CreateZoneModalProps) {
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
      setName("");
      setComment("");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      const detail = error.response?.data?.detail || "Failed to create hosted zone.";
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create hosted zone</DialogTitle>
          <DialogDescription>
            A hosted zone contains DNS records that define how you want to route traffic on the internet.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700 block">
              Domain name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="example.com"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
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
            />
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
              {loading ? "Creating..." : "Create hosted zone"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
