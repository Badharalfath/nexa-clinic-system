import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI, queuesAPI } from '../../api/axios';
import Icon from '../../components/Icon';
import { statusLabel } from '../../utils/status';

const cards = [
  { key: 'totalPatients', label: 'Total Pasien', icon: 'users', tint: 'tint-teal', accent: 'kpi-accent-primary' },
  { key: 'todayPatients', label: 'Pasien Hari Ini', icon: 'calendar', tint: 'tint-blue', accent: 'kpi-accent-secondary' },
  { key: 'todayQueues', label: 'Antrean Hari Ini', icon: 'queue', tint: 'tint-amber', accent: 'kpi-accent-checkin' },
  { key: 'waitingPatients', label: 'Total Menunggu', icon: 'clock', tint: 'tint-orange', accent: 'kpi-accent-waiting' },
  { key: 'completedPatients', label: 'Selesai Dilayani', icon: 'checkCircle', tint: 'tint-green', accent: 'kpi-accent-done' },
];

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    Promise.all([dashboardAPI.get(), queuesAPI.getAll()])
      .then(([dashRes, queueRes]) => {
        if (cancelled) return;
        setData(dashRes.data.data);
        setQueues(queueRes.data.data || []);
      })
      .catch((err) => {
        if (!cancelled) console.error(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <div className="loading">Memuat data...</div>;

  const waiting = queues
    .filter((q) => q.status === 'menunggu' || q.status === 'dipanggil')
    .slice(0, 3);
  const waitingCount = queues.filter((q) => q.status === 'menunggu').length;
  const doneCount = queues.filter((q) => q.status === 'selesai').length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Dashboard Overview</h2>
          <p className="page-subtitle">Ringkasan aktivitas klinik hari ini.</p>
        </div>
        <span className="text-muted" style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5 }}>
          {dateFormatter.format(new Date())}
        </span>
      </div>

      <div className="stats-grid">
        {cards.map((card) => (
          <div key={card.key} className={`stat-card ${card.accent}`}>
            <div className={`stat-icon ${card.tint}`}>
              <Icon name={card.icon} size={19} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{data?.[card.key] ?? 0}</span>
              <span className="stat-label">{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        {/* Antrean berikutnya — data asli dari API queue */}
        <section className="dash-panel">
          <div className="dash-panel-head">
            <h3 className="dash-panel-title">
              <Icon name="queue" size={16} /> Antrean Berikutnya
            </h3>
            <span className="dash-panel-meta">{waitingCount} menunggu</span>
          </div>
          <div className="dash-panel-body">
            {waiting.length === 0 ? (
              <div className="dash-empty">Belum ada pasien dalam antrean.</div>
            ) : (
              <div className="dash-queue-list">
                {waiting.map((q) => (
                  <div key={q.id} className="dash-queue-item">
                    <span className="dash-queue-num">{q.queueNumber}</span>
                    <div className="dash-queue-info">
                      <div className="dash-queue-name">{q.registration?.patient?.name}</div>
                      <div className="dash-queue-meta">
                        {q.registration?.polyclinic?.name} · {q.registration?.doctor?.name}
                      </div>
                    </div>
                    <span className={`badge-dot badge-${q.status === 'dipanggil' ? 'sky' : 'slate'}`}>
                      {statusLabel(q.status)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Aksi cepat */}
        <section className="dash-panel">
          <div className="dash-panel-head">
            <h3 className="dash-panel-title">
              <Icon name="activity" size={16} /> Aksi Cepat
            </h3>
            <span className="dash-panel-meta">{doneCount} selesai</span>
          </div>
          <div className="dash-actions">
            <button className="dash-action-btn primary" onClick={() => navigate('/registrations')}>
              <Icon name="plus" size={20} />
              Pendaftaran Baru
            </button>
            <button className="dash-action-btn" onClick={() => navigate('/queues')}>
              <Icon name="phone" size={20} />
              Panggil Antrean
            </button>
            <button className="dash-action-btn" onClick={() => navigate('/patients')}>
              <Icon name="users" size={20} />
              Master Data Pasien
            </button>
            <button className="dash-action-btn" onClick={() => navigate('/history')}>
              <Icon name="fileText" size={20} />
              Riwayat Pemeriksaan
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
