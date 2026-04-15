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
    const vehicle = await Vehicle.create(body);
    return NextResponse.json({ success: true, data: vehicle }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erreur lors de la création" },
      { status: 400 }
    );
  }
}
