import User from '../models/User.model.js';
import Role from '../models/Role.model.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens.js';
import { Response } from '../utils/response.js';
import { Errors } from '../utils/AppError.js';

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
