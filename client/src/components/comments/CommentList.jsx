import { useState } from 'react'
import { useComments }  from '../../hooks/useComments'
import { useAuth }      from '../../hooks/useAuth'
import CommentItem      from './CommentItem'
import styles           from './CommentList.module.css'

export default function CommentList({
  projectId,
  issueId,
  initialComments = [],
}) {
  const { user, isAdmin }   = useAuth()
  const [body, setBody]     = useState('')

  const {
    comments,
    submitting,
    editingId,
    setEditingId,
    addComment,
    editComment,
    deleteComment,
  } = useComments(projectId, issueId, initialComments)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!body.trim()) return
    const ok = await addComment(body.trim())
    if (ok) setBody('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e)
    }
  }

  return (
    <div className={styles.section}>
      <h3 className={styles.heading}>
        Comments
        <span className={styles.count}>{comments.length}</span>
      </h3>

      <div className={styles.list}>
        {comments.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>No comments yet</p>
            <p className={styles.emptySub}>
              Be the first to leave a comment
            </p>
          </div>
        ) : (
          comments.map(c => (
            <CommentItem
              key={c._id}
              comment={c}
              projectId={projectId}
              issueId={issueId}
              onEdit={editComment}
              onDelete={deleteComment}
              editingId={editingId}
              setEditingId={setEditingId}
              currentUserId={user?._id || user?.id}
              isAdmin={isAdmin}
            />
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputWrap}>
          <div className={styles.authorDot}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className={styles.textareaWrap}>
            <textarea
              className={styles.textarea}
              placeholder="Add a comment… (Ctrl+Enter to post)"
              value={body}
              onChange={e => setBody(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={3}
              maxLength={1000}
              disabled={submitting}
            />
            <div className={styles.formFooter}>
              <span className={styles.charCount}>
                {body.length}/1000
              </span>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={submitting || !body.trim()}
              >
                {submitting ? 'Posting…' : 'Post comment'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
