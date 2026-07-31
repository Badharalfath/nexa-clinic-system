// Status labels & badge classes — single source of truth.
// Registration statuses (PDF): Menunggu, Check (Check In), Pemeriksaan, Selesai
// Queue statuses: Menunggu, Dipanggil, Pemeriksaan, Selesai, Lewat

const STATUS_LABELS = {
  menunggu: 'Menunggu',
  check_in: 'Check In',
  check_up: 'Check In',
  dipanggil: 'Dipanggil',
  pemeriksaan: 'Pemeriksaan',
  selesai: 'Selesai',
  lewat: 'Lewat',
};

export function statusLabel(status) {
  return STATUS_LABELS[status] || status || '—';
}

export function statusBadgeClass(status) {
  switch (status) {
    case 'selesai':
      return 'badge-green';
    case 'menunggu':
      return 'badge-yellow';
    case 'check_in':
    case 'check_up':
    case 'dipanggil':
      return 'badge-blue';
    case 'pemeriksaan':
      return 'badge-purple';
    default:
      return 'badge-blue';
  }
}
