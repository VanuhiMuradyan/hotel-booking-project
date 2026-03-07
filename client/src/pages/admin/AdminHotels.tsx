import { Link } from "react-router-dom"
import api from "../../services/api"
import { type Hotel } from "../../types"

interface Props {
  hotels: Hotel[]
  setHotels: (hotels: Hotel[]) => void
}

export default function AdminHotels({ hotels, setHotels }: Props) {
    

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/hotels/admin/delete/${id}`)
      setHotels(hotels.filter(h => h._id !== id))
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete")
    }
  }

  if (hotels.length === 0) return (
    <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center">
      <div className="text-4xl mb-4">🏨</div>
      <p className="text-xs text-gray-400 uppercase tracking-widest">No hotels yet</p>
    </div>
  )

  return (
    <div className="space-y-4">
      {hotels.map(hotel => (
        <Link key={hotel._id} to={`/admin/update/${hotel._id}`} className="no-underline">
        <div key={hotel._id} className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex gap-5 items-start">
            <div className="flex gap-2 flex-shrink-0">
              {hotel.images && hotel.images.length > 0 ? (
                hotel.images.slice(0, 3).map((img, i) => (
                  <img
                    key={i}
                    src={`${import.meta.env.VITE_BASE_URL}${img}`}
                    alt=""
                    className="w-24 h-20 object-cover rounded-xl"
                  />
                ))
              ) : (
                <div className="w-24 h-20 bg-gray-100 rounded-xl flex items-center justify-center">
                  <span className="text-gray-300 text-2xl">🏨</span>
                </div>
              )}
              {hotel.images && hotel.images.length > 3 && (
                <div className="w-24 h-20 bg-gray-100 rounded-xl flex items-center justify-center">
                  <span className="text-xs text-gray-400 font-semibold">+{hotel.images.length - 3}</span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900 text-base mb-1">{hotel.name}</h3>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{hotel.city}, {hotel.country}</p>
                  <p className="text-sm text-gray-500">{hotel.price?.toLocaleString()} AMD/night · {hotel.availableRooms} rooms</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleDelete(hotel._id)
                    }}
                    className="text-xs tracking-widest uppercase text-red-400 border border-red-100 px-5 py-6 rounded-lg hover:bg-red-50 transition cursor-pointer"
                  >
                    Delete
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </Link>
      ))}
      </div>
  )
}