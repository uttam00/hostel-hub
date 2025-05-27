import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  UserCookie,
  getUserCookie,
  removeUserCookie,
  setUserCookie, // 👈 make sure this exists
} from "@/lib/cookies";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<UserCookie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const userCookie = await getUserCookie();
      setUser(userCookie);
      setLoading(false);
    };
    fetchUser();
  }, []);

  const logout = async () => {
    router.push("/auth/login");
    await signOut({ redirect: false });
    removeUserCookie();
    setUser(null);
    localStorage.clear();
    sessionStorage.clear();
  };

  const updateUser = async (updatedData: Partial<UserCookie>) => {
    const newUser = { ...user, ...updatedData } as UserCookie;
    setUser(newUser);
    await setUserCookie(newUser); // 👈 update the cookie as well
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "HOSTEL_ADMIN";
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    logout,
    updateUser, // 👈 exposed here
  };
}
