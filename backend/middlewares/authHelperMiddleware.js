import jwt from "jsonwebtoken";
import HelperAcc from "../models/HelperAccountSchema.js"; 

export const verifyHelperAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const helper = await HelperAcc.findById(decoded.id).select("-password");
        if (!helper) {
            return res.status(404).json({ message: "Helper account not found" });
        }

        req.existingHelper = helper;

        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
};