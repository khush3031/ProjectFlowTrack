import { Router } from 'express';
import {
  register,
  login,
  refresh,
  logout,
  getMe,
} from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import {
  loginSchema,
  registerSchema,
} from '../utils/validators/auth.validator.js';

const router = Router();

router.post(
  '/register',
  validate(registerSchema),
  asyncHandler(register)
);

router.post(
  '/login',
  validate(loginSchema),
  asyncHandler(login)
);

router.post('/refresh', asyncHandler(refresh));
router.post('/logout', asyncHandler(logout));
router.get('/me', verifyToken, asyncHandler(getMe));

export default router;
