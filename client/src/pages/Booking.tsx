import { useState, useEffect } from "react"
import api from "../services/api"
import { type Booking } from "../types"

const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    completed: "bg-gray-100 text-gray-800"
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
            setBookings(bookings.map(b =>
                b._id === id ? { ...b, status: "cancelled" } : b
            ))
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to cancel")
        }
    }

    if (loading) return <div className="flex justify-center mt-20 text-gray-400">Loading...</div>

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h1>
            {bookings.length === 0 ? (
                <p className="text-gray-500">No bookings yet.</p>
            ) : (
                <div className="space-y-4">
                    {bookings.map(booking => (
                        <div key={booking._id} className="bg-white border border-gray-200 rounded-xl p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="font-semibold text-gray-800 text-lg">{booking.hotelId?.name}</h2>
                                    <p className="text-gray-500 text-sm">{booking.hotelId?.city}, {booking.hotelId?.country}</p>
                                    <p className="text-gray-600 text-sm mt-2">
                                        {new Date(booking.checkInDate).toLocaleDateString()} →{" "}
                                        {new Date(booking.checkOutDate).toLocaleDateString()}
                                    </p>
                                    <p className="text-gray-600 text-sm">{booking.numberOfGuests} guests · {booking.roomsCount} rooms</p>
                                    <p className="font-bold text-gray-800 mt-1">{booking.totalPrice}AMD</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[booking.status]}`}>
                                        {booking.status}
                                    </span>
                                    {booking.status === "pending" && (
                                        <button onClick={() => handleCancel(booking._id)}
                                            className="text-red-500 text-sm hover:underline">
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}