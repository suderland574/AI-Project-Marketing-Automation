import { useEffect, useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import api from '../api'

export default function AnalyticsPage() {
  const [overview, setOverview] = useState(null)
  const [channels, setChannels] = useState(null)
  const [content, setContent] = useState([])

  useEffect(() => {
    Promise.all([
      api.get('/analytics/overview'),
      api.get('/analytics/channels'),
      api.get('/content'),
    ]).then(([ov, ch, ct]) => {
      setOverview(ov.data)
      setChannels(ch.data)
      setContent(ct.data)
    }).catch(console.error)
  }, [])

  const channelData = channels
    ? [
        { name: 'HubSpot', views: channels.hubspot?.views || 0, clicks: channels.hubspot?.clicks || 0 },
        { name: 'Buffer', views: channels.buffer?.views || 0, clicks: channels.buffer?.clicks || 0 },
        { name: 'Email', views: channels.email?.views || 0, clicks: channels.email?.clicks || 0 },
        { name: 'Social', views: channels.social?.views || 0, clicks: channels.social?.clicks || 0 },
      ]
    : []

  const topContent = content.slice(0, 5).map((item, i) => ({
    title: item.title,
    type: item.content_type.replace('_', ' '),
    views: 500 + i * 120,
    clicks: 45 + i * 15,
    shares: 8 + i * 3,
  }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Views" value={overview?.total_views?.toLocaleString() || '0'} />
        <KpiCard label="Total Clicks" value={overview?.total_clicks?.toLocaleString() || '0'} />
        <KpiCard label="Total Shares" value={overview?.total_shares?.toLocaleString() || '0'} />
        <KpiCard label="Conversions" value={overview?.conversions?.toLocaleString() || '0'} />
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 p-5">
        <h3 className="text-lg font-semibold mb-4 text-slate-200">Views Over Time (Last 30 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={overview?.daily_data || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
            <Line type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 p-5">
        <h3 className="text-lg font-semibold mb-4 text-slate-200">Channel Performance</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={channelData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
            <Legend />
            <Bar dataKey="views" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="clicks" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="p-5 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-slate-200">Top Content</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400">
              <th className="text-left p-3 font-medium">Title</th>
              <th className="text-left p-3 font-medium">Type</th>
              <th className="text-left p-3 font-medium">Views</th>
              <th className="text-left p-3 font-medium">Clicks</th>
              <th className="text-left p-3 font-medium">Shares</th>
            </tr>
          </thead>
          <tbody>
            {topContent.map((item, i) => (
              <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                <td className="p-3 text-slate-200">{item.title}</td>
                <td className="p-3 text-slate-400 capitalize">{item.type}</td>
                <td className="p-3 text-slate-300">{item.views.toLocaleString()}</td>
                <td className="p-3 text-slate-300">{item.clicks.toLocaleString()}</td>
                <td className="p-3 text-slate-300">{item.shares.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function KpiCard({ label, value }) {
  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-5">
      <p className="text-sm text-slate-400 mb-1">{label}</p>
      <p className="text-3xl font-bold text-slate-100">{value}</p>
    </div>
  )
}
