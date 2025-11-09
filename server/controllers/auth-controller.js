import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { AuthValidation } from "../validations/auth-validation.js"
import { env } from "../config/env.js"

class AuthController {

    async signup(req, res) {
        const {name, surname, email, password, dateOfBirth, phone, country, avatar, role} = req.body
        try {
            if(!name?.trim() || !surname?.trim() || !email?.trim() || !password?.trim()) {
                return res.status(400).send({message: "All fields are required"})
            }

            if(!AuthValidation.passwordValidate(password)) {
                return res.status(400).send({message: "Password must be at least 8 characters, include 1 uppercase letter and 1 number"})
            }

            if(!AuthValidation.emailValidation(email)) {
                return res.status(400).send({message: "Invalid email format. Email must be valid and can include letters, numbers, dots, underscores, and a valid domain (example@domain.com)"})
            }

            const existedEmail = await AuthValidation.checkEmail(email)
            
            if(existedEmail) {
                return res.status(409).send({message: "Email is busy"})
            }

            const hashedPassword = await bcrypt.hash(password, 10)
            const user = await User.create({name, surname, email, password: hashedPassword, dateOfBirth, phone, country, avatar, role})

            const safeUser = {
                _id: user._id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                country: user.country,
                role: user.role,
                avatar: user.avatar,
            }
            
            res.status(201).send({message: "User created successfully", payload: safeUser})
        } catch(err) {
            return res.status(500).send({message: err.message})
        }
    }

    async login(req, res) {
        const {email, password} = req.body
        try {
            if (!email?.trim() || !password?.trim()) {
                return res.status(400).send({message: "All fields are required"})
            }
            
            const user = await AuthValidation.checkEmail(email)
            if(!user) {
                return res.status(404).send("User not found")
            }

            const checkPassword = await AuthValidation.checkPassword(password, user.password)
            if(!checkPassword) {
                return res.status(401).send({message: "Password is incorrect"})
            }

            const token = jwt.sign({id: user._id}, env.SECRET, {expiresIn: "7d"})

            res.status(200).send({message: "User login successfully", payload: token})

        } catch (err) {
            return res.status(500).send({message: err.message})
        }
    }

    async getUser(req, res) {
        const id = req.user._id
        try {
           const user = await User.findById(id).select("-password -__v")
           if (!user) {
               return res.status(400).send({message: "User profile not found"})
            }
            res.status(200).send({message: true, payload: user})
        } catch (err) {
            return res.status(500).send({message: err.message})
        } 
    }

    async updateEmail(req, res) {
        const {newEmail, password} = req.body
        const userId = req.user._id
        
        try {
            if (!newEmail.trim() || !password.trim()) {
                return res.status(400).send({message: "All fields are required"})
            }

            if(!AuthValidation.emailValidation(newEmail)) {
                return res.status(400).send({message: "Invalid email format. Email must be valid and can include letters, numbers, dots, underscores, and a valid domain (example@domain.com)"})
            }

            const user = await User.findById(userId)            

            const checkPassword = await AuthValidation.checkPassword(password, user.password)
            if (!checkPassword) {
                return res.status(401).send({message: "Password is incorrect"})
            }

            const existedEmail = await AuthValidation.checkEmail(newEmail)
            if (existedEmail) {
                return res.status(409).send({message: "Email is already used"})
            }

            const updatedUser = await User.findByIdAndUpdate(userId, {email: newEmail}, {new: true}).select("-password -__v")

            res.status(200).send({message: "Email updated successfully", payload: updatedUser})

        } catch (err) {
            res.status(500).send({message: err.message})
        }
    }

    async updatePassword(req, res) {
        const {oldPassword, newPassword} = req.body
        const userId = req.user._id
        
        try {
            if (!oldPassword.trim() || !newPassword.trim()) {
                return res.status(400).send({message: "All fields are required"})
            }

            const user = await User.findById(userId)

            const checkPassword = await AuthValidation.checkPassword(oldPassword, user.password)
            if (!checkPassword) {
                return res.status(401).send({message: "Password is incorrect"})
            }


            if(!AuthValidation.passwordValidate(newPassword)) {
                return res.status(400).send({message: "Password must be at least 8 characters, include 1 uppercase letter and 1 number"})
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10)

            await User.updateOne({_id: userId}, {password: hashedPassword})

            res.status(200).send({message: "Password updated successfully"})

        } catch (err) {
            return res.status(500).send({message: err.message})
        }
    }

    async updateProfile(req, res) {
        const {name, surname, dateOfBirth, phone, country} = req.body
        const userId = req.user._id

        try{
            const updatedData = {}

            if (name) updatedData.name = name
            if (surname) updatedData.surname = surname
            if (dateOfBirth) updatedData.dateOfBirth = dateOfBirth
            if (phone) updatedData.phone = phone
            if (country) updatedData.country = country

            const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {new: true}).select("-password, -__v")

            res.status(200).send({message: "Profile updated successfully", payload: updatedUser})
        } catch (err) {
            return res.status(500).send({message: err.message})
        }
    }
}

export default new AuthController()