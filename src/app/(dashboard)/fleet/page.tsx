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
import { Plus, Car, Truck, Bike, Pencil, Trash2 } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import { motion } from "framer-motion";

interface Vehicle {
  _id: string;
  plate: string;
  brand: string;
  modelName: string;
  type: "car" | "truck" | "motorcycle";
  status: "available" | "on_mission" | "maintenance";
  year: number;
  fuel: string;
  mileage: number;
}

const statusConfig = {
  available: {
    label: "Disponible",
    color: "#16a34a",
    bg: "rgba(22,163,74,0.08)",
  },
  on_mission: {
    label: "En mission",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.08)",
  },
  maintenance: {
    label: "Maintenance",
    color: "#f97316",
    bg: "rgba(249,115,22,0.08)",
  },
};

const typeConfig = {
  car: { icon: Car, gradient: "linear-gradient(135deg, #3b82f6, #6366f1)" },
  truck: { icon: Truck, gradient: "linear-gradient(135deg, #f97316, #f59e0b)" },
  motorcycle: {
    icon: Bike,
    gradient: "linear-gradient(135deg, #22c55e, #10b981)",
  },
};

const statCards = (vehicles: Vehicle[]) => [
  {
    label: "Disponibles",
    value: vehicles.filter((v) => v.status === "available").length,
    gradient: "linear-gradient(135deg, #22c55e 0%, #10b981 100%)",
  },
  {
    label: "En mission",
    value: vehicles.filter((v) => v.status === "on_mission").length,
    gradient: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
  },
  {
    label: "En maintenance",
    value: vehicles.filter((v) => v.status === "maintenance").length,
    gradient: "linear-gradient(135deg, #f97316 0%, #f59e0b 100%)",
  },
];

const defaultForm = {
  plate: "",
  brand: "",
  model: "",
  type: "car",
  year: "",
  fuel: "petrol",
  mileage: "",
};

const fuelLabels: Record<string, string> = {
  petrol: "Essence",
  diesel: "Diesel",
  electric: "Électrique",
};

export default function FleetPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const { isAdmin, isManager } = useRole();

  const fetchVehicles = async () => {
    setLoading(true);
    const res = await fetch("/api/vehicles");
    const data = await res.json();
    if (data.success) setVehicles(data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const openAdd = () => {
    setEditVehicle(null);
    setForm(defaultForm);
    setOpen(true);
  };

  const openEdit = (vehicle: Vehicle) => {
    setEditVehicle(vehicle);
    setForm({
      plate: vehicle.plate,
      brand: vehicle.brand,
      model: vehicle.modelName,
      type: vehicle.type,
      year: vehicle.year.toString(),
      fuel: vehicle.fuel,
      mileage: vehicle.mileage.toString(),
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const url = editVehicle
      ? `/api/vehicles/${editVehicle._id}`
      : "/api/vehicles";
    const method = editVehicle ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      setOpen(false);
      setForm(defaultForm);
      setEditVehicle(null);
      fetchVehicles();
    } else {
      alert("Erreur : " + data.error);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce véhicule ?")) return;
    const res = await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) fetchVehicles();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-foreground">Véhicules</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Gestion de votre flotte
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
                Ajouter un véhicule
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle className="font-black">
                  {editVehicle ? "Modifier le véhicule" : "Nouveau véhicule"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">
                      Immatriculation
                    </label>
                    <input
                      className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder="AB 1234"
                      value={form.plate}
                      onChange={(e) =>
                        setForm({ ...form, plate: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">
                      Marque
                    </label>
                    <input
                      className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder="Toyota"
                      value={form.brand}
                      onChange={(e) =>
                        setForm({ ...form, brand: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">
                      Modèle
                    </label>
                    <input
                      className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder="Hilux"
                      value={form.model}
                      onChange={(e) =>
                        setForm({ ...form, model: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">
                      Année
                    </label>
                    <input
                      className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      type="number"
                      placeholder="2023"
                      value={form.year}
                      onChange={(e) =>
                        setForm({ ...form, year: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">
                      Type
                    </label>
                    <select
                      className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      value={form.type}
                      onChange={(e) =>
                        setForm({ ...form, type: e.target.value })
                      }
                    >
                      <option value="car">Voiture</option>
                      <option value="truck">Camion</option>
                      <option value="motorcycle">Moto</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">
                      Carburant
                    </label>
                    <select
                      className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      value={form.fuel}
                      onChange={(e) =>
                        setForm({ ...form, fuel: e.target.value })
                      }
                    >
                      <option value="petrol">Essence</option>
                      <option value="diesel">Diesel</option>
                      <option value="electric">Électrique</option>
                    </select>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <label className="text-xs font-semibold text-gray-600">
                      Kilométrage
                    </label>
                    <input
                      className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      type="number"
                      placeholder="0"
                      value={form.mileage}
                      onChange={(e) =>
                        setForm({ ...form, mileage: e.target.value })
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

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {statCards(vehicles).map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl p-5 text-white relative overflow-hidden"
            style={{ background: stat.gradient }}
          >
            <div
              className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20"
              style={{ background: "rgba(255,255,255,0.5)" }}
            />
            <p className="text-3xl font-black relative z-10">{stat.value}</p>
            <p className="text-white/70 text-xs mt-1 relative z-10">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Liste véhicules */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-16">
          <Car className="h-10 w-10 mx-auto text-muted-foreground opacity-30 mb-3" />
          <p className="text-muted-foreground text-sm">
            Aucun véhicule. Ajoutez votre premier véhicule !
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((vehicle, index) => {
            const status = statusConfig[vehicle.status];
            const type = typeConfig[vehicle.type];
            const Icon = type.icon;
            return (
              <motion.div
                key={vehicle._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-5 space-y-4">
                    {/* Top */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                          style={{ background: type.gradient }}
                        >
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-foreground">
                            {vehicle.brand} {vehicle.modelName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {vehicle.plate}
                          </p>
                        </div>
                      </div>
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ background: status.bg, color: status.color }}
                      >
                        {status.label}
                      </span>
                    </div>

                    {/* Infos */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center bg-muted/40 rounded-xl py-2">
                        <p className="text-xs font-black text-foreground">
                          {vehicle.year}
                        </p>
                        <p className="text-xs text-muted-foreground">Année</p>
                      </div>
                      <div className="text-center bg-muted/40 rounded-xl py-2">
                        <p className="text-xs font-black text-foreground">
                          {fuelLabels[vehicle.fuel] || vehicle.fuel}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Carburant
                        </p>
                      </div>
                      <div className="text-center bg-muted/40 rounded-xl py-2">
                        <p className="text-xs font-black text-foreground">
                          {vehicle.mileage.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">km</p>
                      </div>
                    </div>

                    {/* Actions */}
                    {(isAdmin || isManager) && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(vehicle)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <Pencil className="h-3 w-3" />
                          Modifier
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(vehicle._id)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-red-500 border border-red-100 hover:bg-red-50 transition-colors"
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
