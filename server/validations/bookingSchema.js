import { z } from 'zod'
import { objectIdSchema, dateSchema } from "./commonSchema.js"

export const createBookingSchema = z.object({
    checkInDate: dateSchema,
    checkOutDate: dateSchema,
    numberOfGuests: z.number().int().min(1, "Number of guests must be at least 1").max(20),
    roomsCount: z.number()
        .int()
        .min(1, "Rooms count must be at least 1")
        .max(10, "Cannot book more than 10 rooms at once")
        .optional()
        .default(1),    
    specialRequests: z.string().max(500).optional()
}).refine(data => {
    const checkIn = new Date(data.checkInDate)
    const checkOut = new Date(data.checkOutDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return checkIn >= today
}, {
    message: "Check-in date cannot be in the past",
    path: ["checkInDate"]
}).refine(data => {
    const checkIn = new Date(data.checkInDate)
    const checkOut = new Date(data.checkOutDate)
    return checkOut > checkIn
}, {
    message: "Check-out date must be after check-in date",
    path: ["checkOutDate"]
})

export const updateBookingSchema = z.object({
    checkInDate: dateSchema.optional(),
    checkOutDate: dateSchema.optional(),
    numberOfGuests: z.preprocess(
        (val) => Number(val),  
        z.number().int().min(1).max(20)
    ),
    roomsCount: z.preprocess(
        (val) => val ? Number(val) : 1, 
        z.number().int().min(1).max(10)
    ),
    specialRequests: z.string().max(500).optional()
})

export const cancelBookingSchema = z.object({
    reason: z.string().min(10, "Reason must be at least 10 characters").optional()
})

export const bookingIdParamSchema = z.object({
    id: objectIdSchema
})