import { CommentService } from '../services/comment.service.js'

export const addComment = async (req, res, next) => {
  try {
    const comment = await CommentService.create({
      body:      req.body.body,
      issueId:   req.params.issueId,
      authorId:  req.user._id,
      projectId: req.project._id,
    })
    res.status(201).json({ message: 'Comment added', comment })
  } catch (err) {
    next(err)
  }
}

export const editComment = async (req, res, next) => {
  try {
    const comment = await CommentService.update({
      commentId: req.params.commentId,
      body:      req.body.body,
      userId:    req.user._id,
      isAdmin:   req.user.role?.name === 'admin',
      projectId: req.project._id,
    })
    res.status(200).json({ message: 'Comment updated', comment })
  } catch (err) {
    next(err)
  }
}

export const removeComment = async (req, res, next) => {
  try {
    await CommentService.remove({
      commentId: req.params.commentId,
      userId:    req.user._id,
      isAdmin:   req.user.role?.name === 'admin',
      projectId: req.project._id,
    })
    res.status(200).json({ message: 'Comment deleted' })
  } catch (err) {
    next(err)
  }
}

export const getCommentStats = async (req, res, next) => {
  try {
    const stats = await CommentService.getCommentStats(req.project._id)
    res.status(200).json({ stats })
  } catch (err) {
    next(err)
  }
}
