import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'
import logoSvg from '../assets/logo.svg'
import logoIconSvg from '../assets/logo-icon.svg'

const t = {
  navy: '#001851',
  blue: '#2350c8',
  blue2: '#1844b8',
  blueLight: '#e8eeff',
  blueMid: '#c2d0f8',
  text: '#0f2057',
  muted: '#7a8db8',
  line: '#e4eaf8',
  green: '#0a6640',
  greenSoft: '#3d6b52',
  greenBg: '#e8f5ee',
  greenAccent: '#16a364',
  gold: '#7a5200',
  goldBg: '#fffbf0',
  goldLine: '#edddb0',
  bg: '#f4f7fd',
  shadow: '0 8px 28px rgba(0,24,81,.09)',
}

const VARIANTS = {
  novo: {
    route: '/novo-economia',
    chip: 'Novo Contrato + Economia',
    title: 'Libere credito agora e economize depois',
    subtitle: 'A tela mostra somente os elementos da estrategia Novo + Economia.',
    offerTitle: 'Novo Contrato + Economia',
    economyValue: 'R$ 2.399',
    marginValue: 'R$ 320',
    futureCreditValue: 'R$ 5.033',
    ctaLabel: 'Confirmar Estrategia',
    detailLabel: 'Novo contrato + Portabilidade',
    scenarios: [
      {
        key: 'novo_max',
        title: 'Maior valor liberado',
        desc: 'Receba mais agora e mantenha a estrategia de economia depois.',
        cash: 'R$ 8.400',
        installment: '84x de R$ 158,40',
        margin: 'R$ 320',
        contracts: ['Novo contrato', 'Portabilidade'],
        rows: [
          ['1', 'Novo contrato', 'R$ 8.400'],
          ['2', 'Economia estimada', 'R$ 2.399'],
        ],
      },
      {
        key: 'novo_bal',
        title: 'Equilibrio de parcela',
        desc: 'Equilibrio entre valor liberado e parcela mensal.',
        cash: 'R$ 5.000',
        installment: '84x de R$ 94,28',
        margin: 'R$ 380',
        contracts: ['Novo contrato', 'Portabilidade'],
        rows: [
          ['1', 'Novo contrato', 'R$ 5.000'],
          ['2', 'Economia estimada', 'R$ 2.399'],
        ],
      },
      {
        key: 'novo_min',
        title: 'Parcela mais leve',
        desc: 'Menor impacto mensal com estrategia combinada.',
        cash: 'R$ 2.500',
        installment: '84x de R$ 47,14',
        margin: 'R$ 450',
        contracts: ['Novo contrato', 'Portabilidade'],
        rows: [
          ['1', 'Novo contrato', 'R$ 2.500'],
          ['2', 'Economia estimada', 'R$ 2.399'],
        ],
      },
    ],
    otherOptions: [
      {
        key: 'port',
        name: 'Portabilidade',
        desc: 'Reduza juros sem receber novo credito.',
        value: '2.399',
        detail: 'economia estimada',
        route: '/portabilidade',
      },
      {
        key: 'refin',
        name: 'Refinanciamento',
        desc: 'Receba valor imediato com contratos atuais.',
        value: '9.547',
        detail: 'estimado para receber',
        route: '/refinanciamento',
      },
    ],
  },
  refin: {
    route: '/refin-portabilidade',
    chip: 'Refinanciamento + Portabilidade',
    title: 'Receba dinheiro agora e economize no total',
    subtitle: 'A tela mostra somente os elementos da estrategia Refin + Portabilidade.',
    offerTitle: 'Refinanciamento + Portabilidade',
    economyValue: 'R$ 2.399',
    marginValue: 'R$ 320',
    futureCreditValue: 'R$ 5.033',
    ctaLabel: 'Confirmar Estrategia',
    detailLabel: 'Refinanciamento + Portabilidade',
    scenarios: [
      {
        key: 'refin_money',
        title: 'Maximo dinheiro',
        desc: 'Receba o maior valor refinanciando contratos elegiveis.',
        cash: 'R$ 12.930',
        installment: 'R$ 1.191/mes',
        margin: 'R$ 56',
        contracts: ['Banco PAN', 'Facta', 'C6 Consig'],
        rows: [
          ['0056347710', 'Banco PAN', 'R$ 3.200'],
          ['0123472010087', 'Facta', 'R$ 5.550'],
          ['0057628452', 'C6 Consig', 'R$ 4.180'],
        ],
      },
      {
        key: 'refin_margin',
        title: 'Maxima margem livre',
        desc: 'Libere mais margem para futuras oportunidades.',
        cash: 'R$ 9.730',
        installment: 'R$ 893/mes',
        margin: 'R$ 120',
        contracts: ['Facta', 'C6 Consig'],
        rows: [
          ['0123472010087', 'Facta', 'R$ 5.550'],
          ['0057628452', 'C6 Consig', 'R$ 4.180'],
        ],
      },
      {
        key: 'refin_install',
        title: 'Menor parcela total',
        desc: 'Reduza o comprometimento mensal da renda.',
        cash: 'R$ 5.550',
        installment: 'R$ 381/mes',
        margin: 'R$ 389',
        contracts: ['Facta'],
        rows: [['0123472010087', 'Facta', 'R$ 5.550']],
      },
    ],
    otherOptions: [
      {
        key: 'port',
        name: 'Portabilidade',
        desc: 'Economia sem receber novo valor agora.',
        value: '2.399',
        detail: 'economia estimada',
        route: '/portabilidade',
      },
      {
        key: 'novo',
        name: 'Novo Emprestimo',
        desc: 'Credito novo com parcela ajustada.',
        value: '2.845',
        detail: 'estimado disponivel',
        route: '/novo-contrato',
      },
    ],
  },
}

function normalizeVariant(raw) {
  const value = String(raw ?? '').trim().toLowerCase()

  if (['novo', 'novo-economia', 'novo_economia'].includes(value)) return 'novo'
  if (['refin', 'refin-portabilidade', 'refin_portabilidade'].includes(value)) return 'refin'

  return null
}

function DesktopHeader({ chip, title, subtitle, clientName, onLogoClick }) {
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

        <div style={{ flex: 1, maxWidth: 560 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 999, background: t.blueLight, padding: '4px 12px 4px 8px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.blue }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', color: t.blue, textTransform: 'uppercase' }}>{chip}</span>
            </div>
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-.02em', lineHeight: 1.2 }}>{title}</h1>
          <p style={{ margin: '8px 0 0', fontSize: 13, color: 'rgba(255,255,255,.72)', fontWeight: 500, lineHeight: 1.55 }}>{subtitle}</p>
        </div>

        <div style={{ flexShrink: 0, borderRadius: 14, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', padding: '12px 18px', textAlign: 'right' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.07em', color: 'rgba(255,255,255,.55)', fontWeight: 600, marginBottom: 4 }}>Cliente</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>{clientName}</div>
        </div>
      </div>
    </div>
  )
}

function ScenarioCard({ scenario, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        textAlign: 'left',
        border: `2px solid ${active ? t.blue : t.blueMid}`,
        borderRadius: 20,
        background: active ? '#f3f7ff' : '#fff',
        cursor: 'pointer',
        padding: 14,
        boxShadow: active ? '0 10px 30px rgba(35,80,200,.16)' : 'none',
        transition: 'all .2s ease',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
      aria-pressed={active}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{scenario.title}</div>
        <div style={{ width: 18, height: 18, borderRadius: '50%', border: active ? `6px solid ${t.blue}` : `2px solid ${t.line}`, background: '#fff', flexShrink: 0 }} />
      </div>
      <div style={{ fontSize: 11, color: t.muted, lineHeight: 1.4, marginBottom: 10 }}>{scenario.desc}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <Kpi label="Voce recebe" value={scenario.cash} />
        <Kpi label="Nova parcela" value={scenario.installment} />
        <Kpi label="Margem" value={scenario.margin} />
      </div>
    </button>
  )
}

function Kpi({ label, value }) {
  return (
    <div style={{ borderRadius: 12, background: t.blueLight, padding: '8px 6px', textAlign: 'center' }}>
      <div style={{ fontSize: 8, textTransform: 'uppercase', color: t.muted, fontWeight: 700, letterSpacing: '.04em', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 12, color: t.blue, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</div>
    </div>
  )
}

function MiniOption({ item, onClick }) {
  const [hover, setHover] = useState(false)

  return (
    <div style={{ borderRadius: 18, border: `1px solid ${t.line}`, background: '#fff', padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
      <div>
        <div style={{ fontSize: 13, color: t.text, fontWeight: 700 }}>{item.name}</div>
        <div style={{ fontSize: 10.5, color: t.muted, marginTop: 2, lineHeight: 1.35 }}>{item.desc}</div>
      </div>
      <button
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          border: 0,
          borderRadius: 12,
          background: hover ? t.blue2 : t.blue,
          color: '#fff',
          padding: '10px 12px',
          fontSize: 11,
          fontWeight: 600,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          transition: 'background .15s ease',
        }}
      >
        Ver oferta
      </button>
    </div>
  )
}

function Receipt({ label, scenario, economyValue, futureCreditValue }) {
  const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

  return (
    <div style={{ width: 300, borderRadius: 10, padding: '14px 12px 12px', border: '1px solid #ececec', color: '#4f4f4f', fontSize: 12, background: '#f5f5f3' }}>
      <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 800, color: '#444' }}>RECIBO DE ESTRATEGIA CONSIGAI</div>
      <div style={{ textAlign: 'center', fontSize: 10, color: '#808080', marginTop: 4 }}>{today}</div>

      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
      <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 800, color: '#4a4a4a' }}>VOCE RECEBE E AINDA ECONOMIZA</div>
      <div style={{ textAlign: 'center', marginTop: 2, fontSize: 22, fontWeight: 900, color: '#232323' }}>{scenario.cash}</div>
      <div style={{ textAlign: 'center', marginTop: 4, fontSize: 8.5, fontWeight: 700, letterSpacing: '.08em', color: '#888', textTransform: 'uppercase' }}>{label}</div>

      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, color: '#5b5b5b' }}>
        <thead>
          <tr>
            <th style={{ fontSize: 8, textAlign: 'left', fontWeight: 500, padding: '4px 0 8px', color: '#676767', paddingRight: 10 }}>Cod.</th>
            <th style={{ fontSize: 8, textAlign: 'left', fontWeight: 500, padding: '4px 0 8px', color: '#676767' }}>Fonte</th>
            <th style={{ fontSize: 8, textAlign: 'right', fontWeight: 500, padding: '4px 0 8px', color: '#676767' }}>Valor</th>
          </tr>
        </thead>
        <tbody>
          {scenario.rows.map(([cod, source, value]) => (
            <tr key={`${cod}-${source}`}>
              <td style={{ fontSize: 8, padding: '4px 0', paddingRight: 10 }}>{cod}</td>
              <td style={{ padding: '4px 0' }}>{source}</td>
              <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: 700 }}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
      <LineItem label="Economia total estimada" value={economyValue} />
      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
      <LineItem label="Nova parcela total" value={scenario.installment} />
      <hr style={{ border: 'none', borderTop: '1px dashed #cfcfcf', margin: '8px 0' }} />
      <LineItem label="Credito disponivel depois" value={`ate ${futureCreditValue}`} />
    </div>
  )
}

function LineItem({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: '#555' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 800, color: '#3b3b3b', whiteSpace: 'nowrap' }}>{value}</span>
    </div>
  )
}

function StrategyScreen({ variant }) {
  const navigate = useNavigate()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const clientName = 'Carlos Eduardo'

  const config = VARIANTS[variant]
  const [activeIdx, setActiveIdx] = useState(0)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [ctaHover, setCtaHover] = useState(false)
  const [detailsHover, setDetailsHover] = useState(false)
  const [backHover, setBackHover] = useState(false)

  const scenario = config.scenarios[activeIdx]

  const goToContratacao = () => {
    navigate('/contratacao', {
      state: {
        sourcePath: config.route,
        offerTitle: config.offerTitle,
        offerSubtitle: 'Resumo da oferta selecionada antes da contratacao',
        primaryValue: `${scenario.cash} + ${config.economyValue}`,
        ctaLabel: config.ctaLabel,
        summary: [
          { label: 'Voce recebe', value: scenario.cash },
          { label: 'Economia', value: config.economyValue },
          { label: 'Nova parcela', value: scenario.installment },
          { label: 'Margem livre', value: scenario.margin },
          { label: 'Contratos', value: String(scenario.contracts.length) },
        ],
      },
    })
  }

  const scenarioList = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: t.blueLight, borderRadius: 999, padding: '4px 12px 4px 8px', marginBottom: 2, alignSelf: 'flex-start' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.blue }} />
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', color: t.blue, textTransform: 'uppercase' }}>{config.chip}</span>
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: t.muted, marginBottom: 4 }}>Escolha o melhor cenario para voce</div>

      {config.scenarios.map((item, idx) => (
        <ScenarioCard
          key={item.key}
          scenario={item}
          active={idx === activeIdx}
          onClick={() => {
            setActiveIdx(idx)
            setDetailsOpen(false)
          }}
        />
      ))}
    </div>
  )

  const offerCard = (
    <div style={{ background: '#fff', borderRadius: 20, border: `1px solid ${t.line}`, boxShadow: t.shadow, padding: 16 }}>
      <div style={{ background: '#f7f9fe', border: `1px solid ${t.line}`, borderRadius: 14, padding: '14px 16px', marginBottom: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 34px 1fr', alignItems: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: t.blue }}>{scenario.cash}</div>
          <div style={{ textAlign: 'center', color: '#9eaccf', fontSize: 20, fontWeight: 600 }}>+</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: t.greenAccent, textAlign: 'right' }}>{config.economyValue}</div>
        </div>
      </div>

      <div style={{ borderRadius: 16, padding: '12px 16px', background: t.greenBg, textAlign: 'center', marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: t.green, letterSpacing: '.07em' }}>Sem aumentar o prazo</div>
        <div style={{ fontSize: 13, color: t.greenSoft, marginTop: 4 }}>Economia estimada</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: t.green, lineHeight: 1.1 }}>{config.economyValue}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
        <Kpi label="Margem livre" value={`ate ${config.marginValue}`} />
        <Kpi label="Credito depois" value={`ate ${config.futureCreditValue}`} />
      </div>

      <button
        onClick={goToContratacao}
        onMouseEnter={() => setCtaHover(true)}
        onMouseLeave={() => setCtaHover(false)}
        style={{
          width: '100%',
          border: 0,
          borderRadius: 14,
          padding: '15px 14px',
          marginBottom: 8,
          background: ctaHover ? t.blue2 : t.blue,
          color: '#fff',
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          transition: 'background .15s ease',
        }}
      >
        Quero {scenario.cash} + Economia
      </button>

      <button
        onClick={() => setDetailsOpen((v) => !v)}
        onMouseEnter={() => setDetailsHover(true)}
        onMouseLeave={() => setDetailsHover(false)}
        aria-expanded={detailsOpen}
        style={{
          width: '100%',
          border: `1.5px solid ${t.blueMid}`,
          borderRadius: 14,
          padding: 13,
          background: detailsHover ? '#f0f5ff' : 'transparent',
          color: t.blue,
          fontSize: 13.5,
          fontWeight: 500,
          cursor: 'pointer',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        }}
      >
        Ver detalhes da oferta
      </button>

      {detailsOpen && (
        <div style={{ marginTop: 12, animation: 'fadeIn .22s ease forwards' }}>
          <div style={{ background: '#f7f9fe', border: `1px solid ${t.line}`, borderRadius: 16, padding: 10, display: 'flex', justifyContent: 'center' }}>
            <Receipt
              label={config.detailLabel}
              scenario={scenario}
              economyValue={config.economyValue}
              futureCreditValue={config.futureCreditValue}
            />
          </div>
        </div>
      )}

      <p style={{ fontSize: 8, color: t.muted, textAlign: 'right', marginTop: 10, opacity: 0.68, fontStyle: 'italic', lineHeight: 1.4 }}>
        Valores estimados. Sujeitos a analise e aprovacao de credito.
      </p>
    </div>
  )

  const options = (
    <div style={{ marginTop: isDesktop ? 28 : 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: t.text, flex: 1 }}>Outras opcoes para voce</div>
        <div style={{ fontSize: 10, color: t.muted, fontWeight: 500 }}>{config.otherOptions.length} disponiveis</div>
      </div>
      {config.otherOptions.map((item) => (
        <MiniOption key={item.key} item={item} onClick={() => navigate(item.route)} />
      ))}
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
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .mix-layout { display: grid; grid-template-columns: 1fr 380px; gap: 28px; align-items: start; }
        .mix-right { position: sticky; top: 24px; }
        .mix-bottom { grid-column: 1; }
        @media (max-width: 980px) {
          .mix-layout { grid-template-columns: 1fr; }
          .mix-right { position: static; }
          .mix-bottom { grid-column: auto; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: t.bg, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: t.text }}>
        {isDesktop ? (
          <>
            <DesktopHeader
              chip={config.chip}
              title={config.title}
              subtitle={config.subtitle}
              clientName={clientName}
              onLogoClick={() => navigate('/ofertas')}
            />
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 40px 56px' }}>
              <div className="mix-layout">
                <div>{scenarioList}</div>
                <div className="mix-right">{offerCard}</div>
                <div className="mix-bottom">{options}</div>
              </div>
              {bottomBack}
            </div>
          </>
        ) : (
          <>
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
            <div style={{ background: t.bg, borderRadius: '26px 26px 0 0', marginTop: -26, padding: '20px 18px calc(24px + env(safe-area-inset-bottom))' }}>
              {scenarioList}
              <div style={{ marginTop: 14 }}>{offerCard}</div>
              {options}
              {bottomBack}
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default function EstrategiaCombinada({ variant: forcedVariant }) {
  const location = useLocation()

  const variant = useMemo(() => {
    const fromProp = normalizeVariant(forcedVariant)
    if (fromProp) return fromProp

    const fromState = normalizeVariant(location.state?.strategyType)
    if (fromState) return fromState

    const pathname = location.pathname.toLowerCase()
    if (pathname.includes('refin')) return 'refin'

    return 'novo'
  }, [forcedVariant, location.pathname, location.state])

  return <StrategyScreen variant={variant} />
}
