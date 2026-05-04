import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Vehicle from "@/models/Vehicle";

export async function GET() {
  try {
    await connectDB();
    const vehicles = await Vehicle.find({})
      .select("plate brand modelName type status lastPosition")
      .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: vehicles });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { vehicleId, lat, lng } = await request.json();

    const vehicle = await Vehicle.findByIdAndUpdate(
      vehicleId,
      {
        lastPosition: { lat, lng, updatedAt: new Date() },
      },
      { new: true }
    );

    if (!vehicle) {
      return NextResponse.json(
        { success: false, error: "Véhicule non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: vehicle });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
