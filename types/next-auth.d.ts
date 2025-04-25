import type { Role } from "@prisma/client"
import "next-auth"

declare module "next-auth" {
  interface User {
    role?: Role
    id?: string
  }

  interface Session {
    user: {
      id: string
      name: string
      email: string
      image?: string
      role: Role
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role
    id?: string
  }
}
