import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { listLogs, deleteLog, deleteLogsBulk, exportLogs } from '../controllers/logsController.js';

const router = express.Router();

// Admin and Manager can view logs; manager requires filters (enforced in controller)
router.get('/', auth(['admin', 'manager']), listLogs);
router.get('/export', auth(['admin', 'manager']), exportLogs);

// Admin only can delete logs
router.delete('/:id', auth(['admin']), deleteLog);
router.delete('/', auth(['admin']), deleteLogsBulk);

export default router;

