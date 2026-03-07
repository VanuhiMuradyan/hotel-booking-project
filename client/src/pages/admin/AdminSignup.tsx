import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../../services/api"

export default function AdminSignup() {
  const navigate = useNavigate()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "", surname: "", email: "", password: "",
    dateOfBirth: "", phone: "", country: "", avatar: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setError("")
    setLoading(true)
    try {
      await api.post("/auth/admin/signup", form)
      navigate("/login")
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4" style={{ fontFamily: "'Georgia', serif" }}>
      <div className="bg-white border border-gray-200 rounded-2xl p-14 w-full max-w-2xl shadow-sm">

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-widest uppercase text-gray-900">
            hotel<span className="text-gray-400">book</span>
          </h1>
          <p className="text-sm text-gray-400 tracking-widest uppercase mt-2">Admin Registration</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-5 py-4 mb-8">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-5 mb-6">
          {[
            { name: "name", label: "Name", type: "text" },
            { name: "surname", label: "Surname", type: "text" },
            { name: "email", label: "Email", type: "email" },
            { name: "password", label: "Password", type: "password"},
          ].map(field => (
            <div key={field.name} className={field.name === "avatar" ? "col-span-2" : ""}>
              <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-4 text-base text-gray-900 outline-none focus:border-gray-400 transition"
              />
            </div>
          ))}

            <div>
              <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Birthday</label>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={e => setForm({ ...form, dateOfBirth: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-4 text-base text-gray-900 outline-none focus:border-gray-400 transition"
              />
            </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gray-900 text-white py-4 rounded-lg text-sm font-semibold tracking-widest uppercase hover:bg-gray-700 transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Loading..." : "Create Admin"}
        </button>

        <p className="text-center text-s text-gray-500 mt-8">
          Already have an account?{" "}
          <span className="text-gray-700 cursor-pointer underline" onClick={() => navigate("/login")}>
            Sign in
          </span>
        </p>

        <p className="text-center text-s text-gray-500 mt-3">
          Are you a user?{" "}
          <Link to="/register" className="text-gray-700 underline">Register as User</Link>
        </p>

      </div>
    </div>
  )
}