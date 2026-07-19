import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth';
import listingRoutes from './routes/listings';
import requestRoutes from './routes/requests';
import notificationRoutes from './routes/notifications';
import profileRoutes from './routes/profile';
import adminRoutes from './routes/admin';
import statsRoutes from './routes/stats';
import foodRequestRoutes from './routes/foodRequests';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
      process.env.FRONTEND_URL || '',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5174',
    ].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/food-requests', foodRequestRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
