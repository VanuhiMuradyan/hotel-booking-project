import Booking from "../models/Booking.js"
import Hotel from "../models/Hotel.js"

class BookingController {
    async createBooking(req, res) {
        try {
            const userId = req.user._id
            const hotelId = req.params.id
            
            const {checkInDate, checkOutDate, numberOfGuests, roomsCount = 1} = req.body

            
            const hotel = await Hotel.findById(hotelId)

            if (!hotel) {
                return res.status(404).send({message: "Hotel not found"})
            }

            const requestedRooms = roomsCount 

            if (hotel.availableRooms < requestedRooms) {
                return res.status(400).send({message: `Not enough rooms available. Only ${hotel.availableRooms} rooms left.`})
            }  

            const checkIn = new Date(checkInDate)
            const checkOut = new Date(checkOutDate)
            const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
            const calculatedTotalPrice = hotel.price * nights * requestedRooms

            const booking = await Booking.create({
                userId,
                hotelId,
                checkInDate,
                checkOutDate,
                numberOfGuests,
                roomsCount,
                totalPrice: calculatedTotalPrice,
                status: "pending"
            })
        
            hotel.availableRooms -= roomsCount
            await hotel.save()

            const bookedHotel = await Booking.findById(booking._id)
                                .populate("hotelId", "name city country price images address")
                                .populate("userId", "name surname email phone")

        
            return res.status(201).send({
                    message: "Booking create successfully",
                    payload: bookedHotel
            })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    } 

    async getUserBookings(req, res) {
        try {
            const userId = req.user._id

            const bookings = await Booking.find({userId})
                            .populate("hotelId", "name city country price images address")

            if (!bookings) {
                return res.status(400).send({message: "Not booking hotel"})
            }
            
            return res.status(201).send({ok: true, payload: bookings})
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

 async getBooking(req, res) {
        try {
            const bookingId = req.params.id
            const userId = req.user._id

            const booking = await Booking.findOne({ 
                _id: bookingId, 
                userId 
            })
                .populate('hotelId', 'name city country price images address facilities')
                .populate('userId', 'name surname email phone')

            if (!booking) {
                return res.status(404).send({ message: "Booking not found" })
            }

            res.status(200).send({ 
                ok: true, 
                payload: booking 
            })

        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    }

    async cancelBooking(req, res) {
        try {
            const bookingId = req.params.id
            const userId = req.user._id

            const booking = await Booking.findOne({ 
                _id: bookingId, 
                userId 
            })

            if (!booking) {
                return res.status(404).send({ message: "Booking not found" })
            }

            if (booking.status === 'cancelled') {
                return res.status(400).send({ message: "Booking already cancelled" })
            }

            if (booking.status === 'completed') {
                return res.status(400).send({ message: "Cannot cancel completed booking" })
            }

            booking.status = 'cancelled'
            await booking.save()

            await Hotel.findByIdAndUpdate(booking.hotelId, {
                $inc: { availableRooms: booking.roomsCount }
            })

            res.status(200).json({ message: "Booking cancelled successfully" })

        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    }

}

export default new BookingController()