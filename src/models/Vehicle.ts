import mongoose, { Schema, Document } from "mongoose";

export interface IVehicle extends Document {
  plate: string;
  modelName: string;
  brand: string;
  type: "car" | "motorcycle" | "truck";
  status: "available" | "on_mission" | "maintenance";
  year: number;
  fuel: "petrol" | "diesel" | "electric";
  mileage: number;
  lastPosition: {
    lat: number;
    lng: number;
    updatedAt: Date;
  };
  photo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VehicleSchema = new Schema<IVehicle>(
  {
    plate: { type: String, required: true, unique: true },
    modelName: { type: String, required: true },
    brand: { type: String, required: true },
    type: {
      type: String,
      enum: ["car", "motorcycle", "truck"],
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "on_mission", "maintenance"],
      default: "available",
    },
    year: { type: Number, required: true },
    fuel: {
      type: String,
      enum: ["petrol", "diesel", "electric"],
      required: true,
    },
    mileage: { type: Number, default: 0 },
    lastPosition: {
      lat: { type: Number, default: -18.8792 },
      lng: { type: Number, default: 47.5079 },
      updatedAt: { type: Date, default: Date.now },
    },
    photo: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Vehicle ||
  mongoose.model<IVehicle>("Vehicle", VehicleSchema);
