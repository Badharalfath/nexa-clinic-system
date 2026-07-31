import { useState, useEffect, useRef } from 'react';
import { medicalRecordsAPI, patientsAPI } from '../../api/axios';
import Icon from '../../components/Icon';
import { formatLongDate, formatCurrency } from '../../utils/format';

export default function HistoryPage() {
  const [search, setSearch] = useState('');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const reqRef = useRef(0);

  const searchPatients = async (q) => {
    if (q.length < 2) return;
    const reqId = ++reqRef.current;
    setSearch(q);
    try {
      const res = await patientsAPI.getAll({ search: q, limit: 10 });
      if (reqId !== reqRef.current) return;
      setPatients(res.data.data.patients || []);
    } catch { if (reqId === reqRef.current) setPatients([]); }
  };

  const selectPatient = async (p) => {
    const reqId = ++reqRef.current;
    setSelectedPatient(p);
    setLoading(true);
    try {
      const res = await medicalRecordsAPI.getByPatient(p.id);
      if (reqId !== reqRef.current) return;
      setRecords(res.data.data || []);
    } catch { if (reqId === reqRef.current) setRecords([]); }
    finally { if (reqId === reqRef.current) setLoading(false); }
  };

  return (
    <div>
      <h2 className="page-title">Riwayat Pemeriksaan</h2>

      <div className="search-bar">
        <input type="text" placeholder="Cari pasien (nama, NIK, atau no. rekam medis)..." value={search}
          onChange={e => searchPatients(e.target.value)} />
      </div>

      {patients.length > 0 && !selectedPatient && (
        <div className="patient-select-list">
          {patients.map(p => (
            <div key={p.id} className="patient-select-card" onClick={() => selectPatient(p)}>
              <div className="cell-stack">
                <span className="cell-strong">{p.name}</span>
                <code>{p.medicalRecordNumber} · {p.nik}</code>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPatient && (
        <>
          <div className="patient-summary">
            <div className="patient-summary-row">
              <div>
                <h3>{selectedPatient.name} <small>({selectedPatient.medicalRecordNumber})</small></h3>
                <p>NIK {selectedPatient.nik} · {selectedPatient.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
              </div>
              <button className="btn-sm btn-secondary" onClick={() => { setSelectedPatient(null); setPatients([]); setRecords([]); setSearch(''); }}>
                <Icon name="refresh" size={12} /> Cari Pasien Lain
              </button>
            </div>
          </div>

          {loading ? <div className="loading">Memuat riwayat...</div> :
            records.length === 0 ? <p className="empty-state">Belum ada riwayat pemeriksaan untuk pasien ini</p> :
            records.map(r => (
              <div key={r.id} className="history-card">
                <div className="history-header">
                  <div className="history-header-left">
                    <strong>{formatLongDate(r.createdAt)}</strong>
                    <span className="badge badge-green">{r.registration?.polyclinic?.name}</span>
                  </div>
                  <small>Dr. {r.doctor?.name}</small>
                </div>

                <div className="history-body">
                  <div className="soap-display">
                    <div className="soap-field"><span className="soap-tag soap-s">S</span>{r.subjective || '—'}</div>
                    <div className="soap-field">
                      <span className="soap-tag soap-o">O</span>
                      TD {r.objectiveBloodPressure || '—'} · Suhu {r.objectiveTemperature ? r.objectiveTemperature + '°C' : '—'} · BB {r.objectiveWeight ? r.objectiveWeight + ' kg' : '—'} · TB {r.objectiveHeight ? r.objectiveHeight + ' cm' : '—'}
                    </div>
                    <div className="soap-field"><span className="soap-tag soap-a">A</span>{r.assessment || '—'}</div>
                    <div className="soap-field"><span className="soap-tag soap-p">P</span>{r.plan || '—'}</div>
                  </div>

                  {r.medicalActions?.length > 0 && (
                    <details>
                      <summary><Icon name="cross" size={12} /> Tindakan Medis ({r.medicalActions.length})</summary>
                      {r.medicalActions.map(a => (
                        <div key={a.id} className="inline-item">{a.actionName} {formatCurrency(a.cost)}</div>
                      ))}
                    </details>
                  )}

                  {r.prescriptions?.length > 0 && (
                    <details>
                      <summary><Icon name="pill" size={12} /> Resep Obat ({r.prescriptions.length})</summary>
                      {r.prescriptions.map(p => (
                        <div key={p.id} className="inline-item">{p.drugName} — {p.dosage || ''} {p.quantity ? `(${p.quantity})` : ''} <small className="text-muted">{p.instructions}</small></div>
                      ))}
                    </details>
                  )}
                </div>
              </div>
            ))
          }
        </>
      )}
    </div>
  );
}
