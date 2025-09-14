import express from 'express';
import auth from '../middleware/authMiddleware.js';
import rbac from '../middleware/rbac.js';
import { usersByRole, loginStats, activeUsers } from '../controllers/statsController.js';

const router = express.Router();

// Only admin and manager can view stats
router.get('/users', auth(['admin', 'manager']), usersByRole);
router.get('/logins', auth(['admin', 'manager']), loginStats);
router.get('/active-users', auth(['admin', 'manager']), activeUsers);

export default router;

