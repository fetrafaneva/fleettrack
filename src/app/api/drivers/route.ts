import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Driver from "@/models/Driver";

export async function GET() {
  try {
    await connectDB();
    const drivers = await Driver.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: drivers });
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
    const driver = await Driver.create(body);
    return NextResponse.json({ success: true, data: driver }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erreur lors de la création" },
      { status: 400 }
    );
  }
}
