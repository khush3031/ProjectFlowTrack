import ActivityLog from '../models/ActivityLog.model.js'
import Issue       from '../models/Issue.model.js'
import Project     from '../models/Project.model.js'

const paginate = (query, page, limit) => {
  const p = Math.max(1, parseInt(page) || 1)
  const l = Math.min(100, Math.max(1, parseInt(limit) || 20))
  return { skip: (p - 1) * l, limit: l, page: p }
}

const getOrgProjectIds = async (orgId) => {
  const projects = await Project.find({ organization: orgId }, '_id')
  return projects.map(p => p._id)
}

export const getIssueActivity = async (req, res, next) => {
  try {
    const issueExists = await Issue.findOne({
      _id: req.params.issueId,
      project: req.project._id,
      organization: req.org._id,
    })
    if (!issueExists) {
      return res.status(404).json({ message: 'Issue not found' })
    }

    const filter = { issue: req.params.issueId }
    if (req.query.action) filter.action = req.query.action

    const { skip, limit, page } = paginate(
      req.query, req.query.page, req.query.limit
    )

    const [logs, total] = await Promise.all([
      ActivityLog.find(filter)
        .populate('changedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ActivityLog.countDocuments(filter),
    ])

    return res.status(200).json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      }
    })
  } catch (err) {
    next(err)
  }
}

export const getProjectActivity = async (req, res, next) => {
  try {
    const filter = { project: req.project._id }
    if (req.query.action) filter.action = req.query.action
    if (req.query.issueId) filter.issue = req.query.issueId

    const { skip, limit, page } = paginate(
      req.query, req.query.page, req.query.limit
    )

    const [logs, total] = await Promise.all([
      ActivityLog.find(filter)
        .populate('changedBy', 'name email')
        .populate('issue', 'title')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ActivityLog.countDocuments(filter),
    ])

    return res.status(200).json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      }
    })
  } catch (err) {
    next(err)
  }
}

export const getMyActivity = async (req, res, next) => {
  try {
    const projectIds = await getOrgProjectIds(req.org._id)

    const filter = {
      changedBy: req.user._id,
      project: { $in: projectIds }
    }
    if (req.query.action) filter.action = req.query.action
    if (req.query.issueId) filter.issue = req.query.issueId

    const { skip, limit, page } = paginate(
      req.query, req.query.page, req.query.limit
    )

    const [logs, total] = await Promise.all([
      ActivityLog.find(filter)
        .populate('changedBy', 'name email')
        .populate('issue', 'title')
        .populate('project', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ActivityLog.countDocuments(filter),
    ])

    return res.status(200).json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      }
    })
  } catch (err) {
    next(err)
  }
}
