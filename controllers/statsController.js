import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';

// GET /stats/users -> Number of users by role
const usersByRole = async (req, res, next) => {
  try {
    const data = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $project: { _id: 0, role: '$_id', count: 1 } }
    ]);
    res.json({ byRole: data });
  } catch (err) { next(err); }
};

// GET /stats/logins -> Count of successful vs failed login attempts
const loginStats = async (req, res, next) => {
  try {
    const data = await ActivityLog.aggregate([
      { $match: { actionType: { $in: ['login_success', 'login_failed'] } } },
      { $group: { _id: '$actionType', count: { $sum: 1 } } },
      { $project: { _id: 0, actionType: '$_id', count: 1 } }
    ]);
    const success = data.find(d => d.actionType === 'login_success')?.count || 0;
    const failed = data.find(d => d.actionType === 'login_failed')?.count || 0;
    res.json({ success, failed });
  } catch (err) { next(err); }
};

// GET /stats/active-users -> Users logged in within last 24 hours
const activeUsers = async (req, res, next) => {
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const data = await ActivityLog.aggregate([
      { $match: { actionType: 'login_success', createdAt: { $gte: since } } },
      { $group: { _id: '$user' } },
      { $count: 'count' }
    ]);
    const count = data[0]?.count || 0;
    res.json({ count, since });
  } catch (err) { next(err); }
};

export { usersByRole, loginStats, activeUsers };

