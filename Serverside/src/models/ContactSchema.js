import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter your name"],
    },
    email: {
      type: String,
      required: [true, "Enter your email"],
      
      lowercase: true,
      trim: true,
    },

    message: {
      type: String,
      required: [true, "Enter your message"],
    },
    subject: {
      type: String,
      required: [true, "Enter your message"],
    },
    isBlock:{
      type:Boolean,
      default:false
    }
  },
  {
    timestamps: true,
  }
);

export const Contact = mongoose.model("Contact", ContactSchema);
