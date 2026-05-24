import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Driver from "@/models/Driver";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const driver = await Driver.findById(id);
    if (!driver) {
      return NextResponse.json(
        { success: false, error: "Conducteur non trouvé" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: driver });
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
    const driver = await Driver.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!driver) {
      return NextResponse.json(
        { success: false, error: "Conducteur non trouvé" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: driver });
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
    const driver = await Driver.findByIdAndDelete(id);
    if (!driver) {
      return NextResponse.json(
        { success: false, error: "Conducteur non trouvé" },
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
