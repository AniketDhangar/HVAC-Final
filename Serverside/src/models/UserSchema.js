import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter your name"],
    },
    email: {
      type: String,
      required: [true, "Enter your email"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Enter your password"],
    },
    mobile: {
      type: Number,
      required: [true, "Enter your mobile"],
      trim: true,
      minlength: 10,
      maxlength: 10,
    },
    role: {
      type: String,
      enum: ["admin", "user", "engineer"],
      required: [true, "please choose your role."],
    },
    address: {
      type: String,
      required: [true, "Please provide an address"],
    },
    isBlock: {
      type: Boolean,
      default: false,
    },
    appointmentId: {
      type: mongoose.Types.ObjectId,
      ref: "Service",
    },
    assignedAppointments: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Appointment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ✅ Prevent OverwriteModelError
export const User = mongoose.models.User || mongoose.model("User", UserSchema);
