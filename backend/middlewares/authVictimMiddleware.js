import jwt from "jsonwebtoken";

export const verifyVictimAuth = (req, res, next) => {
    try {
        // Safety check: Ensure the secret key exists in your environment variables
        if (!process.env.SECRET_KEY) {
            console.error("CRITICAL ERROR: SECRET_KEY is not defined in .env file.");
            return res.status(500).json({ error: "Internal server configuration error" });
        }

        // 1. Get the token from cookies
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        // 2. Verify the token 
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // 3. Attach the decoded payload to req.user
        req.user = decoded; 

        // 4. Pass control to the next middleware or controller
        next();
    } catch (error) {
        console.error("Victim Auth Middleware Error:", error.message);
        
        // Differentiate between token expiration and a completely invalid token
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Unauthorized: Token has expired. Please log in again." });
        }
        
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
};