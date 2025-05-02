
import { Appointment } from "../Models/AppointmentSchema.js";
import { Blogs } from "../models/BlogSchema.js";
import { Service } from "../models/ServicesSchema.js";


const DashboardCollection = async (req, res) => {
  try {
    const appointmentCount = await Appointment.countDocuments();
    const serviceCount = await Service.countDocuments();
    const blogsCount = await Blogs.countDocuments();

    const counter = {
      appointmentCount,
      serviceCount,
      blogsCount,
    };

    res.status(200).json({ data: counter });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

export { DashboardCollection };
