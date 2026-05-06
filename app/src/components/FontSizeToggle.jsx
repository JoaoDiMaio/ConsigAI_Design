import { useFontSize } from '../hooks/useFontSize'
import { colors, shadow } from '../ui/theme'

const DIVIDER = (light) => (
  <span style={{ width: 1, height: 18, background: light ? 'rgba(255,255,255,.22)' : colors.border, margin: '0 6px', flexShrink: 0, alignSelf: 'flex-end' }} />
)

function BigA({ color }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'flex-end', lineHeight: 1 }}>
      <span style={{ fontSize: 18, fontWeight: 900, color, lineHeight: 1 }}>A</span>
      <span style={{ fontSize: 12, fontWeight: 900, color, lineHeight: 1, marginBottom: 1 }}>+</span>
    </span>
  )
}

export function FontSizeToggleFloating() {
  const { enlarged, toggle } = useFontSize()
  return (
    <button
      type="button"
      onClick={toggle}
      title={enlarged ? 'Reduzir fonte' : 'Aumentar fonte'}
      aria-label={enlarged ? 'Reduzir tamanho da fonte' : 'Aumentar tamanho da fonte'}
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 100,
        display: 'inline-flex',
        alignItems: 'flex-end',
        minHeight: 40,
        border: `1px solid ${colors.borderStrong}`,
        borderRadius: 12,
        background: colors.brandSurface,
        padding: '8px 14px',
        cursor: 'pointer',
        fontFamily: 'Inter, Arial, sans-serif',
        boxShadow: shadow.md,
        userSelect: 'none',
        boxSizing: 'border-box',
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 900, color: enlarged ? colors.textMuted : colors.blue, lineHeight: 1 }}>A</span>
      {DIVIDER(false)}
      <BigA color={enlarged ? colors.blue : colors.textMuted} />
    </button>
  )
}

export function FontSizeToggle({ variant = 'header', compact = false }) {
  const { enlarged, toggle } = useFontSize()
  const isHeader = variant === 'header'

  const smallColor = isHeader
    ? (enlarged ? 'rgba(255,255,255,.45)' : '#fff')
    : (enlarged ? colors.textMuted : colors.blue)

  const bigColor = isHeader
    ? (enlarged ? '#fff' : 'rgba(255,255,255,.45)')
    : (enlarged ? colors.blue : colors.textMuted)

  return (
    <button
      type="button"
      onClick={toggle}
      title={enlarged ? 'Reduzir fonte' : 'Aumentar fonte'}
      aria-label={enlarged ? 'Reduzir tamanho da fonte' : 'Aumentar tamanho da fonte'}
      style={{
        display: 'inline-flex',
        alignItems: 'flex-end',
        minHeight: 40,
        border: isHeader ? '1px solid rgba(255,255,255,.18)' : `1px solid ${colors.borderStrong}`,
        borderRadius: compact ? 10 : 12,
        background: isHeader ? 'rgba(255,255,255,.08)' : colors.brandSurface,
        padding: compact ? '8px 10px' : '8px 14px',
        cursor: 'pointer',
        fontFamily: 'Inter, Arial, sans-serif',
        boxShadow: isHeader ? '0 2px 10px rgba(0,0,0,.12)' : shadow.md,
        transition: 'background .15s',
        userSelect: 'none',
        boxSizing: 'border-box',
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 900, color: smallColor, lineHeight: 1, transition: 'color .15s' }}>A</span>
      {DIVIDER(isHeader)}
      <BigA color={bigColor} />
    </button>
  )
}
