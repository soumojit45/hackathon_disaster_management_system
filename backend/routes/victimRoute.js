import express from "express";
import { login,logout,profile,deleteVictim,signup,needHelp } from "../controllers/victimController.js";
import { verifyVictimAuth } from "../middlewares/authVictimMiddleware.js";
import { processIncomingSMS } from "../controllers/smsController.js";

const victimRouter = express.Router()

victimRouter.post("/login",login)
victimRouter.post("/logout",logout)
victimRouter.post("/signup",signup)
victimRouter.post("/sms",processIncomingSMS) // only accessible for the victims requesting by sms 

victimRouter.post("/needhelp",verifyVictimAuth,needHelp)
victimRouter.get("/profile",verifyVictimAuth,profile)
victimRouter.delete("/delete",verifyVictimAuth,deleteVictim)

export default victimRouter