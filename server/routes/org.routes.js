import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/role.middleware.js';
import { attachOrg } from '../middleware/org.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createOrganization,
  getMyOrganization,
  inviteUser,
  getInvitationInfo,
  acceptInvitation,
  removeMember,
  getUnassignedUsers,
  addMemberDirectly,
} from '../controllers/org.controller.js';
import {
  createOrgSchema,
  inviteSchema,
  addDirectMemberSchema,
} from '../utils/validators/org.validator.js';

const router = Router();

router.post('/',           verifyToken, validate(createOrgSchema), createOrganization);
router.get('/me',          verifyToken, attachOrg, getMyOrganization);
router.get('/unassigned-users', verifyToken, attachOrg, checkRole('admin'), getUnassignedUsers);

router.post('/invite',     verifyToken, attachOrg, checkRole('admin'), validate(inviteSchema), inviteUser);
router.get('/invite/info/:token',   getInvitationInfo);
router.get('/invite/accept/:token', acceptInvitation);

router.post('/members/add-direct',  verifyToken, attachOrg, checkRole('admin'), validate(addDirectMemberSchema), addMemberDirectly);
router.delete('/members/:userId',   verifyToken, attachOrg, checkRole('admin'), removeMember);

export default router;
