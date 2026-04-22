export const PROFILE_STORAGE_KEY = 'consigai-profile-v1'

export const defaultProfileData = {
  nomeCompleto: 'Carlos Eduardo Martins',
  cpf: '177.665.442-80',
  dataNascimento: '30/07/1957',
  telefone: '(11) 99999-0000',
  email: 'carlos.eduardo@email.com',
  cep: '04032-001',
  endereco: 'Rua das Flores',
  numero: '184',
  complemento: 'Apto 42',
  bairro: 'Vila Mariana',
  cidade: 'Sao Paulo',
  estado: 'SP',
  bancoNome: '',
  bancoTipoConta: '',
  bancoAgencia: '',
  bancoConta: '',
  bancoPix: '',
}

export function loadProfileData() {
  if (typeof window === 'undefined') return { ...defaultProfileData }

  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY)
    if (!raw) return { ...defaultProfileData }
    return { ...defaultProfileData, ...JSON.parse(raw) }
  } catch {
    return { ...defaultProfileData }
  }
}

export function saveProfileData(patch) {
  const next = { ...loadProfileData(), ...patch }
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next))
  return next
}
