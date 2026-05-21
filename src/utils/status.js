export const getStatusVariant = (status) => {
  const value = String(status).toLowerCase();
  if (value.includes('fail') || value.includes('error')) return 'failed';
  if (
    value.includes('draft')
    || value.includes('pause')
    || value.includes('degrad')
    || value.includes('running')
    || value.includes('sync')
  ) return 'paused';
  return 'active';
};
