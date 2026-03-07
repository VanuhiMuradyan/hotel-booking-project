import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import api from "../../services/api"
import RatingForm from "./RatingForm"
import RatingCard from "./RatingCard"

interface Rating {
  _id: string
  rate: number
  comment: string
  createdAt: string
  userId: { _id: string; name: string; surname: string }
}

interface Props {
  hotelId: string
  onRatingSuccess: () => void
}

export default function HotelRatings({ hotelId, onRatingSuccess }: Props) {
  const { user } = useAuth()
  const [ratings, setRatings] = useState<Rating[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/rating/${hotelId}`)
    .then(res => {
      setRatings(res.data.payload)
    })      .finally(() => setLoading(false))
  }, [hotelId])

  const handleSubmit = async (body: { rate?: number; comment?: string }) => {
    try {
      const res = await api.post(`/rating/${hotelId}`, body)
      setRatings(prev => [res.data.payload, ...prev])
      onRatingSuccess()
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to submit")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/rating/${id}`)
      setRatings(ratings.filter(r => r._id !== id))
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete")
    }
  }

  const handleEdit = async (id: string, body: { rate?: number; comment?: string }) => {
    try {
      const res = await api.patch(`/rating/${id}`, body)
      setRatings(ratings.map(r => r._id === id ? res.data.payload : r))
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to edit")
    }
  }

  const avgRating = ratings.filter(r => r.rate).length
    ? (ratings.filter(r => r.rate).reduce((sum, r) => sum + r.rate, 0) / ratings.filter(r => r.rate).length).toFixed(1)
    : null

  return (
    <div className="mt-10" style={{ fontFamily: "'Georgia', serif" }}>

      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-xs text-gray-400 uppercase tracking-widest">Reviews</h2>
        {avgRating && (
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-sm">{"★".repeat(Math.round(Number(avgRating)))}</span>
            <span className="text-sm font-semibold text-gray-900">{avgRating}</span>
            <span className="text-xs text-gray-400">({ratings.length})</span>
          </div>
        )}
      </div>

      {user && <RatingForm onSubmit={handleSubmit} />}

      {loading ? (
        <div className="text-xs text-gray-400 uppercase tracking-widest">Loading...</div>
      ) : ratings.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest">No reviews yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ratings.map(rating => (
            <RatingCard
              key={rating._id}
              rating={rating}
              currentUserId={user?._id}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  )
}