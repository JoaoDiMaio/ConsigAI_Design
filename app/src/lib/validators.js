// Centraliza todas as validações do projeto.

const VALID_DDDS = new Set([
  '11', '12', '13', '14', '15', '16', '17', '18', '19',
  '21', '22', '24', '27', '28',
  '31', '32', '33', '34', '35', '37', '38',
  '41', '42', '43', '44', '45', '46',
  '47', '48', '49',
  '51', '53', '54', '55',
  '61', '62', '63', '64', '65', '66', '67', '68', '69',
  '71', '73', '74', '75', '77', '79',
  '81', '82', '83', '84', '85', '86', '87', '88', '89',
  '91', '92', '93', '94', '95', '96', '97', '98', '99',
])

export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024
export const ALLOWED_UPLOAD_MIMES = new Set(['application/pdf', 'image/jpeg', 'image/png'])
export const ALLOWED_UPLOAD_EXTENSIONS = /\.(pdf|jpe?g|png)$/i

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const onlyDigits     = (v) => v.replace(/\D/g, '')
export const normalizeSpaces = (v) => v.replace(/\s+/g, ' ').trim()
export const sanitizeText    = (v) =>
  Array.from(v).filter((ch) => {
    const code = ch.charCodeAt(0)
    return !(code <= 31 || code === 127) && ch !== '<' && ch !== '>'
  }).join('')

// ─── Field validators ─────────────────────────────────────────────────────────
export function isValidCPF(value) {
  const cpf = onlyDigits(value)
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false
  const calcDigit = (base, factor) => {
    let sum = 0
    for (let i = 0; i < base.length; i++) sum += Number(base[i]) * (factor - i)
    const rest = (sum * 10) % 11
    return rest === 10 ? 0 : rest
  }
  return (
    calcDigit(cpf.slice(0, 9), 10) === Number(cpf[9]) &&
    calcDigit(cpf.slice(0, 10), 11) === Number(cpf[10])
  )
}

export function isValidBirthDate(value) {
  const m = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!m) return false
  const [, d, mo, y] = m.map(Number)
  if (y < 1900) return false
  const date = new Date(y, mo - 1, d)
  if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) return false
  if (date > new Date()) return false
  const now = new Date()
  let age = now.getFullYear() - y
  const mDiff = now.getMonth() - (mo - 1)
  if (mDiff < 0 || (mDiff === 0 && now.getDate() < d)) age--
  return age >= 18
}

export function isValidBRPhone(value) {
  const digits = onlyDigits(value)
  if (digits.length !== 10 && digits.length !== 11) return false
  if (!VALID_DDDS.has(digits.slice(0, 2))) return false
  const subscriber = digits.slice(2)
  return digits.length === 11 ? subscriber[0] === '9' : /^[2-5]/.test(subscriber)
}

export function isValidEmail(value) {
  if (!value) return true
  if (value.length > 254 || /\s/.test(value)) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
}

export function isValidCEP(value) {
  return /^\d{5}-\d{3}$/.test(value)
}

// ─── Form validators ──────────────────────────────────────────────────────────
export function validatePersonalData(form) {
  const errors = {}
  const nome  = normalizeSpaces(form.nome  || '')
  const email = normalizeSpaces(form.email || '')

  if (!nome) {
    errors.nome = 'Informe seu nome completo.'
  } else {
    const parts = nome.split(' ').filter(Boolean)
    if (parts.length < 2)                             errors.nome = 'Informe nome e sobrenome.'
    else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(nome)) errors.nome = 'Use apenas letras no nome.'
  }

  if (!isValidCPF(form.cpf || ''))          errors.cpf  = 'CPF inválido.'
  if (!isValidBirthDate(form.nasc || ''))   errors.nasc = 'Data inválida ou idade inferior a 18 anos.'
  if (!isValidBRPhone(form.tel || ''))      errors.tel  = 'Telefone inválido. Use DDD + número brasileiro.'
  if (!isValidEmail(email))                 errors.email = 'E-mail inválido.'

  return errors
}

export function validateUploadFile(file) {
  if (!file) return 'Selecione um arquivo para continuar.'
  const name  = normalizeSpaces(file.name || '')
  const mime  = (file.type || '').toLowerCase()
  if (!ALLOWED_UPLOAD_EXTENSIONS.test(name) || (mime && !ALLOWED_UPLOAD_MIMES.has(mime)))
    return 'Formato inválido. Envie somente PDF, JPG ou PNG.'
  if (file.size > MAX_UPLOAD_SIZE_BYTES) return 'Arquivo muito grande. Limite de 10 MB.'
  if (file.size <= 0)                    return 'Não foi possível ler este arquivo. Tente novamente.'
  return ''
}

export function validateAddress(form) {
  const errors = {}
  const required = ['cep', 'logradouro', 'numero', 'bairro', 'cidade', 'uf']
  required.forEach((k) => {
    if (!form[k] || !normalizeSpaces(String(form[k]))) errors[k] = 'Campo obrigatório.'
  })
  if (form.cep && !isValidCEP(form.cep)) errors.cep = 'CEP inválido.'
  return errors
}
