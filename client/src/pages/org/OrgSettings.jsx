import { useState } from 'react'
import { useOrg } from '../../hooks/useOrg'
import { useAuth } from '../../hooks/useAuth'
import MemberCard from '../../components/org/MemberCard'
import InviteMemberModal from '../../components/org/InviteMemberModal'
import AddMemberModal from '../../components/org/AddMemberModal'
import Spinner from '../../components/common/Spinner'

export default function OrgSettings() {
  const { org, members, loading, fetchOrg } = useOrg()
  const { isAdmin } = useAuth()
  const [showInvite, setShowInvite] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)

  if (loading) return <Spinner />

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-9 gap-4 text-left">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-[#1a202c]">{org?.name}</h1>
          <p className="text-[13px] text-[#4a5568] mt-1 font-medium">/{org?.slug}</p>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2.5">
            <button
              className="btn-secondary"
              onClick={() => setShowAddMember(true)}
            >
              Add member
            </button>
            <button
              className="btn-primary"
              onClick={() => setShowInvite(true)}
            >
              Invite member
            </button>
          </div>
        )}
      </div>

      <h2 className="text-[15px] font-semibold text-[#4a5568] mb-4">
        Members ({members?.length || 0})
      </h2>

      <div className="flex flex-col gap-2.5">
        {members.map(m => (
          <MemberCard key={m._id || m.id} member={m} />
        ))}
      </div>

      {showInvite && (
        <InviteMemberModal onClose={() => setShowInvite(false)} />
      )}

      {showAddMember && (
        <AddMemberModal 
          onClose={() => setShowAddMember(false)} 
          onAdded={fetchOrg}
        />
      )}
    </div>
  )
}
