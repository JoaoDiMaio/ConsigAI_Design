// Funções de formatação e apresentação reutilizáveis.
// Sem dependências React — seguro importar em qualquer contexto.

export { fmt, fmtDec } from './offerUtils'

/** Extrai número de uma string BRL: "R$ 1.234,56" → 1234.56 */
export const parseMoney = (value) => {
  const match = String(value ?? '').match(/[\d.,]+/)
  if (!match) return 0
  return parseFloat(match[0].replace(/\./g, '').replace(',', '.')) || 0
}

/** Honorífico contextual: "Carlos Silva" → "Sr. Carlos" */
const FEMALE_FIRST_NAMES = new Set([
  'maria', 'ana', 'mariana', 'juliana', 'patricia', 'fernanda', 'carla',
  'paula', 'renata', 'beatriz', 'camila', 'bruna', 'aline', 'leticia',
  'daniela', 'adriana', 'simone', 'fabiana', 'claudia',
])

export function toClientCallName(clientName) {
  const full = String(clientName || '').trim()
  if (!full) return 'Cliente'
  const firstName = full.split(/\s+/)[0]
  const norm = firstName.toLowerCase()
  const honorific = FEMALE_FIRST_NAMES.has(norm) || /a$/.test(norm) ? 'Sra.' : 'Sr.'
  return `${honorific} ${firstName}`
}
