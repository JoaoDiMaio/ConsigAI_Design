// Pure utility functions for offer calculations and iframe text normalization.
// No React dependencies — safe to import anywhere including tests.

/** Format number as BRL currency: "R$ X.XXX" */
export const fmt = (v) => `R$ ${Math.round(v).toLocaleString('pt-BR')}`

/** Economia mensal de uma oferta versus parcela atual */
export const getEcoMensal = (offer, parcelaAtual) => {
  const parcelaNova =
    offer?.parcelaNova ??
    parcelaAtual - (offer?.economiaParcela ?? offer?.reducaoMensal ?? 0)
  return Math.max(0, parcelaAtual - parcelaNova)
}

/** Parcela nova formatada de uma oferta */
export const getParcelaNova = (offer, parcelaAtual) => {
  return fmt(offer.parcelaNova ?? parcelaAtual - (offer.economiaParcela ?? 0))
}

/** Remove prefixo antes de R$ (artefato do HTML legado) */
export const formatCurrencyClean = (value) =>
  value.replace(/^[^0-9R$]*(?=R\$)/, '').trim()

// ---------------------------------------------------------------------------
// Mojibake (UTF-8 mal decodificado como Windows-1252/Latin-1).
// Alguns bytes Windows-1252 (0x91-0x94) mapeiam para aspas tipograficas Unicode
// que conflitam com delimitadores de string em alguns parsers — definidos via
// constante \uXXXX para segurança.
// Remover quando o servidor do iframe corrigir o Content-Type charset.
// ---------------------------------------------------------------------------
const SQ_L = '‘' // ' (U+2018, Windows-1252 0x91)
const SQ_R = '’' // ' (U+2019, Windows-1252 0x92)
const DQ_L = '“' // " (U+201C, Windows-1252 0x93)
const DQ_R = '”' // " (U+201D, Windows-1252 0x94)
const EN_DASH = '–' // – (U+2013, Windows-1252 0x96)
const EM_DASH = '—' // — (U+2014, Windows-1252 0x97)
const ELLIPSIS = '…' // … (U+2026, Windows-1252 0x85)
const BULLET = '•'  // • (U+2022, Windows-1252 0x95)

const MOJIBAKE_REPLACEMENTS = [
  // lowercase Portuguese/Spanish accented vowels
  ['Ã¡', 'á'], ['Ã ', 'à'], ['Ã¢', 'â'], ['Ã£', 'ã'], ['Ã¤', 'ä'],
  ['Ã©', 'é'], ['Ã¨', 'è'], ['Ãª', 'ê'], ['Ã«', 'ë'],
  ['Ã­', 'í'], ['Ã¬', 'ì'], ['Ã®', 'î'], ['Ã¯', 'ï'],
  ['Ã³', 'ó'], ['Ã²', 'ò'], ['Ã´', 'ô'], ['Ãµ', 'õ'], ['Ã¶', 'ö'],
  ['Ãº', 'ú'], ['Ã¹', 'ù'], ['Ã»', 'û'], ['Ã¼', 'ü'],
  ['Ã§', 'ç'], ['Ã±', 'ñ'],
  // uppercase
  ['Ã', 'Á'], ['Ã€', 'À'], ['Ã‚', 'Â'], ['Ãƒ', 'Ã'], ['Ã„', 'Ä'],
  ['Ã‰', 'É'], ['Ãˆ', 'È'], ['ÃŠ', 'Ê'], ['Ã‹', 'Ë'],
  ['ÃŒ', 'Ì'], ['ÃŽ', 'Î'],
  ['Ã"', 'Ó'], ['Ã"', 'Ô'], ['Ã•', 'Õ'], ['Ã–', 'Ö'],
  ['Ãš', 'Ú'], ['Ã™', 'Ù'], ['Ã›', 'Û'], ['Ãœ', 'Ü'],
  ['Ã‡', 'Ç'],
  // Windows-1252 special chars with Unicode smart quotes (defined via const above)
  [`Ã${SQ_L}`, 'Ñ'],  // U+00C3 + U+2018 → Ñ
  [`Ã${SQ_R}`, 'Ò'],  // U+00C3 + U+2019 → Ò
  [`â€${SQ_L}`, SQ_L], // â€˜ → '
  [`â€${SQ_R}`, SQ_R], // â€™ → '
  [`â€${DQ_L}`, DQ_L], // â€œ → "  (won't occur but for completeness)
  // misc spacing
  ['Â ', ' '], // Â  → non-breaking space
  ['Â°', '°'],
  // typography
  [`â€${EN_DASH}`, EN_DASH], // â€" → –
  [`â€${EM_DASH}`, EM_DASH], // â€" → —
  [`â€${ELLIPSIS}`, ELLIPSIS], // â€¦ → …
  [`â€${BULLET}`, BULLET],     // â€¢ → •
  ['â€"', EN_DASH], // fallback plain
  ['â€"', EM_DASH], // fallback plain
  ['â€¦', ELLIPSIS], // fallback plain
  ['â€¢', BULLET],   // fallback plain
  [`â†${SQ_R}`, '→'],   // â†' → →
  [`âˆ${SQ_R}`, '−'],   // âˆ' → −
  ['â‰ˆ', '≈'],
  ['â˜…', '★'],
]

export const normalizeMojibakeText = (text) => {
  if (!text) return text
  let fixed = text
  for (const [broken, good] of MOJIBAKE_REPLACEMENTS) {
    if (fixed.includes(broken)) fixed = fixed.split(broken).join(good)
  }
  return fixed
}

export const likelyNeedsTextNormalization = (text) => {
  if (!text) return false
  return (
    text.includes('R$ ') ||
    text.includes('Ã') ||
    text.includes('Â') ||
    text.includes('â')
  )
}

// ---------------------------------------------------------------------------
// API payload normalization
// ---------------------------------------------------------------------------
const asBool = (value) =>
  value === true || value === 1 || value === '1' || value === 'true' || value === 'TRUE'

/**
 * Normaliza payload da API para lista uniforme de { id, isRecommended }.
 * Aceita: array de strings, array de objetos, ou objeto com .offers / .data.offers.
 */
export const normalizeApiOffers = (payload, maxCards) => {
  if (!payload) return []
  const rawList = Array.isArray(payload)
    ? payload
    : Array.isArray(payload.offers)
      ? payload.offers
      : Array.isArray(payload.data?.offers)
        ? payload.data.offers
        : []

  return rawList
    .map((item) => {
      if (typeof item === 'string') return { id: item, isRecommended: false }
      const id = item?.id
      if (!id) return null
      const isRecommended = asBool(
        item?.isRecommended ??
        item?.recommended ??
        item?.recomendada ??
        item?.badgeRecommended ??
        item?.selo_recomendado,
      )
      return { id, isRecommended }
    })
    .filter(Boolean)
    .slice(0, maxCards)
}
