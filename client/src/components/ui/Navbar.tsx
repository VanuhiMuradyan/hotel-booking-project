import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()

  return (
    <nav className="bg-white border-b border-gray-200 px-8 py-4" style={{ fontFamily: "'Georgia', serif" }}>
      <div className="max-w-6xl mx-auto flex justify-between items-center">

        <Link to="/" className="text-xl font-bold tracking-widest uppercase text-gray-900">
          hotel<span className="text-gray-400">book</span>
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              {!isAdmin && (
                <Link to="/bookings" className="text-s text-gray-500 uppercase tracking-widest hover:text-gray-700 transition">
                  Bookings
                </Link>
              )}
              <Link to="/profile" className="text-s text-gray-500 uppercase tracking-widest hover:text-gray-700 transition">
                Profile
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-s text-gray-500 uppercase tracking-widest hover:text-gray-700 transition">
                  Admin
                </Link>
              )}
              <button
                onClick={logout}
                className="bg-gray-900 text-white px-5 py-2 rounded-lg text-s tracking-widest uppercase font-semibold hover:bg-gray-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-s text-gray-500 uppercase tracking-widest hover:text-gray-700 transition">
                Login
              </Link>
              <Link to="/register"
                className="bg-gray-900 text-white px-5 py-2 rounded-lg text-s tracking-widest uppercase font-semibold hover:bg-gray-700 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}