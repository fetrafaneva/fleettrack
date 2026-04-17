"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const kmData = [
  { month: "Jan", km: 8400 },
  { month: "Fév", km: 9200 },
  { month: "Mar", km: 7800 },
  { month: "Avr", km: 11200 },
  { month: "Mai", km: 10500 },
  { month: "Jun", km: 12450 },
];

const fuelData = [
  { month: "Jan", litres: 420 },
  { month: "Fév", litres: 460 },
  { month: "Mar", litres: 390 },
  { month: "Avr", litres: 560 },
  { month: "Mai", litres: 525 },
  { month: "Jun", litres: 622 },
];

const missionData = [
  { name: "Terminées", value: 68, color: "#22c55e" },
  { name: "En cours", value: 8, color: "#3b82f6" },
  { name: "En attente", value: 12, color: "#f59e0b" },
  { name: "Annulées", value: 4, color: "#ef4444" },
];

const driverPerf = [
  { name: "Rakoto J.", missions: 42, km: 8450 },
  { name: "Rasoa M.", missions: 38, km: 7200 },
  { name: "Rabe P.", missions: 35, km: 6800 },
  { name: "Andry S.", missions: 28, km: 5100 },
  { name: "Nirina A.", missions: 22, km: 4200 },
];

const statsCards = [
  { title: "Total km ce mois", value: "12,450 km", change: "+8%" },
  { title: "Carburant consommé", value: "622 L", change: "+5%" },
  { title: "Missions complétées", value: "68", change: "+12%" },
  { title: "Coût moyen / mission", value: "45,000 Ar", change: "-3%" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Rapports & Statistiques</h2>
        <p className="text-muted-foreground">
          Analyse des performances de votre flotte
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
              <p
                className={`text-xs mt-1 font-medium ${
                  stat.change.startsWith("+")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {stat.change} vs mois dernier
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Graphiques ligne 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kilométrage mensuel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={kmData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [`${value} km`, "Kilométrage"]}
                />
                <Bar dataKey="km" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Consommation carburant</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={fuelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [`${value} L`, "Carburant"]} />
                <Line
                  type="monotone"
                  dataKey="litres"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={{ fill: "#f97316", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques ligne 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Statut des missions</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={missionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {missionData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}`, "Missions"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Performance des conducteurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={driverPerf} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 11 }}
                  width={70}
                />
                <Tooltip />
                <Bar
                  dataKey="missions"
                  fill="#8b5cf6"
                  radius={[0, 4, 4, 0]}
                  name="Missions"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
