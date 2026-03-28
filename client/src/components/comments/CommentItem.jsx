import { useState } from 'react'
import { formatTimeAgo, formatFullDate } from '../../utils/activityHelpers'
import styles from './CommentItem.module.css'

export default function CommentItem({
  comment,
  onEdit,
  onDelete,
  editingId,
  setEditingId,
  currentUserId,
  isAdmin,
}) {
  const [editBody, setEditBody] = useState(comment.body)
  const [saving, setSaving]     = useState(false)

  const isOwner  = comment.author?._id === currentUserId ||
                   comment.author?.id  === currentUserId
  const isEditing = editingId === comment._id
  const canEdit  = isOwner && !comment._optimistic
  const canDelete = (isOwner || isAdmin) && !comment._optimistic

  const handleSave = async () => {
    if (!editBody.trim() || editBody === comment.body) {
      setEditingId(null)
      return
    }
    setSaving(true)
    const ok = await onEdit(comment._id, editBody.trim())
    if (!ok) setEditBody(comment.body)
    setSaving(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSave()
    if (e.key === 'Escape') { setEditingId(null); setEditBody(comment.body) }
  }

  return (
    <div
      className={`${styles.comment} ${
        comment._optimistic ? styles.optimistic : ''
      }`}
    >
      <div className={styles.header}>
        <div className={styles.authorRow}>
          <div className={styles.avatar}>
            {comment.author?.name?.charAt(0).toUpperCase() ?? '?'}
          </div>
          <div className={styles.meta}>
            <span className={styles.name}>{comment.author?.name}</span>
            <span
              className={styles.time}
              title={formatFullDate(comment.createdAt)}
            >
              {formatTimeAgo(comment.createdAt)}
            </span>
          </div>
          {comment.isEdited && (
            <span className={styles.editedBadge}>edited</span>
          )}
          {comment._optimistic && (
            <span className={styles.sendingBadge}>sending…</span>
          )}
        </div>

        {!comment._optimistic && (
          <div className={styles.actions}>
            {canEdit && (
              <button
                className={styles.actionBtn}
                onClick={() => {
                  setEditingId(comment._id)
                  setEditBody(comment.body)
                }}
                title="Edit comment"
              >
                Edit
              </button>
            )}
            {canDelete && (
              <button
                className={`${styles.actionBtn} ${styles.dangerBtn}`}
                onClick={() => onDelete(comment._id)}
                title="Delete comment"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        <div className={styles.editForm}>
          <textarea
            className={styles.editInput}
            value={editBody}
            onChange={e => setEditBody(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            maxLength={1000}
            autoFocus
          />
          <div className={styles.editFooter}>
            <span className={styles.editHint}>
              Ctrl+Enter to save · Esc to cancel
            </span>
            <div className={styles.editActions}>
              <button
                className={styles.cancelEditBtn}
                onClick={() => {
                  setEditingId(null)
                  setEditBody(comment.body)
                }}
              >
                Cancel
              </button>
              <button
                className={styles.saveBtn}
                onClick={handleSave}
                disabled={saving || !editBody.trim()}
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className={styles.body}>{comment.body}</p>
      )}
    </div>
  )
}
