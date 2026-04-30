import { colors, fontWeight, radius, spacing } from '../ui/theme'

const VARIANTS = {
  gold:  { background: colors.goldSoft,   color: colors.goldText,  border: `1px solid ${colors.goldBorder}` },
  green: { background: colors.greenSoft,  color: colors.green,     border: `1px solid ${colors.greenBorder}` },
  blue:  { background: colors.blueHaze,   color: colors.navy,      border: `1px solid ${colors.blueTint}` },
  cyan:  { background: colors.cyanSoft,   color: colors.navy,      border: `1px solid ${colors.cyanBorder}` },
  muted: { background: colors.lineAlt,    color: colors.mutedAlt,  border: `1px solid ${colors.lineAlt}` },
}

export function Badge({ label, variant = 'blue', style: styleProp }) {
  const v = VARIANTS[variant] ?? VARIANTS.blue
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: spacing[1],
      padding: `${spacing[1]}px ${spacing[3]}px`,
      borderRadius: radius.pill,
      fontSize: 11,
      fontWeight: fontWeight.black,
      letterSpacing: '.07em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      lineHeight: 1,
      ...v,
      ...styleProp,
    }}>
      {label}
    </span>
  )
}
