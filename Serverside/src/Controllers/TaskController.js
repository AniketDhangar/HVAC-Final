import { Appointment } from "../Models/AppointmentSchema.js";
import Task from "../models/TaskSchema.js";
import { User } from "../Models/UserSchema.js";
import mongoose from "mongoose";

const assignWorkToEngineer = async (req, res) => {
  try {
    console.log("Logged User:", req.loggedUser); // Debugging log
    const { appointmentId, userId } = req.body;
    console.log("Received appointmentId:", appointmentId); // Debugging log
    console.log("Received userId (engineerId):", userId); // Debugging log

    const loggedInUserId = req.loggedUser?.id;

    if (!loggedInUserId)
      return res.status(401).json({ message: "Unauthorized." });

    if (!appointmentId || !userId)
      return res
        .status(400)
        .json({ message: "Appointment ID and Engineer ID are required." });

    const admin = await User.findById(loggedInUserId);
    if (!admin || admin.role !== "admin")
      return res.status(403).json({ message: "Only admins can assign work." });

    const engineer = await User.findById(userId);
    if (!engineer || engineer.role !== "engineer")
      return res.status(404).json({ message: "Engineer not found." });

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        assignedEngineer: engineer._id,
        assignedBy: loggedInUserId,
        appointmentStatus: "Assigned",
      },
      { new: true }
    );

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found." });

    if (!engineer.assignedAppointments.includes(appointment._id)) {
      engineer.assignedAppointments.push(appointment._id);
      await engineer.save();
    }

    res.status(200).json({
      success: true,
      message: "Work assigned successfully!",
      appointment,
    });
  } catch (error) {
    console.error("Error assigning work:", error);
    res.status(500).json({ message: "Something went wrong.", error });
  }
};

const getAppointmentsForEngineer = async (req, res) => {
  try {
    const engineerId = req.loggedUser?._id; // Use logged-in engineer's ID
    console.log("Engineer ID:", engineerId);

    if (!engineerId)
      return res.status(400).json({ message: "Engineer ID missing." });

    const engineer = await User.findById(engineerId);
    if (!engineer || engineer.role !== "engineer")
      return res.status(403).json({ message: "Only engineers can access this." });

    const appointments = await Appointment.find({
      assignedEngineer: new mongoose.Types.ObjectId(engineerId), // Corrected with 'new'
    })
      .populate("userId") // Populating the userId field from the Appointment schema
      .populate("assignedEngineer")
      .populate("serviceId") // Populating the assignedEngineer field
      .sort({ createdAt: -1 });

    console.log("Appointments for Engineer:", appointments);

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.log("Error fetching appointments:", error);
    res.status(500).json({ message: "Something went wrong.", error });
  }
};

const getAppointmentByIdForEngineer = async (req, res) => {
  try {
    const engineerId = req.loggedUser?._id;
    const appointmentId = req.params.id;

    console.log("Engineer ID:", engineerId, "Appointment ID:", appointmentId);

    if (!engineerId) {
      return res.status(400).json({ message: "Engineer ID missing." });
    }

    if (!appointmentId) {
      return res.status(400).json({ message: "Appointment ID missing." });
    }

    const engineer = await User.findById(engineerId);
    if (!engineer || engineer.role !== "engineer") {
      return res.status(403).json({ message: "Only engineers can access this." });
    }

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      assignedEngineer: new mongoose.Types.ObjectId(engineerId),
    })
      .populate("userId")
      .populate("assignedEngineer")
      .populate("serviceId")

    console.log("Fetched Appointment:", appointment);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found or not assigned to this engineer." });
    }

    res.status(200).json({ success: true, appointment });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ message: "Something went wrong.", error: error.message });
  }
};



const getEngineerTasks = async (req, res) => {
  try {
    console.log('getEngineerTasks - Request URL:', req.originalUrl);
    const loggedInUserId = req.loggedUser?.id;
    console.log('getEngineerTasks - loggedInUserId:', loggedInUserId);
    if (!loggedInUserId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }
    const admin = await User.findById(loggedInUserId);
    console.log('Admin lookup:', admin ? { id: admin._id, role: admin.role } : null);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admins can access this." });
    }
    const engineers = await User.find({ role: "engineer", isBlock: false })
      .select("_id name")
      .lean();
    console.log('Engineers found:', engineers);
    if (!engineers.length) {
      return res.status(200).json({ success: true, tasks: [], message: "No engineers found." });
    }
    const engineerIds = engineers.map((eng) => new mongoose.Types.ObjectId(eng._id));
    const tasks = await Appointment.find({
      assignedEngineer: { $in: engineerIds },
    })
      .populate("userId")
      .populate("assignedEngineer")
      .populate("serviceId")
      .sort({ createdAt: -1 })
      .lean();
    console.log('Tasks found:', tasks);
    const tasksByEngineer = engineers.map((engineer) => ({
      engineer: { _id: engineer._id, name: engineer.name },
      tasks: tasks.filter((task) => task.assignedEngineer?._id.toString() === engineer._id.toString()),
    }));
    res.status(200).json({ success: true, tasks: tasksByEngineer });
  } catch (error) {
    console.error("Error fetching engineer tasks:", error);
    res.status(500).json({ success: false, message: "Error fetching tasks", error: error.message });
  }
};




// Update task status
const updateAppointment = async (req, res) => {
  try {
    const { appointmentStatus, _id, userId } = req.body;

    // Ensure the userId is passed for authorization
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Fetch user for authorization check
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Only allow users with specific roles to update status
    if (user.role !== "admin" && user.role !== "engineer") {
      return res
        .status(403)
        .json({ message: "Only admins and engineers can update status." });
    }

    // Validate appointment status
    const validStatuses = ["Pending", "Approved", "Completed", "Cancelled"];
    if (!validStatuses.includes(appointmentStatus)) {
      return res.status(400).json({ message: "Invalid appointment status." });
    }

    // Update appointment
    const appointment = await Appointment.findByIdAndUpdate(
      _id,
      { appointmentStatus },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res
      .status(200)
      .json({ success: true, message: "Appointment updated!", appointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong during update." });
  }
};

export { assignWorkToEngineer, getAppointmentsForEngineer,getAppointmentByIdForEngineer,getEngineerTasks };
