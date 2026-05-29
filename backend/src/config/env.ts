import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  databaseUrl: process.env.DATABASE_URL || '',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5174',

  // ── ClassLink (add when ready for school deployment) ──────────────────────
  // classlink: {
  //   clientId: process.env.CLASSLINK_CLIENT_ID || '',
  //   clientSecret: process.env.CLASSLINK_CLIENT_SECRET || '',
  //   redirectUri: process.env.CLASSLINK_REDIRECT_URI || '',
  //   authUrl: 'https://launchpad.classlink.com/oauth2/v2/auth',
  //   tokenUrl: 'https://launchpad.classlink.com/oauth2/v2/token',
  //   userInfoUrl: 'https://nodeapi.classlink.com/v2/my/info',
  //   oneRosterBase: 'https://nodeapi.classlink.com/oneroster/v1p1',
  //   scope: 'profile oneroster',
  // },
};
