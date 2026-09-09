import express from "express";
import { login,logout,signup,profile,Delete } from "../controllers/volunteerController.js";
import { verifyVolunteerAuth } from "../middlewares/authVolunteerMiddleware.js";

const volunteerRouter = express.Router()

volunteerRouter.post("/login",login)
volunteerRouter.post("/logout",logout)
volunteerRouter.post("/signup",signup)

volunteerRouter.get("/profile",verifyVolunteerAuth,profile)
volunteerRouter.delete("/delete",verifyVolunteerAuth,Delete)

export default volunteerRouter