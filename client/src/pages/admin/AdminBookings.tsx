import { useState, useEffect } from "react"
import api from "../../services/api"
import { type Booking } from "../../types"

const statusColors: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  confirmed: "bg-green-50 text-green-700 border border-green-200",
  cancelled: "bg-red-50 text-red-700 border border-red-200",
  completed: "bg-gray-100 text-gray-600 border border-gray-200"
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/booking/admin/my-bookings")
      .then(res => setBookings(res.data.payload))
      .finally(() => setLoading(false))
  }, [])

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.patch(`/booking/admin/status/${id}`, { status })
      setBookings(bookings.map(b => b._id === id ? { ...b, status: status as Booking["status"] } : b))
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update")
    }
  }

  if (loading) return (
    <div className="text-gray-400 text-xs tracking-widest uppercase">Loading...</div>
  )

  if (bookings.length === 0) return (
    <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center">
      <div className="text-4xl mb-4">📋</div>
      <p className="text-xs text-gray-400 uppercase tracking-widest">No bookings yet</p>
    </div>
  )

  return (
    <div className="space-y-4">
      {bookings.map(booking => (
        <div key={booking._id} className="bg-white border border-gray-200 rounded-2xl p-6 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">{booking.hotelId?.name}</h3>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
              {booking.userId?.name} {booking.userId?.surname} · {booking.userId?.email}
            </p>
            <p className="text-sm text-gray-500 mb-1">
              {new Date(booking.checkInDate).toLocaleDateString()} → {new Date(booking.checkOutDate).toLocaleDateString()}
            </p>
            <p className="text-sm font-semibold text-gray-900">{booking.totalPrice?.toLocaleString()} AMD</p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase ${statusColors[booking.status]}`}>
              {booking.status}
            </span>
            <select
              value={booking.status}
              onChange={e => handleStatusChange(booking._id, e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-xs tracking-widest uppercase outline-none focus:border-gray-400 cursor-pointer"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  )
}