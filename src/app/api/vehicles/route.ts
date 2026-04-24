import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Vehicle from "@/models/Vehicle";

export async function GET() {
  try {
    await connectDB();
    const vehicles = await Vehicle.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: vehicles });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    // Convertir les strings en nombres
    const vehicleData = {
      ...body,
      modelName: body.model,
      year: Number(body.year),
      mileage: Number(body.mileage) || 0,
    };

    const vehicle = await Vehicle.create(vehicleData);
    return NextResponse.json({ success: true, data: vehicle }, { status: 201 });
  } catch (error: any) {
    console.error("Vehicle creation error:", JSON.stringify(error.message));
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
