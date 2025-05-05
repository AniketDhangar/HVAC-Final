import express from "express";
import {
  assignWorkToEngineer,
  createAppointment,
  deleteAppointment,
  getAppointments,
  updateAppointment,
} from "../Controllers/AppointmentController.js";
import { authenticateToken, authorizeRoles } from "../middleware/Auth.js";
import { uploader } from "../middleware/multerUploads.js";
import {
  addService,
  deleteService,
  getServices,
  updateService,
} from "../Controllers/ServicesController.js";

import {
  createBlog,
  deleteBlog,
  updateBlog,
  allBlogs,
} from "../Controllers/BlogController.js";
import {
  deleteUser,
  doLogin,
  getUsers,
  registerUser,
  updateUser,
} from "../Controllers/UserController.js";
import { DashboardCollection } from "../Controllers/DashboardController.js";
import {
  createContact,
  deleteContact,
  updateContact,
  getContacts,
} from "../Controllers/ContactController.js";

const router = express.Router();

router.post(
  "/takeappoinment",
  authenticateToken,
  authorizeRoles("user"),
  createAppointment
);
router.get("/getappoinments", getAppointments);
router.put(
  "/updateappointment",
  authenticateToken,
  authorizeRoles("admin"),
  updateAppointment
);
router.delete(
  "/deleteappointment",
  authenticateToken,
  authorizeRoles("admin"),
  deleteAppointment
);

router.post(
  "/assign",
  // authenticateToken,
  // authorizeRoles("admin"),
  assignWorkToEngineer
);

// Services routes
router.post("/addservice", uploader.single("serviceImage"), addService);
router.get("/servicesforadmin", getServices);
router.get("/services", getServices);
router.delete("/deleteservice", deleteService);
router.put("/updateservice", updateService);

// Blogs
router.post(
  "/addblogs",
  authenticateToken,
  authorizeRoles("admin"),
  uploader.single("blogImage"),
  createBlog
);
router.get("/blogs", allBlogs);
router.get("/blogsforadmin", allBlogs);
router.put("/updateblog", updateBlog);
router.delete("/deleteblog", deleteBlog);

// Client User Routes
router.post("/register", registerUser);
router.get("/users", getUsers);
router.put("/users", updateUser);
router.delete("/deleteuser", deleteUser);

// Dashboard
router.get("/", authenticateToken, DashboardCollection);

// Contacts
router.post("/addcontacts", createContact);
router.get("/getcontacts", getContacts);
router.delete("/deletecontact", deleteContact);
router.put("/updatecontact", updateContact);

// Auth routes

router.post("/login", doLogin);

export default router;
