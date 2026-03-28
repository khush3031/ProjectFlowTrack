import { useState, useCallback } from 'react'
import {
  addCommentApi,
  editCommentApi,
  deleteCommentApi,
} from '../api/commentApi'
import { toast } from '../utils/toast'

export const useComments = (projectId, issueId, initialComments = []) => {
  const [comments, setComments]   = useState(initialComments)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const addComment = useCallback(async (body) => {
    setSubmitting(true)
    const tempId   = `temp_${Date.now()}`
    const optimistic = {
      _id:       tempId,
      body,
      author:    { name: 'You', email: '' },
      isEdited:  false,
      editedAt:  null,
      createdAt: new Date().toISOString(),
      _optimistic: true,
    }

    setComments(prev => [...prev, optimistic])

    try {
      const { data } = await addCommentApi(projectId, issueId, { body })
      setComments(prev =>
        prev.map(c => c._id === tempId ? data.comment : c)
      )
      toast.success('Comment posted')
      return true
    } catch (err) {
      setComments(prev => prev.filter(c => c._id !== tempId))
      toast.error(
        err.response?.data?.message || 'Failed to post comment'
      )
      return false
    } finally {
      setSubmitting(false)
    }
  }, [projectId, issueId])

  const editComment = useCallback(async (commentId, body) => {
    const original = comments.find(c => c._id === commentId)
    
    setComments(prev =>
      prev.map(c =>
        c._id === commentId
          ? { ...c, body, isEdited: true, editedAt: new Date().toISOString(), _optimistic: true }
          : c
      )
    )

    try {
      const { data } = await editCommentApi(
        projectId, issueId, commentId, { body }
      )
      setComments(prev =>
        prev.map(c => c._id === commentId ? data.comment : c)
      )
      setEditingId(null)
      toast.success('Comment updated')
      return true
    } catch (err) {
      setComments(prev =>
        prev.map(c => c._id === commentId ? original : c)
      )
      toast.error(
        err.response?.data?.message || 'Failed to update comment'
      )
      return false
    }
  }, [projectId, issueId, comments])

  const deleteComment = useCallback(async (commentId) => {
    const original = [...comments]
    setComments(prev => prev.filter(c => c._id !== commentId))

    try {
      await deleteCommentApi(projectId, issueId, commentId)
      toast.success('Comment deleted')
    } catch (err) {
      setComments(original)
      toast.error(
        err.response?.data?.message || 'Failed to delete comment'
      )
    }
  }, [projectId, issueId, comments])

  const syncComments = useCallback((newComments) => {
    setComments(newComments)
  }, [])

  return {
    comments,
    submitting,
    editingId,
    setEditingId,
    addComment,
    editComment,
    deleteComment,
    syncComments,
  }
}
