import { model, Schema } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: [true, "Name is required"] },
  surname: { type: String, required: [true, "Surname is required"] },
  email: { type: String, required: [true, "Email is required"], unique: [true, "Email is busy"] },
  password: { type: String, required: [true, "Password is required"], minlength: [6, "Password is too short"] },
  dateOfBirth: { type: String },
  phone: { type: String },
  country: { type: String, required: false},
  role: { type: String, default: "user" },
  avatar: { type: String, default: "" }
  
})

export default model("User", userSchema);
