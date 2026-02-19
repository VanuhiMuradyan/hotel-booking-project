import { z } from 'zod'

export const createRatingSchema = z.object({
    rate: z.number().int().min(1, "Rating must be between 1-5").max(5, "Rating must be between 1-5").optional(),
    comment: z.string().min(5, "Comment must be at least 5 characters").max(500).optional()
}).refine(data => data.rate || data.comment, {
    message: "You must provide a rating or comment"
})

export const updateCommentSchema = z.object({
    commentId: z.string().min(1, "Comment ID is required"),
    content: z.string().min(5, "Comment must be at least 5 characters").max(500)
})

export const updateRatingSchema = z.object({
    rate: z.number().int().min(1).max(5).optional(),
    comment: z.string().min(5).max(500).optional()
})