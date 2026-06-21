import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import api from '../api'

const TYPE_COLORS = {
  blog: 'border-indigo-500 bg-indigo-500/10',
  social_twitter: 'border-violet-500 bg-violet-500/10',
  social_linkedin: 'border-violet-500 bg-violet-500/10',
  email: 'border-amber-500 bg-amber-500/10',
  newsletter: 'border-emerald-500 bg-emerald-500/10',
}

const STATUS_COLORS = {
  draft: 'bg-slate-600 text-slate-200',
  review: 'bg-yellow-600/80 text-yellow-100',
  scheduled: 'bg-blue-600/80 text-blue-100',
  published: 'bg-green-600/80 text-green-100',
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

export default function CalendarPage() {
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [content, setContent] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    api.get('/content').then((res) => setContent(res.data)).catch(console.error)
  }, [])

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
  const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })

  const cells = []
  for (let i = 0; i < firstDay; i++) {
    cells.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d)
  }

  const getContentForDay = (day) => {
    if (!day) return []
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return content.filter((item) => {
      const itemDate = item.scheduled_at || item.created_at
      if (!itemDate) return false
      return itemDate.startsWith(dateStr)
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-100">{monthName}</h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 text-slate-300">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextMonth} className="p-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 text-slate-300">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-slate-700">
          {WEEKDAYS.map((day) => (
            <div key={day} className="p-3 text-center text-sm font-medium text-slate-400 border-r border-slate-700 last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((day, idx) => {
            const dayContent = getContentForDay(day)
            const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
            return (
              <div
                key={idx}
                className={`min-h-[100px] p-2 border-r border-b border-slate-700 last:border-r-0 ${day ? 'bg-slate-800' : 'bg-slate-900/50'} ${isToday ? 'ring-2 ring-inset ring-indigo-500' : ''}`}
              >
                {day && (
                  <>
                    <span className={`text-sm ${isToday ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}>{day}</span>
                    <div className="mt-1 space-y-1">
                      {dayContent.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setSelected(item)}
                          className={`w-full text-left text-xs p-1.5 rounded border-l-2 truncate ${TYPE_COLORS[item.content_type] || 'border-slate-500 bg-slate-700/50'}`}
                        >
                          <span className="block truncate text-slate-200">{item.title}</span>
                          <span className={`inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] capitalize ${STATUS_COLORS[item.status]}`}>
                            {item.status}
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 w-full max-w-lg relative">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold text-slate-100 mb-2">{selected.title}</h3>
            <div className="flex gap-2 mb-4">
              <span className={`px-2 py-0.5 rounded text-xs capitalize ${TYPE_COLORS[selected.content_type]?.replace('border-', 'bg-').split(' ')[0] || 'bg-slate-600'} text-white`}>
                {selected.content_type.replace('_', ' ')}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs capitalize ${STATUS_COLORS[selected.status]}`}>
                {selected.status}
              </span>
            </div>
            <p className="text-slate-300 text-sm whitespace-pre-wrap">{selected.body}</p>
            {selected.scheduled_at && (
              <p className="text-slate-400 text-xs mt-4">Scheduled: {new Date(selected.scheduled_at).toLocaleString()}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
