import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import hotelController from "../controllers/hotel-controller.js";
import { upload } from "../services/upload.js";


const hotelRouter = express.Router()


hotelRouter.use(isAuthenticated)
hotelRouter.get("/", hotelController.getAllHotels)
hotelRouter.get("/:id", hotelController.getHotel)


hotelRouter.use(isAdmin)
hotelRouter.post("/add", hotelController.addHotel)
hotelRouter.get("/admin", hotelController.getAdminHotels)
hotelRouter.patch("/update/:id", hotelController.updateHotel)
hotelRouter.delete("/delete/:id", hotelController.deleteHotel)
hotelRouter.post("/upload/images/:id", upload.array("hotelImage"), hotelController.uploadImages)


export default hotelRouter
