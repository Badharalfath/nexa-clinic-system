import { useState, useEffect } from 'react';
import { registrationsAPI, patientsAPI, referensiAPI } from '../../api/axios';

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
    patientId: '', doctorId: '', polyclinicId: '',
    paymentType: 'umum', complaint: ''
  });
  const [error, setError] = useState('');
  const [searchPatient, setSearchPatient] = useState('');

  useEffect(() => {
    Promise.all([
      patientsAPI.getAll({ limit: 1000 }),
      referensiAPI.getDoctors(),
      referensiAPI.getPolyclinics(),
    ]).then(([patRes, docRes, polRes]) => {
      setPatients(patRes.data.data.patients || []);
      setDoctors(docRes.data.data || []);
      setPolyclinics(polRes.data.data || []);
    }).catch(console.error);
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

  useEffect(() => { fetchRegistrations(); }, [page]);

  const openCreate = () => {
    setForm({ patientId: '', doctorId: '', polyclinicId: '', paymentType: 'umum', complaint: '' });
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
      setError(err.response?.data?.message || 'Registration failed');
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
        <h2 className="page-title">Pendaftaran Pasien</h2>
        <button className="btn btn-primary" onClick={openCreate}>+ Daftar Baru</button>
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
                  <td>{((pagination.page - 1) * 10) + i + 1}</td>
                  <td><small>{r.patient?.medicalRecordNumber}<br/></small>{r.patient?.name}</td>
                  <td>{r.doctor?.name}</td>
                  <td>{r.polyclinic?.name}</td>
                  <td>{new Date(r.registrationDate).toLocaleDateString('id-ID')}</td>
                  <td><span className="badge badge-blue">{r.paymentType}</span></td>
                  <td><span className={`badge ${r.status === 'selesai' ? 'badge-green' : r.status === 'menunggu' ? 'badge-yellow' : 'badge-blue'}`}>{r.status}</span></td>
                  <td><strong>{r.queue?.queueNumber || '-'}</strong></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>‹ Prev</button>
          <span>Page {pagination.page} of {pagination.totalPages}</span>
          <button disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next ›</button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <h3>Pendaftaran Baru</h3>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Cari Pasien</label>
                <input type="text" placeholder="Cari nama/NIK/no. RM..." value={searchPatient}
                  onChange={e => setSearchPatient(e.target.value)} />
                <select size={Math.min(Math.max(filteredPatients.length, 1), 6)} value={form.patientId}
                  onChange={e => setForm({...form, patientId: e.target.value})} required className="mt-1">
                  <option value="">-- Pilih Pasien --</option>
                  {filteredPatients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} — {p.nik} ({p.medicalRecordNumber})</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Dokter</label>
                  <select value={form.doctorId} onChange={e => setForm({...form, doctorId: e.target.value})} required>
                    <option value="">-- Pilih Dokter --</option>
                    {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Poli</label>
                  <select value={form.polyclinicId} onChange={e => setForm({...form, polyclinicId: e.target.value})} required>
                    <option value="">-- Pilih Poli --</option>
                    {polyclinics.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Jenis Pembayaran</label>
                  <select value={form.paymentType} onChange={e => setForm({...form, paymentType: e.target.value})}>
                    <option value="umum">Umum</option><option value="bpjs">BPJS</option><option value="asuransi">Asuransi</option>
                  </select>
                </div>
                <div className="form-group"><label>Keluhan</label>
                  <textarea value={form.complaint} onChange={e => setForm({...form, complaint: e.target.value})} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Daftarkan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
