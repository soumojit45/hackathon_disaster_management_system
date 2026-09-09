import jwt from "jsonwebtoken";
import Volunteer from "../models/volunteerSchema.js"; 

export const verifyVolunteerAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const volunteer = await Volunteer.findById(decoded.id).select("-password");
        if (!volunteer) {
            return res.status(404).json({ message: "Volunteer account not found" });
        }

        req.existingVolunteer = volunteer;
        next();
    } catch (error) {
        console.error("Volunteer Auth Middleware Error:", error);
        return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
};