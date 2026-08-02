// Status labels & badge classes — single source of truth.
// Registration statuses (PDF): Menunggu, Check In, Pemeriksaan, Selesai
// Queue statuses: Menunggu, Dipanggil, Pemeriksaan, Selesai, Lewat
// Badge colors follow the NEXA CIS design system status tokens:
// menunggu=slate, check_in/dipanggil=sky, pemeriksaan=amber, selesai=emerald, lewat=red

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
      return 'badge-emerald';
    case 'menunggu':
      return 'badge-slate';
    case 'check_in':
    case 'check_up':
    case 'dipanggil':
      return 'badge-sky';
    case 'pemeriksaan':
      return 'badge-amber';
    case 'lewat':
      return 'badge-red';
    default:
      return 'badge-slate';
  }
}
