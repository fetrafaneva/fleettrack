import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Driver from "@/models/Driver";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const driver = await Driver.findById(params.id);
    if (!driver) {
      return NextResponse.json(
        { success: false, error: "Conducteur non trouvé" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: driver });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
