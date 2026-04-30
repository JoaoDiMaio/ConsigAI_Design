import { appFontFamily, colors, fontWeight, gradient, radius, shadow, spacing } from '../ui/theme'

const VARIANTS = {
  primary: {
    background: gradient.button,
    color: colors.white,
    border: 0,
    boxShadow: shadow.button,
  },
  ghost: {
    background: 'transparent',
    color: colors.mutedAlt,
    border: `1.5px solid ${colors.blueTint}`,
    boxShadow: 'none',
  },
  green: {
    background: `linear-gradient(135deg,${colors.green},#00B87A)`,
    color: colors.white,
    border: 0,
    boxShadow: shadow.green,
  },
  link: {
    background: 'none',
    color: colors.blue,
    border: 0,
    boxShadow: 'none',
    padding: 0,
    minHeight: 'unset',
  },
}

const SIZES = {
  sm: { minHeight: 36, padding: `${spacing[2]}px ${spacing[4]}px`, fontSize: 13, borderRadius: radius.pill },
  md: { minHeight: 52, padding: `0 ${spacing[7]}px`, fontSize: 15, borderRadius: radius.lg },
  lg: { minHeight: 52, padding: `0 ${spacing[7]}px`, fontSize: 15, borderRadius: radius.lg },
}

const BASE_STYLE = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: spacing[2],
  fontFamily: appFontFamily,
  fontWeight: fontWeight.black,
  cursor: 'pointer',
  transition: 'transform 160ms ease, box-shadow 160ms ease',
}

export function Button({
  variant = 'primary',
  fullWidth = false,
  size = 'md',
  icon,
  iconRight,
  children,
  style: styleProp,
  ...props
}) {
  return (
    <button
      type="button"
      style={{
        ...BASE_STYLE,
        ...(SIZES[size] ?? SIZES.md),
        ...(VARIANTS[variant] ?? VARIANTS.primary),
        width: fullWidth ? '100%' : undefined,
        ...styleProp,
      }}
      {...props}
    >
      {icon ? <span style={{ display: 'inline-flex', flexShrink: 0 }}>{icon}</span> : null}
      {children}
      {iconRight ? <span style={{ display: 'inline-flex', flexShrink: 0 }}>{iconRight}</span> : null}
    </button>
  )
}
