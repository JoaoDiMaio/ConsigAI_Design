export function maskCPF(v) {
  v = v.replace(/\D/g, '').slice(0, 11)
  if (v.length > 9) return v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4')
  if (v.length > 6) return v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3')
  if (v.length > 3) return v.replace(/(\d{3})(\d{1,3})/, '$1.$2')
  return v
}

export function maskDate(v) {
  v = v.replace(/\D/g, '').slice(0, 8)
  if (v.length > 4) return v.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3')
  if (v.length > 2) return v.replace(/(\d{2})(\d{1,2})/, '$1/$2')
  return v
}

export function maskPhone(v) {
  v = v.replace(/\D/g, '').slice(0, 11)
  if (v.length > 6) return v.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3')
  if (v.length > 2) return v.replace(/(\d{2})(\d{1,5})/, '($1) $2')
  return v
}

export function maskCEP(value) {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
}

export function formatFileSize(bytes) {
  if (bytes > 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  return (bytes / 1024).toFixed(0) + ' KB'
}
