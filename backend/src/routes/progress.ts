import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/authenticate';
import {
  getLearningPath,
  upsertLessonProgress,
  saveAssessmentResult,
  LessonStatus,
} from '../services/progressService';

const router = Router();

/**
 * GET /progress/:grade/:subject
 * Returns all lesson progress for a student in a given course
 */
router.get('/:grade/:subject', authenticate, async (req: AuthRequest, res: Response) => {
  const grade = req.params.grade as string;
  const subject = req.params.subject as string;
  const userId = req.user!.userId;

  try {
    const progress = await getLearningPath(userId, parseInt(grade), subject);
    res.json({ progress });
  } catch (err) {
    console.error('Get progress error:', err);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

/**
 * POST /progress/:grade/:subject/:lessonId
 * Update lesson status (in_progress, passed, failed)
 */
router.post('/:grade/:subject/:lessonId', authenticate, async (req: AuthRequest, res: Response) => {
  const grade = req.params.grade as string;
  const subject = req.params.subject as string;
  const lessonId = req.params.lessonId as string;
  const { status, score } = req.body as { status: LessonStatus; score?: number };
  const userId = req.user!.userId;

  if (!['not_started', 'in_progress', 'passed', 'failed'].includes(status)) {
    res.status(400).json({ error: 'Invalid status value' });
    return;
  }

  try {
    await upsertLessonProgress(userId, parseInt(grade), subject, lessonId, status, score);
    res.json({ success: true });
  } catch (err) {
    console.error('Update progress error:', err);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

/**
 * POST /progress/:grade/:subject/:lessonId/assessment
 * Save a final assessment result
 */
router.post(
  '/:grade/:subject/:lessonId/assessment',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    const grade = req.params.grade as string;
    const subject = req.params.subject as string;
    const lessonId = req.params.lessonId as string;
    const { answers, score, passed, attemptNumber } = req.body;
    const userId = req.user!.userId;

    try {
      await saveAssessmentResult(
        userId,
        lessonId,
        parseInt(grade),
        subject,
        answers,
        score,
        passed,
        attemptNumber
      );
      // Also update lesson_progress
      await upsertLessonProgress(
        userId,
        parseInt(grade),
        subject,
        lessonId,
        passed ? 'passed' : 'failed',
        score
      );
      res.json({ success: true, passed, score });
    } catch (err) {
      console.error('Save assessment error:', err);
      res.status(500).json({ error: 'Failed to save assessment result' });
    }
  }
);

export default router;
