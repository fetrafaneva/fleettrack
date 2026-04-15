import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Mission from "@/models/Mission";

export async function GET() {
  try {
    await connectDB();
    const missions = await Mission.find({})
      .populate("vehicle", "plate model brand")
      .populate("driver", "firstName lastName phone")
      .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: missions });
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
    const mission = await Mission.create(body);
    const populated = await mission.populate([
      { path: "vehicle", select: "plate model brand" },
      { path: "driver", select: "firstName lastName phone" },
    ]);
    return NextResponse.json(
      { success: true, data: populated },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erreur lors de la création" },
      { status: 400 }
    );
  }
}
