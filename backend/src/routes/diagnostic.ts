import { Router, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { authenticate, AuthRequest } from '../middleware/authenticate';
import {
  computePlacement,
  saveDiagnosticResult,
  getDiagnosticResult,
  DiagnosticAnswer,
} from '../services/diagnosticService';

const router = Router();
const CONTENT_DIR = path.join(__dirname, '../../../content');

/**
 * GET /diagnostic/:grade/:subject
 * Returns the diagnostic question set + whether already completed
 */
router.get('/:grade/:subject', authenticate, async (req: AuthRequest, res: Response) => {
  const grade = req.params.grade as string;
  const subject = req.params.subject as string;
  const userId = req.user!.userId;

  // Check if diagnostic already taken
  const existing = await getDiagnosticResult(userId, parseInt(grade), subject);
  if (existing) {
    return res.json({
      alreadyTaken: true,
      placementIndex: existing.placementIndex,
    });
  }

  // Load diagnostic questions from content files
  const diagFile = path.join(CONTENT_DIR, 'diagnostic', `grade${grade}_${subject}_diagnostic.json`);
  if (!fs.existsSync(diagFile)) {
    return res.status(404).json({ error: 'Diagnostic not found for this grade/subject' });
  }

  const diagnostic = JSON.parse(fs.readFileSync(diagFile, 'utf-8'));
  return res.json({ alreadyTaken: false, diagnostic });
});

/**
 * POST /diagnostic/:grade/:subject/submit
 * Submit diagnostic answers, get placement result
 */
router.post('/:grade/:subject/submit', authenticate, async (req: AuthRequest, res: Response) => {
  const grade = req.params.grade as string;
  const subject = req.params.subject as string;
  const { answers } = req.body as { answers: DiagnosticAnswer[] };
  const userId = req.user!.userId;

  if (!answers || !Array.isArray(answers)) {
    res.status(400).json({ error: 'answers array required' });
    return;
  }

  try {
    const result = computePlacement(answers);
    await saveDiagnosticResult(userId, parseInt(grade), subject, result.placementIndex);
    res.json({ placementIndex: result.placementIndex, score: result.score });
  } catch (err) {
    console.error('Diagnostic submit error:', err);
    res.status(500).json({ error: 'Failed to submit diagnostic' });
  }
});

export default router;
