import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { me, listUsers, updateUserRole, deleteUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/me', auth(), me);

// Admin only endpoints
router.get('/', auth(['admin']), listUsers);
router.patch('/:id/role', auth(['admin']), updateUserRole);
router.delete('/:id', auth(['admin']), deleteUser);

export default router;

