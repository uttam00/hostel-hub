"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building, CheckCircle, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  About HostelHub
                </h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We're on a mission to make student accommodation search and
                  booking simple, transparent, and hassle-free.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <Building className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Our Story</CardTitle>
                  <CardDescription>
                    Founded in 2023, HostelHub was born out of the frustration
                    students face when searching for accommodation.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CheckCircle className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Our Mission</CardTitle>
                  <CardDescription>
                    To provide a platform that connects students with quality
                    accommodation options that match their needs and budget.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Our Community</CardTitle>
                  <CardDescription>
                    We're building a community of students, hostel owners, and
                    administrators to create a better accommodation experience.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
