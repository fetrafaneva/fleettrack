import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Vehicle from "@/models/Vehicle";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const vehicle = await Vehicle.findById(params.id);
    if (!vehicle) {
      return NextResponse.json(
        { success: false, error: "Véhicule non trouvé" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: vehicle });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
