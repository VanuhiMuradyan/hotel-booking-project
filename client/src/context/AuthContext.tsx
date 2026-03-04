import { createContext, useContext, useState, useEffect } from "react"
import api from "../services/api"
import { type User } from "../types"

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    signup: (data: object) => Promise<void>
    logout: () => void
    isAdmin: boolean
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            api.get("/auth/profile")
                .then(res => setUser(res.data.payload))
                .catch(() => localStorage.removeItem("token"))
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [])

    const login = async (email: string, password: string) => {
        const res = await api.post("/auth/login", { email, password })
        localStorage.setItem("token", res.data.payload)
        const profile = await api.get("/auth/profile")
        setUser(profile.data.payload)
    }

    const signup = async (data: object) => {
        await api.post("/auth/signup", data)
    }

    const logout = () => {
        localStorage.removeItem("token")
        setUser(null)
        window.location.href = "/login"
    }

    const isAdmin = user?.role === "admin"

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)