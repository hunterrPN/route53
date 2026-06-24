"use client";

import { useState } from "react";
import Link from "next/link";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowUpDown, Trash2, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HostedZone {
  id: number;
  name: string;
  comment: string | null;
  caller_reference: string;
  created_at: string;
}

interface HostedZoneTableProps {
  zones: HostedZone[];
  onDelete: (id: number) => void;
}

type SortField = "name" | "created_at";
type SortOrder = "asc" | "desc";

export default function HostedZoneTable({ zones, onDelete }: HostedZoneTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Filtering
  const filteredZones = zones.filter((zone) =>
    zone.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting
  const sortedZones = [...filteredZones].sort((a, b) => {
    let aVal: string | number = a[sortField] || "";
    let bVal: string | number = b[sortField] || "";

    if (sortField === "created_at") {
      aVal = new Date(a.created_at).getTime();
      bVal = new Date(b.created_at).getTime();
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Search Controls */}
      <div className="flex items-center gap-2 max-w-sm relative">
        <Search className="absolute left-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Filter hosted zones by name..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Main Table */}
      <div className="border border-[#eaeded] rounded bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">
                <button
                  onClick={() => toggleSort("name")}
                  className="flex items-center gap-1 hover:text-gray-900 font-semibold cursor-pointer"
                >
                  Domain name
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead className="w-[35%]">Comment</TableHead>
              <TableHead className="w-[15%]">
                <button
                  onClick={() => toggleSort("created_at")}
                  className="flex items-center gap-1 hover:text-gray-900 font-semibold cursor-pointer"
                >
                  Created at
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead className="w-[10%]">Type</TableHead>
              <TableHead className="w-[10%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedZones.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No hosted zones found.
                </TableCell>
              </TableRow>
            ) : (
              sortedZones.map((zone) => (
                <TableRow key={zone.id}>
                  <TableCell className="font-medium text-blue-600">
                    <Link
                      href={`/hosted-zones/${zone.id}`}
                      className="hover:underline flex items-center gap-1"
                    >
                      {zone.name}
                      <ExternalLink className="h-3 w-3 text-gray-400" />
                    </Link>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {zone.comment || <span className="text-gray-400 italic">No comment</span>}
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm">
                    {new Date(zone.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="aws-blue">Public</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(zone.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                      title="Delete hosted zone"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-xs text-gray-500 px-1">
        Showing {sortedZones.length} of {zones.length} hosted zones
      </div>
    </div>
  );
}
