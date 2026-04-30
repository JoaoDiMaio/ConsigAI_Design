import { colors, radius, shadow, spacing } from '../ui/theme'

/**
 * Card base — surface branca com borda e sombra padrão.
 * Variantes: default | selected | green | flat
 */
export function Card({ variant = 'default', style: styleProp, children, ...props }) {
  const variants = {
    default: {
      background: colors.white,
      border: `1px solid ${colors.line}`,
      boxShadow: shadow.md,
    },
    selected: {
      background: 'linear-gradient(160deg,#f0faff 0%,#fff 60%)',
      border: `2px solid rgba(0,231,255,.65)`,
      boxShadow: shadow.cardSelected,
    },
    green: {
      background: 'linear-gradient(160deg,#edfff6 0%,#fff 70%)',
      border: `2px solid rgba(0,122,82,.65)`,
      boxShadow: shadow.green,
    },
    flat: {
      background: '#F8FBFF',
      border: `1px solid #DCE6F5`,
      boxShadow: 'none',
    },
  }

  return (
    <div
      style={{
        borderRadius: radius.xxl,
        padding: spacing[6],
        position: 'relative',
        overflow: 'hidden',
        ...variants[variant],
        ...styleProp,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Linha de separação superior colorida — usada em cards destacados.
 */
export function CardAccentLine({ color }) {
  return (
    <div style={{
      position: 'absolute',
      inset: '0 0 auto 0',
      height: 3,
      background: color ?? `linear-gradient(90deg,#055ECE,#00E7FF)`,
    }} />
  )
}

/**
 * Linha key-value dentro de card (label à esquerda, valor à direita).
 */
export function CardRow({ label, value, valueColor, noBorder, style: styleProp }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing[3],
      padding: `${spacing[2] + 1}px ${spacing[3]}px`,
      borderRadius: radius.md,
      background: '#F5F9FF',
      border: `1px solid #E0EAF8`,
      borderBottom: noBorder ? 0 : undefined,
      ...styleProp,
    }}>
      <span style={{ color: colors.muted, fontSize: 13, fontWeight: 700 }}>{label}</span>
      <strong style={{ color: valueColor ?? colors.green, fontSize: 17, fontWeight: 950, letterSpacing: '-.03em', whiteSpace: 'nowrap' }}>
        {value}
      </strong>
    </div>
  )
}
