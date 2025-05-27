import type { Role } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  interface User {
    role?: Role;
    id?: string;
    phone?: string;
    image?: {
      url: string;
      width: number;
      height: number;
    };
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      phone?: string;
      image?: {
        url: string;
        width: number;
        height: number;
      };
      role: Role;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
    id?: string;
    phone?: string;
    image?: {
      url: string;
      width: number;
      height: number;
    };
  }
}
