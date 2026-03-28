import { Router } from 'express';
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} from '../controllers/project.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/role.middleware.js';
import { attachOrg } from '../middleware/org.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  validateObjectId,
  enforceOrgScope,
} from '../middleware/integrity.middleware.js';
import {
  createProjectSchema,
  updateProjectSchema,
  addMemberSchema,
} from '../utils/validators/project.validator.js';
import issueRoutes from './issue.routes.js';

const router = Router();

router.use(verifyToken, attachOrg);

// Forward to issue routes
router.use('/:projectId/issues', issueRoutes);

router.get('/', getAllProjects);

router.post(
  '/',
  checkRole('admin'),
  validate(createProjectSchema),
  createProject
);

router.get(
  '/:id',
  validateObjectId('id'),
  enforceOrgScope,
  getProjectById
);

router.patch(
  '/:id',
  validateObjectId('id'),
  enforceOrgScope,
  checkRole('admin'),
  validate(updateProjectSchema),
  updateProject
);

router.delete(
  '/:id',
  validateObjectId('id'),
  enforceOrgScope,
  checkRole('admin'),
  deleteProject
);

router.post(
  '/:id/members',
  validateObjectId('id'),
  enforceOrgScope,
  checkRole('admin'),
  validate(addMemberSchema),
  addMember
);

router.delete(
  '/:id/members/:userId',
  validateObjectId('id'),
  validateObjectId('userId'),
  enforceOrgScope,
  checkRole('admin'),
  removeMember
);

export default router;
