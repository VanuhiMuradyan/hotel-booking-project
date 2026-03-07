import { useState, useEffect } from "react"
import api from "../../services/api"
import { type Booking } from "../../types"
import { Link } from "react-router-dom"

const statusColors: Record<string, string> = {
  booked: "bg-green-50 text-green-700 border border-green-200",
  cancelled: "bg-red-50 text-red-700 border border-red-200",
  completed: "bg-gray-100 text-gray-600 border border-gray-200"
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/booking/my-bookings")
      .then(res => setBookings(res.data.payload))
      .finally(() => setLoading(false))
  }, [])

  const handleCancel = async (id: string) => {
    try {
      await api.patch(`/booking/cancel/${id}`)
      setBookings(bookings.map(b => b._id === id ? { ...b, status: "cancelled" } : b))
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to cancel")
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-xs text-gray-400 uppercase tracking-widest">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10" style={{ fontFamily: "'Georgia', serif" }}>
      <div className="max-w-3xl mx-auto">

        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-widest uppercase text-gray-900">
            hotel<span className="text-gray-400">book</span>
          </h1>
          <p className="text-xs text-gray-400 tracking-widest uppercase mt-1">My Bookings</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center">
            <div className="text-4xl mb-4">🏨</div>
            <p className="text-xs text-gray-400 uppercase tracking-widest">No bookings yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => (
              <Link key={booking._id} to={`/hotels/${booking.hotelId?._id}`} className="block bg-white border border-gray-200 rounded-2xl p-6 flex justify-between items-center hover:border-gray-300 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-semibold text-gray-900 text-base mb-1">{booking.hotelId?.name}</h2>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">
                      {booking.hotelId?.city}, {booking.hotelId?.country}
                    </p>
                    <p className="text-sm text-gray-500 mb-1">
                      {new Date(booking.checkInDate).toLocaleDateString()} → {new Date(booking.checkOutDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      {booking.numberOfGuests} guests · {booking.roomsCount} rooms
                    </p>
                    <p className="text-base font-bold text-gray-900">{booking.totalPrice?.toLocaleString()} AMD</p>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase border ${statusColors[booking.status]}`}>
                      {booking.status}
                    </span>
                    {booking.status === "booked" && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="text-xs tracking-widest uppercase text-red-400 border border-red-100 px-4 py-2 rounded-lg hover:bg-red-50 transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}