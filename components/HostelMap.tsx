"use client";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

interface HostelMapProps {
  latitude: number;
  longitude: number;
  name: string;
}

const containerStyle = {
  width: "100%",
  height: "400px",
};

export default function HostelMap({
  latitude,
  longitude,
  name,
}: HostelMapProps) {
  const center = {
    lat: latitude,
    lng: longitude,
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
    >
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
        <Marker position={center} title={name} />
      </GoogleMap>
    </LoadScript>
  );
}
