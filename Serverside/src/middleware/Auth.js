import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/UserSchema.js";

// Load environment variables
dotenv.config();

const authenticateToken = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      success: false,
      message: "Access Denied: No token provided" 
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Get JWT secret from environment variables
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    // Verify token
    const decoded = jwt.verify(token, jwtSecret);
    console.log("Decoded Token:", decoded);
    
    // Check if token is expired
    // if (decoded.exp < Date.now() / 1000) {
    //   return res.status(401).json({ 
    //     success: false,
    //     message: "Token has expired" 
    //   });
    // }

    // Fetch user details from DB
    const user = await User.findById(decoded._id).select("-password");
    console.log("Fetched User:", user);
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Attach user object to request
    req.loggedUser = user;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: "Invalid token" 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: "Token has expired" 
      });
    }

    return res.status(500).json({ 
      success: false,
      message: error.message || "Internal server error" 
    });
  }
};

// Role-based authorization middleware
const authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.loggedUser) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized: User not authenticated" 
      });
    }

    console.log("Logged User:", req.loggedUser);
    console.log("Allowed Roles:", allowedRoles);

    if (!allowedRoles.includes(req.loggedUser.role)) {
      return res.status(403).json({ 
        success: false, 
        message: "Access Denied: Insufficient permissions" 
      });
    }

    next();
  };
};

export { authenticateToken, authorizeRoles };