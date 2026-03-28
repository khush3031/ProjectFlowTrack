import { useAuth } from '../../hooks/useAuth'
import { removeMemberApi } from '../../api/orgApi'
import { useOrg } from '../../hooks/useOrg'
import { toast } from '../../utils/toast'

export default function MemberCard({ member }) {
  const { user, isAdmin } = useAuth()
  const { fetchOrg } = useOrg()
  const isSelf = member._id === user?._id || member.id === user?.id

  const handleRemove = async () => {
    if (!confirm(`Remove ${member.name} from the organization?`)) return
    try {
      await removeMemberApi(member._id || member.id)
      toast.success('Member removed')
      fetchOrg()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member')
    }
  }

  const roleColors = {
    admin: 'bg-primary/10 text-primary',
    member: 'bg-[#edf2f7] text-[#4a5568]',
  }

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-lg p-3.5 flex items-center gap-4 group transition-all hover:border-primary/30 shadow-sm">
      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
        {member.name?.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[14px] text-[#1a202c] truncate">{member.name}</p>
        <p className="text-[12px] text-[#a0aec0] truncate">{member.email}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${roleColors[member.role?.name] || roleColors.member}`}>
          {member.role?.name}
        </span>
        {isAdmin && !isSelf && (
          <button 
            className="text-[12px] font-medium text-[#a0aec0] hover:text-danger hover:underline opacity-0 group-hover:opacity-100 transition-opacity" 
            onClick={handleRemove}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  )
}
