import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  Bot,
  FileText,
  BarChart2,
  Plug,
  Settings,
  LogOut
} from 'lucide-react'
import useStore from '../store'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/calendar', label: 'Editorial Calendar', icon: Calendar },
  { to: '/agents', label: 'Agent Control', icon: Bot },
  { to: '/content', label: 'Content Library', icon: FileText },
  { to: '/analytics', label: 'Analytics', icon: BarChart2 },
  { to: '/integrations', label: 'Integrations', icon: Plug },
  { to: '/settings', label: 'Settings', icon: Settings },
]

const pageTitles = {
  '/': 'Dashboard',
  '/calendar': 'Editorial Calendar',
  '/agents': 'Agent Control',
  '/content': 'Content Library',
  '/analytics': 'Analytics',
  '/integrations': 'Integrations',
  '/settings': 'Settings',
}

export default function Layout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const pageTitle = pageTitles[location.pathname] || 'AI Marketing Automation'

  return (
    <div className="min-h-screen bg-slate-900">
      <aside className="fixed left-0 top-0 h-full w-60 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-5 border-b border-slate-700">
          <h1 className="text-lg font-bold text-indigo-400">🤖 AI Marketing Automation</h1>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="ml-60 min-h-screen bg-slate-900">
        <header className="sticky top-0 z-10 bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-100">{pageTitle}</h2>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm">{user?.name || 'User'}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-400 hover:text-white border border-slate-600 rounded-lg hover:border-slate-500 transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
