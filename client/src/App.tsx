import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import Navbar from "./components/ui/Navbar"
import Home from "./pages/Home"
import HotelDetails from "./pages/hotels/HotelDetails"

import AdminPanel from "./pages/admin/AdminPanel"
import Bookings from "./pages/hotels/Booking"
import AdminSignup from "./pages/admin/AdminSignup"
import Hotels from "./pages/hotels/Hotels"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import Profile from "./pages/user/Profile"
import PublicProfile from "./pages/user/PublicProfile"

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth()
    if (loading) return <div className="flex justify-center mt-20 text-gray-400">Loading...</div>
    if (!user) return <Navigate to="/login" />
    return <>{children}</>
}

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading, isAdmin } = useAuth()
    if (loading) return <div className="flex justify-center mt-20 text-gray-400">Loading...</div>
    if (!user || !isAdmin) return <Navigate to="/" />
    return <>{children}</>
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/hotels" element={<Hotels />} />
                    <Route path="/hotels/:id" element={<HotelDetails />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin/signup" element={<AdminSignup />} />
                    <Route path="/bookings" element={
                        <ProtectedRoute><Bookings /></ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute><Profile /></ProtectedRoute>
                    } />
                    <Route path="/admin" element={
                        <AdminRoute><AdminPanel /></AdminRoute>
                    } />
                    <Route path="/profile/:id" element={<PublicProfile />} />
                    <Route path="/admin/update/:id" element={<HotelDetails />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}