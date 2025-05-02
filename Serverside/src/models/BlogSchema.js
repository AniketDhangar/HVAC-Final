import mongoose from "mongoose";

const BlogSchema = mongoose.Schema({
  blogName: {
    type: String,
    required: true,
  },
  blogImage: {
    type: String,
    required: true,
  },
  blogCategory: {
    type: String,
    required: true,
  },
  blogDescription: {
    type: String,
    required: true,
  },
  uploadedDate: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Blogs = mongoose.model("Blog", BlogSchema);
