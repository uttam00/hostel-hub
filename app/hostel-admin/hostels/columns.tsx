"use client";

import { ColumnDef, Row, Table, RowData } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export type Hostel = {
  id: string;
  name: string;
  address: string;
  totalRooms: number;
  occupiedRooms: number;
  adminName: string;
  status: "active" | "inactive";
};

declare module "@tanstack/table-core" {
  interface TableMeta<TData> {
    onDelete: (hostel: Hostel) => void;
  }
}

export const columns: ColumnDef<Hostel>[] = [
  {
    accessorKey: "name",
    header: "Hostel Name",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalRooms",
    header: "Total Rooms",
  },
  {
    accessorKey: "occupiedRooms",
    header: "Occupied Rooms",
  },
  {
    accessorKey: "adminName",
    header: "Admin",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: { row: Row<Hostel> }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "active" ? "default" : "secondary"}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const hostel = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                (window.location.href = `/super-admin/hostels/${hostel.id}/edit`)
              }
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const onDelete = table.options.meta?.onDelete;
                if (onDelete) onDelete(hostel);
              }}
              className="text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
