import multer from "multer";
import path from "path";

//this is the configuration for multer
const fileStorage = multer.diskStorage({
  //this is the destination where the file will be stored
  destination: function (req, file, next) {
    //this is the path where the file will be stored 
    next(null, "Uploads/");
  },
  //this is file name
  filename: (req, file, next) => {
    //this is the file name that will be stored in the database
    next(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

export const uploader = multer({ storage: fileStorage });
//now we can use this middleware in our routes
//goto routes
