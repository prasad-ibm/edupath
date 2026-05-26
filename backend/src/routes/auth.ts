import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import {
  buildAuthUrl,
  exchangeCodeForToken,
  getUserInfo,
  getStudentGrade,
} from '../services/classlinkService';
import { supabase } from '../db/supabaseClient';
import { authenticate, AuthRequest } from '../middleware/authenticate';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * GET /auth/classlink
 * Redirects browser to ClassLink OAuth authorization page
 */
router.get('/classlink', authLimiter, (_req: Request, res: Response) => {
  const authUrl = buildAuthUrl();
  res.redirect(authUrl);
});

/**
 * GET /auth/callback
 * ClassLink redirects here after authentication
 */
router.get('/callback', authLimiter, async (req: Request, res: Response) => {
  const { code, error } = req.query;

  if (error || !code) {
    return res.redirect(`${config.frontendUrl}/login?error=auth_failed`);
  }

  try {
    // 1. Exchange code for ClassLink access token
    const accessToken = await exchangeCodeForToken(code as string);

    // 2. Get user info from ClassLink
    const userInfo = await getUserInfo(accessToken);

    // 3. Get grade from OneRoster
    const grade = await getStudentGrade(accessToken, userInfo.sourcedId);

    // 4. Upsert user in our DB
    const { data: userData, error: dbError } = await supabase
      .from('users')
      .upsert(
        {
          classlink_id: userInfo.sourcedId,
          display_name: userInfo.displayName,
          grade,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'classlink_id' }
      )
      .select('id, classlink_id, display_name, grade')
      .single();

    if (dbError || !userData) {
      console.error('DB upsert error:', dbError);
      return res.redirect(`${config.frontendUrl}/login?error=db_error`);
    }

    // 5. Sign internal JWT (memory-only on client — not stored in localStorage)
    const token = jwt.sign(
      {
        userId: userData.id,
        classlinkId: userData.classlink_id,
        displayName: userData.display_name,
        grade: userData.grade,
      },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    // 6. Redirect to frontend with token in URL fragment (not query string)
    return res.redirect(`${config.frontendUrl}/auth/callback#token=${token}`);
  } catch (err) {
    console.error('Auth callback error:', err);
    return res.redirect(`${config.frontendUrl}/login?error=server_error`);
  }
});

/**
 * GET /auth/me
 * Returns current user profile from JWT
 */
router.get('/me', authenticate, (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
});

export default router;
