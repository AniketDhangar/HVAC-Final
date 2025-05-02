import { Blogs } from "../models/BlogSchema.js";
import { User } from "../models/UserSchema.js";


const createBlog = async (req, res) => {
  console.log("logged user", req.loggedUser);
  console.log("req.file", req.file);
  try {
    const userId = req.loggedUser._id;
    console.log("userId", userId);
    console.log("req.body", req.body);


    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can add services." });
    }

    const filepath = req.file.path.replace("/\\/g", "/");
    // console.log("file path ", filepath);
    const createdBlogs = await Blogs.create({
      ...req.body,
      blogImage: filepath,
    });
    // console.log({ message: "added Successfully!..", createdBlogs });
    res.status(200).json({ message: "added Successfully !..", createdBlogs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "not added !..", error });
  }
};

const allBlogs = async (req, res) => {
  try {
    const blogs = await Blogs.find()
    .populate("userId").
    sort({ _id: -1 });
    res.status(200).json({ message: "fetch Successfully!..", blogs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "not getting !..", ...error });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { blogName, blogImage, blogCategory, blogDescription, _id } =
      req.body;

    const updatedBlog = await Blogs.findByIdAndUpdate(
      _id,
      { blogName, blogImage, blogCategory, blogDescription },
      { new: true }
    );

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
