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
import { Plus, Phone, Mail, CreditCard, Pencil, Trash2 } from "lucide-react";

interface Driver {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: "available" | "on_mission" | "off";
  totalMissions: number;
  totalKm: number;
}

const statusConfig = {
  available: { label: "Disponible", className: "bg-green-100 text-green-700" },
  on_mission: { label: "En mission", className: "bg-blue-100 text-blue-700" },
  off: { label: "Hors service", className: "bg-gray-100 text-gray-700" },
};

const defaultForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  licenseNumber: "",
  licenseExpiry: "",
};

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editDriver, setEditDriver] = useState<Driver | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchDrivers = async () => {
    setLoading(true);
    const res = await fetch("/api/drivers");
    const data = await res.json();
    if (data.success) setDrivers(data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const openAdd = () => {
    setEditDriver(null);
    setForm(defaultForm);
    setOpen(true);
  };

  const openEdit = (driver: Driver) => {
    setEditDriver(driver);
    setForm({
      firstName: driver.firstName,
      lastName: driver.lastName,
      email: driver.email,
      phone: driver.phone,
      licenseNumber: driver.licenseNumber,
      licenseExpiry: driver.licenseExpiry.split("T")[0],
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const url = editDriver ? `/api/drivers/${editDriver._id}` : "/api/drivers";
    const method = editDriver ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.success) {
      setOpen(false);
      setForm(defaultForm);
      setEditDriver(null);
      fetchDrivers();
    } else {
      alert("Erreur : " + data.error);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce conducteur ?")) return;
    const res = await fetch(`/api/drivers/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) fetchDrivers();
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
            <Button onClick={openAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un conducteur
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editDriver ? "Modifier le conducteur" : "Nouveau conducteur"}
              </DialogTitle>
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
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Enregistrement..." : "Enregistrer"}
                </Button>
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
              {drivers.filter((d) => d.status === "available").length}
            </div>
            <p className="text-sm text-muted-foreground">Disponibles</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {drivers.filter((d) => d.status === "on_mission").length}
            </div>
            <p className="text-sm text-muted-foreground">En mission</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-600">
              {drivers.filter((d) => d.status === "off").length}
            </div>
            <p className="text-sm text-muted-foreground">Hors service</p>
          </CardContent>
        </Card>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Chargement...
        </div>
      ) : drivers.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Aucun conducteur. Ajoutez votre premier conducteur !
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {drivers.map((driver) => {
            const status = statusConfig[driver.status];
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
                      {driver.licenseNumber} • exp.{" "}
                      {new Date(driver.licenseExpiry).toLocaleDateString(
                        "fr-FR"
                      )}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                    <div className="text-center">
                      <p className="text-sm font-bold">
                        {driver.totalMissions}
                      </p>
                      <p className="text-xs text-muted-foreground">Missions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold">
                        {driver.totalKm.toLocaleString()} km
                      </p>
                      <p className="text-xs text-muted-foreground">Parcourus</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => openEdit(driver)}
                    >
                      <Pencil className="h-3 w-3 mr-1" />
                      Modifier
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleDelete(driver._id)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Supprimer
                    </Button>
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
