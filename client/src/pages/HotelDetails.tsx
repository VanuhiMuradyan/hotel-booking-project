import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import api from "../services/api"
import { useAuth } from "../context/AuthContext"
import { type Hotel } from "../types"
import UserHotel from "./UserHotel"
import AdminHotelUpdate from "./admin/AdminHotelUpdate"

export default function HotelDetails() {
  const { id } = useParams()
  const { isAdmin, user } = useAuth()
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    api.get(`/hotels/${id}`)
      .then(res => setHotel(res.data.payload))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex justify-center mt-20 text-gray-400">Loading...</div>
  if (!hotel) return <div className="text-center mt-20 text-gray-500">Hotel not found</div>

  const isOwner = isAdmin && hotel.owner._id === user?._id
  

return (
  <div className="max-w-4xl mx-auto px-6 py-8">
    <div className="mb-6">
      <img src={`${import.meta.env.VITE_BASE_URL}${hotel.images[activeImg]}`}
        alt={hotel.name} className="w-full h-80 object-cover rounded-xl mb-3" />
      <div className="flex gap-2 overflow-x-auto">
        {hotel.images.map((img, i) => (
          <img key={i} src={`${import.meta.env.VITE_BASE_URL}${img}`} alt=""
            onClick={() => setActiveImg(i)}
            className={`w-20 h-20 object-cover rounded-lg cursor-pointer flex-shrink-0 transition-all
              ${activeImg === i ? "border-2 border-black opacity-100" : "border-2 border-transparent opacity-50"}`} />
        ))}
      </div>
    </div>

    <div className="flex justify-between items-start mb-2">
      <h1 className="text-3xl font-bold text-gray-800">{hotel.name}</h1>
      {isOwner && <AdminHotelUpdate hotel={hotel} setHotel={setHotel} />}
    </div>

    <p className="text-gray-500 mt-1">{hotel.address}, {hotel.city}, {hotel.country}</p>
    <p className="text-gray-700 mt-4">{hotel.description}</p>
    <div className="flex gap-4 mt-4">
      <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">{hotel.price} AMD/night</span>
      <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">{hotel.availableRooms} rooms</span>
    </div>

    {!isOwner && <UserHotel hotelId={id!} />}
  </div>
)
}