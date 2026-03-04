import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import api from "../services/api"

export default function Profile() {
  const { user, logout } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || "",
    surname: user?.surname || "",
    phone: user?.phone || "",
    country: user?.country || "",
    city: user?.city || ""
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    try {
      await api.patch("/auth/update/profile", form)
      setSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.message || "Update failed")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4" style={{ fontFamily: "'Georgia', serif" }}>
      <div className="bg-white border border-gray-200 rounded-2xl p-14 w-full max-w-2xl shadow-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-widest uppercase text-gray-900">
            hotel<span className="text-gray-400">book</span>
          </h1>
          <p className="text-sm text-gray-400 tracking-widest uppercase mt-2">My Profile</p>
        </div>

        {/* Email */}
        <p className="text-center text-sm text-gray-400 mb-8 tracking-wide">{user?.email}</p>

        {/* Success */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg px-5 py-4 mb-8">
            Profile updated successfully!
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-5 py-4 mb-8">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Name</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-4 text-base text-gray-900 outline-none focus:border-gray-400 transition"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Surname</label>
              <input
                value={form.surname}
                onChange={e => setForm({ ...form, surname: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-4 text-base text-gray-900 outline-none focus:border-gray-400 transition"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Phone</label>
            <input
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-4 text-base text-gray-900 outline-none focus:border-gray-400 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Country</label>
              <input
                value={form.country}
                onChange={e => setForm({ ...form, country: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-4 text-base text-gray-900 outline-none focus:border-gray-400 transition"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">City</label>
              <input
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-4 text-base text-gray-900 outline-none focus:border-gray-400 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-4 rounded-lg text-sm font-semibold tracking-widest uppercase hover:bg-gray-700 transition cursor-pointer"
          >
            Save Changes
          </button>
        </form>

        <button
          onClick={logout}
          className="w-full mt-4 border border-gray-200 text-gray-500 py-4 rounded-lg text-sm font-semibold tracking-widest uppercase hover:bg-gray-50 transition cursor-pointer"
        >
          Logout
        </button>

      </div>
    </div>
  )
}