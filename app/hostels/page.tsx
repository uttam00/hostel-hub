"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Building, Filter, MapPin, Search, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { UserAccountNav } from "@/components/auth/user-account-nav"
import { getHostels, type Hostel } from "@/services/hostel-service"

export default function HostelsPage() {
  const [hostels, setHostels] = useState<Hostel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchCity, setSearchCity] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortBy, setSortBy] = useState("recommended")

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        setLoading(true)
        const response = await getHostels({
          city: searchCity || undefined,
          page: currentPage,
          limit: 6,
        })
        setHostels(response.data)
        setTotalPages(response.pagination.pages)
        setError(null)
      } catch (err) {
        console.error("Error fetching hostels:", err)
        setError("Failed to load hostels. Please try again.")
        setHostels([])
      } finally {
        setLoading(false)
      }
    }

    fetchHostels()
  }, [searchCity, currentPage])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page on new search
  }

  const handleSort = (value: string) => {
    setSortBy(value)

    // Sort the hostels based on the selected option
    const sortedHostels = [...hostels]
    switch (value) {
      case "price-low":
        sortedHostels.sort((a, b) => a.lowestPrice - b.lowestPrice)
        break
      case "price-high":
        sortedHostels.sort((a, b) => b.lowestPrice - a.lowestPrice)
        break
      case "rating":
        sortedHostels.sort((a, b) => b.averageRating - a.averageRating)
        break
      // For "recommended", we'll keep the original order from the API
      default:
        break
    }

    setHostels(sortedHostels)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-6 md:py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Find Your Hostel</h1>
                <p className="text-muted-foreground">Browse through our collection of student hostels</p>
              </div>
              <form onSubmit={handleSearch} className="grid gap-4 md:grid-cols-4">
                <div className="md:col-span-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search by city"
                        className="pl-8"
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                      />
                    </div>
                    <Button type="submit">Search</Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="w-full gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </div>
              </form>
              <Separator className="my-2" />
              <div className="grid gap-6 md:grid-cols-4">
                <div className="hidden md:block space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Price Range</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label htmlFor="min-price" className="text-sm">
                          Min
                        </label>
                        <Input id="min-price" type="number" placeholder="$0" />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="max-price" className="text-sm">
                          Max
                        </label>
                        <Input id="max-price" type="number" placeholder="$1000" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Room Type</h3>
                    <div className="space-y-2">
                      {["Single", "Double Sharing", "Triple Sharing", "Dormitory"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={type.toLowerCase().replace(" ", "-")}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <label htmlFor={type.toLowerCase().replace(" ", "-")} className="text-sm">
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Amenities</h3>
                    <div className="space-y-2">
                      {["Wi-Fi", "AC", "Laundry", "Gym", "Cafeteria", "Study Room"].map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={amenity.toLowerCase().replace(" ", "-")}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <label htmlFor={amenity.toLowerCase().replace(" ", "-")} className="text-sm">
                            {amenity}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Sort By</h3>
                    <Select value={sortBy} onValueChange={handleSort}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recommended">Recommended</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="rating">Rating</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="md:col-span-3 space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {loading ? "Loading..." : `Showing ${hostels.length} results`}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground hidden sm:block">Sort by:</p>
                      <Select value={sortBy} onValueChange={handleSort}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recommended">Recommended</SelectItem>
                          <SelectItem value="price-low">Price: Low to High</SelectItem>
                          <SelectItem value="price-high">Price: High to Low</SelectItem>
                          <SelectItem value="rating">Rating</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {error && <div className="bg-destructive/10 text-destructive p-4 rounded-md">{error}</div>}

                  {loading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="overflow-hidden">
                          <div className="aspect-video w-full bg-muted relative">
                            <Skeleton className="h-full w-full" />
                          </div>
                          <CardHeader className="p-4">
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2" />
                          </CardHeader>
                          <CardContent className="p-4 pt-0 space-y-2">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-4 w-1/4" />
                          </CardContent>
                          <CardFooter className="p-4 pt-0">
                            <Skeleton className="h-10 w-full" />
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {hostels.map((hostel) => (
                          <Card key={hostel.id} className="overflow-hidden">
                            <div className="aspect-video w-full bg-muted relative">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Building className="h-12 w-12 text-muted-foreground/50" />
                              </div>
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
                              <p className="text-sm text-muted-foreground">{hostel.availableRooms} rooms available</p>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                              <Link href={`/hostels/${hostel.id}`} className="w-full">
                                <Button className="w-full">View Details</Button>
                              </Link>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                          <Button
                            variant="outline"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </Button>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                              <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                              >
                                {page}
                              </Button>
                            ))}
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
