import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useAuthStore } from './store/authStore';
import { DashboardPage } from './pages/DashboardPage';
import { ExamPage } from './pages/ExamPage';
import { LoginPage } from './pages/LoginPage';
import { ResultsPage } from './pages/ResultsPage';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const location = useLocation();
  const isExam = location.pathname.startsWith('/exam/');

  if (!isAuthenticated) return null;

  return (
    <nav className="nav-bar" dir="rtl">
      <div className="nav-inner">
        {isExam ? (
          <span className="nav-logo nav-logo-disabled">CleverCheck</span>
        ) : (
          <Link to="/dashboard" className="nav-logo">CleverCheck</Link>
        )}
        <div className="nav-user">
          <span className="nav-user-name">{user?.name ?? 'סטודנט'}</span>
          {isExam ? (
            <span className="nav-logout nav-logout-disabled">יציאה</span>
          ) : (
            <button className="nav-logout" onClick={handleLogout}>יציאה</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export const App = () => {
  useAuth();

  return (
    <div dir="rtl" className="app-root">
      <NavBar />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/exam/:examId" element={<ExamPage />} />
          <Route path="/results/:id" element={<ResultsPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
