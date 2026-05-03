import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { DesktopPageHeader, MobilePageHeader } from '../components/AppHeader'
import { appPageStyle } from '../ui/theme'
import { loadProfileData } from '../lib/profileStorage'
import { SCENARIOS } from '../data/refinanciamentoData'
import { parseMoney } from '../lib/formatters'
import { getSelectableCardStyle } from '../ui/cardSelection'

const ICONS = ['$', '↯', '↗']

export default function Refinanciamento() {
  const navigate = useNavigate()
  const location = useLocation()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const profile = loadProfileData()
  const clientName = profile.nomeExibicao || profile.nomeCompleto || 'Cliente'

  const [activeIdx, setActiveIdx] = useState(0)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [hoveredIdx, setHoveredIdx] = useState(-1)

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
            const [code, bank, troco] = row
            return {
              key: `${index}-${rowIdx}-${bank || code || 'contrato'}`,
              bank: bank || `Contrato ${rowIdx + 1}`,
              code: code || '-',
              troco: troco || '-',
              result: 'Compõe a proposta',
            }
          }
          return {
            key: `${index}-${rowIdx}-${row?.bank || row?.banco || 'contrato'}`,
            bank: row?.bank || row?.banco || `Contrato ${rowIdx + 1}`,
            code: row?.code || row?.codigo || '-',
            troco: row?.troco || row?.cashback || '-',
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
              result: 'Compõe a proposta',
            }
          }
          return {
            key: `${index}-c-${cIdx}-${c?.bank || c?.banco || 'contrato'}`,
            bank: c?.bank || c?.banco || `Contrato ${cIdx + 1}`,
            code: c?.code || c?.codigo || '-',
            troco: c?.troco || c?.cashback || '-',
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

  return (
    <>
      <style>{`
        :root { --blue-dark:#03246F; --blue-main:#055ECE; --logo-blue:#1DA1EB; --cyan:#00E7FF; --green:#007A52; --green-soft:#E9F8F1; --green-line:#BDECD7; --muted:#64748B; --line:#DDE8F6; --blue-soft:#F4F8FF; --shadow:0 18px 48px rgba(3,36,111,.08); }
        .rf-page * { box-sizing:border-box; margin:0; padding:0; }
        .rf-page { min-height:100vh; position:relative; overflow-x:hidden; padding-bottom:48px; background:radial-gradient(circle at 12% 10%, rgba(0,231,255,.14), transparent 28%), radial-gradient(circle at 88% 18%, rgba(29,161,235,.12), transparent 30%), linear-gradient(180deg, #EAF5FF 0%, #F8FBFF 46%, #FFFFFF 100%); }
        .rf-shell { width:calc(100% - 96px); max-width:1280px; margin:0 auto; position:relative; z-index:1; padding-top:30px; }
        .main-layout { display:grid; grid-template-columns:minmax(0,1fr) 380px; gap:30px; align-items:start; }
        .strategy-hero { margin-bottom:20px; padding:26px 30px; border-radius:30px; background:radial-gradient(circle at 92% 8%, rgba(0,231,255,.15), transparent 34%), radial-gradient(circle at 10% 100%, rgba(0,122,82,.07), transparent 34%), linear-gradient(180deg, rgba(255,255,255,.98) 0%, #FFF 100%); border:1px solid var(--line); box-shadow:var(--shadow); position:relative; overflow:hidden; }
        .strategy-hero::before { content:''; position:absolute; inset:0 0 auto 0; height:5px; background:linear-gradient(90deg, var(--blue-main), var(--logo-blue), var(--cyan), var(--green)); }
        .hero-kicker { color:var(--blue-main); font-size:12px; font-weight:950; letter-spacing:.13em; text-transform:uppercase; }
        .hero-heading { margin-top:10px; color:var(--blue-dark); font-size:clamp(32px,3.3vw,44px); line-height:.98; font-weight:950; letter-spacing:-.07em; }
        .hero-heading span { color:var(--green); }
        .hero-copy { max-width:720px; margin-top:12px; color:var(--muted); font-size:15px; line-height:1.45; font-weight:650; }
        .hero-trust-row { display:flex; flex-wrap:wrap; gap:10px; margin-top:18px; }
        .hero-chip { padding:8px 11px; border-radius:999px; background:var(--blue-soft); border:1px solid var(--line); color:var(--blue-dark); font-size:12px; font-weight:850; }
        .offer-flow-card { padding:20px; border-radius:30px; background:#fff; border:1px solid var(--line); box-shadow:var(--shadow); position:relative; overflow:hidden; }
        .offer-flow-card::before { content:none; }
        .offer-flow-card > * { position:relative; z-index:1; }
        .offer-flow-header { display:flex; justify-content:space-between; align-items:flex-start; gap:18px; margin-bottom:16px; padding-bottom:14px; border-bottom:1px solid var(--line); }
        .offer-flow-header h2 { color:var(--blue-dark); font-size:20px; line-height:1.05; font-weight:950; letter-spacing:-.04em; }
        .offer-flow-header p { margin-top:5px; color:var(--muted); font-size:12.5px; line-height:1.35; font-weight:650; }
        .offer-flow-badge { padding:8px 11px; border-radius:999px; background:rgba(0,231,255,.12); border:1px solid rgba(0,231,255,.30); color:var(--blue-main); font-size:11px; font-weight:950; text-transform:uppercase; letter-spacing:.08em; }
        .scenario-list { display:grid; gap:14px; }
        .scenario-card { --card-accent: var(--blue-dark); --card-glow: rgba(3,36,111,.12); padding:22px; border-radius:28px; background:radial-gradient(circle at 92% 8%, var(--card-glow), transparent 34%), linear-gradient(180deg, #F8FBFF 0%, #FFF 100%); border:1px solid var(--line); box-shadow:0 16px 38px rgba(3,36,111,.07); position:relative; overflow:hidden; cursor:pointer; }
        .scenario-card::before { content:''; position:absolute; inset:0 0 auto 0; height:5px; background:var(--card-accent); }
        .scenario-card.selected { border:2px solid var(--card-accent); background:radial-gradient(circle at 92% 8%, var(--card-glow), transparent 34%), linear-gradient(180deg, #F8FEFF 0%, #FFF 100%); }
        .scenario-card.green { --card-accent: var(--blue-main); --card-glow: rgba(5,94,206,.14); }
        .scenario-card.gold { --card-accent: var(--green); --card-glow: rgba(0,122,82,.12); }
        .scenario-header { display:grid; grid-template-columns:44px 1fr; gap:14px; align-items:start; }
        .scenario-icon { width:42px; height:42px; border-radius:15px; display:grid; place-items:center; background:var(--card-accent); color:#fff; font-size:19px; font-weight:950; }
        .scenario-eyebrow { color:var(--card-accent); font-size:10.5px; font-weight:950; letter-spacing:.12em; text-transform:uppercase; }
        .scenario-title { margin-top:3px; color:var(--blue-dark); font-size:20px; line-height:1.05; font-weight:950; letter-spacing:-.04em; }
        .scenario-copy { margin-top:5px; color:var(--muted); font-size:12.5px; line-height:1.35; font-weight:650; }
        .scenario-metrics { display:grid; grid-template-columns:repeat(4, minmax(0,1fr)); gap:10px; margin-top:18px; }
        .scenario-metric { min-height:74px; padding:13px; border-radius:18px; background:var(--blue-soft); border:1px solid var(--line); }
        .scenario-metric small { display:block; color:var(--muted); font-size:10px; font-weight:900; text-transform:uppercase; letter-spacing:.04em; }
        .scenario-metric strong { display:block; margin-top:6px; color:var(--card-accent); font-size:18px; font-weight:950; letter-spacing:-.04em; }
        .contract-tags { margin-top:16px; padding-top:14px; border-top:1px solid var(--line); }
        .contract-tags small { display:block; color:var(--muted); font-size:10.5px; font-weight:950; text-transform:uppercase; letter-spacing:.08em; margin-bottom:8px; }
        .tag-list { display:flex; flex-wrap:wrap; gap:7px; }
        .tag { padding:7px 10px; border-radius:999px; background:var(--blue-soft); color:var(--blue-main); border:1px solid var(--line); font-size:11px; font-weight:850; }
        .scenario-actions { margin-top:16px; padding-top:16px; border-top:1px solid var(--line); }
        .consigai-cta-animated { position:relative; overflow:hidden; transform:translateY(0); transition:transform .18s ease, box-shadow .18s ease, border-color .18s ease, background-position .35s ease, filter .18s ease; animation:consigaiDetailsFloat 3.8s ease-in-out infinite; background-size:220% 100%; background-position:0% 0%; cursor:pointer; }
        .consigai-cta-animated:hover { background-position:100% 0%; animation-play-state:paused; transform:translateY(-2px) scale(1.01) !important; filter:saturate(1.05); }
        .consigai-cta-animated:active { transform:translateY(0) scale(.985); }
        .consigai-cta-animated::after { content:''; position:absolute; inset:0; background:linear-gradient(115deg, transparent 0%, rgba(255,255,255,.55) 45%, transparent 60%); transform:translateX(-120%) skewX(-18deg); opacity:0; pointer-events:none; }
        .consigai-cta-animated:hover::after { opacity:1; animation:consigaiDetailsShine .9s ease forwards; }
        @keyframes consigaiDetailsFloat { 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-1px); } }
        @keyframes consigaiDetailsShine { 0% { transform:translateX(-120%) skewX(-18deg); } 100% { transform:translateX(120%) skewX(-18deg); } }
        .primary-cta { width:100%; min-height:54px; border:0; border-radius:18px; background:linear-gradient(145deg, var(--blue-main), var(--blue-dark)); color:#fff; font-size:15px; font-weight:950; cursor:pointer; }
        .secondary-cta,.back-offers-cta { width:100%; min-height:50px; margin-top:12px; border-radius:17px; border:1px solid #BFD4F6; background:#fff; color:var(--blue-main); font-size:14px; font-weight:900; cursor:pointer; }
        .back-offers-cta { min-height:46px; margin-top:10px; border-radius:14px; border:1px solid #BFD4F6; background:#fff; color:#055ECE; font-size:14px; font-weight:900; box-shadow:0 8px 20px rgba(30,60,180,.12); }
        .safe-note { margin-top:12px; color:var(--muted); text-align:center; font-size:10.5px; font-weight:650; }
        .side-card { padding:22px; border-radius:26px; background:rgba(255,255,255,.98); border:1px solid var(--line); box-shadow:0 18px 46px rgba(3,36,111,.08); }
        .side-card + .side-card { margin-top:16px; }
        .side-card h3 { color:var(--blue-dark); font-size:15px; font-weight:950; text-transform:uppercase; }
        .side-card p { margin-top:5px; color:var(--muted); font-size:12px; line-height:1.35; font-weight:650; }
        .proposal-highlight { margin-top:16px; padding:16px; border-radius:20px; background:radial-gradient(circle at 92% 8%, rgba(0,231,255,.12), transparent 34%), linear-gradient(180deg,#F8FBFF 0%, #FFF 100%); border:1px solid rgba(0,231,255,.34); }
        .proposal-highlight small { display:block; color:var(--blue-main); font-size:10.5px; font-weight:950; letter-spacing:.08em; text-transform:uppercase; }
        .proposal-highlight strong { display:block; margin-top:6px; color:var(--blue-dark); font-size:21px; font-weight:950; }
        .proposal-highlight span { display:block; margin-top:8px; color:var(--muted); font-size:12px; line-height:1.35; font-weight:700; }
        .summary-list { margin-top:12px; }
        .summary-row { display:flex; justify-content:space-between; gap:16px; padding:13px 0; border-bottom:1px solid var(--line); color:var(--muted); font-size:13px; font-weight:800; }
        .summary-row strong { color:var(--blue-dark); font-weight:950; }
        .contract-accordion { margin-top:16px; display:grid; gap:10px; }
        .accordion-title { color:var(--blue-dark); font-size:12px; font-weight:950; letter-spacing:.06em; text-transform:uppercase; }
        .contract-detail { border-radius:16px; border:1px solid var(--line); background:var(--blue-soft); overflow:hidden; }
        .contract-detail[open] { background:#fff; border-color:rgba(0,231,255,.34); box-shadow:0 12px 26px rgba(3,36,111,.06); }
        .contract-detail summary { list-style:none; min-height:46px; padding:12px 14px; display:flex; justify-content:space-between; align-items:center; gap:12px; cursor:pointer; }
        .contract-detail summary::-webkit-details-marker { display:none; }
        .contract-detail summary::after { content:'⌄'; color:var(--blue-main); font-weight:950; transition:transform 160ms ease; }
        .contract-detail[open] summary::after { transform:rotate(180deg); }
        .contract-detail summary span { color:var(--blue-dark); font-size:13px; font-weight:950; }
        .contract-detail summary strong { margin-left:auto; color:var(--green); font-size:11px; font-weight:950; text-transform:uppercase; letter-spacing:.04em; }
        .contract-detail-body { display:grid; gap:8px; padding:0 14px 14px; }
        .contract-detail-body div { display:flex; justify-content:space-between; gap:12px; padding:9px 10px; border-radius:12px; background:#F8FBFF; border:1px solid var(--line); }
        .contract-detail-body span { color:var(--muted); font-size:11px; font-weight:800; }
        .contract-detail-body strong { color:var(--blue-dark); font-size:11px; font-weight:950; text-align:right; }
        .salary-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:14px; }
        .salary-box { padding:14px; border-radius:18px; background:#F8FBFF; border:1px solid var(--line); }
        .salary-box.green { background:var(--green-soft); border-color:var(--green-line); }
        .salary-box small { display:block; color:var(--muted); font-size:11px; font-weight:850; }
        .salary-box strong { display:block; margin-top:7px; color:var(--blue-dark); font-size:21px; font-weight:950; }
        .salary-box.green strong { color:var(--green); }
        .salary-box span { display:block; margin-top:6px; color:var(--muted); font-size:10.5px; line-height:1.25; font-weight:700; }
        .installment-impact { margin-top:12px; padding:13px 14px; border-radius:18px; background:var(--blue-soft); border:1px solid var(--line); }
        .installment-impact span { display:block; color:var(--muted); font-size:11px; font-weight:850; }
        .installment-impact strong { display:block; margin-top:6px; color:var(--blue-main); font-size:20px; font-weight:950; }
        @media (max-width:1100px){ .main-layout{ grid-template-columns:1fr; } .sidebar{ display:grid; grid-template-columns:1fr 1fr; gap:16px; } .side-card + .side-card{ margin-top:0; } }
        @media (max-width:900px){ .rf-shell{ width:calc(100% - 32px); } .scenario-metrics,.salary-grid,.sidebar{ grid-template-columns:1fr; } }
        @media (max-width:560px){ .hero-heading{ font-size:34px; } .strategy-hero,.scenario-card{ padding:22px; } .scenario-header{ grid-template-columns:42px 1fr; } }
      `}</style>

      <div style={appPageStyle}>
        {isDesktop ? (
          <DesktopPageHeader clientName={clientName} chipLabel="Refinanciamento" title="Refinancie com inteligencia e escolha o melhor impacto no seu mes" subtitle="Compare cenario por cenario com clareza antes de confirmar." onLogoClick={() => navigate('/ofertas')} actions={[{ label: 'Ofertas', onClick: () => navigate('/ofertas') }, { label: 'Configuracoes', onClick: () => navigate('/configuracoes') }]} />
        ) : (
          <MobilePageHeader clientName={clientName} chipLabel="Refinanciamento" title="Refinancie com inteligencia e escolha o melhor impacto no seu mes" subtitle="Compare cenario por cenario com clareza antes de confirmar." onLogoClick={() => navigate('/ofertas')} actions={[{ label: 'Ofertas', onClick: () => navigate('/ofertas') }, { label: 'Configuracoes', onClick: () => navigate('/configuracoes') }]} />
        )}

        <div className="rf-page">
          <main className="rf-shell">
            <div className="main-layout">
              <section>
                <section className="strategy-hero">
                  <div className="hero-kicker">Refinanciamento por contrato</div>
                  <h1 className="hero-heading">Escolha o cenário com <span>melhor impacto</span></h1>
                  <p className="hero-copy">A ConsigAI compara seus contratos e organiza as melhores estratégias para liberar dinheiro, reduzir parcela ou preservar sua margem com transparência.</p>
                  <div className="hero-trust-row">
                    <span className="hero-chip">Simulação sem compromisso</span>
                    <span className="hero-chip">Você compara antes de decidir</span>
                    <span className="hero-chip">Nenhuma contratação automática</span>
                  </div>
                </section>

                <section className="offer-flow-card">
                  <div className="offer-flow-header">
                    <div>
                      <h2>Cenários disponíveis</h2>
                      <p>Escolha uma estratégia e veja o resumo da proposta ao lado.</p>
                    </div>
                    <span className="offer-flow-badge">{scenarios.length} opções</span>
                  </div>

                  <div className="scenario-list">
                    {scenarios.map((s, i) => (
                      <article
                        key={s.key}
                        className={`scenario-card ${i === 1 ? 'green' : ''} ${i === 2 ? 'gold' : ''} ${activeIdx === i ? 'selected' : ''}`}
                        onClick={() => { setActiveIdx(i); setDetailsOpen(false) }}
                        onMouseEnter={() => setHoveredIdx(i)}
                        onMouseLeave={() => setHoveredIdx(-1)}
                        style={getSelectableCardStyle({ selected: activeIdx === i, hovered: hoveredIdx === i })}
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
                        <div className="contract-tags"><small>Contratos incluídos</small><div className="tag-list">{s.contracts.map((c) => <span key={c} className="tag">{c}</span>)}</div></div>
                      </article>
                    ))}
                  </div>

                  <div className="scenario-actions">
                    <button className="primary-cta consigai-cta-animated">Escolher cenário {scenario.title}</button>
                    <button className="secondary-cta consigai-cta-animated" onClick={() => setDetailsOpen((v) => !v)}>Ver detalhes da oferta</button>
                    {detailsOpen && (
                      <div style={{ marginTop: 12, background: '#f7f9fe', border: '1px solid var(--line)', borderRadius: 16, padding: 10, display: 'flex', justifyContent: 'center' }}>
                        <div style={{ width: 300, borderRadius: 10, padding: '14px 12px 12px', border: '1px solid #ececec', color: '#4f4f4f', fontSize: 12, background: 'linear-gradient(180deg, rgba(255,255,255,.45), rgba(0,0,0,.02)), #f5f5f3' }}>
                          <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 800, color: '#444' }}>SIMULACAO DE REFINANCIAMENTO - CONSIGAI</div>
                          <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
                          <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 800, color: '#4a4a4a' }}>VOCE VAI RECEBER HOJE</div>
                          <div style={{ textAlign: 'center', marginTop: 2, fontSize: 22, fontWeight: 900, color: '#232323', lineHeight: 1 }}>{scenario.cash}</div>
                          <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, color: '#5b5b5b' }}>
                            <thead>
                              <tr>
                                <th style={{ fontSize: 8, textAlign: 'left', fontWeight: 500, padding: '4px 0 8px', color: '#676767', paddingRight: 10 }}>Cod.</th>
                                <th style={{ fontSize: 8, textAlign: 'left', fontWeight: 500, padding: '4px 0 8px', color: '#676767' }}>Banco</th>
                                <th style={{ fontSize: 8, textAlign: 'right', fontWeight: 500, padding: '4px 0 8px', color: '#676767' }}>Troco</th>
                              </tr>
                            </thead>
                            <tbody>
                              {scenario.contractDetails.map((item) => (
                                <tr key={item.key}>
                                  <td style={{ fontSize: 8, padding: '4px 0', paddingRight: 10, whiteSpace: 'nowrap' }}>{item.code}</td>
                                  <td style={{ padding: '4px 0' }}>{item.bank}</td>
                                  <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: 700, color: '#3b3b3b' }}>{item.troco}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#555' }}>Nova parcela total</span>
                            <span style={{ fontSize: 14, fontWeight: 800, color: '#3b3b3b', whiteSpace: 'nowrap' }}>{scenario.installment}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <p className="safe-note">Valores estimados. Sujeitos à análise e aprovação de crédito.</p>
                    <button className="back-offers-cta consigai-cta-animated" onClick={() => navigate('/ofertas')}>Voltar para ofertas</button>
                  </div>
                </section>
              </section>

              <aside className="sidebar">
                <div className="side-card proposal-card">
                  <h3>Resumo da proposta</h3>
                  <p>Veja o cenário escolhido e o que acontece com cada contrato antes de avançar.</p>
                  <div className="proposal-highlight"><small>Cenário selecionado</small><strong>{scenario.title}</strong><span>{scenario.desc}</span></div>
                  <div className="summary-list">
                    <div className="summary-row"><span>Você recebe</span><strong>{scenario.cash}</strong></div>
                    <div className="summary-row"><span>Nova parcela total</span><strong>{scenario.installment}</strong></div>
                    <div className="summary-row"><span>Margem livre</span><strong>{scenario.margem}</strong></div>
                    <div className="summary-row"><span>Contratos</span><strong>{scenario.contracts.length} refinanciados</strong></div>
                  </div>
                  <div className="contract-accordion">
                    <div className="accordion-title">O que acontece com cada contrato</div>
                    {scenario.contractDetails.map((item) => (
                      <details key={item.key} className="contract-detail">
                        <summary>
                          <span>{item.bank}</span>
                          <strong>Refinancia</strong>
                        </summary>
                        <div className="contract-detail-body">
                          <div><span>Código</span><strong>{item.code}</strong></div>
                          <div><span>Troco</span><strong>{item.troco}</strong></div>
                          <div><span>Resultado</span><strong>{item.result}</strong></div>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>

                <div className="side-card">
                  <h3>Impacto no bolso</h3>
                  <p>Veja quanto sobra depois da nova parcela.</p>
                  <div className="salary-grid">
                    <div className="salary-box"><small>Antes</small><strong>{liquidoAntes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong><span>com parcela atual de {parcelaAntes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></div>
                    <div className="salary-box green"><small>Depois</small><strong>{liquidoDepois.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong><span>com nova parcela estimada</span></div>
                  </div>
                  <div className="installment-impact"><span>Nova parcela total</span><strong>{scenario.installment}</strong></div>
                </div>

                <div style={{ padding: 22, borderRadius: 26, background: 'radial-gradient(circle at 92% 8%, rgba(0, 231, 255, 0.10), transparent 34%), linear-gradient(180deg, #F8FBFF 0%, #FFFFFF 100%)', border: '1px solid #DDE8F6', boxShadow: '0 18px 46px rgba(3, 36, 111, 0.08)' }}>
                  <h3 style={{ color: '#03246F', fontSize: 15, fontWeight: 950, textTransform: 'uppercase' }}>Voce esta no controle</h3>
                  <p style={{ marginTop: 5, color: '#64748B', fontSize: 12 }}>Antes de avancar, a ConsigAI mostra as condicoes principais para voce decidir com calma e clareza.</p>
                  <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
                    {[
                      ['Sem compromisso', 'Esta etapa e apenas uma simulacao.'],
                      ['Sem contratacao automatica', 'Nada e enviado sem sua confirmacao.'],
                      ['Transparencia total', 'Voce vera taxa, prazo, parcela e custo total.'],
                    ].map(([title, text]) => (
                      <div key={title} style={{ display: 'flex', gap: 10, padding: '11px 12px', borderRadius: 16, background: '#F4F8FF', border: '1px solid #DDE8F6' }}>
                        <span style={{ width: 22, height: 22, borderRadius: '50%', display: 'grid', placeItems: 'center', background: '#E9F8F1', color: '#007A52', border: '1px solid #BDECD7', fontSize: 12, fontWeight: 950 }}>✓</span>
                        <div>
                          <strong style={{ display: 'block', color: '#03246F', fontSize: 12, fontWeight: 950 }}>{title}</strong>
                          <small style={{ display: 'block', marginTop: 3, color: '#64748B', fontSize: 11 }}>{text}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
