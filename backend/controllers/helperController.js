import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
    helper_login_validator,
    helper_register_validator,
    helper_signup_validator
} from "../validators/helperValidator.js";
import HelperAcc from "../models/HelperAccountSchema.js";
import Helper from "../models/HelperSchema.js";

const createToken = (id, email) => {
    if (!process.env.SECRET_KEY) {
        throw new Error("JWT Secret key is Missing");
    }
    return jwt.sign({ id, email }, process.env.SECRET_KEY, { expiresIn: '5h' });
}

// Fixed cookie options for Ngrok / Cross-Origin requests
const cookieOption = {
    httpOnly: false,
    secure: true,       
    sameSite: "none",   
    maxAge: 5 * 60 * 60 * 1000 // 5 hours
}

// --- SIGNUP ---
export const signup = async (req, res) => {
    try {
        const result = helper_signup_validator(req.body);

        if (!result.success) {
            return res.status(400).json({ message: result.error.issues[0].message });
        }

        const { email, password, fullName, registrationType, latitude, longitude, VER_IMG_LINK } = result.data;

        const existingUser = await HelperAcc.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email ID already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 12);

        const helperCreated = await HelperAcc.create({
            fullName,
            email,
            password: hashPassword,
            registrationType,
            latitude,
            longitude,
            VER_IMG_LINK
        });

        const token = createToken(helperCreated._id, email);
        res.cookie("token", token, cookieOption);

        return res.status(201).json({
            message: "Helper created successfully",
            fullName,
            email
        });
    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({ message: "Internal Server error" });
    }
}

// --- LOGIN ---
export const login = async (req, res) => {
    try {
        const result = helper_login_validator(req.body);

        if (!result.success) {
            return res.status(400).json({ message: result.error.issues[0].message });
        }

        const { email, password } = result.data;

        const existingHelper = await HelperAcc.findOne({ email });
        if (!existingHelper) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, existingHelper.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const token = createToken(existingHelper._id, email);
        res.cookie("token", token, cookieOption);

        return res.status(200).json({
            message: "Helper logged in successfully",
            fullName: existingHelper.fullName,
            email: existingHelper.email,
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// --- LOGOUT ---
export const logout = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });

    return res.status(200).json({ message: "User logged out successfully" });
}

// --- PROFILE ---
export const profile = async (req, res) => {
    try {
        return res.status(200).json({
            message: "Helper Profile Fetched Successfully",
            fullName: req.existingHelper.fullName,
            email: req.existingHelper.email,
        });
    } catch (err) {
        console.error("Profile Error:", err);
        return res.status(500).json({ message: "Internal Server error" });
    }
}

// --- DELETE ---
export const Delete = async (req, res) => {
    try {
        const helperId = req.existingHelper._id;

        await Helper.deleteMany({ helperId });
        await HelperAcc.deleteOne({ _id: helperId });

        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        return res.status(200).json({ message: "Account deleted successfully" });
    } catch (err) {
        console.error("Delete Error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// --- ADD HELP ---
// --- ADD HELP ---
export const addHelp = async (req, res) => {
    try {
        const result = helper_register_validator(req.body);

        if (!result.success) {
            return res.status(400).json({ message: result.error.errors[0].message });
        }

        const { phoneNumber, destination, helpAvailable, description } = result.data;

        if (!req.existingHelper || !req.existingHelper._id) {
            return res.status(401).json({ message: "Unauthorized: Helper account not found in request." });
        }

        const helperId = req.existingHelper._id;
        const fullName = req.existingHelper.fullName;
        const registrationType = req.existingHelper.registrationType;
        const email = req.existingHelper.email;

        if (!fullName || !registrationType || !email) {
            return res.status(400).json({ message: "Incomplete helper profile in authentication token." });
        }

        const newHelpListing = await Helper.create({
            fullName,
            registrationType,
            email,
            helperId,
            phoneNumber,
            destination,
            helpAvailable,
            description
        });

        return res.status(201).json({
            message: "Help listing added successfully",
            destination: newHelpListing.destination,
            helpAvailable: newHelpListing.helpAvailable
        });

    } catch (error) {
        console.error("Error in addHelp:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// GET VICTIM ---

export const getvictim = async (req, res) => {
    try {
        // Check if the middleware successfully attached the victim to the request
        if (!req.existingVictim) {
            return res.status(404).json({
                success: false,
                message: "Victim data not found."
            });
        }

        // Return the properties of the victim
        return res.status(200).json({
            success: true,
            victim: req.existingVictim
        });

    } catch (error) {
        console.error("Error in getvictim:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message
        });
    }
};