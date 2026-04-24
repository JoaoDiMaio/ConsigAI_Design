import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { DesktopPageHeader, MobilePageHeader } from '../components/AppHeader'
import { MiniCard } from '../components/MiniCard'
import { loadProfileData } from '../lib/profileStorage'
import { appPageStyle, theme } from '../ui/theme'

const t = {
  ...theme,
  greenSoft: '#3d6b52',
  gold: '#7a5200',
  goldBg: '#fffbf0',
  goldLine: '#edddb0',
  shadow: '0 8px 28px rgba(0,24,81,.09)',
}

const VARIANTS = {
  novo: {
    route: '/estrategia-combinada',
    chip: 'Novo Contrato + Economia',
    title: 'Receba agora e construa economia para os proximos meses',
    subtitle: 'Estrategia combinada para equilibrar dinheiro na conta e custo total menor.',
    offerTitle: 'Novo Contrato + Economia',
    economyValue: 'R$ 2.399',
    marginValue: 'R$ 320',
    futureCreditValue: 'R$ 5.033',
    ctaLabel: 'Confirmar Estrategia',
    detailLabel: 'Novo Contrato + Economia',
    scenarios: [
      {
        key: 'novo_max',
        title: 'Maior valor liberado',
        desc: 'Prioriza valor imediato sem abrir mao da economia prevista na sequencia.',
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
        desc: 'Combina boa liberacao com parcela mensal mais previsivel.',
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
        desc: 'Menor impacto no mes com foco em mais tranquilidade financeira.',
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
    route: '/estrategia-combinada',
    chip: 'Refinanciamento + Economia',
    title: 'Receba agora e reduza o peso financeiro no total',
    subtitle: 'Estrategia combinada para unir liquidez imediata e economia ao longo do contrato.',
    offerTitle: 'Refinanciamento + Economia',
    economyValue: 'R$ 2.399',
    marginValue: 'R$ 320',
    futureCreditValue: 'R$ 5.033',
    ctaLabel: 'Confirmar Estrategia',
    detailLabel: 'Refinanciamento + Economia',
    scenarios: [
      {
        key: 'refin_money',
        title: 'Maximo dinheiro',
        desc: 'Prioriza o maior valor disponivel para entrada imediata em conta.',
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
        desc: 'Libera margem para voce ter mais poder de decisao depois.',
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
        desc: 'Reduz o comprometimento mensal para aliviar o orcamento.',
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
  const normalized = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
  const hasEconomy = normalized.includes('economia') || normalized.includes('econmia')

  if (
    ['novo', 'novo-economia', 'novo_economia'].includes(value) ||
    (normalized.includes('novo') && hasEconomy)
  ) {
    return 'novo'
  }

  if (
    ['refin', 'refin-portabilidade', 'refin_portabilidade', 'refin-economia', 'refin_economia'].includes(value) ||
    (normalized.includes('refin') && hasEconomy)
  ) {
    return 'refin'
  }

  return null
}

function ScenarioCard({ scenario, active, onClick }) {
  return (
    <button
      type="button"
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
  const profile = useMemo(() => loadProfileData(), [])
  const clientName = profile.nomeCompleto || 'Cliente'

  const config = VARIANTS[variant]
  const [activeIdx, setActiveIdx] = useState(0)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [ctaHover, setCtaHover] = useState(false)
  const [detailsHover, setDetailsHover] = useState(false)
  const [backHover, setBackHover] = useState(false)

  const scenario = config.scenarios[activeIdx]
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

  const goToContratacao = () => {
    navigate('/dados-bancarios', {
      state: {
        sourcePath: config.route,
        nextPath: '/contratacao',
        offerState: {
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
      },
    })
  }

  const scenarioList = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: t.blueLight, borderRadius: 999, padding: '4px 12px 4px 8px', marginBottom: 2, alignSelf: 'flex-start' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.blue }} />
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', color: t.blue, textTransform: 'uppercase' }}>{config.chip}</span>
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: t.muted, marginBottom: 4 }}>Escolha o cenario com melhor impacto no seu dia a dia</div>

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
        type="button"
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
        {config.ctaLabel}
      </button>

      <button
        type="button"
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

  const summarySidebar = (
    <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${t.line}`, boxShadow: t.shadow, padding: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: t.muted, marginBottom: 10 }}>
        Resumo da oferta
      </div>
      {[
        ['Estrategia', config.offerTitle],
        ['Voce recebe', scenario.cash],
        ['Economia', config.economyValue],
        ['Nova parcela', scenario.installment],
        ['Margem livre', scenario.margin],
      ].map(([label, value]) => (
        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '7px 0', borderBottom: `1px solid ${t.line}` }}>
          <span style={{ fontSize: 11, color: t.muted, fontWeight: 600 }}>{label}</span>
          <strong style={{ fontSize: 11.5, color: t.text, fontWeight: 700, textAlign: 'right' }}>{value}</strong>
        </div>
      ))}

      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: t.muted, marginTop: 12, marginBottom: 10 }}>
        Salario liquido
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

  const options = (
    <div style={{ marginTop: isDesktop ? 28 : 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: t.text, flex: 1 }}>Outras opcoes para comparar</div>
        <div style={{ fontSize: 10, color: t.muted, fontWeight: 500 }}>{config.otherOptions.length} disponiveis</div>
      </div>
      {config.otherOptions.map((item) => (
        <MiniCard
          key={item.key}
          variant={item.key === 'refin' ? 'refin' : item.key === 'novo' ? 'novo' : 'eco'}
          name={item.name}
          desc={item.desc}
          value={item.value}
          detail={item.detail}
          onNav={() => navigate(item.route)}
        />
      ))}
    </div>
  )

  const bottomBack = (
    <div style={{ marginTop: isDesktop ? 24 : 18 }}>
      <button
        type="button"
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
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Voltar para ofertas
        </span>
      </button>
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .mix-layout { display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 24px; align-items: start; }
        .mix-right { position: sticky; top: 24px; }
        .mix-bottom { grid-column: 1; }
        @media (max-width: 980px) {
          .mix-layout { grid-template-columns: 1fr; }
          .mix-right { position: static; }
          .mix-bottom { grid-column: auto; }
        }
      `}</style>

      <div style={appPageStyle}>
        {isDesktop ? (
          <>
            <DesktopPageHeader
              chipLabel={config.chip}
              title={config.title}
              subtitle={config.subtitle}
              clientName={clientName}
              onLogoClick={() => navigate('/ofertas')}
              actions={[
                { label: 'Ofertas', onClick: () => navigate('/ofertas') },
                { label: 'Configuracoes', onClick: () => navigate('/configuracoes') },
              ]}
            />
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 56px' }}>
              <div className="mix-layout">
                <div>{scenarioList}</div>
                <div className="mix-right">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {summarySidebar}
                    {offerCard}
                  </div>
                </div>
                <div className="mix-bottom">{options}</div>
              </div>
              {bottomBack}
            </div>
          </>
        ) : (
          <>
            <MobilePageHeader
              clientName={clientName}
              chipLabel={config.chip}
              title={config.title}
              subtitle={config.subtitle}
              onLogoClick={() => navigate('/ofertas')}
              actions={[
                { label: 'Ofertas', onClick: () => navigate('/ofertas') },
                { label: 'Configuracoes', onClick: () => navigate('/configuracoes') },
              ]}
            />
            <div style={{ background: t.bg, borderRadius: '26px 26px 0 0', marginTop: 0, padding: '20px 18px calc(24px + env(safe-area-inset-bottom))' }}>
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


