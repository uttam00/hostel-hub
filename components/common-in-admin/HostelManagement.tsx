"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminApi } from "@/services/api";
import { Hostel, HostelAdmin } from "@/types";
import { Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { TableLoader } from "../ui/loader";

interface HostelManagementProps {
  hostels: Hostel[];
  userRole: string;
  loading: boolean;
}

export default function HostelManagement({
  hostels,
  userRole,
  loading,
}: HostelManagementProps) {
  const isSuperAdmin = userRole === Role.SUPER_ADMIN;
  const router = useRouter();
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const [admins, setAdmins] = useState<HostelAdmin[]>([]);
  const [newAdminId, setNewAdminId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchHostelAdmins = async (hostelId: string) => {
    try {
      const response = await adminApi.getByHostel(hostelId);
      setAdmins(response);
    } catch (error) {
      console.error("Error fetching hostel admins:", error);
      toast.error("Failed to fetch hostel admins");
    }
  };

  const handleAddAdmin = async (hostelId: string, adminId: string) => {
    try {
      await adminApi.assignHostel(adminId, [hostelId]);
      toast.success("Admin added successfully");
      fetchHostelAdmins(hostelId);
    } catch (error) {
      console.error("Error adding admin:", error);
      toast.error("Failed to add admin");
    }
  };

  const handleRemoveAdmin = async (hostelId: string, adminId: string) => {
    try {
      await adminApi.unassignHostel(adminId, hostelId);
      toast.success("Admin removed successfully");
      fetchHostelAdmins(hostelId);
    } catch (error) {
      console.error("Error removing admin:", error);
      toast.error("Failed to remove admin");
    }
  };

  const handleViewAdmins = (hostel: Hostel) => {
    setSelectedHostel(hostel);
    fetchHostelAdmins(hostel.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hostel Management</h2>
        {isSuperAdmin && (
          <Button onClick={() => router.push("/super-admin/hostels/new")}>
            Add New Hostel
          </Button>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Rooms</TableHead>
              {/* <TableHead>Rating</TableHead> */}
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <TableLoader />
                </TableCell>
              </TableRow>
            ) : (
              hostels.map((hostel) => (
                <TableRow key={hostel.id}>
                  <TableCell className="font-medium">{hostel.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {hostel.description}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div>{hostel.address}</div>
                      <div className="text-sm text-muted-foreground">
                        {hostel.city}, {hostel.state} {hostel.zipCode}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div>
                        Available: {hostel.availableRooms}/{hostel.totalRooms}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Types:{" "}
                        {[
                          ...new Set(hostel.rooms.map((room) => room.roomType)),
                        ].join(", ")}
                      </div>
                    </div>
                  </TableCell>
                  {/* <TableCell>
                <div className="space-y-1">
                  <div>{hostel.averageRating} ⭐</div>
                  <div className="text-sm text-muted-foreground">
                    ({hostel.reviewCount} reviews)
                  </div>
                </div>
              </TableCell> */}
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        hostel.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {hostel.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {isSuperAdmin && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              onClick={() => handleViewAdmins(hostel)}
                            >
                              Manage Admins
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Manage Hostel Admins</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="newAdmin">Add New Admin</Label>
                                <div className="flex gap-2">
                                  <Input
                                    id="newAdmin"
                                    value={newAdminId}
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>
                                    ) => setNewAdminId(e.target.value)}
                                    placeholder="Enter user ID"
                                  />
                                  <Button
                                    onClick={() =>
                                      handleAddAdmin(hostel.id, newAdminId)
                                    }
                                    disabled={isLoading || !newAdminId}
                                  >
                                    Add
                                  </Button>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label>
                                  {selectedHostel?.name}'s Current Admins
                                </Label>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Name</TableHead>
                                      <TableHead>Email</TableHead>
                                      <TableHead>Actions</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {admins.map((admin) => (
                                      <TableRow key={admin.id}>
                                        <TableCell>{admin.name}</TableCell>
                                        <TableCell>{admin.email}</TableCell>
                                        <TableCell>
                                          <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() =>
                                              handleRemoveAdmin(
                                                hostel.id,
                                                admin.id
                                              )
                                            }
                                            disabled={isLoading}
                                          >
                                            Remove
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                      <Button
                        variant="outline"
                        onClick={() =>
                          router.push(
                            `/${
                              isSuperAdmin ? "super-admin" : "hostel-admin"
                            }/hostels/${hostel.id}/edit`
                          )
                        }
                      >
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
