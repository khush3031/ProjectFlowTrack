import { registerProcessHandlers } from './middleware/error.middleware.js'
registerProcessHandlers()

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import orgRoutes from './routes/org.routes.js';
import projectRoutes from './routes/project.routes.js';
import activityRoutes from './routes/activityLog.routes.js';
import { setupRequestTracker } from "request-tracker-pro"


import {
  globalErrorHandler,
  notFoundHandler,
} from './middleware/error.middleware.js';

import { seedRoles } from './seeders/role.seeder.js';
import { seedUsers } from './seeders/user.seeder.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5174',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

setupRequestTracker(app, { storage: { adapters: [
      { type: 'logging-only', format: 'text' },
      { type: 'mongodb', uri: 'mongodb://localhost:27017/trackflow', collection: 'requests', ttlDays: 30 },

    ] } });

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/organizations', orgRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/activity', activityRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('[DB] MongoDB connected')
    await seedRoles()
    await seedUsers()
    app.listen(process.env.PORT || 5000, () =>
      console.log(`[SERVER] Running on port ${process.env.PORT || 5000}`)
    )
  })
  .catch((err) => {
    console.error('[DB] Connection failed:', err.message)
    process.exit(1)
  })

export default app;
