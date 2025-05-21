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
  const isSuperAdmin = role === Role.SUPER_ADMIN;
  const basePath = isSuperAdmin ? "/super-admin" : "/hostel-admin";

  const commonLinks = [
    {
      label: "Dashboard",
      href: `${basePath}`,
      icon: Home,
    },
    {
      label: "Hostels",
      href: `${basePath}/hostels`,
      icon: Building,
    },
    {
      label: isSuperAdmin ? "Hostel Admins" : "Students",
      href: `${basePath}/${isSuperAdmin ? "admins" : "student"}`,
      icon: Users,
    },
  ];

  return (
    <nav className="grid items-start px-2 text-sm font-medium">
      {commonLinks.map(({ label, href, icon: Icon }) => (
        <Link
          key={label}
          href={href}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 data-[active=true]:bg-gray-100 data-[active=true]:text-gray-900"
          data-active={pathname === href}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
