import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { useAuth } from "../context/AuthContext"

interface Props { hotelId: string }

export default function UserHotel({ hotelId }: Props) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    checkInDate: "", checkOutDate: "", numberOfGuests: 1, roomsCount: 1
  })

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return navigate("/login")
    setBooking(true)
    setError("")
    try {
      await api.post(`/booking/create/${hotelId}`, form)
      setSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.message || "Booking failed")
    } finally {
      setBooking(false)
    }
  }

  return (
    <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
      <h2 className="text-xl font-bold mb-4">Book this hotel</h2>
      {success ? (
        <p className="text-green-600 font-medium">Booking successful!</p>
      ) : (
        <form onSubmit={handleBook} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check In</label>
              <input type="date" value={form.checkInDate} onChange={e => setForm({ ...form, checkInDate: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check Out</label>
              <input type="date" value={form.checkOutDate} onChange={e => setForm({ ...form, checkOutDate: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
              <input type="number" min="1" max="20" value={form.numberOfGuests}
                onChange={e => setForm({ ...form, numberOfGuests: Number(e.target.value) })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rooms</label>
              <input type="number" min="1" max="10" value={form.roomsCount}
                onChange={e => setForm({ ...form, roomsCount: Number(e.target.value) })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400" required />
            </div>
          </div>
          <button type="submit" disabled={booking}
            className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50">
            {booking ? "Booking..." : "Book Now"}
          </button>
        </form>
      )}
    </div>
  )
}