import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { DesktopPageHeader, MobilePageHeader } from '../components/AppHeader'
import { ResumoCard, ImpactoCard, ControleCard } from '../components/SimulationSideCards'
import { OperationGuideCard } from '../components/OperationGuideCard'
import { appPageStyle } from '../ui/theme'
import { loadProfileData } from '../lib/profileStorage'
import { printSimulationReceipt } from '../lib/receiptPrint'

// ---------------------------------------------------------------------------
// Analytics — padrão idêntico ao de Portabilidade
// ---------------------------------------------------------------------------
function track(event, props = {}) {
  try {
    if (import.meta.env.DEV) console.log('[consigai:track]', event, props)
    if (typeof window.gtag === 'function') window.gtag('event', event, props)
    if (typeof window.analytics?.track === 'function') window.analytics.track(event, props)
    window.dispatchEvent(new CustomEvent('consigai:track', { detail: { event, ...props } }))
  } catch { /* silencioso em produção */ }
}

// ---------------------------------------------------------------------------
// Fallback mock — usado enquanto API não fornece dados via location.state
// Quando a API estiver pronta, passar via: navigate('/estrategia-combinada', { state: { data: {...} } })
// ---------------------------------------------------------------------------
const MOCK_FALLBACK = {
  routeTitle: 'Economia + Dinheiro',
  economyValue: 'R$ 2.399',
  futureValue: 'R$ 4.200',
  installmentValue: 'R$ 522/mês',
  nextStepValue: 'Portabilidade',
  ctaLabel: 'Confirmar Estratégia',
  liquidoAntes: 3200,  // salário - parcela atual (mais alta)
  liquidoDepois: 3722, // salário - nova parcela R$ 522 (mais baixa após economia)
}

// ---------------------------------------------------------------------------
// Guia da operação — conteúdo específico para Estratégia Combinada
// ---------------------------------------------------------------------------
const COMBINED_GUIDE = {
  badge: 'Guia ConsigAI',
  title: 'Como funciona a estratégia combinada',
  subtitle:
    'Primeiro buscamos uma condição melhor para seu contrato. Depois mostramos se vale refinanciar para gerar dinheiro, economia ou alívio mensal.',
  steps: [
    {
      label: 'Passo 1 — Portabilidade',
      title: 'Buscamos taxa menor',
      body: 'Comparamos seu contrato atual com bancos que oferecem taxa menor para o mesmo saldo.',
    },
    {
      label: 'Passo 2 — Nova condição',
      title: 'Ver taxa, parcela e economia',
      body: 'Você vê taxa, parcela, prazo e economia estimada antes de decidir qualquer coisa.',
    },
    {
      label: 'Passo 3 — Refinanciamento',
      title: 'Avaliar dinheiro disponível',
      body: 'Depois avaliamos se a nova condição permite liberar dinheiro ou reduzir ainda mais a parcela.',
    },
    {
      label: 'Passo 4 — Revisão',
      title: 'Você confirma por último',
      body: 'Você confirma apenas depois de ver todas as condições. Nenhuma etapa avança sem sua autorização.',
    },
  ],
  finalTitle: 'Você decide no final',
  finalText:
    'Nenhuma etapa avança sem sua confirmação. Simulação não é aprovação final. Portabilidade é direito garantido por lei.',
  badges: [
    'Simulação sem compromisso',
    'Duas etapas com clareza',
    'Nada automático',
  ],
}

// ---------------------------------------------------------------------------
// Estratégias de perfil
// ---------------------------------------------------------------------------
const STRATEGIES = [
  {
    key: 'balance',
    badge: 'Recomendado',
    title: 'Melhor equilíbrio',
    strong: 'Economia + dinheiro',
    description: 'Reduz custo primeiro e depois avalia valor disponível com mais controle.',
  },
  {
    key: 'relief',
    badge: 'Mais folga no mês',
    title: 'Mais folga no mês',
    strong: 'Parcela mais leve',
    description: 'Prioriza aliviar o orçamento mensal depois da etapa de economia.',
  },
]

// ---------------------------------------------------------------------------
// Condições da simulação
// ---------------------------------------------------------------------------
const CONDITIONS = [
  { label: 'Parcela estimada', value: 'R$ 522/mês', text: 'após portabilidade e refinanciamento estimados.', tone: 'default' },
  { label: 'Prazo', value: '84 meses', text: 'condição prevista nesta estratégia.', tone: 'default' },
  { label: 'Taxa estimada', value: '1,88% a.m.', text: 'sujeita à análise final.', tone: 'default' },
  { label: 'Margem estimada', value: 'até R$ 320', text: 'após a etapa de economia. Sujeita à análise.', tone: 'default' },
  { label: 'Custo total', value: '—', text: 'CET e custo total informados na etapa de revisão.', tone: 'default' },
]

// ControleCard — horizontal, 3 items (padrão Portabilidade)
const CONTROL_ITEMS = [
  ['Sem contratação automática', 'Você confirma cada etapa. Nada avança sem sua autorização expressa.'],
  ['Se a port. não for aceita', 'Você é avisado antes de qualquer avanço. Nada muda sem sua decisão.'],
  ['Processo cuidado pela ConsigAI', 'Você não precisa falar com o banco antigo. A ConsigAI conduz tudo.'],
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
      className={`ec-strategy-card consigai-cta-animated${active ? ' active' : ''}`}
    >
      <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <span className={`ec-strategy-badge${active ? ' active' : ''}`}>{option.badge}</span>
          <h3 className="ec-strategy-title">{option.title}</h3>
          <strong className={`ec-strategy-strong${active ? ' active' : ''}`}>{option.strong}</strong>
          <p className="ec-strategy-desc">{option.description}</p>
        </div>
        <span
          aria-hidden="true"
          className={`ec-radio${active ? ' active' : ''}`}
        />
      </div>
    </button>
  )
}

function MetricCard({ item }) {
  const ok = item.tone === 'success'
  return (
    <article className={`ec-metric${ok ? ' success' : ''}`}>
      <small className={`ec-metric-label${ok ? ' success' : ''}`}>{item.label}</small>
      <strong className={`ec-metric-value${ok ? ' success' : ''}`}>{item.value}</strong>
      <span className="ec-metric-sub">{item.text}</span>
    </article>
  )
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------
export default function EstrategiaCombinada() {
  const navigate = useNavigate()
  const location = useLocation()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const profile = loadProfileData()
  const clientName = profile.nomeExibicao || profile.nomeCompleto || 'Cliente'

  // Merge location.state com fallback mock.
  // Quando API estiver pronta, passar: navigate('/estrategia-combinada', { state: { data: {...} } })
  const data = useMemo(() => ({
    ...MOCK_FALLBACK,
    ...(location.state?.data ?? {}),
  }), [location.state])

  const [selectedStrategy, setSelectedStrategy] = useState(0)
  const [primaryCtaVisible, setPrimaryCtaVisible] = useState(true)
  const selectedOption = STRATEGIES[selectedStrategy] || STRATEGIES[0]
  const primaryCtaRef = useRef(null)

  // view_estrategia_combinada — dispara uma vez ao montar
  useEffect(() => {
    track('view_estrategia_combinada')
  }, [])

  // abandon_combined_page — dispara ao fechar aba ou navegar saindo sem CTA
  useEffect(() => {
    const onUnload = () => track('abandon_combined_page')
    window.addEventListener('beforeunload', onUnload)
    return () => window.removeEventListener('beforeunload', onUnload)
  }, [])

  // Sticky bottom bar — oculta quando CTA principal está visível (padrão Portabilidade)
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
    track('click_continue_combined', { strategy: selectedOption.key })
    navigate('/dados-bancarios', {
      state: {
        sourcePath: '/estrategia-combinada',
        nextPath: '/contratacao',
        offerState: {
          sourcePath: '/estrategia-combinada',
          offerTitle: data.routeTitle,
          offerSubtitle: 'Resumo da estratégia combinada antes da contratação',
          primaryValue: data.futureValue,
          ctaLabel: data.ctaLabel,
          summary: [
            { label: 'Economia estimada', value: data.economyValue },
            { label: 'Dinheiro estimado depois', value: data.futureValue },
            { label: 'Parcela estimada', value: data.installmentValue },
            { label: 'Próximo passo', value: data.nextStepValue },
          ],
        },
      },
    })
  }

  const downloadReceiptPdf = () => {
    track('click_generate_receipt_combined', { strategy: selectedOption.key })
    printSimulationReceipt({
      title: 'SIMULAÇÃO DE ECONOMIA + DINHEIRO — CONSIGAI',
      highlightLabel: 'ECONOMIA ESTIMADA',
      highlightValue: data.economyValue,
      rows: [
        { label: 'Estratégia', value: selectedOption.title },
        { label: 'Economia estimada', value: data.economyValue },
        { label: 'Parcela estimada', value: data.installmentValue },
        { label: 'Próximo passo', value: data.nextStepValue },
      ],
      total: { label: 'Dinheiro estimado depois', value: data.futureValue },
    })
  }

  return (
    <div style={appPageStyle}>
      {/* ------------------------------------------------------------------ */}
      {/* CSS — padrão visual idêntico ao da Portabilidade                    */}
      {/* ------------------------------------------------------------------ */}
      <style>{`
        :root {
          --ec-blue-dark: #002D6E;
          --ec-blue-main: #043B8B;
          --ec-blue-int:  #2454D6;
          --ec-blue-soft: #F4F9FF;
          --ec-blue-line: #BFD4F6;
          --ec-green:      #007A52;
          --ec-green-s:   #00A86B;
          --ec-green-soft:#F0FFF8;
          --ec-green-line:#BDECD7;
          --ec-muted:     #64748B;
          --ec-line:      #DDE8F6;
        }

        /* ── Layout ───────────────────────────────────────────────────── */
        .ec-root { max-width: 1400px; margin: 0 auto; padding: 26px 24px 56px; }
        .ec-layout {
          display: grid;
          grid-template-columns: 260px minmax(0, 1fr) 320px;
          gap: 28px;
          align-items: start;
        }
        .ec-guide-col { /* sticky handled inline */ }
        .ec-sidebar   { display: grid; gap: 16px; }

        /* ── Cards ────────────────────────────────────────────────────── */
        .ec-card {
          border: 1px solid var(--ec-line);
          border-radius: 28px;
          background: #fff;
          box-shadow: 0 16px 38px rgba(3,36,111,.075);
        }
        .ec-flow {
          padding: 22px;
          border-radius: 34px;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(ellipse at 5% 0%, rgba(0,122,82,.07), transparent 40%),
            radial-gradient(ellipse at 92% 8%, rgba(0,168,107,.10), transparent 36%),
            linear-gradient(160deg, #f0fff8 0%, #fff 65%);
          box-shadow: 0 22px 52px rgba(3,36,111,.11);
          border: 1px solid var(--ec-green-line);
        }
        .ec-flow::before {
          content: '';
          position: absolute;
          inset: 0 0 auto 0;
          height: 5px;
          background: linear-gradient(90deg, var(--ec-green), var(--ec-green-s), var(--ec-blue-int), var(--ec-blue-main));
        }
        .ec-flow > * { position: relative; z-index: 1; }

        /* ── Stat cards (hero) ────────────────────────────────────────── */
        .ec-stat {
          padding: 18px 20px;
          border-radius: 21px;
          text-align: center;
          border: 1px solid var(--ec-blue-line);
          background: #fff;
          box-shadow: 0 12px 26px rgba(3,36,111,.06);
        }
        .ec-stat.success {
          border-color: var(--ec-green-line);
          background: var(--ec-green-soft);
          box-shadow: 0 16px 36px rgba(0,168,107,.10);
        }
        .ec-stat-label {
          display: block;
          color: var(--ec-blue-main);
          font-size: 10px; font-weight: 950;
          letter-spacing: .08em; text-transform: uppercase;
        }
        .ec-stat.success .ec-stat-label { color: var(--ec-green); }
        .ec-stat-value {
          display: block;
          margin-top: 8px;
          color: #001851;
          font-size: clamp(28px, 3vw, 42px);
          line-height: 1; font-weight: 950;
          letter-spacing: -.075em;
        }
        .ec-stat.success .ec-stat-value { color: var(--ec-green); }
        .ec-stat-caption {
          display: block;
          margin-top: 7px;
          color: var(--ec-muted);
          font-size: 11.5px; line-height: 1.35; font-weight: 650;
        }

        /* ── Hero chips ───────────────────────────────────────────────── */
        .ec-chip {
          display: inline-flex; align-items: center;
          min-height: 34px; padding: 0 13px;
          border-radius: 999px;
          font-size: 12px; font-weight: 850;
        }
        .ec-chip.green { color: var(--ec-green); background: var(--ec-green-soft); border: 1px solid var(--ec-green-line); }
        .ec-chip.blue  { color: var(--ec-blue-main); background: var(--ec-blue-soft); border: 1px solid var(--ec-blue-line); }

        /* ── Section header ───────────────────────────────────────────── */
        .ec-section-head { margin-bottom: 14px; }
        .ec-section-title {
          margin: 0;
          color: #001851;
          font-size: 20px; line-height: 1; font-weight: 950;
          letter-spacing: -.045em;
        }
        .ec-section-sub {
          margin: 6px 0 0;
          color: var(--ec-muted);
          font-size: 12px; line-height: 1.45; font-weight: 600;
        }

        /* ── Card title/sub (sidebar cards) ───────────────────────────── */
        .ec-card-title {
          margin: 0;
          color: #001851;
          font-size: 14px; font-weight: 900;
          text-transform: uppercase; letter-spacing: .05em;
        }
        .ec-card-sub {
          margin-top: 6px;
          color: var(--ec-muted);
          font-size: 13px; line-height: 1.4; font-weight: 600;
        }

        /* ── Strategy cards ───────────────────────────────────────────── */
        .ec-strategy-card {
          width: 100%; min-height: 170px; padding: 18px;
          border-radius: 22px;
          border: 1px solid var(--ec-line);
          background: #fff;
          box-shadow: 0 10px 22px rgba(3,36,111,.04);
          text-align: left; cursor: pointer;
          transition: box-shadow .18s ease, border-color .18s ease, background .18s ease, transform .16s ease;
        }
        .ec-strategy-card.active {
          border: 2px solid var(--ec-blue-int);
          background: radial-gradient(circle at 90% 8%, rgba(29,161,235,.10), transparent 32%),
                      linear-gradient(180deg, #fff 0%, #F4F9FF 100%);
          box-shadow: 0 18px 38px rgba(3,36,111,.10);
        }
        .ec-strategy-card:hover:not(.active) { transform: translateY(-1px); box-shadow: 0 14px 30px rgba(3,36,111,.08); }
        .ec-strategy-badge {
          display: inline-flex; align-items: center; min-height: 28px;
          padding: 0 11px; border-radius: 999px;
          border: 1px solid var(--ec-blue-line);
          background: var(--ec-blue-soft);
          color: var(--ec-blue-main);
          font-size: 10px; font-weight: 950;
          text-transform: uppercase; letter-spacing: .04em;
        }
        .ec-strategy-badge.active { border-color: var(--ec-green-line); background: var(--ec-green-soft); color: var(--ec-green); }
        .ec-strategy-title { margin: 16px 0 0; color: #001851; font-size: 22px; line-height: 1; font-weight: 950; letter-spacing: -.05em; }
        .ec-strategy-strong { display: block; margin-top: 8px; color: var(--ec-muted); font-size: 14px; font-weight: 950; }
        .ec-strategy-strong.active { color: var(--ec-green); }
        .ec-strategy-desc { margin: 8px 0 0; color: var(--ec-muted); font-size: 12px; line-height: 1.4; font-weight: 650; }
        .ec-radio {
          width: 18px; height: 18px; border-radius: 50%;
          flex: 0 0 auto;
          border: 2px solid #DCE5FF;
          background: #fff; margin-top: 2px;
        }
        .ec-radio.active { border: 6px solid var(--ec-blue-int); }

        /* ── Metric cards ─────────────────────────────────────────────── */
        .ec-metric {
          min-height: 102px; padding: 16px; border-radius: 21px;
          background: #F8FBFF; border: 1px solid var(--ec-line);
        }
        .ec-metric.success { background: var(--ec-green-soft); border-color: var(--ec-green-line); }
        .ec-metric-label {
          display: block;
          color: var(--ec-blue-main);
          font-size: 10px; font-weight: 950;
          letter-spacing: .08em; text-transform: uppercase;
        }
        .ec-metric-label.success { color: var(--ec-green); }
        .ec-metric-value { display: block; margin-top: 9px; color: #001851; font-size: 23px; line-height: 1; font-weight: 950; letter-spacing: -.05em; }
        .ec-metric-value.success { color: var(--ec-green); }
        .ec-metric-sub { display: block; margin-top: 8px; color: var(--ec-muted); font-size: 11px; line-height: 1.25; font-weight: 650; }

        /* ── CTAs — idênticos a Portabilidade ─────────────────────────── */
        .ec-cta {
          width: 100%; min-height: 52px;
          border: 0; border-radius: 13px;
          padding: 0 22px;
          background: linear-gradient(145deg, var(--ec-blue-main), var(--ec-blue-dark));
          color: #fff; font-size: 16px; font-weight: 900;
          letter-spacing: -.01em; cursor: pointer;
          box-shadow: 0 14px 32px rgba(4,59,139,.22);
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .ec-secondary {
          width: 100%; min-height: 48px;
          border-radius: 13px; padding: 0 22px;
          border: 1px solid var(--ec-blue-line);
          background: #fff; color: var(--ec-blue-main);
          font-size: 15px; font-weight: 900;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 20px rgba(4,59,139,.12);
        }
        .ec-back {
          width: 100%; min-height: 46px;
          border-radius: 13px; padding: 0 18px;
          border: 1px solid var(--ec-blue-line);
          background: #fff; color: var(--ec-blue-main);
          font-size: 14px; font-weight: 900;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 20px rgba(4,59,139,.12);
        }
        .ec-actions { margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--ec-line); }
        .ec-actions > button + button { margin-top: 12px; }
        .ec-safe {
          margin-top: 12px;
          text-align: center;
          font-size: 11px; color: var(--ec-muted); font-weight: 700;
          line-height: 1.45;
        }

        /* Hover animation — padrão .consigai-cta-animated */
        .consigai-cta-animated {
          position: relative; overflow: hidden;
          transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease, filter .16s ease;
        }
        .consigai-cta-animated:hover { transform: translateY(-1px) !important; }
        .consigai-cta-animated:active { transform: translateY(0); }

        /* ── Responsivo ───────────────────────────────────────────────── */
        @media (max-width: 1200px) {
          .ec-layout { grid-template-columns: minmax(0, 1fr) 320px; }
          .ec-guide-col { display: none; }
        }
        @media (max-width: 1060px) {
          .ec-layout { grid-template-columns: 1fr; }
          .ec-guide-col { display: none; }
          .ec-sidebar { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 640px) {
          .ec-sidebar { grid-template-columns: 1fr; }
          .ec-root { padding: 0 0 40px; }
        }
      `}</style>

      {/* ------------------------------------------------------------------ */}
      {/* Header                                                               */}
      {/* ------------------------------------------------------------------ */}
      {isDesktop ? (
        <DesktopPageHeader
          clientName={clientName}
          onLogoClick={() => navigate('/ofertas')}
          fixed
          pageTitle="Economia + Dinheiro"
          pageDescription="Economia primeiro. Dinheiro depois."
          actions={[
            { label: 'Ofertas', onClick: () => navigate('/ofertas') },
            { label: 'Configuracoes', onClick: () => navigate('/configuracoes') },
            { label: 'Acompanhamento', onClick: () => navigate('/acompanhamento') },
          ]}
        />
      ) : (
        <MobilePageHeader
          clientName={clientName}
          onLogoClick={() => navigate('/ofertas')}
          fixed
          pageTitle="Economia + Dinheiro"
          pageDescription="Economia primeiro. Dinheiro depois."
          actions={[
            { label: 'Ofertas', onClick: () => navigate('/ofertas') },
            { label: 'Configuracoes', onClick: () => navigate('/configuracoes') },
            { label: 'Acompanhamento', onClick: () => navigate('/acompanhamento') },
          ]}
        />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Main — mesma estrutura de Portabilidade                             */}
      {/* ------------------------------------------------------------------ */}
      <main
        className="ec-root"
        style={{
          paddingTop: isDesktop ? 104 : 92,
          paddingBottom: !primaryCtaVisible ? (isDesktop ? 118 : 172) : undefined,
        }}
      >
        <div className="ec-layout">

          {/* ── Coluna esquerda — guia azul (padrão OperationGuideCard) ── */}
          <div className="ec-guide-col" style={{ position: 'sticky', top: 104 }}>
            <OperationGuideCard {...COMBINED_GUIDE} />
          </div>

          {/* ── Coluna central ─────────────────────────────────────────── */}
          <div style={{ display: 'grid', gap: 16 }}>

            {/* Hero — .ec-flow (padrão .flow de Portabilidade, mas verde/economia) */}
            <section className="ec-flow">
              <div style={{ display: 'grid', gap: 18, textAlign: 'center' }}>

                {/* Kicker */}
                <div style={{
                  display: 'inline-flex', width: 'fit-content', alignItems: 'center', gap: 8,
                  color: '#043B8B', fontSize: 11, lineHeight: 1, fontWeight: 950,
                  textTransform: 'uppercase', letterSpacing: '.11em',
                }}>
                  <span aria-hidden="true" style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: '#00A86B', boxShadow: '0 0 10px rgba(0,168,107,.75)',
                  }} />
                  Economia + Dinheiro
                </div>

                {/* Headline */}
                <div>
                  <h1 style={{
                    margin: '18px auto 0', maxWidth: 780,
                    color: '#001851',
                    fontSize: 'clamp(34px, 3.4vw, 48px)',
                    lineHeight: 1.02, fontWeight: 950, letterSpacing: '-.075em',
                  }}>
                    Primeiro reduzimos o custo.{' '}
                    <span style={{ color: '#007A52' }}>Depois vemos dinheiro para você.</span>
                  </h1>
                  <p style={{
                    maxWidth: 720, margin: '12px auto 0',
                    color: '#64748B', fontSize: 14, lineHeight: 1.5, fontWeight: 650,
                  }}>
                    Portar primeiro melhora a base — o refinanciamento fica mais vantajoso depois.
                    A ConsigAI compara bancos, melhora seu contrato e só então calcula se existe
                    valor estimado para liberar, com parcela, prazo, taxa e custo total sempre visíveis.
                  </p>
                </div>

                {/* StatCards — economia protagonista (verde, maior), dinheiro depois (azul) */}
                <div style={{ width: 'min(820px, 100%)', margin: '0 auto' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1.1fr .9fr' : '1fr', gap: 12 }}>
                    <div className="ec-stat success">
                      <small className="ec-stat-label">Economia estimada primeiro</small>
                      <strong className="ec-stat-value">{data.economyValue}</strong>
                      <span className="ec-stat-caption">estimativa no custo total do contrato atual</span>
                    </div>
                    <div className="ec-stat">
                      <small className="ec-stat-label">Dinheiro estimado depois</small>
                      <strong className="ec-stat-value">{data.futureValue}</strong>
                      <span className="ec-stat-caption">valor possível após a etapa de economia</span>
                    </div>
                  </div>
                </div>

                {/* Trust chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
                  <span className="ec-chip green">Economia primeiro</span>
                  <span className="ec-chip blue">Dinheiro depois</span>
                  <span className="ec-chip blue">Você revisa tudo antes de confirmar</span>
                </div>
              </div>
            </section>

            {/* Estratégias — escolha de perfil */}
            <section className="ec-card" style={{ padding: 22 }}>
              <div className="ec-section-head">
                <h2 className="ec-section-title">Economia + Dinheiro — escolha seu perfil</h2>
                <p className="ec-section-sub">As opções abaixo são ajustes da mesma análise, não ofertas competindo.</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(2, minmax(0, 1fr))' : '1fr', gap: 12 }}>
                {STRATEGIES.map((option, index) => (
                  <StrategyCard
                    key={option.key}
                    option={option}
                    active={selectedStrategy === index}
                    onClick={() => {
                      setSelectedStrategy(index)
                      track('select_combined_strategy', { strategy_key: option.key })
                    }}
                  />
                ))}
              </div>
            </section>

            {/* Condições da simulação */}
            <section className="ec-card" style={{ padding: 22 }}>
              <div className="ec-section-head">
                <h2 className="ec-section-title">Condições da simulação</h2>
                <p className="ec-section-sub">Valores estimados. Você revisa tudo antes de confirmar.</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(auto-fit, minmax(140px, 1fr))' : '1fr', gap: 12 }}>
                {CONDITIONS.map((item) => (
                  <MetricCard key={item.label} item={item} />
                ))}
              </div>
            </section>

            {/* ControleCard horizontal — padrão Portabilidade */}
            <ControleCard
              horizontal
              items={CONTROL_ITEMS}
            />
          </div>

          {/* ── Coluna direita — resumo lateral ────────────────────────── */}
          <aside className="ec-sidebar" style={{ position: isDesktop ? 'sticky' : 'static', top: 104 }}>

            <ResumoCard
              title="Resumo da simulação"
              subtitle="Condições simuladas. Confirme tudo antes de avançar."
              highlight={{ label: 'Estratégia selecionada', value: selectedOption.title }}
              rows={[
                { label: 'Economia estimada', value: data.economyValue },
                { label: 'Dinheiro estimado depois', value: data.futureValue },
                { label: 'Parcela estimada', value: data.installmentValue },
                { label: 'Próximo passo', value: data.nextStepValue },
              ]}
            />

            <ImpactoCard
              liquidoAntes={data.liquidoAntes}
              liquidoDepois={data.liquidoDepois}
              novaParcela={data.installmentValue}
            />

            {/* ActionCard — CTAs no padrão Portabilidade */}
            <div className="ec-card" style={{ padding: 22 }}>
              <p className="ec-card-title">Próximo passo</p>
              <p className="ec-card-sub" style={{ marginBottom: 0 }}>
                Se a simulação fizer sentido, você avança para revisar as condições reais antes de qualquer confirmação.
              </p>

              <div className="ec-actions">
                <button
                  ref={primaryCtaRef}
                  type="button"
                  className="ec-cta consigai-cta-animated"
                  onClick={goContratacao}
                >
                  Continuar e revisar condições
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="ec-secondary consigai-cta-animated"
                  onClick={downloadReceiptPdf}
                >
                  Gerar recibo da simulação
                </button>

                <button
                  type="button"
                  className="ec-back consigai-cta-animated"
                  onClick={() => { track('click_back_to_offers'); navigate('/ofertas') }}
                >
                  Voltar para ofertas
                </button>
              </div>

              <p className="ec-safe">
                Nenhuma contratação sem sua confirmação.<br />
                Simulação não é aprovação final.
              </p>
            </div>
          </aside>

        </div>
      </main>

      {/* ------------------------------------------------------------------ */}
      {/* Sticky bottom bar — aparece quando CTA da sidebar sai da tela       */}
      {/* Padrão idêntico ao de Portabilidade                                 */}
      {/* ------------------------------------------------------------------ */}
      {!primaryCtaVisible && (
        <div style={{
          position: 'fixed',
          left: 0, right: 0, bottom: 0,
          zIndex: 50,
          background: 'rgba(255,255,255,.98)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid #DDE8F6',
          boxShadow: '0 -2px 18px rgba(3,36,111,.08)',
          padding: isDesktop ? '14px 24px' : '10px 16px',
        }}>
          <div style={{
            display: 'grid',
            alignItems: 'center',
            gridTemplateColumns: isDesktop ? 'auto 1px 180px 320px' : 'minmax(0,1fr) 132px',
            columnGap: isDesktop ? 28 : 16,
            rowGap: 10,
            width: 'fit-content',
            maxWidth: '100%',
            margin: '0 auto',
          }}>
            {/* Nome da estratégia */}
            <div style={{ minWidth: 0, maxWidth: isDesktop ? 280 : 'none' }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: '#071B45', lineHeight: '16px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selectedOption.title}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', marginTop: 1, lineHeight: '15px', whiteSpace: 'nowrap' }}>
                Economia + Dinheiro
              </div>
            </div>

            {/* Divisor */}
            {isDesktop && <div style={{ width: 1, height: 36, background: '#DDE8F6' }} />}

            {/* Economia em destaque */}
            <div style={{ minWidth: isDesktop ? 180 : 132 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#007A52', letterSpacing: '-.02em', lineHeight: '25px', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                {data.economyValue}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', lineHeight: '13px', whiteSpace: 'nowrap' }}>
                economia estimada
              </div>
            </div>

            {/* CTA */}
            <button
              type="button"
              className="ec-cta consigai-cta-animated"
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
