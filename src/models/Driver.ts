import mongoose, { Schema, Document } from "mongoose";

export interface IDriver extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: Date;
  status: "available" | "on_mission" | "off";
  photo?: string;
  totalMissions: number;
  totalKm: number;
  createdAt: Date;
  updatedAt: Date;
}

const DriverSchema = new Schema<IDriver>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    licenseExpiry: { type: Date, required: true },
    status: {
      type: String,
      enum: ["available", "on_mission", "off"],
      default: "available",
    },
    photo: { type: String },
    totalMissions: { type: Number, default: 0 },
    totalKm: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Driver ||
  mongoose.model<IDriver>("Driver", DriverSchema);
