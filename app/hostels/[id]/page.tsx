"use client";

import { Button } from "@/components/ui/button";
import type { HostelDetails } from "@/services/hostel-service";
import { getHostelById } from "@/services/hostel-service";
import { Star } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import HostelMap from "@/components/HostelMap";

export default function HostelDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [isBooking, setIsBooking] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [hostelId, setHostelId] = useState<string>("");
  const [hostel, setHostel] = useState<HostelDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params && params.id) {
      setHostelId(params.id as string);
    }
  }, [params]);

  useEffect(() => {
    const fetchHostel = async () => {
      if (!hostelId) return;

      try {
        setLoading(true);
        const data = await getHostelById(hostelId);
        setHostel(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching hostel:", err);
        setError("Failed to load hostel details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHostel();
  }, [hostelId]);

  const handleBookNow = async () => {
    if (!hostel) return;

    setIsBooking(true);
    try {
      // TODO: Implement booking logic
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating booking:", error);
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <div className="h-8 w-1/3 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
          <div className="h-32 w-full animate-pulse rounded bg-gray-200" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-64 animate-pulse rounded bg-gray-200" />
            <div className="h-64 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !hostel) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="mt-2 text-gray-600">{error || "Hostel not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">{hostel.name}</h1>
          <p className="mt-2 text-gray-600">
            {hostel.address}, {hostel.city}, {hostel.state} {hostel.zipCode}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="mt-2 text-gray-600">{hostel.description}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Amenities</h2>
            <ul className="mt-2 grid grid-cols-2 gap-2">
              {hostel.amenities.map((amenity, index) => (
                <li key={index} className="text-gray-600">
                  • {amenity}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {hostel.latitude && hostel.longitude && (
          <div>
            <h2 className="text-xl font-semibold">Location</h2>
            <div className="mt-4 rounded-lg overflow-hidden">
              <HostelMap
                name={hostel.name}
                latitude={hostel.latitude}
                longitude={hostel.longitude}
              />
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold">Available Rooms</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {hostel.rooms.map((room) => (
              <div key={room.id} className="rounded-lg border p-4 shadow-sm">
                <h3 className="font-semibold">{room.roomType}</h3>
                {/* <p className="mt-1 text-sm text-gray-600">{room.description}</p> */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold">${room.price}/month</span>
                  <Button
                    onClick={handleBookNow}
                    disabled={!room.isAvailable || isBooking}
                  >
                    {isBooking ? "Booking..." : "Book Now"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Reviews</h2>
          <div className="mt-4 space-y-4">
            {hostel.reviews.map((review) => (
              <div key={review.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {review.user.name || "Anonymous"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{review.rating}</span>
                  </div>
                </div>
                {review.comment && (
                  <p className="mt-2 text-gray-600">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
