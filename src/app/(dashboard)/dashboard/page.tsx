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
  in_progress: { label: "En cours", variant: "default" as const },
  completed: { label: "Terminée", variant: "secondary" as const },
  pending: { label: "En attente", variant: "outline" as const },
  cancelled: { label: "Annulée", variant: "destructive" as const },
};

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
        <p className="text-muted-foreground">Chargement des statistiques...</p>
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

  const statCards = [
    {
      title: "Total Véhicules",
      value: stats.vehicles.total.toString(),
      description: `${stats.vehicles.onMission} en mission`,
      icon: Car,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      title: "Conducteurs",
      value: stats.drivers.total.toString(),
      description: `${stats.drivers.available} disponibles`,
      icon: Users,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      title: "Missions actives",
      value: stats.missions.active.toString(),
      description: `${stats.missions.pending} en attente`,
      icon: ClipboardList,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      title: "Km total",
      value: stats.totalKm.toLocaleString(),
      description: `${stats.missions.completed} missions terminées`,
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Tableau de bord</h2>
        <p className="text-muted-foreground">Vue d'ensemble de votre flotte</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statut flotte */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Statut de la flotte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Disponibles</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{
                      width: `${
                        stats.vehicles.total > 0
                          ? (stats.vehicles.available / stats.vehicles.total) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium w-6">
                  {stats.vehicles.available}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">En mission</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${
                        stats.vehicles.total > 0
                          ? (stats.vehicles.onMission / stats.vehicles.total) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium w-6">
                  {stats.vehicles.onMission}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Maintenance</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full"
                    style={{
                      width: `${
                        stats.vehicles.total > 0
                          ? (stats.vehicles.maintenance /
                              stats.vehicles.total) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium w-6">
                  {stats.vehicles.maintenance}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Statut des missions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Terminées</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{
                      width: `${
                        stats.missions.total > 0
                          ? (stats.missions.completed / stats.missions.total) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium w-6">
                  {stats.missions.completed}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">En cours</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${
                        stats.missions.total > 0
                          ? (stats.missions.active / stats.missions.total) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium w-6">
                  {stats.missions.active}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">En attente</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 rounded-full"
                    style={{
                      width: `${
                        stats.missions.total > 0
                          ? (stats.missions.pending / stats.missions.total) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium w-6">
                  {stats.missions.pending}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Missions récentes */}
      <Card>
        <CardHeader>
          <CardTitle>Missions récentes</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentMissions.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              Aucune mission pour le moment
            </p>
          ) : (
            <div className="space-y-4">
              {stats.recentMissions.map((mission: any) => (
                <div
                  key={mission._id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{mission.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {mission.driver?.firstName} {mission.driver?.lastName} •{" "}
                      {mission.vehicle?.brand} {mission.vehicle?.modelName} -{" "}
                      {mission.vehicle?.plate}
                    </p>
                  </div>
                  <Badge
                    variant={
                      statusConfig[mission.status as keyof typeof statusConfig]
                        ?.variant
                    }
                  >
                    {
                      statusConfig[mission.status as keyof typeof statusConfig]
                        ?.label
                    }
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
