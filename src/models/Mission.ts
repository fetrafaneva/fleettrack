import mongoose, { Schema, Document } from "mongoose";

export interface IMission extends Document {
  title: string;
  description?: string;
  vehicle: mongoose.Types.ObjectId;
  driver: mongoose.Types.ObjectId;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  startLocation: { lat: number; lng: number; address: string };
  endLocation: { lat: number; lng: number; address: string };
  startTime?: Date;
  endTime?: Date;
  distance?: number;
  fuelUsed?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MissionSchema = new Schema<IMission>(
  {
    title: { type: String, required: true },
    description: { type: String },
    vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    driver: { type: Schema.Types.ObjectId, ref: "Driver", required: true },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
    startLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String, required: true },
    },
    endLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String, required: true },
    },
    startTime: { type: Date },
    endTime: { type: Date },
    distance: { type: Number },
    fuelUsed: { type: Number },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Mission ||
  mongoose.model<IMission>("Mission", MissionSchema);
