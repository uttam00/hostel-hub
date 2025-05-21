"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings, Building } from "lucide-react";
import { Role } from "@prisma/client";
import { useAuth } from "@/hooks/use-auth";

export function UserAccountNav() {
  const { data: session, status } = useSession();
  const { logout } = useAuth();
  const user = session?.user;

  // Show loading state while checking authentication
  if (status === "loading") {
    return null;
  }

  // Only show login/signup buttons if not authenticated
  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/auth/login">
          <Button variant="outline" size="sm">
            Log in
          </Button>
        </Link>
        <Link href="/auth/register">
          <Button variant="default" size="sm">
            Sign up
          </Button>
        </Link>
      </div>
    );
  }

  // Get initials for avatar fallback
  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSignOut = async () => {
    await logout();
  };

  const getAdminPath = (role: Role, path?: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return `/super-admin/${path}`;
      case "HOSTEL_ADMIN":
        return `/hostel-admin/${path}`;
      default:
        return "/dashboard";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || ""} alt={user.name || "User"} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={getAdminPath(
              user.role,
              Role.HOSTEL_ADMIN === user.role ? "" : "hostels"
            )}
            className="flex w-full cursor-pointer"
          >
            {user.role === "STUDENT" ? (
              <User className="mr-2 h-4 w-4" />
            ) : (
              <Building className="mr-2 h-4 w-4" />
            )}
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={getAdminPath(user.role, "profile")}
            className="flex w-full cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={getAdminPath(user.role, "settings")}
            className="flex w-full cursor-pointer"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex w-full cursor-pointer text-red-600"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
