import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./src/Database/Database.js";
import router from "./src/Routes/authRouter.js";
import { authenticateToken } from "./src/middleware/Auth.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(bodyParser.json());

app.use(express.json());
app.use(router);
router.get("/me", authenticateToken, async (req, res) => {
  try {
    res.status(200).json({ user: req.loggedUser });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user details." });
  }
});
app.use("/Uploads", express.static("Uploads"));
app.use(cookieParser());
connectDB();

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running...");
});
