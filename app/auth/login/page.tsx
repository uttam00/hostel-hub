import Link from "next/link";
import { Building } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  // Redirect to appropriate dashboard if already logged in
  if (session?.user) {
    const role = session.user.role;
    let redirectPath = "/";

    switch (role) {
      case "SUPER_ADMIN":
        redirectPath = "/super-admin";
        break;
      case "HOSTEL_ADMIN":
        redirectPath = "/hostel-admin";
        break;
      case "STUDENT":
        redirectPath = "/dashboard";
        break;
    }

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
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>
        <LoginForm />
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="text-primary underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
