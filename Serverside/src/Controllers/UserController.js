import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/UserSchema.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

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
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    // Find user
    const loggedUser = await User.findOne({ email });

    if (!loggedUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Validate password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, loggedUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Get JWT secret from environment variables
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    // Create access token (short-lived)
    const accessToken = jwt.sign(
      {
        email: loggedUser.email,
        _id: loggedUser._id,
        role: loggedUser.role,
      },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRATION || "1h" }
    );

    // Create refresh token (long-lived)
    const refreshToken = jwt.sign(
      {
        _id: loggedUser._id,
      },
      jwtSecret,
      { expiresIn: "7d" }
    );

    // Save refresh token to user document
    loggedUser.refreshToken = refreshToken;
    await loggedUser.save();

    // Construct response object
    const responseUser = {
      email: loggedUser.email,
      name: loggedUser.name,
      _id: loggedUser._id,
      role: loggedUser.role,
      accessToken,
      refreshToken,
    };

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      loggedUser: responseUser,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
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
    const { _id, newName, newMobile, newPassword,newEmail, isBlock, userId ,newAddress} = req.body;


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
    if (newEmail) updateData.email = newEmail;
    if(newAddress)  updateData.address = newAddress
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
    if (!_id && !email) {
      return res.status(400).json({ message: 'Email or ID required' });
    }
    const findUser = await User.findOne({ $or: [{ email }, { _id }] });
    if (!findUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    const deletedUser = await User.findByIdAndDelete(findUser._id);
    res.status(200).json({ message: 'User is deleted !', deletedUser });
  } catch (error) {
    console.log('Delete user error:', error);
    res.status(500).json({ message: 'User is not deleted !', error: error.message });
  }
};

const getEngineers = async (req, res) => {
  try {
    // Verify if the requesting user is an admin
    if (!req.loggedUser || req.loggedUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can view engineer list",
      });
    }

    const engineers = await User.find({
      role: "engineer",
      isBlock: false, // Only get active engineers
    })
      .select("_id name email phone mobile specialization isBlock")
      .lean();

    res.status(200).json({
      success: true,
      engineers,
    });
  } catch (error) {
    console.error("Error fetching engineers:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching engineers",
      error: error.message,
    });
  }
};

export {
  registerUser,
  getUsers,
  updateUser,
  doLogin,
  deleteUser,
  getEngineers,
};
