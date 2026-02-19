import Hotel from "../models/Hotel.js"

class HotelController {

    async addHotel(req, res) {
        try {
            const hotel = req.body
            const newHotel = await Hotel.create(hotel)
            res.status(201).send({message: "Hotel created successfully", payload: newHotel})

        } catch (err) {
            return res.status(500).send({message: err.message})
        }
    }

    async getAllHotels(req, res) {
        try {
            const hotels = await Hotel.find().populate("owner", "name surname email")
            res.status(200).send({ok: true, payload: hotels})

        } catch (err) {
            return res.status(500).send({message: err.message})
        }
    }

    async getHotel(req, res) {
        try {            
            const {id} = req.params

            const hotel = await Hotel.findById(id).populate("owner", "name surname email")
            if (!hotel) {
                return res.status(401).send("Hotel not found")
            }
            res.status(200).send({ok: true, payload: hotel})

        } catch (err) {
            return res.status(500).send({message: err.message})
        }
    }

    async getAdminHotels(req, res) {
        try {
            const adminId = req.user._id

            const hotels = await Hotel.find({owner: adminId})

            res.status(200).send({ok: true, payload: hotels})
        } catch (err) {
            return res.status(500).send({message: err.message})
        }
    }

    async updateHotel(req, res) {
        try {
            const hotelId = req.params.id
            const adminId = req.user._id
            const updateData = req.body
            const files = req.files
                    
            const hotel = await Hotel.findOne({_id: hotelId, owner: adminId})
            
            if (!hotel) {
                return res.status(401).send({message: "Hotel not found or access denied"})
            }

            if (files && files.length > 0) {
                const images = files.map(file => file.filename)                   
                updateData.images = [...(hotel.images || []), ...images]
            }

            const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, updateData, {new: true}).populate("owner", "name surname email")

            res.status(200).send({message: "Hotel updated successfully", payload: updatedHotel})

        } catch (err) {
            return res.status(500).send({message: err.message})
        }

    }

    async deleteHotel(req, res) {
        try{
            const hotelId = req.params.id
            const adminId = req.user._id

            const {deletedCount} = await Hotel.deleteOne({_id: hotelId, owner: adminId})
            
            if(!deletedCount) {
                return res.status(401).send({message: "Hotel not found or access denied"})
            }
            

            res.status(200).send({message: "Hotel deleted successfully"})

        } catch (err) {
            return res.status(500).send({message: err.message})
        }
    }

    async uploadImages(req, res) {
        try {
            const adminId = req.user._id
            const hotelId = req.params.id
            const files = req.files
            
            if (!files || files.length === 0) {
                return res.status(400).json({ message: "No images uploaded" })
            }

            const hotel = await Hotel.findOne({_id: hotelId, owner: adminId})
            if (!hotel) {
                return res.status(401).send({message: "Hotel not found or access denied"})
            }

            const imageUrls = files.map(file => `/uploads/hotels/${file.filename}`)
            

            hotel.images.push(...imageUrls)
            await hotel.save()
            
            return res.status(200).send({message: "Images uploded successfully", payload: hotel.images})

        } catch (err) {
            return res.status(500).send({message: err.message})
        }
    }
}

export default new HotelController()