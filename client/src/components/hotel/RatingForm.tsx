import { useState } from "react"

interface Props {
  onSubmit: (body: { rate?: number; comment?: string }) => Promise<void>
}

export default function RatingForm({ onSubmit }: Props) {
  const [rate, setRate] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rate && !comment.trim()) return
    setSubmitting(true)
    try {
      const body: { rate?: number; comment?: string } = {}
      if (rate) body.rate = rate
      if (comment.trim()) body.comment = comment.trim()
      await onSubmit(body)
      setRate(0)
      setComment("")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-6">
      <p className="text-xs text-gray-400 uppercase tracking-widest mb-6">Leave a Review</p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setRate(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                className="text-2xl transition cursor-pointer"
              >
                <span className={(hovered || rate) >= star ? "text-yellow-400" : "text-gray-200"}>★</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Comment</label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={3}
            placeholder="Share your experience..."
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-400 transition resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting || (!rate && !comment.trim())}
          className="bg-gray-900 text-white px-8 py-3 rounded-lg text-xs tracking-widest uppercase font-semibold hover:bg-gray-700 transition disabled:opacity-50 cursor-pointer"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  )
}