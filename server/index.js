import express from 'express'
import hotelRoutes from './routes/hotel-routes.js'
import authRoutes from './routes/auth-routes.js'
import bookingRoutes from './routes/booking-routes.js'
import { env } from './config/env.js'
import { connectDB, disconnectDB } from './config/db.js'
import { disconnect } from 'mongoose'

const app = express()

app.use(express.json())
app.use(express.urlencoded())
app.use(express.static("public/uploads"))


app.use("/api/auth", authRoutes)
app.use("/api/hotels", hotelRoutes)
app.use("/api/booking", bookingRoutes)


app.listen(env.PORT, async () => {
    console.log(`http://localhost:${env.PORT}/api`)
    await connectDB()
    console.log("Mongo connected");
})


process.on("SIGINT", () => disconnectDB())
process.on("SITERM", () => disconnectDB())