import express from 'express';
import rateLimit from 'express-rate-limit';

const router = express.Router();
import { signup, login, refreshAccessToken, logout } from '../controllers/authController.js';

router.post('/signup', signup);

// Rate limit login to mitigate brute-force
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try later' }
});

router.post('/login', loginLimiter, login);

router.post('/refresh', refreshAccessToken);

router.post('/logout', logout);

export default router;
