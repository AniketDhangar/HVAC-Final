import uploadOnCloudinary from "../middleware/cloudInary.js";
import { Blogs } from "../models/BlogSchema.js";

import fs from "fs";

// CREATE BLOG with Cloudinary
const createBlog = async (req, res) => {
  try {
    const { blogName, blogCategory, uploadedDate, blogDescription } = req.body;

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadOnCloudinary(req.file.path);
      fs.unlinkSync(req.file.path); // delete local file
    }

    const createdBlogs = await Blogs.create({
      ...req.body,
      blogImage: imageUrl, // Cloudinary URL
    });

    res.status(200).json({ message: "added Successfully!..", createdBlogs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "not added !..", ...error });
  }
};

// GET ALL BLOGS — no change
const allBlogs = async (req, res) => {
  try {
    const blogs = await Blogs.find().populate("userId").sort({ _id: -1 });
    res.status(200).json({ message: "fetch Successfully!..", blogs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "not getting !..", ...error });
  }
};

// UPDATE BLOG with Cloudinary
const updateBlog = async (req, res) => {
  try {
    const { blogName, blogCategory, blogDescription, _id } = req.body;
    let updateData = {
      blogName,
      blogCategory,
      blogDescription
    };

    if (req.file) {
      const imageUrl = await uploadOnCloudinary(req.file.path);
      fs.unlinkSync(req.file.path); // delete local file
      updateData.blogImage = imageUrl;
    }

    const updatedBlog = await Blogs.findByIdAndUpdate(_id, updateData, {
      new: true,
    });

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res
      .status(200)
      .json({ message: "Blog updated successfully!", updatedBlog });
  } catch (error) {
    console.error("Error during update:", error);
    return res
      .status(500)
      .json({ message: "Error during update", error: error.message });
  }
};

// DELETE BLOG — no change
const deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blogs.findByIdAndDelete(req.body._id);

    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res
      .status(200)
      .json({ message: "Blog deleted successfully!", deletedBlog });
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({ message: "Failed to delete blog!", error });
  }
};

export { createBlog, allBlogs, updateBlog, deleteBlog };
