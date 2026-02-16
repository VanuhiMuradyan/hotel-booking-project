import jwt from "jsonwebtoken"
import { env } from "../config/env.js"
import User from "../models/User.js"

export const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).send({message: "Please provide a token"})
        }

        const token = authHeader.split(" ")[1]

        const verifiedToken = jwt.verify(token, env.jwtSecret)
        const user = await User.findById(verifiedToken.id).select("-password -__v")

        if(!user) {
            return res.status(401).send({message: "Invalid token"})
        }
        
        req.user = user
        next()
    } catch (err){
        return res.status(500).send({message: err.message})
    }
}