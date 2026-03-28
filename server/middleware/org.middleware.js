import User from '../models/User.model.js';

export const attachOrg = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('organization');
    if (!user.organization) {
      return res.status(403).json({ message: 'You are not part of any organization' });
    }
    req.org = user.organization;
    next();
  } catch (error) {
    next(error);
  }
};

export const scopeToOrg = (req) => ({
  organization: req.org._id
});
