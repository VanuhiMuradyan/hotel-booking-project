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
  const [uploadFiles, setUploadFiles] = useState<File[]>([])
  const [inputKey, setInputKey] = useState(0)
  const [removedImages, setRemovedImages] = useState<string[]>([])
  const [form, setForm] = useState({
    name: hotel.name || "", description: hotel.description || "",
    address: hotel.address || "", city: hotel.city || "",
    country: hotel.country || "", price: String(hotel.price || ""),
    availableRooms: String(hotel.availableRooms || "")
  })

  const toggleRemoveImage = (img: string) => {
    setRemovedImages(prev =>
      prev.includes(img) ? prev.filter(i => i !== img) : [...prev, img]
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    setUploadFiles(prev => [...prev, ...Array.from(e.target.files!)])
    setInputKey(prev => prev + 1)
  }

  const removeUploadFile = (index: number) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([k, v]) => formData.append(k, v))
      uploadFiles.forEach(f => formData.append("hotelImage", f))
      removedImages.forEach(img => formData.append("removedImages", img))

      const res = await api.patch(`/hotels/admin/update/${hotel._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      setHotel(res.data.payload)
      setUploadFiles([])
      setInputKey(prev => prev + 1)
      setRemovedImages([])
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

              {hotel.images?.length > 0 && (
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Current Images</label>
                  <div className="flex gap-3 flex-wrap">
                    {hotel.images.map((img, i) => (
                      <div key={i} className="relative">
                        <img
                          src={`${import.meta.env.VITE_BASE_URL}${img}`}
                          className={`w-20 h-20 object-cover rounded-lg border-2 transition ${
                            removedImages.includes(img)
                              ? "opacity-30 border-red-400"
                              : "border-gray-200"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => toggleRemoveImage(img)}
                          className={`absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs flex items-center justify-center transition cursor-pointer ${
                            removedImages.includes(img)
                              ? "bg-red-400 text-white"
                              : "bg-gray-200 text-gray-600 hover:bg-red-400 hover:text-white"
                          }`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  {removedImages.length > 0 && (
                    <p className="text-xs text-red-400 mt-2 tracking-widest uppercase">
                      {removedImages.length} image(s) will be removed
                    </p>
                  )}
                </div>
              )}

              <div className="col-span-2">
                <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Add New Images</label>
                <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition">
                  <input
                    key={inputKey}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="edit-images"
                  />
                  <label htmlFor="edit-images" className="cursor-pointer">
                    <div className="text-3xl mb-2">📁</div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">
                      {uploadFiles.length > 0 ? `${uploadFiles.length} file(s) selected` : "Click to select images"}
                    </p>
                  </label>
                </div>
                {uploadFiles.length > 0 && (
                  <div className="flex gap-3 mt-3 flex-wrap">
                    {uploadFiles.map((f, i) => (
                      <div key={i} className="relative">
                        <img src={URL.createObjectURL(f)} className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                        <button
                          type="button"
                          onClick={() => removeUploadFile(i)}
                          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center hover:bg-red-400 hover:text-white transition cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
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