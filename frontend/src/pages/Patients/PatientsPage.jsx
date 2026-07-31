import { useState, useEffect } from 'react';
import { patientsAPI } from '../../api/axios';

const emptyForm = { nik: '', name: '', gender: 'L', birthDate: '', phone: '', address: '' };

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

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await patientsAPI.getAll({ page, limit: 10, search });
      setPatients(res.data.data.patients);
      setPagination(res.data.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPatients(); }, [page, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({ nik: p.nik, name: p.name, gender: p.gender, birthDate: p.birthDate?.split('T')[0], phone: p.phone || '', address: p.address || '' });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editing) {
        await patientsAPI.update(editing.id, form);
      } else {
        await patientsAPI.create(form);
      }
      setShowModal(false);
      fetchPatients();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Hapus pasien "${name}"?`)) return;
    try {
      await patientsAPI.delete(id);
      fetchPatients();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Data Pasien</h2>
        <button className="btn btn-primary" onClick={openCreate}>+ Tambah Pasien</button>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="Cari NIK, nama, no. RM..." value={search}
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
                  <td>{p.name}</td>
                  <td>{p.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                  <td>{new Date(p.birthDate).toLocaleDateString('id-ID')}</td>
                  <td>{p.phone || '-'}</td>
                  <td className="action-cell">
                    <button className="btn-sm btn-edit" onClick={() => openEdit(p)}>✏️</button>
                    <button className="btn-sm btn-delete" onClick={() => handleDelete(p.id, p.name)}>🗑️</button>
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
          <span>Page {pagination.page} of {pagination.totalPages}</span>
          <button disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next ›</button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{editing ? 'Edit Pasien' : 'Tambah Pasien'}</h3>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group"><label>NIK *</label><input type="text" value={form.nik} onChange={e => setForm({...form, nik: e.target.value})} maxLength={16} required /></div>
                <div className="form-group"><label>Nama *</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Jenis Kelamin *</label>
                  <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                    <option value="L">Laki-laki</option><option value="P">Perempuan</option>
                  </select>
                </div>
                <div className="form-group"><label>Tgl Lahir *</label><input type="date" value={form.birthDate} onChange={e => setForm({...form, birthDate: e.target.value})} required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Telepon</label><input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
                <div className="form-group"><label>Alamat</label><textarea value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Simpan' : 'Tambah'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
