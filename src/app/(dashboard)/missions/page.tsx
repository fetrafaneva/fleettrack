"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  MapPin,
  User,
  Car,
  Clock,
  Pencil,
  Trash2,
  ClipboardList,
} from "lucide-react";
import { useRole } from "@/hooks/useRole";
import { motion } from "framer-motion";

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
  pending: {
    label: "En attente",
    color: "#d97706",
    bg: "rgba(217,119,6,0.08)",
  },
  in_progress: {
    label: "En cours",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.08)",
  },
  completed: {
    label: "Terminée",
    color: "#16a34a",
    bg: "rgba(22,163,74,0.08)",
  },
  cancelled: { label: "Annulée", color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
};

const statCards = [
  {
    key: "pending",
    label: "En attente",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
  },
  {
    key: "in_progress",
    label: "En cours",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
  },
  {
    key: "completed",
    label: "Terminées",
    gradient: "linear-gradient(135deg, #22c55e 0%, #10b981 100%)",
  },
  {
    key: "cancelled",
    label: "Annulées",
    gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
  },
];

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
      endLocation: { lat: -18.9121, lng: 47.5362, address: form.endAddress },
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-foreground">Missions</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Gestion et suivi des missions
          </p>
        </div>
        {(isAdmin || isManager) && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button
                onClick={openAdd}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #f97316, #f59e0b)",
                }}
              >
                <Plus className="h-4 w-4" />
                Nouvelle mission
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle className="font-black">
                  {editMission ? "Modifier la mission" : "Nouvelle mission"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">
                    Titre
                  </label>
                  <input
                    className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="Livraison Analakely"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">
                    Description
                  </label>
                  <textarea
                    className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="Détails de la mission..."
                    rows={2}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">
                    Véhicule
                  </label>
                  <select
                    className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                  <label className="text-xs font-semibold text-gray-600">
                    Conducteur
                  </label>
                  <select
                    className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                  <label className="text-xs font-semibold text-gray-600">
                    Départ
                  </label>
                  <input
                    className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="Adresse de départ"
                    value={form.startAddress}
                    onChange={(e) =>
                      setForm({ ...form, startAddress: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">
                    Destination
                  </label>
                  <input
                    className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                    <label className="text-xs font-semibold text-gray-600">
                      Date et heure
                    </label>
                    <input
                      className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      type="datetime-local"
                      value={form.startTime}
                      onChange={(e) =>
                        setForm({ ...form, startTime: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">
                      Distance (km)
                    </label>
                    <input
                      className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      type="number"
                      placeholder="0"
                      value={form.distance}
                      onChange={(e) =>
                        setForm({ ...form, distance: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => setOpen(false)}
                  >
                    Annuler
                  </Button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl text-white text-sm font-semibold disabled:opacity-60"
                    style={{
                      background: "linear-gradient(135deg, #f97316, #f59e0b)",
                    }}
                  >
                    {submitting ? "Enregistrement..." : "Enregistrer"}
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stat cards cliquables */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <motion.div
            key={stat.key}
            whileTap={{ scale: 0.97 }}
            onClick={() => setFilter(filter === stat.key ? "all" : stat.key)}
            className="rounded-2xl p-5 text-white relative overflow-hidden cursor-pointer transition-all"
            style={{
              background: stat.gradient,
              opacity: filter !== "all" && filter !== stat.key ? 0.5 : 1,
              boxShadow:
                filter === stat.key ? "0 4px 20px rgba(0,0,0,0.15)" : "none",
            }}
          >
            <div
              className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20"
              style={{ background: "rgba(255,255,255,0.5)" }}
            />
            <p className="text-3xl font-black relative z-10">
              {missions.filter((m) => m.status === stat.key).length}
            </p>
            <p className="text-white/70 text-xs mt-1 relative z-10">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Liste missions */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-36 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <ClipboardList className="h-10 w-10 mx-auto text-muted-foreground opacity-30 mb-3" />
          <p className="text-muted-foreground text-sm">
            Aucune mission trouvée.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((mission, index) => {
            const status = statusConfig[mission.status];
            return (
              <motion.div
                key={mission._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-5 space-y-4">
                    {/* Top */}
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-black text-base text-foreground">
                          {mission.title}
                        </p>
                        {mission.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {mission.description}
                          </p>
                        )}
                      </div>
                      <span
                        className="text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ml-4"
                        style={{ background: status.bg, color: status.color }}
                      >
                        {status.label}
                      </span>
                    </div>

                    {/* Infos */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="flex items-start gap-2 bg-muted/40 rounded-xl p-2.5">
                        <Car className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-xs text-foreground truncate">
                            {mission.vehicle?.brand}{" "}
                            {mission.vehicle?.modelName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {mission.vehicle?.plate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 bg-muted/40 rounded-xl p-2.5">
                        <User className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-xs text-foreground truncate">
                            {mission.driver?.firstName}{" "}
                            {mission.driver?.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Conducteur
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 bg-muted/40 rounded-xl p-2.5">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-xs text-foreground truncate">
                            {mission.startLocation.address}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            → {mission.endLocation.address}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 bg-muted/40 rounded-xl p-2.5">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-xs text-foreground">
                            {new Date(mission.startTime).toLocaleString(
                              "fr-FR",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {mission.distance} km
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {(isAdmin || isManager) && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(mission)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <Pencil className="h-3 w-3" />
                          Modifier
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(mission._id)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 border border-red-100 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                            Supprimer
                          </button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
