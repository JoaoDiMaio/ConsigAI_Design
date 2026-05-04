import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { DesktopPageHeader, MobilePageHeader } from '../components/AppHeader'
import { appPageStyle } from '../ui/theme'
import { loadProfileData } from '../lib/profileStorage'
import { SCENARIOS } from '../data/refinanciamentoData'
import { parseMoney } from '../lib/formatters'
import { getSelectableCardStyle } from '../ui/cardSelection'
import { printSimulationReceipt } from '../lib/receiptPrint'
import { ResumoCard, ImpactoCard, ControleCard, PageHero } from '../components/SimulationSideCards'

const ICONS = ['$', '↯', '↗']

export default function Refinanciamento() {
  const navigate = useNavigate()
  const location = useLocation()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const profile = loadProfileData()
  const clientName = profile.nomeExibicao || profile.nomeCompleto || 'Cliente'

  const [activeIdx, setActiveIdx] = useState(0)
  const [openDetailsCardIdx, setOpenDetailsCardIdx] = useState(null)
  const [showReceipt, setShowReceipt] = useState(false)

  const fmtCurrency = (value) => {
    const n = Number(value)
    if (Number.isFinite(n)) return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    if (typeof value === 'string' && value.trim()) return value
    return 'R$ 0'
  }

  const fmtInstallment = (value) => {
    const s = fmtCurrency(value)
    return s.includes('/mês') || s.includes('/mes') ? s : `${s}/mês`
  }

  const normalizeScenario = (raw, index) => {
    const contractsRaw = raw?.contracts ?? raw?.contratos ?? []
    const receiptRowsRaw = raw?.receiptRows ?? raw?.recibo ?? raw?.contratosDetalhes ?? []

    const contractDetailsFromRows = Array.isArray(receiptRowsRaw)
      ? receiptRowsRaw.map((row, rowIdx) => {
          if (Array.isArray(row)) {
            const [code, bank, troco, taxaAntiga, taxaNova, parcelasAbertas, parcelasTotais, parcelaAntiga, parcelaNova] = row
            return {
              key: `${index}-${rowIdx}-${bank || code || 'contrato'}`,
              bank: bank || `Contrato ${rowIdx + 1}`,
              code: code || '-',
              troco: troco || '-',
              taxaAntiga: taxaAntiga || '-',
              taxaNova: taxaNova || '-',
              parcelasAbertas: parcelasAbertas || '-',
              parcelasTotais: parcelasTotais || '-',
              parcelaAntiga: parcelaAntiga || '-',
              parcelaNova: parcelaNova || '-',
              result: 'Compõe a proposta',
            }
          }
          return {
            key: `${index}-${rowIdx}-${row?.bank || row?.banco || 'contrato'}`,
            bank: row?.bank || row?.banco || `Contrato ${rowIdx + 1}`,
            code: row?.code || row?.codigo || '-',
            troco: row?.troco || row?.cashback || '-',
            taxaAntiga: row?.taxaAntiga || row?.oldRate || row?.taxa_antiga || '-',
            taxaNova: row?.taxaNova || row?.newRate || row?.taxa_nova || '-',
            parcelasAbertas: row?.parcelasAbertas || row?.openInstallments || row?.parcelas_abertas || '-',
            parcelasTotais: row?.parcelasTotais || row?.totalInstallments || row?.parcelas_totais || '-',
            parcelaAntiga: row?.parcelaAntiga || row?.oldInstallment || row?.parcela_antiga || '-',
            parcelaNova: row?.parcelaNova || row?.newInstallment || row?.parcela_nova || '-',
            result: row?.result || row?.resultado || 'Compõe a proposta',
          }
        })
      : []

    const contractDetailsFromContracts = Array.isArray(contractsRaw)
      ? contractsRaw.map((c, cIdx) => {
          if (typeof c === 'string') {
          return {
            key: `${index}-c-${cIdx}-${c}`,
            bank: c,
            code: '-',
            troco: '-',
            taxaAntiga: '-',
            taxaNova: '-',
            parcelasAbertas: '-',
            parcelasTotais: '-',
            parcelaAntiga: '-',
            parcelaNova: '-',
            result: 'Compõe a proposta',
          }
          }
          return {
            key: `${index}-c-${cIdx}-${c?.bank || c?.banco || 'contrato'}`,
            bank: c?.bank || c?.banco || `Contrato ${cIdx + 1}`,
            code: c?.code || c?.codigo || '-',
            troco: c?.troco || c?.cashback || '-',
            taxaAntiga: c?.taxaAntiga || c?.oldRate || c?.taxa_antiga || '-',
            taxaNova: c?.taxaNova || c?.newRate || c?.taxa_nova || '-',
            parcelasAbertas: c?.parcelasAbertas || c?.openInstallments || c?.parcelas_abertas || '-',
            parcelasTotais: c?.parcelasTotais || c?.totalInstallments || c?.parcelas_totais || '-',
            parcelaAntiga: c?.parcelaAntiga || c?.oldInstallment || c?.parcela_antiga || '-',
            parcelaNova: c?.parcelaNova || c?.newInstallment || c?.parcela_nova || '-',
            result: c?.result || c?.resultado || 'Compõe a proposta',
          }
        })
      : []

    const contractDetails = contractDetailsFromRows.length > 0 ? contractDetailsFromRows : contractDetailsFromContracts
    const contracts = contractDetails.map((c) => c.bank)

    return {
      key: raw?.key || raw?.id || `cenario_${index + 1}`,
      eyebrow: raw?.eyebrow || raw?.label || `Cenário ${index + 1}`,
      title: raw?.title || raw?.nome || raw?.name || `Cenário ${index + 1}`,
      desc: raw?.desc || raw?.descricao || raw?.description || 'Simulação de refinanciamento',
      cash: raw?.cash || raw?.creditoReceber || raw?.valorLiberado || fmtCurrency(raw?.valor),
      installment: raw?.installment || raw?.parcelaNova || fmtInstallment(raw?.parcela),
      margem: raw?.margem || raw?.margemLivre || fmtCurrency(raw?.margem_valor),
      contracts,
      contractDetails,
    }
  }

  const scenarios = useMemo(() => {
    const state = location.state || {}
    const apiCandidates =
      state.scenarios ||
      state.ofertasRefinanciamento ||
      state.ofertas_refinanciamento ||
      state.refinanciamentoOfertas ||
      state.refinOffers ||
      state.ofertas

    if (Array.isArray(apiCandidates) && apiCandidates.length > 0) {
      return apiCandidates.slice(0, 3).map((raw, idx) => normalizeScenario(raw, idx))
    }

    return SCENARIOS.map((raw, idx) =>
      normalizeScenario(
        {
          ...raw,
          contracts: raw.contracts,
          receiptRows: raw.receiptRows,
          margemLivre: raw.margem,
          parcelaNova: raw.installment,
          creditoReceber: raw.cash,
        },
        idx,
      ),
    )
  }, [location.state])

  useEffect(() => {
    if (activeIdx > scenarios.length - 1) setActiveIdx(0)
  }, [activeIdx, scenarios.length])

  const scenario = scenarios[activeIdx] || scenarios[0]

  const salarioBase = 2200
  const parcelaAntes = 550
  const parcelaDepois = parseMoney(scenario.installment)
  const liquidoAntes = salarioBase - parcelaAntes
  const liquidoDepois = salarioBase - parcelaDepois

  const goContratacao = () => {
    navigate('/dados-bancarios', {
      state: {
        sourcePath: '/refinanciamento',
        nextPath: '/contratacao',
        offerState: {
          sourcePath: '/refinanciamento',
          offerTitle: scenario.title || 'Refinanciamento',
          offerSubtitle: 'Resumo da oferta selecionada antes da contratação',
          primaryValue: scenario.cash || 'R$ 0',
          ctaLabel: 'Confirmar Refinanciamento',
          summary: [
            { label: 'Você recebe', value: scenario.cash || 'R$ 0' },
            { label: 'Nova parcela', value: scenario.installment || 'R$ 0/mês' },
            { label: 'Margem livre', value: scenario.margem || 'R$ 0' },
            { label: 'Contratos', value: `${scenario.contracts?.length || 0}` },
          ],
        },
      },
    })
  }

  const downloadReceiptPdf = () => {
    printSimulationReceipt({
      title: 'SIMULAÇÃO DE REFINANCIAMENTO - CONSIGAI',
      highlightLabel: 'VOCÊ PODE RECEBER HOJE',
      highlightValue: scenario.cash,
      rows: [
        { label: 'Cenário', value: scenario.title },
        { label: 'Nova parcela', value: scenario.installment },
        { label: 'Margem livre', value: scenario.margem },
        { label: 'Contratos', value: `${scenario.contracts.length}` },
      ],
    })
  }

  return (
    <>
      <style>{`
        :root { --blue-dark:#03246F; --blue-main:#055ECE; --logo-blue:#1DA1EB; --cyan:#00E7FF; --green:#007A52; --green-soft:#E9F8F1; --green-line:#BDECD7; --muted:#64748B; --line:#DDE8F6; --blue-soft:#F4F8FF; --shadow:0 18px 48px rgba(3,36,111,.08); }
        .rf-page * { box-sizing:border-box; margin:0; padding:0; }
        .rf-page { min-height:100vh; position:relative; overflow-x:hidden; padding-bottom:48px; background:radial-gradient(circle at 12% 10%, rgba(0,231,255,.14), transparent 28%), radial-gradient(circle at 88% 18%, rgba(29,161,235,.12), transparent 30%), linear-gradient(180deg, #EAF5FF 0%, #F8FBFF 46%, #FFFFFF 100%); }
        .rf-shell { width:calc(100% - 96px); max-width:1280px; margin:0 auto; position:relative; z-index:1; padding-top:30px; }
        .main-layout { display:grid; grid-template-columns:minmax(0,1fr) 380px; gap:30px; align-items:start; }
        .sidebar { display:grid; gap:20px; align-content:start; }
.offer-flow-card { padding:20px; border-radius:30px; background:#fff; border:1px solid var(--line); box-shadow:var(--shadow); position:relative; overflow:hidden; }
        .offer-flow-card::before { content:none; }
        .offer-flow-card > * { position:relative; z-index:1; }
        .offer-flow-header { display:flex; justify-content:space-between; align-items:flex-start; gap:18px; margin-bottom:16px; padding-bottom:14px; border-bottom:1px solid var(--line); }
        .offer-flow-header h2 { color:var(--blue-dark); font-size:20px; line-height:1.05; font-weight:900; letter-spacing:-.04em; }
        .offer-flow-header p { margin-top:5px; color:var(--muted); font-size:12px; line-height:1.35; font-weight:600; }
        .offer-flow-badge { padding:8px 11px; border-radius:999px; background:rgba(0,231,255,.12); border:1px solid rgba(0,231,255,.30); color:var(--blue-main); font-size:11px; font-weight:900; text-transform:uppercase; letter-spacing:.08em; }
        .scenario-list { display:grid; gap:16px; }
        .scenario-card { --card-accent: var(--blue-dark); --card-glow: rgba(3,36,111,.12); padding:22px; border-radius:28px; background:#fff; border:1px solid var(--line); box-shadow:0 16px 38px rgba(3,36,111,.07); position:relative; overflow:hidden; cursor:pointer; }
        .scenario-card::before { content:''; position:absolute; inset:0 0 auto 0; height:5px; background:var(--card-accent); }
        .scenario-card::after { content:''; position:absolute; top:0; right:0; width:220px; height:130px; background:radial-gradient(circle at 100% 0%, var(--card-glow), transparent 70%); pointer-events:none; }
        .scenario-card.selected { border:2px solid var(--card-accent); background:#fff; }
        .scenario-card.selected, .scenario-card.selected * { user-select:text; }
        .scenario-card.selected .scenario-header,
        .scenario-card.selected .scenario-metrics,
        .scenario-card.selected .contract-tags,
        .scenario-card.selected .tag-list,
        .scenario-card.selected .tag { cursor:text; }
        .scenario-card.selected .scenario-details-btn { cursor:pointer; user-select:none; }
        .scenario-card.green { --card-accent: var(--blue-main); --card-glow: rgba(5,94,206,.14); }
        .scenario-card.gold { --card-accent: var(--green); --card-glow: rgba(0,122,82,.12); }
        .scenario-header { display:grid; grid-template-columns:44px 1fr; gap:14px; align-items:start; }
        .scenario-icon { width:42px; height:42px; border-radius:13px; display:grid; place-items:center; background:var(--card-accent); color:#fff; font-size:19px; font-weight:900; }
        .scenario-eyebrow { color:var(--card-accent); font-size:10px; font-weight:900; letter-spacing:.12em; text-transform:uppercase; }
        .scenario-title { margin-top:3px; color:var(--blue-dark); font-size:20px; line-height:1.05; font-weight:900; letter-spacing:-.04em; }
        .scenario-copy { margin-top:5px; color:var(--muted); font-size:12px; line-height:1.35; font-weight:600; }
        .scenario-metrics { display:grid; grid-template-columns:repeat(4, minmax(0,1fr)); gap:12px; margin-top:18px; }
        .scenario-metric { min-height:68px; padding:13px; border-radius:13px; background:var(--blue-soft); border:1px solid var(--line); }
        .scenario-metric small { display:block; color:var(--muted); font-size:clamp(10px, 0.9vw, 10px); font-weight:800; text-transform:uppercase; letter-spacing:.04em; }
        .scenario-metric strong { display:block; margin-top:6px; color:var(--card-accent); font-size:clamp(14px, 1.7vw, 18px); font-weight:800; letter-spacing:-.04em; white-space:nowrap; word-break:keep-all; }
        .contract-tags-row { margin-top:16px; padding-top:14px; border-top:1px solid var(--line); }
        .contract-tags { min-width:0; }
        .contract-tags small { display:block; color:var(--muted); font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:.08em; margin-bottom:8px; }
        .contract-tags-actions { display:flex; justify-content:space-between; align-items:center; gap:12px; }
        .tag-list { display:flex; flex-wrap:wrap; gap:8px; }
        .tag { padding:7px 10px; border-radius:999px; background:var(--blue-soft); color:var(--blue-main); border:1px solid var(--line); font-size:11px; font-weight:800; }
        .scenario-card-footer { flex:0 0 auto; display:flex; justify-content:flex-end; }
        .scenario-details-btn { min-height:36px; padding:0 12px; border-radius:13px; border:1px solid color-mix(in srgb, var(--card-accent) 28%, #ffffff); background:#fff; color:var(--card-accent); font-size:12px; font-weight:900; cursor:pointer; }
        .compact-contract-list { display:grid; gap:12px; margin-top:8px; }
        .compact-refin-card { padding:16px; border-radius:21px; background:#fff; border:1px solid var(--line); box-shadow:none; position:relative; overflow:hidden; cursor:auto; }
        .compact-refin-card h3,
        .compact-refin-card small,
        .compact-refin-card span,
        .compact-refin-card strong,
        .compact-refin-card p,
        .compact-refin-card b { cursor:text; user-select:text; }
        .compact-refin-card::before { content:''; position:absolute; inset:0 0 auto 0; height:4px; background:linear-gradient(90deg, var(--blue-main), var(--logo-blue), var(--cyan), var(--green)); }
        .compact-header { display:flex; justify-content:space-between; align-items:center; gap:10px; padding-bottom:10px; border-bottom:1px solid var(--line); }
        .compact-header small { color:var(--blue-main); font-size:10px; font-weight:900; letter-spacing:.12em; text-transform:uppercase; }
        .compact-header h3 { margin-top:2px; color:var(--blue-dark); font-size:16px; line-height:1; font-weight:900; letter-spacing:-.04em; }
        .money-highlight { margin-top:10px; padding:10px 12px; border-radius:13px; background:rgba(233,248,241,.62); border:1px solid var(--green-line); display:flex; align-items:center; justify-content:space-between; gap:12px; }
        .money-copy { min-width:0; }
        .money-highlight span { display:block; color:var(--green); font-size:10px; font-weight:900; text-transform:uppercase; letter-spacing:.06em; white-space:nowrap; }
        .money-highlight small { display:block; margin-top:2px; color:var(--muted); font-size:10px; line-height:1.25; font-weight:700; }
        .money-highlight strong { flex:0 0 auto; color:var(--green); font-size:21px; line-height:1; font-weight:800; letter-spacing:-.055em; white-space:nowrap; }
        .compare-lines { display:grid; margin-top:10px; border:1px solid var(--line); border-radius:13px; overflow:hidden; background:#fff; }
        .compare-head, .compare-line { display:grid; grid-template-columns:74px 1fr 1fr; align-items:center; gap:8px; }
        .compare-head { padding:8px 10px; background:var(--blue-soft); border-bottom:1px solid var(--line); color:var(--muted); font-size:10px; font-weight:900; text-transform:uppercase; letter-spacing:.07em; }
        .compare-head span:nth-child(2),
        .compare-head span:nth-child(3) { text-align:center; }
        .compare-line { padding:9px 10px; border-bottom:1px solid var(--line); }
        .compare-line:last-child { border-bottom:0; }
        .compare-label { color:var(--blue-dark); font-size:11px; font-weight:800; }
        .compare-value { color:var(--blue-dark); font-size:12px; line-height:1; font-weight:800; white-space:nowrap; letter-spacing:-.025em; text-align:center; }
        .compare-value.after { color:var(--blue-main); }
        .compact-note { margin-top:10px; padding:9px 10px; border-radius:13px; background:#F8FBFF; border:1px solid var(--line); color:var(--muted); font-size:11px; line-height:1.3; font-weight:600; }
        .compact-note strong { color:var(--blue-dark); font-weight:900; }
        .scenario-actions { margin-top:16px; padding-top:16px; border-top:1px solid var(--line); }
        .consigai-cta-animated { position:relative; overflow:hidden; transform:translateY(0); transition:transform .18s ease, box-shadow .18s ease, border-color .18s ease, background-position .35s ease, filter .18s ease; animation:consigaiDetailsFloat 3.8s ease-in-out infinite; background-size:220% 100%; background-position:0% 0%; cursor:pointer; }
        .consigai-cta-animated:hover { background-position:100% 0%; animation-play-state:paused; transform:translateY(-2px) scale(1.01) !important; filter:saturate(1.05); }
        .consigai-cta-animated:active { transform:translateY(0) scale(.985); }
        .consigai-cta-animated::after { content:''; position:absolute; inset:0; background:linear-gradient(115deg, transparent 0%, rgba(255,255,255,.55) 45%, transparent 60%); transform:translateX(-120%) skewX(-18deg); opacity:0; pointer-events:none; }
        .consigai-cta-animated:hover::after { opacity:1; animation:consigaiDetailsShine .9s ease forwards; }
        @keyframes consigaiDetailsFloat { 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-1px); } }
        @keyframes consigaiDetailsShine { 0% { transform:translateX(-120%) skewX(-18deg); } 100% { transform:translateX(120%) skewX(-18deg); } }
        .primary-cta { width:100%; min-height:54px; border:0; border-radius:21px; background:linear-gradient(145deg, var(--blue-main), var(--blue-dark)); color:#fff; font-size:15px; font-weight:900; cursor:pointer; }
        .secondary-cta,.back-offers-cta { width:100%; min-height:50px; margin-top:12px; border-radius:21px; border:1px solid #BFD4F6; background:#fff; color:var(--blue-main); font-size:14px; font-weight:900; cursor:pointer; }
        .back-offers-cta { min-height:46px; margin-top:10px; border-radius:13px; border:1px solid #BFD4F6; background:#fff; color:#055ECE; font-size:14px; font-weight:900; box-shadow:0 8px 20px rgba(30,60,180,.12); }
        .safe-note { margin-top:12px; color:var(--muted); text-align:center; font-size:11px; font-weight:600; }
        @media (max-width:1100px){ .main-layout{ grid-template-columns:1fr; } .sidebar{ display:grid; grid-template-columns:1fr 1fr; gap:16px; } }
        @media (max-width:900px){ .rf-shell{ width:calc(100% - 32px); } .scenario-metrics,.salary-grid,.sidebar{ grid-template-columns:1fr; } }
        @media (max-width:560px){ .hero-heading{ font-size:34px; } .strategy-hero,.scenario-card{ padding:22px; } .scenario-header{ grid-template-columns:42px 1fr; } .money-highlight{ align-items:flex-start; flex-direction:column; } .compare-head,.compare-line{ grid-template-columns:1fr; gap:6px; } .compare-head span:first-child{ display:none; } }
      `}</style>

      <div style={appPageStyle}>
        {isDesktop ? (
          <DesktopPageHeader clientName={clientName} chipLabel="Refinanciamento" title="Refinancie com inteligência e escolha o melhor impacto no seu mês" subtitle="Compare cenário por cenário com clareza antes de confirmar." onLogoClick={() => navigate('/ofertas')} actions={[{ label: 'Ofertas', onClick: () => navigate('/ofertas') }, { label: 'Configurações', onClick: () => navigate('/configuracoes') }]} />
        ) : (
          <MobilePageHeader clientName={clientName} chipLabel="Refinanciamento" title="Refinancie com inteligência e escolha o melhor impacto no seu mês" subtitle="Compare cenário por cenário com clareza antes de confirmar." onLogoClick={() => navigate('/ofertas')} actions={[{ label: 'Ofertas', onClick: () => navigate('/ofertas') }, { label: 'Configurações', onClick: () => navigate('/configuracoes') }]} />
        )}

        <div className="rf-page">
          <main className="rf-shell">
            <div className="main-layout">
              <section>
                <PageHero
                  kicker="Refinanciamento por contrato"
                  title="Escolha o cenário com"
                  titleAccent="melhor impacto"
                  body="A ConsigAI compara seus contratos e organiza as melhores estratégias para liberar dinheiro, reduzir parcela ou preservar sua margem com transparência."
                  chips={['Simulação sem compromisso', 'Você compara antes de decidir', 'Nenhuma contratação automática']}
                />

                <section className="offer-flow-card">
                  <div className="offer-flow-header">
                    <div>
                      <h2>Cenários disponíveis</h2>
                      <p>Escolha uma estratégia e veja o resumo da proposta ao lado.</p>
                    </div>
                  </div>

                  <div className="scenario-list">
                    {scenarios.map((s, i) => (
                      <div key={s.key}>
                      <article
                        className={`scenario-card ${i === 1 ? 'green' : ''} ${i === 2 ? 'gold' : ''} ${activeIdx === i ? 'selected' : ''}`}
                        onClick={() => { setActiveIdx(i) }}
                        style={getSelectableCardStyle({ selected: activeIdx === i, hovered: false })}
                      >
                        <div className="scenario-header">
                          <div className="scenario-icon">{ICONS[i] || '$'}</div>
                          <div>
                            <div className="scenario-eyebrow">{s.eyebrow}</div>
                            <h2 className="scenario-title">{s.title}</h2>
                            <p className="scenario-copy">{s.desc}</p>
                          </div>
                        </div>
                        <div className="scenario-metrics">
                          <div className="scenario-metric"><small>Você recebe</small><strong>{s.cash}</strong></div>
                          <div className="scenario-metric"><small>Nova parcela</small><strong>{s.installment}</strong></div>
                          <div className="scenario-metric"><small>Margem livre</small><strong>{s.margem}</strong></div>
                          <div className="scenario-metric"><small>Contratos</small><strong>{s.contracts.length} {s.contracts.length === 1 ? 'contrato' : 'contratos'}</strong></div>
                        </div>
                        <div className="contract-tags-row">
                          <div className="contract-tags">
                            <small>Contratos incluídos</small>
                            <div className="contract-tags-actions">
                              <div className="tag-list">{s.contracts.map((c) => <span key={c} className="tag">{c}</span>)}</div>
                              <div className="scenario-card-footer">
                                <button
                                  type="button"
                                  className="scenario-details-btn consigai-cta-animated"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    const currentScrollY = window.scrollY
                                    setOpenDetailsCardIdx((prev) => (prev === i ? null : i))
                                    setActiveIdx(i)
                                    requestAnimationFrame(() => {
                                      window.scrollTo({ top: currentScrollY, behavior: 'auto' })
                                    })
                                  }}
                                >
                                  Ver detalhes
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {openDetailsCardIdx === i && (
                        <div style={{ marginTop: 24 }} onClick={(e) => e.stopPropagation()}>
                          <div className="compact-contract-list">
                            {s.contractDetails.map((item) => (
                              <article key={item.key} className="compact-refin-card">
                                <header className="compact-header">
                                  <div>
                                    <small>Antes e depois</small>
                                    <h3>{item.bank}</h3>
                                  </div>
                                </header>

                                <section className="money-highlight">
                                  <div className="money-copy">
                                    <span>Você recebe na conta</span>
                                    <small>valor estimado</small>
                                  </div>
                                  <strong>{item.troco}</strong>
                                </section>

                                <section className="compare-lines">
                                  <div className="compare-head">
                                    <span></span>
                                    <span>Hoje</span>
                                    <span>Depois</span>
                                  </div>
                                  <div className="compare-line">
                                    <span className="compare-label">Parcela</span>
                                    <strong className="compare-value">{item.parcelaAntiga}</strong>
                                    <strong className="compare-value after">{item.parcelaNova}</strong>
                                  </div>
                                  <div className="compare-line">
                                    <span className="compare-label">Prazo</span>
                                    <strong className="compare-value">{item.parcelasAbertas}</strong>
                                    <strong className="compare-value after">{item.parcelasTotais}</strong>
                                  </div>
                                  <div className="compare-line">
                                    <span className="compare-label">Taxa</span>
                                    <strong className="compare-value">{item.taxaAntiga}</strong>
                                    <strong className="compare-value after">{item.taxaNova}</strong>
                                  </div>
                                </section>

                                <p className="compact-note">
                                  <strong>Contrato:</strong> {item.code}
                                </p>
                              </article>
                            ))}
                          </div>
                        </div>
                      )}
                      </article>
                      </div>
                    ))}
                  </div>

                  <div className="scenario-actions">
                    <button className="primary-cta consigai-cta-animated" onClick={goContratacao}>Continuar com esta oferta</button>
                    <button className="back-offers-cta consigai-cta-animated" onClick={() => setShowReceipt((v) => !v)}>Gerar recibo da simulação</button>
                    {showReceipt && (
                      <div style={{ marginTop: 10, borderRadius: 16, border: '1px solid #DDE8F6', background: '#f7f9fe', padding: 10, display: 'flex', justifyContent: 'center' }}>
                        <div style={{ width: 300, borderRadius: 10, padding: '14px 12px 12px', border: '1px solid #ececec', color: '#4f4f4f', fontSize: 12, background: 'linear-gradient(180deg, rgba(255,255,255,.45), rgba(0,0,0,.02)), #f5f5f3' }}>
                          <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 800, color: '#444' }}>SIMULAÇÃO DE REFINANCIAMENTO - CONSIGAI</div>
                          <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
                          <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 800, color: '#4a4a4a' }}>VOCÊ PODE RECEBER HOJE</div>
                          <div style={{ textAlign: 'center', marginTop: 2, fontSize: 22, fontWeight: 900, color: '#232323', lineHeight: 1 }}>{scenario.cash}</div>
                          <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
                          <div style={{ display: 'grid', gap: 6, fontSize: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Cenário</span><strong>{scenario.title}</strong></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Nova parcela</span><strong>{scenario.installment}</strong></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Margem livre</span><strong>{scenario.margem}</strong></div>
                          </div>
                        </div>
                      </div>
                    )}
                    {showReceipt && (
                      <button
                        className="consigai-cta-animated"
                        onClick={downloadReceiptPdf}
                        style={{
                          width: '100%',
                          minHeight: 46,
                          marginTop: 8,
                          borderRadius: 14,
                          border: 0,
                          background: 'linear-gradient(145deg, #055ECE, #03246F)',
                          color: '#fff',
                          fontSize: 13.5,
                          fontWeight: 900,
                          cursor: 'pointer',
                          boxShadow: '0 8px 20px rgba(30,60,180,.3)',
                        }}
                      >
                        Baixar recibo da simulação
                      </button>
                    )}
                    <p className="safe-note">Valores estimados. Sujeitos à análise e aprovação de crédito.</p>
                    <button className="back-offers-cta consigai-cta-animated" onClick={() => navigate('/ofertas')}>Voltar para ofertas</button>
                  </div>
                </section>
              </section>

              <aside className="sidebar">
                <ResumoCard
                  title="Resumo da proposta"
                  highlight={{ label: 'Cenário selecionado', value: scenario.title }}
                  rows={[
                    { label: 'Você recebe', value: scenario.cash },
                    { label: 'Nova parcela total', value: scenario.installment },
                    { label: 'Margem livre', value: scenario.margem },
                    { label: 'Contratos', value: `${scenario.contracts.length} refinanciados` },
                  ]}
                />
                <ImpactoCard
                  liquidoAntes={liquidoAntes}
                  liquidoDepois={liquidoDepois}
                  novaParcela={scenario.installment}
                  novaParcelaLabel="Nova parcela total"
                />
                <ControleCard />
              </aside>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
