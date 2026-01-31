import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && isAdmin) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAdmin, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await login(email, password);
      console.log('Login successful:', result);
      
      
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const errorMessage = err.message || 'Грешка при влизане';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Yoga Vibe Admin</h1>
          <p>Влезте в административния панел</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Имейл</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Парола</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className="login-button">
            {loading ? 'Влизане...' : 'Влез'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

