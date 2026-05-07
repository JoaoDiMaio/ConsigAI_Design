import { describe, expect, it } from 'vitest'
import {
  ALLOWED_UPLOAD_EXTENSIONS,
  MAX_UPLOAD_SIZE_BYTES,
  isValidBirthDate,
  isValidBRPhone,
  isValidCEP,
  isValidCPF,
  isValidEmail,
  onlyDigits,
  normalizeSpaces,
  sanitizeText,
  validateAddress,
  validatePersonalData,
  validateUploadFile,
} from '../lib/validators.js'

describe('validators helpers', () => {
  it('onlyDigits removes non-numeric characters', () => {
    expect(onlyDigits('(11) 98765-4321')).toBe('11987654321')
  })

  it('normalizeSpaces collapses repeated whitespace', () => {
    expect(normalizeSpaces('  João   da   Silva  ')).toBe('João da Silva')
  })

  it('sanitizeText removes angle brackets and control chars', () => {
    expect(sanitizeText('Olá<\u0001>')).toBe('Olá')
  })
})

describe('CPF', () => {
  it('accepts valid CPF', () => {
    expect(isValidCPF('529.982.247-25')).toBe(true)
  })

  it('rejects invalid CPF', () => {
    expect(isValidCPF('111.111.111-11')).toBe(false)
  })
})

describe('birth date', () => {
  it('accepts adult date in the past', () => {
    expect(isValidBirthDate('30/07/1957')).toBe(true)
  })

  it('rejects invalid format', () => {
    expect(isValidBirthDate('1957-07-30')).toBe(false)
  })

  it('rejects underage date', () => {
    const thisYear = new Date().getFullYear()
    expect(isValidBirthDate(`01/01/${thisYear}`)).toBe(false)
  })
})

describe('contact', () => {
  it('accepts valid BR phone with 11 digits', () => {
    expect(isValidBRPhone('(11) 98765-4321')).toBe(true)
  })

  it('accepts valid BR phone with 10 digits', () => {
    expect(isValidBRPhone('(11) 2345-6789')).toBe(true)
  })

  it('rejects invalid DDD', () => {
    expect(isValidBRPhone('(01) 2345-6789')).toBe(false)
  })

  it('accepts empty email and valid email', () => {
    expect(isValidEmail('')).toBe(true)
    expect(isValidEmail('usuario@exemplo.com')).toBe(true)
  })

  it('rejects malformed email', () => {
    expect(isValidEmail('usuario@')).toBe(false)
  })
})

describe('address', () => {
  it('accepts valid CEP', () => {
    expect(isValidCEP('04032-001')).toBe(true)
  })

  it('rejects invalid CEP', () => {
    expect(isValidCEP('4032001')).toBe(false)
  })
})

describe('form validators', () => {
  it('validatePersonalData returns no errors for valid data', () => {
    expect(validatePersonalData({
      nome: 'Carlos Eduardo Martins',
      cpf: '529.982.247-25',
      nasc: '30/07/1957',
      tel: '(11) 98765-4321',
      email: 'carlos@example.com',
    })).toEqual({})
  })

  it('validatePersonalData flags missing fields', () => {
    const errors = validatePersonalData({})
    expect(errors.nome).toBeDefined()
    expect(errors.cpf).toBeDefined()
    expect(errors.nasc).toBeDefined()
    expect(errors.tel).toBeDefined()
  })

  it('validateUploadFile accepts PDF, JPG and PNG', () => {
    expect(ALLOWED_UPLOAD_EXTENSIONS.test('documento.pdf')).toBe(true)
    expect(validateUploadFile({
      name: 'extrato.pdf',
      type: 'application/pdf',
      size: MAX_UPLOAD_SIZE_BYTES - 1,
    })).toBe('')
  })

  it('validateUploadFile rejects missing file and oversized file', () => {
    expect(validateUploadFile(null)).toBe('Selecione um arquivo para continuar.')
    expect(validateUploadFile({
      name: 'extrato.pdf',
      type: 'application/pdf',
      size: MAX_UPLOAD_SIZE_BYTES + 1,
    })).toBe('Arquivo muito grande. Limite de 10 MB.')
  })

  it('validateAddress requires the mandatory fields', () => {
    const errors = validateAddress({
      cep: '04032-001',
      logradouro: 'Rua das Flores',
      numero: '184',
      bairro: 'Vila Mariana',
      cidade: 'São Paulo',
      uf: 'SP',
    })
    expect(errors).toEqual({})
  })

  it('validateAddress flags invalid CEP and missing fields', () => {
    const errors = validateAddress({ cep: '123', logradouro: '', numero: '', bairro: '', cidade: '', uf: '' })
    expect(errors.cep).toBe('CEP inválido.')
    expect(errors.logradouro).toBe('Campo obrigatório.')
  })
})
