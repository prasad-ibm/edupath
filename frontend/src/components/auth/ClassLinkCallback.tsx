import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { User } from '../../types/user';

/**
 * Handles the ClassLink OAuth callback.
 * Backend redirects to /auth/callback#token=<jwt>
 * We parse the token from the URL fragment (never touches query string).
 */
export default function ClassLinkCallback() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.slice(1)); // strip leading #
    const token = params.get('token');

    if (!token) {
      navigate('/login?error=no_token');
      return;
    }

    try {
      // Decode JWT payload (not verifying sig — server already did that)
      const payloadB64 = token.split('.')[1];
      const payload = JSON.parse(atob(payloadB64));

      const user: User = {
        userId: payload.userId,
        classlinkId: payload.classlinkId,
        displayName: payload.displayName,
        grade: payload.grade,
      };

      setAuth(user, token);

      // Clear the token from the URL
      window.history.replaceState(null, '', window.location.pathname);

      navigate('/dashboard');
    } catch {
      navigate('/login?error=invalid_token');
    }
  }, [navigate, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-600 font-medium">Signing you in…</p>
      </div>
    </div>
  );
}
