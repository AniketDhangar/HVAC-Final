import express from "express";
import {
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
  getEngineers,
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
import {
  assignWorkToEngineer,
  getAppointmentsForEngineer,
  getAppointmentByIdForEngineer
} from "../Controllers/TaskController.js";

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
  authorizeRoles(["admin","engineer"]),
  updateAppointment
);
router.delete(
  "/deleteappointment",
  authenticateToken,
  authorizeRoles("admin"),
  deleteAppointment
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
router.put(
  "/updateblog",
  authenticateToken,
  authorizeRoles("admin"),
  uploader.single("blogImage"),
  updateBlog
);
router.delete("/deleteblog", deleteBlog);

// Client User Routes
router.post("/register", registerUser);
router.get("/users", getUsers);
router.put("/users", updateUser);
router.delete("/deleteuser", deleteUser);
router.get(
  "/getengineers",
  authenticateToken,
  authorizeRoles("admin"),
  getEngineers
);

// Dashboard
router.get("/dashboard", authenticateToken, DashboardCollection);

// Contacts
router.post("/addcontacts", createContact);
router.get("/getcontacts", getContacts);
router.delete("/deletecontact", deleteContact);
router.put("/updatecontact", updateContact);

// Auth routes

router.post("/login", doLogin);

// Engineer routes
router.get(
  "/engineer/appointments/:engineerId",
  authenticateToken,
  authorizeRoles("engineer"),
  getAppointmentsForEngineer
);
router.get(
  "/engineer/appointment/:id",
  authenticateToken,
  authorizeRoles("engineer"),
  getAppointmentByIdForEngineer
);
router.post(
  "/assign",
  authenticateToken,
  authorizeRoles("admin"),
  assignWorkToEngineer
);

export default router;
