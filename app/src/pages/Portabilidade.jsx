import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'
import logoSvg from '../assets/logo.svg'
import logoIconSvg from '../assets/logo-icon.svg'

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
  danger:      '#d94b4b',
  gold:        '#7a5200',
  goldBg:      '#fffbf0',
  goldLine:    '#edddb0',
  goldBtn:     '#a87000',
  bg:          '#f4f7fd',
  shadow:      '0 8px 28px rgba(0,24,81,.09)',
}

const stateData = {
  eco: {
    newInstallment: 'R$ 496',
    mode:           'eco',
    eyebrow:        'Sem Aumentar o Prazo',
    headlinePrefix: 'Economize até',
    headlineValue:  'R$ 2.399',
    headlineSuffix: '',
    subhead:        'reduzindo o valor total do seu contrato',
    margin:         'R$ 320',
    credit:         'R$ 5.033',
    cta:            'Quero Economizar Agora',
  },
  parc: {
    newInstallment: 'R$ 433',
    mode:           'parc',
    eyebrow:        'Mais Alívio no Orçamento',
    headlinePrefix: 'Economize até',
    headlineValue:  'R$ 117',
    headlineSuffix: 'por mês',
    subhead:        'mais folga no seu orçamento mensal',
    margin:         'R$ 480',
    credit:         'R$ 7.593',
    cta:            'Quero Pagar Menos Agora',
  },
}

// ── Desktop Header ────────────────────────────────────────────────────────────

function DesktopHeader({ clientName, onBack }) {
  const [hovBack, setHovBack] = useState(false)
  return (
    <div style={{ background: t.navy, padding: '28px 40px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        <img src={logoSvg} alt="ConsigAI" style={{ height: 52, width: 'auto' }} />

        <div style={{ flex: 1, maxWidth: 540 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <button
              onClick={onBack}
              onMouseEnter={() => setHovBack(true)}
              onMouseLeave={() => setHovBack(false)}
              style={{
                border: 0, background: hovBack ? 'rgba(255,255,255,.15)' : 'rgba(255,255,255,.08)',
                borderRadius: 8, padding: '4px 10px', cursor: 'pointer', color: 'rgba(255,255,255,.72)',
                fontSize: 12, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                transition: 'background .15s ease',
              }}
            >← Ofertas</button>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 999, background: t.blueLight, padding: '4px 12px 4px 8px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.blue }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', color: t.blue, textTransform: 'uppercase' }}>Portabilidade</span>
            </div>
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-.02em', lineHeight: 1.2 }}>
            Reduza juros e pague menos no total
          </h1>
          <p style={{ margin: '8px 0 0', fontSize: 13, color: 'rgba(255,255,255,.72)', fontWeight: 500, lineHeight: 1.55 }}>
            Transfira seus contratos para uma taxa menor sem precisar receber dinheiro novo.
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

// ── Choice button ─────────────────────────────────────────────────────────────

function ChoiceBtn({ active, onClick, bars, title, sub }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '14px 12px 12px', borderRadius: 16,
        background: active ? t.blue : '#eaeff8',
        border: active ? `1.5px solid ${t.blue2}` : '1.5px solid transparent',
        boxShadow: active ? '0 8px 24px rgba(35,80,200,.28)' : 'none',
        transform: active ? 'translateY(-1px)' : 'none',
        cursor: 'pointer', transition: 'all .22s cubic-bezier(.4,0,.2,1)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        textAlign: 'center', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: 14, justifyContent: 'center' }}>
        {bars.map((h, i) => (
          <span key={i} style={{ width: 9, borderRadius: 3, background: active ? '#fff' : t.blue, opacity: active ? 1 : .35, height: h, transition: '.22s ease', display: 'block' }} />
        ))}
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: active ? '#fff' : t.text, lineHeight: 1.2 }}>{title}</div>
      <div style={{ fontSize: 10, fontWeight: 500, color: active ? 'rgba(255,255,255,.68)' : t.muted, lineHeight: 1.2 }}>{sub}</div>
    </button>
  )
}

// ── Receipt ───────────────────────────────────────────────────────────────────

function ReceiptEco() {
  return (
    <div style={{
      width: 300, flexShrink: 0, borderRadius: 10, padding: '14px 12px 12px',
      border: '1px solid #ececec', color: '#4f4f4f', fontSize: 12,
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      background: 'linear-gradient(180deg, rgba(255,255,255,.45), rgba(0,0,0,.02)), #f5f5f3',
    }}>
      <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 800, letterSpacing: '.02em', color: '#444' }}>RECIBO DE ECONOMIA CONSIGAI</div>
      <div style={{ fontSize: 10, marginTop: 4, textAlign: 'center', color: '#808080' }}>19 de abril de 2025</div>

      <div style={{ fontSize: 10.5, marginTop: 12, fontWeight: 700, color: '#565656' }}>CARLOS EDUARDO MARTINS</div>
      <div style={{ fontSize: 10, marginTop: 6, lineHeight: 1.35, color: '#5f5f5f' }}>
        CPF: 177.665.442-8<br />
        Benefício: Aposentadoria por Tempo de Contribuição<br />
        Nascimento: 30/07/1957<br />
        Valor do Benefício: R$ 2.200
      </div>

      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
      <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 800, color: '#4a4a4a' }}>PARABÉNS! VOCÊ ECONOMIZOU</div>
      <div style={{ textAlign: 'center', marginTop: 2, fontSize: 22, fontWeight: 900, color: '#232323', lineHeight: 1 }}>R$ 2.399</div>
      <div style={{ textAlign: 'center', marginTop: 4, fontSize: 8.5, fontWeight: 700, letterSpacing: '.08em', color: '#888', textTransform: 'uppercase' }}>SEM AUMENTAR O PRAZO</div>
      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, color: '#5b5b5b' }}>
        <thead>
          <tr>
            <th style={{ fontSize: 8, textAlign: 'left', fontWeight: 500, padding: '4px 0 8px', color: '#676767', paddingRight: 10 }}>Cód.</th>
            <th style={{ fontSize: 8, textAlign: 'left', fontWeight: 500, padding: '4px 0 8px', color: '#676767' }}>De → Para</th>
            <th style={{ fontSize: 8, textAlign: 'right', fontWeight: 500, padding: '4px 0 8px', color: '#676767' }}>Economia</th>
          </tr>
        </thead>
        <tbody>
          {[['0056347710','FACTA → Banrisul','R$ 779,14'],['0123472010087','Bradesco → Banrisul','R$ 550,93'],['0056346924','FACTA → Banrisul','R$ 365,63'],['0057628452','FACTA → Banrisul','R$ 167,50'],['622921912','Itaú Consig. → Banrisul','R$ 0,30']].map(([cod, de, eco]) => (
            <tr key={cod}>
              <td style={{ fontSize: 8, padding: '4px 0', paddingRight: 10, whiteSpace: 'nowrap' }}>{cod}</td>
              <td style={{ padding: '4px 0' }}>{de}</td>
              <td style={{ padding: '4px 0', textAlign: 'right' }}>{eco}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#555' }}>Economia Total</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#3b3b3b', whiteSpace: 'nowrap' }}>R$ 1.863,50</span>
      </div>
      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#555', lineHeight: 1.3, flex: 1 }}>Crédito disponível após a liberação da margem</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#3b3b3b', whiteSpace: 'nowrap' }}>até R$ 5.033</span>
        </div>
        <hr style={{ border: 'none', borderTop: '1px dashed #cfcfcf', margin: 0 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#555', lineHeight: 1.3, flex: 1 }}>Margem livre após portabilidade</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#3b3b3b', whiteSpace: 'nowrap' }}>até R$ 320</span>
        </div>
      </div>

      <div style={{ marginTop: 10, padding: '8px 10px', background: '#f0f0ee', borderRadius: 6, border: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 8, color: '#888', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.04em' }}>Protocolo</div>
        <div style={{ fontSize: 8.5, color: '#444', fontWeight: 700, fontFamily: 'ui-monospace, monospace', letterSpacing: '.05em' }}>CSG-2025-04871</div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 4, fontSize: 9.5, color: '#7a7a7a', letterSpacing: '.08em' }}>ConsigAI.com.br</div>
    </div>
  )
}

function ReceiptParc() {
  return (
    <div style={{
      width: 300, flexShrink: 0, borderRadius: 10, padding: '14px 12px 12px',
      border: '1px solid #ececec', color: '#4f4f4f', fontSize: 12,
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      background: 'linear-gradient(180deg, rgba(255,255,255,.45), rgba(0,0,0,.02)), #f5f5f3',
    }}>
      <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 800, letterSpacing: '.02em', color: '#444' }}>RECIBO DE ECONOMIA CONSIGAI</div>
      <div style={{ fontSize: 10, marginTop: 4, textAlign: 'center', color: '#808080' }}>19 de abril de 2025</div>

      <div style={{ fontSize: 10.5, marginTop: 12, fontWeight: 700, color: '#565656' }}>CARLOS EDUARDO MARTINS</div>
      <div style={{ fontSize: 10, marginTop: 6, lineHeight: 1.35, color: '#5f5f5f' }}>
        CPF: 177.665.442-8<br />
        Benefício: Aposentadoria por Tempo de Contribuição<br />
        Nascimento: 30/07/1957<br />
        Valor do Benefício: R$ 2.200
      </div>

      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
      <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 800, color: '#4a4a4a' }}>PARABÉNS! VOCÊ ECONOMIZOU</div>
      <div style={{ textAlign: 'center', marginTop: 2, fontSize: 22, fontWeight: 900, color: '#232323', lineHeight: 1 }}>
        R$ 117<span style={{ fontSize: '55%', fontWeight: 700, verticalAlign: 'middle' }}> /mês</span>
      </div>
      <div style={{ textAlign: 'center', marginTop: 4, fontSize: 8.5, fontWeight: 700, letterSpacing: '.08em', color: '#888', textTransform: 'uppercase' }}>ALÍVIO MENSAL</div>
      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, color: '#5b5b5b' }}>
        <thead>
          <tr>
            <th style={{ fontSize: 8, textAlign: 'left', fontWeight: 500, padding: '4px 0 8px', color: '#676767', paddingRight: 10 }}>Cód.</th>
            <th style={{ fontSize: 8, textAlign: 'left', fontWeight: 500, padding: '4px 0 8px', color: '#676767' }}>De → Para</th>
            <th style={{ fontSize: 8, textAlign: 'right', fontWeight: 500, padding: '4px 0 8px', color: '#676767' }}>Alívio/mês</th>
          </tr>
        </thead>
        <tbody>
          {[['0123472010087','Bradesco → Banrisul','R$ 25,86'],['0056347710','FACTA → Banrisul','R$ 24,85'],['0056346924','FACTA → Banrisul','R$ 12,13'],['0057628452','FACTA → Banrisul','R$ 7,95']].map(([cod, de, alivio]) => (
            <tr key={cod}>
              <td style={{ fontSize: 8, padding: '4px 0', paddingRight: 10, whiteSpace: 'nowrap' }}>{cod}</td>
              <td style={{ padding: '4px 0' }}>{de}</td>
              <td style={{ padding: '4px 0', textAlign: 'right' }}>{alivio}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#555' }}>Alívio por mês</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#3b3b3b', whiteSpace: 'nowrap' }}>R$ 70,79/mês</span>
      </div>
      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#555', lineHeight: 1.3, flex: 1 }}>Margem livre após portabilidade</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#3b3b3b', whiteSpace: 'nowrap' }}>até R$ 480</span>
        </div>
        <hr style={{ border: 'none', borderTop: '1px dashed #cfcfcf', margin: 0 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#555', lineHeight: 1.3, flex: 1 }}>Crédito disponível após a liberação da margem</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#3b3b3b', whiteSpace: 'nowrap' }}>até R$ 7.593</span>
        </div>
      </div>

      <div style={{ marginTop: 10, padding: '8px 10px', background: '#f0f0ee', borderRadius: 6, border: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 8, color: '#888', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.04em' }}>Protocolo</div>
        <div style={{ fontSize: 8.5, color: '#444', fontWeight: 700, fontFamily: 'ui-monospace, monospace', letterSpacing: '.05em' }}>CSG-2025-04871</div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 4, fontSize: 9.5, color: '#7a7a7a', letterSpacing: '.08em' }}>ConsigAI.com.br</div>
    </div>
  )
}

// ── Mini card ─────────────────────────────────────────────────────────────────

function MiniCard({ variant, name, desc, value, onNav }) {
  const isRefin = variant === 'refin'
  const colors = isRefin
    ? { bg: t.goldBg, border: t.goldLine, iconBg: '#fde9a0', iconStroke: '#b07800', nameCl: t.gold, descCl: '#9b7020', divider: t.goldLine, valueCl: t.gold, btnBg: t.goldBtn, detailCl: '#9b7020' }
    : { bg: '#eef4ff', border: '#c0d2f5', iconBg: '#c0d4f8', iconStroke: '#1840a8', nameCl: '#0c3278', descCl: '#4a6fa8', divider: '#c0d2f5', valueCl: '#0c3278', btnBg: '#1840a8', detailCl: '#4a6fa8' }
  const [hov, setHov] = useState(false)

  return (
    <div style={{ borderRadius: 20, border: `1px solid ${colors.border}`, background: colors.bg, overflow: 'hidden', marginBottom: 8 }}>
      <div style={{ padding: '14px 14px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: colors.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {isRefin ? (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="7.5" stroke={colors.iconStroke} strokeWidth="1.5"/>
                <path d="M10 6.5V10.5L12.5 13" stroke={colors.iconStroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M10 4v12M4 10h12" stroke={colors.iconStroke} strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: colors.nameCl, lineHeight: 1.2, marginBottom: 3 }}>{name}</div>
            <div style={{ fontSize: 10.5, fontWeight: 500, color: colors.descCl, lineHeight: 1.35 }}>{desc}</div>
          </div>
        </div>
      </div>
      <div style={{ height: 1, background: colors.divider, margin: '0 14px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '12px 14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, whiteSpace: 'nowrap', color: colors.valueCl }}>
            <span style={{ fontSize: 11, fontWeight: 600 }}>R$</span>
            <span style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, letterSpacing: '-.02em' }}>{value}</span>
          </div>
          <div style={{ fontSize: 9.5, fontWeight: 500, color: colors.detailCl, marginTop: 2 }}>estimado para receber</div>
        </div>
        <button
          onClick={onNav}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            border: 0, borderRadius: 12, color: '#fff', background: colors.btnBg,
            padding: '11px 16px', fontWeight: 600, fontSize: 11.5, lineHeight: 1.2,
            cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 5,
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            boxShadow: '0 4px 10px rgba(0,24,81,.10)',
            transform: hov ? 'translateY(-1px) scale(1.02)' : 'none',
            transition: 'transform .18s ease, box-shadow .18s ease, filter .18s ease',
            filter: hov ? 'brightness(1.03)' : 'none',
          }}
        >
          Ver oferta
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M6 3l5 5-5 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Portabilidade() {
  const navigate    = useNavigate()
  const isDesktop   = useMediaQuery('(min-width: 768px)')
  const clientName  = 'Carlos Eduardo'
  const [mode, setMode]           = useState('eco')
  const [detailsOpen, setDetails] = useState(false)
  const [hovCta, setHovCta]       = useState(false)
  const [hovDetails, setHovDetails] = useState(false)
  const [hovDown, setHovDown]     = useState(false)

  const d = stateData[mode]

  const isEco = mode === 'eco'
  const stateColors = isEco
    ? { bg: t.greenBg, eyebrow: t.green, headline: t.greenSoft, big: t.green, subhead: t.greenSoft }
    : { bg: '#ebf0ff', eyebrow: t.blue, headline: '#2a4a8a', big: t.blue, subhead: '#2a4a8a' }

  const content = (
    <div style={{ maxWidth: isDesktop ? 760 : undefined }}>
      {/* Tag */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: t.blueLight, borderRadius: 999, padding: '4px 12px 4px 8px', marginBottom: 20 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.blue }} />
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', color: t.blue, textTransform: 'uppercase' }}>Portabilidade</span>
      </div>

      {/* Choices */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
        <ChoiceBtn
          active={isEco}
          onClick={() => setMode('eco')}
          bars={[14, 11, 8, 6, 4]}
          title={'Quero\nEconomizar'}
          sub={'Diminuir Minha\nDívida'}
        />
        <ChoiceBtn
          active={!isEco}
          onClick={() => setMode('parc')}
          bars={[8, 8, 8, 8, 8]}
          title={'Parcela\nMenor'}
          sub={'Mais Alívio\nNo Mês'}
        />
      </div>

      {/* Offer card */}
      <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e6ecf8', boxShadow: t.shadow, padding: 16, marginBottom: 22 }}>

        {/* Compare */}
        <div style={{ background: '#f7f9fe', border: `1px solid ${t.line}`, borderRadius: 14, padding: '14px 16px', marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 34px 1fr' }}>
            <div style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '.03em', color: t.muted, textTransform: 'uppercase', lineHeight: 1.25 }}>Parcela<br />Atual</div>
            <div />
            <div style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '.03em', color: t.muted, textTransform: 'uppercase', lineHeight: 1.25, textAlign: 'right' }}>Parcela<br />Nova</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 34px 1fr', alignItems: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, letterSpacing: '-.02em', color: t.danger, textDecoration: 'line-through', textDecorationColor: 'rgba(217,75,75,.55)' }}>R$&nbsp;550</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9eaccf', fontSize: 20, fontWeight: 600, lineHeight: 1 }}>→</div>
            <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, letterSpacing: '-.02em', color: t.greenAccent, textAlign: 'right' }}>{d.newInstallment}</div>
          </div>
        </div>

        {/* State shell */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ borderRadius: 16, padding: '12px 16px', background: stateColors.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, textAlign: 'center', minHeight: 132 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', opacity: .7, color: stateColors.eyebrow, lineHeight: 1 }}>{d.eyebrow}</div>
            <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1, color: stateColors.headline }}>{d.headlinePrefix}</div>
            <div style={{ lineHeight: 1 }}>
              <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-.02em', color: stateColors.big }}>{d.headlineValue}</span>
              {d.headlineSuffix && <span style={{ fontSize: 13, fontWeight: 600, verticalAlign: 'middle', marginLeft: 4, color: stateColors.big }}>{d.headlineSuffix}</span>}
            </div>
            <div style={{ fontSize: 8.5, fontWeight: 500, opacity: .75, color: stateColors.subhead, lineHeight: 1 }}>{d.subhead}</div>
          </div>
        </div>

        {/* Info row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
          <div style={{ borderRadius: 14, padding: '8px 10px 7px', background: '#f0f4ff', border: `1px solid ${t.blueMid}`, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div style={{ fontSize: 8.5, fontWeight: 600, color: '#5572b8', opacity: .72, whiteSpace: 'nowrap', lineHeight: 1 }}>Margem livre de</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: t.blue, lineHeight: 1, whiteSpace: 'nowrap' }}>até {d.margin}</div>
            <div style={{ fontSize: 6.7, fontWeight: 500, color: '#5572b8', opacity: .68, lineHeight: 1 }}>após portabilidade</div>
          </div>
          <div style={{ borderRadius: 14, padding: '8px 10px 7px', background: t.navy, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div style={{ fontSize: 8.5, fontWeight: 600, color: 'rgba(255,255,255,.60)', whiteSpace: 'nowrap', lineHeight: 1 }}>Crédito disponível de</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', lineHeight: 1, whiteSpace: 'nowrap' }}>até {d.credit}</div>
            <div style={{ fontSize: 6.7, fontWeight: 500, color: 'rgba(255,255,255,.55)', lineHeight: 1 }}>após a Liberação da Margem</div>
          </div>
        </div>

        {/* CTA */}
        <button
          onMouseEnter={() => setHovCta(true)}
          onMouseLeave={() => setHovCta(false)}
          style={{
            width: '100%', border: 0, borderRadius: 14, padding: '15px 14px', marginBottom: 8,
            background: hovCta ? t.blue2 : t.blue, color: '#fff', fontSize: 15, fontWeight: 600,
            lineHeight: 1.2, boxShadow: '0 8px 20px rgba(35,80,200,.25)', cursor: 'pointer',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", transition: 'background .15s ease',
          }}
        >{d.cta}</button>

        {/* Toggle details */}
        <button
          onClick={() => setDetails(v => !v)}
          onMouseEnter={() => setHovDetails(true)}
          onMouseLeave={() => setHovDetails(false)}
          style={{
            width: '100%', border: `1.5px solid ${t.blueMid}`, borderRadius: 14, padding: 13,
            background: 'transparent', color: t.blue, fontSize: 13.5, fontWeight: 500, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", transition: 'background .15s ease',
            background: hovDetails ? '#f0f5ff' : 'transparent',
          }}
          aria-expanded={detailsOpen}
        >
          <span>Ver detalhes da oferta</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, transition: 'transform .25s cubic-bezier(.4,0,.2,1)', transform: detailsOpen ? 'rotate(180deg)' : 'none', display: 'block' }}>
            <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Details */}
        {detailsOpen && (
          <div style={{ marginTop: 10, animation: 'fadeIn .22s ease forwards' }}>
            <div style={{ background: '#f7f9fe', border: `1px solid ${t.line}`, borderRadius: 16, padding: 10, display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
              {isEco ? <ReceiptEco /> : <ReceiptParc />}
            </div>
            <button
              onMouseEnter={() => setHovDown(true)}
              onMouseLeave={() => setHovDown(false)}
              style={{
                width: '100%', border: `1.5px solid #d2ddfb`, borderRadius: 14, padding: 13,
                background: hovDown ? '#e6efff' : '#edf3ff', color: t.blue, fontSize: 13, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                transition: 'background .15s ease',
              }}
              onClick={() => window.print()}
            >
              <span aria-hidden="true">⬇</span>
              <span>Fazer download da oferta</span>
            </button>
          </div>
        )}

        <p style={{ fontSize: 8, color: t.muted, textAlign: 'right', marginTop: 10, opacity: .68, fontStyle: 'italic', lineHeight: 1.4 }}>
          Valores estimados. Sujeitos à análise e aprovação de crédito.
        </p>
      </div>

      {/* Other options */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, paddingTop: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: t.text, flex: 1 }}>Outras opções para você</div>
          <div style={{ fontSize: 10, color: t.muted, fontWeight: 500 }}>2 disponíveis</div>
        </div>
        <MiniCard variant="refin" name="Refinanciamento" desc="Receba dinheiro agora sem aumentar sua parcela atual" value="9.547" onNav={() => navigate('/refinanciamento')} />
        <MiniCard variant="novo"  name="Novo Empréstimo"  desc="Mais dinheiro disponível com pequeno ajuste na parcela" value="2.845" onNav={() => navigate('/novo-contrato')} />
      </div>
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>

      <div style={{ minHeight: '100vh', background: t.bg, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: t.text }}>
        {isDesktop ? (
          <>
            <DesktopHeader clientName={clientName} onBack={() => navigate('/ofertas')} />
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 40px 56px' }}>
              {content}
            </div>
          </>
        ) : (
          <>
            <div style={{ background: t.navy, padding: 'max(18px, env(safe-area-inset-top)) 20px 0' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img src={logoIconSvg} alt="" aria-hidden="true" style={{ height: 28, width: 28 }} />
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#fff', letterSpacing: '-.01em' }}>ConsigAI</span>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.55)', fontWeight: 600, marginBottom: 2 }}>Cliente</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{clientName}</div>
                </div>
              </div>
            </div>
            <div style={{ background: t.bg, borderRadius: '26px 26px 0 0', marginTop: -26, padding: '20px 18px calc(24px + env(safe-area-inset-bottom))' }}>
              {content}
            </div>
          </>
        )}
      </div>
    </>
  )
}
