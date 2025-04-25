"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building, Home, Users } from "lucide-react";
import { Role } from "@prisma/client";

interface AdminNavigationProps {
  role: Role;
}

export function AdminNavigation({ role }: AdminNavigationProps) {
  const pathname = usePathname();
  const isSuperAdmin = role === "SUPER_ADMIN";
  const basePath = isSuperAdmin ? "/super-admin" : "/admin";

  return (
    <nav className="grid items-start px-2 text-sm font-medium">
      <Link
        href={basePath}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 data-[active=true]:bg-gray-100 data-[active=true]:text-gray-900"
        data-active={pathname === basePath}
      >
        <Home className="h-4 w-4" />
        Dashboard
      </Link>
      <Link
        href={`${basePath}/hostels`}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 data-[active=true]:bg-gray-100 data-[active=true]:text-gray-900"
        data-active={pathname === `${basePath}/hostels`}
      >
        <Building className="h-4 w-4" />
        Hostels
      </Link>
      {isSuperAdmin && (
        <Link
          href={`${basePath}/admins`}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 data-[active=true]:bg-gray-100 data-[active=true]:text-gray-900"
          data-active={pathname === `${basePath}/admins`}
        >
          <Users className="h-4 w-4" />
          Hostel Admins
        </Link>
      )}
    </nav>
  );
}
