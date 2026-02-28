import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./src/Config/Database.js";
import router from "./src/Routes/authRouter.js";
import { authenticateToken } from "./src/middleware/Auth.js";
import path from "path";
import { fileURLToPath } from "url";
import helmet from 'helmet'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Load environment variables
dotenv.config();

// Connect to database
connectDB();


app.use(helmet());

app.use(
  cors({
    origin:[ "http://localhost:5173", "https://hvac-final.onrender.com"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());



// Serve static files from Uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

app.use(router);


// User profile route
router.get("/me", authenticateToken, async (req, res) => {
  try {
    res.status(200).json({ user: req.loggedUser });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user details." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
