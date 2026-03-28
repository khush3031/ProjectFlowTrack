import Issue       from '../models/Issue.model.js'
import Project     from '../models/Project.model.js'
import Comment     from '../models/Comment.model.js'
import ActivityLog from '../models/ActivityLog.model.js'
import {
  logActivity,
  logFieldChanges,
  ACTION_TYPES,
} from '../utils/activityLogger.js'
import { sanitizeIssueData } from '../utils/sanitize.js'

const ISSUE_POPULATE = [
  { path: 'createdBy', select: 'name email' },
  { path: 'assignee',  select: 'name email' },
]

export const IssueService = {

  async getAll({ projectId, orgId, userId, isAdmin, filters }) {
    const project = await Project.findOne({
      _id:          projectId,
      organization: orgId,
    }).lean()

    if (!project) {
      const err = new Error('Project not found in this organization')
      err.statusCode = 404
      throw err
    }

    if (!isAdmin) {
      const isMember = project.members.some(
        m => m.toString() === userId.toString()
      )
      if (!isMember) {
        const err = new Error(
          'You are not a member of this project'
        )
        err.statusCode = 403
        throw err
      }
    }

    const query = {
      project:      projectId,
      organization: orgId,
    }
    if (filters?.status)   query.status   = filters.status
    if (filters?.priority) query.priority = filters.priority
    if (filters?.assignee) query.assignee = filters.assignee

    return Issue.find(query)
      .populate(ISSUE_POPULATE)
      .sort({ createdAt: -1 })
      .lean()
  },

  async getById({ issueId, projectId, orgId }) {
    const issue = await Issue.findOne({
      _id:          issueId,
      project:      projectId,
      organization: orgId,
    })
      .populate(ISSUE_POPULATE)
      .lean()

    if (!issue) {
      const err = new Error('Issue not found')
      err.statusCode = 404
      throw err
    }
    return issue
  },

  async create({ data, projectId, orgId, userId }) {
    data = sanitizeIssueData(data)
    const issue = await Issue.create({
      ...data,
      project:      projectId,
      organization: orgId,
      createdBy:    userId,
    })

    const populated = await Issue.findById(issue._id)
      .populate(ISSUE_POPULATE)
      .lean()

    await logActivity({
      action:    ACTION_TYPES.ISSUE_CREATED,
      issueId:   issue._id,
      projectId,
      changedBy: userId,
    })

    return populated
  },

  async update({ issueId, projectId, orgId, updates, userId }) {
    const issue = await Issue.findOne({
      _id:          issueId,
      project:      projectId,
      organization: orgId,
    })
    if (!issue) {
      const err = new Error('Issue not found')
      err.statusCode = 404
      throw err
    }

    updates = sanitizeIssueData(updates)

    await logFieldChanges({
      issue,
      updates,
      userId,
      projectId,
    })

    Object.assign(issue, updates)
    await issue.save()

    return Issue.findById(issueId)
      .populate(ISSUE_POPULATE)
      .lean()
  },

  async remove({ issueId, projectId, orgId, userId }) {
    const issue = await Issue.findOne({
      _id:          issueId,
      project:      projectId,
      organization: orgId,
    })
    if (!issue) {
      const err = new Error('Issue not found')
      err.statusCode = 404
      throw err
    }

    await logActivity({
      action:    ACTION_TYPES.ISSUE_DELETED,
      issueId:   issue._id,
      projectId,
      changedBy: userId,
      newValue:  issue.title,
    })

    await Issue.findByIdAndDelete(issueId)
    await Comment.deleteMany({ issue: issueId })
    await ActivityLog.deleteMany({ issue: issueId })

    return { deleted: true }
  },

  async getProjectStats(projectId) {
    return Issue.aggregate([
      { $match: { project: projectId } },
      {
        $group: {
          _id:      '$status',
          count:    { $sum: 1 },
          highPri:  {
            $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] }
          },
        },
      },
      {
        $project: {
          status:   '$_id',
          count:    1,
          highPri:  1,
          _id:      0,
        },
      },
    ])
  },

  async getOverdueIssues({ orgId, userId, isAdmin }) {
    const now = new Date()
    const query = {
      organization: orgId,
      dueDate:      { $lt: now },
      status:       { $ne: 'done' },
    }
    // Note: Filtering by project members is complex in aggregation without lookups
    // For now we trust the organization scoping.

    return Issue.aggregate([
      { $match: query },
      {
        $lookup: {
          from:         'projects',
          localField:   'project',
          foreignField: '_id',
          as:           'projectData',
        },
      },
      { $unwind: '$projectData' },
      {
        $project: {
          title:       1,
          priority:    1,
          dueDate:     1,
          status:      1,
          projectName: '$projectData.name',
          projectId:   '$projectData._id',
          daysOverdue: {
            $ceil: {
              $divide: [
                { $subtract: [now, '$dueDate'] },
                86400000,
              ],
            },
          },
        },
      },
      { $sort: { daysOverdue: -1 } },
    ])
  },
}
