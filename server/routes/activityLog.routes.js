import { Router } from 'express'
import {
  getIssueActivity,
  getProjectActivity,
  getMyActivity,
} from '../controllers/activityLog.controller.js'
import { verifyToken }          from '../middleware/auth.middleware.js'
import { attachOrg }            from '../middleware/org.middleware.js'
import { attachProject, requireProjectMember }
  from '../middleware/project.middleware.js'

const router = Router()

router.get(
  '/me',
  verifyToken, attachOrg,
  getMyActivity
)

router.get(
  '/projects/:projectId',
  verifyToken, attachOrg, attachProject, requireProjectMember,
  getProjectActivity
)

router.get(
  '/projects/:projectId/issues/:issueId',
  verifyToken, attachOrg, attachProject, requireProjectMember,
  getIssueActivity
)

export default router
