import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useAuthStore } from './store/authStore';
import { DashboardPage } from './pages/DashboardPage';
import { ExamPage } from './pages/ExamPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { MyDataPage } from './pages/MyDataPage';
import { ResultsPage } from './pages/ResultsPage';
import { TestsPage } from './pages/TestsPage';
import { Sidebar } from './components/layout/Sidebar';
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
          <span className="nav-logo nav-logo-disabled">
            <img src="/logo.png" alt="Gradex" className="nav-logo-img" />
          </span>
        ) : (
          <Link to="/dashboard" className="nav-logo">
            <img src="/logo.png" alt="Gradex" className="nav-logo-img" />
          </Link>
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
  const location = useLocation();
  const isExam = location.pathname.startsWith('/exam/');
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <div dir="rtl" className="app-root">
      <NavBar />
      <div className="app-body">
        {!isExam && isAuthenticated && <Sidebar />}
        <div className="app-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/my-data" element={<MyDataPage />} />
          <Route path="/tests" element={<TestsPage />} />
          <Route path="/exam/:examId" element={<ExamPage />} />
          <Route path="/results/:id" element={<ResultsPage />} />
        </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
