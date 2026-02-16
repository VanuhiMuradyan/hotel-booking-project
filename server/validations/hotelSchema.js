import { z } from 'zod'

export const createHotelSchema = z.object({
    name: z.string().min(3, "Hotel name must be at least 3 characters"),
    description: z.string().max(2000, "Description must not exceed 2000 characters").optional(),
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    country: z.string().min(2, "Country is required"),
    price: z.number().positive("Price must be a positive number"),
    availableRooms: z.number().int().min(0, "Available rooms cannot be negative"),
    facilities: z.array(z.string()).optional(),
    images: z.array(z.string().url()).optional()
})

export const updateHotelSchema = createHotelSchema.partial()

