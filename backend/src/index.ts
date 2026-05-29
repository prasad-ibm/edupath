import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import { config } from './config/env';
import { coppaGuard } from './middleware/coppaGuard';
import { generalLimiter } from './middleware/rateLimiter';

import authRoutes from './routes/auth';
import progressRoutes from './routes/progress';
import diagnosticRoutes from './routes/diagnostic';
import lessonRoutes from './routes/lessons';
import sessionRoutes from './routes/session';

const app = express();

// ─── Security Middleware ────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(coppaGuard);

// ─── CORS (only needed when frontend runs on a separate origin) ──────────────
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: false,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  })
);

// ─── Body Parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '50kb' }));

// ─── Rate Limiting ──────────────────────────────────────────────────────────
app.use(generalLimiter);

// ─── API Routes ─────────────────────────────────────────────────────────────
app.use('/auth', authRoutes);
app.use('/progress', progressRoutes);
app.use('/diagnostic', diagnosticRoutes);
app.use('/lessons', lessonRoutes);
app.use('/session', sessionRoutes);

// ─── Health Check ───────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Serve Frontend (production) ─────────────────────────────────────────────
// In production (Railway), the Vite build is copied next to the backend dist.
// In development, Vite runs separately on port 5174.
const frontendDist = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  // SPA fallback — all non-API routes serve index.html
  app.get('*', (req, res) => {
    if (req.path.startsWith('/auth') || req.path.startsWith('/progress') ||
        req.path.startsWith('/diagnostic') || req.path.startsWith('/lessons') ||
        req.path.startsWith('/session') || req.path === '/health') {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
}

// ─── Error Handler ──────────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(`[ERROR] ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(config.port, () => {
  console.log(`[Server] Running on port ${config.port}`);
  console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
  if (!config.databaseUrl) {
    console.warn('[DB] DATABASE_URL not set — running without database persistence.');
  }
});

export default app;
