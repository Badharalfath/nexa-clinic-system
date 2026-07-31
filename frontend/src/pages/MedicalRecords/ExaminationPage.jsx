import { useState, useEffect } from 'react';
import { referensiAPI, queuesAPI, patientsAPI, medicalRecordsAPI } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Icon from '../../components/Icon';
import { formatDate } from '../../utils/format';
import { statusLabel, statusBadgeClass } from '../../utils/status';

const emptyForm = {
  registrationId: '', patientId: '', doctorId: '',
  subjective: '',
  objectiveBloodPressure: '', objectiveTemperature: '', objectiveWeight: '', objectiveHeight: '',
  assessment: '', plan: '',
};

export default function ExaminationPage() {
  const { user } = useAuth();
  const [queues, setQueues] = useState([]);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState({ ...emptyForm, doctorId: user?.id });
  const [actions, setActions] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    queuesAPI.getAll({ status: ['menunggu', 'dipanggil', 'pemeriksaan'].join(',') })
      .then(res => { if (!cancelled) setQueues(res.data.data || []); })
      .catch(err => { if (!cancelled) console.error(err); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const selectQueue = async (q) => {
    setSelectedQueue(q);
    setError('');
    setSuccess('');

    const reg = q.registration;
    const res = await patientsAPI.getById(reg.patientId);
    setPatient(res.data.data);

    try {
      const histRes = await medicalRecordsAPI.getByPatient(reg.patientId);
      setHistory(histRes.data.data || []);
    } catch { setHistory([]); }

    setForm({
      registrationId: reg.id,
      patientId: reg.patientId,
      doctorId: user?.id,
      subjective: reg.complaint || '',
      objectiveBloodPressure: '', objectiveTemperature: '', objectiveWeight: '', objectiveHeight: '',
      assessment: '', plan: '',
    });
    setActions([]);
    setPrescriptions([]);
  };

  const addAction = () => setActions([...actions, { actionName: '', actionDescription: '', cost: 0 }]);
  const updateAction = (i, field, value) => {
    const a = [...actions];
    a[i][field] = value;
    setActions(a);
  };
  const removeAction = (i) => setActions(actions.filter((_, idx) => idx !== i));

  const addPrescription = () => setPrescriptions([...prescriptions, { drugName: '', dosage: '', quantity: 1, instructions: '' }]);
  const updatePrescription = (i, field, value) => {
    const p = [...prescriptions];
    p[i][field] = value;
    setPrescriptions(p);
  };
  const removePrescription = (i) => setPrescriptions(prescriptions.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await medicalRecordsAPI.create({
        ...form,
        objectiveTemperature: form.objectiveTemperature ? parseFloat(form.objectiveTemperature) : null,
        objectiveWeight: form.objectiveWeight ? parseFloat(form.objectiveWeight) : null,
        objectiveHeight: form.objectiveHeight ? parseFloat(form.objectiveHeight) : null,
        medicalActions: actions.filter(a => a.actionName),
        prescriptions: prescriptions.filter(p => p.drugName),
      });
      setSuccess('Pemeriksaan berhasil disimpan.');
      const res = await queuesAPI.getAll({ status: ['menunggu', 'dipanggil', 'pemeriksaan'].join(',') });
      setQueues(res.data.data || []);
      setSelectedQueue(null);
      setPatient(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan pemeriksaan');
    }
  };

  if (loading) return <div className="loading">Memuat data...</div>;

  return (
    <div>
      <h2 className="page-title">Pemeriksaan Pasien (SOAP)</h2>

      <div className="exam-layout">
        <div className="exam-sidebar">
          <h3>Antrean Masuk</h3>
          <div className="exam-patient-list">
            {queues.length === 0 && <p className="empty-queue">Tidak ada antrean</p>}
            {queues.map(q => {
              const reg = q.registration;
              return (
                <div key={q.id}
                  className={`exam-patient-card ${selectedQueue?.id === q.id ? 'selected' : ''} ${q.status === 'pemeriksaan' ? 'in-exam' : ''}`}
                  onClick={() => selectQueue(q)}>
                  <div className="exam-patient-header">
                    <strong className="queue-num">{q.queueNumber}</strong>
                    <span className={`badge ${statusBadgeClass(q.status)}`}>{statusLabel(q.status)}</span>
                  </div>
                  <div className="queue-patient">{reg?.patient?.name}</div>
                  <small className="queue-meta">{reg?.polyclinic?.name} · {reg?.doctor?.name}</small>
                </div>
              );
            })}
          </div>
        </div>

        <div className="exam-main">
          {!selectedQueue ? (
            <div className="exam-placeholder">
              <Icon name="activity" size={34} className="placeholder-icon" />
              <p>Pilih pasien dari daftar antrean untuk memulai pemeriksaan</p>
            </div>
          ) : (
            <>
              {patient && (
                <div className="patient-summary">
                  <div className="patient-summary-row">
                    <div>
                      <h3>{patient.name} <small>({patient.medicalRecordNumber})</small></h3>
                      <p>NIK {patient.nik} · {patient.gender === 'L' ? 'Laki-laki' : 'Perempuan'} · Lahir {formatDate(patient.birthDate)}</p>
                    </div>
                    <span className={`badge ${statusBadgeClass(selectedQueue.status)}`}>
                      {statusLabel(selectedQueue.status)}
                    </span>
                  </div>
                </div>
              )}

              {history.length > 0 && (
                <details className="history-accordion">
                  <summary>
                    <Icon name="fileText" size={14} /> Riwayat Pemeriksaan ({history.length}x)
                  </summary>
                  {history.map(h => (
                    <div key={h.id} className="history-item">
                      <small className="text-muted">{formatDate(h.createdAt)} — Dr. {h.doctor?.name}</small>
                      <p><strong>S:</strong> {h.subjective}</p>
                      <p><strong>A:</strong> {h.assessment}</p>
                    </div>
                  ))}
                </details>
              )}

              {error && <div className="alert alert-error">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleSubmit} className="soap-form">
                <h3>Catatan Pemeriksaan</h3>

                <div className="soap-section">
                  <label className="soap-label soap-s">S — Subjective <span className="hint">Keluhan pasien</span></label>
                  <textarea rows={3} value={form.subjective} onChange={e => setForm({...form, subjective: e.target.value})} placeholder="Keluhan yang dirasakan pasien..." />
                </div>

                <div className="soap-section">
                  <label className="soap-label soap-o">O — Objective <span className="hint">Hasil pemeriksaan fisik</span></label>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="td">Tekanan Darah</label>
                      <input id="td" placeholder="120/80" value={form.objectiveBloodPressure} onChange={e => setForm({...form, objectiveBloodPressure: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="suhu">Suhu Tubuh (°C)</label>
                      <input id="suhu" type="number" step="0.1" placeholder="36.5" value={form.objectiveTemperature} onChange={e => setForm({...form, objectiveTemperature: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="bb">Berat Badan (kg)</label>
                      <input id="bb" type="number" step="0.1" placeholder="65" value={form.objectiveWeight} onChange={e => setForm({...form, objectiveWeight: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="tb">Tinggi Badan (cm)</label>
                      <input id="tb" type="number" step="0.1" placeholder="170" value={form.objectiveHeight} onChange={e => setForm({...form, objectiveHeight: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="soap-section">
                  <label className="soap-label soap-a">A — Assessment <span className="hint">Diagnosa</span></label>
                  <textarea rows={3} value={form.assessment} onChange={e => setForm({...form, assessment: e.target.value})} placeholder="Diagnosa / kesimpulan pemeriksaan..." />
                </div>

                <div className="soap-section">
                  <label className="soap-label soap-p">P — Plan <span className="hint">Rencana terapi</span></label>
                  <textarea rows={3} value={form.plan} onChange={e => setForm({...form, plan: e.target.value})} placeholder="Rencana tindak lanjut / terapi..." />
                </div>

                <div className="soap-section">
                  <label className="soap-label">
                    <Icon name="cross" size={13} /> Tindakan Medis
                  </label>
                  {actions.map((a, i) => (
                    <div key={i} className="form-row action-row">
                      <div className="form-group"><input placeholder="Nama tindakan" value={a.actionName} onChange={e => updateAction(i, 'actionName', e.target.value)} /></div>
                      <div className="form-group"><input placeholder="Deskripsi" value={a.actionDescription} onChange={e => updateAction(i, 'actionDescription', e.target.value)} /></div>
                      <div className="form-group" style={{ maxWidth: 130 }}>
                        <input type="number" placeholder="Biaya" value={a.cost} onChange={e => updateAction(i, 'cost', e.target.value)} />
                      </div>
                      <button type="button" className="icon-btn icon-btn-danger" onClick={() => removeAction(i)} aria-label="Hapus">
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn-sm btn-secondary" onClick={addAction}>
                    <Icon name="plus" size={13} /> Tambah Tindakan
                  </button>
                </div>

                <div className="soap-section">
                  <label className="soap-label">
                    <Icon name="pill" size={13} /> Resep Obat
                  </label>
                  {prescriptions.map((p, i) => (
                    <div key={i} className="form-row action-row">
                      <div className="form-group"><input placeholder="Nama obat" value={p.drugName} onChange={e => updatePrescription(i, 'drugName', e.target.value)} /></div>
                      <div className="form-group" style={{ maxWidth: 110 }}><input placeholder="Dosis" value={p.dosage} onChange={e => updatePrescription(i, 'dosage', e.target.value)} /></div>
                      <div className="form-group" style={{ maxWidth: 80 }}><input type="number" placeholder="Qty" value={p.quantity} onChange={e => updatePrescription(i, 'quantity', e.target.value)} /></div>
                      <div className="form-group"><input placeholder="Aturan pakai" value={p.instructions} onChange={e => updatePrescription(i, 'instructions', e.target.value)} /></div>
                      <button type="button" className="icon-btn icon-btn-danger" onClick={() => removePrescription(i)} aria-label="Hapus">
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn-sm btn-secondary" onClick={addPrescription}>
                    <Icon name="plus" size={13} /> Tambah Obat
                  </button>
                </div>

                <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 24 }}>
                  <Icon name="check" size={16} /> Simpan Pemeriksaan & Selesai
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
