"use client";

import { useEffect, useState } from "react";
import { Car, Users, ClipboardList, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Stats {
  vehicles: {
    total: number;
    available: number;
    onMission: number;
    maintenance: number;
  };
  drivers: {
    total: number;
    available: number;
  };
  missions: {
    total: number;
    active: number;
    pending: number;
    completed: number;
  };
  totalKm: number;
  recentMissions: any[];
}

const statusConfig = {
  in_progress: { label: "En cours", className: "bg-blue-100 text-blue-700" },
  completed: { label: "Terminée", className: "bg-green-100 text-green-700" },
  pending: { label: "En attente", className: "bg-yellow-100 text-yellow-700" },
  cancelled: { label: "Annulée", className: "bg-red-100 text-red-700" },
};

const statCards = (stats: Stats) => [
  {
    title: "Total Véhicules",
    value: stats.vehicles.total.toString(),
    description: `${stats.vehicles.onMission} en mission`,
    icon: Car,
    gradient: "linear-gradient(135deg, #f97316 0%, #f59e0b 100%)",
  },
  {
    title: "Conducteurs",
    value: stats.drivers.total.toString(),
    description: `${stats.drivers.available} disponibles`,
    icon: Users,
    gradient: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
  },
  {
    title: "Missions actives",
    value: stats.missions.active.toString(),
    description: `${stats.missions.pending} en attente`,
    icon: ClipboardList,
    gradient: "linear-gradient(135deg, #22c55e 0%, #10b981 100%)",
  },
  {
    title: "Km total",
    value: stats.totalKm.toLocaleString(),
    description: `${stats.missions.completed} missions terminées`,
    icon: TrendingUp,
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
  },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch("/api/stats");
      const data = await res.json();
      if (data.success) setStats(data.data);
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="space-y-2 text-center">
          <div
            className="w-8 h-8 rounded-full mx-auto animate-pulse"
            style={{ background: "linear-gradient(135deg, #f97316, #f59e0b)" }}
          />
          <p className="text-muted-foreground text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Erreur de chargement</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-foreground">Tableau de bord</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Vue d'ensemble de votre flotte
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards(stats).map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl p-5 text-white relative overflow-hidden"
            style={{ background: stat.gradient }}
          >
            {/* Cercle décoratif */}
            <div
              className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20"
              style={{ background: "rgba(255,255,255,0.5)" }}
            />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white/80 text-xs font-medium uppercase tracking-wide">
                  {stat.title}
                </p>
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </div>
              <p className="text-3xl font-black text-white">{stat.value}</p>
              <p className="text-white/70 text-xs mt-1">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Statut flotte + missions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold">
              Statut de la flotte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                label: "Disponibles",
                value: stats.vehicles.available,
                color: "#22c55e",
              },
              {
                label: "En mission",
                value: stats.vehicles.onMission,
                color: "#f97316",
              },
              {
                label: "Maintenance",
                value: stats.vehicles.maintenance,
                color: "#8b5cf6",
              },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="text-xs font-bold">{item.value}</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${
                        stats.vehicles.total > 0
                          ? (item.value / stats.vehicles.total) * 100
                          : 0
                      }%`,
                      background: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold">
              Statut des missions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                label: "Terminées",
                value: stats.missions.completed,
                color: "#22c55e",
              },
              {
                label: "En cours",
                value: stats.missions.active,
                color: "#3b82f6",
              },
              {
                label: "En attente",
                value: stats.missions.pending,
                color: "#f59e0b",
              },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="text-xs font-bold">{item.value}</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${
                        stats.missions.total > 0
                          ? (item.value / stats.missions.total) * 100
                          : 0
                      }%`,
                      background: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Missions récentes */}
      <Card className="rounded-2xl border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold">Missions récentes</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentMissions.length === 0 ? (
            <div className="text-center py-8">
              <ClipboardList className="h-8 w-8 mx-auto text-muted-foreground opacity-30 mb-2" />
              <p className="text-sm text-muted-foreground">
                Aucune mission pour le moment
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentMissions.map((mission: any) => {
                const status =
                  statusConfig[mission.status as keyof typeof statusConfig];
                return (
                  <div
                    key={mission._id}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <p className="font-semibold text-sm">{mission.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {mission.driver?.firstName} {mission.driver?.lastName} ·{" "}
                        {mission.vehicle?.brand} {mission.vehicle?.modelName} —{" "}
                        {mission.vehicle?.plate}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${status?.className}`}
                    >
                      {status?.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
