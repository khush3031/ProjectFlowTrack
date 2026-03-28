import { useState } from 'react'
import { useOrg } from '../../hooks/useOrg'
import { addProjectMemberApi } from '../../api/projectApi'
import { toast } from '../../utils/toast'
import styles from './ProjectModal.module.css'

export default function AddMemberModal({ projectId, currentMembers, onClose, onAdded }) {
  const { members } = useOrg()
  const [search, setSearch]   = useState('')
  const [adding, setAdding]   = useState(null)

  const currentIds = new Set(currentMembers.map(m => m._id || m.id))

  const eligible = members.filter(m =>
    !currentIds.has(m._id || m.id) &&
    (m.name.toLowerCase().includes(search.toLowerCase()) ||
     m.email.toLowerCase().includes(search.toLowerCase()))
  )

  const handleAdd = async (userId) => {
    setAdding(userId)
    try {
      await addProjectMemberApi(projectId, { userId })
      toast.success('Member added')
      onAdded()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member')
    } finally {
      setAdding(null)
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add member</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        <div className={styles.memberScroll}>
          {eligible.length === 0 ? (
            <p className={styles.noResults}>
              {search ? 'No matching members' : 'All org members are already in this project'}
            </p>
          ) : (
            eligible.map(m => (
              <div key={m._id || m.id} className={styles.memberRow}>
                <div className={styles.avatar}>
                  {m.name?.charAt(0).toUpperCase()}
                </div>
                <div className={styles.memberInfo}>
                  <p className={styles.memberName}>{m.name}</p>
                  <p className={styles.memberEmail}>{m.email}</p>
                </div>
                <button
                  className={styles.addMemberBtn}
                  onClick={() => handleAdd(m._id || m.id)}
                  disabled={adding === (m._id || m.id)}
                >
                  {adding === (m._id || m.id) ? 'Adding...' : 'Add'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
