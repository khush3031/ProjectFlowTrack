import { Router } from 'express';
import {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  getProjectStats,
} from '../controllers/issue.controller.js';
import {
  addComment,
  editComment,
  removeComment,
  getCommentStats,
} from '../controllers/comment.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/role.middleware.js';
import { attachOrg } from '../middleware/org.middleware.js';
import { attachProject, requireProjectMember } from '../middleware/project.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  validateObjectId,
  enforceOrgScope,
  enforceAssigneeIsMember,
  enforceIssueProjectScope,
  enforceCommentOwnership,
  enforceEditCommentOwnership,
  enforceProjectMemberUpdate,
} from '../middleware/integrity.middleware.js';
import {
  createIssueSchema,
  updateIssueSchema,
  commentSchema,
} from '../utils/validators/issue.validator.js';

const router = Router({ mergeParams: true });

router.use(verifyToken, attachOrg, attachProject, requireProjectMember);

router.post(
  '/',
  enforceOrgScope,
  validate(createIssueSchema),
  enforceAssigneeIsMember,
  createIssue
);

router.get('/', enforceOrgScope, getIssues);

router.get('/stats', getProjectStats);
router.get('/comment-stats', getCommentStats);

router.get(
  '/:issueId',
  validateObjectId('issueId'),
  enforceOrgScope,
  enforceIssueProjectScope,
  getIssueById
);

router.patch(
  '/:issueId',
  validateObjectId('issueId'),
  enforceOrgScope,
  enforceIssueProjectScope,
  enforceProjectMemberUpdate,
  validate(updateIssueSchema),
  enforceAssigneeIsMember,
  updateIssue
);

router.delete(
  '/:issueId',
  validateObjectId('issueId'),
  enforceOrgScope,
  enforceIssueProjectScope,
  checkRole('admin'),
  deleteIssue
);

router.post(
  '/:issueId/comments',
  validateObjectId('issueId'),
  enforceOrgScope,
  enforceIssueProjectScope,
  validate(commentSchema),
  addComment
);

router.patch(
  '/:issueId/comments/:commentId',
  validateObjectId('issueId'),
  validateObjectId('commentId'),
  enforceOrgScope,
  enforceIssueProjectScope,
  enforceEditCommentOwnership,
  validate(commentSchema),
  editComment
);

router.delete(
  '/:issueId/comments/:commentId',
  validateObjectId('issueId'),
  validateObjectId('commentId'),
  enforceOrgScope,
  enforceIssueProjectScope,
  enforceCommentOwnership,
  removeComment
);

export default router;
