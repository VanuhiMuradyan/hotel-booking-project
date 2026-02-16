import { z } from 'zod'

export const createRatingSchema = z.object({
    rate: z.number().int().min(1, "Rating must be between 1-5").max(5, "Rating must be between 1-5").optional(),
    comment: z.string().min(5, "Comment must be at least 5 characters").max(500, "Comment must not exceed 500 characters").optional()
}).refine(data => data.rate || data.comment, {
    message: "You must provide a rating or comment"
})

export const updateRatingSchema = z.object({
    rate: z.number().int().min(1).max(5).optional(),
    comment: z.string().min(5).max(500).optional()
})