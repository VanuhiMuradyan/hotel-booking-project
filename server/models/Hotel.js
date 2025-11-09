import { model, Schema, SchemaType } from "mongoose";

const hotelSchema = new Schema({
    owner: {type: Schema.Types.ObjectId, ref: "User", required: true},
    name: {type: String, required: [true, "Hotel name is required"]},
    description: {type: String, default: ''},
    address: {type: String, required: [true, "Address is required"]},
    city: {type: String, required: [true, "City is required"]},
    country: {type: String, required: [true, "Country is required"]},
    raiting: {type: Number, default: 0},
    price: {type: Number, required: [true, "Prices required"]},
    images: {type: [String], required: []},
    availableRooms: {type: Number, required: [true, "Available rooms count is required"]},
    facilities: {type: [String], default: []}
})

export default model("Hotel", hotelSchema)