import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/authenticate';
import { saveSession, resumeSession, LessonStep } from '../services/sessionService';

const router = Router();

/**
 * POST /session/save
 * Save current session state (manual save or auto-save on step transition)
 */
router.post('/save', authenticate, async (req: AuthRequest, res: Response) => {
  const { grade, subject, lessonId, step, stepData } = req.body;
  const userId = req.user!.userId;

  if (!grade || !subject || !lessonId || !step) {
    res.status(400).json({ error: 'grade, subject, lessonId, step required' });
    return;
  }

  try {
    await saveSession(userId, parseInt(grade), subject, lessonId, step as LessonStep, stepData || {});
    res.json({ success: true, savedAt: new Date().toISOString() });
  } catch (err) {
    console.error('Session save error:', err);
    res.status(500).json({ error: 'Failed to save session' });
  }
});

/**
 * GET /session/resume
 * Get saved session for a given grade+subject
 */
router.get('/resume', authenticate, async (req: AuthRequest, res: Response) => {
  const { grade, subject } = req.query;
  const userId = req.user!.userId;

  if (!grade || !subject) {
    res.status(400).json({ error: 'grade and subject query params required' });
    return;
  }

  try {
    const session = await resumeSession(userId, parseInt(grade as string), subject as string);
    if (!session) {
      res.json({ hasSession: false });
      return;
    }
    res.json({ hasSession: true, session });
  } catch (err) {
    console.error('Session resume error:', err);
    res.status(500).json({ error: 'Failed to resume session' });
  }
});

export default router;
