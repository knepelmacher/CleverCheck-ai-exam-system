import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

export const LoginForm = () => {
  const navigate = useNavigate();
  const [id, setId] = useState('student01');
  const [password, setPassword] = useState('password');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.login({ id, password, rememberMe });
      navigate('/dashboard', { replace: true });
  } catch (error: any) {
      
      if (error) {
        // אין תשובה מהשרת (שרת נפל / בעיית תקשורת)
        if(error.response && error.response.status === 500) {
          setError('הכניסה נכשלה. נסו שוב.');
        // השרת החזיר תשובה
        } else if (error instanceof Error) {
          setError('שם משתמש או סיסמא שגויים');
        } else {
          setError('הכניסה נכשלה. נסו שוב.');
        }
      } 
  } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>כניסת תלמיד</h2>
      {error ? <div className="form-error">{error}</div> : null}
      <label>
        מספר תלמיד
        <input value={id} onChange={(event) => setId(event.target.value)} />
      </label>
      <label>
        סיסמה
        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <path d="m14.12 14.12a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>
      </label>
      <button type="submit" className="primary-button" disabled={loading}>
        {loading ? 'מתחבר…' : 'התחברות'}
      </button>
    </form>
  );
};
