import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import SaveSessionButton from './components/layout/SaveSessionButton';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CoursePage from './pages/CoursePage';
import DiagnosticPage from './pages/DiagnosticPage';
import LessonPage from './pages/LessonPage';
import { useAuthStore } from './store/authStore';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>{children}</main>
      <SaveSessionButton />
    </div>
  );
}

export default function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes with layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/course/:grade/:subject"
          element={
            <ProtectedRoute>
              <AppLayout>
                <CoursePage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/diagnostic/:grade/:subject"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DiagnosticPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/lesson/:grade/:subject/:lessonId"
          element={
            <ProtectedRoute>
              <AppLayout>
                <LessonPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
