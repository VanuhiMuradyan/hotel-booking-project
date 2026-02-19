import Rating from "../models/Rating.js"

class RatingController {

    async addRating(req, res) {
        try {
            const hotelId = req.params.id
            const userId = req.user._id
            const { rate, comment } = req.body

            let rating = await Rating.findOne({ 
                hotelId: hotelId, 
                userId: userId 
            })

            if (!rating) {
                rating = await Rating.create({
                    hotelId: hotelId,
                    userId: userId,
                    rate,
                    comments: comment ? [{ content: comment }] : []
                })
            } else {
                if (rate) {
                    rating.rate = rate
                }

                if (comment) {
                    rating.comments.push({ content: comment })
                }

                await rating.save()
            }

            const populatedRating = await Rating.findById(rating._id)
                .populate('userId', 'name surname')
                .populate('hotelId', 'name')

            res.status(201).send({ 
                ok: true, 
                payload: populatedRating 
            })
        } catch (err) {
            return res.status(500).send({ message: err.message })
        }
    }

    async updateComment(req, res) {
        try {
            const { id } = req.params        
            const { commentId } = req.body   
            const { content } = req.body
            const userId = req.user._id

            const rating = await Rating.findOne({ _id: id, userId })
            if (!rating) {
                return res.status(404).json({ message: "Rating not found or access denied" })
            }

            const comment = rating.comments.id(commentId)
            if (!comment) {
                return res.status(404).json({ message: "Comment not found" })
            }

            comment.content = content
            await rating.save()

            res.status(200).json({ 
                message: "Comment updated successfully",
                payload: rating 
            })

        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    async getRatingsByHotel(req, res) {
        try {
            const hotelId = req.params.id

            const ratings = await Rating.find({ hotelId })
                .populate('userId', 'name surname avatar')
                .sort({ createdAt: -1 })

            res.status(200).send({ 
                ok: true, 
                payload: ratings 
            })
        } catch (err) {
            return res.status(500).send({ message: err.message })
        }
    }

    async deleteRating(req, res) {
        try {
            const ratingId = req.params.id
            const userId = req.user._id

            const { deletedCount } = await Rating.deleteOne({ 
                _id: ratingId, 
                userId: userId 
            })

            if (!deletedCount) {
                return res.status(404).send({ 
                    message: "Rating not found or access denied" 
                })
            }

            res.status(200).send({ message: "Rating deleted successfully" })

        } catch (err) {
            return res.status(500).send({ message: err.message })
        }
    }
}

export default new RatingController()