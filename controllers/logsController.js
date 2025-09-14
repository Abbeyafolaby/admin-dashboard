import ActivityLog from '../models/ActivityLog.js';
import mongoose from 'mongoose';

const parseFilters = (req) => {
  const { user, actionType, from, to } = req.query;
  const filter = {};
  if (user && mongoose.isValidObjectId(user)) filter.user = new mongoose.Types.ObjectId(user);
  if (actionType) filter.actionType = actionType;
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }
  return filter;
};

const requireManagerFilters = (req) => {
  const { user, from, to, actionType } = req.query;
  return Boolean(user || from || to || actionType);
};

// GET /logs
const listLogs = async (req, res, next) => {
  try {
    // Managers must apply at least one filter to view logs
    if (req.user?.role === 'manager' && !requireManagerFilters(req)) {
      return res.status(403).json({ message: 'Managers must filter logs by user/date/actionType' });
    }
    const filter = parseFilters(req);
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '50', 10), 1), req.user?.role === 'manager' ? 200 : 500);
    const skip = (page - 1) * limit;
    const sort = { createdAt: -1 };

    const [items, total] = await Promise.all([
      ActivityLog.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      ActivityLog.countDocuments(filter)
    ]);
    res.json({ items, page, limit, total });
  } catch (err) { next(err); }
};

// DELETE /logs/:id (admin only)
const deleteLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });
    const deleted = await ActivityLog.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Log not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};

// DELETE /logs (admin only) optional filtered bulk
const deleteLogsBulk = async (req, res, next) => {
  try {
    const filter = parseFilters(req);
    const result = await ActivityLog.deleteMany(filter);
    res.json({ deletedCount: result.deletedCount });
  } catch (err) { next(err); }
};

// GET /logs/export?format=csv|json
const exportLogs = async (req, res, next) => {
  try {
    if (req.user?.role === 'manager' && !requireManagerFilters(req)) {
      return res.status(403).json({ message: 'Managers must filter logs by user/date/actionType' });
    }
    const filter = parseFilters(req);
    const limit = Math.min(parseInt(req.query.limit || '1000', 10), req.user?.role === 'manager' ? 2000 : 10000);
    const items = await ActivityLog.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
    const format = (req.query.format || 'json').toLowerCase();
    if (format === 'csv') {
      const header = ['_id', 'user', 'actionType', 'meta', 'ip', 'userAgent', 'createdAt'];
      const rows = items.map(i => header.map(h => {
        const v = h === 'user' ? (i.user || '') : (h === 'meta' ? JSON.stringify(i.meta || {}) : (i[h] ?? ''));
        const s = (v instanceof Date) ? v.toISOString() : String(v ?? '');
        return '"' + s.replaceAll('"', '""') + '"';
      }).join(','));
      const csv = [header.join(','), ...rows].join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="activity_logs.csv"');
      return res.send(csv);
    }
    // default json
    res.json({ items });
  } catch (err) { next(err); }
};

export { listLogs, deleteLog, deleteLogsBulk, exportLogs };
