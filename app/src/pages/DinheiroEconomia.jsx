import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { DesktopPageHeader, MobilePageHeader } from '../components/AppHeader'
import { ResumoCard, ImpactoCard, ControleCard } from '../components/SimulationSideCards'
import { OperationGuideCard } from '../components/OperationGuideCard'
import { appPageStyle } from '../ui/theme'
import { loadProfileData } from '../lib/profileStorage'
import { printSimulationReceipt } from '../lib/receiptPrint'

function track(event, props = {}) {
  try {
    if (import.meta.env.DEV) console.log('[consigai:track]', event, props)
    if (typeof window.gtag === 'function') window.gtag('event', event, props)
    if (typeof window.analytics?.track === 'function') window.analytics.track(event, props)
    window.dispatchEvent(new CustomEvent('consigai:track', { detail: { event, ...props } }))
  } catch { /* silencioso */ }
}

// ---------------------------------------------------------------------------
// Mock — substituir por location.state.data quando API estiver pronta
// ---------------------------------------------------------------------------
const MOCK_FALLBACK = {
  routeTitle: 'Dinheiro + Economia',
  economyValue: 'R$ 2.399',
  futureValue: 'R$ 4.200',
  installmentValue: 'R$ 522/mês',
  nextStepValue: 'Análise combinada',
  ctaLabel: 'Continuar e revisar condições',
  liquidoAntes: 3200,
  liquidoDepois: 3722,
}

// ---------------------------------------------------------------------------
// Guia — explica a combinação paralela sem sequência rígida
// ---------------------------------------------------------------------------
const GUIDE = {
  badge: 'Guia ConsigAI',
  title: 'Como funciona a combinação',
  subtitle:
    'A ConsigAI une crédito e economia para montar uma proposta mais completa, com resultado em dinheiro, parcela e custo total visíveis antes de você decidir.',
  steps: [
    {
      label: 'Entendemos seu objetivo',
      title: 'Dinheiro, economia ou equilíbrio',
      body: 'Identificamos se você busca valor na conta, custo menor, parcela mais leve ou a melhor combinação dos três.',
    },
    {
      label: 'Comparamos os caminhos',
      title: 'Comparamos o que se aplica ao seu perfil',
      body: 'Analisamos os caminhos disponíveis para encontrar o melhor equilíbrio entre valor disponível, parcela e custo total.',
    },
    {
      label: 'Montamos a combinação',
      title: 'Você vê o resultado final',
      body: 'Valor estimado, economia e nova parcela — tudo junto, com taxa e prazo visíveis antes de avançar.',
    },
    {
      label: 'Revisão completa',
      title: 'Você confirma por último',
      body: 'Taxa, parcela, prazo e custo total aparecem antes de qualquer confirmação. Nada avança sem sua autorização.',
    },
  ],
  finalTitle: 'Você decide no final',
  finalText:
    'Nenhuma etapa avança sem sua confirmação. Simulação não é aprovação final. Nenhuma contratação automática.',
  badges: [
    'Dinheiro + economia na mesma análise',
    'Simulação sem compromisso',
    'Nada contratado sem você confirmar',
  ],
}

// ---------------------------------------------------------------------------
// Estratégias — perfil de resultado desejado
// ---------------------------------------------------------------------------
const STRATEGIES = [
  {
    key: 'balance',
    badge: 'Recomendado',
    title: 'Melhor equilíbrio',
    strong: 'Economia + dinheiro',
    description: 'Busca menor custo no contrato e valor disponível na conta em um só caminho.',
  },
  {
    key: 'relief',
    badge: 'Mais folga no mês',
    title: 'Mais folga no mês',
    strong: 'Parcela mais leve',
    description: 'Busca uma parcela mensal mais leve com valor disponível para receber.',
  },
]

const CONDITIONS = [
  { label: 'Nova parcela estimada', value: 'R$ 522/mês', text: 'estimada nesta simulação · sujeita à análise.', tone: 'default' },
  { label: 'Prazo', value: '84 meses', text: 'condição prevista nesta simulação.', tone: 'default' },
  { label: 'Taxa estimada', value: '1,88% a.m.', text: 'sujeita à análise final.', tone: 'default' },
  { label: 'Margem disponível estimada', value: 'até R$ 320', text: 'estimada nesta simulação · sujeita à análise.', tone: 'default' },
  { label: 'Custo total', value: '—', text: 'Você vê o custo completo antes de confirmar qualquer etapa.', tone: 'default' },
]

const CONTROL_ITEMS = [
  ['Sem contratação automática', 'Você confirma cada etapa. Nada avança sem sua autorização expressa.'],
  ['Se alguma parte não for aprovada', 'Você é avisado antes de qualquer avanço. Nada muda sem sua decisão.'],
  ['Processo cuidado pela ConsigAI', 'Você não precisa lidar diretamente com nenhum banco. A ConsigAI conduz tudo.'],
]

// ---------------------------------------------------------------------------
// Sub-componentes
// ---------------------------------------------------------------------------
function StrategyCard({ option, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`de-strategy-card consigai-cta-animated${active ? ' active' : ''}`}
    >
      <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <span className={`de-strategy-badge${active ? ' active' : ''}`}>{option.badge}</span>
          <h3 className="de-strategy-title">{option.title}</h3>
          <strong className={`de-strategy-strong${active ? ' active' : ''}`}>{option.strong}</strong>
          <p className="de-strategy-desc">{option.description}</p>
        </div>
        <span aria-hidden="true" className={`de-radio${active ? ' active' : ''}`} />
      </div>
    </button>
  )
}

function MetricCard({ item }) {
  const ok = item.tone === 'success'
  return (
    <article className={`de-metric${ok ? ' success' : ''}`}>
      <small className={`de-metric-label${ok ? ' success' : ''}`}>{item.label}</small>
      <strong className={`de-metric-value${ok ? ' success' : ''}`}>{item.value}</strong>
      <span className="de-metric-sub">{item.text}</span>
    </article>
  )
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------
export default function DinheiroEconomia() {
  const navigate = useNavigate()
  const location = useLocation()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const profile = loadProfileData()
  const clientName = profile.nomeExibicao || profile.nomeCompleto || 'Cliente'

  const data = useMemo(() => ({
    ...MOCK_FALLBACK,
    ...(location.state?.data ?? {}),
  }), [location.state])

  const [selectedStrategy, setSelectedStrategy] = useState(0)
  const [primaryCtaVisible, setPrimaryCtaVisible] = useState(true)
  const selectedOption = STRATEGIES[selectedStrategy] || STRATEGIES[0]
  const primaryCtaRef = useRef(null)

  useEffect(() => { track('view_dinheiro_economia') }, [])

  useEffect(() => {
    const onUnload = () => track('abandon_dinheiro_economia')
    window.addEventListener('beforeunload', onUnload)
    return () => window.removeEventListener('beforeunload', onUnload)
  }, [])

  useEffect(() => {
    const node = primaryCtaRef.current
    if (!node || typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(
      ([entry]) => setPrimaryCtaVisible(entry.isIntersecting),
      { threshold: 0.25 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const goContratacao = () => {
    track('click_continue_dinheiro_economia', { strategy: selectedOption.key })
    navigate('/dados-bancarios', {
      state: {
        sourcePath: '/dinheiro-economia',
        nextPath: '/contratacao',
        offerState: {
          sourcePath: '/dinheiro-economia',
          offerTitle: data.routeTitle,
          offerSubtitle: 'Resumo da estratégia antes da contratação',
          primaryValue: data.futureValue,
          ctaLabel: data.ctaLabel,
          summary: [
            { label: 'Economia total estimada', value: data.economyValue },
            { label: 'Valor estimado para receber', value: data.futureValue },
            { label: 'Nova parcela estimada', value: data.installmentValue },
            { label: 'Próximo passo', value: data.nextStepValue },
          ],
        },
      },
    })
  }

  const downloadReceiptPdf = () => {
    track('click_receipt_dinheiro_economia', { strategy: selectedOption.key })
    printSimulationReceipt({
      title: 'SIMULAÇÃO — DINHEIRO + ECONOMIA — CONSIGAI',
      highlightLabel: 'ECONOMIA TOTAL ESTIMADA',
      highlightValue: data.economyValue,
      rows: [
        { label: 'Estratégia', value: selectedOption.title },
        { label: 'Economia total estimada', value: data.economyValue },
        { label: 'Nova parcela estimada', value: data.installmentValue },
        { label: 'Próximo passo', value: data.nextStepValue },
      ],
      total: { label: 'Valor estimado para receber', value: data.futureValue },
    })
  }

  return (
    <div style={appPageStyle}>
      <style>{`
        :root {
          --de-blue-dark: #002D6E;
          --de-blue-main: #043B8B;
          --de-blue-int:  #2454D6;
          --de-blue-soft: #F4F9FF;
          --de-blue-line: #BFD4F6;
          --de-green:      #007A52;
          --de-green-s:   #00A86B;
          --de-green-soft:#F0FFF8;
          --de-green-line:#BDECD7;
          --de-muted:     #64748B;
          --de-line:      #DDE8F6;
        }

        .de-root { max-width: 1400px; margin: 0 auto; padding: 26px 24px 56px; }
        .de-layout {
          display: grid;
          grid-template-columns: 260px minmax(0, 1fr) 320px;
          gap: 28px;
          align-items: start;
        }
        .de-guide-col {}
        .de-sidebar { display: grid; gap: 16px; }

        .de-card {
          border: 1px solid var(--de-line);
          border-radius: 28px;
          background: #fff;
          box-shadow: 0 16px 38px rgba(3,36,111,.075);
        }
        .de-flow {
          padding: 22px;
          border-radius: 34px;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(ellipse at 8% 0%, rgba(4,59,139,.09), transparent 42%),
            radial-gradient(ellipse at 90% 85%, rgba(0,168,107,.10), transparent 38%),
            linear-gradient(160deg, #EEF5FF 0%, #fff 55%, #f2fff9 100%);
          box-shadow: 0 22px 52px rgba(3,36,111,.11);
          border: 1px solid var(--de-blue-line);
        }
        .de-flow::before {
          content: '';
          position: absolute;
          inset: 0 0 auto 0;
          height: 5px;
          background: linear-gradient(90deg, var(--de-blue-main), var(--de-blue-int), var(--de-green-s));
        }
        .de-flow > * { position: relative; z-index: 1; }

        /* Stat cards */
        .de-stat {
          padding: 18px 20px; border-radius: 21px; text-align: center;
          border: 1px solid var(--de-blue-line); background: #fff;
          box-shadow: 0 12px 26px rgba(3,36,111,.06);
        }
        .de-stat.success { border-color: var(--de-green-line); background: var(--de-green-soft); box-shadow: 0 16px 36px rgba(0,168,107,.10); }
        .de-stat.money   { border-color: var(--de-blue-line);  background: var(--de-blue-soft);  box-shadow: 0 16px 36px rgba(4,59,139,.09); }
        .de-stat-label { display: block; color: var(--de-blue-main); font-size: 10px; font-weight: 950; letter-spacing: .08em; text-transform: uppercase; }
        .de-stat.success .de-stat-label { color: var(--de-green); }
        .de-stat.money   .de-stat-label { color: var(--de-blue-int); }
        .de-stat-value { display: block; margin-top: 8px; color: #001851; font-size: clamp(28px, 3vw, 42px); line-height: 1; font-weight: 950; letter-spacing: -.075em; }
        .de-stat.success .de-stat-value { color: var(--de-green); }
        .de-stat.money   .de-stat-value { color: var(--de-blue-int); }
        .de-stat-caption { display: block; margin-top: 7px; color: var(--de-muted); font-size: 11.5px; line-height: 1.35; font-weight: 650; }

        /* Combo block paralelo — Economia + Dinheiro = Resultado */
        .de-combo-wrap {
          display: flex; justify-content: center; align-items: stretch;
          gap: 8px; flex-wrap: wrap;
          max-width: 640px; margin: 0 auto; width: 100%;
        }
        .de-combo-block { flex: 1; min-width: 120px; max-width: 180px; padding: 12px 16px; border-radius: 16px; text-align: center; }
        .de-combo-block.green  { background: var(--de-green-soft); border: 1.5px solid var(--de-green-line); }
        .de-combo-block.blue   { background: var(--de-blue-soft);  border: 1.5px solid var(--de-blue-line); }
        .de-combo-block.result { background: linear-gradient(135deg, #EEF4FF 0%, #F0FFF8 100%); border: 1.5px solid var(--de-blue-line); }
        .de-combo-label { display: block; font-size: 13px; font-weight: 950; color: #001851; }
        .de-combo-label.green { color: var(--de-green); }
        .de-combo-label.blue  { color: var(--de-blue-int); }
        .de-combo-label.result {
          background: linear-gradient(90deg, var(--de-blue-int), var(--de-green));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .de-combo-sub { display: block; margin-top: 4px; font-size: 10px; color: var(--de-muted); font-weight: 650; line-height: 1.3; }
        .de-combo-op { display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 950; color: var(--de-blue-int); flex-shrink: 0; padding: 0 4px; min-width: 24px; }

        /* Chips */
        .de-chip { display: inline-flex; align-items: center; min-height: 34px; padding: 0 13px; border-radius: 999px; font-size: 12px; font-weight: 850; }
        .de-chip.green { color: var(--de-green); background: var(--de-green-soft); border: 1px solid var(--de-green-line); }
        .de-chip.blue  { color: var(--de-blue-main); background: var(--de-blue-soft); border: 1px solid var(--de-blue-line); }

        /* Section header */
        .de-section-head { margin-bottom: 14px; }
        .de-section-title { margin: 0; color: #001851; font-size: 20px; line-height: 1; font-weight: 950; letter-spacing: -.045em; }
        .de-section-sub { margin: 6px 0 0; color: var(--de-muted); font-size: 12px; line-height: 1.45; font-weight: 600; }

        /* Card title/sub */
        .de-card-title { margin: 0; color: #001851; font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: .05em; }
        .de-card-sub { margin-top: 6px; color: var(--de-muted); font-size: 13px; line-height: 1.4; font-weight: 600; }

        /* Strategy cards */
        .de-strategy-card {
          width: 100%; min-height: 170px; padding: 18px; border-radius: 22px;
          border: 1px solid var(--de-line); background: #fff;
          box-shadow: 0 10px 22px rgba(3,36,111,.04);
          text-align: left; cursor: pointer;
          transition: box-shadow .18s ease, border-color .18s ease, background .18s ease, transform .16s ease;
        }
        .de-strategy-card.active {
          border: 2px solid var(--de-blue-int);
          background: radial-gradient(circle at 90% 8%, rgba(29,161,235,.10), transparent 32%), linear-gradient(180deg, #fff 0%, #F4F9FF 100%);
          box-shadow: 0 18px 38px rgba(3,36,111,.10);
        }
        .de-strategy-card:hover:not(.active) { transform: translateY(-1px); box-shadow: 0 14px 30px rgba(3,36,111,.08); }
        .de-strategy-badge {
          display: inline-flex; align-items: center; min-height: 28px;
          padding: 0 11px; border-radius: 999px;
          border: 1px solid var(--de-blue-line); background: var(--de-blue-soft); color: var(--de-blue-main);
          font-size: 10px; font-weight: 950; text-transform: uppercase; letter-spacing: .04em;
        }
        .de-strategy-badge.active { border-color: var(--de-green-line); background: var(--de-green-soft); color: var(--de-green); }
        .de-strategy-title { margin: 16px 0 0; color: #001851; font-size: 22px; line-height: 1; font-weight: 950; letter-spacing: -.05em; }
        .de-strategy-strong { display: block; margin-top: 8px; color: #001851; font-size: 14px; font-weight: 950; }
        .de-strategy-strong.active { color: var(--de-green); }
        .de-strategy-desc { margin: 8px 0 0; color: var(--de-muted); font-size: 12px; line-height: 1.4; font-weight: 650; }
        .de-radio { width: 18px; height: 18px; border-radius: 50%; flex: 0 0 auto; border: 2px solid #DCE5FF; background: #fff; margin-top: 2px; }
        .de-radio.active { border: 6px solid var(--de-blue-int); }

        /* Metric cards */
        .de-metric { min-height: 102px; padding: 16px; border-radius: 21px; background: #F8FBFF; border: 1px solid var(--de-line); }
        .de-metric.success { background: var(--de-green-soft); border-color: var(--de-green-line); }
        .de-metric-label { display: block; color: var(--de-blue-main); font-size: 10px; font-weight: 950; letter-spacing: .08em; text-transform: uppercase; }
        .de-metric-label.success { color: var(--de-green); }
        .de-metric-value { display: block; margin-top: 9px; color: #001851; font-size: 23px; line-height: 1; font-weight: 950; letter-spacing: -.05em; }
        .de-metric-value.success { color: var(--de-green); }
        .de-metric-sub { display: block; margin-top: 8px; color: var(--de-muted); font-size: 11px; line-height: 1.25; font-weight: 650; }

        /* CTAs */
        .de-cta {
          width: 100%; min-height: 52px; border: 0; border-radius: 13px; padding: 0 22px;
          background: linear-gradient(145deg, var(--de-blue-main), var(--de-blue-dark));
          color: #fff; font-size: 16px; font-weight: 900; letter-spacing: -.01em; cursor: pointer;
          box-shadow: 0 14px 32px rgba(4,59,139,.22);
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .de-secondary {
          width: 100%; min-height: 48px; border-radius: 13px; padding: 0 22px;
          border: 1px solid var(--de-blue-line); background: #fff; color: var(--de-blue-main);
          font-size: 15px; font-weight: 900; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 20px rgba(4,59,139,.12);
        }
        .de-back {
          width: 100%; min-height: 46px; border-radius: 13px; padding: 0 18px;
          border: 1px solid var(--de-blue-line); background: #fff; color: var(--de-blue-main);
          font-size: 14px; font-weight: 900; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 20px rgba(4,59,139,.12);
        }
        .de-actions { margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--de-line); }
        .de-actions > button + button { margin-top: 12px; }
        .de-safe { margin-top: 12px; text-align: center; font-size: 11px; color: var(--de-muted); font-weight: 700; line-height: 1.45; }

        .consigai-cta-animated { position: relative; overflow: hidden; transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease, filter .16s ease; }
        .consigai-cta-animated:hover { transform: translateY(-1px) !important; }
        .consigai-cta-animated:active { transform: translateY(0); }

        @media (max-width: 1200px) { .de-layout { grid-template-columns: minmax(0, 1fr) 320px; } .de-guide-col { display: none; } }
        @media (max-width: 1060px) { .de-layout { grid-template-columns: 1fr; } .de-guide-col { display: none; } .de-sidebar { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 640px) { .de-sidebar { grid-template-columns: 1fr; } .de-root { padding: 0 0 40px; } }
      `}</style>

      {isDesktop ? (
        <DesktopPageHeader
          clientName={clientName}
          onLogoClick={() => navigate('/ofertas')}
          fixed
          pageTitle="Dinheiro + Economia"
          pageDescription="Valor na conta e menor custo. Você revisa antes de confirmar."
          actions={[
            { label: 'Ofertas', onClick: () => navigate('/ofertas') },
            { label: 'Configurações', onClick: () => navigate('/configuracoes') },
            { label: 'Acompanhamento', onClick: () => navigate('/acompanhamento') },
          ]}
        />
      ) : (
        <MobilePageHeader
          clientName={clientName}
          onLogoClick={() => navigate('/ofertas')}
          fixed
          pageTitle="Dinheiro + Economia"
          pageDescription="Valor na conta e menor custo. Você revisa antes de confirmar."
          actions={[
            { label: 'Ofertas', onClick: () => navigate('/ofertas') },
            { label: 'Configurações', onClick: () => navigate('/configuracoes') },
            { label: 'Acompanhamento', onClick: () => navigate('/acompanhamento') },
          ]}
        />
      )}

      <main
        className="de-root"
        style={{
          paddingTop: isDesktop ? 104 : 92,
          paddingBottom: !primaryCtaVisible ? (isDesktop ? 118 : 172) : undefined,
        }}
      >
        <div className="de-layout">

          {/* Coluna esquerda — guia */}
          <div className="de-guide-col" style={{ position: 'sticky', top: 104 }}>
            <OperationGuideCard {...GUIDE} />
          </div>

          {/* Coluna central */}
          <div style={{ display: 'grid', gap: 16 }}>

            {/* Hero */}
            <section className="de-flow">
              <div style={{ display: 'grid', gap: 18, textAlign: 'center' }}>

                {/* Kicker */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '7px 14px', borderRadius: 999,
                    background: 'linear-gradient(135deg, #EEF4FF, #F4F9FF)',
                    border: '1px solid var(--de-blue-line)',
                    color: '#043B8B', fontSize: 11, lineHeight: 1, fontWeight: 950,
                    textTransform: 'uppercase', letterSpacing: '.10em',
                  }}>
                    <span aria-hidden="true" style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: '#2454D6', boxShadow: '0 0 10px rgba(36,84,214,.70)',
                      flexShrink: 0,
                    }} />
                    Estratégia encontrada para você
                  </div>
                </div>

                {/* Headline */}
                <div>
                  <h1 style={{
                    margin: '4px auto 0', maxWidth: 820,
                    color: '#001851',
                    fontSize: 'clamp(32px, 3.4vw, 48px)',
                    lineHeight: 1.02, fontWeight: 950, letterSpacing: '-.075em',
                  }}>
                    Economia{' '}
                    <span style={{
                      background: 'linear-gradient(90deg, #2454D6, #007A52)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>+ Dinheiro.</span>
                  </h1>
                  <p style={{
                    maxWidth: 680, margin: '14px auto 0',
                    color: '#64748B', fontSize: 14, lineHeight: 1.55, fontWeight: 650,
                  }}>
                    A ConsigAI combina caminhos para buscar economia no seu contrato e valor disponível
                    na conta — com taxa, parcela e custo total visíveis antes de qualquer confirmação.
                  </p>
                </div>

                {/* Bloco combinação paralela */}
                <div>
                  <p style={{
                    fontSize: 10, fontWeight: 950, color: '#64748B',
                    textTransform: 'uppercase', letterSpacing: '.10em',
                    margin: '0 0 10px',
                  }}>
                    O que está sendo combinado
                  </p>
                  <div className="de-combo-wrap">
                    <div className="de-combo-block green">
                      <span className="de-combo-label green">Economia</span>
                      <span className="de-combo-sub">custo menor no contrato</span>
                    </div>
                    <div className="de-combo-op">+</div>
                    <div className="de-combo-block blue">
                      <span className="de-combo-label blue">Dinheiro</span>
                      <span className="de-combo-sub">valor estimado na conta</span>
                    </div>
                    <div className="de-combo-op">=</div>
                    <div className="de-combo-block result">
                      <span className="de-combo-label result">Melhor equilíbrio</span>
                      <span className="de-combo-sub">você revisa tudo antes de confirmar</span>
                    </div>
                  </div>
                </div>

                {/* Stat cards */}
                <div style={{ width: 'min(820px, 100%)', margin: '0 auto' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1.1fr .9fr' : '1fr', gap: 12 }}>
                    <div className="de-stat success">
                      <small className="de-stat-label">Economia total estimada</small>
                      <strong className="de-stat-value">{data.economyValue}</strong>
                      <span className="de-stat-caption">redução estimada no custo total · mesmo prazo</span>
                    </div>
                    <div className="de-stat money">
                      <small className="de-stat-label">Valor estimado para receber</small>
                      <strong className="de-stat-value">{data.futureValue}</strong>
                      <span className="de-stat-caption">valor possível nesta simulação · sujeito à análise</span>
                    </div>
                  </div>
                </div>

                {/* Trust chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
                  <span className="de-chip green">Economia no custo total</span>
                  <span className="de-chip blue">Valor estimado na conta</span>
                  <span className="de-chip blue">Você revisa antes de confirmar</span>
                </div>

                {/* Microcopy */}
                <p style={{
                  margin: '0 auto', maxWidth: 560,
                  color: '#64748B', fontSize: 11.5, lineHeight: 1.45, fontWeight: 700,
                  padding: '10px 16px', borderRadius: 12,
                  background: 'rgba(221,232,246,.35)',
                  border: '1px solid var(--de-blue-line)',
                }}>
                  Simulação sem compromisso. Você revisa taxa, prazo, parcela e custo total antes de confirmar.
                  Nada é contratado automaticamente.
                </p>
              </div>
            </section>

            {/* Estratégias */}
            <section className="de-card" style={{ padding: 22 }}>
              <div className="de-section-head">
                <h2 className="de-section-title">Escolha como quer combinar dinheiro e economia</h2>
                <p className="de-section-sub">Duas variações da mesma análise. Você compara e decide qual faz mais sentido para o seu momento.</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(2, minmax(0, 1fr))' : '1fr', gap: 12 }}>
                {STRATEGIES.map((option, index) => (
                  <StrategyCard
                    key={option.key}
                    option={option}
                    active={selectedStrategy === index}
                    onClick={() => {
                      setSelectedStrategy(index)
                      track('select_dinheiro_economia_strategy', { strategy_key: option.key })
                    }}
                  />
                ))}
              </div>
            </section>

            {/* Condições */}
            <section className="de-card" style={{ padding: 22 }}>
              <div className="de-section-head">
                <h2 className="de-section-title">Condições da simulação</h2>
                <p className="de-section-sub">Valores estimados. Taxa, prazo e parcela aparecem antes de qualquer confirmação.</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(auto-fit, minmax(140px, 1fr))' : '1fr', gap: 12 }}>
                {CONDITIONS.map((item) => (
                  <MetricCard key={item.label} item={item} />
                ))}
              </div>
            </section>

            <ControleCard horizontal items={CONTROL_ITEMS} />
          </div>

          {/* Coluna direita — sidebar */}
          <aside className="de-sidebar" style={{ position: isDesktop ? 'sticky' : 'static', top: 104 }}>
            <ResumoCard
              title="Resumo da simulação"
              subtitle="Condições simuladas. Confirme tudo antes de avançar."
              highlight={{ label: 'Estratégia selecionada', value: selectedOption.title }}
              rows={[
                { label: 'Economia total estimada', value: data.economyValue },
                { label: 'Valor estimado para receber', value: data.futureValue },
                { label: 'Nova parcela estimada', value: data.installmentValue },
                { label: 'Próximo passo', value: data.nextStepValue },
              ]}
            />

            <ImpactoCard
              liquidoAntes={data.liquidoAntes}
              liquidoDepois={data.liquidoDepois}
              novaParcela={data.installmentValue}
            />

            <div className="de-card" style={{ padding: 22 }}>
              <p className="de-card-title">Próximo passo</p>
              <p className="de-card-sub" style={{ marginBottom: 0 }}>
                Avance para ver taxa, prazo, parcela e valor estimado antes de qualquer confirmação.
                Nada é contratado nesta etapa.
              </p>
              <div className="de-actions">
                <button
                  ref={primaryCtaRef}
                  type="button"
                  className="de-cta consigai-cta-animated"
                  onClick={goContratacao}
                >
                  Continuar e revisar condições
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button type="button" className="de-secondary consigai-cta-animated" onClick={downloadReceiptPdf}>
                  Gerar recibo da simulação
                </button>
                <button type="button" className="de-back consigai-cta-animated" onClick={() => { track('click_back_dinheiro_economia'); navigate('/ofertas') }}>
                  Voltar para ofertas
                </button>
              </div>
              <p className="de-safe">
                Simulação sem compromisso. Nenhuma contratação<br />
                sem sua confirmação expressa.
              </p>
            </div>
          </aside>

        </div>
      </main>

      {/* Sticky bottom bar */}
      {!primaryCtaVisible && (
        <div style={{
          position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 50,
          background: 'rgba(255,255,255,.98)', backdropFilter: 'blur(12px)',
          borderTop: '1px solid #DDE8F6', boxShadow: '0 -2px 18px rgba(3,36,111,.08)',
          padding: isDesktop ? '14px 24px' : '10px 16px',
        }}>
          <div style={{
            display: 'grid', alignItems: 'center',
            gridTemplateColumns: isDesktop ? 'auto 1px 180px 320px' : 'minmax(0,1fr) 132px',
            columnGap: isDesktop ? 28 : 16, rowGap: 10,
            width: 'fit-content', maxWidth: '100%', margin: '0 auto',
          }}>
            <div style={{ minWidth: 0, maxWidth: isDesktop ? 280 : 'none' }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: '#071B45', lineHeight: '16px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selectedOption.title}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', marginTop: 1, lineHeight: '15px', whiteSpace: 'nowrap' }}>
                Dinheiro + Economia
              </div>
            </div>
            {isDesktop && <div style={{ width: 1, height: 36, background: '#DDE8F6' }} />}
            <div style={{ minWidth: isDesktop ? 180 : 132 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#00A86B', letterSpacing: '-.02em', lineHeight: '25px', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                {data.economyValue}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', lineHeight: '13px', whiteSpace: 'nowrap' }}>
                economia total estimada
              </div>
            </div>
            <button
              type="button"
              className="de-cta consigai-cta-animated"
              onClick={goContratacao}
              style={{
                gridColumn: isDesktop ? undefined : '1 / -1',
                width: isDesktop ? 320 : '100%',
                minWidth: isDesktop ? 320 : undefined,
                maxWidth: isDesktop ? 320 : undefined,
                marginTop: isDesktop ? 0 : 2,
              }}
            >
              Continuar e revisar condições
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
