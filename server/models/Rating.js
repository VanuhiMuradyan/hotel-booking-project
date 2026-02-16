import { model, Schema } from "mongoose";

const RatingSchema = new Schema ({
    hotelId: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rate: { type: Number, required: true, min: 1, max: 5 },
    comments: [{
            content: {type: String, default: ''},
            createdAt: { type: Date, default: Date.now }
        }]
})


// Each user can rate a hotel only once
// RatingSchema.index({ hotelId: 1, userId: 1 }, { unique: true })

export default model("Rating", RatingSchema)