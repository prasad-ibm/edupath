import axios from 'axios';
import { config } from '../config/env';

export interface ClassLinkUserInfo {
  sourcedId: string;
  displayName: string;
  email?: string;
}

export interface ClassLinkStudent {
  sourcedId: string;
  givenName: string;
  familyName: string;
  grades: string[]; // CEDS format e.g. ["03"]
}

/**
 * Exchange authorization code for ClassLink access token
 */
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

/**
 * Fetch basic user info from ClassLink
 */
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

/**
 * Fetch student record from OneRoster to get grade level
 */
export async function getStudentGrade(accessToken: string, sourcedId: string): Promise<number> {
  try {
    const response = await axios.get(
      `${config.classlink.oneRosterBase}/students/${sourcedId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const student: ClassLinkStudent = response.data.user || response.data.student;
    if (student?.grades && student.grades.length > 0) {
      // CEDS grades are zero-padded strings: "01" = Grade 1
      const grade = parseInt(student.grades[0], 10);
      if (grade >= 1 && grade <= 8) return grade;
    }
  } catch (err) {
    console.error('OneRoster grade fetch failed, defaulting to grade 1:', err);
  }
  return 1; // Safe default
}

/**
 * Build the ClassLink authorization URL for SSO redirect
 */
export function buildAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: config.classlink.clientId,
    redirect_uri: config.classlink.redirectUri,
    response_type: 'code',
    scope: config.classlink.scope,
  });
  return `${config.classlink.authUrl}?${params.toString()}`;
}
