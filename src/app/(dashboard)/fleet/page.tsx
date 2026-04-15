"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Car, Truck, Bike } from "lucide-react";

const mockVehicles = [
  {
    _id: "1",
    plate: "AB 1234",
    brand: "Toyota",
    model: "Hilux",
    type: "truck",
    status: "on_mission",
    year: 2021,
    fuel: "diesel",
    mileage: 45230,
  },
  {
    _id: "2",
    plate: "CD 5678",
    brand: "Renault",
    model: "Express",
    type: "car",
    status: "available",
    year: 2020,
    fuel: "diesel",
    mileage: 32100,
  },
  {
    _id: "3",
    plate: "EF 9012",
    brand: "Honda",
    model: "CB500",
    type: "motorcycle",
    status: "maintenance",
    year: 2022,
    fuel: "petrol",
    mileage: 12400,
  },
  {
    _id: "4",
    plate: "GH 3456",
    brand: "Toyota",
    model: "Corolla",
    type: "car",
    status: "available",
    year: 2023,
    fuel: "petrol",
    mileage: 8900,
  },
];

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

export default function FleetPage() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    plate: "",
    brand: "",
    model: "",
    type: "car",
    year: "",
    fuel: "petrol",
    mileage: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      setOpen(false);
      setForm({
        plate: "",
        brand: "",
        model: "",
        type: "car",
        year: "",
        fuel: "petrol",
        mileage: "",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Véhicules</h2>
          <p className="text-muted-foreground">Gestion de votre flotte</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un véhicule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nouveau véhicule</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Immatriculation</label>
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
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Type</label>
                  <select
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
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
                    onChange={(e) => setForm({ ...form, fuel: e.target.value })}
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
                <Button type="submit">Enregistrer</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {mockVehicles.filter((v) => v.status === "available").length}
            </div>
            <p className="text-sm text-muted-foreground">Disponibles</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {mockVehicles.filter((v) => v.status === "on_mission").length}
            </div>
            <p className="text-sm text-muted-foreground">En mission</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">
              {mockVehicles.filter((v) => v.status === "maintenance").length}
            </div>
            <p className="text-sm text-muted-foreground">En maintenance</p>
          </CardContent>
        </Card>
      </div>

      {/* Liste véhicules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockVehicles.map((vehicle) => {
          const Icon = typeIcon[vehicle.type as keyof typeof typeIcon];
          const status =
            statusConfig[vehicle.status as keyof typeof statusConfig];
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
                      {vehicle.brand} {vehicle.model}
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
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
