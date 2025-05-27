import Cookies from "js-cookie";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Role } from "@prisma/client";

export interface UserCookie {
  id: string;
  email: string;
  role: Role;
  name?: string;
  image?: string;
  phoneNumber?: string;
}

export const setUserCookie = (userData: UserCookie) => {
  Cookies.set("user", JSON.stringify(userData), {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: 1, // 7 days
  });
};

export const getUserCookie = (): UserCookie | null => {
  const userCookie = Cookies.get("user");

  if (!userCookie) return null;

  try {
    return JSON.parse(userCookie) as UserCookie;
  } catch {
    return null;
  }
};

export const removeUserCookie = () => {
  Cookies.remove("user", { path: "/" });
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
