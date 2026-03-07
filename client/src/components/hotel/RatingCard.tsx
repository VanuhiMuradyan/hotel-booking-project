import { useState } from "react"

interface Rating {
  _id: string
  rate: number
  comment: string
  createdAt: string
  userId: { _id: string; name: string; surname: string }
}

interface Props {
  rating: Rating
  currentUserId?: string
  onDelete: (id: string) => void
  onEdit: (id: string, body: { rate?: number; comment?: string }) => Promise<void>
}

export default function RatingCard({ rating, currentUserId, onDelete, onEdit }: Props) {

  const [editing, setEditing] = useState(false)

  const [editForm, setEditForm] = useState({
    rate: rating.rate,
    comment: rating.comment
  })

  const [saving, setSaving] = useState(false)

  const isOwner = currentUserId === rating.userId._id

  const handleSave = async () => {
    setSaving(true)

    try {

      const body: { rate?: number; comment?: string } = {}

      if (editForm.rate !== rating.rate) {
        body.rate = editForm.rate
      }

      if (editForm.comment.trim() !== rating.comment) {
        body.comment = editForm.comment.trim()
      }

      await onEdit(rating._id, body)

      setEditing(false)

    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditForm({
      rate: rating.rate,
      comment: rating.comment
    })
    setEditing(false)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">

      {/* HEADER */}
      <div className="flex justify-between items-start mb-3">

        <div className="flex items-center gap-3">

          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600">
            {rating.userId?.name?.[0]}
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              {rating.userId?.name} {rating.userId?.surname}
            </p>

            <p className="text-xs text-gray-400">
              {new Date(rating.createdAt).toLocaleDateString()}
            </p>
          </div>

        </div>

        {isOwner && (
          <div className="flex gap-2">

            <button
              onClick={() => setEditing(true)}
              className="text-xs uppercase text-blue-500 border border-blue-200 px-3 py-1 rounded-lg hover:bg-blue-50"
            >
              Edit
            </button>

            <button
              onClick={() => onDelete(rating._id)}
              className="text-xs uppercase text-red-500 border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50"
            >
              Delete
            </button>

          </div>
        )}

      </div>

      {/* EDIT MODE */}
      {editing ? (

        <div className="space-y-3">

          <div className="flex gap-1">
            {[1,2,3,4,5].map(star => (
              <button
                key={star}
                onClick={() => setEditForm({ ...editForm, rate: star })}
                className="text-2xl"
              >
                <span className={editForm.rate >= star ? "text-yellow-400" : "text-gray-300"}>
                  ★
                </span>
              </button>
            ))}
          </div>

          <textarea
            value={editForm.comment}
            onChange={(e)=>setEditForm({...editForm, comment:e.target.value})}
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm"
          />

          <div className="flex gap-2">

            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-gray-900 text-white px-5 py-2 rounded-lg text-xs uppercase"
            >
              {saving ? "Saving..." : "Save"}
            </button>

            <button
              onClick={handleCancel}
              className="border border-gray-300 px-5 py-2 rounded-lg text-xs uppercase"
            >
              Cancel
            </button>

          </div>

        </div>

      ) : (

        <>
          {/* STARS */}
          {rating.rate > 0 && (
            <div className="flex mb-2">
              {[1,2,3,4,5].map(star => (
                <span
                  key={star}
                  className={star <= rating.rate ? "text-yellow-400" : "text-gray-300"}
                >
                  ★
                </span>
              ))}
            </div>
          )}

          {/* COMMENT */}
          {rating.comment && (
            <p className="text-sm text-gray-600">
              {rating.comment}
            </p>
          )}

        </>

      )}

    </div>
  )
}