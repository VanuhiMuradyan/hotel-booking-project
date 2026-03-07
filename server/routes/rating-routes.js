import express from "express"
import { isAuthenticated } from "../middlewares/isAuthenticated.js"
import ratingController from "../controllers/rating-controller.js"
import { validate } from "../middlewares/validate.js"
import { createRatingSchema, updateCommentSchema, updateRatingSchema } from "../validations/ratingSchema.js"

const ratingRouter = express.Router()

ratingRouter.use(isAuthenticated)

ratingRouter.post("/:id", validate(createRatingSchema), ratingController.addRating)
ratingRouter.get("/:id", ratingController.getRatingsByHotel)
ratingRouter.delete("/:id", ratingController.deleteRating)
ratingRouter.patch("/:id", validate(updateRatingSchema), ratingController.editRating)

export default ratingRouter