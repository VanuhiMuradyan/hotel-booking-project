import express from "express";
import authController from "../controllers/auth-controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";


const authRouter = express.Router()

authRouter.post("/signup", authController.signup)
authRouter.post("/login", authController.login)


authRouter.use(isAuthenticated)

authRouter.get("/profile", authController.getUser)
authRouter.patch("/update/password", authController.updatePassword)
authRouter.patch("/update/email", authController.updateEmail)
authRouter.patch("/update/profile", authController.updateProfile)

export default authRouter
