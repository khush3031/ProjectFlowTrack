import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const generateAccessToken = (userId, roleId) => {
  return jwt.sign({ userId, roleId }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = () => {
  return crypto.randomUUID();
};
