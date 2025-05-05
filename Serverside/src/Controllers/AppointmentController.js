import { Appointment } from "../Models/AppointmentSchema.js";
import { User } from "../Models/UserSchema.js";


const createAppointment = async (req, res) => {
  try {
    console.log("Logged User:", req.loggedUser);

    if (!req.loggedUser || !req.loggedUser._id) {
      return res.status(401).json({ message: "Unauthorized: Please log in." });
    }

    const loggedInUserId = req.loggedUser._id;

   
    if (req.loggedUser.role !== "user") {
      return res.status(403).json({ message: "Only users can book appointments." });
    }

    // const { serviceId } = req.body;

    // if (!serviceId) {
    //   return res.status(400).json({ message: "Service ID is required." });
    // }

    const user = await User.findById(loggedInUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.isBlock) {
      return res.status(403).json({ message: "You are blocked and cannot take appointments." });
    }

    // Create appointment
    const appointment = await Appointment.create({
      ...req.body,
      userId: loggedInUserId, // Assign appointment to logged-in user
    });

    res.status(201).json({ appointment });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Something went wrong.",error });
  }
};


const assignWorkToEngineer = async (req, res) => {
  console.log("Logged User:", req.loggedUser);
  try {
    const { appointmentId, userId } = req.body;

    // Ensure the logged-in user is available
    if (!req.loggedUser || !req.loggedUser.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No logged-in user found." });
    }

    const loggedInUserId = req.loggedUser.id;

    // Validate input
    if (!appointmentId || !userId) {
      return res
        .status(400)
        .json({ message: "Appointment ID and Engineer ID are required." });
    }

    // Check if the logged-in user is an admin
    const admin = await User.findById(loggedInUserId);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Only admins can assign work." });
    }

    // Find the engineer
    const engineer = await User.findById(userId);
    if (!engineer || engineer.role !== "engineer") {
      return res
        .status(404)
        .json({ message: "Engineer not found or not an engineer." });
    }

    // Assign the engineer to the appointment
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { assignedEngineer: engineer._id, appointmentStatus: "Assigned" }, 
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    // Add appointment to engineer's assignedAppointments array
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

const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("userId")
      .populate("assignedEngineer")
      .populate("serviceId");
    res.status(200).json({ appointments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Update appointment status
// const updateAppointment = async (req, res) => {
//   try {
//     const { appointmentStatus, _id, userId } = req.body;
//     if (!userId) {
//       return res.status(400).json({ message: "User ID is required." });
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     if (user.role !== "admin" && user.role !== "engineer") {
//       return res
//         .status(403)
//         .json({ message: "Only admins and engineers can update status." });
//     }
//     const appointment = await Appointment.findByIdAndUpdate(
//       _id,
//       { appointmentStatus },
//       { new: true }
//     );

//     if (!appointment) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     res
//       .status(200)
//       .json({ success: true, message: "Appointment updated!", appointment });
//   } catch (error) {
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };
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



// const deleteAppointment = async (req, res) => {
//   try {
//     const userId = req.body.userId; 
//     const appointmentId = req.params.id; // Get from URL param
//     const user = req.loggedUser; // Comes from authenticateToken middleware

//     console.log("User ID:", user);
//     console.log("Appointment ID:", appointmentId);

//     // if (!user) {
//     //   return res.status(401).json({ message: "User not authenticated." });
//     // }

//     // if (user.role !== "admin") {
//     //   return res.status(403).json({ message: "Only admins can delete appointments." });
//     // }

//     if (!appointmentId) {
//       return res.status(400).json({ message: "Appointment ID is required." });
//     }

//     const appointment = await Appointment.findByIdAndDelete(appointmentId);

//     if (!appointment) {
//       return res.status(404).json({ message: "Appointment not found." });
//     }

//     res.status(200).json({ message: "Appointment deleted successfully." });
//   } catch (error) {
//     console.error("Delete Error:", error);
//     res.status(500).json({ message: "Something went wrong." });
//   }
// };

const deleteAppointment = async (req, res) => {
  try {
    const { _id, userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins  can delete appointments.!" });
    }

    if (!_id) {
      return res.status(400).json({ message: "Appointment ID is required" });
    }

    const appointment = await Appointment.findByIdAndDelete(_id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};


export {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
  assignWorkToEngineer,
};
