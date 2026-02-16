import dotenv from "dotenv"
dotenv.config()

const PORT = process.env.APP_PORT
const JWT_SECRET = process.env.JWT_SECRET
const MONGO_URL = process.env.MONGO_URL

if (!PORT) {
  console.error("PORT is required")  
  process.exit(1)
}

if (!JWT_SECRET) {
  
  console.error("JWT_SECRET is required")
  process.exit(1)
}

if (!MONGO_URL) {
    console.error("MONGO_URL is required")
    process.exit(1)
}

export const env = {
    port: Number(PORT),
    jwtSecret: JWT_SECRET, 
    mongoUrl: MONGO_URL
}