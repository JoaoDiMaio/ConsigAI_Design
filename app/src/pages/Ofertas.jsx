import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'
import logoSvg from '../assets/logo.svg'
import logoIconSvg from '../assets/logo-icon.svg'

// ── Brand tokens (espelho exato do Portabilidade_Final.html) ──────────────────
const t = {
  navy:        '#001851',
  blue:        '#2350c8',
  blue2:       '#1844b8',
  blueLight:   '#e8eeff',
  blueMid:     '#c2d0f8',
  text:        '#0f2057',
  muted:       '#7a8db8',
  line:        '#e4eaf8',
  green:       '#0a6640',
  greenSoft:   '#3d6b52',
  greenBg:     '#e8f5ee',
  greenAccent: '#16a364',
  bg:          '#f4f7fd',
  cardBorder:  '#e6ecf8',
  cardShadow:  '0 8px 28px rgba(0,24,81,.09)',
  choiceInact: '#eaeff8',
}

// ── Theme map ─────────────────────────────────────────────────────────────────
// Cards têm borda/shadow padrão — diferenciação fica só em badge/amount/benefício
const themeMap = {
  blue: {
    badge:   { background: t.blue,        color: '#fff' },
    amount:  { color: t.blue },
    benefit: { background: t.blue,        color: '#fff' },
    cta:     { background: t.blue,        color: '#fff', boxShadow: '0 8px 20px rgba(35,80,200,.25)' },
    ctaHov:  t.blue2,
  },
  green: {
    badge:   { background: t.greenAccent, color: '#fff' },
    amount:  { color: t.green },
    benefit: { background: t.greenBg,     color: t.green },
    cta:     { background: t.blue,        color: '#fff', boxShadow: '0 8px 20px rgba(35,80,200,.25)' },
    ctaHov:  t.blue2,
  },
  slate: {
    badge:   { background: t.text,        color: '#fff' },
    amount:  { color: t.text },
    benefit: { background: t.blueLight,   color: t.text },
    cta:     { background: t.blue,        color: '#fff', boxShadow: '0 8px 20px rgba(35,80,200,.25)' },
    ctaHov:  t.blue2,
  },
}

// ── Data ──────────────────────────────────────────────────────────────────────
const mainCards = [
  {
    badge: 'Recomendado',
    title: 'Receba e economize',
    amount: 'R$ 3.000',
    benefit: 'Economize R$ 2.000 em juros',
    sub: 'Mantendo o prazo atual dos contratos',
    cta: 'Quero esta oferta',
    theme: 'blue',
    prazoLabel: 'Mesmo prazo',
    idealPara: 'Economizar',
  },
  {
    badge: 'Mais alívio',
    title: 'Receba e pague menos',
    amount: 'R$ 500',
    benefit: 'Mais dinheiro no fim do mês',
    sub: 'Com a menor parcela possível após a portabilidade',
    cta: 'Quero esta oferta',
    theme: 'green',
    prazoLabel: 'Menor parcela',
    idealPara: 'Respirar',
  },
  {
    badge: 'Mais opções',
    title: 'Abra novas possibilidades',
    amount: 'R$ 600',
    benefit: 'Prepare espaço para contratar melhor depois',
    sub: 'Ideal para quem quer resolver hoje sem travar amanhã',
    cta: 'Ver estratégia',
    theme: 'slate',
    prazoLabel: 'Flex',
    idealPara: 'Planejar',
  },
]

const soloCards = [
  {
    label: 'Só crédito novo',
    title: 'Novo contrato',
    value: 'R$ 8.400',
    desc: 'Libere dinheiro novo direto, com escolha de valor e prazo ideal.',
    cta: 'Ver novo contrato',
    theme: 'blue',
  },
  {
    label: 'Só refin',
    title: 'Refinanciamento',
    value: 'R$ 9.547',
    desc: 'Receba dinheiro agora usando apenas os contratos já existentes.',
    cta: 'Ver refinanciamento',
    theme: 'slate',
  },
]

// ── Sub-components ─────────────────────────────────────────────────────────────

function BtnPrimary({ children, onClick, onNav }) {
  const [pressing, setPressing] = useState(false)
  const [done, setDone]         = useState(false)
  const [hov, setHov]           = useState(false)

  function handleClick(e) {
    if (done) return
    setPressing(true)
    setTimeout(() => { setPressing(false); setDone(true); onNav?.() }, 120)
    onClick?.(e)
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', border: 0, borderRadius: 14, cursor: done ? 'default' : 'pointer',
        background: done ? t.greenAccent : hov ? t.blue2 : t.blue,
        color: '#fff',
        padding: '15px 14px', fontSize: 15, fontWeight: 600, lineHeight: 1.2,
        boxShadow: done ? '0 8px 20px rgba(22,163,100,.25)' : '0 8px 20px rgba(35,80,200,.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        transform: pressing ? 'scale(.98)' : 'scale(1)',
        transition: 'transform .12s ease, background .2s ease, box-shadow .2s ease',
      }}
    >
      {done ? '✓ Selecionado' : children}
    </button>
  )
}

function MainOfferCard({ card, selected, onSelect, onNav }) {
  const theme = themeMap[card.theme]

  return (
    <div
      onClick={onSelect}
      style={{
        borderRadius: 20,
        padding: 16,
        border: selected ? `1.5px solid ${t.blue}` : `1px solid ${t.cardBorder}`,
        background: '#fff',
        boxShadow: selected
          ? '0 12px 36px rgba(35,80,200,.22)'
          : t.cardShadow,
        cursor: 'pointer',
      }}
    >
      {/* Badges */}
      <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ borderRadius: 999, padding: '4px 11px', fontSize: 10, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', ...theme.badge }}>
          {card.badge}
        </span>
        {selected && (
          <span style={{ borderRadius: 999, padding: '4px 11px', fontSize: 10, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', background: t.blue, color: '#fff' }}>
            ✓ Escolhido
          </span>
        )}
      </div>

      {/* Title */}
      <div style={{ marginBottom: 14, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: t.muted }}>
        {card.title}
      </div>

      {/* Amount */}
      <div style={{ marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${t.line}` }}>
        <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.07em', color: t.muted }}>Você recebe</div>
        <div style={{ marginTop: 6, fontSize: 36, fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1, ...theme.amount }}>
          {card.amount}
        </div>
      </div>

      {/* Benefit */}
      <div style={{ marginBottom: 12, borderRadius: 14, padding: '13px 14px', textAlign: 'center', fontSize: 14, fontWeight: 700, lineHeight: 1.35, ...theme.benefit }}>
        {card.benefit}
      </div>

      {/* Sub */}
      <div style={{ marginBottom: 14, borderRadius: 12, background: t.bg, border: `1px solid ${t.line}`, padding: '11px 13px', fontSize: 12, fontWeight: 500, lineHeight: 1.55, color: t.muted, minHeight: 58 }}>
        {card.sub}
      </div>

      {/* Prazo / Ideal chips */}
      <div style={{ marginBottom: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[['Prazo', card.prazoLabel], ['Ideal para', card.idealPara]].map(([label, value]) => (
          <div key={label} style={{ borderRadius: 12, background: t.choiceInact, padding: '10px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.07em', color: t.muted, opacity: .8 }}>{label}</div>
            <div style={{ marginTop: 5, fontSize: 13, fontWeight: 700, color: t.text }}>{value}</div>
          </div>
        ))}
      </div>

      <BtnPrimary onNav={onNav}>{card.cta}</BtnPrimary>
    </div>
  )
}

function SoloOfferCard({ card, selected, onSelect, onNav }) {
  const theme = themeMap[card.theme]

  return (
    <div
      onClick={onSelect}
      style={{
        borderRadius: 20,
        padding: 16,
        border: selected ? `1.5px solid ${t.blue}` : `1px solid ${t.cardBorder}`,
        background: '#fff',
        boxShadow: selected ? '0 10px 30px rgba(35,80,200,.2)' : t.cardShadow,
        cursor: 'pointer',
      }}
    >
      <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'inline-flex', borderRadius: 999, padding: '4px 11px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', ...theme.badge }}>
          {card.label}
        </div>
        {selected && (
          <div style={{ borderRadius: 999, padding: '4px 11px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', background: t.blue, color: '#fff' }}>
            ✓ Escolhido
          </div>
        )}
      </div>

      <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.07em', color: t.muted }}>Produto</div>
      <div style={{ marginTop: 5, fontSize: 18, fontWeight: 700, color: t.text }}>{card.title}</div>
      <div style={{ marginTop: 10, fontSize: 32, fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1, ...theme.amount }}>{card.value}</div>

      <div style={{ marginTop: 12, borderRadius: 12, background: t.bg, border: `1px solid ${t.line}`, padding: '11px 13px', fontSize: 12, lineHeight: 1.55, color: t.muted }}>
        {card.desc}
      </div>

      <div style={{ marginTop: 14 }}>
        <BtnPrimary onNav={onNav}>{card.cta}</BtnPrimary>
      </div>
    </div>
  )
}

// ── Desktop Header ────────────────────────────────────────────────────────────

function DesktopHeader({ clientName, onLogoClick }) {
  return (
    <div style={{ background: t.navy, padding: '28px 40px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        <button
          type="button"
          onClick={onLogoClick}
          aria-label="Ir para ofertas"
          style={{ border: 0, background: 'transparent', padding: 0, cursor: 'pointer' }}
        >
          <img src={logoSvg} alt="ConsigAI" style={{ height: 52, width: 'auto', display: 'block' }} />
        </button>

        <div style={{ flex: 1, maxWidth: 540 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 999, background: t.blueLight, padding: '4px 12px 4px 8px', marginBottom: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.blue }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', color: t.blue, textTransform: 'uppercase' }}>Suas ofertas</span>
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-.02em', lineHeight: 1.2 }}>
            Escolha o melhor caminho para usar seu crédito
          </h1>
          <p style={{ margin: '8px 0 0', fontSize: 13, color: 'rgba(255,255,255,.72)', fontWeight: 500, lineHeight: 1.55 }}>
            Compare o resultado final — quanto entra na sua conta e o principal benefício.
          </p>
        </div>

        <div style={{ flexShrink: 0, borderRadius: 14, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', padding: '12px 18px', textAlign: 'right' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.07em', color: 'rgba(255,255,255,.55)', fontWeight: 600, marginBottom: 4 }}>Cliente</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{clientName}</div>
        </div>
      </div>
    </div>
  )
}

// ── Tag (padrão do HTML) ──────────────────────────────────────────────────────

function Tag({ children }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: t.blueLight, borderRadius: 999, padding: '4px 12px 4px 8px', marginBottom: 14 }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.blue }} />
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', color: t.blue, textTransform: 'uppercase' }}>{children}</span>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────────

export default function Ofertas() {
  const navigate    = useNavigate()
  const isDesktop   = useMediaQuery('(min-width: 768px)')
  const clientName  = 'Carlos Eduardo'
  const [selectedMain, setSelectedMain] = useState(null)
  const [selectedSolo, setSelectedSolo] = useState(null)

  const mainSection = (
    <>
      {/* Main offers */}
      <Tag>Combinações inteligentes</Tag>
      <h2 style={{ margin: '0 0 6px', fontSize: isDesktop ? 20 : 17, fontWeight: 700, color: t.text }}>
        Ofertas personalizadas para você
      </h2>
      <p style={{ margin: '0 0 18px', fontSize: 12, color: t.muted, fontWeight: 500, lineHeight: 1.55 }}>
        Cada opção combina produtos para maximizar o que entra na sua conta.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isDesktop ? '1fr 1fr 1fr' : '1fr',
        gap: 14,
        marginBottom: 24,
      }}>
        {mainCards.map((card) => (
          <MainOfferCard
            key={card.title}
            card={card}
            selected={selectedMain === card.title}
            onSelect={() => setSelectedMain(v => v === card.title ? null : card.title)}
            onNav={
              card.title === 'Receba e economize'
                ? () => navigate('/novo-economia', { state: { strategyType: 'novo' } })
                : card.title === 'Receba e pague menos'
                  ? () => navigate('/refin-portabilidade', { state: { strategyType: 'refin' } })
                  : card.title === 'Abra novas possibilidades'
                    ? () => navigate('/portabilidade')
                  : undefined
            }
          />
        ))}
      </div>

      {/* Solo section */}
      <div style={{ borderRadius: 20, border: `1px solid ${t.cardBorder}`, background: '#fff', padding: isDesktop ? 22 : 16, boxShadow: t.cardShadow }}>
        <Tag>Ou escolha uma solução direta</Tag>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 16 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: isDesktop ? 18 : 16, fontWeight: 700, color: t.text }}>Produto único</h2>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: t.muted, fontWeight: 500 }}>Para quem já sabe exatamente o que quer.</p>
          </div>
          <div style={{ borderRadius: 10, background: t.choiceInact, padding: '7px 12px', fontSize: 11, fontWeight: 600, color: t.muted }}>
            Menos comparação, decisão mais rápida
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isDesktop ? 'repeat(2, minmax(280px, 360px))' : '1fr',
          justifyContent: 'center',
          gap: 12,
        }}>
          {soloCards.map((card) => {
            const navMap = {
              'Portabilidade': '/portabilidade',
              'Novo contrato': '/novo-contrato',
              'Refinanciamento': '/refinanciamento',
            }
            return (
              <SoloOfferCard
                key={card.title}
                card={card}
                selected={selectedSolo === card.title}
                onSelect={() => setSelectedSolo(v => v === card.title ? null : card.title)}
                onNav={navMap[card.title] ? () => navigate(navMap[card.title]) : undefined}
              />
            )
          })}
        </div>
      </div>
    </>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ minHeight: '100vh', background: t.bg, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: t.text }}>

        {isDesktop ? (
          <>
            <DesktopHeader clientName={clientName} onLogoClick={() => navigate('/ofertas')} />
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 40px 48px' }}>
              {mainSection}
            </div>
          </>
        ) : (
          <>
            {/* Mobile top bar */}
            <div style={{ background: t.navy, padding: 'max(18px, env(safe-area-inset-top)) 20px 0' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 20 }}>
                <button
                  type="button"
                  onClick={() => navigate('/ofertas')}
                  aria-label="Ir para ofertas"
                  style={{ border: 0, background: 'transparent', padding: 0, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                >
                  <img src={logoIconSvg} alt="" aria-hidden="true" style={{ height: 28, width: 28 }} />
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#fff', letterSpacing: '-.01em' }}>ConsigAI</span>
                </button>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.55)', fontWeight: 600, marginBottom: 2 }}>Cliente</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{clientName}</div>
                </div>
              </div>
            </div>

            {/* Panel overlapping header */}
            <div style={{ background: t.bg, borderRadius: '26px 26px 0 0', marginTop: -26, padding: '20px 18px calc(24px + env(safe-area-inset-bottom))' }}>
              {mainSection}
            </div>
          </>
        )}
      </div>
    </>
  )
}
