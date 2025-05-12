import { Appointment } from "../Models/AppointmentSchema.js";
import { Blogs } from "../models/BlogSchema.js";
import { Service } from "../models/ServicesSchema.js";

const DashboardCollection = async (req, res) => {
  try {
    const appointments = await Appointment.find(); // Fetch all appointment documents
    const services = await Service.find(); // Fetch all services
    const blogs = await Blogs.find(); // Fetch all blogs

    const counter = {
      appointmentCount: appointments, // Array of appointments
      serviceCount: services, // Array of services
      blogsCount: blogs, // Array of blogs
    };

    res.status(200).json({ data: counter });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
};

export { DashboardCollection };