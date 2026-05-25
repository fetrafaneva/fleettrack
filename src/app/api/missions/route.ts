import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Mission from "@/models/Mission";
import { sendNotification } from "@/lib/notifications";

export async function GET() {
  try {
    await connectDB();
    const missions = await Mission.find({})
      .populate("vehicle", "plate brand modelName")
      .populate("driver", "firstName lastName phone")
      .sort({ createdAt: -1 });

    // Filtrer les missions avec vehicle ou driver null
    const validMissions = missions.filter(
      (m) => m.vehicle !== null && m.driver !== null
    );

    return NextResponse.json({ success: true, data: validMissions });
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
      { path: "vehicle", select: "plate brand modelName" },
      { path: "driver", select: "firstName lastName phone" },
    ]);

    // Envoyer notification
    await sendNotification(
      "Nouvelle mission créée",
      `La mission "${populated.title}" a été assignée à ${populated.driver.firstName} ${populated.driver.lastName}`,
      "info"
    );

    return NextResponse.json(
      { success: true, data: populated },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
