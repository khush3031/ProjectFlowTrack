import { Router } from 'express';
import {
  register,
  login,
  refresh,
  logout,
  getMe,
  forgotPassword,
  verifyOtpAndReset,
} from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
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

router.post('/forgot-password', validate(forgotPasswordSchema), asyncHandler(forgotPassword));
router.post('/reset-password',  validate(verifyOtpSchema),       asyncHandler(verifyOtpAndReset));

export default router;
