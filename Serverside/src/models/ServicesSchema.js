import mongoose from "mongoose";
const setLimit = (value) => value.split(/\s+/).length <= 20;

const ServicesSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: [true, "Name is required."],
    },
    serviceDescription: {
      type: String,
      required: [true, "Discription is required."],
      validate: [setLimit, "Description cannot exceed 20 words"],
    },

    serviceType: {
      type: String,
      required: [true, "Please provide a service type"],
      enum: [
        "Repair",
        "Installation",
        "Service",
        "Heater Maintenance",
        "Other",
        "Maintenance",
      ],
    },
    serviceImage: {
      type: String,
      required: true,
    },

    serviceDate: {
      type: Date,
      default: Date.now,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
  },
  { timestamps: true }
);

export const Service = mongoose.model("Service", ServicesSchema);
