import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate("/")
    } catch {
      setError("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4" style={{ fontFamily: "'Georgia', serif" }}>
      <div className="bg-white border border-gray-200 rounded-2xl p-14 w-full max-w-xl shadow-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-widest uppercase text-gray-900">
            hotel<span className="text-gray-400">book</span>
          </h1>
          <p className="text-sm text-gray-400 tracking-widest uppercase mt-2">Welcome back</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-5 py-4 mb-8">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full border border-gray-200 rounded-lg px-4 py-4 text-base text-gray-900 outline-none focus:border-gray-400 transition"
              required
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-lg px-4 py-4 text-base text-gray-900 outline-none focus:border-gray-400 transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-4 rounded-lg text-sm font-semibold tracking-widest uppercase hover:bg-gray-700 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Loading..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-s text-gray-400 mt-8">
          Don't have an account?{" "}
          <Link to="/register" className="text-gray-700 underline">Register</Link>
        </p>

        <p className="text-center text-s text-gray-400 mt-3">
          Are you an admin?{" "}
          <Link to="/admin/signup" className="text-gray-700 underline">Register as Admin</Link>
        </p>

      </div>
    </div>
  )
}