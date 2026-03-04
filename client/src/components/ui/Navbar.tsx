import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

export default function Navbar() {
    const { user, logout, isAdmin } = useAuth()

    return (
        <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">HotelBook</Link>
            <div className="flex items-center gap-6">
                {user ? (
                    <>
                        {!isAdmin && (
                            <Link to="/bookings" className="text-gray-600 hover:text-gray-900">Bookings</Link>
                        )}
                        <Link to="/profile" className="text-gray-600 hover:text-gray-900">Profile</Link>
                        {isAdmin && (
                            <Link to="/admin" className="text-gray-600 hover:text-gray-900">Admin</Link>
                        )}
                        <button onClick={logout}
                            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
                        <Link to="/register"
                            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}