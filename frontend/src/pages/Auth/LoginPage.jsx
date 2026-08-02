import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../../components/Icon';

const demoAccounts = [
  { label: 'Admin', u: 'admin', p: 'password123', dot: 'chip-admin', role: 'Akses penuh semua modul', icon: 'users' },
  { label: 'Dokter', u: 'dr.sari', p: 'password123', dot: 'chip-dokter', role: 'Pemeriksaan SOAP & resep', icon: 'cross' },
  { label: 'Petugas', u: 'petugas1', p: 'password123', dot: 'chip-petugas', role: 'Pendaftaran & antrean', icon: 'clock' },
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
      navigate(user.role === 'admin' ? '/dashboard' : '/');
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
      <div className="login-layout">
        {/* Kolom kiri: form login */}
        <div className="login-card">
          <div className="login-brand">
            <div className="logo-mark" aria-hidden="true">
              <span className="logo-glyph">K+</span>
            </div>
            <div>
              <h1>Klinik <span className="brand-accent">Sehat</span></h1>
              <p>Mini Clinic Information System</p>
            </div>
          </div>

          <div className="login-welcome">
            <h2>Selamat datang</h2>
            <p>Masuk untuk melanjutkan sistem pelayanan klinik.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="field-with-icon">
                <Icon name="users" size={16} className="field-icon" />
                <input
                  id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username" required autoFocus
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="field-with-icon">
                <Icon name="lock" size={15} className="field-icon" />
                <input
                  id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password" required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-sm" /> Memproses...
                </>
              ) : (
                <>
                  Masuk <Icon name="arrowDown" size={16} className="btn-arrow" />
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>Password semua akun demo: <strong>password123</strong></p>
          </div>
        </div>

        {/* Kolom kanan: kartu info demo */}
        <div className="login-demo-card">
          <div className="demo-card-head">
            <span className="demo-card-badge">Mode Demo</span>
            <h3>Informasi Akun Demo</h3>
            <p>Klik akun di bawah untuk mengisi form login secara otomatis.</p>
          </div>

          <div className="demo-account-list">
            {demoAccounts.map((acc) => (
              <button key={acc.u} type="button" className="demo-account-row" onClick={() => fillDemo(acc)}>
                <span className={`demo-account-icon ${acc.dot}`}>
                  <Icon name={acc.icon} size={16} />
                </span>
                <span className="demo-account-info">
                  <strong>{acc.label}</strong>
                  <small>{acc.role}</small>
                  <code>{acc.u} / {acc.p}</code>
                </span>
                <Icon name="chevronRight" size={15} className="demo-account-arrow" />
              </button>
            ))}
          </div>

          <div className="demo-card-tip">
            <Icon name="clock" size={14} />
            <span>Data demo sudah terisi: pasien, antrean, dan riwayat pemeriksaan.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
