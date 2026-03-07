import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import api from "../../services/api"

export default function Profile() {
  const { user, logout } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || "",
    surname: user?.surname || "",
    phone: user?.phone || "",
    dateOfBirth: user?.dateOfBirth,
    country: user?.country || "",
    city: user?.city || ""
  })
  const [emailForm, setEmailForm] = useState({ newEmail: "", password: "" })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })
  const [showEmail, setShowEmail] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const showSuccess = (msg: string) => {
    setSuccess(msg)
    setError("")
    setTimeout(() => setSuccess(""), 3000)
  }

  const showError = (msg: string) => {
    setError(msg)
    setSuccess("")
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.patch("/auth/update/profile", form)
      showSuccess("Profile updated successfully!")
    } catch (err: any) {
      showError(err.response?.data?.message || "Update failed")
    }
  }

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.patch("/auth/update/email", emailForm)
      showSuccess("Email updated successfully!")
      setEmailForm({ newEmail: "", password: "" })
      setShowEmail(false)
    } catch (err: any) {
      showError(err.response?.data?.message || "Email update failed")
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return showError("Passwords do not match")
    }
    try {
      await api.patch("/auth/update/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
      showSuccess("Password updated successfully!")
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setShowPassword(false)
    } catch (err: any) {
      showError(err.response?.data?.message || "Password update failed")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10" style={{ fontFamily: "'Georgia', serif" }}>
      <div className="max-w-2xl mx-auto space-y-6">

        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold tracking-widest uppercase text-gray-900">
            hotel<span className="text-gray-400">book</span>
          </h1>
          <p className="text-sm text-gray-400 tracking-widest uppercase mt-2">My Profile</p>
          <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-xs rounded-lg px-5 py-4 tracking-widest uppercase">
            ✓ {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-5 py-4">
            {error}
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-2xl p-10 shadow-sm">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-6">Personal Info</p>
          <form onSubmit={handleUpdate} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-4 text-base text-gray-900 outline-none focus:border-gray-400 transition" />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Surname</label>
                <input value={form.surname} onChange={e => setForm({ ...form, surname: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-4 text-base text-gray-900 outline-none focus:border-gray-400 transition" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Phone</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-4 text-base text-gray-900 outline-none focus:border-gray-400 transition" />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Country</label>
                <input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-4 text-base text-gray-900 outline-none focus:border-gray-400 transition" />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">City</label>
                <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-4 text-base text-gray-900 outline-none focus:border-gray-400 transition" />
              </div>
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
            <button type="submit"
              className="w-full bg-gray-900 text-white py-4 rounded-lg text-xs font-semibold tracking-widest uppercase hover:bg-gray-700 transition cursor-pointer">
              Save Changes
            </button>
          </form>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-10 shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-400 uppercase tracking-widest">Update Email</p>
            <button type="button" onClick={() => setShowEmail(!showEmail)}
              className="text-xs text-gray-500 border border-gray-200 px-4 py-2 rounded-lg uppercase tracking-widest hover:bg-gray-50 transition cursor-pointer">
              {showEmail ? "Close" : "Change"}
            </button>
          </div>
          {showEmail && (
            <form onSubmit={handleEmailUpdate} className="space-y-5 mt-6">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">New Email</label>
                <input type="email" value={emailForm.newEmail}
                  onChange={e => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-4 text-base text-gray-900 outline-none focus:border-gray-400 transition"
                  required />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Password</label>
                <input type="password" value={emailForm.password}
                  onChange={e => setEmailForm({ ...emailForm, password: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-4 text-base text-gray-900 outline-none focus:border-gray-400 transition"
                  required />
              </div>
              <button type="submit"
                className="w-full bg-gray-900 text-white py-4 rounded-lg text-xs font-semibold tracking-widest uppercase hover:bg-gray-700 transition cursor-pointer">
                Update Email
              </button>
            </form>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-10 shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-400 uppercase tracking-widest">Update Password</p>
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="text-xs text-gray-500 border border-gray-200 px-4 py-2 rounded-lg uppercase tracking-widest hover:bg-gray-50 transition cursor-pointer">
              {showPassword ? "Close" : "Change"}
            </button>
          </div>
          {showPassword && (
            <form onSubmit={handlePasswordUpdate} className="space-y-5 mt-6">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Current Password</label>
                <input type="password" value={passwordForm.currentPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-4 text-base text-gray-900 outline-none focus:border-gray-400 transition"
                  required />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">New Password</label>
                <input type="password" value={passwordForm.newPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-4 text-base text-gray-900 outline-none focus:border-gray-400 transition"
                  required />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Confirm New Password</label>
                <input type="password" value={passwordForm.confirmPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-4 text-base text-gray-900 outline-none focus:border-gray-400 transition"
                  required />
              </div>
              <button type="submit"
                className="w-full bg-gray-900 text-white py-4 rounded-lg text-xs font-semibold tracking-widest uppercase hover:bg-gray-700 transition cursor-pointer">
                Update Password
              </button>
            </form>
          )}
        </div>

        <button onClick={logout}
          className="w-full border border-gray-200 text-gray-500 py-4 rounded-lg text-xs font-semibold tracking-widest uppercase hover:bg-gray-50 transition cursor-pointer">
          Logout
        </button>

      </div>
    </div>
  )
}