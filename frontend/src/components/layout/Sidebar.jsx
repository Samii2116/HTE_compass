import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Bot,
  FileText,
  BarChart3,
  Settings,
  Compass,
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/assistant', label: 'AI Assistant', icon: Bot },
  { to: '/documents', label: 'Documents', icon: FileText },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-surface-raised">
      <div className="flex items-center gap-3 border-b border-border px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-accent shadow-glow">
          <Compass className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-100">HTE Compass</h1>
          <p className="text-xs text-muted">Administrative Assistant</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-subtle border border-accent-blue/20 text-slate-100 shadow-glow'
                  : 'text-muted hover:bg-surface-hover hover:text-slate-200',
              ].join(' ')
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {item.label}
          </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="rounded-lg bg-gradient-subtle p-3">
          <p className="text-xs font-medium text-slate-300">Higher & Technical Education</p>
          <p className="mt-0.5 text-xs text-muted">Department Portal</p>
        </div>
      </div>
    </aside>
  )
}
