import { model, Schema } from "mongoose";

const RatingSchema = new Schema ({
    hotelId: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rate: { type: Number, min: 1, max: 5 },
    comment: { type: String, default: '' }
},{ timestamps: true })

export default model("Rating", RatingSchema)