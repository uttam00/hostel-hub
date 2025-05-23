"use client";

import { GoogleMap, Marker } from "@react-google-maps/api";

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
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
      <Marker position={center} title={name} />
    </GoogleMap>
  );
}
