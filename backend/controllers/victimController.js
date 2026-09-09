import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import VictimAcc from "../models/VictimAccSchema.js";
import VictimHelp from "../models/VictimHelpSchema.js";
import { signupSchema, loginSchema, needHelpSchema } from "../validators/victimValidator.js"
import { generateUrgencyScore } from "../utils/urgencyScoreService.js";

// --- SIGNUP ---
export const signup = async (req, res) => {
    try {
        // 1. Validate with Zod
        const validation = signupSchema.safeParse(req.body);
        if (!validation.success) {
            // Map over zod errors to return clean messages
            return res.status(400).json({
                errors: validation.error.issues.map(issue => ({ path: issue.path[0], message: issue.message }))
            });
        }

        const { contactPersonName, phoneNumber, password, email } = validation.data;

        // 2. Check if user already exists
        const existingUser = await VictimAcc.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(400).json({ message: "User with this phone number already exists" });
        }

        // 3. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create new Victim
        const newVictim = new VictimAcc({
            contactPersonName,
            phoneNumber,
            password: hashedPassword,
            ...(email && { email }) // Only add email if it was provided
        });

        await newVictim.save();

        res.status(201).json({ message: "Account created successfully" });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Server error during signup" });
    }
};

// --- LOGIN ---
export const login = async (req, res) => {
    try {
        const validation = loginSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                errors: validation.error.issues.map(issue => ({ path: issue.path[0], message: issue.message }))
            });
        }

        const { phoneNumber, password } = validation.data;

        // 1. Find user by phone number
        const victim = await VictimAcc.findOne({ phoneNumber });
        if (!victim) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // 2. Compare passwords
        const isMatch = await bcrypt.compare(password, victim.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // 3. Generate JWT Token
        const token = jwt.sign(
            { id: victim._id },
            process.env.SECRET_KEY || "fallback_secret_key",
            { expiresIn: "7d" }
        );

        // 4. Send token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000 ,// 7 days
            sameSite: "none"
        });

        res.status(200).json({
            message: "Logged in successfully",
            user: {
                id: victim._id,
                name: victim.contactPersonName,
                phone: victim.phoneNumber
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
};

// --- LOGOUT ---
export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error during logout" });
    }
};

// --- PROFILE ---
export const profile = async (req, res) => {
    try {
        // req.user.id is populated by your authentication middleware
        const victimId = req.user.id;

        const profile = await VictimAcc.findById(victimId).select("-password");

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: "Server error fetching profile" });
    }
};

// --- NEED HELP ---
export const needHelp = async (req, res) => {
    try {
        const validation = needHelpSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                errors: validation.error.issues.map(issue => ({ path: issue.path[0], message: issue.message }))
            });
        }

        const victimId = req.user.id;
        const {
            numberOfPeopleAffected,
            typeOfDisaster,
            helpsRequired,
            description,
            latitude,
            longitude
        } = validation.data; // Using validation.data guarantees we only get exactly what Zod approved

        // Calculate AI-powered urgency score using Gemini
        const aiUrgencyResult = await generateUrgencyScore(helpsRequired, description);
        // Extract the integer score returned by Gemini (or the fallback)
        const calculatedUrgencyScore = aiUrgencyResult.score;

        const helpRequest = new VictimHelp({
            victimId: victimId,
            latitude,
            longitude,
            numberOfPeopleAffected,
            typeOfDisaster,
            helpsRequired,
            description,
            urgencyScore: calculatedUrgencyScore
        });

        await helpRequest.save();

        res.status(201).json({
            message: "Help request created successfully",
            data: helpRequest
        });
    } catch (error) {
        console.error("Need Help Error:", error);
        res.status(500).json({ message: "Server error creating help request" });
    }
};

// --- DELETE ACCOUNT ---
export const deleteVictim = async (req, res) => {
    try {
        // req.user.id is populated by your authentication middleware
        const victimId = req.user.id; 

        // 1. Delete all help requests associated with this victim (preventing orphaned data)
        await VictimHelp.deleteMany({ victimId: victimId });

        // 2. Delete the victim account
        const deletedVictim = await VictimAcc.findByIdAndDelete(victimId);
        
        if (!deletedVictim) {
            return res.status(404).json({ message: "Account not found" });
        }

        // 3. Clear the authentication cookie since the account no longer exists
        res.clearCookie("token");

        res.status(200).json({ 
            message: "Account and all associated help requests have been deleted successfully" 
        });
    } catch (error) {
        console.error("Delete Account Error:", error);
        res.status(500).json({ message: "Server error during account deletion" });
    }
};
