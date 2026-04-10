import { Router } from 'express';
import { assignRole, getMyProfile, updateMyProfile, getMyIssues } from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/role.middleware.js';
import { attachOrg } from '../middleware/org.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { assignRoleSchema } from '../utils/validators/org.validator.js';
import { updateProfileSchema } from '../utils/validators/user.validator.js';

const router = Router();

router.get('/me',         verifyToken, attachOrg, getMyProfile);
router.patch('/me',       verifyToken, attachOrg, validate(updateProfileSchema), updateMyProfile);
router.get('/me/issues',  verifyToken, attachOrg, getMyIssues);

router.patch('/:id/role', verifyToken, checkRole('admin'), validate(assignRoleSchema), assignRole);

export default router;
