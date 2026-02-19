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
            res.status(500).send({ message: error.message })
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
            
            return res.status(200).send({ok: true, payload: bookings})
        } catch (error) {
            res.status(500).send({ message: error.message })
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

            res.status(200).send({ message: "Booking cancelled successfully" })

        } catch (err) {
            res.status(500).send({ message: err.message })
        }
    }

     async getAllBookings(req, res) {
        try {
            const { status, hotelId, startDate, endDate } = req.query

            let filter = {}

            if (status) {
                filter.status = status
            }

            if (hotelId) {
                filter.hotelId = hotelId
            }

            if (startDate || endDate) {
                filter.checkInDate = {}
                if (startDate) filter.checkInDate.$gte = new Date(startDate)
                if (endDate) filter.checkInDate.$lte = new Date(endDate)
            }

            const bookings = await Booking.find(filter)
                .populate('hotelId', 'name city country')
                .populate('userId', 'name surname email phone')
                .sort({ createdAt: -1 })

            res.status(200).send({ 
                ok: true,
                count: bookings.length,
                payload: bookings 
            })

        } catch (err) {
            res.status(500).send({ message: err.message })
        }
    }

    async updateBookingStatus(req, res) {
        try {
            const { id } = req.params
            const { status } = req.body

            const foundBooking = await Booking.findById(id)

            if (!foundBooking) {
                return res.status(404).json({ message: "Booking not found" })
            }

            const bookedRooms = foundBooking.roomsCount || 1

            if (foundBooking.status !== 'cancelled' && status === 'cancelled') {
                await Hotel.findByIdAndUpdate(foundBooking.hotelId, {
                    $inc: { availableRooms: bookedRooms }
                })
            }

            if (foundBooking.status === 'cancelled' && status !== 'cancelled') {
                const targetHotel = await Hotel.findById(foundBooking.hotelId)
                
                if (targetHotel.availableRooms < bookedRooms) {
                    return res.status(400).send({ 
                        message: `Not enough rooms available. Only ${targetHotel.availableRooms} rooms left.` 
                    })
                }
                
                await Hotel.findByIdAndUpdate(foundBooking.hotelId, {
                    $inc: { availableRooms: -bookedRooms }
                })
            }

            foundBooking.status = status
            await foundBooking.save()

            const updatedBooking = await Booking.findById(id)
                .populate('hotelId', 'name city country')
                .populate('userId', 'name surname email')

            res.status(200).send({
                message: "Booking status updated successfully",
                payload: updatedBooking
            })

        } catch (err) {
            res.status(500).send({ message: err.message })
        }
    }

    async deleteBooking(req, res) {
        try {
            const { id } = req.params

            const bookingToDelete = await Booking.findById(id)

            if (!bookingToDelete) {
                return res.status(404).json({ message: "Booking not found" })
            }

            const roomsToRestore = bookingToDelete.roomsCount || 1

            if (bookingToDelete.status !== 'cancelled') {
                await Hotel.findByIdAndUpdate(bookingToDelete.hotelId, {
                    $inc: { availableRooms: roomsToRestore }
                })
            }

            await Booking.findByIdAndDelete(id)

            res.status(200).send({ 
                message: "Booking deleted successfully" 
            })

        } catch (err) {
            res.status(500).send({ message: err.message })
        }
    }

    async getBookingsByHotel(req, res) {
        try {
            const { hotelId } = req.params

            const hotel = await Hotel.findOne({ 
                _id: hotelId, 
                owner: req.user._id 
            })

            if (!hotel) {
                return res.status(404).json({ 
                    message: "Hotel not found or access denied" 
                })
            }

            const bookings = await Booking.find({ hotelId })
                .populate('userId', 'name surname email phone')
                .sort({ checkInDate: 1 })

            res.status(200).send({ 
                ok: true,
                hotelName: hotel.name,
                count: bookings.length,
                payload: bookings 
            })

        } catch (err) {
            res.status(500).send({ message: err.message })
        }
    }

}

export default new BookingController()