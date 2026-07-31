import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const demoAccounts = [
  { label: 'Admin', u: 'admin', p: 'password123', dot: 'chip-admin' },
  { label: 'Dokter', u: 'dr.sari', p: 'password123', dot: 'chip-dokter' },
  { label: 'Petugas', u: 'petugas1', p: 'password123', dot: 'chip-petugas' },
];

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
      setError(err.response?.data?.message || 'Login gagal. Periksa kembali username dan password.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (acc) => {
    setUsername(acc.u);
    setPassword(acc.p);
    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="logo-mark">
            <span className="cross" />
          </div>
          <div>
            <h1>Klinik Sehat</h1>
            <p>Mini Clinic Information System</p>
          </div>
        </div>

        <div className="login-welcome">
          <h2>Selamat datang 👋</h2>
          <p>Masuk untuk melanjutkan ke sistem pelayanan klinik.</p>
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
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <div className="demo-accounts">
          <label>Akun Demo — klik untuk mengisi</label>
          {demoAccounts.map(acc => (
            <button key={acc.u} type="button" className="demo-chip" onClick={() => fillDemo(acc)}>
              <span className={`chip-dot ${acc.dot}`} />
              {acc.label}
            </button>
          ))}
        </div>

        <div className="login-footer">
          <p>Password demo: <strong>password123</strong></p>
        </div>
      </div>
    </div>
  );
}
