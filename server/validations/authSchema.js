import { z } from 'zod'
import { emailSchema, nameSchema, passwordSchema, phoneSchema } from './commonSchema.js'

export const signupSchema = z.object({
    name: nameSchema,
    surname: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    phone: phoneSchema,
    country: z.string().min(2).optional(),
    dateOfBirth: z.string().optional()
})

export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, "Password is required")
})

export const updatePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema
}).refine(data => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"]
})

export const updateEmailSchema = z.object({
    newEmail: emailSchema
})

export const updateProfileSchema = z.object({
    name: nameSchema.optional(),
    surname: nameSchema.optional(),
    phone: phoneSchema,
    country: z.string().min(2).optional(),
    dateOfBirth: z.string().optional(),
    avatar: z.string().url().optional()
})