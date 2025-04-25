"use client";

import Link from "next/link";
import { Building } from "lucide-react";
import { RegisterForm } from "@/components/auth/register-form";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);

  // Redirect to appropriate dashboard if already logged in
  if (session?.user) {
    const role = session.user.role;
    const redirectPath = role === "STUDENT" ? "/dashboard" : "/admin";
    redirect(redirectPath);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <Building className="h-6 w-6" />
            <span className="text-xl font-bold">HostelHub</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your details to create your account
          </p>
        </div>
        <RegisterForm />
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-primary underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
