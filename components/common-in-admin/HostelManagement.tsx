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
import { adminApi, hostelApi } from "@/services/api";
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

  // State declarations
  const [isFetchingAdmin, setIsFetchingAdmin] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);

  const [admins, setAdmins] = useState<
    Array<Pick<HostelAdmin, "id" | "name" | "email">>
  >([]);
  const [newAdminId, setNewAdminId] = useState("");
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch hostel admins for a specific hostel
  const fetchHostelAdmins = async (hostelId: string) => {
    try {
      setIsFetchingAdmin(true);
      const response = await adminApi.getByHostel(hostelId);
      setAdmins(response.admins);
    } catch (error) {
      console.error("Error fetching hostel admins:", error);
      toast.error("Failed to fetch hostel admins");
    } finally {
      setIsFetchingAdmin(false);
    }
  };

  // Handle adding a new admin to a hostel
  const handleAddAdmin = async (hostelId: string, adminId: string) => {
    if (!adminId) return;
    try {
      setIsFetchingAdmin(true);
      await adminApi.assignHostel(adminId, [hostelId]);
      toast.success("Admin added successfully");
      setNewAdminId("");
      await fetchHostelAdmins(hostelId);
      setIsAdminDialogOpen(false);
    } catch (error) {
      console.error("Error adding admin:", error);
      toast.error("Failed to add admin");
    } finally {
      setIsFetchingAdmin(false);
    }
  };

  // Handle removing an admin from a hostel
  const handleRemoveAdmin = async (hostelId: string, adminId: string) => {
    try {
      setIsFetchingAdmin(true);
      await adminApi.unassignHostel(adminId, hostelId);
      toast.success("Admin removed successfully");
      await fetchHostelAdmins(hostelId);
    } catch (error) {
      console.error("Error removing admin:", error);
      toast.error("Failed to remove admin");
    } finally {
      setIsFetchingAdmin(false);
    }
  };

  // Handle viewing admins for a specific hostel
  const handleViewAdmins = (hostel: Hostel) => {
    setSelectedHostel(hostel);
    setIsAdminDialogOpen(true);
    fetchHostelAdmins(hostel.id);
  };

  // Handle hostel deletion
  const handleDeleteHostel = async (hostelId: string) => {
    setIsDeleting(true);
    try {
      await hostelApi.delete(hostelId);
      toast.success("Hostel deleted successfully");
      setIsDeleteDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting hostel:", error);
      toast.error("Failed to delete hostel");
    } finally {
      setIsDeleting(false);
      setSelectedHostel(null);
    }
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
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <TableLoader />
                </TableCell>
              </TableRow>
            ) : hostels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No hostels found
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
                    <div className="flex gap-2 justify-center">
                      {isSuperAdmin && (
                        <Dialog
                          open={
                            isAdminDialogOpen &&
                            selectedHostel?.id === hostel.id
                          }
                          onOpenChange={(open) => {
                            setIsAdminDialogOpen(open);
                            if (!open) setSelectedHostel(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              onClick={() => handleViewAdmins(hostel)}
                            >
                              Manage Admins
                            </Button>
                          </DialogTrigger>
                          <DialogContent
                            onInteractOutside={(e) => e.preventDefault()}
                          >
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
                                    disabled={isFetchingAdmin}
                                  />
                                  <Button
                                    onClick={() =>
                                      handleAddAdmin(hostel.id, newAdminId)
                                    }
                                    disabled={isFetchingAdmin || !newAdminId}
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
                                    {loading ? (
                                      <TableRow>
                                        <TableCell colSpan={3}>
                                          <TableLoader />
                                        </TableCell>
                                      </TableRow>
                                    ) : admins.length === 0 &&
                                      !isFetchingAdmin ? (
                                      <TableRow>
                                        <TableCell
                                          colSpan={3}
                                          className="text-center"
                                        >
                                          No admins assigned
                                        </TableCell>
                                      </TableRow>
                                    ) : (
                                      admins.map((admin) => (
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
                                              disabled={isFetchingAdmin}
                                            >
                                              Remove
                                            </Button>
                                          </TableCell>
                                        </TableRow>
                                      ))
                                    )}
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
                      {isSuperAdmin && (
                        <Dialog
                          open={
                            isDeleteDialogOpen &&
                            selectedHostel?.id === hostel.id
                          }
                          onOpenChange={(open) => {
                            setIsDeleteDialogOpen(open);
                            if (!open) setSelectedHostel(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              onClick={() => {
                                setSelectedHostel(hostel);
                                setIsDeleteDialogOpen(true);
                              }}
                              disabled={isDeleting}
                            >
                              Delete
                            </Button>
                          </DialogTrigger>
                          <DialogContent
                            onInteractOutside={(e) => e.preventDefault()}
                          >
                            <DialogHeader>
                              <DialogTitle>Delete Hostel</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <p>
                                Are you sure you want to delete{" "}
                                <strong>{selectedHostel?.name}</strong>? This
                                action cannot be undone.
                              </p>
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => setIsDeleteDialogOpen(false)}
                                  disabled={isDeleting}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleDeleteHostel(hostel.id)}
                                  disabled={isDeleting}
                                >
                                  {isDeleting ? "Deleting..." : "Delete"}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
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
