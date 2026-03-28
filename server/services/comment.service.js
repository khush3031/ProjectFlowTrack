import Comment     from '../models/Comment.model.js'
import Issue       from '../models/Issue.model.js'
import {
  logActivity,
  ACTION_TYPES,
} from '../utils/activityLogger.js'
import { sanitizeCommentBody } from '../utils/sanitize.js'

const COMMENT_POPULATE = [
  { path: 'author', select: 'name email' },
]

export const CommentService = {

  async getByIssue(issueId) {
    return Comment.find({ issue: issueId })
      .populate(COMMENT_POPULATE)
      .sort({ createdAt: 1 })
      .lean()
  },

  async create({ body, issueId, authorId, projectId }) {
    body = sanitizeCommentBody(body)
    const comment = await Comment.create({
      body,
      issue: issueId,
      author: authorId,
    })
    const populated = await Comment.findById(comment._id)
      .populate(COMMENT_POPULATE)
      .lean()

    await logActivity({
      action:    ACTION_TYPES.COMMENT_ADDED,
      issueId,
      projectId,
      changedBy: authorId,
      newValue:  body.slice(0, 120),
    })

    return populated
  },

  async update({ commentId, body, userId, isAdmin, projectId }) {
    const comment = await Comment.findById(commentId)
    if (!comment) {
      const err = new Error('Comment not found')
      err.statusCode = 404
      throw err
    }

    const isOwner = comment.author.toString() === userId.toString()
    if (!isOwner) {
      const err = new Error('You can only edit your own comments')
      err.statusCode = 403
      throw err
    }

    body = sanitizeCommentBody(body)
    const previousBody = comment.body
    comment.body     = body
    comment.isEdited = true
    comment.editedAt = new Date()
    await comment.save()

    const populated = await Comment.findById(commentId)
      .populate(COMMENT_POPULATE)
      .lean()

    await logActivity({
      action:        ACTION_TYPES.COMMENT_EDITED,
      issueId:       comment.issue,
      projectId,
      changedBy:     userId,
      previousValue: previousBody.slice(0, 120),
      newValue:      body.slice(0, 120),
    })

    return populated
  },

  async remove({ commentId, userId, isAdmin, projectId }) {
    const comment = await Comment.findById(commentId)
    if (!comment) {
      const err = new Error('Comment not found')
      err.statusCode = 404
      throw err
    }

    const isOwner = comment.author.toString() === userId.toString()
    if (!isOwner && !isAdmin) {
      const err = new Error('You can only delete your own comments')
      err.statusCode = 403
      throw err
    }

    const issueId = comment.issue
    await Comment.findByIdAndDelete(commentId)

    await logActivity({
      action:    ACTION_TYPES.COMMENT_DELETED,
      issueId,
      projectId,
      changedBy: userId,
    })

    return { deleted: true }
  },

  async getCommentStats(projectId) {
    return Comment.aggregate([
      {
        $lookup: {
          from:         'issues',
          localField:   'issue',
          foreignField: '_id',
          as:           'issueData',
        },
      },
      { $unwind: '$issueData' },
      {
        $match: {
          'issueData.project': projectId,
        },
      },
      {
        $group: {
          _id:          '$issueData._id',
          issueTitle:   { $first: '$issueData.title' },
          commentCount: { $sum: 1 },
          lastComment:  { $max: '$createdAt' },
        },
      },
      { $sort: { commentCount: -1 } },
      { $limit: 10 },
    ])
  },
}
