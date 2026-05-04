"use client";

import { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface VehiclePosition {
  _id: string;
  plate: string;
  brand: string;
  modelName: string;
  type: string;
  status: "available" | "on_mission" | "maintenance";
  lastPosition: {
    lat: number;
    lng: number;
    updatedAt: string;
  };
}

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

const statusLabel = {
  on_mission: "En mission",
  available: "Disponible",
  maintenance: "Maintenance",
};

export default function FleetMap() {
  const [vehicles, setVehicles] = useState<VehiclePosition[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = useCallback(async () => {
    const res = await fetch("/api/location");
    const data = await res.json();
    if (data.success) {
      setVehicles(data.data);
      setLoading(false);
    }
  }, []);

  // Simulation GPS — déplace les véhicules en mission toutes les 5 secondes
  const simulateMovement = useCallback(
    async (vehiclesList: VehiclePosition[]) => {
      const onMission = vehiclesList.filter((v) => v.status === "on_mission");
      for (const vehicle of onMission) {
        const newLat = vehicle.lastPosition.lat + (Math.random() - 0.5) * 0.002;
        const newLng = vehicle.lastPosition.lng + (Math.random() - 0.5) * 0.002;

        await fetch("/api/location", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vehicleId: vehicle._id,
            lat: newLat,
            lng: newLng,
          }),
        });
      }
      if (onMission.length > 0) fetchVehicles();
    },
    [fetchVehicles]
  );

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  useEffect(() => {
    if (vehicles.length === 0) return;
    const interval = setInterval(() => {
      simulateMovement(vehicles);
    }, 5000);
    return () => clearInterval(interval);
  }, [vehicles, simulateMovement]);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted rounded-xl">
        <p className="text-muted-foreground">Chargement de la carte...</p>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted rounded-xl">
        <p className="text-muted-foreground">
          Aucun véhicule. Ajoutez des véhicules pour les voir sur la carte.
        </p>
      </div>
    );
  }

  const center: [number, number] = [
    vehicles[0]?.lastPosition?.lat || -18.8792,
    vehicles[0]?.lastPosition?.lng || 47.5079,
  ];

  return (
    <MapContainer
      center={center}
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
          position={[
            vehicle.lastPosition?.lat || -18.8792,
            vehicle.lastPosition?.lng || 47.5079,
          ]}
          icon={vehicleIcon(vehicle.status)}
        >
          <Popup>
            <div className="text-sm space-y-1 min-w-[160px]">
              <p className="font-bold">
                {vehicle.brand} {vehicle.modelName}
              </p>
              <p className="text-gray-500">{vehicle.plate}</p>
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
                  {statusLabel[vehicle.status]}
                </span>
              </p>
              <p className="text-xs text-gray-400">
                Mis à jour :{" "}
                {new Date(vehicle.lastPosition?.updatedAt).toLocaleTimeString(
                  "fr-FR"
                )}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
