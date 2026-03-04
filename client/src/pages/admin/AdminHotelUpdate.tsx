import { useState } from "react"
import api from "../../services/api"
import { type Hotel } from "../../types"

interface Props {
  hotel: Hotel
  setHotel: (h: Hotel) => void
}

export default function AdminHotelUpdate({ hotel, setHotel }: Props) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null)
  const [form, setForm] = useState({
    name: hotel.name || "", description: hotel.description || "",
    address: hotel.address || "", city: hotel.city || "",
    country: hotel.country || "", price: String(hotel.price || ""),
    availableRooms: String(hotel.availableRooms || "")
  })

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => formData.append(k, v))
      if (uploadFiles) Array.from(uploadFiles).forEach(f => formData.append("hotelImage", f))
      const res = await api.patch(`/hotels/admin/update/${hotel._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      setHotel(res.data.payload)
      setUploadFiles(null)
      setSuccess(true)
      setOpen(false)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      alert(err.response?.data?.message || "Update failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ fontFamily: "'Georgia', serif" }}>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 text-xs rounded-lg px-5 py-3 mb-4 tracking-widest uppercase">
          ✓ Updated successfully!
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="border border-gray-200 text-gray-700 px-6 py-2 rounded-lg text-xs tracking-widest uppercase font-semibold hover:bg-gray-50 transition cursor-pointer"
      >
        {open ? "Close" : "Edit Hotel"}
      </button>

      {open && (
        <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-10 w-full">

          <div className="text-center mb-8">
            <p className="text-xs text-gray-400 tracking-widest uppercase">Edit Hotel</p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              {(["name", "address", "city", "country"] as const).map(field => (
                <div key={field}>
                  <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2 capitalize">{field}</label>
                  <input
                    value={form[field]}
                    onChange={e => setForm({ ...form, [field]: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-4 text-base text-gray-900 outline-none focus:border-gray-400 transition"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Price / night</label>
                <input type="number" value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-4 text-base text-gray-900 outline-none focus:border-gray-400 transition"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Available Rooms</label>
                <input type="number" value={form.availableRooms}
                  onChange={e => setForm({ ...form, availableRooms: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-4 text-base text-gray-900 outline-none focus:border-gray-400 transition"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Description</label>
                <textarea value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-4 py-4 text-base text-gray-900 outline-none focus:border-gray-400 transition resize-none"
                />
              </div>

              <div className="col-span-2">
                <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Add New Images</label>
                <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition">
                  <input type="file" multiple accept="image/*" onChange={e => setUploadFiles(e.target.files)} className="hidden" id="edit-images" />
                  <label htmlFor="edit-images" className="cursor-pointer">
                    <div className="text-3xl mb-2">📁</div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">
                      {uploadFiles?.length ? `${uploadFiles.length} file(s) selected` : "Click to select images"}
                    </p>
                  </label>
                </div>
                {uploadFiles && (
                  <div className="flex gap-3 mt-3 flex-wrap">
                    {Array.from(uploadFiles).map((f, i) => (
                      <img key={i} src={URL.createObjectURL(f)} className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setOpen(false)}
                className="flex-1 border border-gray-200 text-gray-500 py-4 rounded-lg text-xs tracking-widest uppercase font-semibold hover:bg-gray-50 transition cursor-pointer">
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="flex-1 bg-gray-900 text-white py-4 rounded-lg text-xs tracking-widest uppercase font-semibold hover:bg-gray-700 transition disabled:opacity-50 cursor-pointer">
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}