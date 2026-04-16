"use client";

import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";

const FleetMap = dynamic(() => import("@/components/map/FleetMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-muted rounded-xl">
      <p className="text-muted-foreground">Chargement de la carte...</p>
    </div>
  ),
});

export default function MapPage() {
  return (
    <div className="space-y-4 h-full">
      <div>
        <h2 className="text-2xl font-bold">Carte en temps réel</h2>
        <p className="text-muted-foreground">
          Position live de tous les véhicules
        </p>
      </div>

      {/* Légende */}
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-sm">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-sm">En mission</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span className="text-sm">Maintenance</span>
        </div>
      </div>

      <Card className="h-[600px]">
        <CardContent className="p-2 h-full">
          <FleetMap />
        </CardContent>
      </Card>
    </div>
  );
}
