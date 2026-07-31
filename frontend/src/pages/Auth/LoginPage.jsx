import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>🏥</h1>
          <h2>Klinik Information System</h2>
          <p className="login-sub">Mini Clinic Management</p>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-group">
            <label>Username</label>
            <input
              type="text" value={username} onChange={e => setUsername(e.target.value)}
              placeholder="Masukkan username" required autoFocus
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Masukkan password" required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
        <div className="login-footer">
          <p>Demo accounts:</p>
          <small>admin / dr.sari / petugas1 — password: password123</small>
        </div>
      </div>
    </div>
  );
}
