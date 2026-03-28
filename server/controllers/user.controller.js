import User from '../models/User.model.js';
import Role from '../models/Role.model.js';

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
