export function OperationGuideCard({ badge, title, subtitle, steps, finalTitle, finalText, badges, style }) {
  return (
    <section style={{
      padding: '22px',
      borderRadius: '28px',
      color: 'white',
      background: `
        radial-gradient(circle at 88% 10%, rgba(0,231,255,0.20), transparent 34%),
        linear-gradient(160deg, #03246F 0%, #071B45 55%, #002D6E 100%)
      `,
      border: '1px solid rgba(255,255,255,.08)',
      boxShadow: '0 24px 56px rgba(3,36,111,.22)',
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box',
      ...style,
    }}>
      <div style={{
        position: 'absolute', width: 240, height: 240,
        right: -130, bottom: -130, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,231,255,0.20), transparent 64%)',
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '7px 10px', borderRadius: 999,
          background: 'rgba(255,255,255,.10)', border: '1px solid rgba(255,255,255,.16)',
          color: '#DDE8F6', fontSize: 10, fontWeight: 950,
          textTransform: 'uppercase', letterSpacing: '.08em',
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00E7FF', boxShadow: '0 0 10px rgba(0,231,255,.9)', display: 'inline-block', flexShrink: 0 }} />
          {badge}
        </div>

        <h2 style={{ margin: '18px 0 0', color: 'white', fontSize: 23, lineHeight: .98, fontWeight: 950, letterSpacing: '-0.05em' }}>
          {title}
        </h2>

        <p style={{ margin: '12px 0 0', color: 'rgba(255,255,255,.76)', fontSize: 12.5, lineHeight: 1.45, fontWeight: 650 }}>
          {subtitle}
        </p>

        <div style={{ display: 'grid', gap: 10, marginTop: 16, marginBottom: 14 }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: 11, borderRadius: 16, background: 'rgba(255,255,255,.10)', border: '1px solid rgba(255,255,255,.14)' }}>
              <div style={{
                flexShrink: 0, width: 24, height: 24, borderRadius: '50%',
                background: 'rgba(255,255,255,.15)', display: 'grid', placeItems: 'center',
                fontSize: 11, fontWeight: 950, color: '#00E7FF',
              }}>{i + 1}</div>
              <div>
                <span style={{ display: 'block', color: 'rgba(255,255,255,.50)', fontSize: 9, fontWeight: 950, textTransform: 'uppercase', letterSpacing: '.08em' }}>{step.label}</span>
                <strong style={{ display: 'block', color: 'white', fontSize: 12, fontWeight: 950 }}>{step.title}</strong>
                <span style={{ display: 'block', marginTop: 3, color: 'rgba(255,255,255,.70)', fontSize: 10.5, lineHeight: 1.25, fontWeight: 650 }}>{step.body}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '14px 16px', borderRadius: 16, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)' }}>
          <strong style={{ display: 'block', color: '#fff', fontSize: 13, fontWeight: 950 }}>{finalTitle}</strong>
          <span style={{ display: 'block', marginTop: 5, color: 'rgba(255,255,255,.65)', fontSize: 11.5, lineHeight: 1.35, fontWeight: 650 }}>{finalText}</span>
        </div>

        {badges?.length > 0 && (
          <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
            {badges.map(b => (
              <div key={b} style={{
                padding: 11,
                borderRadius: 16,
                background: 'rgba(255,255,255,.10)',
                border: '1px solid rgba(255,255,255,.14)',
                color: '#ffffff',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '.01em',
              }}>
                {b}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
