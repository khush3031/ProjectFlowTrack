import { useState, useEffect } from 'react'
import { getMyOrgApi } from '../../api/orgApi'
import { addProjectMemberApi, removeProjectMemberApi } from '../../api/projectApi'
import { toast } from '../common/Toast'
import Spinner from '../common/Spinner'

export default function ManageMembersModal({ projectId, currentMembers = [], creatorId, onClose, onUpdate }) {
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const { data } = await getMyOrgApi()
        setAllUsers(data.members || [])
      } catch (err) {
        toast.error('Failed to load organization users')
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const handleAdd = async (userId) => {
    try {
      setActionLoading(userId)
      await addProjectMemberApi(projectId, { userId })
      toast.success('Member added to project')
      onUpdate()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member')
    } finally {
      setActionLoading(null)
    }
  }

  const handleRemove = async (userId) => {
    try {
      setActionLoading(userId)
      await removeProjectMemberApi(projectId, userId)
      toast.success('Member removed from project')
      onUpdate()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member')
    } finally {
      setActionLoading(null)
    }
  }

  const memberIds = currentMembers.map(m => m._id || m.id)
  const nonMembers = allUsers.filter(u => !memberIds.includes(u.id || u._id))

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-5"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-lg shadow-xl flex flex-col max-h-[90vh]"
        style={{ animation: 'modalIn 0.25s cubic-bezier(0.16,1,0.3,1)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#e2e8f0]">
          <h2 className="text-xl font-semibold text-[#1a202c]">Project Members</h2>
          <button
            onClick={onClose}
            className="text-[#718096] hover:text-[#1a202c] hover:bg-[#edf2f7] rounded p-1 transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Spinner />
            </div>
          ) : (
            <>
              {/* Current members */}
              <section className="mb-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#718096] mb-3">
                  In Project ({currentMembers.length})
                </h3>
                <div className="flex flex-col gap-2">
                  {currentMembers.map(member => (
                    <div
                      key={member._id || member.id}
                      className="flex items-center justify-between px-3.5 py-2.5 bg-[#f7f9fc] rounded-md"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-[#1a202c]">{member.name}</span>
                        <span className="text-xs text-[#718096]">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {(member._id || member.id) === creatorId ? (
                          <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            Creator
                          </span>
                        ) : (
                          <button
                            className="px-3 py-1.5 text-xs font-medium text-danger border border-danger rounded-sm hover:bg-danger hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={actionLoading === (member._id || member.id)}
                            onClick={() => handleRemove(member._id || member.id)}
                          >
                            {actionLoading === (member._id || member.id) ? '...' : 'Remove'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Add from org */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#718096] mb-3">
                  Add from Organization
                </h3>
                <div className="flex flex-col gap-2">
                  {nonMembers.length === 0 ? (
                    <p className="text-center text-sm text-[#718096] italic py-5">
                      All organization members are in this project
                    </p>
                  ) : (
                    nonMembers.map(user => (
                      <div
                        key={user.id || user._id}
                        className="flex items-center justify-between px-3.5 py-2.5 bg-[#f7f9fc] rounded-md"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium text-[#1a202c]">{user.name}</span>
                          <span className="text-xs text-[#718096]">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className="px-3 py-1.5 text-xs font-medium bg-primary text-white rounded-sm hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={actionLoading === (user.id || user._id)}
                            onClick={() => handleAdd(user.id || user._id)}
                          >
                            {actionLoading === (user.id || user._id) ? 'Adding...' : 'Add'}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
