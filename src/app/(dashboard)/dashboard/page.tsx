import { Car, Users, ClipboardList, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    title: "Total Véhicules",
    value: "24",
    description: "8 en mission",
    icon: Car,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    title: "Conducteurs",
    value: "18",
    description: "12 disponibles",
    icon: Users,
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    title: "Missions actives",
    value: "8",
    description: "3 en attente",
    icon: ClipboardList,
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    title: "Km ce mois",
    value: "12,450",
    description: "+8% vs mois dernier",
    icon: TrendingUp,
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
];

const recentMissions = [
  {
    id: "1",
    title: "Livraison Analakely",
    driver: "Rakoto Jean",
    vehicle: "Toyota Hilux - AB 1234",
    status: "in_progress",
  },
  {
    id: "2",
    title: "Transport Ivandry",
    driver: "Rasoa Marie",
    vehicle: "Renault Express - CD 5678",
    status: "completed",
  },
  {
    id: "3",
    title: "Livraison Itaosy",
    driver: "Rabe Paul",
    vehicle: "Honda CB500 - EF 9012",
    status: "pending",
  },
  {
    id: "4",
    title: "Transfert Aéroport",
    driver: "Andry Solo",
    vehicle: "Toyota Corolla - GH 3456",
    status: "in_progress",
  },
];

const statusConfig = {
  in_progress: { label: "En cours", variant: "default" as const },
  completed: { label: "Terminée", variant: "secondary" as const },
  pending: { label: "En attente", variant: "outline" as const },
  cancelled: { label: "Annulée", variant: "destructive" as const },
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Tableau de bord</h2>
        <p className="text-muted-foreground">Vue d'ensemble de votre flotte</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
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

      {/* Missions récentes */}
      <Card>
        <CardHeader>
          <CardTitle>Missions récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentMissions.map((mission) => (
              <div
                key={mission.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="space-y-1">
                  <p className="font-medium text-sm">{mission.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {mission.driver} • {mission.vehicle}
                  </p>
                </div>
                <Badge
                  variant={
                    statusConfig[mission.status as keyof typeof statusConfig]
                      .variant
                  }
                >
                  {
                    statusConfig[mission.status as keyof typeof statusConfig]
                      .label
                  }
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
