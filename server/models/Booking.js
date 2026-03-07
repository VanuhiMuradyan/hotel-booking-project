import { model, Schema } from "mongoose"

const bookingSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    hotelId: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    numberOfGuests: { type: Number, required: true, min: 1 },
    roomsCount: { type: Number, required: true, min: 1, default: 1 }, 
    totalPrice: { type: Number, required: true },
    status: {
        type: String,
            enum: ["booked", "cancelled", "completed"],
            default: "booked"
    }
}, { timestamps: true })

export default model("Booking", bookingSchema)