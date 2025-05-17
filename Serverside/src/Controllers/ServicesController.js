import { Service } from "../models/ServicesSchema.js";
import { User } from "../models/UserSchema.js";

import uploadOnCloudinary from "../middleware/cloudInary.js";
import fs from "fs";

const addService = async (req, res) => {
  try {
    const { userId } = req.body;

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

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadOnCloudinary(req.file.path);
      fs.unlinkSync(req.file.path); // delete local file after upload
    }

    const addedService = await Service.create({
      ...req.body,
      serviceImage: imageUrl,
    });

    res.status(200).json({ addedService });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

const getServices = async (req, res) => {
  try {
    const allServices = await Service.find().populate("userId");

    // console.log(allServices);
    res
      .status(200)
      .json({ success: true, message: "all services fetched", allServices });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "error in getting services!" });
  }
};

const deleteService = async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.body._id);
    // console.log(deletedService);
    res.status(200).json({ message: "deleted successfully!", deletedService });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error in deleting service!" });
  }
};

const updateService = async (req, res) => {
  const { serviceName, serviceDescription, serviceType, id } = req.body;

  try {
    let updateData = {
      serviceName,
      serviceDescription,
      serviceType,
    };

    if (req.file) {
      const imageUrl = await uploadOnCloudinary(req.file.path);
      fs.unlinkSync(req.file.path); // delete local image
      updateData.serviceImage = imageUrl;
    }

    const updatedService = await Service.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({ message: "updated successfully", updatedService });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating service", error });
  }
};

export { addService, getServices, deleteService, updateService };
