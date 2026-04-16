"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const vehicleIcon = (status: string) =>
  L.divIcon({
    className: "",
    html: `<div style="
      width: 32px; height: 32px;
      background: ${
        status === "on_mission"
          ? "#3b82f6"
          : status === "available"
          ? "#22c55e"
          : "#f97316"
      };
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
    ">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
        <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v5h-2"/>
        <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
        <path d="M14 17h-4"/>
      </svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });

const mockVehicles = [
  {
    _id: "1",
    plate: "AB 1234",
    brand: "Toyota",
    model: "Hilux",
    status: "on_mission",
    driver: "Rakoto Jean",
    lat: -18.8792,
    lng: 47.5079,
  },
  {
    _id: "2",
    plate: "CD 5678",
    brand: "Renault",
    model: "Express",
    status: "available",
    driver: "Rasoa Marie",
    lat: -18.9121,
    lng: 47.5362,
  },
  {
    _id: "3",
    plate: "EF 9012",
    brand: "Honda",
    model: "CB500",
    status: "maintenance",
    driver: "Rabe Paul",
    lat: -18.8512,
    lng: 47.4892,
  },
  {
    _id: "4",
    plate: "GH 3456",
    brand: "Toyota",
    model: "Corolla",
    status: "on_mission",
    driver: "Andry Solo",
    lat: -18.9234,
    lng: 47.5201,
  },
];

const statusLabel = {
  on_mission: "En mission",
  available: "Disponible",
  maintenance: "Maintenance",
};

export default function FleetMap() {
  const [vehicles, setVehicles] = useState(mockVehicles);

  // Simulation GPS - déplace les véhicules en mission toutes les 3 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((v) =>
          v.status === "on_mission"
            ? {
                ...v,
                lat: v.lat + (Math.random() - 0.5) * 0.002,
                lng: v.lng + (Math.random() - 0.5) * 0.002,
              }
            : v
        )
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MapContainer
      center={[-18.8792, 47.5079]}
      zoom={13}
      style={{ height: "100%", width: "100%", borderRadius: "12px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {vehicles.map((vehicle) => (
        <Marker
          key={vehicle._id}
          position={[vehicle.lat, vehicle.lng]}
          icon={vehicleIcon(vehicle.status)}
        >
          <Popup>
            <div className="text-sm space-y-1">
              <p className="font-bold">
                {vehicle.brand} {vehicle.model}
              </p>
              <p className="text-gray-500">{vehicle.plate}</p>
              <p>Conducteur : {vehicle.driver}</p>
              <p>
                Statut :{" "}
                <span
                  className={`font-medium ${
                    vehicle.status === "on_mission"
                      ? "text-blue-600"
                      : vehicle.status === "available"
                      ? "text-green-600"
                      : "text-orange-600"
                  }`}
                >
                  {statusLabel[vehicle.status as keyof typeof statusLabel]}
                </span>
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
