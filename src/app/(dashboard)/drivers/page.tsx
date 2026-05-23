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
  Phone,
  Mail,
  CreditCard,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import { useRole } from "@/hooks/useRole";
import { motion } from "framer-motion";

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
  off: {
    label: "Hors service",
    color: "#6b7280",
    bg: "rgba(107,114,128,0.08)",
  },
};

const statCards = (drivers: Driver[]) => [
  {
    label: "Disponibles",
    value: drivers.filter((d) => d.status === "available").length,
    gradient: "linear-gradient(135deg, #22c55e 0%, #10b981 100%)",
  },
  {
    label: "En mission",
    value: drivers.filter((d) => d.status === "on_mission").length,
    gradient: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
  },
  {
    label: "Hors service",
    value: drivers.filter((d) => d.status === "off").length,
    gradient: "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)",
  },
];

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
  const { isAdmin, isManager } = useRole();

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-foreground">Conducteurs</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Gestion de vos conducteurs
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
                Ajouter un conducteur
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle className="font-black">
                  {editDriver ? "Modifier le conducteur" : "Nouveau conducteur"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">
                      Prénom
                    </label>
                    <input
                      className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder="Rakoto"
                      value={form.firstName}
                      onChange={(e) =>
                        setForm({ ...form, firstName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">
                      Nom
                    </label>
                    <input
                      className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder="Jean"
                      value={form.lastName}
                      onChange={(e) =>
                        setForm({ ...form, lastName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <label className="text-xs font-semibold text-gray-600">
                      Email
                    </label>
                    <input
                      className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                    <label className="text-xs font-semibold text-gray-600">
                      Téléphone
                    </label>
                    <input
                      className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder="+261 34 00 000 00"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">
                      N° Permis
                    </label>
                    <input
                      className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      placeholder="MG-2021-001234"
                      value={form.licenseNumber}
                      onChange={(e) =>
                        setForm({ ...form, licenseNumber: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">
                      Expiration permis
                    </label>
                    <input
                      className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                      type="date"
                      value={form.licenseExpiry}
                      onChange={(e) =>
                        setForm({ ...form, licenseExpiry: e.target.value })
                      }
                      required
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
        {statCards(drivers).map((stat) => (
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

      {/* Liste */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : drivers.length === 0 ? (
        <div className="text-center py-16">
          <Users className="h-10 w-10 mx-auto text-muted-foreground opacity-30 mb-3" />
          <p className="text-muted-foreground text-sm">
            Aucun conducteur. Ajoutez votre premier conducteur !
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {drivers.map((driver, index) => {
            const status = statusConfig[driver.status];
            return (
              <motion.div
                key={driver._id}
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
                          className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm"
                          style={{
                            background:
                              "linear-gradient(135deg, #f97316, #f59e0b)",
                            color: "white",
                          }}
                        >
                          {driver.firstName[0]}
                          {driver.lastName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-foreground">
                            {driver.firstName} {driver.lastName}
                          </p>
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{
                              background: status.bg,
                              color: status.color,
                            }}
                          >
                            {status.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Infos */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        <span>{driver.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{driver.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CreditCard className="h-3.5 w-3.5" />
                        <span>
                          {driver.licenseNumber} · exp.{" "}
                          {new Date(driver.licenseExpiry).toLocaleDateString(
                            "fr-FR"
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t">
                      <div className="text-center bg-muted/40 rounded-xl py-2">
                        <p className="text-sm font-black">
                          {driver.totalMissions}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Missions
                        </p>
                      </div>
                      <div className="text-center bg-muted/40 rounded-xl py-2">
                        <p className="text-sm font-black">
                          {driver.totalKm.toLocaleString()} km
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Parcourus
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    {(isAdmin || isManager) && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(driver)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <Pencil className="h-3 w-3" />
                          Modifier
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(driver._id)}
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
