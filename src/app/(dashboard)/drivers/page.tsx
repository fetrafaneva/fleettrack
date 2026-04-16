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
import { Plus, Phone, Mail, CreditCard } from "lucide-react";

const mockDrivers = [
  {
    _id: "1",
    firstName: "Rakoto",
    lastName: "Jean",
    email: "rakoto.jean@fleet.mg",
    phone: "+261 34 00 000 01",
    licenseNumber: "MG-2019-001234",
    licenseExpiry: "2026-05-15",
    status: "on_mission",
    totalMissions: 142,
    totalKm: 28450,
  },
  {
    _id: "2",
    firstName: "Rasoa",
    lastName: "Marie",
    email: "rasoa.marie@fleet.mg",
    phone: "+261 33 00 000 02",
    licenseNumber: "MG-2020-005678",
    licenseExpiry: "2027-03-20",
    status: "available",
    totalMissions: 98,
    totalKm: 19200,
  },
  {
    _id: "3",
    firstName: "Rabe",
    lastName: "Paul",
    email: "rabe.paul@fleet.mg",
    phone: "+261 32 00 000 03",
    licenseNumber: "MG-2018-009012",
    licenseExpiry: "2025-12-10",
    status: "off",
    totalMissions: 210,
    totalKm: 45600,
  },
  {
    _id: "4",
    firstName: "Andry",
    lastName: "Solo",
    email: "andry.solo@fleet.mg",
    phone: "+261 34 00 000 04",
    licenseNumber: "MG-2021-003456",
    licenseExpiry: "2028-01-30",
    status: "on_mission",
    totalMissions: 67,
    totalKm: 12300,
  },
];

const statusConfig = {
  available: { label: "Disponible", className: "bg-green-100 text-green-700" },
  on_mission: { label: "En mission", className: "bg-blue-100 text-blue-700" },
  off: { label: "Hors service", className: "bg-gray-100 text-gray-700" },
};

export default function DriversPage() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    licenseNumber: "",
    licenseExpiry: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/drivers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      setOpen(false);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        licenseNumber: "",
        licenseExpiry: "",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Conducteurs</h2>
          <p className="text-muted-foreground">Gestion de vos conducteurs</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un conducteur
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nouveau conducteur</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Prénom</label>
                  <input
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    placeholder="Rakoto"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Nom</label>
                  <input
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    placeholder="Jean"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-sm font-medium">Email</label>
                  <input
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    type="email"
                    placeholder="rakoto@fleet.mg"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-sm font-medium">Téléphone</label>
                  <input
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    placeholder="+261 34 00 000 00"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">N° Permis</label>
                  <input
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    placeholder="MG-2021-001234"
                    value={form.licenseNumber}
                    onChange={(e) =>
                      setForm({ ...form, licenseNumber: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">
                    Expiration permis
                  </label>
                  <input
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    type="date"
                    value={form.licenseExpiry}
                    onChange={(e) =>
                      setForm({ ...form, licenseExpiry: e.target.value })
                    }
                    required
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

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {mockDrivers.filter((d) => d.status === "available").length}
            </div>
            <p className="text-sm text-muted-foreground">Disponibles</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {mockDrivers.filter((d) => d.status === "on_mission").length}
            </div>
            <p className="text-sm text-muted-foreground">En mission</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-600">
              {mockDrivers.filter((d) => d.status === "off").length}
            </div>
            <p className="text-sm text-muted-foreground">Hors service</p>
          </CardContent>
        </Card>
      </div>

      {/* Liste conducteurs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockDrivers.map((driver) => {
          const status =
            statusConfig[driver.status as keyof typeof statusConfig];
          return (
            <Card
              key={driver._id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {driver.firstName[0]}
                    {driver.lastName[0]}
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">
                      {driver.firstName} {driver.lastName}
                    </CardTitle>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  <span>{driver.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  <span>{driver.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CreditCard className="h-3 w-3" />
                  <span>
                    {driver.licenseNumber} • exp. {driver.licenseExpiry}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                  <div className="text-center">
                    <p className="text-sm font-bold">{driver.totalMissions}</p>
                    <p className="text-xs text-muted-foreground">Missions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold">
                      {driver.totalKm.toLocaleString()} km
                    </p>
                    <p className="text-xs text-muted-foreground">Parcourus</p>
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
