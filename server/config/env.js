import dotenv from 'dotenv'
dotenv.config()

export const env = {
    PORT: process.env.APP_PORT,
    SECRET: process.env.JWT_SECRET,
    ...process.env
}