import express from "express"
import { isAuthenticated } from "../middlewares/isAuthenticated.js"
import { isAdmin } from "../middlewares/isAdmin.js"
import hotelController from "../controllers/hotel-controller.js"
import { upload } from "../services/upload.js"
import { validate } from "../middlewares/validate.js"
import { createHotelSchema } from "../validations/hotelSchema.js"

const hotelRouter = express.Router()

hotelRouter.use(isAuthenticated)
hotelRouter.get("/", hotelController.getAllHotels)
hotelRouter.get("/admin/my-hotels", isAdmin, hotelController.getAdminHotels) 
hotelRouter.get("/:id", hotelController.getHotel)



hotelRouter.use(isAdmin)
hotelRouter.post("/add", validate(createHotelSchema), hotelController.addHotel)
hotelRouter.patch("/update/:id", upload.array("hotelImage", 10), hotelController.updateHotel)
hotelRouter.delete("/delete/:id", hotelController.deleteHotel)
hotelRouter.post("/upload/images/:id", upload.array("hotelImage", 10), hotelController.uploadImages)

export default hotelRouter