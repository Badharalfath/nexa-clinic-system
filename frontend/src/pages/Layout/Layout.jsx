import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../../components/Icon';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard', roles: ['administrator', 'dokter', 'petugas_pendaftaran'] },
  { path: '/patients', label: 'Pasien', icon: 'users', roles: ['administrator', 'petugas_pendaftaran'] },
  { path: '/registrations', label: 'Pendaftaran', icon: 'clipboard', roles: ['administrator', 'petugas_pendaftaran'] },
  { path: '/queues', label: 'Antrean', icon: 'queue', roles: ['administrator', 'petugas_pendaftaran', 'dokter'] },
  { path: '/examination', label: 'Pemeriksaan', icon: 'activity', roles: ['dokter'] },
  { path: '/history', label: 'Riwayat', icon: 'fileText', roles: ['dokter', 'administrator'] },
];

export default function Layout() {
  const { user, logout, hasRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleBadge = {
    administrator: { label: 'Admin', class: 'badge-purple' },
    dokter: { label: 'Dokter', class: 'badge-green' },
    petugas_pendaftaran: { label: 'Petugas', class: 'badge-blue' },
  };

  const roleLabel = {
    administrator: 'Administrator',
    dokter: 'Dokter',
    petugas_pendaftaran: 'Petugas Pendaftaran',
  };

  return (
    <div className="layout">
      {sidebarOpen && (
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="logo-mark" aria-hidden="true">
              <span className="logo-glyph">K+</span>
            </div>
            <div className="brand-text">
              <h2>Klinik<span className="brand-accent">Sehat</span></h2>
              <p className="sidebar-sub">Sistem Informasi Klinik</p>
            </div>
          </div>
          <nav className="sidebar-nav">
            {navItems.filter(n => hasRole(...n.roles)).map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                <Icon name={item.icon} size={18} className="nav-icon" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="user-card">
              <div className="user-info">
                <span className="user-name">{user?.name}</span>
                <span className={`badge ${roleBadge[user?.role]?.class}`}>
                  {roleBadge[user?.role]?.label}
                </span>
              </div>
              <small className="text-muted">{roleLabel[user?.role]}</small>
            </div>
            <button onClick={handleLogout} className="btn-logout">
              <Icon name="logout" size={15} />
              Logout
            </button>
          </div>
        </aside>
      )}
      <main className="main-content">
        <header className="topbar">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="btn-toggle" aria-label="Toggle sidebar">
            <Icon name={sidebarOpen ? 'close' : 'menu'} size={17} />
          </button>
          <span className="topbar-title">
            {navItems.find(n => n.path === location.pathname)?.label || 'Dashboard'}
          </span>
        </header>
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
