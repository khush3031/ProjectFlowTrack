import { NavLink } from 'react-router-dom'
import { useOrg } from '../../hooks/useOrg'
import { useAuth } from '../../hooks/useAuth'

export default function Sidebar({ isOpen, onClose }) {
  const { org } = useOrg()
  const { isAdmin } = useAuth()

  const navLinks = [
    { to: '/dashboard',  label: 'Dashboard',    icon: '📊' },
    { to: '/my-issues',  label: 'My Issues',     icon: '✅' },
    { to: '/projects',   label: 'Projects',      icon: '📁' },
    { to: '/org/settings', label: 'Organization', icon: '🏢' },
  ]

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-[100] w-64 bg-white border-r border-[#e2e8f0] flex flex-col py-6 transition-transform duration-300 ease-in-out md:translate-x-0 md:static
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="flex items-center gap-3 px-5 pb-6 border-b border-[#e2e8f0]">
        <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center font-bold text-[13px] text-white shrink-0">TF</div>
        <span className="font-semibold text-lg">TrackFlow</span>
        <button className="md:hidden ml-auto p-2 text-gray-400" onClick={onClose}>✕</button>
      </div>

      {org && (
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#e2e8f0]">
          <div className="w-2 h-2 rounded-full bg-success shrink-0" />
          <span className="text-[13px] text-[#4a5568] truncate font-medium">{org.name}</span>
        </div>
      )}

      <nav className="flex flex-col gap-0.5 px-2.5 py-4 flex-1">
        {navLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onClose}
            className={({ isActive }) => `
              flex items-center px-3.5 py-2.5 rounded-sm text-[14px] transition-colors
              ${isActive
                ? 'bg-[#edf2f7] text-[#1a202c] font-medium'
                : 'text-[#4a5568] hover:bg-[#f8fafc] hover:text-[#1a202c]'}
            `}
          >
            <span className="mr-3 text-lg leading-none">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
