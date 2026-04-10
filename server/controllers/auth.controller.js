import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.model.js';
import Role from '../models/Role.model.js';
import OTP  from '../models/OTP.model.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens.js';
import { Response } from '../utils/response.js';
import { Errors } from '../utils/AppError.js';
import { sendEmail, EMAIL_TYPES } from '../utils/email/sendEmail.js';

const OTP_EXPIRY_MINUTES = 10
const MAX_OTP_ATTEMPTS   = 5

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw Errors.emailInUse();

  const memberRole = await Role.findOne({ name: 'member' });
  if (!memberRole) throw Errors.internal('Default role not configured');

  const user = await User.create({
    name,
    email,
    password,
    role: memberRole._id,
  });

  Response.created(res, {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    }
  }, 'Account created successfully');
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).populate('role');
  if (!user) throw Errors.invalidCredentials();

  const isMatch = await user.comparePassword(password);
  console.log("isMatch : ", isMatch, password)
  if (!isMatch) throw Errors.invalidCredentials();

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  Response.success(res, {
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role.name,
      organization: user.organization,
    }
  }, 'Welcome back');
};

export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) throw Errors.unauthorized('Refresh token missing');

  const user = await User.findOne({ refreshToken }).populate('role');
  if (!user) throw Errors.unauthorized('Session expired');

  const accessToken = generateAccessToken(user);
  Response.success(res, { accessToken });
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    const user = await User.findOne({ refreshToken });
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
  }

  res.clearCookie('refreshToken');
  Response.success(res, {}, 'Logged out successfully');
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body

  // Always respond 200 — never reveal if email exists (security)
  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user) {
    return Response.success(res, {}, 'If that email is registered, an OTP has been sent')
  }

  // Invalidate any previous unused OTPs for this email
  await OTP.deleteMany({ email: email.toLowerCase() })

  // Generate 6-digit OTP
  const otp     = String(Math.floor(100000 + crypto.randomInt(900000))).padStart(6, '0')
  const otpHash = await bcrypt.hash(otp, 10)

  await OTP.create({
    email:     email.toLowerCase(),
    otpHash,
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
  })

  sendEmail({
    type: EMAIL_TYPES.OTP,
    to:   user.email,
    data: { otp, userName: user.name, expiryMinutes: OTP_EXPIRY_MINUTES },
  })

  return Response.success(res, {}, 'If that email is registered, an OTP has been sent')
}

export const verifyOtpAndReset = async (req, res) => {
  const { email, otp, newPassword } = req.body

  const record = await OTP.findOne({
    email:  email.toLowerCase(),
    used:   false,
    expiresAt: { $gt: new Date() },
  })

  if (!record) {
    throw Errors.badRequest('OTP is invalid or has expired')
  }

  // Increment attempts to prevent brute-force
  record.attempts += 1
  await record.save()

  if (record.attempts > MAX_OTP_ATTEMPTS) {
    await OTP.deleteOne({ _id: record._id })
    throw Errors.badRequest('Too many incorrect attempts — request a new OTP')
  }

  const isValid = await bcrypt.compare(otp, record.otpHash)
  if (!isValid) {
    const remaining = MAX_OTP_ATTEMPTS - record.attempts
    throw Errors.badRequest(
      remaining > 0
        ? `Incorrect OTP — ${remaining} attempt${remaining === 1 ? '' : 's'} remaining`
        : 'Too many incorrect attempts — request a new OTP'
    )
  }

  // Mark OTP as used
  record.used = true
  await record.save()

  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user) throw Errors.notFound('User')

  // Hash new password and clear ALL sessions
  user.password = newPassword
  user.refreshToken = null
  await user.save()

  // Clear the cookie on current device too
  res.clearCookie('refreshToken')

  return Response.success(res, {}, 'Password reset successfully — please sign in again')
}

export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate('role')
    .populate('organization');
  
  if (!user) throw Errors.notFound('User');

  Response.success(res, {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role.name,
      organization: user.organization,
    }
  });
};
