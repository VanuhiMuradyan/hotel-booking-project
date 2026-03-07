import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import api from "../../services/api"
import type { PublicUser } from "../../types"

export default function PublicProfile() {
  const { id } = useParams()
  const [profile, setProfile] = useState<PublicUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/auth/profile/${id}`)
      .then(res => 
        setProfile(res.data.payload))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-xs text-gray-400 uppercase tracking-widest">Loading...</p>
    </div>
  )

  if (!profile) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-xs text-gray-400 uppercase tracking-widest">User not found</p>
    </div>
  )
  

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4" style={{ fontFamily: "'Georgia', serif" }}>
      <div className="bg-white border border-gray-200 rounded-2xl p-14 w-full max-w-md shadow-sm text-center">

        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-xl mx-auto mb-4">
          {profile.name?.[0]}{profile.surname?.[0]}
        </div>

        <h1 className="text-2xl font-bold tracking-widest uppercase text-gray-900 mb-1">
          {profile.name} {profile.surname}
        </h1>
        <p className="text-xs text-gray-400 tracking-widest uppercase mb-6">Host</p>

        <div className="space-y-3 text-left">
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-widest block mb-1">Email</label>
            <p className="text-sm text-gray-900">{profile.email}</p>
          </div>
          {profile.country && (
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-widest block mb-1">Country</label>
              <p className="text-sm text-gray-900">{profile.country}</p>
            </div>
          )}
          {profile.phone && (
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-widest block mb-1">Phone</label>
              <p className="text-sm text-gray-900">{profile.phone}</p>
            </div>
          )}
          {profile.dateOfBirth && (
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-widest block mb-1">Birthday</label>
              <p className="text-sm text-gray-900">{profile.dateOfBirth}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}