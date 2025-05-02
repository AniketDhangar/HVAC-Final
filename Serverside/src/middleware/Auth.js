import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/UserSchema.js";



dotenv.config();

const authenticateToken = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  console.log("Authorization Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user details from DB
    const user = await User.findById(decoded._id).select("-password"); // Exclude password
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.loggedUser = user;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(403).json({ message: "Invalid or Expired Token" });
  }
};

// Role-based authorization middleware
const authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.loggedUser || !allowedRoles.includes(req.loggedUser.role)) {
      return res.status(403).json({ success: false, message: "Access Denied: Insufficient permissions" });
    }
    next();
  };
};

export { authenticateToken, authorizeRoles };