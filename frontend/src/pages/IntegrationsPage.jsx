import { useEffect, useState } from 'react'
import api from '../api'

const INTEGRATION_META = {
  hubspot: { color: '#ff7a59', description: 'CMS, CRM & Email' },
  buffer: { color: '#2d9cdb', description: 'Social Media Scheduling' },
  google_analytics: { color: '#34a853', description: 'Traffic & Conversions' },
  openai: { color: '#412991', description: 'GPT-4o & DALL-E 3' },
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState([])
  const [loading, setLoading] = useState({})

  useEffect(() => {
    api.get('/integrations').then((res) => setIntegrations(res.data)).catch(console.error)
  }, [])

  const handleConnect = async (key) => {
    setLoading((prev) => ({ ...prev, [key]: true }))
    try {
      await api.post(`/integrations/${key}/connect`)
      const res = await api.get('/integrations')
      setIntegrations(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }))
    }
  }

  const handleDisconnect = async (key) => {
    setLoading((prev) => ({ ...prev, [key]: true }))
    try {
      await api.post(`/integrations/${key}/disconnect`)
      const res = await api.get('/integrations')
      setIntegrations(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }))
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {integrations.map((integration) => {
        const meta = INTEGRATION_META[integration.key] || { color: '#6366f1', description: integration.description }
        return (
          <div key={integration.key} className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                style={{ backgroundColor: meta.color }}
              >
                {integration.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-100">{integration.name}</h3>
                <p className="text-sm text-slate-400 mt-1">{meta.description}</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${integration.connected ? 'bg-green-600/80 text-green-100' : 'bg-slate-600 text-slate-300'}`}>
                    {integration.connected ? 'Connected' : 'Disconnected'}
                  </span>
                  <span className="text-xs text-slate-500">
                    Last synced: {integration.connected ? '2 hours ago' : 'Never'}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              {integration.connected ? (
                <button
                  onClick={() => handleDisconnect(integration.key)}
                  disabled={loading[integration.key]}
                  className="px-4 py-2 border border-red-500 text-red-400 hover:bg-red-500/10 rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  {loading[integration.key] ? 'Processing...' : 'Disconnect'}
                </button>
              ) : (
                <button
                  onClick={() => handleConnect(integration.key)}
                  disabled={loading[integration.key]}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm transition-colors disabled:opacity-50"
                >
                  {loading[integration.key] ? 'Processing...' : 'Connect'}
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
