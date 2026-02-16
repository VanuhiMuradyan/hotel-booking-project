import { z } from 'zod'

export const emailSchema = z
    .string()
    .email("Invalid email address")
    .toLowerCase()
    .trim()

export const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase letter and number")

export const phoneSchema = z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .optional()

export const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format")

export const nameSchema = z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .trim()

export const dateSchema = z
    .string()
    .refine(date => !isNaN(Date.parse(date)), {
        message: "Invalid date"
    })