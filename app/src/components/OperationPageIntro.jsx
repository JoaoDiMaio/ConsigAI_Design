import { semanticColors, radius } from '../ui/theme'

const TOP_BAR = 'linear-gradient(90deg, #043B8B, #2454D6, #00A86B)'

export function OperationPageIntro({ eyebrow, title, description, badges }) {
  return (
    <div style={{
      marginBottom: 20,
      padding: '11px 18px 13px',
      borderRadius: radius.md,
      border: `1px solid ${semanticColors.border}`,
      background: semanticColors.surfaceSubtle,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: '0 0 auto 0', height: 3, background: TOP_BAR }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginTop: 3 }}>
        {eyebrow && (
          <span style={{
            color: semanticColors.brandPrimary,
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: '.12em',
            textTransform: 'uppercase',
          }}>
            {eyebrow}
          </span>
        )}
        <h1 style={{
          margin: 0,
          color: semanticColors.brandDark,
          fontSize: 18,
          fontWeight: 950,
          letterSpacing: '-0.04em',
          lineHeight: 1,
        }}>
          {title}
        </h1>
      </div>
      {description && (
        <p style={{
          margin: '5px 0 0',
          color: semanticColors.textSecondary,
          fontSize: 13,
          lineHeight: 1.5,
          fontWeight: 600,
        }}>
          {description}
        </p>
      )}
      {badges?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          {badges.map(b => (
            <span key={b} style={{
              padding: '5px 10px',
              borderRadius: radius.pill,
              background: semanticColors.brandSoft,
              border: `1px solid ${semanticColors.border}`,
              color: semanticColors.brandPrimary,
              fontSize: 11,
              fontWeight: 800,
            }}>
              {b}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
