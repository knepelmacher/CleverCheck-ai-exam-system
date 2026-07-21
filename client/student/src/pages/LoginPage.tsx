import { Navigate } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuthStore } from '../store/authStore';

export const LoginPage = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const loading = useAuthStore((s) => s.loading);

  if (loading) return <div className="page-loading">בודק כניסה…</div>;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="login-page" dir="rtl">
      <div className="login-hero">
        <img src="/logo.png" alt="CleverCheck" className="login-logo" />
        <h1>מערכת מבחנים חכמה</h1>
        <p>עבודה על מבחנים, שמירה אוטומטית וסקירת תוצאות</p>
      </div>
      <div className="login-card">
        <LoginForm />
      </div>
    </div>
  );
};
