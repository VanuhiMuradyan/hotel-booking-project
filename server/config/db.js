import mongoose from "mongoose";
import {env} from './env.js'


export const connectDB = async () => {
    return mongoose.connect(env.MONGO_URL)
}

export const disconnectDB = async () => {
    return mongoose.disconnect().then(() => console.log("disconnected!"))
}
