import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "@/components/providers/session-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HostelHub - Student Accommodation Management",
  description: "Find and manage student hostels and accommodations",
  generator: "v0.dev",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex-1">
              {children}
            </div>
            <Footer />
            <Toaster />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
