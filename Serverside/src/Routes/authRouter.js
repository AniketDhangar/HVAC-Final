import express from "express";
import {
  createAppointment,
  deleteAppointment,
  getAppointments,
  updateAppointment,
  getMyAppointments,
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
  getAppointmentByIdForEngineer,
  getEngineerTasks,
} from "../Controllers/TaskController.js";

const router = express.Router();

router.post(
  "/takeappoinment",
  authenticateToken,
  authorizeRoles("user"),
  createAppointment
);
router.get("/getappoinments", getAppointments);
router.get(
  "/myappointments",
  authenticateToken,
  authorizeRoles(["user","admin"]),
  getMyAppointments
);
router.put(
  "/updateappointment",
  authenticateToken,
  authorizeRoles(["admin", "engineer"]),
  updateAppointment
);
router.delete(
  "/deleteappointment",
  authenticateToken,
  authorizeRoles("admin"),
  deleteAppointment
);

// Services routes
router.post(
  "/addservice",
  authenticateToken,
  authorizeRoles("admin"),
  uploader.single("serviceImage"),
  addService
);
router.get(
  "/servicesforadmin",
  authenticateToken,
  authorizeRoles("admin"),
  getServices
);
router.get("/services", getServices);
router.delete(
  "/deleteservice",
  authenticateToken,
  authorizeRoles("admin"),
  deleteService
);
router.put(
  "/updateservice",
  authenticateToken,
  authorizeRoles("admin"),
  uploader.single("serviceImage"),
  updateService
);

// Blogs
router.post(
  "/addblogs",
  authenticateToken,
  authorizeRoles("admin"),
  uploader.single("blogImage"),
  createBlog
);
router.get("/blogs",  allBlogs);
router.get(
  "/blogsforadmin",
  authenticateToken,
  authorizeRoles("admin"),
  allBlogs
);
router.put(
  "/updateblog",
  authenticateToken,
  authorizeRoles("admin"),
  uploader.single("blogImage"),
  updateBlog
);
router.delete(
  "/deleteblog",
  authenticateToken,
  authorizeRoles("admin"),
  deleteBlog
);

// Client User Routes
router.post("/register", registerUser);
router.get("/users", getUsers);
router.put("/users", updateUser);
router.delete(
  "/deleteuser",
  authenticateToken,
  authorizeRoles("admin"),
  deleteUser
);
router.get(
  "/getengineers",
  authenticateToken,
  authorizeRoles("admin"),
  getEngineers
);

// Dashboard
router.get(
  "/dashboard",
  authenticateToken,
  authorizeRoles("admin"),
  DashboardCollection
);

// Contacts
router.post("/addcontacts", createContact);
router.get(
  "/getcontacts",
  authenticateToken,
  authorizeRoles("admin"),
  getContacts
);
router.delete(
  "/deletecontact",
  authenticateToken,
  authorizeRoles("admin"),
  deleteContact
);
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
router.get(
  "/getEngineerTasks",
  authenticateToken,
  authorizeRoles("admin"),
  getEngineerTasks
);
router.post(
  "/assign",
  authenticateToken,
  authorizeRoles("admin"),
  assignWorkToEngineer
);

export default router;
