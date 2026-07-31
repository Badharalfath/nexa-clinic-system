import { useState, useEffect } from 'react';
import { medicalRecordsAPI, patientsAPI } from '../../api/axios';
import { useNavigate } from 'react-router-dom';

export default function HistoryPage() {
  const [search, setSearch] = useState('');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const searchPatients = async (q) => {
    if (q.length < 2) return;
    setSearch(q);
    try {
      const res = await patientsAPI.getAll({ search: q, limit: 10 });
      setPatients(res.data.data.patients);
    } catch { setPatients([]); }
  };

  const selectPatient = async (p) => {
    setSelectedPatient(p);
    setLoading(true);
    try {
      const res = await medicalRecordsAPI.getByPatient(p.id);
      setRecords(res.data.data || []);
    } catch { setRecords([]); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <h2 className="page-title">Riwayat Pemeriksaan</h2>

      <div className="search-bar">
        <input type="text" placeholder="Cari pasien (nama/NIK/no. RM)..." value={search}
          onChange={e => searchPatients(e.target.value)} />
      </div>

      {patients.length > 0 && !selectedPatient && (
        <div className="patient-select-list">
          {patients.map(p => (
            <div key={p.id} className="patient-select-card" onClick={() => selectPatient(p)}>
              <strong>{p.name}</strong> — {p.medicalRecordNumber} <small>{p.nik}</small>
            </div>
          ))}
        </div>
      )}

      {selectedPatient && (
        <>
          <div className="patient-summary">
            <h3>{selectedPatient.name} <small>({selectedPatient.medicalRecordNumber})</small></h3>
            <p>NIK: {selectedPatient.nik} | {selectedPatient.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
            <button className="btn-sm btn-secondary" onClick={() => { setSelectedPatient(null); setPatients([]); setRecords([]); setSearch(''); }}>
              🔄 Cari Pasien Lain
            </button>
          </div>

          {loading ? <div className="loading">Loading...</div> :
            records.length === 0 ? <p className="empty-state">Belum ada riwayat pemeriksaan</p> :
            records.map(r => (
              <div key={r.id} className="history-card">
                <div className="history-header">
                  <div>
                    <strong>{new Date(r.createdAt).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                    <span className="badge badge-green">{r.registration?.polyclinic?.name}</span>
                  </div>
                  <small>Dr. {r.doctor?.name}</small>
                </div>

                <div className="history-body">
                  <div className="soap-display">
                    <div className="soap-field"><span className="soap-tag soap-s">S</span>{r.subjective || '—'}</div>
                    <div className="soap-field">
                      <span className="soap-tag soap-o">O</span>
                      TD: {r.objectiveBloodPressure || '—'} | Suhu: {r.objectiveTemperature ? r.objectiveTemperature + '°C' : '—'} | BB: {r.objectiveWeight ? r.objectiveWeight + ' kg' : '—'} | TB: {r.objectiveHeight ? r.objectiveHeight + ' cm' : '—'}
                    </div>
                    <div className="soap-field"><span className="soap-tag soap-a">A</span>{r.assessment || '—'}</div>
                    <div className="soap-field"><span className="soap-tag soap-p">P</span>{r.plan || '—'}</div>
                  </div>

                  {r.medicalActions?.length > 0 && (
                    <details>
                      <summary>🩹 Tindakan Medis ({r.medicalActions.length})</summary>
                      {r.medicalActions.map(a => (
                        <div key={a.id} className="inline-item">{a.actionName} {a.cost > 0 ? `— Rp ${Number(a.cost).toLocaleString()}` : ''}</div>
                      ))}
                    </details>
                  )}

                  {r.prescriptions?.length > 0 && (
                    <details>
                      <summary>💊 Resep Obat ({r.prescriptions.length})</summary>
                      {r.prescriptions.map(p => (
                        <div key={p.id} className="inline-item">{p.drugName} — {p.dosage || ''} {p.quantity ? `(${p.quantity})` : ''} <small>{p.instructions}</small></div>
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
