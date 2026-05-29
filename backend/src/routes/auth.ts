import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { config } from '../config/env';
import { query, queryOne } from '../db/pool';
import { authenticate, AuthRequest } from '../middleware/authenticate';

const router = Router();

/**
 * POST /auth/login
 * Simple login — accepts displayName + grade, returns a JWT.
 * ClassLink SSO can be wired in later for school deployment.
 */
router.post('/login', async (req: Request, res: Response) => {
  const { displayName, grade } = req.body as { displayName: string; grade: number };

  if (!displayName || !grade || grade < 1 || grade > 8) {
    res.status(400).json({ error: 'displayName and grade (1–8) are required' });
    return;
  }

  const stableId = `local_${displayName.toLowerCase().replace(/\s+/g, '_')}`;
  let userId: string = randomUUID();

  // Upsert user in DB (gracefully skips if DB not configured)
  try {
    const existing = await queryOne<{ id: string }>(
      `SELECT id FROM users WHERE classlink_id = $1`,
      [stableId]
    );

    if (existing) {
      userId = existing.id;
      await query(
        `UPDATE users SET display_name = $1, grade = $2, updated_at = NOW() WHERE id = $3`,
        [displayName, grade, userId]
      );
    } else {
      const inserted = await queryOne<{ id: string }>(
        `INSERT INTO users (classlink_id, display_name, grade)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [stableId, displayName, grade]
      );
      if (inserted) userId = inserted.id;
    }
  } catch {
    console.warn('[Auth] DB not available — progress will not be saved.');
  }

  const token = jwt.sign(
    { userId, classlinkId: stableId, displayName, grade },
    config.jwtSecret,
    { expiresIn: '8h' }
  );

  res.json({ token, user: { userId, displayName, grade } });
});

/**
 * GET /auth/me
 * Returns current user profile from JWT.
 */
router.get('/me', authenticate, (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
});

export default router;
