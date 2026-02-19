export {
    signupSchema,
    adminSignupSchema,
    loginSchema,
    updatePasswordSchema,
    updateEmailSchema,
    updateProfileSchema
} from './authSchema.js'

export {
    createHotelSchema,
    updateHotelSchema,
} from './hotelSchema.js'

export {
    createBookingSchema,
    updateBookingSchema,
    cancelBookingSchema,
    bookingIdParamSchema,
    updateBookingStatusSchema
} from './bookingSchema.js'

export {
    createRatingSchema,
    updateRatingSchema
} from './ratingSchema.js'

export {
    emailSchema,
    passwordSchema,
    phoneSchema,
    objectIdSchema,
    nameSchema,
    dateSchema
} from './commonSchema.js'