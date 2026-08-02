import { useState, useEffect } from 'react';
import { patientsAPI, registrationsAPI } from '../../api/axios';
import Icon from '../../components/Icon';
import { formatDate } from '../../utils/format';
import { statusLabel, statusBadgeClass } from '../../utils/status';
import { useAuth } from '../../context/AuthContext';

const emptyForm = { nik: '', name: '', gender: 'L', birthDate: '', phone: '', address: '' };

// Frontend NIK validation: exactly 16 numeric digits (PDF: NIK 16 digit, no duplicates)
const isNIKValid = (nik) => /^\d{16}$/.test(nik || '');

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('terbaru');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [nikError, setNikError] = useState('');
  //Detail view state
  const [detailPatient, setDetailPatient] = useState(null);
  const [patientRegistrations, setPatientRegistrations] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  // Archive / permanent delete state
  const { hasRole } = useAuth();
  const isAdmin = hasRole('administrator');
  const [archiveTarget, setArchiveTarget] = useState(null);
  const [archiveCounts, setArchiveCounts] = useState(null);
  const [countsLoading, setCountsLoading] = useState(false);
  const [permanentTarget, setPermanentTarget] = useState(null);
  const [confirmText, setConfirmText] = useState('');
  const [actionBusy, setActionBusy] = useState(false);
  const [actionError, setActionError] = useState('');

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
      .then((res) => {
        if (cancelled) return;
        setPatients(res.data.data.patients || []);
        setPagination(res.data.data.pagination || { total: 0, page: 1, totalPages: 1 });
      })
      .catch((err) => { if (!cancelled) console.error(err); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [page, search]);

  //Client-side sort current page (Stitch master-data pattern)
  const sortedPatients = [...patients].sort((a, b) => {
    if (sort === 'nama') return (a.name || '').localeCompare(b.name || '');
    if (sort === 'rm') return (a.medicalRecordNumber || '').localeCompare(b.medicalRecordNumber || '');
    return (b.createdAt || '').localeCompare(a.createdAt || '');
  });

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
      const regs = (res.data.data.registrations || []).filter((r) => r.patientId === p.id);
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

  // ===== Archive flow (soft delete) =====
  const openArchive = async (p) => {
    setArchiveTarget(p);
    setArchiveCounts(null);
    setCountsLoading(true);
    setActionError('');
    try {
      const res = await patientsAPI.getRelatedCounts(p.id);
      setArchiveCounts(res.data.data);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Gagal memuat data terkait');
    } finally {
      setCountsLoading(false);
    }
  };

  const closeArchive = () => {
    setArchiveTarget(null);
    setArchiveCounts(null);
    setActionError('');
  };

  const confirmArchive = async () => {
    if (!archiveTarget) return;
    setActionBusy(true);
    setActionError('');
    try {
      await patientsAPI.delete(archiveTarget.id);
      closeArchive();
      fetchPatients();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Gagal mengarsipkan pasien');
    } finally {
      setActionBusy(false);
    }
  };

  // ===== Permanent delete flow (admin only) =====
  const openPermanent = () => {
    setPermanentTarget(archiveTarget);
    setConfirmText('');
    setActionError('');
    setArchiveTarget(null);
  };

  const closePermanent = () => {
    setPermanentTarget(null);
    setConfirmText('');
    setActionError('');
  };

  const confirmPermanent = async () => {
    if (!permanentTarget || confirmText !== permanentTarget.name) return;
    setActionBusy(true);
    setActionError('');
    try {
      await patientsAPI.permanentDelete(permanentTarget.id);
      closePermanent();
      fetchPatients();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Gagal menghapus permanen');
    } finally {
      setActionBusy(false);
    }
  };

  const totalRelated = archiveCounts
    ? archiveCounts.registrations + archiveCounts.medicalRecords
    : 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Master Data Pasien</h2>
          <p className="page-subtitle">Kelola direktori pasien klinik, nomor rekam medis, dan demografi.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Icon name="plus" size={16} /> Tambah Pasien
        </button>
      </div>

      <div className="toolbar">
        <div className="search-bar">
          <Icon name="search" size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Cari No. RM, NIK, atau nama..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select
          className="toolbar-select"
          aria-label="Urutkan"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="terbaru">Urutkan: Terbaru</option>
          <option value="nama">Urutkan: Nama A-Z</option>
          <option value="rm">Urutkan: No. RM</option>
        </select>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>No. RM</th><th>NIK</th><th>Nama</th><th>Gender</th><th>Tgl Lahir</th><th>Telepon</th><th className="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="7" className="text-center">Loading...</td></tr> :
            patients.length === 0 ? <tr><td colSpan="7" className="text-center">Tidak ada data</td></tr> :
            sortedPatients.map((p) => (
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
                    <button className="icon-btn icon-btn-danger" title="Arsipkan / hapus" onClick={() => openArchive(p)}>
                      <Icon name="trash" size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>‹ Prev</button>
          <span>Page {pagination.page} dari {pagination.totalPages}</span>
          <button disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)}>Next ›</button>
        </div>
      )}

      {/* ===== Detail Modal ===== */}
      {detailPatient && (
        <div className="modal-overlay" onClick={() => setDetailPatient(null)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
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
                {patientRegistrations.map((r) => (
                  <div key={r.id} className="detail-reg-row">
                    <div>
                      <strong>{r.polyclinic?.name}</strong>
                      <small className="text-muted">{r.doctor?.name}</small>
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
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{editing ? 'Ubah Data Pasien' : 'Tambah Pasien Baru'}</h3>
              <button className="icon-btn" onClick={() => setShowModal(false)} aria-label="Tutup">
                <Icon name="close" size={16} />
              </button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit} noValidate>
              {!editing && (
                <div className="rm-auto-banner">
                  <div>
                    <span className="rm-auto-label">Nomor Rekam Medis</span>
                    <span className="rm-auto-value">Otomatis dibuat sistem</span>
                  </div>
                  <Icon name="checkCircle" size={22} className="rm-auto-icon" />
                </div>
              )}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nik">NIK <span className="req">*</span></label>
                  <input
                    id="nik" type="text" inputMode="numeric" value={form.nik}
                    onChange={(e) => handleNikChange(e.target.value)}
                    placeholder="16 digit NIK" required
                    className={nikError ? 'field-invalid' : ''}
                  />
                  {nikError && <small className="field-error">{nikError}</small>}
                </div>
                <div className="form-group">
                  <label htmlFor="name">Nama Lengkap <span className="req">*</span></label>
                  <input id="name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama pasien" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="gender">Jenis Kelamin <span className="req">*</span></label>
                  <select id="gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="birthDate">Tanggal Lahir <span className="req">*</span></label>
                  <input id="birthDate" type="date" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">No. Telepon</label>
                  <input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="08xxxxxxxxxx" />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Alamat</label>
                  <textarea id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Alamat lengkap" />
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

      {/* ===== Archive Confirm Modal ===== */}
      {archiveTarget && (
        <div className="modal-overlay" onClick={closeArchive}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Arsipkan Pasien?</h3>
              <button className="icon-btn" onClick={closeArchive} aria-label="Tutup">
                <Icon name="close" size={16} />
              </button>
            </div>
            <div className="modal-body">
              <div className="confirm-patient">
                <div className="detail-avatar" aria-hidden="true">
                  {archiveTarget.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <strong>{archiveTarget.name}</strong>
                  <small className="text-muted">{archiveTarget.medicalRecordNumber}</small>
                </div>
              </div>

              {countsLoading ? (
                <p className="text-muted">Menghitung data terkait...</p>
              ) : actionError ? (
                <div className="alert alert-error">{actionError}</div>
              ) : (
                <div className="confirm-counts">
                  <div className="confirm-count">
                    <span className="confirm-count-num">{archiveCounts?.registrations ?? 0}</span>
                    <span className="confirm-count-label">Pendaftaran</span>
                  </div>
                  <div className="confirm-count">
                    <span className="confirm-count-num">{archiveCounts?.medicalRecords ?? 0}</span>
                    <span className="confirm-count-label">Pemeriksaan</span>
                  </div>
                  <div className="confirm-count">
                    <span className="confirm-count-num">{archiveCounts?.prescriptions ?? 0}</span>
                    <span className="confirm-count-label">Resep</span>
                  </div>
                  <div className="confirm-count">
                    <span className="confirm-count-num">{archiveCounts?.queues ?? 0}</span>
                    <span className="confirm-count-label">Antrean</span>
                  </div>
                </div>
              )}

              <p className="confirm-note">
                <Icon name="clock" size={14} />
                Pasien akan <strong>diarsipkan</strong>: hilang dari daftar &amp; pencarian, tetapi semua riwayat pemeriksaan, pendaftaran, dan resep <strong>tetap tersimpan</strong>.
              </p>

              {isAdmin && (
                <button type="button" className="btn btn-ghost btn-danger-text" onClick={openPermanent} disabled={actionBusy}>
                  <Icon name="trash" size={14} /> Hapus permanen beserta semua riwayat...
                </button>
              )}
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={closeArchive} disabled={actionBusy}>Batal</button>
              <button type="button" className="btn btn-primary" onClick={confirmArchive} disabled={actionBusy || countsLoading}>
                {actionBusy ? 'Memproses...' : 'Arsipkan Pasien'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Permanent Delete Confirm Modal ===== */}
      {permanentTarget && (
        <div className="modal-overlay" onClick={closePermanent}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head modal-head-danger">
              <h3>Hapus Permanen?</h3>
              <button className="icon-btn" onClick={closePermanent} aria-label="Tutup">
                <Icon name="close" size={16} />
              </button>
            </div>
            <div className="modal-body">
              <div className="confirm-patient">
                <div className="detail-avatar" aria-hidden="true">
                  {permanentTarget.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <strong>{permanentTarget.name}</strong>
                  <small className="text-muted">{permanentTarget.medicalRecordNumber}</small>
                </div>
              </div>

              {actionError && <div className="alert alert-error">{actionError}</div>}

              <div className="alert alert-error alert-block">
                <Icon name="trash" size={15} />
                Tindakan ini <strong>tidak dapat dibatalkan</strong> dan akan menghapus permanen: {archiveCounts?.registrations ?? 0} pendaftaran, {archiveCounts?.medicalRecords ?? 0} pemeriksaan, {archiveCounts?.prescriptions ?? 0} resep, dan {archiveCounts?.queues ?? 0} antrean.
              </div>

              <div className="form-group">
                <label htmlFor="confirmText">Ketik nama pasien untuk konfirmasi</label>
                <input
                  id="confirmText" type="text" value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={permanentTarget.name}
                  autoFocus
                />
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={closePermanent} disabled={actionBusy}>Batal</button>
              <button
                type="button" className="btn btn-danger"
                onClick={confirmPermanent}
                disabled={actionBusy || confirmText !== permanentTarget.name}
              >
                <Icon name="trash" size={15} /> {actionBusy ? 'Menghapus...' : 'Hapus Permanen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
