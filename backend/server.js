import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/ConnectDB.js";
import helperRouter from "./routes/helperRoute.js";
import victimRouter from "./routes/victimRoute.js";
import volunteerRouter from "./routes/volunteerRoute.js";
import { getAllActiveRequests } from "./controllers/requestloader.js";
import { getAllvictimDetail } from "./controllers/viewLoader.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// FIXED: Added the missing colon after http
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "ngrok-skip-browser-warning"] // Allow the new header
};

app.use(cors(corsOptions));
app.get("/health", (req, res) => res.status(200).json({ status: "Server is healthy!" }));
app.use("/helper", helperRouter);
app.use("/victim", victimRouter);
app.use("/volunteer", volunteerRouter);
app.get("/getallvictim", getAllActiveRequests);
app.get("/viewvictimdetail", getAllvictimDetail);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running at port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to the database. Server not started.", error);
        process.exit(1); 
    }
};

startServer();