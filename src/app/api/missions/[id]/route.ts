import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Mission from "@/models/Mission";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const mission = await Mission.findById(id)
      .populate("vehicle", "plate brand modelName type")
      .populate("driver", "firstName lastName phone");
    if (!mission) {
      return NextResponse.json(
        { success: false, error: "Mission non trouvée" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: mission });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const mission = await Mission.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })
      .populate("vehicle", "plate brand modelName")
      .populate("driver", "firstName lastName phone");
    if (!mission) {
      return NextResponse.json(
        { success: false, error: "Mission non trouvée" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: mission });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const mission = await Mission.findByIdAndDelete(id);
    if (!mission) {
      return NextResponse.json(
        { success: false, error: "Mission non trouvée" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
