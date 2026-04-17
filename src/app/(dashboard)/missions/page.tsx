"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, MapPin, User, Car, Clock } from "lucide-react";

const mockMissions = [
  {
    _id: "1",
    title: "Livraison Analakely",
    description: "Livraison de colis urgents",
    vehicle: { plate: "AB 1234", brand: "Toyota", model: "Hilux" },
    driver: { firstName: "Rakoto", lastName: "Jean" },
    status: "in_progress",
    startLocation: { address: "Behoririka, Antananarivo" },
    endLocation: { address: "Analakely, Antananarivo" },
    startTime: "2024-01-15T08:30:00",
    distance: 12,
  },
  {
    _id: "2",
    title: "Transport Ivandry",
    description: "Transport de matériaux",
    vehicle: { plate: "CD 5678", brand: "Renault", model: "Express" },
    driver: { firstName: "Rasoa", lastName: "Marie" },
    status: "completed",
    startLocation: { address: "Isotry, Antananarivo" },
    endLocation: { address: "Ivandry, Antananarivo" },
    startTime: "2024-01-15T07:00:00",
    endTime: "2024-01-15T09:15:00",
    distance: 8,
  },
  {
    _id: "3",
    title: "Livraison Itaosy",
    description: "Livraison marchandises",
    vehicle: { plate: "GH 3456", brand: "Toyota", model: "Corolla" },
    driver: { firstName: "Andry", lastName: "Solo" },
    status: "pending",
    startLocation: { address: "Tsaralalana, Antananarivo" },
    endLocation: { address: "Itaosy, Antananarivo" },
    startTime: "2024-01-15T14:00:00",
    distance: 15,
  },
  {
    _id: "4",
    title: "Transfert Aéroport",
    description: "Transport VIP",
    vehicle: { plate: "AB 1234", brand: "Toyota", model: "Hilux" },
    driver: { firstName: "Rabe", lastName: "Paul" },
    status: "cancelled",
    startLocation: { address: "Hilton, Antananarivo" },
    endLocation: { address: "Aéroport Ivato" },
    startTime: "2024-01-15T10:00:00",
    distance: 18,
  },
];

const statusConfig = {
  pending: {
    label: "En attente",
    className: "bg-yellow-100 text-yellow-700",
  },
  in_progress: {
    label: "En cours",
    className: "bg-blue-100 text-blue-700",
  },
  completed: {
    label: "Terminée",
    className: "bg-green-100 text-green-700",
  },
  cancelled: {
    label: "Annulée",
    className: "bg-red-100 text-red-700",
  },
};

export default function MissionsPage() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({
    title: "",
    description: "",
    startAddress: "",
    endAddress: "",
    startTime: "",
  });

  const filtered =
    filter === "all"
      ? mockMissions
      : mockMissions.filter((m) => m.status === filter);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Missions</h2>
          <p className="text-muted-foreground">Gestion et suivi des missions</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle mission
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nouvelle mission</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Titre</label>
                <input
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  placeholder="Livraison Analakely"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
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
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit">Créer</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([key, val]) => (
          <Card
            key={key}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setFilter(filter === key ? "all" : key)}
          >
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {mockMissions.filter((m) => m.status === key).length}
              </div>
              <p className="text-sm text-muted-foreground">{val.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filtre actif */}
      {filter !== "all" && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtre :</span>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              statusConfig[filter as keyof typeof statusConfig].className
            }`}
          >
            {statusConfig[filter as keyof typeof statusConfig].label}
          </span>
          <button
            className="text-xs text-muted-foreground underline"
            onClick={() => setFilter("all")}
          >
            Effacer
          </button>
        </div>
      )}

      {/* Liste missions */}
      <div className="space-y-4">
        {filtered.map((mission) => {
          const status =
            statusConfig[mission.status as keyof typeof statusConfig];
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
                        {mission.vehicle.brand} {mission.vehicle.model}
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
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
