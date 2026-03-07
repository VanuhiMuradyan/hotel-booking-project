import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../../services/api"
import type { Hotel } from "../../types"

export default function Hotels() {
    const [hotels, setHotels] = useState<Hotel[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [city, setCity] = useState("")

    useEffect(() => {
        api.get("/hotels")
            .then(res => setHotels(res.data.payload))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const filtered = hotels.filter(h =>
        h.name.toLowerCase().includes(search.toLowerCase()) &&
        h.city.toLowerCase().includes(city.toLowerCase())
    )

    if (loading) return <div className="flex justify-center mt-20 text-gray-400">Loading...</div>

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Hotels</h1>
            <div className="flex gap-4 mb-6">
                <input placeholder="Search by name..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-gray-400" />
                <input placeholder="Filter by city..."
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-gray-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(hotel => (
                    <Link key={hotel._id} to={`/hotels/${hotel._id}`}>
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition">
                            {hotel.images?.[0] && (
                                <img src={hotel.images[0]} alt={hotel.name}
                                    className="w-full h-48 object-cover" />
                            )}
                            <div className="p-4">
                                <h2 className="font-semibold text-gray-800 text-lg">{hotel.name}</h2>
                                <p className="text-gray-500 text-sm">{hotel.city}, {hotel.country}</p>
                                <p className="text-gray-900 font-bold mt-2">${hotel.price} / night</p>
                                <p className="text-gray-400 text-sm">{hotel.availableRooms} rooms available</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}