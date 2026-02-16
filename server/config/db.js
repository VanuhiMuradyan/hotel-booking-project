import mongoose from "mongoose";
import {env} from './env.js'


export const connectDB = async () => {
    try {
        await mongoose.connect(env.mongoUrl)
        console.log("Mongo connected")
    } catch (error) {
        console.error("MongoDB connection failed:", error)
        process.exit(1)
    }
}


export const disconnectDB = async () => {
    try {
        await mongoose.disconnect()
        console.log("MongoDB disconnected")
    } catch (error) {
        console.error("MongoDB disconnection error:", error.message)
    }
}