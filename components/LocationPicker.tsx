"use client";

import { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LocationPickerProps {
  onLocationSelect: (location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    latitude: number;
    longitude: number;
  }) => void;
  initialAddress?: string;
  initialLatitude?: number;
  initialLongitude?: number;
}

const containerStyle = {
  width: "100%",
  height: "400px",
};

function extractLocationComponents(place: google.maps.places.PlaceResult) {
  let streetParts: string[] = [];
  let city = "";
  let state = "";
  let zipCode = "";
  let country = "";

  place.address_components?.forEach((component) => {
    const types = component.types;

    if (
      types.includes("premise") ||
      types.includes("subpremise") ||
      types.includes("street_number") ||
      types.includes("route") ||
      types.includes("sublocality") ||
      types.includes("neighborhood")
    ) {
      streetParts.push(component.long_name);
    } else if (types.includes("locality")) {
      city = component.long_name;
    } else if (types.includes("administrative_area_level_1")) {
      state = component.long_name;
    } else if (types.includes("postal_code")) {
      zipCode = component.long_name;
    } else if (types.includes("country")) {
      country = component.long_name;
    }
  });

  const address = streetParts.join(", ");
  return { address, city, state, zipCode, country };
}

function MapWithAutocomplete({
  inputRef,
  selectedLocation,
  onLocationSelect,
  handleMapClick,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  selectedLocation: { lat: number; lng: number } | null;
  onLocationSelect: LocationPickerProps["onLocationSelect"];
  handleMapClick: (e: google.maps.MapMouseEvent) => void;
}) {
  const [searchBox, setSearchBox] =
    useState<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (inputRef.current && !searchBox) {
      const autocomplete = new google.maps.places.Autocomplete(
        inputRef.current,
        {
          fields: [
            "address_components",
            "geometry",
            "formatted_address",
            "name",
            "place_id",
          ],
        }
      );

      // 👇 Bias results toward Ahmedabad initially (can be adjusted dynamically with map bounds too)
      autocomplete.setBounds(
        new google.maps.LatLngBounds(
          { lat: 22.5, lng: 72.0 }, // SW corner

          { lat: 23.5, lng: 73.0 } // NE corner
        )
      );

      autocomplete.setOptions({ strictBounds: false }); // no country restriction

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          const { address, city, state, zipCode, country } =
            extractLocationComponents(place);

          onLocationSelect({
            address:
              address || place.formatted_address || "No address available",
            city,
            state,
            zipCode,
            country,
            latitude: lat,
            longitude: lng,
          });
        }
      });

      setSearchBox(autocomplete);
    }
  }, [searchBox, onLocationSelect, inputRef]);

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={selectedLocation || { lat: 0, lng: 0 }}
      zoom={15}
      onClick={handleMapClick}
    >
      {selectedLocation && <Marker position={selectedLocation} />}
    </GoogleMap>
  );
}

export default function LocationPicker({
  onLocationSelect,
  initialAddress = "",
  initialLatitude,
  initialLongitude,
}: LocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(
    initialLatitude && initialLongitude
      ? { lat: initialLatitude, lng: initialLongitude }
      : { lat: 23.0225, lng: 72.5714 } // Default to Ahmedabad
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setSelectedLocation({ lat, lng });

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          const place = results[0];
          const { address, city, state, zipCode, country } =
            extractLocationComponents(place);

          onLocationSelect({
            address:
              address || place.formatted_address || "No address available",
            city,
            state,
            zipCode,
            country,
            latitude: lat,
            longitude: lng,
          });

          if (inputRef.current) {
            inputRef.current.value = place.formatted_address || "";
          }
        }
      });
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
      libraries={["places"]}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="location">Search Location</Label>
          <Input
            ref={inputRef}
            id="location"
            type="text"
            placeholder="Search for a location"
            defaultValue={initialAddress}
          />
        </div>
        <MapWithAutocomplete
          inputRef={inputRef}
          selectedLocation={selectedLocation}
          onLocationSelect={onLocationSelect}
          handleMapClick={handleMapClick}
        />
      </div>
    </LoadScript>
  );
}
