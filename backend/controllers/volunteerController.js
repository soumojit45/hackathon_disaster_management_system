import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { volunteer_signup_validator, volunteer_login_validator } from "../validators/volunteerValidator.js";
import Volunteer from "../models/volunteerSchema.js";

// --- TOKEN GENERATION ---
const createToken = (id, email) => {
    if (!process.env.SECRET_KEY) {
        throw new Error("JWT Secret key is Missing");
    }
    return jwt.sign({ id, email }, process.env.SECRET_KEY, { expiresIn: '7d' });
};

const cookieOption = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
};

// --- SIGNUP ---
export const signup = async (req, res) => {
    try {
        const result = volunteer_signup_validator(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: result.error.issues[0].message
            });
        }

        const { name, location, email, password, 
            contactno, availableArea, IsActive ,VER_IMG_LINK} = result.data;

        const u = await Volunteer.findOne({ email });

        if (u) {
            return res.status(409).json({
                message: "Email ID already exists"
            });
        }
        
        // Directly using bcrypt.hash with cost factor 12 (no separate salt step)
        const hashPassword = await bcrypt.hash(password, 12);

        const volunteerCreated = await Volunteer.create({
            name,
            location,
            email,
            password: hashPassword,
            contactno,
            availableArea,
            IsActive,
            VER_IMG_LINK
        });

        // Generate token and attach to cookie
        const token = createToken(volunteerCreated._id, email);
        res.cookie("token", token, cookieOption);

        return res.status(201).json({
            message: "Volunteer created successfully",
            name,
            email
        });
    }
    catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({
            message: "Internal Server error"
        });
    }
};

// --- LOGIN ---
export const login = async (req, res) => {
    try {
        const result = volunteer_login_validator(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: result.error.issues[0].message
            });
        }

        const { email, password } = result.data;

        const existingVolunteer = await Volunteer.findOne({ email });
        if (!existingVolunteer) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, existingVolunteer.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        // Generate token and attach to cookie
        const token = createToken(existingVolunteer._id, email);
        res.cookie("token", token, cookieOption);

        return res.status(200).json({
            message: "Volunteer Logged in Successfully",
            name: existingVolunteer.name,
            email: existingVolunteer.email,
        });
    }
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

// --- LOGOUT ---
export const logout = async (req, res) => {
    try {
        // Clear cookie matching the exact options it was set with
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        return res.status(200).json({
            message: "Logged Out Successfully"
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// --- PROFILE ---
export const profile = async (req, res) => {
    try {
        return res.status(200).json({
            message: "Volunteer Profile Fetched Successfully",
            name: req.existingVolunteer.name,
            email: req.existingVolunteer.email,
            location: req.existingVolunteer.location,
            contactno: req.existingVolunteer.contactno,
            availableArea: req.existingVolunteer.availableArea,
            IsActive: req.existingVolunteer.IsActive
        });
    }
    catch (err) {
        console.error("Profile error:", err);
        return res.status(500).json({
            message: "Internal Server error"
        });
    }
};

// --- DELETE ---
export const Delete = async (req, res) => {
    try {
        const volunteerId = req.existingVolunteer._id;

        await Volunteer.deleteOne({ _id: volunteerId });

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        return res.status(200).json({
            message: "Account deleted successfully"
        });
    }
    catch (err) {
        console.error("Delete error:", err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};