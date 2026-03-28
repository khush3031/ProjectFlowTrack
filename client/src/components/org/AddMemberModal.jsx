import { useState, useEffect } from 'react'
import { getUnassignedUsersApi, addExistingUserApi } from '../../api/orgApi'
import { toast } from '../common/Toast'
import Spinner from '../common/Spinner'

export default function AddMemberModal({ onClose, onAdded }) {
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [addingId, setAddingId] = useState(null)

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers()
    }, 300)
    return () => clearTimeout(delayDebounce)
  }, [search])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data } = await getUnassignedUsersApi(search)
      setUsers(data.users || [])
    } catch (err) {
      toast.error('Failed to search users')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (userId) => {
    try {
      setAddingId(userId)
      await addExistingUserApi(userId)
      toast.success('User added to organization')
      onAdded()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add user')
    } finally {
      setAddingId(null)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-5"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-md shadow-xl flex flex-col max-h-[80vh] animate-[modalIn_0.25s_ease-out]"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'modalIn 0.25s cubic-bezier(0.16,1,0.3,1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e2e8f0]">
          <h2 className="text-lg font-semibold text-[#1a202c]">Add Member</h2>
          <button
            onClick={onClose}
            className="text-[#718096] hover:text-[#1a202c] hover:bg-[#edf2f7] rounded p-1 transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 px-6 py-5 overflow-y-auto">
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
            className="w-full bg-[#edf2f7] border border-[#e2e8f0] rounded-sm px-3.5 py-2.5 text-sm text-[#1a202c] placeholder-[#a0aec0] focus:border-primary focus:outline-none transition-colors"
          />

          <div className="flex flex-col min-h-[100px]">
            {loading ? (
              <div className="flex justify-center items-center py-6">
                <Spinner />
              </div>
            ) : users.length === 0 ? (
              <p className="text-center text-sm text-[#718096] py-6">
                {search ? 'No unassigned users found' : 'Start typing to search...'}
              </p>
            ) : (
              users.map(user => (
                <div
                  key={user.id || user._id}
                  className="flex items-center justify-between py-3 border-b border-[#e2e8f0] last:border-0"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-[#1a202c]">{user.name}</span>
                    <span className="text-xs text-[#718096]">{user.email}</span>
                  </div>
                  <button
                    className="px-3 py-1.5 text-xs font-semibold bg-primary text-white rounded-sm hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    onClick={() => handleAdd(user.id || user._id)}
                    disabled={addingId === (user.id || user._id)}
                  >
                    {addingId === (user.id || user._id) ? '...' : 'Add'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
