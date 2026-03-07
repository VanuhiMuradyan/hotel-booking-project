import cron from "node-cron"
import Booking from "../models/Booking.js"
import Hotel from "../models/Hotel.js"

export const startCronJobs = () => {
    cron.schedule("0 0 * * *", async () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const expiredBookings = await Booking.find({
            status: { $nin: ["cancelled", "completed"] },
            checkOutDate: { $lt: today }
        })

        for (const booking of expiredBookings) {
            await Hotel.findByIdAndUpdate(booking.hotelId, {
                $inc: { availableRooms: booking.roomsCount }
            })
            booking.status = "completed"
            await booking.save()
        }

        if (expiredBookings.length > 0) {
            console.log(`✅ ${expiredBookings.length} bookings completed`)
        }
    })
}