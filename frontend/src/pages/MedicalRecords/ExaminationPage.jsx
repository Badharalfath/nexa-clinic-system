import { useState, useEffect } from 'react';
import { referensiAPI, queuesAPI, patientsAPI, medicalRecordsAPI } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

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
    queuesAPI.getAll({ status: ['menunggu', 'dipanggil', 'pemeriksaan'].join(',') })
      .then(res => setQueues(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const selectQueue = async (q) => {
    setSelectedQueue(q);
    setError('');
    setSuccess('');

    const reg = q.registration;
    const res = await patientsAPI.getById(reg.patientId);
    setPatient(res.data.data);

    // Load history
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
      setSuccess('Pemeriksaan berhasil disimpan!');
      // Refresh queue
      const res = await queuesAPI.getAll({ status: ['menunggu', 'dipanggil', 'pemeriksaan'].join(',') });
      setQueues(res.data.data || []);
      setSelectedQueue(null);
      setPatient(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan pemeriksaan');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

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
                    <span className={`badge ${q.status === 'pemeriksaan' ? 'badge-purple' : 'badge-yellow'}`}>{q.status}</span>
                  </div>
                  <div>{reg?.patient?.name}</div>
                  <small>{reg?.polyclinic?.name} — {reg?.doctor?.name}</small>
                </div>
              );
            })}
          </div>
        </div>

        <div className="exam-main">
          {!selectedQueue ? (
            <div className="exam-placeholder">
              <p>Pilih pasien dari daftar antrean untuk memulai pemeriksaan</p>
            </div>
          ) : (
            <>
              {/* Patient Info */}
              {patient && (
                <div className="patient-summary">
                  <h3>{patient.name} <small>({patient.medicalRecordNumber})</small></h3>
                  <p>NIK: {patient.nik} | {patient.gender === 'L' ? 'Laki-laki' : 'Perempuan'} | Lahir: {new Date(patient.birthDate).toLocaleDateString('id-ID')}</p>
                </div>
              )}

              {/* History */}
              {history.length > 0 && (
                <details className="history-accordion">
                  <summary>📋 Riwayat Pemeriksaan ({history.length}x)</summary>
                  {history.map(h => (
                    <div key={h.id} className="history-item">
                      <small className="text-muted">{new Date(h.createdAt).toLocaleDateString('id-ID')} — Dr. {h.doctor?.name}</small>
                      <p><strong>S:</strong> {h.subjective}</p>
                      <p><strong>A:</strong> {h.assessment}</p>
                    </div>
                  ))}
                </details>
              )}

              {error && <div className="alert alert-error">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleSubmit} className="soap-form">
                <h3>⚕️ SOAP</h3>

                <div className="soap-section">
                  <label className="soap-label soap-s">S — Subjective (Keluhan)</label>
                  <textarea rows={3} value={form.subjective} onChange={e => setForm({...form, subjective: e.target.value})} />
                </div>

                <div className="soap-section">
                  <label className="soap-label soap-o">O — Objective</label>
                  <div className="form-row">
                    <div className="form-group"><label>Tekanan Darah</label><input placeholder="120/80" value={form.objectiveBloodPressure} onChange={e => setForm({...form, objectiveBloodPressure: e.target.value})} /></div>
                    <div className="form-group"><label>Suhu (°C)</label><input type="number" step="0.1" placeholder="36.5" value={form.objectiveTemperature} onChange={e => setForm({...form, objectiveTemperature: e.target.value})} /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label>Berat (kg)</label><input type="number" step="0.1" placeholder="65" value={form.objectiveWeight} onChange={e => setForm({...form, objectiveWeight: e.target.value})} /></div>
                    <div className="form-group"><label>Tinggi (cm)</label><input type="number" step="0.1" placeholder="170" value={form.objectiveHeight} onChange={e => setForm({...form, objectiveHeight: e.target.value})} /></div>
                  </div>
                </div>

                <div className="soap-section">
                  <label className="soap-label soap-a">A — Assessment (Diagnosa)</label>
                  <textarea rows={3} value={form.assessment} onChange={e => setForm({...form, assessment: e.target.value})} />
                </div>

                <div className="soap-section">
                  <label className="soap-label soap-p">P — Plan (Rencana Terapi)</label>
                  <textarea rows={3} value={form.plan} onChange={e => setForm({...form, plan: e.target.value})} />
                </div>

                {/* Medical Actions */}
                <div className="soap-section">
                  <label className="soap-label">🩹 Tindakan Medis</label>
                  {actions.map((a, i) => (
                    <div key={i} className="form-row action-row">
                      <div className="form-group"><input placeholder="Nama tindakan" value={a.actionName} onChange={e => updateAction(i, 'actionName', e.target.value)} /></div>
                      <div className="form-group"><input placeholder="Deskripsi" value={a.actionDescription} onChange={e => updateAction(i, 'actionDescription', e.target.value)} /></div>
                      <div className="form-group" style={{maxWidth: 120}}><input type="number" placeholder="Biaya" value={a.cost} onChange={e => updateAction(i, 'cost', e.target.value)} /></div>
                      <button type="button" className="btn-sm btn-danger" onClick={() => removeAction(i)}>✕</button>
                    </div>
                  ))}
                  <button type="button" className="btn-sm btn-secondary" onClick={addAction}>+ Tambah Tindakan</button>
                </div>

                {/* Prescriptions */}
                <div className="soap-section">
                  <label className="soap-label">💊 Resep Obat</label>
                  {prescriptions.map((p, i) => (
                    <div key={i} className="form-row action-row">
                      <div className="form-group"><input placeholder="Nama obat" value={p.drugName} onChange={e => updatePrescription(i, 'drugName', e.target.value)} /></div>
                      <div className="form-group" style={{maxWidth: 100}}><input placeholder="Dosis" value={p.dosage} onChange={e => updatePrescription(i, 'dosage', e.target.value)} /></div>
                      <div className="form-group" style={{maxWidth: 80}}><input type="number" placeholder="Qty" value={p.quantity} onChange={e => updatePrescription(i, 'quantity', e.target.value)} /></div>
                      <div className="form-group"><input placeholder="Aturan pakai" value={p.instructions} onChange={e => updatePrescription(i, 'instructions', e.target.value)} /></div>
                      <button type="button" className="btn-sm btn-danger" onClick={() => removePrescription(i)}>✕</button>
                    </div>
                  ))}
                  <button type="button" className="btn-sm btn-secondary" onClick={addPrescription}>+ Tambah Obat</button>
                </div>

                <button type="submit" className="btn btn-primary btn-block" style={{marginTop: 20}}>💾 Simpan Pemeriksaan & Selesai</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
