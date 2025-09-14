import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import logsRoutes from './routes/logsRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';



const app = express();

// trust proxy if behind load balancer (optional for correct client IPs)
app.set('trust proxy', true);

app.use(helmet());
app.use(cors({
  origin: true, // configure specific origin(s) in production
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/users', userRoutes);

// Protected example route:
app.get('/api/admin/me', authMiddleware(), async (req, res) => {
  // req.user set by middleware
  res.json({ message: 'Protected data', user: req.user });
});

// Example admin-only route:
app.get('/api/admin/only', authMiddleware(['admin']), (req, res) => {
  res.json({ message: 'Only admins can see this' });
});

app.use(notFound);
app.use(errorHandler);


export default app;
