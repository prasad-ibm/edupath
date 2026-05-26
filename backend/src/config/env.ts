import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  jwtExpiresIn: '1h',

  classlink: {
    clientId: process.env.CLASSLINK_CLIENT_ID || '',
    clientSecret: process.env.CLASSLINK_CLIENT_SECRET || '',
    redirectUri: process.env.CLASSLINK_REDIRECT_URI || 'http://localhost:4000/auth/callback',
    authUrl: 'https://launchpad.classlink.com/oauth2/v2/auth',
    tokenUrl: 'https://launchpad.classlink.com/oauth2/v2/token',
    userInfoUrl: 'https://nodeapi.classlink.com/v2/my/info',
    oneRosterBase: 'https://nodeapi.classlink.com/oneroster/v1p1',
    scope: 'profile oneroster',
  },

  supabase: {
    url: process.env.SUPABASE_URL || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },

  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
