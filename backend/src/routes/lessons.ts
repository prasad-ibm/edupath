import { Router, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { authenticate, AuthRequest } from '../middleware/authenticate';

const router = Router();
const CONTENT_DIR = path.join(__dirname, '../../../content');

/**
 * GET /lessons/:grade/:subject/meta
 * Returns course metadata (lesson sequence, title)
 */
router.get('/:grade/:subject/meta', authenticate, (_req: AuthRequest, res: Response) => {
  const grade = _req.params.grade as string;
  const subject = _req.params.subject as string;
  const metaFile = path.join(CONTENT_DIR, `grade${grade}`, subject, 'course_meta.json');

  if (!fs.existsSync(metaFile)) {
    res.status(404).json({ error: 'Course not found' });
    return;
  }

  const meta = JSON.parse(fs.readFileSync(metaFile, 'utf-8'));
  res.json({ meta });
});

/**
 * GET /lessons/:grade/:subject/:lessonId
 * Returns a single lesson JSON
 */
router.get('/:grade/:subject/:lessonId', authenticate, (_req: AuthRequest, res: Response) => {
  const grade = _req.params.grade as string;
  const subject = _req.params.subject as string;
  const lessonId = _req.params.lessonId as string;

  // Security: prevent path traversal
  if (!/^[a-z0-9_]+$/i.test(lessonId)) {
    res.status(400).json({ error: 'Invalid lesson ID' });
    return;
  }

  const lessonFile = path.join(
    CONTENT_DIR,
    `grade${grade}`,
    subject,
    'lessons',
    `${lessonId}.json`
  );

  if (!fs.existsSync(lessonFile)) {
    res.status(404).json({ error: 'Lesson not found' });
    return;
  }

  const lesson = JSON.parse(fs.readFileSync(lessonFile, 'utf-8'));
  res.json({ lesson });
});

export default router;
