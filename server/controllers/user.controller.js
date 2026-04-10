import bcrypt from 'bcryptjs';
import User from '../models/User.model.js';
import Role from '../models/Role.model.js';
import Issue from '../models/Issue.model.js';

export const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('role', 'name').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role?.name },
    });
  } catch (err) {
    next(err);
  }
};

export const updateMyProfile = async (req, res, next) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;

    let passwordChanged = false
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to set a new password' });
      }
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) return res.status(400).json({ message: 'Current password is incorrect' });
      user.password = await bcrypt.hash(newPassword, 12);
      passwordChanged = true
    }

    // Invalidate ALL sessions on password change — forces re-login on every device
    if (passwordChanged) {
      user.refreshToken = null
      res.clearCookie('refreshToken')
    }

    await user.save();
    await user.populate('role', 'name');

    return res.status(200).json({
      message: passwordChanged ? 'Password changed — please sign in again' : 'Profile updated',
      user: { id: user._id, name: user.name, email: user.email, role: user.role?.name },
      sessionInvalidated: passwordChanged,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyIssues = async (req, res, next) => {
  try {
    const query = {
      assignee: req.user._id,
      organization: req.org._id,
    };
    if (req.query.status) query.status = req.query.status;

    const issues = await Issue.find(query)
      .populate({ path: 'project', select: 'name _id' })
      .populate({ path: 'createdBy', select: 'name email' })
      .sort({ dueDate: 1, createdAt: -1 })
      .lean();

    return res.status(200).json({ issues });
  } catch (err) {
    next(err);
  }
};

export const assignRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role: roleName } = req.body;

    const role = await Role.findOne({ name: roleName });
    if (!role) {
      return res.status(400).json({ message: `Role '${roleName}' does not exist` });
    }

    const user = await User.findByIdAndUpdate(id, { role: role._id }, { new: true }).populate('role');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'Role updated',
      user: { id: user._id, name: user.name, email: user.email, role: user.role.name },
    });
  } catch (err) {
    next(err);
  }
};
