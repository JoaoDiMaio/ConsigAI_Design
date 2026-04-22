import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { DesktopPageHeader, MobilePageHeader } from '../components/AppHeader'
import { appPageStyle, theme } from '../ui/theme'

const t = {
  ...theme,
  greenSoft:   '#3d6b52',
  gold:        '#7a5200',
  goldBg:      '#fffbf0',
  goldLine:    '#edddb0',
  goldBtn:     '#a87000',
  shadow:      '0 8px 28px rgba(0,24,81,.09)',
}

const SCENARIOS = [
  {
    key: 'dinheiro',
    eyebrow: 'Cenário 1',
    title: 'Máximo dinheiro',
    desc: 'Receba o maior valor possível refinanciando todos os contratos elegíveis',
    cash: 'R$ 12.930',
    installment: 'R$ 1.191/mês',
    margem: 'R$ 56',
    contracts: ['Banco PAN', 'Facta', 'C6 Consig'],
    receiptRows: [
      ['0056347710',    'Banco PAN', 'R$ 3.200'],
      ['0123472010087', 'Facta',     'R$ 5.550'],
      ['0057628452',    'C6 Consig', 'R$ 4.180'],
    ],
    receiptCredito: 'R$ 882',
    colors: {
      bg: t.blueLight, border: t.blueMid, activeBorder: t.blue,
      activeShadow: '0 10px 30px rgba(35,80,200,.20)',
      iconBg: 'rgba(35,80,200,.12)', eyebrow: t.blue,
      kipBg: 'rgba(35,80,200,.08)', kpiLabel: '#4a6fa8', kpiValue: t.blue,
      pillBg: 'rgba(35,80,200,.10)', pillColor: t.blue, pillDot: t.blue,
      radioActive: t.blue,
    },
  },
  {
    key: 'margem',
    eyebrow: 'Cenário 2',
    title: 'Máxima margem livre',
    desc: 'Libere mais espaço na margem para contratar um novo empréstimo maior depois',
    cash: 'R$ 9.730',
    installment: 'R$ 893/mês',
    margem: 'R$ 120',
    contracts: ['Facta', 'C6 Consig'],
    receiptRows: [
      ['0123472010087', 'Facta',     'R$ 5.550'],
      ['0057628452',    'C6 Consig', 'R$ 4.180'],
    ],
    receiptCredito: 'R$ 1.892',
    colors: {
      bg: t.greenBg, border: '#b8e0ca', activeBorder: t.greenAccent,
      activeShadow: '0 10px 30px rgba(10,102,64,.18)',
      iconBg: 'rgba(10,102,64,.12)', eyebrow: t.greenAccent,
      kipBg: 'rgba(10,102,64,.08)', kpiLabel: t.greenSoft, kpiValue: t.green,
      pillBg: 'rgba(10,102,64,.10)', pillColor: t.green, pillDot: t.greenAccent,
      radioActive: t.greenAccent,
    },
  },
  {
    key: 'parcela',
    eyebrow: 'Cenário 3',
    title: 'Menor parcela total',
    desc: 'Reduza ao máximo o comprometimento mensal da sua renda com parcelas',
    cash: 'R$ 5.550',
    installment: 'R$ 381/mês',
    margem: 'R$ 389',
    contracts: ['Facta'],
    receiptRows: [
      ['0123472010087', 'Facta', 'R$ 5.550'],
    ],
    receiptCredito: 'R$ 6.139',
    colors: {
      bg: t.goldBg, border: t.goldLine, activeBorder: t.gold,
      activeShadow: '0 10px 30px rgba(122,82,0,.18)',
      iconBg: 'rgba(122,82,0,.12)', eyebrow: t.goldBtn,
      kipBg: 'rgba(122,82,0,.08)', kpiLabel: t.goldBtn, kpiValue: t.gold,
      pillBg: 'rgba(122,82,0,.10)', pillColor: t.gold, pillDot: t.gold,
      radioActive: t.gold,
    },
  },
]

const SCENARIO_ICONS = [
  // dinheiro
  <svg key="d" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="#2350c8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  // margem
  <svg key="m" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="#16a364" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  // parcela
  <svg key="p" width="20" height="20" viewBox="0 0 24 24" fill="none"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="#a87000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17 6 23 6 23 12" stroke="#a87000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
]

//  Desktop Header 

//  Scenario Card 

function ScenarioCard({ scenario, icon, active, onClick }) {
  const c = scenario.colors
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        width: '100%', textAlign: 'left', border: `2px solid ${active ? c.activeBorder : c.border}`,
        borderRadius: 20, background: c.bg, cursor: 'pointer', padding: 0, overflow: 'hidden',
        boxShadow: active ? c.activeShadow : 'none',
        transform: active ? 'none' : 'none',
        transition: 'border-color .2s ease, box-shadow .2s ease',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        outline: 'none',
      }}
    >
      <div style={{ padding: 14 }}>
        {/* Head */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: c.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: c.eyebrow, marginBottom: 1 }}>{scenario.eyebrow}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.text, lineHeight: 1.2, marginBottom: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{scenario.title}</div>
            <div style={{ fontSize: 10, fontWeight: 500, color: t.muted, lineHeight: 1.35 }}>{scenario.desc}</div>
          </div>
          {/* Radio */}
          <div style={{
            width: 20, height: 20, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: active ? `6px solid ${c.radioActive}` : `2px solid ${t.line}`,
            background: '#fff', transition: 'all .18s ease',
          }} />
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 10 }}>
          {[
            ['Você recebe', scenario.cash],
            ['Nova parcela', scenario.installment],
            ['Margem livre', scenario.margem],
            ['Contratos', scenario.contracts.length + (scenario.contracts.length === 1 ? ' contrato' : ' contratos')],
          ].map(([label, value]) => (
            <div key={label} style={{ borderRadius: 12, padding: '7px 4px', textAlign: 'center', background: c.kipBg, display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
              <div style={{ fontSize: 8.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', lineHeight: 1.2, color: c.kpiLabel }}>{label}</div>
              <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1, letterSpacing: '-.01em', color: c.kpiValue, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Contract pills */}
        <div style={{ paddingTop: 10, borderTop: '1px solid rgba(0,0,0,.06)' }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: t.muted, marginBottom: 6 }}>Contratos incluídos</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {scenario.contracts.map(bank => (
              <span key={bank} style={{ borderRadius: 999, padding: '3px 9px', fontSize: 9, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, background: c.pillBg, color: c.pillColor }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.pillDot, flexShrink: 0, display: 'inline-block' }} />
                {bank}
              </span>
            ))}
          </div>
        </div>
      </div>
    </button>
  )
}

//  Receipt 

function Receipt({ scenario }) {
  const today = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
  return (
    <div style={{
      width: 300, flexShrink: 0, borderRadius: 10, padding: '14px 12px 12px',
      border: '1px solid #ececec', color: '#4f4f4f', fontSize: 12,
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      background: 'linear-gradient(180deg, rgba(255,255,255,.45), rgba(0,0,0,.02)), #f5f5f3',
    }}>
      <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 800, letterSpacing: '.02em', color: '#444' }}>SIMULACAO DE REFINANCIAMENTO - CONSIGAI</div>
      <div style={{ fontSize: 10, marginTop: 4, textAlign: 'center', color: '#808080' }}>{today}</div>

      <div style={{ fontSize: 10.5, marginTop: 12, fontWeight: 700, color: '#565656' }}>CARLOS EDUARDO MARTINS</div>
      <div style={{ fontSize: 10, marginTop: 6, lineHeight: 1.35, color: '#5f5f5f' }}>
        CPF: 177.665.442-8<br />
        Benefício: Aposentadoria por Tempo de Contribuição<br />
        Nascimento: 30/07/1957<br />
        Valor do Benefício: R$ 2.200
      </div>

      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
      <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 800, color: '#4a4a4a' }}>VOCE VAI RECEBER HOJE</div>
      <div style={{ textAlign: 'center', marginTop: 2, fontSize: 22, fontWeight: 900, color: '#232323', lineHeight: 1 }}>{scenario.cash}</div>
      <div style={{ textAlign: 'center', marginTop: 4, fontSize: 8.5, fontWeight: 700, letterSpacing: '.08em', color: '#888', textTransform: 'uppercase' }}>REFINANCIAMENTO CONSIGNADO</div>

      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, color: '#5b5b5b' }}>
        <thead>
          <tr>
            <th style={{ fontSize: 8, textAlign: 'left', fontWeight: 500, padding: '4px 0 8px', color: '#676767', paddingRight: 10 }}>Cód.</th>
            <th style={{ fontSize: 8, textAlign: 'left', fontWeight: 500, padding: '4px 0 8px', color: '#676767' }}>Banco</th>
            <th style={{ fontSize: 8, textAlign: 'right', fontWeight: 500, padding: '4px 0 8px', color: '#676767' }}>Troco</th>
          </tr>
        </thead>
        <tbody>
          {scenario.receiptRows.map(([cod, bank, troco]) => (
            <tr key={cod}>
              <td style={{ fontSize: 8, padding: '4px 0', paddingRight: 10, whiteSpace: 'nowrap' }}>{cod}</td>
              <td style={{ padding: '4px 0' }}>{bank}</td>
              <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: 700, color: '#3b3b3b' }}>{troco}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#555' }}>Nova parcela total</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#3b3b3b', whiteSpace: 'nowrap' }}>{scenario.installment}</span>
      </div>

      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#555', lineHeight: 1.3, flex: 1 }}>Margem livre após refinanciamento</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#3b3b3b', whiteSpace: 'nowrap' }}>{scenario.margem}</span>
        </div>
        <hr style={{ border: 'none', borderTop: '1px dashed #cfcfcf', margin: 0 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#555', lineHeight: 1.3, flex: 1 }}>Crédito disponível após liberação da margem</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#3b3b3b', whiteSpace: 'nowrap' }}>{scenario.receiptCredito}</span>
        </div>
      </div>

      <div style={{ marginTop: 10, padding: '8px 10px', background: '#f0f0ee', borderRadius: 6, border: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 8, color: '#888', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.04em' }}>Protocolo</div>
        <div style={{ fontSize: 8.5, color: '#444', fontWeight: 700, fontFamily: 'ui-monospace, monospace', letterSpacing: '.05em' }}>CSG-2025-05312</div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 4, fontSize: 9.5, color: '#7a7a7a', letterSpacing: '.08em' }}>ConsigAI.com.br</div>
    </div>
  )
}

//  Bottom Sheet 

function BottomSheet({ scenario, onClose }) {
  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,18,51,.55)', zIndex: 200,
        display: 'flex', alignItems: 'flex-end', animation: 'fadeIn .2s ease forwards',
      }}
    >
      <div style={{
        background: '#fff', borderRadius: '24px 24px 0 0', padding: '12px 20px 32px', width: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        animation: 'slideUp .28s cubic-bezier(.4,0,.2,1) forwards',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 999, background: t.line, marginBottom: 2 }} />
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: t.muted, textAlign: 'center' }}>OTIMA ESCOLHA! MAS OLHA ISSO...</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: t.text, textAlign: 'center', lineHeight: 1.2 }}>Faça ainda mais pelo seu futuro</div>
        <div style={{ fontSize: 11, fontWeight: 500, color: t.muted, textAlign: 'center', lineHeight: 1.5, maxWidth: 320 }}>
          Com a portabilidade você garante um limite maior disponível quando precisar de crédito de novo.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%', maxWidth: 420 }}>
          {/* Green card */}
          <button onClick={onClose} style={{
            border: `2px solid #b8e0ca`, borderRadius: 18, padding: '14px 10px', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textAlign: 'center',
            background: t.greenBg, boxShadow: '0 6px 18px rgba(10,102,64,.12)',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', background: '#c0e8d4', color: t.green, borderRadius: 999, padding: '3px 8px', marginBottom: 6 }}>Recomendado</div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: t.greenSoft }}>Refinanciamento</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: t.blue }}>{scenario.cash}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.greenAccent }}>+</div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: t.greenSoft }}>Economia Inteligente</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: t.green }}>R$ 2.399</div>
            <div style={{ fontSize: 9, fontWeight: 500, color: t.greenSoft }}>de economia</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.greenAccent }}>+</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: '100%' }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: t.greenSoft }}>Novo contrato depois</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: t.green }}>R$ 5.033</div>
              <div style={{ fontSize: 9, fontWeight: 500, color: t.greenSoft }}>disponível</div>
            </div>
          </button>

          {/* Blue card */}
          <button onClick={onClose} style={{
            border: `2px solid ${t.blueMid}`, borderRadius: 18, padding: '14px 10px', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textAlign: 'center',
            background: t.blueLight, boxShadow: '0 6px 18px rgba(35,80,200,.10)',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', background: t.blueLight, color: t.blue, border: `1px solid ${t.blueMid}`, borderRadius: 999, padding: '3px 8px', marginBottom: 6 }}>Mais alívio</div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: '#4a6fa8' }}>Refinanciamento</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: t.blue }}>{scenario.cash}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.blue }}>+</div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: '#4a6fa8' }}>Parcela Menor</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: t.blue }}>R$ 117<span style={{ fontSize: 9, fontWeight: 600 }}>/mês</span></div>
            <div style={{ fontSize: 9, fontWeight: 500, color: '#4a6fa8' }}>a menos por mês</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.blue }}>+</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: '100%' }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: '#4a6fa8' }}>Novo contrato depois</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: t.blue }}>R$ 7.593</div>
              <div style={{ fontSize: 9, fontWeight: 500, color: '#4a6fa8' }}>disponível</div>
            </div>
          </button>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%', maxWidth: 420, border: `1.5px solid ${t.line}`, borderRadius: 14,
            background: 'transparent', color: t.muted, padding: 13,
            fontSize: 12, fontWeight: 500, cursor: 'pointer',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            transition: 'border-color .15s ease, color .15s ease',
          }}
        >Não, só o refinanciamento por agora</button>
      </div>
    </div>
  )
}

//  Mini card 

function MiniCard({ variant, name, desc, value, detail, onNav }) {
  const isEco = variant === 'eco'
  const [hov, setHov] = useState(false)
  const colors = isEco
    ? { bg: t.greenBg, border: '#b8e0ca', iconBg: '#c0e8d4', iconStroke: t.green, nameCl: t.green, descCl: t.greenSoft, divider: '#b8e0ca', valueCl: t.green, btnBg: t.green, detailCl: t.greenSoft }
    : { bg: '#eef4ff', border: '#c0d2f5', iconBg: '#c0d4f8', iconStroke: '#1840a8', nameCl: '#0c3278', descCl: '#4a6fa8', divider: '#c0d2f5', valueCl: '#0c3278', btnBg: '#1840a8', detailCl: '#4a6fa8' }

  return (
    <div style={{ borderRadius: 20, border: `1px solid ${colors.border}`, background: colors.bg, overflow: 'hidden', marginBottom: 8 }}>
      <div style={{ padding: '14px 14px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: colors.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {isEco ? (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M10 4l6 6-6 6" stroke={colors.iconStroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke={colors.iconStroke} strokeWidth="1.5" strokeLinecap="round"/></svg>
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
          <div style={{ fontSize: 9.5, fontWeight: 500, color: colors.detailCl, marginTop: 2 }}>{detail}</div>
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

//  Main 

export default function Refinanciamento() {
  const navigate      = useNavigate()
  const isDesktop     = useMediaQuery('(min-width: 768px)')
  const clientName    = 'Carlos Eduardo'
  const [activeIdx, setActiveIdx]     = useState(0)
  const [detailsOpen, setDetails]     = useState(false)
  const [sheetOpen, setSheet]         = useState(false)
  const [hovCta, setHovCta]           = useState(false)
  const [hovDetails, setHovDetails]   = useState(false)
  const [hovDown, setHovDown]         = useState(false)
  const [backHover, setBackHover] = useState(false)

  const scenario = SCENARIOS[activeIdx]
  const salarioBase = 2200
  const parcelaAntes = 550
  const parseMoney = (value) => {
    const matched = String(value ?? '').match(/R\$\s*([\d.,]+)/)
    if (!matched) return 0
    return Number(matched[1].replace(/\./g, '').replace(',', '.')) || 0
  }
  const parcelaDepois = parseMoney(scenario.installment)
  const liquidoAntes = salarioBase - parcelaAntes
  const liquidoDepois = salarioBase - parcelaDepois
  const ctaNames = ['Máximo Dinheiro', 'Máxima Margem', 'Menor Parcela']

  const handleGoContratacao = () => {
    navigate('/dados-bancarios', {
      state: {
        sourcePath: '/refinanciamento',
        nextPath: '/contratacao',
        offerState: {
          sourcePath: '/refinanciamento',
          offerTitle: 'Refinanciamento',
          offerSubtitle: 'Resumo da oferta selecionada antes da contratacao',
          primaryValue: scenario.cash,
          ctaLabel: 'Confirmar Refinanciamento',
          summary: [
            { label: 'Cenario', value: ctaNames[activeIdx] },
            { label: 'Voce recebe', value: scenario.cash },
            { label: 'Nova parcela', value: scenario.installment },
            { label: 'Margem livre', value: scenario.margem },
            { label: 'Contratos', value: String(scenario.contracts.length) },
          ],
        },
      },
    })
  }

  const scenarioList = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: isDesktop ? 0 : 24 }}>
      {/* Tag */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: t.blueLight, borderRadius: 999, padding: '4px 12px 4px 8px', marginBottom: 4, alignSelf: 'flex-start' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.blue }} />
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', color: t.blue, textTransform: 'uppercase' }}>Refinanciamento por Contrato</span>
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: t.muted, marginBottom: 4 }}>Escolha o cenário com melhor impacto na sua rotina</div>

      {SCENARIOS.map((s, i) => (
        <ScenarioCard
          key={s.key}
          scenario={s}
          icon={SCENARIO_ICONS[i]}
          active={activeIdx === i}
          onClick={() => { setActiveIdx(i); setDetails(false) }}
        />
      ))}
    </div>
  )

  const offerCard = (
    <div style={{ background: '#fff', borderRadius: 20, border: `1px solid ${t.line}`, boxShadow: t.shadow, padding: 16 }}>
      {/* Selected scenario summary */}
      <div style={{ marginBottom: 14, padding: '12px 14px', borderRadius: 16, background: scenario.colors.bg, border: `1px solid ${scenario.colors.border}` }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: scenario.colors.eyebrow, marginBottom: 4 }}>{scenario.eyebrow} selecionado</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: t.text, marginBottom: 10 }}>{scenario.title}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div style={{ textAlign: 'center', background: 'rgba(255,255,255,.6)', borderRadius: 12, padding: '8px 4px' }}>
            <div style={{ fontSize: 8.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', color: t.muted, marginBottom: 4 }}>Você recebe</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: scenario.colors.kpiValue, letterSpacing: '-.02em', lineHeight: 1 }}>{scenario.cash}</div>
          </div>
          <div style={{ textAlign: 'center', background: 'rgba(255,255,255,.6)', borderRadius: 12, padding: '8px 4px' }}>
            <div style={{ fontSize: 8.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em', color: t.muted, marginBottom: 4 }}>Nova parcela</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: scenario.colors.kpiValue, letterSpacing: '-.02em', lineHeight: 1 }}>{scenario.installment}</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        onMouseEnter={() => setHovCta(true)}
        onMouseLeave={() => setHovCta(false)}
        onClick={handleGoContratacao}
        style={{
          width: '100%', border: 0, borderRadius: 14, padding: '15px 14px', marginBottom: 8,
          background: hovCta ? t.blue2 : t.blue, color: '#fff', fontSize: 15, fontWeight: 600,
          lineHeight: 1.2, boxShadow: '0 8px 20px rgba(35,80,200,.25)', cursor: 'pointer',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", transition: 'background .15s ease',
        }}
      >Escolher cenário {ctaNames[activeIdx]}</button>

      {/* Toggle details */}
      <button
        onClick={() => setDetails(v => !v)}
        onMouseEnter={() => setHovDetails(true)}
        onMouseLeave={() => setHovDetails(false)}
        style={{
          width: '100%', border: `1.5px solid ${t.blueMid}`, borderRadius: 14, padding: 13,
          background: hovDetails ? '#f0f5ff' : 'transparent', color: t.blue, fontSize: 13.5, fontWeight: 500,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", transition: 'background .15s ease',
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
        <div style={{ marginTop: 12, animation: 'fadeIn .22s ease forwards' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.10em', textTransform: 'uppercase', color: t.muted, marginBottom: 4 }}>Detalhes da oferta</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>Extrato da simulação</div>
            </div>
            <div style={{ borderRadius: 999, background: t.blueLight, border: `1px solid ${t.blueMid}`, padding: '5px 12px', fontSize: 10, fontWeight: 700, color: t.blue, whiteSpace: 'nowrap', flexShrink: 0 }}>
              {scenario.contracts.length} {scenario.contracts.length === 1 ? 'contrato' : 'contratos'}
            </div>
          </div>
          <div style={{ background: '#f7f9fe', border: `1px solid ${t.line}`, borderRadius: 16, padding: 10, display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
            <Receipt scenario={scenario} />
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
            <span aria-hidden="true">v</span>
            <span>Fazer download da simulação</span>
          </button>
        </div>
      )}

      <p style={{ fontSize: 8, color: t.muted, textAlign: 'right', marginTop: 10, opacity: .68, fontStyle: 'italic', lineHeight: 1.4 }}>
        Valores estimados. Sujeitos à análise e aprovação de crédito.
      </p>
    </div>
  )

  const summarySidebar = (
    <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${t.line}`, boxShadow: t.shadow, padding: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: t.muted, marginBottom: 10 }}>
        Resumo da oferta
      </div>
      {[
        ['Cenário', ctaNames[activeIdx]],
        ['Você recebe', scenario.cash],
        ['Nova parcela', scenario.installment],
        ['Margem livre', scenario.margem],
        ['Contratos', String(scenario.contracts.length)],
      ].map(([label, value]) => (
        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '7px 0', borderBottom: `1px solid ${t.line}` }}>
          <span style={{ fontSize: 11, color: t.muted, fontWeight: 600 }}>{label}</span>
          <strong style={{ fontSize: 11.5, color: t.text, fontWeight: 700, textAlign: 'right' }}>{value}</strong>
        </div>
      ))}

      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: t.muted, marginTop: 12, marginBottom: 10 }}>
        Salário líquido
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={{ borderRadius: 12, border: `1px solid ${t.line}`, background: '#f7f9ff', padding: 10 }}>
          <div style={{ fontSize: 9.5, textTransform: 'uppercase', letterSpacing: '.06em', color: t.muted, fontWeight: 700, marginBottom: 5 }}>Antes</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: t.text, lineHeight: 1.1 }}>R$ {liquidoAntes.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div style={{ fontSize: 10, color: t.muted, marginTop: 5, lineHeight: 1.35 }}>Com parcela de R$ {parcelaAntes.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
        <div style={{ borderRadius: 12, border: '1px solid #b8e0ca', background: '#eefaf3', padding: 10 }}>
          <div style={{ fontSize: 9.5, textTransform: 'uppercase', letterSpacing: '.06em', color: t.green, fontWeight: 700, marginBottom: 5 }}>Depois</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: t.green, lineHeight: 1.1 }}>R$ {liquidoDepois.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div style={{ fontSize: 10, color: t.greenSoft, marginTop: 5, lineHeight: 1.35 }}>Com parcela de R$ {parcelaDepois.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
      </div>
    </div>
  )

  const otherOptions = (
    <div style={{ marginTop: isDesktop ? 28 : 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: t.text, flex: 1 }}>Outras opções para comparar</div>
        <div style={{ fontSize: 10, color: t.muted, fontWeight: 500 }}>2 disponíveis</div>
      </div>
      <MiniCard variant="eco"  name="Economia Inteligente" desc="Faça a portabilidade dos seus contratos e economize" value="2.399" detail="estimado de economia" onNav={() => navigate('/portabilidade')} />
      <MiniCard variant="novo" name="Novo Empréstimo"       desc="Mais dinheiro disponível com pequeno ajuste na parcela" value="2.845" detail="estimado disponível" onNav={() => navigate('/novo-contrato')} />
    </div>
  )

  const bottomBack = (
    <div style={{ marginTop: isDesktop ? 24 : 18 }}>
      <button
        onClick={() => navigate('/ofertas')}
        onMouseEnter={() => setBackHover(true)}
        onMouseLeave={() => setBackHover(false)}
        style={{
          width: '100%',
          border: `1.5px solid ${t.blueMid}`,
          borderRadius: 14,
          padding: isDesktop ? '14px 16px' : '13px 14px',
          background: backHover ? '#f0f5ff' : '#fff',
          color: t.blue,
          fontSize: isDesktop ? 14 : 13.5,
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          transition: 'background .15s ease',
        }}
      >
        {'<-'} Voltar para ofertas
      </button>
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeIn  { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
        button:focus-visible { outline: 3px solid rgba(35,80,200,.4); outline-offset: 2px; }
      `}</style>

      <div style={appPageStyle}>
        {isDesktop ? (
          <>
            <DesktopPageHeader
              clientName={clientName}
              chipLabel="Refinanciamento"
              title="Refinancie com inteligencia e escolha o melhor impacto no seu mes"
              subtitle="Compare cenario por cenario com clareza antes de confirmar."
              onLogoClick={() => navigate('/ofertas')}
              actions={[
                { label: 'Ofertas', onClick: () => navigate('/ofertas') },
                { label: 'Configuracoes', onClick: () => navigate('/configuracoes') },
              ]}
            />
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 40px 56px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 28, alignItems: 'start' }}>
                <div>
                  {scenarioList}
                  {otherOptions}
                  {bottomBack}
                </div>
                <div style={{ position: 'sticky', top: 24 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {summarySidebar}
                    {offerCard}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <MobilePageHeader
              clientName={clientName}
              onLogoClick={() => navigate('/ofertas')}
              actions={[
                { label: 'Ofertas', onClick: () => navigate('/ofertas') },
                { label: 'Configuracoes', onClick: () => navigate('/configuracoes') },
              ]}
            />
            <div style={{ background: t.bg, borderRadius: '26px 26px 0 0', marginTop: 0, padding: '20px 18px calc(24px + env(safe-area-inset-bottom))' }}>
              {scenarioList}
              {offerCard}
              {otherOptions}
                  {bottomBack}
            </div>
          </>
        )}
      </div>

      {sheetOpen && <BottomSheet scenario={scenario} onClose={() => setSheet(false)} />}
    </>
  )
}


