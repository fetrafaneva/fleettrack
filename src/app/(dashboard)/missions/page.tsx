"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, MapPin, User, Car, Clock, Pencil, Trash2 } from "lucide-react";
import { useRole } from "@/hooks/useRole";

interface Vehicle {
  _id: string;
  plate: string;
  brand: string;
  modelName: string;
}

interface Driver {
  _id: string;
  firstName: string;
  lastName: string;
}

interface Mission {
  _id: string;
  title: string;
  description?: string;
  vehicle: Vehicle;
  driver: Driver;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  startLocation: { lat: number; lng: number; address: string };
  endLocation: { lat: number; lng: number; address: string };
  startTime: string;
  endTime?: string;
  distance?: number;
}

const statusConfig = {
  pending: { label: "En attente", className: "bg-yellow-100 text-yellow-700" },
  in_progress: { label: "En cours", className: "bg-blue-100 text-blue-700" },
  completed: { label: "Terminée", className: "bg-green-100 text-green-700" },
  cancelled: { label: "Annulée", className: "bg-red-100 text-red-700" },
};

const defaultForm = {
  title: "",
  description: "",
  vehicleId: "",
  driverId: "",
  startAddress: "",
  endAddress: "",
  startTime: "",
  distance: "",
};

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editMission, setEditMission] = useState<Mission | null>(null);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const { isAdmin, isManager } = useRole();

  const fetchAll = async () => {
    setLoading(true);
    const [missionsRes, vehiclesRes, driversRes] = await Promise.all([
      fetch("/api/missions"),
      fetch("/api/vehicles"),
      fetch("/api/drivers"),
    ]);
    const [missionsData, vehiclesData, driversData] = await Promise.all([
      missionsRes.json(),
      vehiclesRes.json(),
      driversRes.json(),
    ]);
    if (missionsData.success) setMissions(missionsData.data);
    if (vehiclesData.success) setVehicles(vehiclesData.data);
    if (driversData.success) setDrivers(driversData.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const openAdd = () => {
    setEditMission(null);
    setForm(defaultForm);
    setOpen(true);
  };

  const openEdit = (mission: Mission) => {
    setEditMission(mission);
    setForm({
      title: mission.title,
      description: mission.description || "",
      vehicleId: mission.vehicle._id,
      driverId: mission.driver._id,
      startAddress: mission.startLocation.address,
      endAddress: mission.endLocation.address,
      startTime: mission.startTime.slice(0, 16),
      distance: mission.distance?.toString() || "",
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const body = {
      title: form.title,
      description: form.description,
      vehicle: form.vehicleId,
      driver: form.driverId,
      startLocation: {
        lat: -18.8792,
        lng: 47.5079,
        address: form.startAddress,
      },
      endLocation: {
        lat: -18.9121,
        lng: 47.5362,
        address: form.endAddress,
      },
      startTime: form.startTime,
      distance: Number(form.distance) || 0,
    };

    const url = editMission
      ? `/api/missions/${editMission._id}`
      : "/api/missions";
    const method = editMission ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (data.success) {
      setOpen(false);
      setForm(defaultForm);
      setEditMission(null);
      fetchAll();
    } else {
      alert("Erreur : " + data.error);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette mission ?")) return;
    const res = await fetch(`/api/missions/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) fetchAll();
  };

  const filtered =
    filter === "all" ? missions : missions.filter((m) => m.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Missions</h2>
          <p className="text-muted-foreground">Gestion et suivi des missions</p>
        </div>
        {(isAdmin || isManager) && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle mission
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editMission ? "Modifier la mission" : "Nouvelle mission"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Titre</label>
                  <input
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    placeholder="Livraison Analakely"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    placeholder="Détails de la mission..."
                    rows={2}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Véhicule</label>
                  <select
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    value={form.vehicleId}
                    onChange={(e) =>
                      setForm({ ...form, vehicleId: e.target.value })
                    }
                    required
                  >
                    <option value="">Sélectionner un véhicule</option>
                    {vehicles.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.brand} {v.modelName} - {v.plate}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Conducteur</label>
                  <select
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    value={form.driverId}
                    onChange={(e) =>
                      setForm({ ...form, driverId: e.target.value })
                    }
                    required
                  >
                    <option value="">Sélectionner un conducteur</option>
                    {drivers.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.firstName} {d.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Départ</label>
                  <input
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    placeholder="Adresse de départ"
                    value={form.startAddress}
                    onChange={(e) =>
                      setForm({ ...form, startAddress: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Destination</label>
                  <input
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    placeholder="Adresse de destination"
                    value={form.endAddress}
                    onChange={(e) =>
                      setForm({ ...form, endAddress: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Date et heure</label>
                    <input
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      type="datetime-local"
                      value={form.startTime}
                      onChange={(e) =>
                        setForm({ ...form, startTime: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Distance (km)</label>
                    <input
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      type="number"
                      placeholder="0"
                      value={form.distance}
                      onChange={(e) =>
                        setForm({ ...form, distance: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Enregistrement..." : "Enregistrer"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats cliquables */}
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([key, val]) => (
          <Card
            key={key}
            className={`cursor-pointer transition-shadow hover:shadow-md ${
              filter === key ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setFilter(filter === key ? "all" : key)}
          >
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {missions.filter((m) => m.status === key).length}
              </div>
              <p className="text-sm text-muted-foreground">{val.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Liste missions */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Chargement...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Aucune mission trouvée.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((mission) => {
            const status = statusConfig[mission.status];
            return (
              <Card
                key={mission._id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-base">{mission.title}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      {mission.description}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${status.className}`}
                  >
                    {status.label}
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-start gap-2">
                      <Car className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">
                          {mission.vehicle.brand} {mission.vehicle.modelName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {mission.vehicle.plate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">
                          {mission.driver.firstName} {mission.driver.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Conducteur
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium text-xs">
                          {mission.startLocation.address}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          → {mission.endLocation.address}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium text-xs">
                          {new Date(mission.startTime).toLocaleString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {mission.distance} km
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {(isAdmin || isManager) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(mission)}
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        Modifier
                      </Button>
                    )}
                    {isAdmin && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(mission._id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Supprimer
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
