import Project     from '../models/Project.model.js'
import Issue       from '../models/Issue.model.js'
import Comment     from '../models/Comment.model.js'
import mongoose    from 'mongoose'

export const validateObjectId = (paramName) =>
  (req, res, next) => {
    const id = req.params[paramName]
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName} format`,
        code: 'INVALID_ID',
      })
    }
    next()
  }

export const enforceOrgScope = async (req, res, next) => {
  try {
    if (!req.org) {
      return res.status(403).json({
        success: false,
        message: 'Organization context required',
        code: 'NO_ORG_CONTEXT',
      })
    }
    if (!req.user.organization) {
      return res.status(403).json({
        success: false,
        message: 'You must belong to an organization',
        code: 'USER_NOT_IN_ORG',
      })
    }
    if (
      req.user.organization.toString() !==
      req.org._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Cross-organization access denied',
        code: 'CROSS_ORG_ACCESS',
      })
    }
    next()
  } catch (err) {
    next(err)
  }
}

export const enforceAssigneeIsMember = async (req, res, next) => {
  try {
    const assigneeId = req.body.assignee
    if (!assigneeId) return next()
    if (assigneeId === null || assigneeId === '') return next()

    if (!mongoose.Types.ObjectId.isValid(assigneeId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid assignee ID format',
        code: 'INVALID_ASSIGNEE_ID',
      })
    }

    const project = req.project
    const isMember = project.members.some(
      m => m.toString() === assigneeId.toString()
    )
    if (!isMember) {
      return res.status(400).json({
        success: false,
        message: 'Assignee must be a member of this project',
        code: 'ASSIGNEE_NOT_PROJECT_MEMBER',
      })
    }
    next()
  } catch (err) {
    next(err)
  }
}

export const enforceIssueProjectScope = async (req, res, next) => {
  try {
    const issueId = req.params.issueId
    if (!issueId) return next()

    const issue = await Issue.findOne({
      _id:          issueId,
      project:      req.project._id,
      organization: req.org._id,
    }).lean()

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found in this project',
        code: 'ISSUE_NOT_IN_PROJECT',
      })
    }
    req.issue = issue
    next()
  } catch (err) {
    next(err)
  }
}

export const enforceCommentOwnership = async (req, res, next) => {
  try {
    const comment = await Comment.findById(
      req.params.commentId
    ).lean()

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
        code: 'COMMENT_NOT_FOUND',
      })
    }

    const isOwner =
      comment.author.toString() === req.user._id.toString()
    const isAdmin = req.user.role?.name === 'admin'

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You can only modify your own comments',
        code: 'COMMENT_NOT_OWNER',
      })
    }

    req.comment = comment
    next()
  } catch (err) {
    next(err)
  }
}

export const enforceEditCommentOwnership = async (req, res, next) => {
  try {
    const comment = await Comment.findById(
      req.params.commentId
    ).lean()

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
        code: 'COMMENT_NOT_FOUND',
      })
    }

    const isOwner =
      comment.author.toString() === req.user._id.toString()

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own comments',
        code: 'COMMENT_EDIT_NOT_OWNER',
      })
    }

    req.comment = comment
    next()
  } catch (err) {
    next(err)
  }
}

export const enforceProjectMemberUpdate = (req, res, next) => {
  const userId = req.user._id.toString()
  const isAdmin = req.user.role?.name === 'admin'
  const isMember = req.project.members.some(
    m => m.toString() === userId
  )
  if (!isMember && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Only project members can update issues',
      code: 'NOT_PROJECT_MEMBER',
    })
  }
  next()
}
