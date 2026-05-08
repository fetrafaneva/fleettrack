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
import { Plus, Car, Truck, Bike, Pencil, Trash2 } from "lucide-react";
import { useRole } from "@/hooks/useRole";

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
  available: { label: "Disponible", className: "bg-green-100 text-green-700" },
  on_mission: { label: "En mission", className: "bg-blue-100 text-blue-700" },
  maintenance: {
    label: "Maintenance",
    className: "bg-orange-100 text-orange-700",
  },
};

const typeIcon = {
  car: Car,
  truck: Truck,
  motorcycle: Bike,
};

const defaultForm = {
  plate: "",
  brand: "",
  model: "",
  type: "car",
  year: "",
  fuel: "petrol",
  mileage: "",
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
    console.log("Response:", data);
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Véhicules</h2>
          <p className="text-muted-foreground">Gestion de votre flotte</p>
        </div>
        {(isAdmin || isManager) && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un véhicule
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editVehicle ? "Modifier le véhicule" : "Nouveau véhicule"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      Immatriculation
                    </label>
                    <input
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      placeholder="AB 1234"
                      value={form.plate}
                      onChange={(e) =>
                        setForm({ ...form, plate: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Marque</label>
                    <input
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      placeholder="Toyota"
                      value={form.brand}
                      onChange={(e) =>
                        setForm({ ...form, brand: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Modèle</label>
                    <input
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      placeholder="Hilux"
                      value={form.model}
                      onChange={(e) =>
                        setForm({ ...form, model: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Année</label>
                    <input
                      className="w-full border rounded-md px-3 py-2 text-sm"
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
                    <label className="text-sm font-medium">Type</label>
                    <select
                      className="w-full border rounded-md px-3 py-2 text-sm"
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
                    <label className="text-sm font-medium">Carburant</label>
                    <select
                      className="w-full border rounded-md px-3 py-2 text-sm"
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
                    <label className="text-sm font-medium">Kilométrage</label>
                    <input
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      type="number"
                      placeholder="0"
                      value={form.mileage}
                      onChange={(e) =>
                        setForm({ ...form, mileage: e.target.value })
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

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {vehicles.filter((v) => v.status === "available").length}
            </div>
            <p className="text-sm text-muted-foreground">Disponibles</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {vehicles.filter((v) => v.status === "on_mission").length}
            </div>
            <p className="text-sm text-muted-foreground">En mission</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">
              {vehicles.filter((v) => v.status === "maintenance").length}
            </div>
            <p className="text-sm text-muted-foreground">En maintenance</p>
          </CardContent>
        </Card>
      </div>

      {/* Liste véhicules */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Chargement...
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Aucun véhicule. Ajoutez votre premier véhicule !
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((vehicle) => {
            const Icon = typeIcon[vehicle.type];
            const status = statusConfig[vehicle.status];
            return (
              <Card
                key={vehicle._id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-muted rounded-lg">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">
                        {vehicle.brand} {vehicle.modelName}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {vehicle.plate}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${status.className}`}
                  >
                    {status.label}
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>
                      <span className="font-medium text-foreground">Année</span>
                      <p>{vehicle.year}</p>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">
                        Carburant
                      </span>
                      <p className="capitalize">{vehicle.fuel}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium text-foreground">
                        Kilométrage
                      </span>
                      <p>{vehicle.mileage.toLocaleString()} km</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {(isAdmin || isManager) && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => openEdit(vehicle)}
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        Modifier
                      </Button>
                    )}
                    {isAdmin && (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleDelete(vehicle._id)}
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
