import express from 'express'
import hotelRoutes from './routes/hotel-routes.js'
import authRoutes from './routes/auth-routes.js'
import bookingRoutes from './routes/booking-routes.js'
import ratingRouter from './routes/rating-routes.js'
import { env } from './config/env.js'
import { connectDB, disconnectDB } from './config/db.js'
import cors from "cors"
import swaggerUi from "swagger-ui-express"
import { swaggerSpec } from "./config/swagger.js"

const app = express()

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded())
app.use(express.static("public/uploads"))


app.use("/api/auth", authRoutes)
app.use("/api/hotels", hotelRoutes)
app.use("/api/booking", bookingRoutes)
app.use("/api/rating", ratingRouter)

app.use((req, res) => {
  res.status(404).json({ 
    message: "Route not found",
    path: req.path 
  })
})


const startServer = async () => {
  try {
    await connectDB()
    
    app.listen(env.port, () => {
      console.log(`Server running: http://localhost:${env.port}/api`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()

const shutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`)
  
  try {
    await disconnectDB()
    console.log('Database disconnected')
    process.exit(0)
  } catch (error) {
    console.error('Error during shutdown:', error)
    process.exit(1)
  }
}

process.on("SIGINT", () => shutdown("SIGINT"))   
process.on("SIGTERM", () => shutdown("SIGTERM")) 