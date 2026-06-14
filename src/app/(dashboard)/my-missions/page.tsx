"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Clock,
  Car,
  Play,
  CheckCircle,
  ClipboardList,
} from "lucide-react";
import { useRole } from "@/hooks/useRole";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

interface Mission {
  _id: string;
  title: string;
  description?: string;
  vehicle: { plate: string; brand: string; modelName: string };
  driver: { _id: string; firstName: string; lastName: string; email: string };
  status: "pending" | "in_progress" | "completed" | "cancelled";
  startLocation: { address: string };
  endLocation: { address: string };
  startTime: string;
  distance?: number;
}

const statusConfig = {
  pending: {
    label: "En attente",
    color: "#d97706",
    bg: "rgba(217,119,6,0.08)",
  },
  in_progress: {
    label: "En cours",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.08)",
  },
  completed: {
    label: "Terminée",
    color: "#16a34a",
    bg: "rgba(22,163,74,0.08)",
  },
  cancelled: { label: "Annulée", color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
};

export default function MyMissionsPage() {
  const { profile } = useRole();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchMissions = async () => {
    setLoading(true);
    const res = await fetch("/api/missions");
    const data = await res.json();
    if (data.success) {
      // Filtrer uniquement les missions du conducteur connecté
      const myMissions = data.data.filter(
        (m: Mission) => m.driver?.email === profile?.email
      );
      setMissions(myMissions);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (profile) fetchMissions();
  }, [profile]);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdating(id);
    const res = await fetch(`/api/missions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success) {
      // Envoyer notification
      await supabase.from("notifications").insert({
        title:
          status === "in_progress" ? "Mission démarrée" : "Mission terminée",
        message:
          status === "in_progress"
            ? `${profile?.full_name} a démarré la mission "${data.data.title}"`
            : `${profile?.full_name} a terminé la mission "${data.data.title}"`,
        type: status === "in_progress" ? "info" : "success",
      });
      fetchMissions();
    }
    setUpdating(null);
  };

  const active = missions.filter((m) => m.status === "in_progress");
  const pending = missions.filter((m) => m.status === "pending");
  const done = missions.filter((m) => m.status === "completed");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <div
            className="w-8 h-8 rounded-full mx-auto animate-pulse"
            style={{ background: "linear-gradient(135deg, #f97316, #f59e0b)" }}
          />
          <p className="text-muted-foreground text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-foreground">Mes Missions</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Bonjour {profile?.full_name} — voici vos missions assignées
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "En attente",
            value: pending.length,
            gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
          },
          {
            label: "En cours",
            value: active.length,
            gradient: "linear-gradient(135deg, #3b82f6, #6366f1)",
          },
          {
            label: "Terminées",
            value: done.length,
            gradient: "linear-gradient(135deg, #22c55e, #10b981)",
          },
        ].map((stat) => (
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

      {/* Mission active en cours */}
      {active.length > 0 && (
        <div>
          <h3 className="text-sm font-black text-foreground mb-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Mission en cours
          </h3>
          {active.map((mission) => (
            <MissionCard
              key={mission._id}
              mission={mission}
              updating={updating}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Missions en attente */}
      {pending.length > 0 && (
        <div>
          <h3 className="text-sm font-black text-foreground mb-3">
            À démarrer ({pending.length})
          </h3>
          <div className="space-y-4">
            {pending.map((mission) => (
              <MissionCard
                key={mission._id}
                mission={mission}
                updating={updating}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </div>
      )}

      {/* Missions terminées */}
      {done.length > 0 && (
        <div>
          <h3 className="text-sm font-black text-foreground mb-3">
            Terminées ({done.length})
          </h3>
          <div className="space-y-4">
            {done.map((mission) => (
              <MissionCard
                key={mission._id}
                mission={mission}
                updating={updating}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </div>
      )}

      {missions.length === 0 && (
        <div className="text-center py-16">
          <ClipboardList className="h-10 w-10 mx-auto text-muted-foreground opacity-30 mb-3" />
          <p className="text-muted-foreground text-sm">
            Aucune mission assignée pour le moment.
          </p>
        </div>
      )}
    </div>
  );
}

function MissionCard({
  mission,
  updating,
  onStatusChange,
}: {
  mission: Mission;
  updating: string | null;
  onStatusChange: (id: string, status: string) => void;
}) {
  const status = statusConfig[mission.status];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card
        className="rounded-2xl border-0 shadow-sm"
        style={{
          background:
            mission.status === "in_progress"
              ? "linear-gradient(135deg, #eff6ff, #f0f9ff)"
              : "white",
          border:
            mission.status === "in_progress"
              ? "1px solid #bfdbfe"
              : "1px solid #f1f5f9",
        }}
      >
        <CardContent className="p-5 space-y-4">
          {/* Top */}
          <div className="flex items-start justify-between">
            <div>
              <p className="font-black text-base text-foreground">
                {mission.title}
              </p>
              {mission.description && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {mission.description}
                </p>
              )}
            </div>
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ml-3"
              style={{ background: status.bg, color: status.color }}
            >
              {status.label}
            </span>
          </div>

          {/* Infos */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Car className="h-3.5 w-3.5 flex-shrink-0" />
              <span>
                {mission.vehicle?.brand} {mission.vehicle?.modelName} —{" "}
                {mission.vehicle?.plate}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span>
                {mission.startLocation.address} → {mission.endLocation.address}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 flex-shrink-0" />
              <span>
                {new Date(mission.startTime).toLocaleString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {mission.distance ? ` · ${mission.distance} km` : ""}
              </span>
            </div>
          </div>

          {/* Actions conducteur */}
          {mission.status === "pending" && (
            <button
              disabled={updating === mission._id}
              onClick={() => onStatusChange(mission._id, "in_progress")}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-opacity disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              }}
            >
              <Play className="h-4 w-4" />
              {updating === mission._id
                ? "Démarrage..."
                : "Démarrer la mission"}
            </button>
          )}

          {mission.status === "in_progress" && (
            <button
              disabled={updating === mission._id}
              onClick={() => onStatusChange(mission._id, "completed")}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-opacity disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #22c55e, #10b981)",
              }}
            >
              <CheckCircle className="h-4 w-4" />
              {updating === mission._id
                ? "Finalisation..."
                : "Terminer la mission"}
            </button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
