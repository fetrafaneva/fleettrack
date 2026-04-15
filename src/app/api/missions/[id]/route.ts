import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Mission from "@/models/Mission";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const mission = await Mission.findById(params.id)
      .populate("vehicle", "plate model brand type")
      .populate("driver", "firstName lastName phone");
    if (!mission) {
      return NextResponse.json(
        { success: false, error: "Mission non trouvée" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: mission });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    const mission = await Mission.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    })
      .populate("vehicle", "plate model brand")
      .populate("driver", "firstName lastName phone");
    if (!mission) {
      return NextResponse.json(
        { success: false, error: "Mission non trouvée" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: mission });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erreur lors de la mise à jour" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const mission = await Mission.findByIdAndDelete(params.id);
    if (!mission) {
      return NextResponse.json(
        { success: false, error: "Mission non trouvée" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
