import { useState, useEffect } from 'react';
import { registrationsAPI, patientsAPI, referensiAPI } from '../../api/axios';
import Icon from '../../components/Icon';
import { formatDate } from '../../utils/format';
import { statusLabel, statusBadgeClass } from '../../utils/status';

const today = () => new Date().toISOString().split('T')[0];

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [polyclinics, setPolyclinics] = useState([]);
  const [form, setForm] = useState({
    patientId: '', doctorId: '', polyclinicId: '', registrationDate: today(),
    paymentType: 'umum', complaint: ''
  });
  const [error, setError] = useState('');
  const [searchPatient, setSearchPatient] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      patientsAPI.getAll({ limit: 1000 }),
      referensiAPI.getDoctors(),
      referensiAPI.getPolyclinics(),
    ]).then(([patRes, docRes, polRes]) => {
      if (cancelled) return;
      setPatients(patRes.data.data.patients || []);
      setDoctors(docRes.data.data || []);
      setPolyclinics(polRes.data.data || []);
    }).catch(err => { if (!cancelled) console.error(err); });
    return () => { cancelled = true; };
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await registrationsAPI.getAll({ page, limit: 10 });
      setRegistrations(res.data.data.registrations);
      setPagination(res.data.data.pagination);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    registrationsAPI.getAll({ page, limit: 10 })
      .then(res => {
        if (cancelled) return;
        setRegistrations(res.data.data.registrations);
        setPagination(res.data.data.pagination);
      })
      .catch(err => { if (!cancelled) console.error(err); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [page]);

  const openCreate = () => {
    setForm({ patientId: '', doctorId: '', polyclinicId: '', registrationDate: today(), paymentType: 'umum', complaint: '' });
    setSearchPatient('');
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await registrationsAPI.create(form);
      setShowModal(false);
      fetchRegistrations();
    } catch (err) {
      setError(err.response?.data?.message || 'Pendaftaran gagal');
    }
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchPatient.toLowerCase()) ||
    p.nik.includes(searchPatient) ||
    (p.medicalRecordNumber || '').toLowerCase().includes(searchPatient.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Pendaftaran Pasien</h2>
          <p className="page-subtitle">Daftarkan kunjungan baru dan kelola antrean hari ini.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Icon name="plus" size={16} /> Pendaftaran Baru
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>#</th><th>Pasien</th><th>Dokter</th><th>Poli</th><th>Tgl</th>
              <th>Bayar</th><th>Status</th><th>Antrean</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="8" className="text-center">Loading...</td></tr> :
              registrations.length === 0 ? <tr><td colSpan="8" className="text-center">Tidak ada data</td></tr> :
              registrations.map((r, i) => (
                <tr key={r.id}>
                  <td className="text-muted">{((pagination.page - 1) * 10) + i + 1}</td>
                  <td>
                    <div className="cell-stack">
                      <span className="cell-strong">{r.patient?.name}</span>
                      <code>{r.patient?.medicalRecordNumber}</code>
                    </div>
                  </td>
                  <td>{r.doctor?.name}</td>
                  <td>{r.polyclinic?.name}</td>
                  <td>{formatDate(r.registrationDate)}</td>
                  <td><span className="badge badge-blue">{r.paymentType}</span></td>
                  <td>
                    <span className={`badge ${statusBadgeClass(r.status)}`}>
                      {statusLabel(r.status)}
                    </span>
                  </td>
                  <td><strong className="queue-num">{r.queue?.queueNumber || '—'}</strong></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>‹ Prev</button>
          <span>Page {pagination.page} dari {pagination.totalPages}</span>
          <button disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next ›</button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Pendaftaran Baru</h3>
              <button className="icon-btn" onClick={() => setShowModal(false)} aria-label="Tutup">
                <Icon name="close" size={16} />
              </button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="searchPatient">Cari Pasien</label>
                <input id="searchPatient" type="text" placeholder="Cari nama, NIK, atau no. rekam medis..." value={searchPatient}
                  onChange={e => setSearchPatient(e.target.value)} />
                <select value={form.patientId}
                  onChange={(e) => setForm({ ...form, patientId: e.target.value })} required className="mt-1">
                  <option value="">— Pilih Pasien —</option>
                  {filteredPatients.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} · {p.nik} ({p.medicalRecordNumber})</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="doctorId">Dokter</label>
                  <select id="doctorId" value={form.doctorId} onChange={e => setForm({...form, doctorId: e.target.value})} required>
                    <option value="">— Pilih Dokter —</option>
                    {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="polyclinicId">Poli</label>
                  <select id="polyclinicId" value={form.polyclinicId} onChange={e => setForm({...form, polyclinicId: e.target.value})} required>
                    <option value="">— Pilih Poli —</option>
                    {polyclinics.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="registrationDate">Tanggal Kunjungan <span className="req">*</span></label>
                  <input id="registrationDate" type="date" value={form.registrationDate}
                    onChange={e => setForm({...form, registrationDate: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label htmlFor="paymentType">Jenis Pembayaran</label>
                  <select id="paymentType" value={form.paymentType} onChange={e => setForm({...form, paymentType: e.target.value})}>
                    <option value="umum">Umum</option>
                    <option value="bpjs">BPJS</option>
                    <option value="asuransi">Asuransi</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="complaint">Keluhan Awal</label>
                <textarea id="complaint" value={form.complaint} onChange={e => setForm({...form, complaint: e.target.value})} placeholder="Deskripsi keluhan pasien" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">
                  <Icon name="check" size={15} /> Daftarkan Pasien
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
