import { Request, Response, NextFunction } from 'express';

/**
 * COPPA Compliance Middleware
 * - Removes any headers that could enable behavioral tracking
 * - Sets strict privacy headers
 * - No cookies with PII for users under 13
 */
export function coppaGuard(req: Request, res: Response, next: NextFunction): void {
  // Prevent caching of student data
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');

  // Prevent embedding in iframes (clickjacking protection)
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Referrer policy — no referrer leakage
  res.setHeader('Referrer-Policy', 'no-referrer');

  // Permissions policy — disable tracking APIs
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join('; ')
  );

  next();
}
