import express from "express"
import { isAuthenticated } from "../middlewares/isAuthenticated.js" 
import bookingController from "../controllers/booking-controller.js" 
import { validate } from "../middlewares/validate.js"  
import { createBookingSchema, updateBookingStatusSchema } from "../validations/bookingSchema.js"
import { isAdmin } from "../middlewares/isAdmin.js"

const bookingRouter = express.Router() 

bookingRouter.use(isAuthenticated)

bookingRouter.post("/create/:id", validate(createBookingSchema), bookingController.createBooking.bind(bookingController))
bookingRouter.get("/my-bookings", bookingController.getUserBookings.bind(bookingController))
bookingRouter.get("/:id", bookingController.getBooking.bind(bookingController))
bookingRouter.patch("/cancel/:id", bookingController.cancelBooking.bind(bookingController))

bookingRouter.use(isAdmin)

bookingRouter.get("/admin/all", bookingController.getAllBookings.bind(bookingController))
bookingRouter.get("/admin/hotel/:hotelId", bookingController.getBookingsByHotel.bind(bookingController))
bookingRouter.delete("admin/delete/:id", bookingController.deleteBooking.bind(bookingController))
bookingRouter.get("/admin/my-bookings", bookingController.getAdminBookings.bind(bookingController))


export default bookingRouter