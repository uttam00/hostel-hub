"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Hostel } from "@/services/hostel-service";
import { Building, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface HostelCardProps {
  hostel: Hostel;
}

export default function HostelCard({ hostel }: HostelCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full bg-muted relative">
        {hostel.images && hostel.images.length > 0 ? (
          <>
            {isImageLoading && <Skeleton className="absolute inset-0" />}
            <Image
              src={hostel.images[0]}
              alt={hostel.name}
              fill
              className={`object-cover transition-opacity duration-300 ${
                isImageLoading ? "opacity-0" : "opacity-100"
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
              onLoadingComplete={() => setIsImageLoading(false)}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Building className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
      </div>
      <CardHeader className="p-4">
        <CardTitle className="line-clamp-1 text-lg">{hostel.name}</CardTitle>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span className="line-clamp-1">
            {hostel.city}, {hostel.state}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-primary text-primary" />
          <span className="text-sm">
            {hostel.averageRating.toFixed(1)} ({hostel.reviewCount} reviews)
          </span>
        </div>
        <p className="font-medium">From ${hostel.lowestPrice}/month</p>
        <p className="text-sm text-muted-foreground">
          {hostel.availableRooms} rooms available
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/hostels/${hostel.id}`} className="w-full">
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
