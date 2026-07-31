import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../api/axios';

const cards = [
  { key: 'totalPatients', label: 'Total Pasien', icon: '👥', color: '#22d3ee' },
  { key: 'todayPatients', label: 'Pasien Hari Ini', icon: '📅', color: '#34d399' },
  { key: 'todayQueues', label: 'Antrean Aktif', icon: '🔢', color: '#fbbf24' },
  { key: 'waitingPatients', label: 'Menunggu', icon: '⏳', color: '#fb923c' },
  { key: 'completedPatients', label: 'Selesai', icon: '✅', color: '#a78bfa' },
];

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.get()
      .then(res => setData(res.data.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Memuat data...</div>;

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>
      <div className="stats-grid">
        {cards.map(card => (
          <div key={card.key} className="stat-card" style={{ borderLeftColor: card.color }}>
            <div className="stat-icon" style={{ background: card.color + '20' }}>{card.icon}</div>
            <div className="stat-info">
              <span className="stat-value">{data?.[card.key] ?? 0}</span>
              <span className="stat-label">{card.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
