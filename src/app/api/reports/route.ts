import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Mission from "@/models/Mission";
import Vehicle from "@/models/Vehicle";
import Driver from "@/models/Driver";

export async function GET() {
  try {
    await connectDB();

    // Km par mois (6 derniers mois)
    const kmByMonth = await Mission.aggregate([
      { $match: { status: "completed", distance: { $gt: 0 } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          km: { $sum: "$distance" },
          missions: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 6 },
    ]);

    // Carburant par mois
    const fuelByMonth = await Mission.aggregate([
      { $match: { status: "completed", fuelUsed: { $gt: 0 } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          litres: { $sum: "$fuelUsed" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 6 },
    ]);

    // Statut des missions
    const missionsByStatus = await Mission.aggregate([
      {
        $group: {
          _id: "$status",
          value: { $sum: 1 },
        },
      },
    ]);

    // Performance conducteurs
    const driverPerf = await Mission.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: "$driver",
          missions: { $sum: 1 },
          km: { $sum: "$distance" },
        },
      },
      { $sort: { missions: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "drivers",
          localField: "_id",
          foreignField: "_id",
          as: "driverInfo",
        },
      },
      { $unwind: "$driverInfo" },
      {
        $project: {
          name: {
            $concat: [
              "$driverInfo.firstName",
              " ",
              { $substr: ["$driverInfo.lastName", 0, 1] },
              ".",
            ],
          },
          missions: 1,
          km: 1,
        },
      },
    ]);

    // Stats globales
    const [totalKm, totalFuel, totalMissions] = await Promise.all([
      Mission.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$distance" } } },
      ]),
      Mission.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$fuelUsed" } } },
      ]),
      Mission.countDocuments({ status: "completed" }),
    ]);

    // Noms des mois
    const monthNames = [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Jun",
      "Jul",
      "Aoû",
      "Sep",
      "Oct",
      "Nov",
      "Déc",
    ];

    const statusColors = {
      completed: "#22c55e",
      in_progress: "#3b82f6",
      pending: "#f59e0b",
      cancelled: "#ef4444",
    };

    const statusLabels = {
      completed: "Terminées",
      in_progress: "En cours",
      pending: "En attente",
      cancelled: "Annulées",
    };

    return NextResponse.json({
      success: true,
      data: {
        kmByMonth: kmByMonth.map((item) => ({
          month: monthNames[item._id.month - 1],
          km: item.km,
        })),
        fuelByMonth: fuelByMonth.map((item) => ({
          month: monthNames[item._id.month - 1],
          litres: item.litres,
        })),
        missionsByStatus: missionsByStatus.map((item) => ({
          name: statusLabels[item._id as keyof typeof statusLabels] || item._id,
          value: item.value,
          color: statusColors[item._id as keyof typeof statusColors] || "#888",
        })),
        driverPerf,
        globalStats: {
          totalKm: totalKm[0]?.total || 0,
          totalFuel: totalFuel[0]?.total || 0,
          totalMissions,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
