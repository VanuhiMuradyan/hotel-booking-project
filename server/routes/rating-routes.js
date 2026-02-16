import express from "express"
import { isAuthenticated } from "../middlewares/isAuthenticated.js"
import ratingController from "../controllers/rating-controller.js"
import { validate } from "../middlewares/validate.js"
import { createRatingSchema } from "../validations/ratingSchema.js"

const ratingRouter = express.Router()

ratingRouter.use(isAuthenticated)

ratingRouter.post("/:id", validate(createRatingSchema), ratingController.addRating)

export default ratingRouter