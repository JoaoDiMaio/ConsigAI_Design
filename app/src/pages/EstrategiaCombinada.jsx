import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { DesktopPageHeader, MobilePageHeader } from '../components/AppHeader'
import { Button } from '../components/Button'
import { MiniCard } from '../components/MiniCard'
import { t } from '../lib/pageTheme'
import { parseMoney } from '../lib/formatters'
import { loadProfileData } from '../lib/profileStorage'
import { appPageStyle } from '../ui/theme'

const VARIANTS = {
  novo: {
    route: '/estrategia-combinada',
    chip: 'Novo Contrato + Economia',
    title: 'Receba agora e construa economia para os próximos meses',
    subtitle: 'Estratégia combinada para equilibrar dinheiro na conta e custo total menor.',
    offerTitle: 'Novo Contrato + Economia',
    economyValue: 'R$ 2.399',
    marginValue: 'R$ 320',
    futureCreditValue: 'R$ 5.033',
    ctaLabel: 'Confirmar Estratégia',
    detailLabel: 'Novo Contrato + Economia',
    scenarios: [
      {
        key: 'novo_max',
        title: 'Maior valor liberado',
        desc: 'Prioriza valor imediato sem abrir mão da economia prevista na sequência.',
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
        title: 'Equilíbrio de parcela',
        desc: 'Combina boa liberação com parcela mensal mais previsível.',
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
        desc: 'Menor impacto no mês com foco em mais tranquilidade financeira.',
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
        desc: 'Reduza juros sem receber novo crédito.',
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
    subtitle: 'Estratégia combinada para unir liquidez imediata e economia ao longo do contrato.',
    offerTitle: 'Refinanciamento + Economia',
    economyValue: 'R$ 2.399',
    marginValue: 'R$ 320',
    futureCreditValue: 'R$ 5.033',
    ctaLabel: 'Confirmar Estratégia',
    detailLabel: 'Refinanciamento + Economia',
    scenarios: [
      {
        key: 'refin_money',
        title: 'Máximo dinheiro',
        desc: 'Prioriza o maior valor disponível para entrada imediata em conta.',
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
        title: 'Máxima margem livre',
        desc: 'Libera margem para você ter mais poder de decisão depois.',
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
        desc: 'Reduz o comprometimento mensal para aliviar o orçamento.',
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
        name: 'Novo Empréstimo',
        desc: 'Crédito novo com parcela ajustada.',
        value: '2.845',
        detail: 'estimado disponível',
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
      className={`mix-scenario-card ${active ? 'is-active' : ''}`}
      aria-pressed={active}
    >
      <div className="mix-scenario-card__header">
        <div>
          <div className="mix-scenario-card__title">{scenario.title}</div>
          <div className="mix-scenario-card__desc">{scenario.desc}</div>
        </div>
        <div className="mix-scenario-card__radio" aria-hidden="true" />
      </div>
      <div className="mix-kpi-grid mix-kpi-grid--three">
        <Kpi label="Você recebe" value={scenario.cash} />
        <Kpi label="Nova parcela" value={scenario.installment} />
        <Kpi label="Margem" value={scenario.margin} />
      </div>
    </button>
  )
}

function Kpi({ label, value }) {
  return (
    <div className="mix-kpi">
      <div className="mix-kpi__label">{label}</div>
      <div className="mix-kpi__value">{value}</div>
    </div>
  )
}

function Card({ children }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${t.line}`, borderRadius: 22, boxShadow: t.shadow, padding: 20 }}>
      {children}
    </div>
  )
}

function CardSection({ title, children }) {
  return (
    <div>
      {title ? <p style={{ margin: '0 0 12px', color: '#7a8db8', fontSize: 10, fontWeight: 800, textTransform: 'uppercase' }}>{title}</p> : null}
      {children}
    </div>
  )
}

function CardRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, padding: '10px 0', borderBottom: '1px solid #e4eaf8' }}>
      <span style={{ color: '#7a8db8', fontSize: 10, fontWeight: 800, textTransform: 'uppercase' }}>{label}</span>
      <strong style={{ color: '#1a3d8f', fontSize: 13, fontWeight: 900, textAlign: 'right' }}>{value}</strong>
    </div>
  )
}

function Receipt({ label, scenario, economyValue, futureCreditValue }) {
  const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

  return (
    <div style={{ width: 300, borderRadius: 10, padding: '14px 12px 12px', border: '1px solid #ececec', color: '#4f4f4f', fontSize: 12, background: '#f5f5f3' }}>
      <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 800, color: '#444' }}>RECIBO DE ESTRATÉGIA CONSIGAI</div>
      <div style={{ textAlign: 'center', fontSize: 10, color: '#808080', marginTop: 4 }}>{today}</div>

      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
      <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 800, color: '#4a4a4a' }}>VOCÊ RECEBE E AINDA ECONOMIZA</div>
      <div style={{ textAlign: 'center', marginTop: 2, fontSize: 22, fontWeight: 900, color: '#232323' }}>{scenario.cash}</div>
      <div style={{ textAlign: 'center', marginTop: 4, fontSize: 8.5, fontWeight: 700, letterSpacing: 0, color: '#888', textTransform: 'uppercase' }}>{label}</div>

      <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, color: '#5b5b5b' }}>
        <thead>
          <tr>
            <th style={{ fontSize: 8, textAlign: 'left', fontWeight: 500, padding: '4px 0 8px', color: '#676767', paddingRight: 10 }}>Cód.</th>
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
      <LineItem label="Crédito disponível depois" value={`até ${futureCreditValue}`} />
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
  const clientName = profile.nomeExibicao || profile.nomeCompleto || 'Cliente'

  const config = VARIANTS[variant]
  const [activeIdx, setActiveIdx] = useState(0)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const scenario = config.scenarios[activeIdx]
  const salarioBase = 2200
  const parcelaAntes = 550
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
          offerSubtitle: 'Resumo da oferta selecionada antes da contratação',
          primaryValue: `${scenario.cash} + ${config.economyValue}`,
          ctaLabel: config.ctaLabel,
          summary: [
            { label: 'Você recebe', value: scenario.cash },
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
    <div className="mix-scenarios">
      <section className="mix-hero">
        <p className="mix-eyebrow">Estratégia combinada</p>
        <h2 className="mix-title">
          {variant === 'novo' ? 'Receba agora e ' : 'Receba agora e '}
          <span>{variant === 'novo' ? 'economize depois' : 'reduza o peso total'}</span>
        </h2>
        <p className="mix-subtitle">{config.subtitle}</p>
      </section>

      <div className="mix-pill">
        <div className="mix-pill__dot" />
        <span>{config.chip}</span>
      </div>
      <div className="mix-section-label">Escolha o cenário com melhor impacto no seu dia a dia</div>

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
    <div className="mix-main-card">
      <span className="mix-main-pill">{config.detailLabel}</span>

      <div className="mix-combo-strip">
        <div className="mix-combo-strip__grid">
          <div>
            <p className="mix-mini-label">Você recebe</p>
            <div className="mix-combo-value">{scenario.cash}</div>
          </div>
          <div className="mix-plus">+</div>
          <div className="text-right">
            <p className="mix-mini-label">Economia</p>
            <div className="mix-combo-value mix-combo-value--green">{config.economyValue}</div>
          </div>
        </div>
      </div>

      <div className="mix-benefit-card">
        <div className="mix-benefit-card__kicker">Sem aumentar o prazo</div>
        <div className="mix-benefit-card__copy">Economia estimada</div>
        <div className="mix-benefit-card__value">{config.economyValue}</div>
      </div>

      <div className="mix-kpi-grid">
        <Kpi label="Margem livre" value={`até ${config.marginValue}`} />
        <Kpi label="Crédito depois" value={`até ${config.futureCreditValue}`} />
      </div>

      <Button variant="primary" size="lg" fullWidth onClick={goToContratacao}>
        {config.ctaLabel}
      </Button>

      <Button
        variant="ghost"
        fullWidth
        onClick={() => setDetailsOpen((v) => !v)}
        aria-expanded={detailsOpen}
        iconRight={
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none" className={detailsOpen ? 'rotate-180 transition-transform' : 'transition-transform'}>
            <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      >
        Ver detalhes da oferta
      </Button>

      {detailsOpen && (
        <div className="mix-details animate-fade-up">
          <div className="mix-receipt-wrap">
            <Receipt
              label={config.detailLabel}
              scenario={scenario}
              economyValue={config.economyValue}
              futureCreditValue={config.futureCreditValue}
            />
          </div>
        </div>
      )}

      <p className="mix-disclaimer">
        Valores estimados. Sujeitos à análise e aprovação de crédito.
      </p>
    </div>
  )

  const summarySidebar = (
    <div className="flex flex-col gap-3">
      <Card>
        <CardSection title="Resumo da oferta">
          <CardRow label="Estratégia" value={config.offerTitle} />
          <CardRow label="Você recebe" value={scenario.cash} />
          <CardRow label="Economia" value={config.economyValue} />
          <CardRow label="Nova parcela" value={scenario.installment} />
          <CardRow label="Margem livre" value={scenario.margin} />
        </CardSection>
      </Card>

      <Card>
        <CardSection title="Salário líquido">
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="rounded-xs border border-line bg-surface-soft p-2.5">
              <p className="text-[9px] font-bold uppercase text-muted mb-1">Antes</p>
              <p className="text-base font-bold text-ink">R$ {liquidoAntes.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-[10px] text-muted mt-1">Parcela R$ {parcelaAntes.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="rounded-xs border border-success-mid bg-success-bg p-2.5">
              <p className="text-[9px] font-bold uppercase text-success mb-1">Depois</p>
              <p className="text-base font-bold text-success">R$ {liquidoDepois.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-[10px] text-success/70 mt-1">Parcela R$ {parcelaDepois.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>
        </CardSection>
      </Card>
    </div>
  )

  const options = (
    <div className="mix-other">
      <div className="mix-other__head">
        <div className="mix-other__title">Outras opções para comparar</div>
        <div className="mix-other__count">{config.otherOptions.length} disponíveis</div>
      </div>
      <div className="flex flex-col gap-2">
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
    </div>
  )

  const bottomBack = (
    <div className="mix-back">
      <Button
        variant="ghost"
        fullWidth
        onClick={() => navigate('/ofertas')}
        icon={
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      >
        Voltar para ofertas
      </Button>
    </div>
  )

  return (
    <>
      <style>{`
        .mix-scenarios,
        .mix-content {
          max-width: 760px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .mix-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 320px;
          gap: 24px;
          align-items: start;
        }
        .mix-sidebar {
          position: sticky;
          top: 96px;
        }
        .mix-hero {
          background: #fff;
          border: 1px solid #dce5ff;
          border-radius: 22px;
          padding: 18px 24px;
          box-shadow: 0 8px 24px rgba(0,24,81,.06);
        }
        .mix-eyebrow,
        .mix-section-label,
        .mix-pill span {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0;
          text-transform: uppercase;
          line-height: 1.15;
        }
        .mix-eyebrow {
          color: #2350c8;
          margin: 0 0 6px;
        }
        .mix-title {
          margin: 0 0 6px;
          color: #1a3d8f;
          font-size: 30px;
          font-weight: 900;
          line-height: 1.04;
          letter-spacing: 0;
        }
        .mix-title span {
          color: #0a7c52;
        }
        .mix-subtitle {
          margin: 0;
          color: #7a8db8;
          font-size: 12px;
          font-weight: 500;
          line-height: 1.42;
          max-width: 620px;
        }
        .mix-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          width: max-content;
          max-width: 100%;
          background: #e8eeff;
          border: 1px solid #c2d0f8;
          border-radius: 999px;
          padding: 6px 12px 6px 9px;
        }
        .mix-pill__dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #0a7c52;
          flex: 0 0 auto;
        }
        .mix-pill span,
        .mix-section-label {
          color: #7a8db8;
        }
        .mix-scenario-card {
          width: 100%;
          text-align: left;
          border: 2px solid #dce5ff;
          border-radius: 22px;
          background: #fff;
          box-shadow: 0 8px 24px rgba(0,24,81,.06);
          cursor: pointer;
          padding: 14px;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          transition: border-color .18s ease, box-shadow .18s ease, background .18s ease, transform .18s ease;
        }
        .mix-scenario-card:hover {
          border-color: #c2d0f8;
          transform: translateY(-1px);
        }
        .mix-scenario-card.is-active {
          border-color: transparent;
          background:
            linear-gradient(180deg, #ffffff 0%, #f7fbff 100%) padding-box,
            linear-gradient(135deg, #2454D6, #18B7E8, #00A99D) border-box;
          box-shadow: 0 18px 42px rgba(13,35,90,.24);
        }
        .mix-scenario-card__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 10px;
        }
        .mix-scenario-card__title {
          color: #1a3d8f;
          font-size: 13px;
          font-weight: 900;
          line-height: 1.2;
          margin-bottom: 3px;
        }
        .mix-scenario-card__desc {
          color: #7a8db8;
          font-size: 11px;
          font-weight: 600;
          line-height: 1.35;
        }
        .mix-scenario-card__radio {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid #dce5ff;
          background: #fff;
          flex: 0 0 auto;
        }
        .mix-scenario-card.is-active .mix-scenario-card__radio {
          border: 6px solid #2454D6;
        }
        .mix-kpi-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 8px;
          margin-bottom: 12px;
        }
        .mix-kpi-grid--three {
          grid-template-columns: repeat(3, minmax(0,1fr));
          margin-bottom: 0;
        }
        .mix-kpi {
          border: 1px solid #d7e2ff;
          border-radius: 12px;
          background: #f7faff;
          padding: 9px 8px;
          text-align: center;
          min-width: 0;
        }
        .mix-kpi__label {
          color: #7a8db8;
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          line-height: 1.15;
          margin-bottom: 4px;
        }
        .mix-kpi__value {
          color: #1a3d8f;
          font-size: 12px;
          font-weight: 900;
          line-height: 1.05;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .mix-main-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
          border: 2px solid transparent;
          border-radius: 22px;
          padding: 18px;
          background:
            linear-gradient(180deg, #ffffff 0%, #f7fbff 100%) padding-box,
            linear-gradient(135deg, #2454D6, #18B7E8, #00A99D) border-box;
          box-shadow: 0 18px 42px rgba(13,35,90,.24);
        }
        .mix-main-pill {
          width: max-content;
          max-width: 100%;
          border-radius: 999px;
          background: #1a3d8f;
          color: #fff;
          padding: 6px 12px;
          font-size: 10px;
          font-weight: 900;
          line-height: 1.1;
          text-transform: uppercase;
          box-shadow: 0 8px 18px rgba(35,80,200,.18);
        }
        .mix-combo-strip,
        .mix-benefit-card,
        .mix-receipt-wrap {
          border: 1px solid #dce5ff;
          border-radius: 14px;
          background: #f7faff;
        }
        .mix-combo-strip {
          padding: 14px;
        }
        .mix-combo-strip__grid {
          display: grid;
          grid-template-columns: minmax(0,1fr) 34px minmax(0,1fr);
          align-items: end;
        }
        .mix-mini-label {
          margin: 0 0 5px;
          color: #667399;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          line-height: 1.15;
        }
        .mix-combo-value {
          color: #1a3d8f;
          font-size: 22px;
          font-weight: 900;
          line-height: 1;
          white-space: nowrap;
        }
        .mix-combo-value--green {
          color: #0a7c52;
        }
        .mix-plus {
          color: #7a8db8;
          font-size: 20px;
          font-weight: 900;
          text-align: center;
        }
        .mix-benefit-card {
          background: #eaf8f0;
          border-color: #a8dec3;
          padding: 14px;
          text-align: center;
        }
        .mix-benefit-card__kicker,
        .mix-benefit-card__copy {
          color: #0a7c52;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          line-height: 1.2;
        }
        .mix-benefit-card__copy {
          font-size: 13px;
          font-weight: 700;
          text-transform: none;
          opacity: .76;
          margin-top: 5px;
        }
        .mix-benefit-card__value {
          color: #0a7c52;
          font-size: 28px;
          font-weight: 900;
          line-height: 1.05;
          margin-top: 3px;
        }
        .mix-details {
          margin-top: 2px;
        }
        .mix-receipt-wrap {
          display: flex;
          justify-content: center;
          padding: 10px;
        }
        .mix-disclaimer {
          margin: 0;
          color: #a8b8d8;
          font-size: 8px;
          font-style: italic;
          line-height: 1.4;
          text-align: right;
        }
        .mix-other {
          margin-top: 24px;
        }
        .mix-other__head {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .mix-other__title {
          color: #1a3d8f;
          flex: 1;
          font-size: 13px;
          font-weight: 900;
        }
        .mix-other__count {
          color: #7a8db8;
          font-size: 10px;
          font-weight: 600;
        }
        .mix-back {
          margin-top: 18px;
        }
        @media (max-width: 767px) {
          .mix-layout {
            display: flex;
            flex-direction: column;
            gap: 24px;
          }
          .mix-sidebar {
            position: static;
            width: 100%;
          }
          .mix-hero {
            padding: 18px 16px 16px;
          }
          .mix-title {
            font-size: 26px;
          }
          .mix-main-card {
            padding: 16px;
          }
          .mix-combo-value {
            font-size: 20px;
          }
          .mix-kpi-grid--three {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div style={appPageStyle}>
        {isDesktop ? (
          <DesktopPageHeader
            clientName={clientName}
            onLogoClick={() => navigate('/ofertas')}
            fixed
            actions={[
              { label: 'Ofertas', onClick: () => navigate('/ofertas') },
              { label: 'Configuracoes', onClick: () => navigate('/configuracoes') },
            ]}
          />
        ) : (
          <MobilePageHeader
            clientName={clientName}
            onLogoClick={() => navigate('/ofertas')}
            fixed
            actions={[
              { label: 'Ofertas', onClick: () => navigate('/ofertas') },
              { label: 'Configuracoes', onClick: () => navigate('/configuracoes') },
            ]}
          />
        )}
        <main style={{ maxWidth: 1100, margin: '0 auto', padding: isDesktop ? '104px 24px 56px' : '92px 18px calc(24px + env(safe-area-inset-bottom))' }}>
          <div className="mix-layout">
            <div className="mix-content">
          {scenarioList}
          {offerCard}
          {options}
          {bottomBack}
            </div>
            <aside className="mix-sidebar">{summarySidebar}</aside>
          </div>
        </main>
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




