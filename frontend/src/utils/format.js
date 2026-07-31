// Safe formatting helpers — never throw on invalid values.
// Prevents render crashes (white screen) from bad/missing data.

export function formatDate(value, options) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  try {
    return d.toLocaleDateString('id-ID', options);
  } catch {
    return '—';
  }
}

export function formatLongDate(value) {
  return formatDate(value, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatNumber(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return '—';
  try {
    return n.toLocaleString('id-ID');
  } catch {
    return String(n);
  }
}

export function formatCurrency(value) {
  const n = Number(value);
  if (Number.isNaN(n) || n <= 0) return '';
  return `Rp ${formatNumber(n)}`;
}
