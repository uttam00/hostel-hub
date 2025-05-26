import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitialsFromEmail(email: string): {
  initials: string;
  isValidEmail: boolean;
} {
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!isValidEmail) return { initials: "", isValidEmail: false };
  if (!email || typeof email !== "string")
    return { initials: "", isValidEmail: false };

  const [username] = email.split("@");
  if (!username) return { initials: "", isValidEmail: false };

  const parts = username.split(/[._\-]/); // split on dot, underscore, hyphen
  let initials = "";

  if (parts.length >= 2) {
    initials = parts[0][0] + parts[1][0];
  } else if (parts.length === 1 && parts[0].length >= 2) {
    initials = parts[0][0] + parts[0][1];
  } else if (parts[0].length === 1) {
    initials = parts[0][0];
  }

  return { initials: initials.toUpperCase(), isValidEmail };
}
