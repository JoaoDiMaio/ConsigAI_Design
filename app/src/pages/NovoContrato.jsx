import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'
import logoSvg from '../assets/logo.svg'
import logoIconSvg from '../assets/logo-icon.svg'

// ── Tokens ────────────────────────────────────────────────────────────────────
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
  gold:        '#7a5200',
  goldBg:      '#fffbf0',
  goldLine:    '#edddb0',
  goldBtn:     '#a87000',
  bg:          '#f4f7fd',
  shadow:      '0 8px 28px rgba(0,24,81,.09)',
}

// ── Oferta data ───────────────────────────────────────────────────────────────
const OFERTA = {
  creditoMaximo:    8400,
  margemDisponivel:  770,
  taxaMensal:       1.88,
  valorMinimo:       500,
  ancoras: [
    { valor: 8400, prazo: 84, parcela: 158.40 },
    { valor: 5000, prazo: 84, parcela:  94.28 },
    { valor: 2500, prazo: 84, parcela:  47.14 },
  ],
  prazosDisponiveis: [24, 48, 84],
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt    = n => Math.round(n).toLocaleString('pt-BR')
const fmtDec = n => n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const calcPMT = (pv, rate, n) => {
  const i = rate / 100
  return pv * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1)
}
const calcCreditFromMargem = (margem) => {
  const i = OFERTA.taxaMensal / 100
  const n = OFERTA.ancoras[0].prazo
  return margem / (i * Math.pow(1 + i, n) / (Math.pow(1 + i, n) - 1))
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
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', color: t.blue, textTransform: 'uppercase' }}>Novo Contrato</span>
            </div>
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-.02em', lineHeight: 1.2 }}>
            Libere crédito novo com prazo e valor ideais
          </h1>
          <p style={{ margin: '8px 0 0', fontSize: 13, color: 'rgba(255,255,255,.72)', fontWeight: 500, lineHeight: 1.55 }}>
            Escolha o valor e veja a parcela que cabe na sua margem disponível.
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

// ── Prazo card ────────────────────────────────────────────────────────────────
function PrazoCard({ prazo, selected, parcela, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: selected ? t.blueLight : hov ? t.blueLight : t.bg,
        border: `2px solid ${selected ? t.blue : hov ? t.blueMid : t.line}`,
        borderRadius: 14, padding: '12px 8px', cursor: 'pointer', textAlign: 'center',
        boxShadow: selected ? '0 4px 14px rgba(35,80,200,.16)' : 'none',
        transform: hov && !selected ? 'translateY(-1px)' : 'none',
        transition: 'all .18s cubic-bezier(.4,0,.2,1)',
        display: 'flex', flexDirection: 'column', gap: 3,
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 700, color: selected ? t.blue : t.text, letterSpacing: '-.02em', lineHeight: 1 }}>{prazo}</div>
      <div style={{ fontSize: 9, fontWeight: 600, color: selected ? '#4a6fa8' : t.muted, lineHeight: 1 }}>parcelas</div>
      <div style={{ fontSize: 9.5, fontWeight: selected ? 700 : 600, color: selected ? t.blue : t.muted, lineHeight: 1.2, marginTop: 3 }}>
        {parcela ? `R$ ${fmtDec(parcela)}/mês` : '—'}
      </div>
    </div>
  )
}

// ── Receipt ───────────────────────────────────────────────────────────────────
function Receipt({ valor, prazo, parcela }) {
  const taxa  = OFERTA.taxaMensal
  const total = parcela * prazo
  const marginLeft = OFERTA.margemDisponivel - parcela
  const today = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div style={{
      width: 300, flexShrink: 0, borderRadius: 10, padding: '14px 12px 12px',
      border: '1px solid #ececec', color: '#4f4f4f', fontSize: 12,
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      background: 'linear-gradient(180deg, rgba(255,255,255,.45), rgba(0,0,0,.02)), #f5f5f3',
    }}>
      <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 800, letterSpacing: '.02em', color: '#444' }}>SIMULAÇÃO DE NOVO CONTRATO — CONSIGAI</div>
      <div style={{ fontSize: 10, marginTop: 4, textAlign: 'center', color: '#808080' }}>{today}</div>

      <div style={{ fontSize: 10.5, marginTop: 12, fontWeight: 700, color: '#565656' }}>CARLOS EDUARDO MARTINS</div>
      <div style={{ fontSize: 10, marginTop: 6, lineHeight: 1.35, color: '#5f5f5f' }}>
        CPF: 177.665.442-8<br />
        Benefício: Aposentadoria por Tempo de Contribuição<br />
        Nascimento: 30/07/1957<br />
        Valor do Benefício: R$ 2.200
      </div>

      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
      <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 800, color: '#4a4a4a' }}>VOCÊ PODE RECEBER HOJE</div>
      <div style={{ textAlign: 'center', marginTop: 2, fontSize: 22, fontWeight: 900, color: '#232323', lineHeight: 1 }}>R$ {fmt(valor)}</div>
      <div style={{ textAlign: 'center', marginTop: 4, fontSize: 8.5, fontWeight: 700, letterSpacing: '.08em', color: '#888', textTransform: 'uppercase' }}>NOVO CRÉDITO CONSIGNADO</div>
      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, color: '#5b5b5b' }}>
        <thead>
          <tr>
            <th style={{ fontSize: 8, textAlign: 'left', fontWeight: 500, padding: '4px 0 8px', color: '#676767', paddingRight: 10 }}>Item</th>
            <th style={{ fontSize: 8, textAlign: 'left', fontWeight: 500, padding: '4px 0 8px', color: '#676767' }}>Detalhe</th>
            <th style={{ fontSize: 8, textAlign: 'right', fontWeight: 500, padding: '4px 0 8px', color: '#676767' }}>Valor</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['Crédito',  'Valor liberado',     `R$ ${fmt(valor)}`],
            ['Prazo',    'Total de parcelas',   `${prazo} meses`],
            ['Parcela',  'Valor mensal',        `R$ ${fmtDec(parcela)}`],
            ['Taxa',     'Juros ao mês',        `${taxa.toFixed(2).replace('.', ',')}% a.m.`],
            ['Banco',    'Instituição',         'Banrisul'],
          ].map(([item, det, val]) => (
            <tr key={item}>
              <td style={{ fontSize: 8, padding: '4px 0', paddingRight: 10, whiteSpace: 'nowrap' }}>{item}</td>
              <td style={{ padding: '4px 0' }}>{det}</td>
              <td style={{ padding: '4px 0', textAlign: 'right' }}>{val}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#555' }}>Total a pagar</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#3b3b3b', whiteSpace: 'nowrap' }}>R$ {fmtDec(total)}</span>
      </div>
      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#555', lineHeight: 1.3, flex: 1 }}>Parcela mensal usada da margem</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#3b3b3b', whiteSpace: 'nowrap' }}>R$ {fmtDec(parcela)}</span>
        </div>
        <hr style={{ border: 'none', borderTop: '1px dashed #cfcfcf', margin: 0 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#555', lineHeight: 1.3, flex: 1 }}>Margem livre restante após contratação</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#3b3b3b', whiteSpace: 'nowrap' }}>
            {marginLeft >= 0 ? `R$ ${fmtDec(marginLeft)}` : 'Indisponível'}
          </span>
        </div>
      </div>

      <div style={{ marginTop: 10, padding: '8px 10px', background: '#f0f0ee', borderRadius: 6, border: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 8, color: '#888', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.04em' }}>Protocolo</div>
        <div style={{ fontSize: 8.5, color: '#444', fontWeight: 700, fontFamily: 'ui-monospace, monospace', letterSpacing: '.05em' }}>CSG-2025-05019</div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 4, fontSize: 9.5, color: '#7a7a7a', letterSpacing: '.08em' }}>ConsigAI.com.br</div>
    </div>
  )
}

// ── Bottom sheet (cross-sell) ─────────────────────────────────────────────────
function BottomSheet({ valor, onClose }) {
  const futuroEco  = Math.round(calcCreditFromMargem(320))
  const futuroParc = Math.round(calcCreditFromMargem(480))
  const valStr     = `R$ ${fmt(valor)}`

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,18,51,.55)', zIndex: 200,
        display: 'flex', alignItems: 'flex-end', animation: 'fadeIn .2s ease forwards',
      }}
    >
      <div style={{
        background: '#fff', borderRadius: '24px 24px 0 0', padding: '12px 20px 28px',
        width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        animation: 'slideUp .28s cubic-bezier(.4,0,.2,1) forwards',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 999, background: t.line, marginBottom: 2 }} />

        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: t.muted, textAlign: 'center' }}>Ótima escolha! Mas olha isso…</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: t.text, textAlign: 'center', lineHeight: 1.2 }}>Faça ainda mais pelo seu futuro</div>
        <div style={{ fontSize: 10.5, fontWeight: 500, color: t.muted, textAlign: 'center', lineHeight: 1.5, marginBottom: 2 }}>
          Com a portabilidade você garante um limite maior disponível quando precisar de crédito de novo.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%' }}>
          {/* Card verde */}
          <button
            onClick={onClose}
            style={{
              border: '2px solid #b8e0ca', borderRadius: 18, padding: '14px 10px', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textAlign: 'center',
              background: t.greenBg, boxShadow: '0 6px 18px rgba(10,102,64,.12)',
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              transition: 'transform .18s ease',
            }}
          >
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', borderRadius: 999, padding: '3px 8px', background: '#c0e8d4', color: t.green, marginBottom: 6 }}>Recomendado</div>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: t.greenSoft, lineHeight: 1 }}>Novo Contrato</div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1, color: t.blue }}>{valStr}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.greenAccent, margin: '4px 0' }}>+</div>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: t.greenSoft, lineHeight: 1 }}>Economia Inteligente</div>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1, color: t.green }}>R$ 2.399</div>
            <div style={{ fontSize: 8.5, fontWeight: 500, color: t.greenSoft, lineHeight: 1.3 }}>de economia</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.greenAccent, margin: '4px 0' }}>+</div>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: t.greenSoft, lineHeight: 1.2 }}>Novo contrato depois</div>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1, color: t.green }}>R$ {fmt(futuroEco)}</div>
            <div style={{ fontSize: 8, fontWeight: 500, color: t.greenSoft }}>disponível</div>
          </button>

          {/* Card azul */}
          <button
            onClick={onClose}
            style={{
              border: `2px solid ${t.blueMid}`, borderRadius: 18, padding: '14px 10px', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textAlign: 'center',
              background: t.blueLight, boxShadow: '0 6px 18px rgba(35,80,200,.10)',
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              transition: 'transform .18s ease',
            }}
          >
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', borderRadius: 999, padding: '3px 8px', background: t.blueLight, color: t.blue, border: `1px solid ${t.blueMid}`, marginBottom: 6 }}>Mais alívio</div>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: '#4a6fa8', lineHeight: 1 }}>Novo Contrato</div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1, color: t.blue }}>{valStr}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.blue, margin: '4px 0' }}>+</div>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: '#4a6fa8', lineHeight: 1 }}>Parcela Menor</div>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1, color: t.blue }}>R$ 117<span style={{ fontSize: '60%', fontWeight: 600 }}>/mês</span></div>
            <div style={{ fontSize: 8.5, fontWeight: 500, color: '#4a6fa8', lineHeight: 1.3 }}>a menos por mês</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.blue, margin: '4px 0' }}>+</div>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: '#4a6fa8', lineHeight: 1.2 }}>Novo contrato depois</div>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1, color: t.blue }}>R$ {fmt(futuroParc)}</div>
            <div style={{ fontSize: 8, fontWeight: 500, color: '#4a6fa8' }}>disponível</div>
          </button>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%', border: `1.5px solid ${t.line}`, borderRadius: 14, background: 'transparent',
            color: t.muted, padding: 13, fontSize: 12, fontWeight: 500, cursor: 'pointer',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            transition: 'border-color .15s ease, color .15s ease',
          }}
        >Não, só o novo contrato por agora</button>
      </div>
    </div>
  )
}

// ── Mini card ─────────────────────────────────────────────────────────────────
function MiniCard({ variant, name, desc, value, detailLabel, onNav }) {
  const isEco = variant === 'eco'
  const colors = isEco
    ? { bg: t.greenBg, border: '#b8e0ca', iconBg: '#c0e8d4', iconStroke: '#0a6640', nameCl: t.green, descCl: t.greenSoft, divider: '#b8e0ca', valueCl: t.green, btnBg: t.green, detailCl: t.greenSoft }
    : { bg: t.goldBg, border: t.goldLine, iconBg: '#fde9a0', iconStroke: '#b07800', nameCl: t.gold, descCl: '#9b7020', divider: t.goldLine, valueCl: t.gold, btnBg: t.goldBtn, detailCl: '#9b7020' }
  const [hov, setHov] = useState(false)

  return (
    <div style={{ borderRadius: 20, border: `1px solid ${colors.border}`, background: colors.bg, overflow: 'hidden', marginBottom: 8 }}>
      <div style={{ padding: '14px 14px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: colors.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {isEco ? (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M4 10h12M10 4l6 6-6 6" stroke={colors.iconStroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="7.5" stroke={colors.iconStroke} strokeWidth="1.5"/>
                <path d="M10 6.5V10.5L12.5 13" stroke={colors.iconStroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
          <div style={{ fontSize: 9.5, fontWeight: 500, color: colors.detailCl, marginTop: 2 }}>{detailLabel}</div>
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
export default function NovoContrato() {
  const navigate   = useNavigate()
  const isDesktop  = useMediaQuery('(min-width: 768px)')
  const clientName = 'Carlos Eduardo'

  // Anchor state: 0=main, 1=mid, 2=low, null=custom
  const [activeAnchor, setActiveAnchor] = useState(0)
  const [customOpen,   setCustomOpen]   = useState(false)
  const [customRaw,    setCustomRaw]    = useState('')
  const [selectedPrazo, setSelectedPrazo] = useState(OFERTA.prazosDisponiveis[OFERTA.prazosDisponiveis.length - 1])
  const [detailsOpen,  setDetailsOpen]  = useState(false)
  const [sheetOpen,    setSheetOpen]    = useState(false)
  const [hovCta,       setHovCta]       = useState(false)
  const [hovDetails,   setHovDetails]   = useState(false)
  const [hovDown,      setHovDown]      = useState(false)
  const inputRef = useRef(null)

  // Derive current offer
  const getOffer = () => {
    if (activeAnchor !== null) {
      const a = OFERTA.ancoras[activeAnchor]
      return { valor: a.valor, prazo: a.prazo, parcela: a.parcela }
    }
    // custom
    const v = parseFloat(customRaw)
    if (v && v >= OFERTA.valorMinimo && v <= OFERTA.creditoMaximo) {
      return { valor: v, prazo: selectedPrazo, parcela: calcPMT(v, OFERTA.taxaMensal, selectedPrazo) }
    }
    return null
  }

  const offer = getOffer()

  const ctaLabel = offer
    ? `Quero Novo Contrato de R$ ${fmt(offer.valor)} em ${offer.prazo}x`
    : 'Quero Novo Contrato'

  // Custom field feedback
  const getFeedback = () => {
    const v = parseFloat(customRaw)
    if (!customRaw || isNaN(v)) return { type: 'idle', text: `Digite um valor entre R$ ${fmt(OFERTA.valorMinimo)} e R$ ${fmt(OFERTA.creditoMaximo)}` }
    if (v > OFERTA.creditoMaximo) return { type: 'warn', text: `Máximo disponível é R$ ${fmt(OFERTA.creditoMaximo)}` }
    if (v < OFERTA.valorMinimo)   return { type: 'warn', text: `Valor mínimo é R$ ${fmt(OFERTA.valorMinimo)}` }
    const p = calcPMT(v, OFERTA.taxaMensal, selectedPrazo)
    return { type: 'ok', text: `✓ ${selectedPrazo}x de R$ ${fmtDec(p)}/mês` }
  }

  const feedback = getFeedback()

  const feedbackColors = {
    ok:   { bg: t.greenBg,   border: '#b8e0ca', color: t.green,  dot: t.greenAccent },
    warn: { bg: '#fff5f5',   border: '#ffc5c5', color: '#a02020', dot: '#d94b4b' },
    idle: { bg: t.blueLight, border: t.blueMid, color: '#4a6fa8', dot: t.blue },
  }[feedback.type]

  const handleSelectAnchor = (idx) => {
    setActiveAnchor(idx)
    setCustomOpen(false)
    setCustomRaw('')
  }

  const handleCustomToggle = () => {
    if (customOpen) {
      handleSelectAnchor(0)
    } else {
      setCustomOpen(true)
      setActiveAnchor(null)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  const handleCustomInput = (e) => {
    setCustomRaw(e.target.value)
  }

  const content = (
    <div style={{ maxWidth: isDesktop ? 760 : undefined }}>
      {/* Tag */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: t.blueLight, borderRadius: 999, padding: '4px 12px 4px 8px', marginBottom: 20 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.blue }} />
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', color: t.blue, textTransform: 'uppercase' }}>Novo Contrato</span>
      </div>

      {/* Section label */}
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: t.muted, marginBottom: 12 }}>
        Escolha o valor que prefere
      </div>

      {/* Main anchor */}
      {(() => {
        const a     = OFERTA.ancoras[0]
        const sel   = activeAnchor === 0
        const [hov, setHov] = [false, () => {}] // no useState in render — handled below
        return (
          <AnchorMain
            a={a}
            selected={sel}
            onClick={() => handleSelectAnchor(0)}
          />
        )
      })()}

      {/* Secondary anchors */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        {OFERTA.ancoras.slice(1).map((a, i) => (
          <AnchorCard key={i} a={a} selected={activeAnchor === i + 1} onClick={() => handleSelectAnchor(i + 1)} />
        ))}
      </div>

      {/* Custom toggle */}
      <div
        onClick={handleCustomToggle}
        style={{
          background: customOpen ? '#dce6fc' : t.blueLight,
          borderRadius: 18,
          border: customOpen ? `2px solid ${t.blue}` : `2px dashed ${t.blueMid}`,
          padding: '16px 14px', cursor: 'pointer',
          display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
          transition: 'all .18s cubic-bezier(.4,0,.2,1)',
          marginBottom: customOpen ? 0 : 14,
        }}
      >
        <div style={{
          width: 26, height: 26, borderRadius: '50%', background: t.blue,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          transform: customOpen ? 'rotate(45deg)' : 'none', transition: 'transform .25s ease',
        }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: t.blue, lineHeight: 1.2, marginBottom: 3 }}>Quero outro valor</div>
          <div style={{ fontSize: 10, fontWeight: 500, color: '#4a6fa8', lineHeight: 1.3 }}>Digite e escolha o prazo ideal</div>
        </div>
      </div>

      {/* Custom area */}
      {customOpen && (
        <div style={{ background: '#fff', border: `1.5px solid ${t.blueMid}`, borderRadius: 20, padding: 16, marginBottom: 14, animation: 'fadeIn .2s ease forwards' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: t.muted, marginBottom: 10 }}>Qual valor você quer?</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: t.bg, border: `1.5px solid ${t.line}`, borderRadius: 12, padding: '10px 14px', marginBottom: 10 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: t.muted, flexShrink: 0 }}>R$</span>
            <input
              ref={inputRef}
              type="number"
              inputMode="numeric"
              placeholder="0"
              value={customRaw}
              onChange={handleCustomInput}
              style={{
                flex: 1, border: 0, background: 'transparent', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontSize: 24, fontWeight: 700, color: t.text, outline: 'none', letterSpacing: '-.02em', minWidth: 0,
              }}
            />
          </div>

          {/* Feedback */}
          <div style={{
            borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'flex-start', gap: 8,
            fontSize: 10, fontWeight: 500, lineHeight: 1.4, marginBottom: 12,
            background: feedbackColors.bg, border: `1px solid ${feedbackColors.border}`, color: feedbackColors.color,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, marginTop: 3, background: feedbackColors.dot }} />
            <span>{feedback.text}</span>
          </div>

          {/* Prazo grid */}
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: t.muted, marginBottom: 8 }}>Escolha o prazo</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {OFERTA.prazosDisponiveis.map(prazo => {
              const v = parseFloat(customRaw)
              const val = v && v >= OFERTA.valorMinimo && v <= OFERTA.creditoMaximo ? v : null
              const parc = val ? calcPMT(val, OFERTA.taxaMensal, prazo) : null
              return (
                <PrazoCard
                  key={prazo}
                  prazo={prazo}
                  selected={selectedPrazo === prazo}
                  parcela={parc}
                  onClick={() => setSelectedPrazo(prazo)}
                />
              )
            })}
          </div>

          {/* Summary — só quando há valor válido */}
          {offer && customOpen && (
            <div style={{ background: t.navy, borderRadius: 20, padding: 16, marginTop: 10, animation: 'fadeIn .22s ease forwards' }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 12 }}>Resumo da oferta</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr 1px 1fr', alignItems: 'center', marginBottom: 14 }}>
                {[['Parcela', `R$ ${fmtDec(offer.parcela)}`, true], null, ['Crédito', `R$ ${fmt(offer.valor)}`, false], null, ['Prazo', `${offer.prazo} meses`, false]].map((item, i) => {
                  if (!item) return <div key={i} style={{ width: 1, background: 'rgba(255,255,255,.1)', height: 36, alignSelf: 'center' }} />
                  const [label, value, highlight] = item
                  return (
                    <div key={i} style={{ textAlign: 'center', padding: '0 4px' }}>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,.45)', fontWeight: 500, marginBottom: 4, lineHeight: 1.2 }}>{label}</div>
                      <div style={{ fontSize: highlight ? 17 : 14, fontWeight: 700, color: highlight ? '#5de89e' : '#fff', lineHeight: 1, letterSpacing: '-.01em' }}>{value}</div>
                    </div>
                  )
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,.06)', borderRadius: 10, padding: '10px 12px' }}>
                <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,.5)', fontWeight: 500 }}>Taxa mensal</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,.8)' }}>{OFERTA.taxaMensal.toFixed(2).replace('.', ',')}% a.m.</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CTA */}
      <button
        onClick={() => setSheetOpen(true)}
        onMouseEnter={() => setHovCta(true)}
        onMouseLeave={() => setHovCta(false)}
        style={{
          width: '100%', border: 0, borderRadius: 14, padding: '15px 14px', marginTop: 14, marginBottom: 8,
          background: hovCta
            ? 'linear-gradient(160deg, #3362dc 0%, #2148be 100%)'
            : 'linear-gradient(160deg, #2f59d0 0%, #1d43b0 100%)',
          color: '#fff', fontSize: 15, fontWeight: 600, lineHeight: 1.2,
          boxShadow: '0 8px 20px rgba(30,60,180,.25)', cursor: 'pointer',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          transition: 'background .15s ease',
        }}
      >{ctaLabel}</button>

      {/* Toggle details */}
      <button
        onClick={() => setDetailsOpen(v => !v)}
        onMouseEnter={() => setHovDetails(true)}
        onMouseLeave={() => setHovDetails(false)}
        style={{
          width: '100%', border: `1.5px solid ${t.blueMid}`, borderRadius: 14, padding: '13px 16px',
          background: hovDetails ? t.blueLight : 'transparent', color: t.blue, fontSize: 13.5, fontWeight: 500,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", transition: 'background .15s ease',
          marginBottom: 0,
        }}
        aria-expanded={detailsOpen}
      >
        <span>Ver detalhes da oferta</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, display: 'block', transform: detailsOpen ? 'rotate(180deg)' : 'none', transition: 'transform .25s cubic-bezier(.4,0,.2,1)' }}>
          <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Details */}
      {detailsOpen && offer && (
        <div style={{ marginTop: 10, animation: 'fadeIn .22s ease forwards' }}>
          <div style={{ background: '#f7f9fe', border: `1px solid ${t.line}`, borderRadius: 16, padding: 10, display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
            <Receipt valor={offer.valor} prazo={offer.prazo} parcela={offer.parcela} />
          </div>
          <button
            onMouseEnter={() => setHovDown(true)}
            onMouseLeave={() => setHovDown(false)}
            onClick={() => window.print()}
            style={{
              width: '100%', border: `1.5px solid #d2ddfb`, borderRadius: 14, padding: 13,
              background: hovDown ? '#e6efff' : '#edf3ff', color: t.blue, fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              transition: 'background .15s ease',
            }}
          >
            <span aria-hidden="true">⬇</span>
            <span>Fazer download da simulação</span>
          </button>
        </div>
      )}

      <p style={{ fontSize: 8, color: t.muted, textAlign: 'right', marginTop: 10, opacity: .68, fontStyle: 'italic', lineHeight: 1.4 }}>
        Valores estimados. Sujeitos à análise e aprovação de crédito.
      </p>

      {/* Other options */}
      <div style={{ marginTop: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: t.text, flex: 1 }}>Outras opções para você</div>
          <div style={{ fontSize: 10, color: t.muted, fontWeight: 500 }}>2 disponíveis</div>
        </div>
        <MiniCard variant="eco"   name="Economia Inteligente" desc="Faça a portabilidade dos seus contratos e economize" value="2.399" detailLabel="estimado de economia"    onNav={() => navigate('/portabilidade')} />
        <MiniCard variant="refin" name="Refinanciamento"       desc="Receba dinheiro agora sem aumentar sua parcela atual" value="9.547" detailLabel="estimado para receber" onNav={() => navigate('/refinanciamento')} />
      </div>

      {/* Bottom sheet */}
      {sheetOpen && (
        <BottomSheet
          valor={offer?.valor ?? OFERTA.ancoras[0].valor}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
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

// ── Anchor sub-components (defined after main to avoid hoisting issues) ────────
function AnchorMain({ a, selected, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: t.blue, borderRadius: 20, padding: '22px 20px 20px', marginBottom: 10, cursor: 'pointer',
        border: selected ? '2px solid rgba(255,255,255,.45)' : `2px solid ${t.blue2}`,
        boxShadow: hov ? '0 14px 32px rgba(35,80,200,.36)' : '0 10px 28px rgba(35,80,200,.28)',
        transform: hov ? 'translateY(-2px)' : 'none',
        transition: 'transform .18s ease, box-shadow .18s ease',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 6,
      }}
    >
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,.15)', borderRadius: 999, padding: '3px 10px 3px 7px' }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#5de89e' }} />
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.07em', color: '#fff', textTransform: 'uppercase' }}>Recomendado</span>
      </div>
      <div style={{ fontSize: 38, fontWeight: 700, color: '#fff', letterSpacing: '-.03em', lineHeight: 1 }}>
        <span style={{ fontSize: 17, fontWeight: 600, verticalAlign: 'baseline', marginRight: 2 }}>R$&nbsp;</span>
        {fmt(a.valor)}
      </div>
      <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,.75)', lineHeight: 1 }}>
        {a.prazo}x de <strong style={{ color: '#fff', fontWeight: 700 }}>R$ {fmtDec(a.parcela)}</strong>
      </div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(93,232,158,.15)', border: '1px solid rgba(93,232,158,.28)', borderRadius: 999, padding: '4px 10px 4px 7px', marginTop: 4 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#5de89e', flexShrink: 0 }} />
        <span style={{ fontSize: 9, fontWeight: 700, color: '#5de89e' }}>✓ Cabe na sua margem</span>
      </div>
    </div>
  )
}

function AnchorCard({ a, selected, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: selected || hov ? '#dce6fc' : t.blueLight,
        borderRadius: 18,
        border: `2px solid ${selected || hov ? t.blue : t.blueMid}`,
        padding: '16px 14px', cursor: 'pointer',
        boxShadow: selected ? '0 4px 16px rgba(35,80,200,.20)' : hov ? '0 6px 16px rgba(35,80,200,.14)' : 'none',
        transform: hov && !selected ? 'translateY(-2px)' : 'none',
        transition: 'all .18s cubic-bezier(.4,0,.2,1)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 700, color: t.blue, letterSpacing: '-.02em', lineHeight: 1 }}>
        <span style={{ fontSize: 12, fontWeight: 600 }}>R$ </span>{fmt(a.valor)}
      </div>
      <div style={{ fontSize: 10, fontWeight: 500, color: '#4a6fa8', lineHeight: 1.3, textAlign: 'center' }}>
        {a.prazo}x de <strong style={{ fontWeight: 700, color: t.blue }}>R$ {fmtDec(a.parcela)}</strong>
      </div>
    </div>
  )
}
