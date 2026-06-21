import { useState } from 'react'

export default function SettingsPage() {
  const [brandVoice, setBrandVoice] = useState({
    tone: '',
    writingStyle: '',
    targetAudience: '',
  })
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    slackErrors: false,
    weeklyDigest: true,
  })
  const [saved, setSaved] = useState(false)

  const handleSaveBrandVoice = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const teamMembers = [
    { name: 'Admin User', role: 'Owner' },
    { name: 'Jane Smith', role: 'Editor' },
    { name: 'Bob Lee', role: 'Viewer' },
  ]

  return (
    <div className="space-y-8 max-w-3xl">
      <section className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Brand Voice</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Tone</label>
            <input
              value={brandVoice.tone}
              onChange={(e) => setBrandVoice({ ...brandVoice, tone: e.target.value })}
              placeholder="Professional, friendly, authoritative"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Writing Style</label>
            <input
              value={brandVoice.writingStyle}
              onChange={(e) => setBrandVoice({ ...brandVoice, writingStyle: e.target.value })}
              placeholder="Conversational with data-driven insights"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Target Audience</label>
            <input
              value={brandVoice.targetAudience}
              onChange={(e) => setBrandVoice({ ...brandVoice, targetAudience: e.target.value })}
              placeholder="Marketing managers, 25-45"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            onClick={handleSaveBrandVoice}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm transition-colors"
          >
            {saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </section>

      <section className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Notifications</h3>
        <div className="space-y-4">
          <Toggle
            label="Email alerts for completed campaigns"
            checked={notifications.emailAlerts}
            onChange={() => toggleNotification('emailAlerts')}
          />
          <Toggle
            label="Slack notifications for agent errors"
            checked={notifications.slackErrors}
            onChange={() => toggleNotification('slackErrors')}
          />
          <Toggle
            label="Weekly analytics digest"
            checked={notifications.weeklyDigest}
            onChange={() => toggleNotification('weeklyDigest')}
          />
        </div>
      </section>

      <section className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-100">Team Members</h3>
          <button
            disabled
            title="Coming Soon"
            className="px-4 py-2 bg-slate-700 text-slate-500 rounded-lg text-sm cursor-not-allowed"
          >
            Invite Member
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400">
              <th className="text-left p-3 font-medium">Name</th>
              <th className="text-left p-3 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member) => (
              <tr key={member.name} className="border-b border-slate-700/50">
                <td className="p-3 text-slate-200">{member.name}</td>
                <td className="p-3 text-slate-400">{member.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-slate-300 text-sm">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-indigo-600' : 'bg-slate-600'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${checked ? 'translate-x-5' : ''}`}
        />
      </button>
    </label>
  )
}
