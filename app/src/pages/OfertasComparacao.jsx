import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'
import logoSvg from '../assets/logo.svg'
import logoIconSvg from '../assets/logo-icon.svg'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card, CardAccentLine, CardRow } from '../components/Card'
import { PageBackground, PageContent, BottomBar } from '../components/PageBackground'
import { colors, fontWeight, radius, shadow, spacing, gradient } from '../ui/theme'

// ─── Data ─────────────────────────────────────────────────────────────────────
const OFFERS = [
  {
    id: 'combo',
    badge: { label: '★ Recomendado', variant: 'gold' },
    title: 'Dinheiro + Economia',
    primaryLabel: 'Valor liberado na conta',
    primaryValue: 'R$ 5.034',
    greenLabel: 'Economia estimada',
    greenValue: 'R$ 2.399',
    mini: [
      { label: 'Prazo', value: 'Mantido' },
      { label: 'Parcela', value: 'Menor' },
      { label: 'Tempo da dívida', value: 'Mantido' },
    ],
    desc: 'Receba dinheiro, reduza a parcela e mantenha o prazo sob controle.',
  },
  {
    id: 'turbo',
    badge: { label: 'Maior economia', variant: 'green' },
    title: 'Turbo Economia 🚀',
    greenLabel: 'Economia estimada',
    greenValue: 'R$ 2.960',
    mini: [
      { label: 'Economia/mês', value: 'R$ 149' },
      { label: 'Dinheiro novo', value: 'Não' },
      { label: 'Foco', value: 'Custo total' },
    ],
    desc: 'Pague menos no total sem contratar dinheiro novo.',
  },
  {
    id: 'refin',
    badge: { label: 'Dinheiro agora', variant: 'blue' },
    title: 'Refinanciamento',
    primaryLabel: 'Valor liberado na conta',
    primaryValue: 'R$ 2.500',
    mini: [
      { label: 'Parcela estimada', value: 'R$ 464' },
      { label: 'Prazo', value: '48 meses' },
      { label: 'Custo total', value: 'Ver detalhes' },
    ],
    desc: 'Libere valor imediato refinanciando um contrato existente.',
  },
]

const BEFORE_METRICS = [
  { icon: 'bag',    label: 'Parcela atual',    value: 'R$ 550',   red: true },
  { icon: 'coins',  label: 'Sobra estimada',   value: 'R$ 1.650' },
  { icon: 'shield', label: 'Dinheiro novo',    value: '—' },
]

const AFTER_METRICS = [
  { icon: 'bag',    label: 'Nova parcela',      value: 'R$ 496',   green: true },
  { icon: 'coins',  label: 'Sobra estimada',    value: 'R$ 1.704', green: true },
  { icon: 'cash',   label: 'Dinheiro na conta', value: 'R$ 5.034', green: true },
]

const GAIN_LINES = [
  { label: 'Economia no contrato', value: 'R$ 2.399' },
  { label: 'Parcela menor/mês',    value: '− R$ 54'  },
  { label: 'Dinheiro liberado',    value: 'R$ 5.034' },
]

const AI_SUMMARY_ROWS = [
  { label: 'Oferta sugerida',   value: 'Dinheiro + Economia' },
  { label: 'Receba na conta',   value: 'R$ 5.034' },
  { label: 'Economia estimada', value: 'R$ 2.399', green: true },
  { label: 'Nova parcela',      value: 'R$ 496',   green: true },
]

const TRUST_CHIPS = [
  { icon: 'shield', label: 'Dados protegidos' },
  { icon: 'check',  label: 'Sem compromisso' },
  { icon: 'info',   label: 'Taxas transparentes' },
]

// ─── Micro icons ──────────────────────────────────────────────────────────────
function Icon({ name, size = 18 }) {
  const s = { width: size, height: size, display: 'block' }
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 2 }
  if (name === 'bag')
    return <svg style={s} viewBox="0 0 24 24" {...p}><path d="M6 7h12v13H6z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></svg>
  if (name === 'coins')
    return <svg style={s} viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>
  if (name === 'shield')
    return <svg style={s} viewBox="0 0 24 24" {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>
  if (name === 'cash')
    return <svg style={s} viewBox="0 0 24 24" {...p}><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/></svg>
  if (name === 'check')
    return <svg style={s} viewBox="0 0 24 24" {...p} strokeWidth={2.5}><path d="M20 6 9 17l-5-5"/></svg>
  if (name === 'arrow')
    return <svg style={s} viewBox="0 0 24 24" {...p}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
  if (name === 'info')
    return <svg style={s} viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
  if (name === 'star')
    return <svg style={s} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
  return null
}

// ─── OfferCard ────────────────────────────────────────────────────────────────
function OfferCard({ offer, selected, onSelect }) {
  const [hovered, setHovered] = useState(false)

  return (
    <article
      style={{
        display: 'flex', flexDirection: 'column',
        background: selected ? gradient.cardSelected : colors.white,
        border: selected ? `2px solid rgba(0,231,255,.65)` : `1.5px solid ${colors.line}`,
        borderRadius: radius.xxl,
        padding: spacing[6],
        boxShadow: selected ? shadow.cardSelected : hovered ? shadow.xl : shadow.md,
        transform: hovered && !selected ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'all 200ms ease',
        position: 'relative', overflow: 'hidden',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {selected && <CardAccentLine />}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing[2], marginTop: selected ? 6 : 0 }}>
        <Badge label={offer.badge.label} variant={offer.badge.variant} />
        {selected && (
          <div style={{
            width: 26, height: 26, borderRadius: radius.pill, flexShrink: 0,
            background: gradient.brandAccent,
            display: 'grid', placeItems: 'center',
            color: colors.white, boxShadow: shadow.buttonSm,
          }}>
            <Icon name="check" size={13} />
          </div>
        )}
      </div>

      <h3 style={{ marginTop: spacing[4] + 2, color: colors.navy, fontWeight: fontWeight.heavy, fontSize: 24, lineHeight: 1.08, letterSpacing: '-.05em' }}>
        {offer.title}
      </h3>

      {offer.primaryValue && (
        <div style={{ marginTop: spacing[3] + 2 }}>
          <span style={{ fontSize: 11, color: colors.muted, fontWeight: fontWeight.extrabold }}>{offer.primaryLabel}</span>
          <div style={{ fontSize: 28, fontWeight: fontWeight.heavy, letterSpacing: '-.05em', color: colors.navy, lineHeight: 1.1, marginTop: 2 }}>
            {offer.primaryValue}
          </div>
        </div>
      )}

      {offer.greenValue && (
        <div style={{ marginTop: spacing[3] }}>
          <span style={{ fontSize: 11, color: colors.muted, fontWeight: fontWeight.extrabold }}>{offer.greenLabel}</span>
          <div style={{ fontSize: 28, fontWeight: fontWeight.heavy, letterSpacing: '-.05em', color: colors.green, lineHeight: 1.1, marginTop: 2 }}>
            {offer.greenValue}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: spacing[2] - 1, marginTop: spacing[4] }}>
        {offer.mini.map(m => <CardRow key={m.label} label={m.label} value={m.value} />)}
      </div>

      <p style={{ marginTop: 'auto', paddingTop: spacing[3] + 2, color: colors.muted, fontSize: 13, lineHeight: 1.5, fontWeight: fontWeight.semibold }}>
        {offer.desc}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[2], marginTop: spacing[4] }}>
        <Button variant="link" style={{ fontSize: 13 }}>Ver detalhes</Button>
        {selected ? (
          <Badge label="✓ Selecionada" variant="green" />
        ) : (
          <Button variant="primary" size="sm" onClick={() => onSelect(offer.id)}>
            Selecionar
          </Button>
        )}
      </div>
    </article>
  )
}

// ─── FinanceCol ───────────────────────────────────────────────────────────────
function FinanceCol({ label, metrics, variant }) {
  const isAfter  = variant === 'after'
  const isResult = variant === 'result'
  const iconBg    = isAfter || isResult ? colors.greenSoft : '#EAF2FF'
  const iconColor = isAfter || isResult ? colors.green     : colors.blue

  return (
    <Card variant={isResult ? 'green' : isAfter ? 'flat' : 'flat'} style={{ padding: spacing[5], border: isAfter ? `1px solid ${colors.greenBorder}` : isResult ? `2px solid rgba(0,122,82,.65)` : `1px solid #DCE6F5`, background: isAfter ? 'linear-gradient(160deg,#f2fff9 0%,#fff 70%)' : isResult ? gradient.greenCard : '#F8FBFF', boxShadow: isResult ? shadow.green : 'none' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: spacing[2] - 1,
        padding: `7px ${spacing[3]}px`, borderRadius: radius.pill,
        background: isAfter ? colors.cyanSoft : '#EAF2FF',
        border: isAfter ? `1px solid ${colors.cyanBorder}` : 'none',
        color: colors.navy, fontSize: 11, fontWeight: fontWeight.black,
        letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: spacing[4],
      }}>
        {isAfter && <span style={{ width: 7, height: 7, borderRadius: '50%', background: colors.cyan, boxShadow: '0 0 10px rgba(0,231,255,.8)', display: 'inline-block' }} />}
        {label}
      </div>

      {metrics.map((m, i) => (
        <div key={m.label} style={{
          display: 'grid', gridTemplateColumns: '36px 1fr', gap: spacing[2] + 2,
          alignItems: 'center', padding: `${spacing[3]}px 0`,
          borderBottom: i < metrics.length - 1 ? `1px solid ${isResult || isAfter ? '#C8EDD8' : '#E2ECF8'}` : 'none',
        }}>
          <div style={{ width: 34, height: 34, borderRadius: radius.md + 2, display: 'grid', placeItems: 'center', background: iconBg, color: iconColor }}>
            <Icon name={m.icon} />
          </div>
          <div>
            <small style={{ display: 'block', fontSize: 11, color: colors.muted, fontWeight: fontWeight.extrabold }}>{m.label}</small>
            <strong style={{
              display: 'block', marginTop: 2,
              fontSize: 22, fontWeight: fontWeight.heavy, letterSpacing: '-.05em', lineHeight: 1,
              color: m.red ? colors.red : m.green ? colors.green : colors.navy,
              textDecoration: m.red ? 'line-through' : 'none',
              textDecorationThickness: 3,
            }}>
              {m.value}
            </strong>
          </div>
        </div>
      ))}
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function OfertasComparacao() {
  const navigate  = useNavigate()
  const isMobile  = useMediaQuery('(max-width: 768px)')
  const [selectedId, setSelectedId] = useState('combo')

  const selectedOffer = OFFERS.find(o => o.id === selectedId)

  return (
    <PageBackground>
      {/* ── Topbar ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: gradient.topbar,
        borderBottom: '1px solid rgba(255,255,255,.10)',
        boxShadow: shadow.header,
      }}>
        <div style={{
          maxWidth: 1160, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr auto' : '220px 1fr auto',
          alignItems: 'center',
          gap: spacing[4], padding: isMobile ? `${spacing[3] + 2}px ${spacing[4] + 2}px` : `0 ${spacing[7]}px`,
          minHeight: isMobile ? undefined : 80,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] + 2 }}>
            <img src={logoIconSvg} alt="" style={{ width: 38, height: 38, flexShrink: 0, filter: 'drop-shadow(0 0 8px rgba(0,231,255,.4))' }} />
            <img src={logoSvg} alt="ConsigAI" style={{ height: 26, width: 'auto', opacity: .95 }} />
          </div>

          {!isMobile && (
            <div style={{ textAlign: 'center', padding: `0 ${spacing[4]}px` }}>
              <div style={{ color: colors.white, fontSize: 16, fontWeight: fontWeight.extrabold, letterSpacing: '-.02em', lineHeight: 1.2 }}>
                Compare suas melhores opções de consignado
              </div>
              <div style={{ marginTop: 4, color: 'rgba(255,255,255,.55)', fontSize: 12, fontWeight: fontWeight.semibold }}>
                Simulação sem compromisso · taxas sujeitas à análise
              </div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] + 2, padding: `${spacing[2]}px ${spacing[3] + 2}px`, borderRadius: radius.lg - 2, background: 'rgba(255,255,255,.10)', border: '1px solid rgba(255,255,255,.16)' }}>
            <div style={{ width: 32, height: 32, borderRadius: radius.pill, flexShrink: 0, background: `linear-gradient(135deg,#1878DE,#00E7FF)`, display: 'grid', placeItems: 'center', color: colors.white, fontWeight: fontWeight.black, fontSize: 13 }}>
              C
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.55)', fontWeight: fontWeight.extrabold, textTransform: 'uppercase', letterSpacing: '.07em' }}>Cliente</div>
              <div style={{ fontSize: 14, color: colors.white, fontWeight: fontWeight.extrabold, marginTop: 1 }}>Sr. Carlos ▾</div>
            </div>
          </div>
        </div>
      </header>

      <PageContent>
        {/* ── Hero ── */}
        <Card variant="default" style={{ padding: 0, borderRadius: radius.xxxl }}>
          <CardAccentLine color={`linear-gradient(90deg,${colors.blue},${colors.cyan},${colors.green})`} />
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1.45fr 1fr',
            gap: spacing[8], padding: isMobile ? spacing[5] + 2 : `${spacing[9]}px ${spacing[10]}px`,
            alignItems: 'center',
          }}>
            {/* Left */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: `5px ${spacing[3]}px`, borderRadius: radius.pill, background: colors.blueHaze, border: `1px solid ${colors.blueTint}`, color: colors.blue, fontSize: 11, fontWeight: fontWeight.black, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: spacing[3] + 2 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#31D68B', boxShadow: '0 0 8px rgba(49,214,139,.8)', display: 'inline-block' }} />
                Ofertas encontradas
              </div>

              <h2 style={{ fontSize: isMobile ? 32 : 'clamp(32px,3.8vw,46px)', fontWeight: fontWeight.heavy, letterSpacing: '-.055em', lineHeight: 1.02, color: colors.navy, margin: 0 }}>
                Veja quanto você<br />pode{' '}
                <span style={{ backgroundImage: `linear-gradient(90deg,${colors.green},#00B87A)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  economizar
                </span>
              </h2>

              <p style={{ marginTop: spacing[3] + 2, color: colors.muted, fontSize: 15, lineHeight: 1.6, fontWeight: fontWeight.medium, maxWidth: 480 }}>
                Comparamos seus contratos e encontramos opções para{' '}
                <strong style={{ color: colors.text, fontWeight: fontWeight.bold }}>reduzir parcela</strong>,{' '}
                <strong style={{ color: colors.text, fontWeight: fontWeight.bold }}>receber dinheiro</strong>{' '}
                ou <strong style={{ color: colors.text, fontWeight: fontWeight.bold }}>pagar menos no total</strong>.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[2], marginTop: spacing[5] }}>
                {TRUST_CHIPS.map(chip => (
                  <span key={chip.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: `${spacing[2]}px ${spacing[3] + 2}px`, borderRadius: radius.pill, background: '#F2F7FF', border: `1px solid #DCE8FA`, color: colors.navy, fontSize: 12, fontWeight: fontWeight.extrabold }}>
                    <span style={{ color: colors.blue, display: 'flex' }}><Icon name={chip.icon} size={13} /></span>
                    {chip.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — AI summary */}
            <aside style={{ borderRadius: radius.xxl - 2, border: `1px solid #D4E2F8`, background: 'linear-gradient(160deg,#F7FBFF 0%,#fff 100%)', padding: spacing[6] }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] + 2, marginBottom: spacing[4] }}>
                <Badge label="Recomendação IA" variant="cyan" style={{ gap: spacing[2] - 1 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: colors.cyan, boxShadow: '0 0 14px rgba(0,231,255,.9)', display: 'inline-block' }} />
                </Badge>
              </div>

              <div style={{ padding: `${spacing[2] + 3}px ${spacing[3] + 2}px`, borderRadius: radius.lg - 2, background: '#F0F8FF', border: `1px solid #D6EAF8`, color: colors.muted, fontSize: 12.5, lineHeight: 1.45, fontWeight: fontWeight.semibold, marginBottom: spacing[4] + 2 }}>
                <strong style={{ color: colors.navy }}>Por que esta opção?</strong>{' '}
                Equilibra dinheiro na conta, economia estimada e prazo mantido.
              </div>

              <div style={{ display: 'grid', gap: 0 }}>
                {AI_SUMMARY_ROWS.map((row, i) => (
                  <div key={row.label} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: spacing[3], padding: `${spacing[2] + 3}px 0`, borderBottom: i < AI_SUMMARY_ROWS.length - 1 ? `1px solid #E8F0FA` : 'none' }}>
                    <span style={{ color: colors.muted, fontSize: 12.5, fontWeight: fontWeight.bold }}>{row.label}</span>
                    <strong style={{ fontSize: 21, fontWeight: fontWeight.heavy, letterSpacing: '-.04em', color: row.green ? colors.green : colors.navy }}>
                      {row.value}
                    </strong>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </Card>

        {/* ── Section title ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] + 2, margin: `${spacing[5]}px 0 ${spacing[3] + 2}px` }}>
          <div style={{ width: 3, height: 20, borderRadius: radius.pill, background: gradient.brand }} />
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: fontWeight.black, color: colors.navy, letterSpacing: '-.03em' }}>
            Escolha a melhor opção para você
          </h2>
        </div>

        {/* ── Offer cards ── */}
        <section style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: spacing[4] + 2 }}>
          {OFFERS.map(offer => (
            <OfferCard key={offer.id} offer={offer} selected={selectedId === offer.id} onSelect={setSelectedId} />
          ))}
        </section>

        {/* ── Impact panel ── */}
        <Card variant="default" style={{ marginTop: spacing[7], padding: isMobile ? spacing[5] + 2 : spacing[8] }}>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: spacing[4], marginBottom: spacing[6] }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[1] + 2 }}>
                <div style={{ width: 3, height: 20, borderRadius: radius.pill, background: `linear-gradient(180deg,${colors.green},#00B87A)` }} />
                <h3 style={{ margin: 0, fontSize: 19, fontWeight: fontWeight.heavy, color: colors.navy, letterSpacing: '-.03em' }}>
                  Impacto real no seu bolso
                </h3>
              </div>
              <p style={{ margin: 0, color: colors.muted, fontSize: 13.5, fontWeight: fontWeight.semibold }}>
                Comparativo com: <strong style={{ color: colors.navy }}>{selectedOffer?.title}</strong>
              </p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[2] }}>
              {['Renda: R$ 2.200', 'Parcela atual: R$ 550'].map(chip => (
                <span key={chip} style={{ padding: `7px ${spacing[3]}px`, borderRadius: radius.pill, background: '#F5F8FD', border: `1px solid #DCE6F5`, color: colors.muted, fontSize: 12, fontWeight: 750 }}>
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: spacing[4] }}>
            <FinanceCol label="Antes da oferta"     metrics={BEFORE_METRICS} variant="before" />
            <FinanceCol label="Depois com ConsigAI" metrics={AFTER_METRICS}  variant="after" />

            {/* Gain column */}
            <Card variant="green" style={{ padding: spacing[5] }}>
              <div style={{ display: 'flex', gap: spacing[3] + 2, alignItems: 'center', paddingBottom: spacing[4], borderBottom: `1px solid ${colors.greenBorder}`, marginBottom: spacing[3] + 2 }}>
                <div style={{ width: 46, height: 46, borderRadius: radius.xl - 4, flexShrink: 0, background: `linear-gradient(135deg,${colors.green},#00B87A)`, display: 'grid', placeItems: 'center', color: colors.white, boxShadow: '0 8px 20px rgba(0,122,82,.30)' }}>
                  <Icon name="star" size={22} />
                </div>
                <div>
                  <small style={{ fontSize: 11, color: colors.muted, fontWeight: fontWeight.extrabold, display: 'block' }}>Ganho total estimado</small>
                  <strong style={{ fontSize: 28, fontWeight: fontWeight.heavy, letterSpacing: '-.06em', color: colors.green, lineHeight: 1 }}>R$ 7.433</strong>
                  <span style={{ display: 'block', marginTop: 3, fontSize: 12, color: colors.text, fontWeight: fontWeight.bold }}>em crédito + economia</span>
                </div>
              </div>

              {GAIN_LINES.map(g => (
                <div key={g.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: spacing[2] + 2, padding: `${spacing[2] + 2}px ${spacing[3]}px`, borderRadius: radius.md, marginBottom: spacing[2], background: colors.white, border: `1px solid ${colors.greenBorder}`, fontSize: 12, fontWeight: fontWeight.black, color: colors.navy, textTransform: 'uppercase', letterSpacing: '.03em' }}>
                  <span>{g.label}</span>
                  <strong style={{ color: colors.green, fontSize: 16, letterSpacing: '-.02em', fontWeight: fontWeight.heavy }}>{g.value}</strong>
                </div>
              ))}
            </Card>
          </div>

          <div style={{ marginTop: spacing[4] + 2, display: 'flex', alignItems: 'flex-start', gap: spacing[2] + 2, padding: `${spacing[3]}px ${spacing[4]}px`, borderRadius: radius.lg - 2, background: '#F5F8FD', border: `1px solid #DCE6F5`, color: colors.muted, fontSize: 13, lineHeight: 1.45 }}>
            <span style={{ color: colors.blue, flexShrink: 0, marginTop: 1 }}><Icon name="info" size={15} /></span>
            <span>
              <strong style={{ color: colors.navy }}>Simulação sem compromisso.</strong>{' '}
              Valores estimados com base nos dados informados. Taxas e condições finais sujeitas à análise da instituição financeira.
            </span>
          </div>
        </Card>
      </PageContent>

      {/* ── Bottom bar ── */}
      <BottomBar>
        <div style={{ flex: 1 }}>
          <small style={{ fontSize: 11, color: colors.muted, fontWeight: fontWeight.extrabold, textTransform: 'uppercase', letterSpacing: '.06em' }}>
            Oferta selecionada
          </small>
          <div style={{ fontSize: 16, fontWeight: fontWeight.heavy, color: colors.navy, marginTop: 2, letterSpacing: '-.03em' }}>
            {selectedOffer?.title ?? '—'}
          </div>
          <div style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
            Simulação sem compromisso · sujeita à análise
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 26, fontWeight: fontWeight.heavy, letterSpacing: '-.055em', color: colors.green }}>R$ 7.433</div>
          <div style={{ fontSize: 11, color: colors.muted, fontWeight: fontWeight.extrabold }}>ganho estimado</div>
        </div>

        <Button variant="primary" onClick={() => navigate('/estrategia-combinada')} style={{ minWidth: isMobile ? '100%' : undefined }}>
          Continuar com esta oferta
          <Icon name="arrow" size={17} />
        </Button>
      </BottomBar>
    </PageBackground>
  )
}
