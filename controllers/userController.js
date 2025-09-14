import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import mongoose from 'mongoose';

const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
};

// Admin only
const listUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json({ items: users });
  } catch (err) { next(err); }
};

// Admin only: change role
const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });
    if (!['user', 'manager', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const oldRole = user.role;
    user.role = role;
    await user.save();
    try {
      await ActivityLog.create({
        user: req.user.id,
        actionType: 'update_role',
        meta: { targetUser: user._id, oldRole, newRole: role },
        ip: req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress,
        userAgent: req.get('User-Agent') || ''
      });
    } catch {}
    res.json({ message: 'Role updated', id: user._id, role: user.role });
  } catch (err) { next(err); }
};

// Admin only: delete user
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    try {
      await ActivityLog.create({
        user: req.user.id,
        actionType: 'delete_user',
        meta: { targetUser: id },
        ip: req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress,
        userAgent: req.get('User-Agent') || ''
      });
    } catch {}
    res.json({ message: 'User deleted' });
  } catch (err) { next(err); }
};

export { me, listUsers, updateUserRole, deleteUser };

