import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Vehicle from "@/models/Vehicle";
import Driver from "@/models/Driver";
import Mission from "@/models/Mission";

export async function GET() {
  try {
    await connectDB();

    const [
      totalVehicles,
      availableVehicles,
      onMissionVehicles,
      maintenanceVehicles,
      totalDrivers,
      availableDrivers,
      totalMissions,
      activeMissions,
      pendingMissions,
      completedMissions,
      recentMissions,
    ] = await Promise.all([
      Vehicle.countDocuments(),
      Vehicle.countDocuments({ status: "available" }),
      Vehicle.countDocuments({ status: "on_mission" }),
      Vehicle.countDocuments({ status: "maintenance" }),
      Driver.countDocuments(),
      Driver.countDocuments({ status: "available" }),
      Mission.countDocuments(),
      Mission.countDocuments({ status: "in_progress" }),
      Mission.countDocuments({ status: "pending" }),
      Mission.countDocuments({ status: "completed" }),
      Mission.find({})
        .populate("vehicle", "plate brand modelName")
        .populate("driver", "firstName lastName")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    // Calcul km total
    const kmResult = await Mission.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, totalKm: { $sum: "$distance" } } },
    ]);
    const totalKm = kmResult[0]?.totalKm || 0;

    return NextResponse.json({
      success: true,
      data: {
        vehicles: {
          total: totalVehicles,
          available: availableVehicles,
          onMission: onMissionVehicles,
          maintenance: maintenanceVehicles,
        },
        drivers: {
          total: totalDrivers,
          available: availableDrivers,
        },
        missions: {
          total: totalMissions,
          active: activeMissions,
          pending: pendingMissions,
          completed: completedMissions,
        },
        totalKm,
        recentMissions,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
