import User from "../models/User.js"
import bcrypt from 'bcrypt'

export class AuthValidation {
    static passwordValidate(password) {
        return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)
    } 

    static emailValidation(email) {
        return /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email)
    }

    static async checkEmail(email) {
        return await User.findOne({email})
    }

    static async checkPassword(inputedPassword, userPassword) {
        return await bcrypt.compare(inputedPassword, userPassword)
    }
}