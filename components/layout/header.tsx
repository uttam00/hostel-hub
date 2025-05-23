"use client";

import Link from "next/link";
import { Building } from "lucide-react";
import { UserAccountNav } from "@/components/auth/user-account-nav";
import { useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function Header() {
  const { data: session } = useSession();
  const isAdmin =
    session?.user?.role === "SUPER_ADMIN" ||
    session?.user?.role === "HOSTEL_ADMIN";

  return (
    <header className="sticky top-0 z-50 border-b w-full bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2">
          <Building className="h-6 w-6" />
          <span className="text-xl font-bold">HostelHub</span>
        </Link>
        {!isAdmin && (
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium">
              Home
            </Link>
            <Link href="/hostels" className="text-sm font-medium">
              Hostels
            </Link>
            <Link href="/about" className="text-sm font-medium">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium">
              Contact
            </Link>
          </nav>
        )}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserAccountNav />
        </div>
      </div>
    </header>
  );
}
