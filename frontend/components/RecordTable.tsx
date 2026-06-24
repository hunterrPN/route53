"use client";

import { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowUpDown, Trash2, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RecordData {
  id: number;
  name: string;
  type: string;
  value: string;
  ttl: number;
}

interface RecordTableProps {
  records: RecordData[];
  onEdit: (record: RecordData) => void;
  onDelete: (id: number) => void;
}

type SortField = "name" | "type" | "ttl";
type SortOrder = "asc" | "desc";

export default function RecordTable({ records, onEdit, onDelete }: RecordTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Filtering (Filter by Name or Value)
  const filteredRecords = records.filter((rec) =>
    rec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = (bVal as string).toLowerCase();
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
      {/* Search Input */}
      <div className="flex items-center gap-2 max-w-sm relative">
        <Search className="absolute left-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Filter records by name or value..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Records Table */}
      <div className="border border-[#eaeded] rounded bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">
                <button
                  onClick={() => toggleSort("name")}
                  className="flex items-center gap-1 hover:text-gray-900 font-semibold cursor-pointer"
                >
                  Record name
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead className="w-[15%]">
                <button
                  onClick={() => toggleSort("type")}
                  className="flex items-center gap-1 hover:text-gray-900 font-semibold cursor-pointer"
                >
                  Type
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead className="w-[35%]">Value/Route traffic to</TableHead>
              <TableHead className="w-[10%]">
                <button
                  onClick={() => toggleSort("ttl")}
                  className="flex items-center gap-1 hover:text-gray-900 font-semibold cursor-pointer"
                >
                  TTL (s)
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead className="w-[10%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No records found for this hosted zone.
                </TableCell>
              </TableRow>
            ) : (
              sortedRecords.map((rec) => (
                <TableRow key={rec.id}>
                  <TableCell className="font-semibold text-gray-900 font-mono">
                    {rec.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono bg-gray-50 text-gray-800">
                      {rec.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-gray-600 break-all">
                    {rec.value}
                  </TableCell>
                  <TableCell className="text-gray-600 font-mono">
                    {rec.ttl}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(rec)}
                        className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                        title="Edit record"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(rec.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-xs text-gray-500 px-1">
        Showing {sortedRecords.length} of {records.length} records
      </div>
    </div>
  );
}
