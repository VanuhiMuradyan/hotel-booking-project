import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { env } from "../config/env.js"

class AuthController {

    async signup(req, res) {
        try {
            const { name, surname, email, password, dateOfBirth, phone, country, avatar, role } = req.body

            const existingUser = await User.findOne({ email })
            if (existingUser) {
                return res.status(409).send({ message: "Email already registered" })
            }

            const hashedPassword = await bcrypt.hash(password, 12)

            const user = await User.create({
                name,
                surname,
                email,
                password: hashedPassword,
                dateOfBirth,
                phone,
                country,
                avatar,
                role
            })

            const safeUser = {
                _id: user._id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                country: user.country,
                role: user.role,
                avatar: user.avatar
            }

            res.status(201).send({
                message: "User created successfully",
                payload: safeUser
            })

        } catch (err) {
            return res.status(500).send({ message: err.message })
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body

            const user = await User.findOne({ email }).select('+password')
            if (!user) {
                return res.status(401).send({ message: "Invalid email or password" })
            }

            const isPasswordValid = await bcrypt.compare(password, user.password)
            if (!isPasswordValid) {
                return res.status(401).send({ message: "Invalid email or password" })
            }

            const token = jwt.sign(
                { id: user._id, email: user.email },
                env.jwtSecret,
                { expiresIn: '7d' }
            )

            res.status(200).json({
                message: "User login successfully",
                payload: token
            })

        } catch (err) {
            return res.status(500).send({ message: err.message })
        }
    }

    async getUser(req, res) {
        try {
            const id = req.user._id
            const user = await User.findById(id).select("-password -__v")
            
            if (!user) {
                return res.status(404).send({ message: "User profile not found" })
            }
            
            res.status(200).send({ ok: true, payload: user })
        } catch (err) {
            return res.status(500).send({ message: err.message })
        }
    }

    async updateEmail(req, res) {
        try {
            const { newEmail } = req.body
            const userId = req.user._id

            const existingUser = await User.findOne({ email: newEmail })
            if (existingUser && existingUser._id.toString() !== userId.toString()) {
                return res.status(409).send({ message: "Email already in use" })
            }

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { email: newEmail },
                { new: true }
            ).select('-password -__v')

            res.status(200).send({
                message: "Email updated successfully",
                payload: updatedUser
            })

        } catch (err) {
            res.status(500).send({ message: err.message })
        }
    }

    async updatePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body
            const userId = req.user._id

            const user = await User.findById(userId).select('+password')

            const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
            if (!isPasswordValid) {
                return res.status(401).send({ message: "Current password is incorrect" })
            }

            const hashedPassword = await bcrypt.hash(newPassword, 12)

            await User.updateOne({ _id: userId }, { password: hashedPassword })

            res.status(200).send({ message: "Password updated successfully" })

        } catch (err) {
            return res.status(500).send({ message: err.message })
        }
    }

    async updateProfile(req, res) {
        try {
            const { name, surname, dateOfBirth, phone, country, avatar } = req.body
            const userId = req.user._id

            const updateData = {}

            if (name) updateData.name = name
            if (surname) updateData.surname = surname
            if (dateOfBirth) updateData.dateOfBirth = dateOfBirth
            if (phone) updateData.phone = phone
            if (country) updateData.country = country
            if (avatar) updateData.avatar = avatar

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                updateData,
                { new: true }
            ).select("-password -__v")

            res.status(200).send({
                message: "Profile updated successfully",
                payload: updatedUser
            })
        } catch (err) {
            return res.status(500).send({ message: err.message })
        }
    }
}

export default new AuthController()