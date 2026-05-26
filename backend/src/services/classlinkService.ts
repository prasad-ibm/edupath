/**
 * ClassLink OAuth 2.0 + OneRoster Service
 *
 * This file is ready to use — wire it back in when you are ready
 * to enable ClassLink SSO for school deployment.
 *
 * Steps to re-enable:
 * 1. Add ClassLink credentials to backend/.env (see .env.example)
 * 2. Uncomment the classlink block in src/config/env.ts
 * 3. Add the OAuth routes back to src/routes/auth.ts
 * 4. Replace LoginPage.tsx login form with the ClassLink SSO button
 */

// ── Placeholder export so this file compiles without the config block ──────
export {};

/*
import axios from 'axios';
import { config } from '../config/env';

export interface ClassLinkUserInfo {
  sourcedId: string;
  displayName: string;
  email?: string;
}

export async function exchangeCodeForToken(code: string): Promise<string> {
  const params = new URLSearchParams({
    code,
    client_id: config.classlink.clientId,
    client_secret: config.classlink.clientSecret,
    redirect_uri: config.classlink.redirectUri,
    grant_type: 'authorization_code',
  });
  const response = await axios.post(config.classlink.tokenUrl, params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data.access_token as string;
}

export async function getUserInfo(accessToken: string): Promise<ClassLinkUserInfo> {
  const response = await axios.get(config.classlink.userInfoUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = response.data;
  return {
    sourcedId: data.sourcedId || data.id || data.sub,
    displayName: data.displayName || `${data.given_name} ${data.family_name}`,
    email: data.email,
  };
}

export async function getStudentGrade(accessToken: string, sourcedId: string): Promise<number> {
  try {
    const response = await axios.get(
      `${config.classlink.oneRosterBase}/students/${sourcedId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const student = response.data.user || response.data.student;
    if (student?.grades?.length > 0) {
      const grade = parseInt(student.grades[0], 10);
      if (grade >= 1 && grade <= 8) return grade;
    }
  } catch (err) {
    console.error('OneRoster grade fetch failed:', err);
  }
  return 1;
}

export function buildAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: config.classlink.clientId,
    redirect_uri: config.classlink.redirectUri,
    response_type: 'code',
    scope: config.classlink.scope,
  });
  return `${config.classlink.authUrl}?${params.toString()}`;
}
*/
