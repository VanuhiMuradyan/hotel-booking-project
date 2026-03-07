import { useState } from "react"
import api from "../../services/api"
import { type Hotel } from "../../types"

interface Props {
  hotels: Hotel[]
  setHotels: (hotels: Hotel[]) => void
}

export default function AdminAddHotel({ hotels, setHotels }: Props) {
  const [newHotel, setNewHotel] = useState({
    name: "", description: "", address: "",
    city: "", country: "", price: "", availableRooms: ""
  })
  const [previewFiles, setPreviewFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const newFiles = Array.from(e.target.files)

    setPreviewFiles(prev => [...prev, ...newFiles])
    e.target.value = ""
  }

  const removeFile = (index: number) => {
    setPreviewFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("previewFiles:", previewFiles)
console.log("previewFiles length:", previewFiles.length)
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post("/hotels/admin/add", {
        ...newHotel,
        price: Number(newHotel.price),
        availableRooms: Number(newHotel.availableRooms)
      })
      console.log("created:", res.data)
      const created = res.data.payload

      if (previewFiles.length > 0) {
        const formData = new FormData()
        previewFiles.forEach(file => formData.append("hotelImage", file))
        await api.post(`/hotels/admin/upload/images/${created._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
      }

      setHotels([...hotels, created])
      setNewHotel({ name: "", description: "", address: "", city: "", country: "", price: "", availableRooms: "" })
      setPreviewFiles([])
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8">
      <h2 className="text-xs text-gray-500 uppercase tracking-widest mb-6">Add New Hotel</h2>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 text-xs rounded-lg px-5 py-4 mb-6 tracking-widest uppercase">
          ✓ Hotel added successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-5 mb-5">
          {(["name", "address", "city", "country"] as const).map(field => (
            <div key={field}>
              <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2 capitalize">{field}</label>
              <input
                value={newHotel[field]}
                onChange={e => setNewHotel({ ...newHotel, [field]: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-400 transition"
                required
              />
            </div>
          ))}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Price / night</label>
            <input
              type="number"
              value={newHotel.price}
              onChange={e => setNewHotel({ ...newHotel, price: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-400 transition"
              required
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Available Rooms</label>
            <input
              type="number"
              value={newHotel.availableRooms}
              onChange={e => setNewHotel({ ...newHotel, availableRooms: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-400 transition"
              required
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Description</label>
            <textarea
              value={newHotel.description}
              onChange={e => setNewHotel({ ...newHotel, description: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-400 transition resize-none"
              rows={3}
            />
          </div>

          <div className="col-span-2">
            <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Images</label>
            <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition">
              <input
                type="file"
                multiple
                accept="image/*"
  onChange={(e) => {
    console.log("files selected:", e.target.files)
    handleFileChange(e)
  }}                className="hidden"
                id="add-hotel-images"
              />
              <label htmlFor="add-hotel-images" className="cursor-pointer">
                <div className="text-2xl mb-2">📁</div>
                <p className="text-xs text-gray-400 uppercase tracking-widest">
                  {previewFiles.length > 0
                    ? `${previewFiles.length} file(s) selected`
                    : "Click to select images"}
                </p>
              </label>
            </div>

            {/* Preview with remove */}
            {previewFiles.length > 0 && (
              <div className="flex gap-3 mt-3 flex-wrap">
                {previewFiles.map((file, i) => (
                  <div key={i} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
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

        <button
          type="submit"
          disabled={loading}
          className="bg-gray-900 text-white px-8 py-3 rounded-lg text-xs tracking-widest uppercase font-semibold hover:bg-gray-700 transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Creating..." : "Create Hotel"}
        </button>
      </form>
    </div>
  )
}