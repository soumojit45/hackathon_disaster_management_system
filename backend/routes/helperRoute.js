import express from "express";
import { login,logout,signup,profile,Delete,addHelp } from "../controllers/helperController.js";
import { verifyHelperAuth } from "../middlewares/authHelperMiddleware.js";

const helperRouter = express.Router()

helperRouter.post("/login",login)
helperRouter.post("/logout",logout)
helperRouter.post("/signup",signup)

// helperRouter.post("/addHelp",addHelp)
helperRouter.post("/addHelp",verifyHelperAuth,addHelp)
helperRouter.get("/getvictim",verifyHelperAuth)
helperRouter.get("/profile",verifyHelperAuth,profile)
helperRouter.delete("/delete",verifyHelperAuth,Delete)

export default helperRouter