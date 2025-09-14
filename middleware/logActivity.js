import ActivityLog from '../models/ActivityLog.js';

const logActivity = ({ actionType, getUserId = (req) => req?.user?.id, getMeta = () => null } = {}) => {
    return async (req, res, next) => {
        // attach a recorder to req so controllers can call req.recordActivity(...) too
        req.recordActivity = async (override = {}) => {
        try {
            const userId = override.userId ?? getUserId(req);
            const meta = { ...(getMeta(req) || {}), ...(override.meta || {}) };
            const ip = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
            await ActivityLog.create({
            user: userId || null,
            actionType: override.actionType || actionType,
            meta,
            ip,
            userAgent: req.get('User-Agent') || '',
            });
        } catch (err) {
            // Do NOT crash the request on logging failure — just console.warn
            console.warn('Activity log failed', err);
        }
        };

        // for convenience, auto-record common cases (e.g., login attempt)
        if (actionType) {
        // create a non-blocking log (don't await) — use req.recordActivity() for awaited logging
        req.recordActivity().catch(() => {});
        }
        next();
    };
}

export default logActivity;
