import { useEffect, useState } from 'react'
import api from '../api'

const TYPE_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'blog', label: 'Blog' },
  { value: 'social_twitter', label: 'Social Twitter' },
  { value: 'social_linkedin', label: 'Social LinkedIn' },
  { value: 'email', label: 'Email' },
  { value: 'newsletter', label: 'Newsletter' },
]

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'review', label: 'Review' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'published', label: 'Published' },
]

const TYPE_BADGE = {
  blog: 'bg-indigo-600 text-white',
  social_twitter: 'bg-violet-600 text-white',
  social_linkedin: 'bg-violet-600 text-white',
  email: 'bg-amber-600 text-white',
  newsletter: 'bg-emerald-600 text-white',
}

const STATUS_BADGE = {
  draft: 'bg-slate-600 text-slate-200',
  review: 'bg-yellow-600 text-yellow-100',
  scheduled: 'bg-blue-600 text-blue-100',
  published: 'bg-green-600 text-green-100',
}

export default function ContentPage() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchContent = async () => {
    setLoading(true)
    try {
      const params = {}
      if (search) params.search = search
      if (type) params.type = type
      if (status) params.status = status
      const res = await api.get('/content', { params })
      setItems(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContent()
  }, [search, type, status])

  const handlePublish = async (id) => {
    await api.post(`/content/${id}/publish`)
    fetchContent()
  }

  const handleSchedule = async (id) => {
    await api.post(`/content/${id}/schedule`)
    fetchContent()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
        >
          {TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-slate-400">Loading...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div className="h-32 bg-slate-700 flex items-center justify-center text-slate-500 text-sm">
              Thumbnail
            </div>
            <div className="p-4">
              <button
                onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                className="text-left w-full font-medium text-slate-100 hover:text-indigo-400 transition-colors mb-2"
              >
                {item.title}
              </button>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`px-2 py-0.5 rounded text-xs capitalize ${TYPE_BADGE[item.content_type] || 'bg-slate-600'}`}>
                  {item.content_type.replace('_', ' ')}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs capitalize ${STATUS_BADGE[item.status]}`}>
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Created: {new Date(item.created_at).toLocaleDateString()}
              </p>
              {expanded === item.id && (
                <p className="text-sm text-slate-300 mb-3 border-t border-slate-700 pt-3 line-clamp-4">
                  {item.body}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => handlePublish(item.id)}
                  className="flex-1 px-3 py-1.5 bg-green-600/80 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
                >
                  Publish
                </button>
                <button
                  onClick={() => handleSchedule(item.id)}
                  className="flex-1 px-3 py-1.5 bg-blue-600/80 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && items.length === 0 && (
        <p className="text-slate-400 text-center py-8">No content found.</p>
      )}
    </div>
  )
}
