// ConsigAI button format tokens.
// Defines shape, size and weight — not color (each variant owns its palette).

const _bg = 'linear-gradient(145deg, #043B8B, #002D6E)'
const _border = '#BFD4F6'
const _blue = '#043B8B'

const base = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  cursor: 'pointer',
  fontWeight: 900,
  lineHeight: 1.2,
}

// Primary — filled blue, highest prominence
export const btnPrimary = {
  ...base,
  minHeight: 52,
  borderRadius: 13,
  padding: '0 22px',
  fontSize: 16,
  border: 0,
  background: _bg,
  color: '#fff',
  boxShadow: '0 14px 32px rgba(4,59,139,.22)',
}
export const btnPrimaryHoverShadow = '0 18px 36px rgba(4,59,139,.18)'

// Secondary — outline, secondary prominence
export const btnSecondary = {
  ...base,
  minHeight: 48,
  borderRadius: 13,
  padding: '0 22px',
  fontSize: 15,
  background: '#fff',
  color: _blue,
  border: `1px solid ${_border}`,
  boxShadow: '0 8px 20px rgba(4,59,139,.12)',
}
export const btnSecondaryHoverBg = '#F4F8FF'
export const btnSecondaryHoverShadow = '0 12px 24px rgba(4,59,139,.12)'

// Compact secondary — "Voltar para ofertas", lower prominence
export const btnCompact = {
  ...base,
  minHeight: 46,
  borderRadius: 13,
  padding: '0 18px',
  fontSize: 14,
  background: '#fff',
  color: _blue,
  border: `1px solid ${_border}`,
  boxShadow: '0 8px 20px rgba(4,59,139,.12)',
}

// Compact primary — "Baixar recibo da simulação"
export const btnCompactPrimary = {
  ...base,
  minHeight: 46,
  borderRadius: 13,
  padding: '0 18px',
  fontSize: 13,
  border: 0,
  background: _bg,
  color: '#fff',
  boxShadow: '0 8px 20px rgba(4,59,139,.3)',
}

// Toggle — "Personalizar valor e prazo", "Ver detalhes dos contratos"
// bg/border come from getSelectableCardStyle — only shape tokens here
export const btnToggleShape = {
  ...base,
  minHeight: 58,
  borderRadius: 13,
  padding: '0 22px',
  fontSize: 15,
  color: _blue,
  border: '1px solid',
}
