import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';



const app = express();

app.use(helmet());
app.use(cors({
  origin: true, // configure specific origin(s) in production
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));


// Routes
app.use('/api/auth', authRoutes);

// Protected example route:
app.get('/api/admin/me', authMiddleware(), async (req, res) => {
  // req.user set by middleware
  res.json({ message: 'Protected data', user: req.user });
});

// Example admin-only route:
app.get('/api/admin/only', authMiddleware(['admin']), (req, res) => {
  res.json({ message: 'Only admins can see this' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error', err);
  res.status(500).json({ message: 'Server error' });
});


export default app;
