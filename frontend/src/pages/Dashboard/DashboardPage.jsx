import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../api/axios';
import Icon from '../../components/Icon';

const cards = [
  { key: 'totalPatients', label: 'Total Pasien', icon: 'users', tint: 'tint-teal' },
  { key: 'todayPatients', label: 'Pasien Hari Ini', icon: 'calendar', tint: 'tint-blue' },
  { key: 'todayQueues', label: 'Antrean Aktif', icon: 'queue', tint: 'tint-amber' },
  { key: 'waitingPatients', label: 'Menunggu', icon: 'clock', tint: 'tint-orange' },
  { key: 'completedPatients', label: 'Selesai', icon: 'checkCircle', tint: 'tint-green' },
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
          <div key={card.key} className="stat-card">
            <div className={`stat-icon ${card.tint}`}>
              <Icon name={card.icon} size={24} />
            </div>
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
