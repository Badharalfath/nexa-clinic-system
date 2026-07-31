import { useState, useEffect } from 'react';
import { queuesAPI } from '../../api/axios';
import Icon from '../../components/Icon';

const statusColors = {
  menunggu: '#fef3c7',
  dipanggil: '#e0f2fe',
  pemeriksaan: '#ede9fe',
  selesai: '#dcfce7',
  lewat: '#fee2e2',
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

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    queuesAPI.getAll()
      .then(res => { if (!cancelled) setQueues(res.data.data || []); })
      .catch(err => { if (!cancelled) console.error(err); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleCall = async (id) => {
    try {
      await queuesAPI.call(id);
      fetchQueues();
    } catch (err) { alert(err.response?.data?.message || 'Gagal'); }
  };

  const handleStatus = async (id, status) => {
    try {
      await queuesAPI.updateStatus(id, status);
      fetchQueues();
    } catch (err) { alert(err.response?.data?.message || 'Gagal'); }
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
        <button className="btn btn-secondary" onClick={fetchQueues}>
          <Icon name="refresh" size={15} /> Segarkan
        </button>
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
                <div className="queue-meta">{q.registration?.polyclinic?.name} · {q.registration?.doctor?.name}</div>
                <div className="queue-actions">
                  <button className="btn-sm btn-primary" onClick={() => handleCall(q.id)}>
                    <Icon name="phone" size={12} /> Panggil
                  </button>
                  <button className="btn-sm btn-danger" onClick={() => handleStatus(q.id, 'lewat')}>
                    <Icon name="skip" size={12} /> Lewati
                  </button>
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
                <button className="btn-sm btn-primary" onClick={() => handleStatus(q.id, 'pemeriksaan')}>
                  <Icon name="arrowDown" size={12} /> Mulai Periksa
                </button>
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
                <button className="btn-sm btn-success" onClick={() => handleStatus(q.id, 'selesai')}>
                  <Icon name="check" size={12} /> Selesai
                </button>
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
