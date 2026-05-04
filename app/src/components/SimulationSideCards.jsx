/**
 * Shared UI components used by NovoContrato, Refinanciamento, and Portabilidade.
 * All styles are inline to avoid dependency on page-level CSS classes.
 */

const TOP_BAR = 'linear-gradient(90deg, #055ECE, #1DA1EB, #00E7FF, #007A52)'
const HERO_BG = 'radial-gradient(circle at 92% 8%, rgba(0,231,255,.15), transparent 34%), radial-gradient(circle at 10% 100%, rgba(0,122,82,.07), transparent 34%), linear-gradient(180deg, rgba(255,255,255,.98) 0%, #FFF 100%)'

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
      marginBottom: 28,
      padding: '28px 32px',
      borderRadius: 34,
      border: '1px solid #DDE8F6',
      background: HERO_BG,
      boxShadow: '0 22px 58px rgba(3,36,111,.11)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: '0 0 auto 0', height: 5, background: TOP_BAR }} />
      <div style={{ color: '#055ECE', fontSize: 12, fontWeight: 950, letterSpacing: '.13em', textTransform: 'uppercase' }}>
        {kicker}
      </div>
      <h1 style={{ margin: '10px 0 0', color: '#03246F', fontSize: 'clamp(32px, 3.3vw, 44px)', lineHeight: .98, fontWeight: 950, letterSpacing: '-.07em' }}>
        {title}{titleAccent && <> <span style={{ color: '#007A52' }}>{titleAccent}</span></>}
      </h1>
      <p style={{ marginTop: 12, color: '#64748B', fontSize: 15, lineHeight: 1.45, fontWeight: 650 }}>
        {body}
      </p>
      {chips?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 18 }}>
          {chips.map((c) => (
            <span key={c} style={{ padding: '8px 11px', borderRadius: 999, background: '#F4F8FF', border: '1px solid #DDE8F6', color: '#03246F', fontSize: 12, fontWeight: 850 }}>
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
    padding: '22px',
    borderRadius: 28,
    background: 'rgba(255,255,255,.98)',
    border: '1px solid #DDE8F6',
    boxShadow: '0 16px 38px rgba(3,36,111,.075)',
  },
  cardTitle: {
    color: '#03246F',
    fontSize: 15,
    fontWeight: 900,
    textTransform: 'uppercase',
    margin: 0,
  },
  cardSubtitle: {
    marginTop: 5,
    color: '#64748B',
    fontSize: 12,
    lineHeight: 1.35,
    fontWeight: 650,
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    padding: '12px 0',
    borderBottom: '1px solid #DDE8F6',
    fontSize: 13,
    fontWeight: 700,
    color: '#64748B',
  },
  rowValue: { color: '#03246F', fontWeight: 800 },
  highlight: {
    marginTop: 14,
    padding: 16,
    borderRadius: 21,
    background: 'radial-gradient(circle at 92% 8%, rgba(0,231,255,.12), transparent 34%), linear-gradient(180deg,#F8FBFF 0%, #FFF 100%)',
    border: '1px solid rgba(0,231,255,.34)',
  },
  highlightLabel: { display: 'block', color: '#055ECE', fontSize: 10, fontWeight: 900, letterSpacing: '.08em', textTransform: 'uppercase' },
  highlightValue: { display: 'block', marginTop: 6, color: '#03246F', fontSize: 21, fontWeight: 800 },
  salaryGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 },
  salaryBox: { padding: 16, borderRadius: 21, background: '#F8FBFF', border: '1px solid #DDE8F6' },
  salaryBoxGreen: { padding: 16, borderRadius: 21, background: '#E9F8F1', border: '1px solid #BDECD7' },
  salaryLabel: { display: 'block', color: '#64748B', fontSize: 11, fontWeight: 700 },
  salaryValue: { display: 'block', marginTop: 7, color: '#03246F', fontSize: 21, fontWeight: 800, whiteSpace: 'nowrap' },
  salaryValueGreen: { display: 'block', marginTop: 7, color: '#007A52', fontSize: 21, fontWeight: 800, whiteSpace: 'nowrap' },
  salaryNote: { display: 'block', marginTop: 6, color: '#64748B', fontSize: 11 },
  installmentBox: { marginTop: 14, padding: '13px 16px', borderRadius: 21, background: '#F4F8FF', border: '1px solid #DDE8F6' },
  installmentLabel: { display: 'block', color: '#64748B', fontSize: 11, fontWeight: 700 },
  installmentValue: { display: 'block', marginTop: 6, color: '#055ECE', fontSize: 20, fontWeight: 800 },
  trustItem: { display: 'flex', gap: 10, padding: '11px 12px', borderRadius: 13, background: '#F4F8FF', border: '1px solid #DDE8F6' },
  trustIcon: { width: 22, height: 22, borderRadius: '50%', display: 'grid', placeItems: 'center', background: '#E9F8F1', color: '#007A52', border: '1px solid #BDECD7', fontSize: 12, fontWeight: 800, flexShrink: 0 },
  trustTitle: { display: 'block', color: '#03246F', fontSize: 12, fontWeight: 800 },
  trustText: { display: 'block', marginTop: 3, color: '#64748B', fontSize: 11 },
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
 * @param {string} title - Card heading (e.g. "Resumo da oferta")
 * @param {string} subtitle - Small description below heading
 * @param {{ label: string, value: string } | null} highlight - Optional highlight box (shown above rows)
 * @param {{ label: string, value: string }[]} rows - List of key/value rows
 */
export function ResumoCard({ title = 'Resumo da oferta', subtitle = 'Confira as principais condições simuladas.', highlight = null, rows = [] }) {
  return (
    <div style={S.card}>
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
          <div key={label} style={{ ...S.row, borderBottom: i === rows.length - 1 ? 'none' : '1px solid #DDE8F6' }}>
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
 * @param {number} liquidoAntes - Take-home before new installment
 * @param {number} liquidoDepois - Take-home after new installment
 * @param {string} novaParcela - Formatted installment string (e.g. "R$ 432,10")
 * @param {string} [novaParcelaLabel] - Label for the bottom box (default "Nova parcela total")
 * @param {string} [antesNote] - Note below "Antes" value
 * @param {string} [depoisNote] - Note below "Depois" value
 */
export function ImpactoCard({
  liquidoAntes,
  liquidoDepois,
  novaParcela,
  novaParcelaLabel = 'Nova parcela total',
  antesNote = 'sem esta nova parcela',
  depoisNote = 'com a parcela estimada',
  subtitle = 'Veja quanto sobra depois da nova parcela.',
}) {
  return (
    <div style={S.card}>
      <h3 style={S.cardTitle}>Impacto no bolso</h3>
      <p style={S.cardSubtitle}>{subtitle}</p>
      <div style={S.salaryGrid}>
        <div style={S.salaryBox}>
          <small style={S.salaryLabel}>Antes</small>
          <strong style={S.salaryValue}>{fmtBRL(liquidoAntes)}</strong>
          <span style={S.salaryNote}>{antesNote}</span>
        </div>
        <div style={S.salaryBoxGreen}>
          <small style={S.salaryLabel}>Depois</small>
          <strong style={S.salaryValueGreen}>{fmtBRL(liquidoDepois)}</strong>
          <span style={S.salaryNote}>{depoisNote}</span>
        </div>
      </div>
      <div style={S.installmentBox}>
        <span style={S.installmentLabel}>{novaParcelaLabel}</span>
        <strong style={S.installmentValue}>{novaParcela}</strong>
      </div>
    </div>
  )
}

/**
 * "Você está no controle" sidebar card. No props needed.
 */
export function ControleCard() {
  return (
    <div style={S.card}>
      <h3 style={S.cardTitle}>Você está no controle</h3>
      <p style={S.cardSubtitle}>Antes de avançar, a ConsigAI mostra as condições principais para você decidir com calma e clareza.</p>
      <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
        {TRUST_ITEMS.map(([title, text]) => (
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

