

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/UserSchema.js";


const registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ exists: true, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const addedUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User added successfully", addedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const doLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Fill all details carefully" });
    }

    // Find user
    const loggedUser = await User.findOne({ email });

    if (!loggedUser) {
      return res.status(401).json({ message: "User is not registered" });
    }

    // Validate password using bcrypt
    const isPasswordValid = bcrypt.compare(password, loggedUser.password); // Faster sync comparison
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    // Token creation
    const payload = { email: loggedUser.email, _id: loggedUser._id, role: loggedUser.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });

    // Construct response object (Avoid mutating original user object)
    const responseUser = {
      email: loggedUser.email,
      name: loggedUser.name,
      _id: loggedUser._id,
      role: loggedUser.role,
      token,
    };
    console.log(responseUser);
    return res.status(200).json({
      message: "Logged in successfully",
      loggedUser: responseUser,
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {

    const allUsers = await User.find()
      .populate("appointmentId")
      .populate("assignedAppointments")
      .populate("assignedAppointments.userId")
      .populate("assignedAppointments.serviceId")
      .populate({
        path: "assignedAppointments.assignedEngineer",
        select: "name email mobile",
      })
      .sort({ createdAt: -1 });
    res.status(200).json({ message: "Users fetched successfully", allUsers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Fetching error", error });
  }
};


const updateUser = async (req, res) => {
  try {
    const { _id, newName, newMobile, newPassword, isBlock, userId } = req.body;

    // Fetch the user making the request
    const requestingUser = await User.findById(userId);
    if (!requestingUser) {
      return res.status(404).json({ message: "Requesting user not found" });
    }

    // Only admin or engineer can block/unblock users
    if (
      isBlock !== undefined &&
      requestingUser.role !== "admin" &&
      requestingUser.role !== "engineer"
    ) {
      return res
        .status(403)
        .json({ message: "Only admin and engineer can block/unblock users" });
    }

    let updateData = {};
    if (newName) updateData.name = newName;
    if (newMobile) updateData.mobile = newMobile;
    if (newPassword) updateData.password = await bcrypt.hash(newPassword, 10);
    if (isBlock !== undefined) updateData.isBlock = isBlock;

    const updatedUser = await User.findByIdAndUpdate(_id, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { email, _id } = req.body;
    const findUser = await User.findOne({ $or: [{ email }, { _id }] });
    if (!findUser) {
      res.status(404).json({ message: "User not found" });
    }
    const deletedUser = await User.findByIdAndDelete(findUser._id);
    res.status(200).json({ message: "User is deleted !", deletedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "User is not  deleted !", error });
  }
};

export { registerUser, getUsers, updateUser, doLogin, deleteUser };
