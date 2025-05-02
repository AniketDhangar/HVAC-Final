import { Service } from "../models/ServicesSchema.js";
import { User } from "../models/UserSchema.js";


const addService = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can add services." });
    }

    //here we are getting the file path
    //we are replacing the backslashes with forward slashes
    //because the path that we get from the multer is in backslashes
    //and we need to convert it into forward slashes
    //because the path that we get from the multer is in backslashes
    //and we need to convert it into forward slashes

    const filepath = req.file.path.replace("/\\/g", "/");
    // console.log("file path ", filepath);
    //here we are creating the service
    //we are using the spread operator to get all the data from the body
    //and we are adding the file path to the service image
    //and then we are creating the service
    const addedService = await Service.create({
      ...req.body,
      serviceImage: filepath,
    });
    //file path is the path of the image that we uploaded
    // console.log(addedService);
    res.status(200).json({ addedService });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

const getServices = async (req, res) => {
  try {
    const allServices = await Service.find().populate("userId");

    // console.log(allServices);
    res
      .status(200)
      .json({ success: true, message: "all services fetched", allServices });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "error in getting services!" });
  }
};

const deleteService = async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.body._id);
    // console.log(deletedService);
    res.status(200).json({ message: "deleted successfully!", deletedService });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error in deleting service!" });
  }
};


const updateService = async (req, res) => {
  const { serviceName, serviceDescription, serviceType, serviceImage } =
    req.body;

  try {
    const updatedService = await Service.findByIdAndUpdate(
      { _id: req.body.id },

      { serviceName, serviceDescription, serviceType, serviceImage },
      { new: true }
    );
    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ message: "updated successfully", updatedService });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating service", error });
  }
};

export { addService, getServices, deleteService, updateService };
