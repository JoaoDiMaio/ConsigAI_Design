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
  cidade: 'São Paulo',
  estado: 'SP',
  bancoNome: '',
  bancoTipoConta: '',
  bancoAgencia: '',
  bancoConta: '',
  bancoPix: '',
}

export function createDefaultProfileData() {
  return { ...defaultProfileData }
}
