"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
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

  if (status === "loading") return null;

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

  const getInitials = (name?: string | null) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "U";

  const getAdminPath = (role: Role, path = "") =>
    role === "SUPER_ADMIN"
      ? `/super-admin/${path}`
      : role === "HOSTEL_ADMIN"
      ? `/hostel-admin/${path}`
      : "/dashboard";

  const menuItems = [
    {
      label: "Dashboard",
      href: getAdminPath(user.role),
      icon: user.role === "STUDENT" ? User : Building,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: User,
    },
    {
      label: "Settings",
      href: getAdminPath(user.role, "settings"),
      icon: Settings,
    },
  ];

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
        <div className="flex items-center gap-2 p-2">
          <div className="flex flex-col">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        {menuItems.map(({ label, href, icon: Icon }) => (
          <DropdownMenuItem asChild key={label}>
            <Link
              href={href}
              className="flex w-full items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={logout}
          className="flex items-center gap-2 text-red-600 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
