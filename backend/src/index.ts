import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
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
app.use(helmet({ contentSecurityPolicy: false })); // CSP set by coppaGuard
app.use(coppaGuard);

// ─── CORS ───────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: false, // No cookies (COPPA — JWT in memory only)
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  })
);

// ─── Body Parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '50kb' }));

// ─── Rate Limiting ──────────────────────────────────────────────────────────
app.use(generalLimiter);

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use('/auth', authRoutes);
app.use('/progress', progressRoutes);
app.use('/diagnostic', diagnosticRoutes);
app.use('/lessons', lessonRoutes);
app.use('/session', sessionRoutes);

// ─── Health Check ───────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── 404 Handler ────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ─── Error Handler ──────────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // Log only non-PII info
  console.error(`[ERROR] ${err.message}`);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(config.port, () => {
  console.log(`[Server] Running on port ${config.port}`);
  console.log(`[Server] Frontend URL: ${config.frontendUrl}`);
});

export default app;
