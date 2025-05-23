"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TableLoader } from "@/components/ui/loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { adminApi, hostelApi } from "@/services/api";
import { Hostel, HostelAdmin, HostelStatus } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface Admin extends HostelAdmin {}

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  // password: z.string().min(6, "Password must be at least 6 characters"),
});

const assignHostelSchema = z.object({
  hostelIds: z.array(z.string()).min(1, "Please select at least one hostel"),
});

export default function AdminsPage() {
  const { toast } = useToast();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      // password: "",
    },
  });

  const assignForm = useForm<z.infer<typeof assignHostelSchema>>({
    resolver: zodResolver(assignHostelSchema),
    defaultValues: {
      hostelIds: [],
    },
  });

  useEffect(() => {
    if (assignDialogOpen && selectedAdmin) {
      const initialHostelIds = selectedAdmin.hostels.map((hostel) => hostel.id);
      assignForm.reset({ hostelIds: initialHostelIds });
    }
  }, [assignDialogOpen, selectedAdmin, assignForm]);

  const fetchAdmins = async () => {
    try {
      const response = await adminApi.getAll();
      setAdmins(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch admins",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchHostels = async () => {
    try {
      const response = await hostelApi.getAll();
      setHostels(
        response.data.filter(
          (hostel: Hostel) => hostel.status === HostelStatus.ACTIVE
        )
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch hostels",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchHostels();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await adminApi.create(values);

      toast({
        title: "Success",
        description: "Admin created successfully",
      });
      setDialogOpen(false);
      form.reset();
      fetchAdmins();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const onAssignHostel = async (values: z.infer<typeof assignHostelSchema>) => {
    if (!selectedAdmin) return;

    try {
      await adminApi.assignHostel(selectedAdmin.id, values.hostelIds);

      toast({
        title: "Success",
        description: "Hostels assigned to admin successfully",
      });
      setAssignDialogOpen(false);
      assignForm.reset();
      fetchAdmins();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    try {
      await adminApi.delete(adminId);

      toast({
        title: "Success",
        description: "Admin deleted successfully",
      });
      setDeleteDialogOpen(false);
      setAdminToDelete(null);
      fetchAdmins();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto pb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Hostel Admins</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Admin</DialogTitle>
              <DialogDescription>
                Create a new hostel admin account.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <DialogFooter>
                  <Button type="submit">Create Admin</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Assigned Hostels</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <TableLoader />
                </TableCell>
              </TableRow>
            ) : admins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No admins found
                </TableCell>
              </TableRow>
            ) : (
              admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    {admin.hostels.map((hostel) => hostel.name).join(", ") ||
                      "Not assigned"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAdmin(admin);
                          setAssignDialogOpen(true);
                        }}
                      >
                        Assign Hostels
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setAdminToDelete(admin);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={assignDialogOpen}
        onOpenChange={(open) => {
          setAssignDialogOpen(open);
          if (!open) {
            assignForm.reset({ hostelIds: [] });
            setSelectedAdmin(null);
          }
        }}
      >
        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Assign Hostels to Admin</DialogTitle>
            <DialogDescription>
              Select hostels to assign to {selectedAdmin?.name}
            </DialogDescription>
          </DialogHeader>
          <Form {...assignForm}>
            <form
              onSubmit={assignForm.handleSubmit(onAssignHostel)}
              className="space-y-4"
            >
              <FormField
                control={assignForm.control}
                name="hostelIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Hostels</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Select
                          onValueChange={(value) => {
                            const currentValues = field.value || [];
                            if (!currentValues.includes(value)) {
                              field.onChange([...currentValues, value]);
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select hostels">
                              {field.value?.length
                                ? `${field.value.length} hostels selected`
                                : "Select hostels"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {hostels.map((hostel) => (
                              <SelectItem
                                key={hostel.id}
                                value={hostel.id}
                                className={
                                  field.value?.includes(hostel.id)
                                    ? "bg-secondary"
                                    : ""
                                }
                              >
                                {hostel.name}
                                {field.value?.includes(hostel.id) && " ✓"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.value?.map((hostelId) => {
                            const hostel = hostels.find(
                              (h) => h.id === hostelId
                            );
                            return hostel ? (
                              <div
                                key={hostelId}
                                className="flex items-center gap-2 bg-secondary px-2 py-1 rounded-md"
                              >
                                <span>{hostel.name}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                  onClick={() => {
                                    field.onChange(
                                      field.value?.filter(
                                        (id) => id !== hostelId
                                      )
                                    );
                                  }}
                                >
                                  ×
                                </Button>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Assign Hostels</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {deleteDialogOpen && (
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                admin
                {adminToDelete?.hostels.length
                  ? ` and remove their access to ${
                      adminToDelete.hostels.length
                    } hostel${adminToDelete.hostels.length > 1 ? "s" : ""}`
                  : ""}
                .
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  adminToDelete && handleDeleteAdmin(adminToDelete.id)
                }
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
