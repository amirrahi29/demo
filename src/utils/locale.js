/** Application locale — English (United States) only. */
export const APP_LOCALE = 'en-US';

export function formatAppDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(APP_LOCALE, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatAppDateTime(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString(APP_LOCALE, {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return String(iso);
  }
}

export function formatAppNumber(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return value;
  return value.toLocaleString(APP_LOCALE);
}
