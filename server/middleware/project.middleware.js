import Project from '../models/Project.model.js'

export const attachProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      organization: req.org._id,
    })
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }
    req.project = project
    next()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const requireProjectMember = (req, res, next) => {
  const userId = req.user._id.toString()
  const isMember = req.project.members.some(
    m => m.toString() === userId
  )
  const isAdmin = req.user.role?.name === 'admin' ||
    (typeof req.user.role === 'object' &&
     req.user.role?.name === 'admin')
  if (!isMember && !isAdmin) {
    return res.status(403).json({
      message: 'You are not a member of this project',
    })
  }
  next()
}
