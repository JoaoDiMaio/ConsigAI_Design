/**
 * Shared UI components used by NovoContrato, Refinanciamento, and Portabilidade.
 * All styles are inline to avoid dependency on page-level CSS classes.
 */

const TOP_BAR = 'linear-gradient(90deg, #043B8B, #2454D6, #00A86B)'
const HERO_BG = 'radial-gradient(circle at 92% 8%, rgba(4,59,139,.08), transparent 34%), radial-gradient(circle at 10% 100%, rgba(0,168,107,.05), transparent 34%), linear-gradient(180deg, #FFFFFF 0%, #F8FBFF 100%)'

/**
 * Standardized hero section for simulation pages.
 * @param {string} kicker - Uppercase label above the title
 * @param {string} title - Main heading text (plain part)
 * @param {string} titleAccent - Word(s) inside the heading rendered in green
 * @param {string} body - Paragraph copy below the heading
 * @param {string[]} [chips] - Optional trust chips shown below copy
 */
export function PageHero({ kicker, title, titleAccent, body, chips }) {
  return (
    <section style={{
      marginBottom: 12,
      padding: '14px 20px',
      borderRadius: 32,
      border: '1px solid #DDE8F6',
      background: HERO_BG,
      boxShadow: '0 20px 50px rgba(3,36,111,.08)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: '0 0 auto 0', height: 5, background: TOP_BAR }} />
      <div style={{ color: '#043B8B', fontSize: 12, fontWeight: 900, letterSpacing: '.12em', textTransform: 'uppercase' }}>
        {kicker}
      </div>
      {title && (
        <h1 style={{ margin: '12px 0 0', color: '#002D6E', fontSize: 'clamp(32px, 3.5vw, 48px)', lineHeight: 1, fontWeight: 950, letterSpacing: '-.06em' }}>
          {title}{titleAccent && <> <span style={{ color: '#00A86B' }}>{titleAccent}</span></>}
        </h1>
      )}
      <p style={{ marginTop: title ? 14 : 8, color: '#64748B', fontSize: 14, lineHeight: 1.5, fontWeight: 600 }}>
        {body}
      </p>
      {chips?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 22 }}>
          {chips.map((c) => (
            <span key={c} style={{ padding: '8px 14px', borderRadius: 999, background: '#F0F7FF', border: '1px solid #DDE8F6', color: '#043B8B', fontSize: 12, fontWeight: 800 }}>
              {c}
            </span>
          ))}
        </div>
      )}
    </section>
  )
}

const S = {
  card: {
    padding: '24px',
    borderRadius: 24,
    background: '#FFFFFF',
    border: '1px solid #DDE8F6',
    boxShadow: '0 12px 32px rgba(3,36,111,.05)',
  },
  cardTitle: {
    color: '#002D6E',
    fontSize: 14,
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: 0,
  },
  cardSubtitle: {
    marginTop: 6,
    color: '#64748B',
    fontSize: 13,
    lineHeight: 1.4,
    fontWeight: 600,
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    padding: '14px 0',
    borderBottom: '1px solid #F1F5F9',
    fontSize: 14,
    fontWeight: 600,
    color: '#64748B',
  },
  rowValue: { color: '#002D6E', fontWeight: 900 },
  highlight: {
    marginTop: 18,
    padding: '18px 20px',
    borderRadius: 18,
    background: 'linear-gradient(180deg, #F4F9FF 0%, #FFFFFF 100%)',
    border: '1px solid #DDE8F6',
  },
  highlightLabel: { display: 'block', color: '#043B8B', fontSize: 11, fontWeight: 900, letterSpacing: '.05em', textTransform: 'uppercase' },
  highlightValue: { display: 'block', marginTop: 8, color: '#002D6E', fontSize: 24, fontWeight: 950, letterSpacing: '-0.02em' },
  installmentBox: { marginTop: 14, padding: '13px 16px', borderRadius: 21, background: '#F4F8FF', border: '1px solid #DDE8F6' },
  installmentLabel: { display: 'block', color: '#64748B', fontSize: 11, fontWeight: 700 },
  installmentValue: { display: 'block', marginTop: 6, color: '#043B8B', fontSize: 20, fontWeight: 800 },
  trustItem: { display: 'flex', gap: 12, padding: '12px 14px', borderRadius: 16, background: '#F8FAFC', border: '1px solid #F1F5F9' },
  trustIcon: { width: 24, height: 24, borderRadius: '50%', display: 'grid', placeItems: 'center', background: '#E9F8F1', color: '#00A86B', border: '1px solid #BDECD7', fontSize: 12, fontWeight: 900, flexShrink: 0 },
  trustTitle: { display: 'block', color: '#002D6E', fontSize: 13, fontWeight: 900 },
  trustText: { display: 'block', marginTop: 4, color: '#64748B', fontSize: 12, lineHeight: 1.4 },
}

const fmtBRL = (n) =>
  Math.round(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 })

const TRUST_ITEMS = [
  ['Sem compromisso', 'Esta etapa é apenas uma simulação.'],
  ['Sem contratação automática', 'Nada é enviado sem sua confirmação.'],
  ['Transparência total', 'Você verá taxa, prazo, parcela e custo total.'],
]

/**
 * "Resumo da oferta" sidebar card.
 */
export function ResumoCard({ title = 'Resumo da oferta', subtitle = 'Confira as principais condições simuladas.', highlight = null, rows = [], style }) {
  return (
    <div style={{ ...S.card, ...style }}>
      <h3 style={S.cardTitle}>{title}</h3>
      <p style={S.cardSubtitle}>{subtitle}</p>
      {highlight && (
        <div style={S.highlight}>
          <small style={S.highlightLabel}>{highlight.label}</small>
          <strong style={S.highlightValue}>{highlight.value}</strong>
        </div>
      )}
      <div style={{ marginTop: highlight ? 0 : 12 }}>
        {rows.map(({ label, value }, i) => (
          <div key={label} style={{ ...S.row, borderBottom: i === rows.length - 1 ? 'none' : '1px solid #F1F5F9' }}>
            <span>{label}</span>
            <strong style={S.rowValue}>{value}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * "Impacto no bolso" sidebar card.
 */
export function ImpactoCard({
  liquidoAntes,
  liquidoDepois,
  novaParcela,
  antesNote = 'sem esta nova parcela',
  depoisNote = 'com a parcela estimada',
  subtitle = 'Veja quanto sobra depois da nova parcela.',
  style,
}) {
  return (
    <div style={{ ...S.card, ...style }}>
      <h3 style={S.cardTitle}>Salário líquido</h3>
      <p style={S.cardSubtitle}>{subtitle}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
        <div style={{ borderRadius: 18, border: '1px solid #E2E8F0', background: '#F8FAFC', padding: '12px 14px' }}>
          <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', color: '#64748B', marginBottom: 6, letterSpacing: '0.05em' }}>Antes</p>
          <p style={{ fontSize: 18, fontWeight: 900, color: '#475569', letterSpacing: '-0.02em' }}>{fmtBRL(liquidoAntes)}</p>
          <p style={{ fontSize: 11, color: '#64748B', marginTop: 4, fontWeight: 600 }}>{antesNote}</p>
        </div>
        <div style={{ borderRadius: 18, border: '1px solid #BDECD7', background: '#F0FFF8', padding: '12px 14px' }}>
          <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', color: '#007A52', marginBottom: 6, letterSpacing: '0.05em' }}>Depois</p>
          <p style={{ fontSize: 18, fontWeight: 900, color: '#007A52', letterSpacing: '-0.02em' }}>{fmtBRL(liquidoDepois)}</p>
          <p style={{ fontSize: 11, color: '#007A52', opacity: 0.9, marginTop: 4, fontWeight: 600 }}>{novaParcela ? `Parcela ${novaParcela}` : depoisNote}</p>
        </div>
      </div>
    </div>
  )
}

/**
 * "Você está no controle" sidebar card.
 */
export function ControleCard({ horizontal = false, items }) {
  const list = items || TRUST_ITEMS
  if (horizontal) {
    return (
      <div style={{ ...S.card, padding: '20px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 260px) 1fr', gap: 32, alignItems: 'center' }}>
          <div>
            <h3 style={S.cardTitle}>Você está no controle</h3>
            <p style={{ ...S.cardSubtitle, marginTop: 6 }}>
              Antes de avançar, confira as condições principais com calma e clareza.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${list.length}, 1fr)`, gap: 12 }}>
            {list.map(([title, text]) => (
              <div key={title} style={{ ...S.trustItem, flexDirection: 'column', gap: 6, padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={S.trustIcon}>✓</span>
                  <strong style={S.trustTitle}>{title}</strong>
                </div>
                <small style={{ ...S.trustText, marginLeft: 0 }}>{text}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  return (
    <div style={S.card}>
      <h3 style={S.cardTitle}>Você está no controle</h3>
      <p style={S.cardSubtitle}>Antes de avançar, a ConsigAI mostra as condições principais para você decidir com calma e clareza.</p>
      <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
        {list.map(([title, text]) => (
          <div key={title} style={S.trustItem}>
            <span style={S.trustIcon}>✓</span>
            <div>
              <strong style={S.trustTitle}>{title}</strong>
              <small style={S.trustText}>{text}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
