/* Hallmark · pre-emit critique: P5 H4 E5 S4 R5 V4
 * Product UI register: the page serves clinicians (utility first).
 * Anti-patterns avoided: no side-stripe cards, no card-in-card,
 * no gradient, no 3-col generic grid. Patient list = hairline rows. */
import { useState, useEffect, useRef } from 'react';
import { medicalRecordsAPI, patientsAPI } from '../../api/axios';
import Icon from '../../components/Icon';
import { formatLongDate, formatCurrency, formatDate } from '../../utils/format';

const initials = (name) =>
  (name || '?')
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

export default function HistoryPage() {
  const [search, setSearch] = useState('');
  const [patients, setPatients] = useState([]);
  const [recent, setRecent] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const reqRef = useRef(0);

  const activeSearch = search.trim().length >= 2;

  // Default view: patients who already have medical records, newest first
  useEffect(() => {
    let cancelled = false;
    medicalRecordsAPI.getRecentPatients()
      .then((res) => { if (!cancelled) setRecent(res.data.data || []); })
      .catch(() => { if (!cancelled) setRecent([]); })
      .finally(() => { if (!cancelled) setLoadingRecent(false); });
    return () => { cancelled = true; };
  }, []);

  const searchPatients = async (q) => {
    setSearch(q);
    const term = q.trim();
    if (term.length < 2) {
      setPatients([]);
      setSearching(false);
      return;
    }
    const reqId = ++reqRef.current;
    setSearching(true);
    try {
      const res = await patientsAPI.getAll({ search: term, limit: 10 });
      if (reqId !== reqRef.current) return;
      setPatients(res.data.data.patients || []);
    } catch {
      if (reqId === reqRef.current) setPatients([]);
    } finally {
      if (reqId === reqRef.current) setSearching(false);
    }
  };

  const selectPatient = async (p) => {
    const reqId = ++reqRef.current;
    setSelectedPatient(p);
    setLoading(true);
    try {
      const res = await medicalRecordsAPI.getByPatient(p.id);
      if (reqId !== reqRef.current) return;
      setRecords(res.data.data || []);
    } catch {
      if (reqId === reqRef.current) setRecords([]);
    } finally {
      if (reqId === reqRef.current) setLoading(false);
    }
  };

  const openRecent = (item) => {
    const p = item.patient;
    selectPatient({
      id: p?.id,
      name: p?.name || 'Pasien',
      medicalRecordNumber: p?.medicalRecordNumber,
      nik: p?.nik,
      gender: p?.gender,
    });
  };

  const resetSearch = () => {
    setSelectedPatient(null);
    setPatients([]);
    setRecords([]);
    setSearch('');
  };

  const showSearchEmpty = activeSearch && patients.length === 0 && !searching && !selectedPatient;

  return (
    <div>
      <h2 className="page-title">Riwayat Pemeriksaan</h2>

      {!selectedPatient && (
        <>
          <div className="search-bar">
            <input type="text" placeholder="Cari pasien (nama, NIK, atau no. rekam medis)..." value={search}
              onChange={(e) => searchPatients(e.target.value)} />
          </div>
          <small className="text-muted search-hint">Ketik minimal 2 karakter untuk mencari, atau pilih dari daftar pasien terakhir diperiksa.</small>

          {searching && <div className="loading">Mencari pasien...</div>}

          {showSearchEmpty && <p className="empty-state">Tidak ada pasien ditemukan untuk "{search}".</p>}

          {activeSearch && !searching && patients.length > 0 && (
            <div className="patient-select-list">
              {patients.map((p) => (
                <div key={p.id} className="patient-select-card" onClick={() => selectPatient(p)}>
                  <div className="cell-stack">
                    <span className="cell-strong">{p.name}</span>
                    <code>{p.medicalRecordNumber} · {p.nik}</code>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!activeSearch && (
            <section className="recent-section">
              <div className="recent-section-head">
                <Icon name="clock" size={15} className="recent-head-icon" />
                <h3>Pasien Terakhir Diperiksa</h3>
                {recent.length > 0 && <span className="recent-head-count">{recent.length}</span>}
              </div>

              {loadingRecent ? (
                <div className="loading">Memuat pasien...</div>
              ) : recent.length === 0 ? (
                <div className="empty-state recent-empty">
                  <Icon name="fileText" size={30} className="placeholder-icon" />
                  <p>Belum ada riwayat pemeriksaan</p>
                  <small>Pasien yang sudah pernah diperiksa akan muncul di sini, urut dari kunjungan terbaru.</small>
                </div>
              ) : (
                <div className="recent-list">
                  {recent.map((item) => {
                    const p = item.patient || {};
                    return (
                      <div key={p.id || item.lastVisit} className="recent-row" onClick={() => openRecent(item)} role="button" tabIndex={0}>
                        <div className="recent-avatar">{initials(p.name)}</div>
                        <div className="recent-info">
                          <div className="recent-name">
                            {p.name || 'Pasien'}
                            {p.medicalRecordNumber && <code className="recent-rm">{p.medicalRecordNumber}</code>}
                          </div>
                          <div className="recent-meta">
                            {[item.lastPolyclinic, item.lastDoctor, formatDate(item.lastVisit)].filter(Boolean).join(' · ') || '—'}
                          </div>
                        </div>
                        <div className="recent-side">
                          <span className="recent-count">{item.visitCount}× kunjungan</span>
                          <Icon name="chevronRight" size={16} className="recent-chevron" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}
        </>
      )}

      {selectedPatient && (
        <>
          <div className="patient-summary">
            <div className="patient-summary-row">
              <div>
                <h3>{selectedPatient.name} <small>({selectedPatient.medicalRecordNumber})</small></h3>
                <p>NIK {selectedPatient.nik} · {selectedPatient.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
              </div>
              <button className="btn-sm btn-secondary" onClick={resetSearch}>
                <Icon name="refresh" size={12} /> Cari Pasien Lain
              </button>
            </div>
          </div>

          {loading ? <div className="loading">Memuat riwayat...</div> :
            records.length === 0 ? <p className="empty-state">Belum ada riwayat pemeriksaan untuk pasien ini</p> :
            records.map((r) => (
              <div key={r.id} className="history-card">
                <div className="history-header">
                  <div className="history-header-left">
                    <strong>{formatLongDate(r.createdAt)}</strong>
                    <span className="badge badge-green">{r.registration?.polyclinic?.name}</span>
                  </div>
                  <small>{r.doctor?.name}</small>
                </div>

                <div className="history-body">
                  <div className="soap-display">
                    <div className="soap-field"><span className="soap-tag soap-s">S</span>{r.subjective || '—'}</div>
                    <div className="soap-field">
                      <span className="soap-tag soap-o">O</span>
                      {r.objectiveBloodPressure || '—'} · Suhu {r.objectiveTemperature ? `${r.objectiveTemperature}°C` : '—'} · {r.objectiveWeight ? `${r.objectiveWeight} kg` : '—'} · {r.objectiveHeight ? `${r.objectiveHeight} cm` : '—'}
                    </div>
                    <div className="soap-field"><span className="soap-tag soap-a">A</span>{r.assessment || '—'}</div>
                    <div className="soap-field"><span className="soap-tag soap-p">P</span>{r.plan || '—'}</div>
                  </div>

                  {r.medicalActions?.length > 0 && (
                    <details>
                      <summary><Icon name="cross" size={12} /> Tindakan Medis ({r.medicalActions.length})</summary>
                      {r.medicalActions.map((a) => (
                        <div key={a.id} className="inline-item">{a.actionName} {formatCurrency(a.cost)}</div>
                      ))}
                    </details>
                  )}

                  {r.prescriptions?.length > 0 && (
                    <details>
                      <summary><Icon name="pill" size={12} /> Resep Obat ({r.prescriptions.length})</summary>
                      {r.prescriptions.map((p) => (
                        <div key={p.id} className="inline-item">{p.drugName} {p.dosage || ''} {p.quantity ? `(${p.quantity})` : ''} <small className="text-muted">{p.instructions}</small></div>
                      ))}
                    </details>
                  )}
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
}
