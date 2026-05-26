import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { config } from '../config/env';
import { supabase } from '../db/supabaseClient';
import { authenticate, AuthRequest } from '../middleware/authenticate';

const router = Router();

/**
 * POST /auth/login
 * Simple login — accepts displayName + grade, returns a JWT.
 * No external provider needed. ClassLink SSO can be wired in later.
 */
router.post('/login', async (req: Request, res: Response) => {
  const { displayName, grade } = req.body as { displayName: string; grade: number };

  if (!displayName || !grade || grade < 1 || grade > 8) {
    res.status(400).json({ error: 'displayName and grade (1–8) are required' });
    return;
  }

  // Generate a stable ID based on displayName (so the same name always gets the same user)
  const stableId = `local_${displayName.toLowerCase().replace(/\s+/g, '_')}`;
  let userId = randomUUID();

  // Try to upsert user in DB (optional — works without Supabase too)
  try {
    const { data } = await supabase
      .from('users')
      .upsert(
        {
          classlink_id: stableId,
          display_name: displayName,
          grade,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'classlink_id' }
      )
      .select('id')
      .single();

    if (data?.id) userId = data.id;
  } catch {
    // DB not configured yet — use generated UUID (progress won't persist)
    console.warn('[Auth] Supabase not configured — progress will not be saved.');
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
