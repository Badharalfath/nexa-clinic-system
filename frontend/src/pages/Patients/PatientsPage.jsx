import { useState, useEffect } from 'react';
import { patientsAPI, registrationsAPI } from '../../api/axios';
import Icon from '../../components/Icon';
import { formatDate } from '../../utils/format';
import { statusLabel, statusBadgeClass } from '../../utils/status';

const emptyForm = { nik: '', name: '', gender: 'L', birthDate: '', phone: '', address: '' };

// Frontend NIK validation: exactly 16 numeric digits (PDF: NIK 16 digit, no duplicates)
const isNIKValid = (nik) => /^\d{16}$/.test(nik || '');

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [nikError, setNikError] = useState('');
  // Detail view state
  const [detailPatient, setDetailPatient] = useState(null);
  const [patientRegistrations, setPatientRegistrations] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await patientsAPI.getAll({ page, limit: 10, search });
      setPatients(res.data.data.patients || []);
      setPagination(res.data.data.pagination || { total: 0, page: 1, totalPages: 1 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    patientsAPI.getAll({ page, limit: 10, search })
      .then(res => {
        if (cancelled) return;
        setPatients(res.data.data.patients || []);
        setPagination(res.data.data.pagination || { total: 0, page: 1, totalPages: 1 });
      })
      .catch(err => { if (!cancelled) console.error(err); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [page, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setNikError('');
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({ nik: p.nik, name: p.name, gender: p.gender, birthDate: p.birthDate?.split('T')[0], phone: p.phone || '', address: p.address || '' });
    setError('');
    setNikError('');
    setShowModal(true);
  };

  const openDetail = async (p) => {
    setDetailPatient(p);
    setPatientRegistrations([]);
    setDetailLoading(true);
    try {
      const res = await registrationsAPI.getAll({ limit: 1000 });
      const regs = (res.data.data.registrations || []).filter(r => r.patientId === p.id);
      setPatientRegistrations(regs);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleNikChange = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    setForm({ ...form, nik: digits });
    if (digits.length > 0 && digits.length < 16) {
      setNikError('NIK harus tepat 16 digit angka');
    } else {
      setNikError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!isNIKValid(form.nik)) {
      setNikError('NIK harus tepat 16 digit angka');
      return;
    }
    setNikError('');
    try {
      if (editing) {
        await patientsAPI.update(editing.id, form);
      } else {
        await patientsAPI.create(form);
      }
      setShowModal(false);
      fetchPatients();
    } catch (err) {
      setError(err.response?.data?.message || 'Operasi gagal');
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Hapus pasien "${name}"?`)) return;
    try {
      await patientsAPI.delete(id);
      fetchPatients();
    } catch (err) {
      alert(err.response?.data?.message || 'Hapus gagal');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Data Pasien</h2>
        <button className="btn btn-primary" onClick={openCreate}>
          <Icon name="plus" size={16} /> Tambah Pasien
        </button>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="Cari NIK, nama, atau no. rekam medis..." value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }} />
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>No. RM</th><th>NIK</th><th>Nama</th><th>Gender</th><th>Tgl Lahir</th><th>Telepon</th><th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="7" className="text-center">Loading...</td></tr> :
              patients.length === 0 ? <tr><td colSpan="7" className="text-center">Tidak ada data</td></tr> :
              patients.map(p => (
                <tr key={p.id}>
                  <td><code>{p.medicalRecordNumber}</code></td>
                  <td>{p.nik}</td>
                  <td className="cell-strong">{p.name}</td>
                  <td>{p.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                  <td>{formatDate(p.birthDate)}</td>
                  <td>{p.phone || '—'}</td>
                  <td>
                    <div className="action-cell">
                      <button className="icon-btn" title="Lihat detail" onClick={() => openDetail(p)}>
                        <Icon name="eye" size={15} />
                      </button>
                      <button className="icon-btn" title="Ubah data" onClick={() => openEdit(p)}>
                        <Icon name="edit" size={15} />
                      </button>
                      <button className="icon-btn icon-btn-danger" title="Hapus data" onClick={() => handleDelete(p.id, p.name)}>
                        <Icon name="trash" size={15} />
                      </button>
                    </div>
                  </td>
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

      {/* ===== Detail Modal ===== */}
      {detailPatient && (
        <div className="modal-overlay" onClick={() => setDetailPatient(null)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Detail Pasien</h3>
              <button className="icon-btn" onClick={() => setDetailPatient(null)} aria-label="Tutup">
                <Icon name="close" size={16} />
              </button>
            </div>

            <div className="detail-hero">
              <div className="detail-avatar" aria-hidden="true">
                {detailPatient.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="detail-hero-info">
                <h4>{detailPatient.name}</h4>
                <span className="badge badge-green">{detailPatient.medicalRecordNumber}</span>
              </div>
            </div>

            <div className="detail-grid">
              <div className="detail-field">
                <span className="detail-label">NIK</span>
                <span className="detail-value">{detailPatient.nik}</span>
              </div>
              <div className="detail-field">
                <span className="detail-label">Jenis Kelamin</span>
                <span className="detail-value">{detailPatient.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
              </div>
              <div className="detail-field">
                <span className="detail-label">Tanggal Lahir</span>
                <span className="detail-value">{formatDate(detailPatient.birthDate)}</span>
              </div>
              <div className="detail-field">
                <span className="detail-label">No. Telepon</span>
                <span className="detail-value">{detailPatient.phone || '—'}</span>
              </div>
              <div className="detail-field detail-field-full">
                <span className="detail-label">Alamat</span>
                <span className="detail-value">{detailPatient.address || '—'}</span>
              </div>
              <div className="detail-field">
                <span className="detail-label">Terdaftar Sejak</span>
                <span className="detail-value">{formatDate(detailPatient.createdAt)}</span>
              </div>
            </div>

            <div className="detail-section">
              <h4>Riwayat Kunjungan ({patientRegistrations.length})</h4>
              {detailLoading ? <p className="text-muted">Memuat...</p> :
                patientRegistrations.length === 0 ? <p className="text-muted">Belum ada kunjungan</p> :
                <div className="detail-reg-list">
                  {patientRegistrations.map(r => (
                    <div key={r.id} className="detail-reg-row">
                      <div>
                        <strong>{r.polyclinic?.name}</strong>
                        <small className="text-muted"> · Dr. {r.doctor?.name}</small>
                      </div>
                      <div className="detail-reg-right">
                        <span className="text-muted">{formatDate(r.registrationDate)}</span>
                        <span className={`badge ${statusBadgeClass(r.status)}`}>{statusLabel(r.status)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              }
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setDetailPatient(null)}>Tutup</button>
              <button type="button" className="btn btn-primary" onClick={() => { setDetailPatient(null); openEdit(detailPatient); }}>
                <Icon name="edit" size={15} /> Ubah Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Create/Edit Modal ===== */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{editing ? 'Ubah Data Pasien' : 'Tambah Pasien Baru'}</h3>
              <button className="icon-btn" onClick={() => setShowModal(false)} aria-label="Tutup">
                <Icon name="close" size={16} />
              </button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nik">NIK <span className="req">*</span></label>
                  <input
                    id="nik" type="text" inputMode="numeric" value={form.nik}
                    onChange={e => handleNikChange(e.target.value)}
                    placeholder="16 digit NIK" required
                    className={nikError ? 'field-invalid' : ''}
                  />
                  {nikError && <small className="field-error">{nikError}</small>}
                </div>
                <div className="form-group">
                  <label htmlFor="name">Nama Lengkap <span className="req">*</span></label>
                  <input id="name" type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Nama pasien" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="gender">Jenis Kelamin <span className="req">*</span></label>
                  <select id="gender" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="birthDate">Tanggal Lahir <span className="req">*</span></label>
                  <input id="birthDate" type="date" value={form.birthDate} onChange={e => setForm({...form, birthDate: e.target.value})} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">No. Telepon</label>
                  <input id="phone" type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="08xxxxxxxxxx" />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Alamat</label>
                  <textarea id="address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Alamat lengkap" />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">
                  <Icon name={editing ? 'check' : 'plus'} size={15} /> {editing ? 'Simpan Perubahan' : 'Tambah Pasien'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
