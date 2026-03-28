import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { toast } from '../../utils/toast'

export default function Topbar({ onToggleSidebar }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast.info('Logged out')
    navigate('/login')
  }

  return (
    <header className="h-[58px] bg-white border-b border-[#e2e8f0] flex items-center justify-between px-4 md:px-7 shrink-0 w-full">
      <div className="flex items-center">
        <button 
          className="md:hidden p-2 text-[#4a5568] text-2xl -ml-2 mr-2" 
          onClick={onToggleSidebar}
        >
          ☰
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-[13px] text-[#4a5568] font-medium truncate max-w-[150px] md:max-w-none">
            {user?.email}
          </span>
          <span className="text-[10px] uppercase font-bold text-primary tracking-wider px-2 py-0.5 bg-[#edf2f7] border border-[#e2e8f0] rounded-full">
            {user?.role}
          </span>
        </div>
        
        <button
          onClick={handleLogout}
          className="border border-[#e2e8f0] text-[#4a5568] px-4 py-1.5 rounded-sm text-[13px] transition-all hover:border-danger hover:text-danger"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
