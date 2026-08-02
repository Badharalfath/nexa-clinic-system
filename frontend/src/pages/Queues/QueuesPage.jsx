import { useState, useEffect } from 'react';
import { queuesAPI } from '../../api/axios';
import Icon from '../../components/Icon';
import { statusLabel } from '../../utils/status';

const STATUS_TONE = {
  menunggu: 'slate',
  dipanggil: 'sky',
  pemeriksaan: 'amber',
  selesai: 'emerald',
  lewat: 'red',
};

const STATUS_ORDER = ['menunggu', 'dipanggil', 'pemeriksaan', 'selesai', 'lewat'];

export default function QueuesPage() {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQueues = async () => {
    setLoading(true);
    try {
      const res = await queuesAPI.getAll();
      setQueues(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    queuesAPI.getAll()
      .then((res) => { if (!cancelled) setQueues(res.data.data || []); })
      .catch((err) => { if (!cancelled) console.error(err); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleCall = async (id) => {
    try {
      await queuesAPI.call(id);
      fetchQueues();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal memanggil antrean');
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await queuesAPI.updateStatus(id, status);
      fetchQueues();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal mengubah status');
    }
  };

  const sorted = [...queues].sort((a, b) => {
    const ia = STATUS_ORDER.indexOf(a.status);
    const ib = STATUS_ORDER.indexOf(b.status);
    if (ia !== ib) return ia - ib;
    return (a.queueNumber || '').localeCompare(b.queueNumber || '');
  });

  const waiting = queues.filter((q) => q.status === 'menunggu');
  const called = queues.filter((q) => q.status === 'dipanggil');
  const examining = queues.filter((q) => q.status === 'pemeriksaan');
  const done = queues.filter((q) => q.status === 'selesai');

  // Current queue: first in examination, else first called, else first waiting
  const current =
    examining[0] || called[0] || waiting[0] || null;
  const nextWaiting = waiting[0] || null;
  const currentNext = current ? (waiting.find((q) => q.id !== current.id) || null) : nextWaiting;

  const handleCallNext = async () => {
    const target = currentNext || nextWaiting;
    if (!target) return;
    try {
      await queuesAPI.call(target.id);
      fetchQueues();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal memanggil antrean berikutnya');
    }
  };

  const currentNextLabel = currentNext
    ? `${currentNext.queueNumber} — ${currentNext.registration?.patient?.name}`
    : null;

  if (loading) return <div className="loading">Memuat antrean...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Antrean Pasien</h2>
          <p className="page-subtitle">Kelola antrean kunjungan dan panggil pasien berikutnya.</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchQueues}>
          <Icon name="refresh" size={15} /> Segarkan
        </button>
      </div>

      <div className="queue-layout">
        {/* Hero panel — antrean saat ini */}
        <section className="queue-hero">
          <div className="queue-hero-label">Antrean Saat Ini</div>
          <div className="queue-hero-num">{current?.queueNumber || '—'}</div>
          <div className="queue-hero-meta">
            {current
              ? `${current.registration?.polyclinic?.name || 'Poli'} · ${current.registration?.doctor?.name || 'Dokter'}`
              : 'Tidak ada pasien aktif saat ini'}
          </div>
          <button
            className="queue-hero-btn"
            onClick={handleCallNext}
            disabled={!currentNext}
            title={currentNextLabel ? `Panggil ${currentNextLabel}` : 'Tidak ada pasien menunggu'}
          >
            <Icon name="phone" size={16} />
            Panggil Antrean Berikutnya
            {currentNextLabel && <span className="next-chip">{currentNextLabel}</span>}
          </button>
          <div className="queue-hero-stats">
            <div className="queue-hero-stat">
              <span className="queue-hero-stat-label">
                <Icon name="clock" size={13} /> Total Menunggu
              </span>
              <span className="queue-hero-stat-value">{waiting.length}</span>
            </div>
            <div className="queue-hero-stat">
              <span className="queue-hero-stat-label">
                <Icon name="checkCircle" size={13} /> Selesai Hari Ini
              </span>
              <span className="queue-hero-stat-value">{done.length}</span>
            </div>
          </div>
        </section>

        {/* Daftar antrean */}
        <section className="queue-table-panel">
          <div className="queue-table-head">
            <h3 className="queue-table-title">Daftar Antrean</h3>
            <span className="queue-table-count">{sorted.length} pasien</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>No. Antrean</th>
                  <th>Nama Pasien</th>
                  <th>Poli / Dokter</th>
                  <th>Status</th>
                  <th className="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {sorted.length === 0 ? (
                  <tr><td colSpan="5" className="text-center">Belum ada antrean</td></tr>
                ) : (
                  sorted.map((q) => {
                    const isCurrent = current?.id === q.id;
                    return (
                      <tr
                        key={q.id}
                        className={
                          q.status === 'selesai' || q.status === 'lewat'
                            ? 'queue-done-row'
                            : isCurrent
                              ? 'queue-row-active'
                              : ''
                        }
                      >
                        <td>
                          <span className="queue-num">{q.queueNumber}</span>
                        </td>
                        <td>
                          <div className={`cell-strong queue-name-cell`}>
                            {q.registration?.patient?.name}
                          </div>
                          <small className="text-muted">
                            {q.registration?.patient?.medicalRecordNumber}
                          </small>
                        </td>
                        <td>
                          <div>{q.registration?.polyclinic?.name || '—'}</div>
                          <small className="text-muted">{q.registration?.doctor?.name || ''}</small>
                        </td>
                        <td>
                          <span className={`badge-dot badge-${STATUS_TONE[q.status] || 'slate'}`}>
                            {statusLabel(q.status)}
                          </span>
                        </td>
                        <td>
                          <div className="action-cell" style={{ justifyContent: 'flex-end' }}>
                            {q.status === 'menunggu' && (
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleCall(q.id)}
                                title="Panggil pasien ini"
                              >
                                <Icon name="phone" size={12} /> Panggil
                              </button>
                            )}
                            {q.status === 'dipanggil' && (
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleStatus(q.id, 'pemeriksaan')}
                                title="Mulai pemeriksaan"
                              >
                                <Icon name="arrowDown" size={12} /> Mulai Periksa
                              </button>
                            )}
                            {q.status === 'pemeriksaan' && (
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleStatus(q.id, 'selesai')}
                                title="Tandai selesai"
                              >
                                <Icon name="check" size={12} /> Selesai
                              </button>
                            )}
                            {q.status === 'menunggu' && (
                              <button
                                className="icon-btn icon-btn-danger"
                                onClick={() => handleStatus(q.id, 'lewat')}
                                title="Lewati"
                              >
                                <Icon name="skip" size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
