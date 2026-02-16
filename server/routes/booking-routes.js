import express from "express"
import { isAuthenticated } from "../middlewares/isAuthenticated.js" 
import bookingController from "../controllers/booking-controller.js" 
import { validate } from "../middlewares/validate.js"  
import { createBookingSchema } from "../validations/bookingSchema.js"

const bookingRouter = express.Router() 

bookingRouter.use(isAuthenticated)

bookingRouter.post("/create/:id", validate(createBookingSchema), bookingController.createBooking.bind(bookingController))
bookingRouter.get("/my-bookings", bookingController.getUserBookings.bind(bookingController))
bookingRouter.get("/:id", bookingController.getBooking.bind(bookingController))
bookingRouter.patch("/cancel/:id", bookingController.cancelBooking.bind(bookingController))


export default bookingRouter