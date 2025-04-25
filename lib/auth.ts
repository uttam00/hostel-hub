import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import type { Role } from "@prisma/client"

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}

export async function isAuthenticated() {
  const session = await getSession()
  return !!session
}

export async function hasRole(role: Role) {
  const user = await getCurrentUser()
  return user?.role === role
}

export { authOptions }
