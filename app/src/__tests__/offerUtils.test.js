import { describe, it, expect } from 'vitest'
import {
  fmt,
  getEcoMensal,
  getParcelaNova,
  formatCurrencyClean,
  normalizeMojibakeText,
  likelyNeedsTextNormalization,
  normalizeApiOffers,
} from '../lib/offerUtils.js'

// fmt usa non-breaking space (U+00A0) entre "R$" e o número, igual ao original
const NBSP = ' '
const r = (n) => `R$${NBSP}${n}` // helper para montar expected sem ambiguidade

describe('fmt', () => {
  it('formata valor inteiro', () => {
    expect(fmt(1000)).toBe(r('1.000'))
  })

  it('arredonda decimal', () => {
    expect(fmt(496.17)).toBe(r('496'))
  })

  it('formata zero', () => {
    expect(fmt(0)).toBe(r('0'))
  })

  it('formata valor alto', () => {
    expect(fmt(5033.74)).toBe(r('5.034'))
  })
})

describe('getEcoMensal', () => {
  const parcelaAtual = 550

  it('calcula economia quando parcelaNova menor', () => {
    expect(getEcoMensal({ parcelaNova: 401.05 }, parcelaAtual)).toBe(148.95)
  })

  it('retorna 0 quando parcelaNova maior', () => {
    expect(getEcoMensal({ parcelaNova: 600 }, parcelaAtual)).toBe(0)
  })

  it('usa economiaParcela quando parcelaNova ausente', () => {
    expect(getEcoMensal({ economiaParcela: 148.95 }, parcelaAtual)).toBeCloseTo(148.95)
  })

  it('usa reducaoMensal quando os outros ausentes', () => {
    expect(getEcoMensal({ reducaoMensal: 116.81 }, parcelaAtual)).toBeCloseTo(116.81)
  })

  it('retorna 0 para oferta sem dados de economia', () => {
    expect(getEcoMensal({}, parcelaAtual)).toBe(0)
  })
})

describe('getParcelaNova', () => {
  const parcelaAtual = 550

  it('usa parcelaNova diretamente', () => {
    expect(getParcelaNova({ parcelaNova: 496.17 }, parcelaAtual)).toBe(r('496'))
  })

  it('calcula via economiaParcela quando parcelaNova ausente', () => {
    expect(getParcelaNova({ economiaParcela: 100 }, parcelaAtual)).toBe(r('450'))
  })
})

describe('formatCurrencyClean', () => {
  it('remove prefixo antes de R$', () => {
    expect(formatCurrencyClean('→R$ 496')).toBe('R$ 496')
    expect(formatCurrencyClean('- R$ 496')).toBe('R$ 496')
  })

  it('mantém valor já limpo', () => {
    expect(formatCurrencyClean('R$ 496')).toBe('R$ 496')
  })
})

describe('normalizeMojibakeText', () => {
  it('corrige mojibake de ç', () => {
    expect(normalizeMojibakeText('Ã§')).toBe('ç')
  })

  it('corrige mojibake de é', () => {
    expect(normalizeMojibakeText('Ã©')).toBe('é')
  })

  it('corrige mojibake de ã', () => {
    expect(normalizeMojibakeText('Ã£')).toBe('ã')
  })

  it('texto sem mojibake inalterado', () => {
    expect(normalizeMojibakeText('Olá mundo')).toBe('Olá mundo')
  })

  it('retorna null/undefined sem erro', () => {
    expect(normalizeMojibakeText(null)).toBeNull()
    expect(normalizeMojibakeText('')).toBe('')
  })
})

describe('likelyNeedsTextNormalization', () => {
  it('detecta R$ com espaço simples', () => {
    expect(likelyNeedsTextNormalization('R$ 500')).toBe(true)
  })

  it('detecta prefix de mojibake Ã', () => {
    expect(likelyNeedsTextNormalization('Ã©conomia')).toBe(true)
  })

  it('não detecta texto limpo (sem espaço simples após R$)', () => {
    // fmt produz R$  (non-breaking), não "R$ " com espaço simples
    expect(likelyNeedsTextNormalization(`R$ 500`)).toBe(false)
  })

  it('retorna false para string vazia', () => {
    expect(likelyNeedsTextNormalization('')).toBe(false)
  })
})

describe('normalizeApiOffers', () => {
  const MAX = 3

  it('aceita array de strings', () => {
    const result = normalizeApiOffers(['equilibrio', 'turbo'], MAX)
    expect(result).toEqual([
      { id: 'equilibrio', isRecommended: false },
      { id: 'turbo', isRecommended: false },
    ])
  })

  it('aceita array de objetos com isRecommended', () => {
    const result = normalizeApiOffers(
      [{ id: 'equilibrio', isRecommended: true }, { id: 'turbo' }],
      MAX,
    )
    expect(result[0].isRecommended).toBe(true)
    expect(result[1].isRecommended).toBe(false)
  })

  it('aceita payload com .offers', () => {
    const result = normalizeApiOffers({ offers: ['equilibrio'] }, MAX)
    expect(result[0].id).toBe('equilibrio')
  })

  it('aceita payload com .data.offers', () => {
    const result = normalizeApiOffers({ data: { offers: ['turbo'] } }, MAX)
    expect(result[0].id).toBe('turbo')
  })

  it('respeita limite maxCards', () => {
    const result = normalizeApiOffers(['a', 'b', 'c', 'd'], 2)
    expect(result).toHaveLength(2)
  })

  it('filtra itens sem id', () => {
    const result = normalizeApiOffers([{ id: 'eq' }, { name: 'sem-id' }, { id: 'turbo' }], MAX)
    expect(result).toHaveLength(2)
  })

  it('aceita variantes de isRecommended truthy', () => {
    const inputs = [
      { id: 'a', isRecommended: 1 },
      { id: 'b', recommended: true },
      { id: 'c', recomendada: '1' },
      { id: 'd', badgeRecommended: 'TRUE' },
    ]
    const result = normalizeApiOffers(inputs, 10)
    result.forEach((res) => expect(res.isRecommended).toBe(true))
  })

  it('retorna [] para payload null', () => {
    expect(normalizeApiOffers(null, MAX)).toEqual([])
  })
})
