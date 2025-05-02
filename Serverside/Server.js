import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./src/Database/Database.js";
import router from "./src/Routes/authRouter.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(bodyParser.json());

app.use(express.json());
app.use(router);

app.use("/Uploads", express.static("Uploads"));
app.use(cookieParser());
connectDB();

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running...");
});
