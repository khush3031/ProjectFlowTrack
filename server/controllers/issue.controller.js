import { IssueService } from '../services/issue.service.js'

export const createIssue = async (req, res, next) => {
  try {
    const issue = await IssueService.create({
      data:      req.body,
      projectId: req.project._id,
      orgId:     req.org._id,
      userId:    req.user._id,
    })
    res.status(201).json({ message: 'Issue created', issue })
  } catch (err) {
    next(err)
  }
}

export const getIssues = async (req, res, next) => {
  try {
    const issues = await IssueService.getAll({
      projectId: req.project._id,
      orgId:     req.org._id,
      userId:    req.user._id,
      isAdmin:   req.user.role?.name === 'admin',
      filters:   req.query,
    })
    res.status(200).json({ issues })
  } catch (err) {
    next(err)
  }
}

export const getIssueById = async (req, res, next) => {
  try {
    const { CommentService } = await import('../services/comment.service.js')
    const [issue, comments] = await Promise.all([
      IssueService.getById({
        issueId:   req.params.issueId,
        projectId: req.project._id,
        orgId:     req.org._id,
      }),
      CommentService.getByIssue(req.params.issueId),
    ])
    res.status(200).json({ issue, comments })
  } catch (err) {
    next(err)
  }
}

export const updateIssue = async (req, res, next) => {
  try {
    const issue = await IssueService.update({
      issueId:   req.params.issueId,
      projectId: req.project._id,
      orgId:     req.org._id,
      updates:   req.body,
      userId:    req.user._id,
    })
    res.status(200).json({ message: 'Issue updated', issue })
  } catch (err) {
    next(err)
  }
}

export const deleteIssue = async (req, res, next) => {
  try {
    await IssueService.remove({
      issueId:   req.params.issueId,
      projectId: req.project._id,
      orgId:     req.org._id,
      userId:    req.user._id,
    })
    res.status(200).json({ message: 'Issue deleted' })
  } catch (err) {
    next(err)
  }
}

export const getProjectStats = async (req, res, next) => {
  try {
    const [issueStats, overdueIssues] = await Promise.all([
      IssueService.getProjectStats(req.project._id),
      IssueService.getOverdueIssues({
        orgId:   req.org._id,
        userId:  req.user._id,
        isAdmin: req.user.role?.name === 'admin',
      }),
    ])
    res.status(200).json({ issueStats, overdueIssues })
  } catch (err) {
    next(err)
  }
}
