import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"
import type { Hotel } from "../types"
import { useDebounce } from "../hooks/useDebounce"

export default function Home() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    setLoading(true)
    const url = debouncedSearch.trim()
      ? `/hotels/search?city=${debouncedSearch}`
      : "/hotels"

    api.get(url)
      .then(res => setHotels(res.data.payload))
      .finally(() => setLoading(false))
  }, [debouncedSearch])

  return (
    <div className="bg-gray-50 min-h-screen" style={{ fontFamily: "'Georgia', serif" }}>
      <div className="max-w-5xl mx-auto px-10 py-16">

        <div className="mb-12">
          <h1 className="text-5xl font-normal tracking-tight leading-tight text-gray-900">
            Find your<br />
            <em className="italic text-gray-400">perfect stay.</em>
          </h1>
        </div>

        <div className="relative mb-12">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">⌕</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by city..."
            className="w-full bg-white border border-gray-300 text-gray-900 rounded px-4 pl-10 py-3 text-sm outline-none focus:border-gray-600 transition"
          />
        </div>

        {!loading && (
          <p className="text-gray-400 text-xs tracking-widest uppercase mb-6">
            {hotels.length} hotels
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-4">
                <div className="h-44 bg-gray-200 rounded mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))
            : hotels.map(hotel => (
              <Link key={hotel._id} to={`/hotels/${hotel._id}`} className="no-underline">
                <div className="bg-white rounded-lg overflow-hidden border border-gray-100 cursor-pointer transition-shadow hover:shadow-lg">
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}${hotel.images[0]}`}
                    alt={hotel.name}
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-4">
                    <div className="text-sm font-semibold text-gray-900 mb-1">{hotel.name}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">{hotel.city}</div>
                    {hotel.price && (
                      <span className="text-sm font-bold text-gray-900">
                        {hotel.price.toLocaleString()} AMD
                        <span className="text-xs text-gray-400 font-normal">/night</span>
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))
          }
        </div>

        {!loading && hotels.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-4xl mb-3">—</div>
            <div className="text-xs tracking-widest uppercase">No hotels found</div>
          </div>
        )}

      </div>
    </div>
  )
}