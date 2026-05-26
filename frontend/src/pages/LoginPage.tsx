import { useSearchParams } from 'react-router-dom';

const ERROR_MESSAGES: Record<string, string> = {
  auth_failed: 'Authentication failed. Please try again.',
  db_error: 'Server error. Please try again.',
  server_error: 'Something went wrong. Please try again.',
  no_token: 'Login token missing. Please try again.',
  invalid_token: 'Invalid login token. Please try again.',
};

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const errorKey = searchParams.get('error');
  const errorMessage = errorKey ? ERROR_MESSAGES[errorKey] : null;

  function handleLogin() {
    // Redirect to backend which starts the ClassLink OAuth flow
    window.location.href = '/auth/classlink';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a5f] to-[#2563eb] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center space-y-6">
        {/* Logo */}
        <div className="space-y-2">
          <div className="text-6xl">🎓</div>
          <h1 className="text-3xl font-bold text-slate-800">EduPath</h1>
          <p className="text-slate-500 text-sm">
            Science & Social Studies for Grades 1–8
          </p>
        </div>

        {/* Subjects preview */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { emoji: '⚗️', label: 'Chemistry' },
            { emoji: '⚡', label: 'Physics' },
            { emoji: '🏛️', label: 'History' },
            { emoji: '🌍', label: 'Social Studies' },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2"
            >
              <span>{s.emoji}</span>
              <span className="text-slate-600 font-medium">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {errorMessage}
          </div>
        )}

        {/* ClassLink SSO button */}
        <button
          onClick={handleLogin}
          className="w-full bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-3 shadow-md"
        >
          <img
            src="/classlink-logo.png"
            alt="ClassLink"
            className="w-6 h-6 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          Sign in with ClassLink
        </button>

        <p className="text-xs text-slate-400">
          Your school's ClassLink account will be used to sign in. No separate password needed.
        </p>
      </div>
    </div>
  );
}
