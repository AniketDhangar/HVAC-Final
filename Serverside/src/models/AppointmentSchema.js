import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required."],
    },
    assignedEngineer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    deviceBrand: {
      type: String,
    },
    serviceId: {
      type: mongoose.Types.ObjectId,
      ref: "Service"
    },
   
    problemDescription: {
      type: String,
    },
    appointmentStatus: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Approved", "Completed", "Cancelled"],
    },
  },
  {
    timestamps: true,
  }
);

export const Appointment = mongoose.model("Appointment", AppointmentSchema);
