import express from "express"
import authController from "../controllers/auth-controller.js"
import { isAuthenticated } from "../middlewares/isAuthenticated.js"
import { validate } from "../middlewares/validate.js"
import { loginSchema, signupSchema, updateEmailSchema, updatePasswordSchema, updateProfileSchema } from "../validations/authSchema.js"


const authRouter = express.Router()

authRouter.post("/signup", validate(signupSchema), authController.signup)
authRouter.post("/login", validate(loginSchema), authController.login)

authRouter.use(isAuthenticated)

authRouter.get("/profile", authController.getUser)
authRouter.patch("/update/password", validate(updatePasswordSchema), authController.updatePassword)
authRouter.patch("/update/email", validate(updateEmailSchema), authController.updateEmail)
authRouter.patch("/update/profile", validate(updateProfileSchema), authController.updateProfile)

export default authRouter