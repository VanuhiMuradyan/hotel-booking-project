import { z } from 'zod'

export const validate = (schema) => {
    return async (req, res, next) => {
        try {
            req.body = await schema.parseAsync(req.body)
            next()
        } catch (error) {
            console.error('Validation error:', error)  // ✅ Debug


            if (error instanceof z.ZodError) {
                const errors = error.issues.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                })) || []
                
                return res.status(400).json({
                    message: "Validation error",
                    errors
                })
            }
            
            return res.status(500).json({ message: error.message || "Server error" })
        }
    }
}