import { useState, useEffect } from "react"
import api from "../../services/api"
import { type Hotel } from "../../types"
import AdminHotels from "./AdminHotels"
import AdminAddHotel from "./AdminAddHotel"
import AdminBookings from "./AdminBookings"

export default function AdminPanel() {
  const [tab, setTab] = useState("hotels")
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/hotels/admin/my-hotels")
      .then(res => setHotels(res.data.payload))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10" style={{ fontFamily: "'Georgia', serif" }}>
      <div className="max-w-6xl mx-auto">

        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-widest uppercase text-gray-900">
            hotel<span className="text-gray-400">book</span>
          </h1>
          <p className="text-xs text-gray-400 tracking-widest uppercase mt-1">Admin Panel</p>
        </div>

        <div className="flex gap-2 mb-8 border-b border-gray-200">
          {["hotels", "bookings", "add hotel"].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3 text-xs tracking-widest uppercase font-semibold transition border-b-2 -mb-px ${
                tab === t ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-gray-400 text-xs tracking-widest uppercase">Loading...</div>
        ) : (
          <>
            {tab === "hotels" && <AdminHotels hotels={hotels} setHotels={setHotels} />}
            {tab === "add hotel" && <AdminAddHotel hotels={hotels} setHotels={setHotels} />}
            {tab === "bookings" && <AdminBookings />}
          </>
        )}

      </div>
    </div>
  )
}