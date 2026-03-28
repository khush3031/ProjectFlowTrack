import { Router } from 'express';
import { assignRole } from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { checkRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { assignRoleSchema } from '../utils/validators/org.validator.js';

const router = Router();

router.patch('/:id/role', verifyToken, checkRole('admin'), validate(assignRoleSchema), assignRole);

export default router;
