import { useState, useEffect } from 'react';
import { queuesAPI, registrationsAPI } from '../../api/axios';

const statusColors = {
  menunggu: '#fbbf24',
  dipanggil: '#22d3ee',
  pemeriksaan: '#a78bfa',
  selesai: '#34d399',
  lewat: '#ef4444',
};

export default function QueuesPage() {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQueues = async () => {
    setLoading(true);
    try {
      const res = await queuesAPI.getAll();
      setQueues(res.data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchQueues(); }, []);

  const handleCall = async (id) => {
    try {
      await queuesAPI.call(id);
      fetchQueues();
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const handleStatus = async (id, status) => {
    try {
      await queuesAPI.updateStatus(id, status);
      fetchQueues();
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  const grouped = {
    menunggu: queues.filter(q => q.status === 'menunggu'),
    dipanggil: queues.filter(q => q.status === 'dipanggil'),
    pemeriksaan: queues.filter(q => q.status === 'pemeriksaan'),
    selesai: queues.filter(q => q.status === 'selesai'),
    lewat: queues.filter(q => q.status === 'lewat'),
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Antrean Pasien</h2>
        <button className="btn btn-secondary" onClick={fetchQueues}>🔄 Refresh</button>
      </div>

      <div className="queue-board">
        <div className="queue-column">
          <div className="queue-header" style={{ background: statusColors.menunggu }}>
            <strong>Menunggu</strong> <span className="queue-count">{grouped.menunggu.length}</span>
          </div>
          <div className="queue-list">
            {grouped.menunggu.map(q => (
              <div key={q.id} className="queue-card">
                <div className="queue-number">{q.queueNumber}</div>
                <div className="queue-patient">{q.registration?.patient?.name}</div>
                <div className="queue-meta">{q.registration?.polyclinic?.name} — {q.registration?.doctor?.name}</div>
                <div className="queue-actions">
                  <button className="btn-sm btn-primary" onClick={() => handleCall(q.id)}>📞 Panggil</button>
                  <button className="btn-sm btn-danger" onClick={() => handleStatus(q.id, 'lewat')}>⏭ Lewati</button>
                </div>
              </div>
            ))}
            {grouped.menunggu.length === 0 && <p className="empty-queue">Kosong</p>}
          </div>
        </div>

        <div className="queue-column">
          <div className="queue-header" style={{ background: statusColors.dipanggil }}>
            <strong>Dipanggil</strong> <span className="queue-count">{grouped.dipanggil.length}</span>
          </div>
          <div className="queue-list">
            {grouped.dipanggil.map(q => (
              <div key={q.id} className="queue-card called">
                <div className="queue-number">{q.queueNumber}</div>
                <div className="queue-patient">{q.registration?.patient?.name}</div>
                <div className="queue-meta">{q.registration?.polyclinic?.name}</div>
                <button className="btn-sm btn-primary" onClick={() => handleStatus(q.id, 'pemeriksaan')}>🔽 Mulai Periksa</button>
              </div>
            ))}
            {grouped.dipanggil.length === 0 && <p className="empty-queue">Kosong</p>}
          </div>
        </div>

        <div className="queue-column">
          <div className="queue-header" style={{ background: statusColors.pemeriksaan }}>
            <strong>Pemeriksaan</strong> <span className="queue-count">{grouped.pemeriksaan.length}</span>
          </div>
          <div className="queue-list">
            {grouped.pemeriksaan.map(q => (
              <div key={q.id} className="queue-card active">
                <div className="queue-number">{q.queueNumber}</div>
                <div className="queue-patient">{q.registration?.patient?.name}</div>
                <div className="queue-meta">{q.registration?.polyclinic?.name}</div>
                <button className="btn-sm btn-success" onClick={() => handleStatus(q.id, 'selesai')}>✅ Selesai</button>
              </div>
            ))}
            {grouped.pemeriksaan.length === 0 && <p className="empty-queue">Kosong</p>}
          </div>
        </div>

        <div className="queue-column">
          <div className="queue-header" style={{ background: statusColors.selesai }}>
            <strong>Selesai</strong> <span className="queue-count">{grouped.selesai.length}</span>
          </div>
          <div className="queue-list">
            {grouped.selesai.slice(0, 10).map(q => (
              <div key={q.id} className="queue-card done">
                <div className="queue-number">{q.queueNumber}</div>
                <div className="queue-patient">{q.registration?.patient?.name}</div>
              </div>
            ))}
            {grouped.selesai.length === 0 && <p className="empty-queue">Kosong</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
