import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { DesktopPageHeader, MobilePageHeader } from '../components/AppHeader'
import { BrandName } from '../components/BrandName'
import { appPageStyle } from '../ui/theme'
import { stateData } from '../data/portabilidadeData'
import { parseMoney } from '../lib/formatters'
import { loadProfileData } from '../lib/profileStorage'
import { printSimulationReceipt } from '../lib/receiptPrint'
import { ResumoCard, ImpactoCard, ControleCard, PageHero } from '../components/SimulationSideCards'

const RECEIPT_DATA = {
  eco: {
    heroValue: 'R$ 2.399',
    heroSuffix: null,
    heroLabel: 'SEM AUMENTAR O PRAZO',
    tableHeader: 'Economia',
    rows: [
      ['0056347710', 'FACTA → Banrisul', 'R$ 779,14'],
      ['0123472010087', 'Bradesco → Banrisul', 'R$ 550,93'],
      ['0056346924', 'FACTA → Banrisul', 'R$ 365,63'],
      ['0057628452', 'FACTA → Banrisul', 'R$ 167,50'],
      ['622921912', 'Itaú Consig. → Banrisul', 'R$ 0,30'],
    ],
    totalLabel: 'Economia Total',
    totalValue: 'R$ 1.863,50',
  },
  parc: {
    heroValue: 'R$ 117',
    heroSuffix: '/mês',
    heroLabel: 'ALÍVIO MENSAL',
    tableHeader: 'Alívio/mês',
    rows: [
      ['0123472010087', 'Bradesco → Banrisul', 'R$ 25,86'],
      ['0056347710', 'FACTA → Banrisul', 'R$ 24,85'],
      ['0056346924', 'FACTA → Banrisul', 'R$ 12,13'],
      ['0057628452', 'FACTA → Banrisul', 'R$ 7,95'],
    ],
    totalLabel: 'Alívio por mês',
    totalValue: 'R$ 70,79/mês',
  },
}

const CONTRACT_DETAILS_BY_CODE = {
  '0056347710': {
    installmentBefore: 'R$ 322',
    installmentAfter: 'R$ 298',
    termBefore: '84x',
    termAfter: '84x',
    rateBefore: '1,99% a.m.',
    rateAfter: '1,88% a.m.',
  },
  '0123472010087': {
    installmentBefore: 'R$ 418',
    installmentAfter: 'R$ 381',
    termBefore: '84x',
    termAfter: '84x',
    rateBefore: '2,05% a.m.',
    rateAfter: '1,88% a.m.',
  },
  '0057628452': {
    installmentBefore: 'R$ 544',
    installmentAfter: 'R$ 512',
    termBefore: '84x',
    termAfter: '84x',
    rateBefore: '2,09% a.m.',
    rateAfter: '1,88% a.m.',
  },
}

function getPortContracts(mode, newInstallment) {
  const data = RECEIPT_DATA[mode]
  return data.rows.map(([code, bankRoute, estimatedValue]) => {
    const bankParts = String(bankRoute).split('→').map((v) => v.trim())
    const bankName = bankParts[1] || bankParts[0] || 'Contrato'
    const detail = CONTRACT_DETAILS_BY_CODE[code] || {
      installmentBefore: 'R$ 550',
      installmentAfter: newInstallment,
      termBefore: '84x',
      termAfter: '84x',
      rateBefore: '2,10% a.m.',
      rateAfter: '1,88% a.m.',
    }
    return {
      code,
      bankName,
      estimatedValue,
      installmentBefore: detail.installmentBefore,
      installmentAfter: detail.installmentAfter,
      termBefore: detail.termBefore,
      termAfter: detail.termAfter,
      rateBefore: detail.rateBefore,
      rateAfter: detail.rateAfter,
    }
  })
}

function Receipt({ mode, margin, credit, profile }) {
  const d = RECEIPT_DATA[mode]
  const today = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
  const userName = (profile?.nomeExibicao || profile?.nomeCompleto || 'Cliente').toUpperCase()
  return (
    <div className="receipt-card">
      <div className="receipt-title">RECIBO DE ECONOMIA CONSIGAI</div>
      <div className="receipt-date">{today}</div>
      <div className="receipt-user">{userName}</div>
      <div className="receipt-meta">
        Benefício: Aposentadoria por Tempo de Contribuição<br />
        Valor do Benefício: R$ 2.200
      </div>

      <hr />
      <div className="receipt-sub">PARABÉNS! VOCÊ ECONOMIZOU</div>
      <div className="receipt-value">{d.heroValue}{d.heroSuffix ? <span> {d.heroSuffix}</span> : null}</div>
      <div className="receipt-caption">{d.heroLabel}</div>
      <hr />

      <table>
        <thead>
          <tr><th>Cód.</th><th>De → Para</th><th>{d.tableHeader}</th></tr>
        </thead>
        <tbody>
          {d.rows.map(([cod, de, val]) => <tr key={cod}><td>{cod}</td><td>{de}</td><td>{val}</td></tr>)}
        </tbody>
      </table>

      <hr />
      <div className="receipt-row"><strong>{d.totalLabel}</strong><strong>{d.totalValue}</strong></div>
      <hr />
      <div className="receipt-row"><span>Margem livre após portabilidade</span><strong>até {margin}</strong></div>
      <div className="receipt-row"><span>Crédito disponível após liberação da margem</span><strong>até {credit}</strong></div>
      <div className="receipt-site"><BrandName as="span" style={{ color: 'inherit' }} />.com.br</div>
    </div>
  )
}

export default function Portabilidade() {
  const navigate = useNavigate()
  const location = useLocation()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const profile = loadProfileData()
  const clientName = profile.nomeExibicao || profile.nomeCompleto || 'Sr. João'

  const initialMode = location.state?.initialMode === 'parc' ? 'parc' : 'eco'
  const [mode, setMode] = useState(initialMode)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const d = stateData[mode]
  const portContracts = getPortContracts(mode, d.newInstallment)

  const parcelaAntes = 550
  const parcelaDepois = parseMoney(d.newInstallment)
  const liquidoAntes = 2200 - parcelaAntes
  const liquidoDepois = 2200 - parcelaDepois
  const benefit = `${d.headlineValue}${d.headlineSuffix ? ` ${d.headlineSuffix}` : ''}`

  const handleGoContratacao = () => {
    navigate('/dados-bancarios', {
      state: {
        sourcePath: '/portabilidade',
        nextPath: '/contratacao',
        offerState: {
          sourcePath: '/portabilidade',
          offerTitle: 'Portabilidade',
          offerSubtitle: 'Resumo da oferta selecionada antes da contratação',
          primaryValue: benefit,
          ctaLabel: 'Continuar com esta oferta',
          summary: [
            { label: 'Estratégia', value: mode === 'eco' ? 'Economia inteligente' : 'Parcela menor' },
            { label: 'Parcela nova', value: d.newInstallment },
            { label: 'Benefício', value: benefit },
            { label: 'Margem livre', value: `até ${d.margin}` },
            { label: 'Crédito futuro', value: `até ${d.credit}` },
          ],
        },
      },
    })
  }

  const downloadSimulationReceipt = () => {
    printSimulationReceipt({
      title: 'SIMULAÇÃO DE PORTABILIDADE - CONSIGAI',
      highlightLabel: 'ECONOMIA ESTIMADA',
      highlightValue: benefit,
      rows: [
        { label: 'Estratégia', value: mode === 'eco' ? 'Economia inteligente' : 'Parcela menor' },
        { label: 'Parcela nova', value: d.newInstallment },
        { label: 'Margem livre', value: `até ${d.margin}` },
        { label: 'Crédito futuro', value: `até ${d.credit}` },
      ],
    })
  }

  return (
    <>
      <style>{`
        .port-root{max-width:1280px;margin:0 auto;padding:26px 24px 48px}
        .main-layout{display:grid;grid-template-columns:minmax(0,1fr) 380px;gap:30px}
        .card{border:1px solid #dde8f6;border-radius:28px;background:#fff;box-shadow:0 16px 38px rgba(3,36,111,.075)}
.flow{padding:22px;border-radius:34px;position:relative;overflow:hidden;background:#fff;box-shadow:0 22px 58px rgba(3,36,111,.11)}
        .flow:before{content:'';position:absolute;inset:0 0 auto 0;height:5px;background:linear-gradient(90deg,#055ece,#1da1eb,#00e7ff,#007a52)}
        .flow > *{position:relative;z-index:1}
        .tabs{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}
        .tab{min-height:88px;padding:18px;border-radius:21px;border:1px solid #dde8f6;background:radial-gradient(circle at 92% 8%,rgba(29,161,235,.1),transparent 34%),linear-gradient(180deg,#fff,#f8fbff);text-align:center;display:grid;place-items:center;gap:5px;cursor:pointer;position:relative;overflow:hidden;box-shadow:0 16px 38px rgba(3,36,111,.075)}
        .tab:before{content:'';position:absolute;inset:0 0 auto 0;height:4px;background:linear-gradient(90deg,#055ece,#1da1eb,#00e7ff);opacity:.55}
        .tab.active{border-color:rgba(0,231,255,.58);box-shadow:0 22px 50px rgba(3,36,111,.12);background:radial-gradient(circle at 92% 8%,rgba(0,231,255,.17),transparent 34%),linear-gradient(180deg,#fff,#f8fbff)}
        .tab.active:before{opacity:1;background:linear-gradient(90deg,#055ece,#1da1eb,#00e7ff,#007a52)}
        .tab strong{font-size:16px;font-weight:900}
        .tab span{font-size:12px;color:#64748b}
        .strategy-icon{display:inline-flex;align-items:flex-end;justify-content:center;gap:4px;min-height:16px}
        .strategy-icon i{display:block;width:10px;border-radius:5px;background:#1da1eb;opacity:.45}
        .strategy-icon i:nth-child(1){height:18px;opacity:1}
        .strategy-icon i:nth-child(2){height:14px;opacity:.9}
        .strategy-icon i:nth-child(3){height:11px;opacity:.8}
        .strategy-icon i:nth-child(4){height:8px;opacity:.72}
        .strategy-icon i:nth-child(5){height:6px;opacity:.62}
        .tab.active .strategy-icon i{background:#055ece;opacity:.95}
        .strategy-icon.flat i{height:8px !important;opacity:.9}
        .offer{padding:22px;background:#fff}
        .compare{display:grid;grid-template-columns:1fr 56px 1fr;gap:12px;align-items:center;padding:16px;border-radius:21px;border:1px solid #dde8f6;background:linear-gradient(180deg,#fff,#f8fbff);box-shadow:0 12px 28px rgba(3,36,111,.055)}
        .pbox{padding:14px;border-radius:13px;border:1px solid #dde8f6;background:rgba(244,248,255,.72)}
        .pbox small{display:block;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;color:#64748b}
        .pbox strong{display:block;margin-top:6px;font-size:24px;font-weight:800;letter-spacing:-.06em}
        .old strong{color:#b00020;text-decoration:line-through}
        .new{background:rgba(233,248,241,.6);border-color:#bdecd7}
        .new strong{color:#007a52}
        .arrow{width:38px;height:38px;border-radius:999px;display:grid;place-items:center;background:linear-gradient(145deg,#055ece,#1da1eb);color:#fff;font-size:18px;font-weight:900;box-shadow:0 12px 24px rgba(5,94,206,.18)}
        .highlight{margin-top:16px;padding:22px;border-radius:21px;background:radial-gradient(circle at 92% 8%,rgba(0,122,82,.08),transparent 34%),linear-gradient(180deg,#fff,#f3fff9);border:1px solid #bdecd7;text-align:center;box-shadow:0 14px 32px rgba(3,36,111,.055)}
        .highlight small{font-size:11px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:#007a52}
        .highlight strong{display:block;margin-top:9px;font-size:38px;line-height:1;font-weight:800;letter-spacing:-.075em;color:#007a52}
        .highlight span{display:block;margin-top:8px;font-size:12px;color:#64748b}
        .benefits{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px}
        .benefit{padding:15px;border-radius:13px;border:1px solid #dde8f6;background:radial-gradient(circle at 92% 8%,rgba(29,161,235,.08),transparent 34%),linear-gradient(180deg,#fff,#f8fbff);box-shadow:0 10px 24px rgba(3,36,111,.045)}
        .benefit small{display:block;font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#64748b}
        .benefit strong{display:block;margin-top:6px;font-size:24px;font-weight:800;color:#055ece}
        .contracts-row{margin-top:16px;padding-top:14px;border-top:1px solid #dde8f6}
        .contracts-row small{display:block;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;color:#64748b;margin-bottom:8px}
        .contracts-bottom{display:flex;justify-content:space-between;align-items:center;gap:12px}
        .contracts-tags{display:flex;flex-wrap:wrap;gap:8px}
        .contracts-tag{padding:7px 12px;border-radius:999px;background:#f4f8ff;border:1px solid #dde8f6;color:#055ece;font-size:11px;font-weight:800}
        .details-btn{flex:0 0 auto;min-height:44px;padding:0 16px;border-radius:13px;border:1px solid #bfd4f6;background:#fff;color:#055ece;font-size:12px;font-weight:900;cursor:pointer;white-space:nowrap}
        .actions{margin-top:20px;padding-top:16px;border-top:1px solid #dde8f6}
        .actions > button + button{margin-top:12px}
        .actions-divider{margin:16px 0;border:none;border-top:1px dashed #dde8f6}
        .cta{width:100%;min-height:54px;border:0;border-radius:21px;background:linear-gradient(145deg,#055ece,#03246f);color:#fff;font-size:15px;font-weight:900;cursor:pointer;box-shadow:0 18px 38px rgba(5,94,206,.24)}
        .secondary{width:100%;min-height:50px;border-radius:21px;border:1px solid #bfd4f6;background:#fff;color:#055ece;font-size:14px;font-weight:900;cursor:pointer}
        .safe{margin-top:12px;text-align:center;font-size:11px;color:#64748b;font-weight:700}
        .consigai-cta-animated{position:relative;overflow:hidden;transform:translateY(0);transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease,background-position .35s ease,filter .18s ease;animation:consigaiDetailsFloat 3.8s ease-in-out infinite;background-size:220% 100%;background-position:0% 0%}
        .consigai-cta-animated:hover{background-position:100% 0%;animation-play-state:paused;transform:translateY(-2px) scale(1.01)!important;filter:saturate(1.05)}
        .consigai-cta-animated:active{transform:translateY(0) scale(.985)}
        .consigai-cta-animated:after{content:'';position:absolute;inset:0;background:linear-gradient(115deg,transparent 0%,rgba(255,255,255,.55) 45%,transparent 60%);transform:translateX(-120%) skewX(-18deg);opacity:0;pointer-events:none}
        .consigai-cta-animated:hover:after{opacity:1;animation:consigaiDetailsShine .9s ease forwards}
        @keyframes consigaiDetailsFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-1px)}}
        @keyframes consigaiDetailsShine{to{transform:translateX(120%) skewX(-18deg);opacity:0}}
        .receipt-wrap{margin-top:12px}
        .compact-contract-list{display:grid;gap:12px;margin-top:12px;margin-bottom:10px}
        .compact-refin-card{padding:16px;border-radius:21px;background:#fff;border:1px solid #dde8f6;box-shadow:none;position:relative;overflow:hidden}
        .compact-refin-card:before{content:'';position:absolute;inset:0 0 auto 0;height:4px;background:linear-gradient(90deg,#055ece,#1da1eb,#00e7ff,#007a52)}
        .compact-header{display:flex;justify-content:space-between;align-items:center;gap:10px;padding-bottom:10px;border-bottom:1px solid #dde8f6}
        .compact-header small{color:#055ece;font-size:10px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
        .compact-header h3{margin-top:2px;color:#03246f;font-size:16px;line-height:1;font-weight:900;letter-spacing:-.04em}
        .money-highlight{margin-top:10px;padding:10px 12px;border-radius:13px;background:rgba(233,248,241,.62);border:1px solid #bdecd7;display:flex;align-items:center;justify-content:space-between;gap:12px}
        .money-copy span{display:block;color:#007a52;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.06em}
        .money-copy small{display:block;margin-top:2px;color:#64748b;font-size:10px;line-height:1.25;font-weight:700}
        .money-highlight strong{flex:0 0 auto;color:#007a52;font-size:24px;line-height:1;font-weight:800;letter-spacing:-.055em;white-space:nowrap}
        .compare-lines{display:grid;margin-top:10px;border:1px solid #dde8f6;border-radius:13px;overflow:hidden;background:#fff}
        .compare-head,.compare-line{display:grid;grid-template-columns:74px 1fr 1fr;align-items:center;gap:8px}
        .compare-head{padding:8px 10px;background:#f4f8ff;border-bottom:1px solid #dde8f6;color:#64748b;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.07em}
        .compare-head span:nth-child(2),.compare-head span:nth-child(3){text-align:center}
        .compare-line{padding:9px 10px;border-bottom:1px solid #dde8f6}
        .compare-line:last-child{border-bottom:0}
        .compare-label{font-size:12px;font-weight:800;color:#03246f}
        .compare-value{font-size:12px;font-weight:800;color:#03246f;text-align:center}
        .compare-value.after{color:#055ece}
        .compact-note{margin-top:8px;padding:8px 10px;border-radius:13px;background:#f4f8ff;border:1px solid #dde8f6;color:#64748b;font-size:11px}
        .receipt-card{background:#f5f5f3;border:1px solid #ececec;border-radius:10px;padding:12px;font-size:11px;color:#4f4f4f}
        .receipt-title{text-align:center;font-weight:800}
        .receipt-date{text-align:center;color:#808080;font-size:10px;margin-top:4px}
        .receipt-user{margin-top:10px;font-weight:700}
        .receipt-meta{margin-top:6px;line-height:1.35;font-size:10px}
        .receipt-card hr{border:none;border-top:1px dashed #cfcfcf;margin:8px 0}
        .receipt-sub{text-align:center;font-weight:800;font-size:10px}
        .receipt-value{text-align:center;font-size:22px;font-weight:900;line-height:1}
        .receipt-value span{font-size:12px;font-weight:700}
        .receipt-caption{text-align:center;font-size:8px;letter-spacing:.08em;color:#888}
        .receipt-card table{width:100%;font-size:9px;border-collapse:collapse}
        .receipt-card th{text-align:left;color:#676767;padding-bottom:6px}
        .receipt-card th:last-child,.receipt-card td:last-child{text-align:right}
        .receipt-row{display:flex;justify-content:space-between;gap:8px;font-size:10px}
        .receipt-site{text-align:center;margin-top:8px;font-size:9px;color:#7a7a7a}
        .back-btn{margin-top:10px;width:100%;min-height:46px;border-radius:13px;border:1px solid #bfd4f6;background:#fff;color:#055ece;font-size:14px;font-weight:900;cursor:pointer;box-shadow:0 8px 20px rgba(30,60,180,.12)}
        @media (max-width:1100px){.main-layout{grid-template-columns:1fr}.sidebar{display:grid;grid-template-columns:1fr 1fr;gap:16px}.side-card + .side-card{margin-top:0}}
        @media (max-width:900px){.port-root{padding:16px}.tabs,.compare,.benefits,.salary,.sidebar{grid-template-columns:1fr}.arrow{transform:rotate(90deg);justify-self:center}.compare-head,.compare-line{grid-template-columns:1fr;gap:6px}.compare-head span:first-child{display:none}}
      `}</style>

      <div style={appPageStyle}>
        {isDesktop ? (
          <DesktopPageHeader
            clientName={clientName}
            chipLabel="Portabilidade"
            title="Economia inteligente"
            subtitle="Compare a parcela atual com uma proposta mais leve e transparente."
            onLogoClick={() => navigate('/ofertas')}
            actions={[{ label: 'Ofertas', onClick: () => navigate('/ofertas') }, { label: 'Configurações', onClick: () => navigate('/configuracoes') }]}
          />
        ) : (
          <MobilePageHeader
            clientName={clientName}
            chipLabel="Portabilidade"
            title="Economia inteligente"
            subtitle="Compare a parcela atual com uma proposta mais leve e transparente."
            onLogoClick={() => navigate('/ofertas')}
            actions={[{ label: 'Ofertas', onClick: () => navigate('/ofertas') }, { label: 'Configurações', onClick: () => navigate('/configuracoes') }]}
          />
        )}

        <main className="port-root">
          <div className="main-layout">
            <section>
              <PageHero
                kicker="Portabilidade"
                title="Compare e veja quanto pode"
                titleAccent="economizar"
                body="A ConsigAI compara seu contrato atual com uma nova proposta para mostrar economia, parcela, margem e crédito futuro antes de você decidir."
                chips={['Prazo sem esticar', 'Simulação sem compromisso', 'Nenhuma contratação automática']}
              />

              <section className="card flow">
                <div className="tabs">
                  <button className={`tab ${mode === 'eco' ? 'active' : ''}`} onClick={() => setMode('eco')}>
                    <div className="strategy-icon" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
                    <strong>Quero Economizar</strong><span>Diminuir minha dívida</span>
                  </button>
                  <button className={`tab ${mode === 'parc' ? 'active' : ''}`} onClick={() => setMode('parc')}>
                    <div className="strategy-icon flat" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
                    <strong>Parcela Menor</strong><span>Mais alívio no mês</span>
                  </button>
                </div>

                <article className="card offer">
                  <section className="compare">
                    <div className="pbox old"><small>Parcela atual</small><strong>R$ 550</strong></div>
                    <div className="arrow">→</div>
                    <div className="pbox new"><small>Parcela nova</small><strong>{d.newInstallment}</strong></div>
                  </section>

                  <section className="highlight"><small>{d.eyebrow}</small><strong>{benefit}</strong><span>{d.subhead}</span></section>

                  <section className="benefits">
                    <div className="benefit"><small>Margem livre depois</small><strong>até {d.margin}</strong></div>
                    <div className="benefit"><small>Crédito futuro disponível</small><strong>até {d.credit}</strong></div>
                  </section>

                  <div className="contracts-row">
                    <small>Contratos incluídos</small>
                    <div className="contracts-bottom">
                      <div className="contracts-tags">
                        {RECEIPT_DATA[mode].rows.map(([code, bankRoute]) => {
                          const origin = bankRoute.split('→')[0].trim()
                          return <span key={code} className="contracts-tag">{origin}</span>
                        })}
                      </div>
                      <button className="details-btn consigai-cta-animated" onClick={() => setDetailsOpen(v => !v)}>Ver detalhes</button>
                    </div>
                  </div>

                  {detailsOpen ? (
                    <div className="receipt-wrap" style={{ marginTop: 12 }}>
                      <div className="compact-contract-list" style={{ marginTop: 0 }}>
                        {portContracts.map((item) => (
                          <article key={item.code} className="compact-refin-card">
                            <header className="compact-header">
                              <div>
                                <small>Portabilidade</small>
                                <h3>{item.bankName}</h3>
                              </div>
                            </header>
                            <section className="money-highlight">
                              <div className="money-copy">
                                <span>Economia estimada</span>
                                <small>valor estimado sem sair do prazo</small>
                              </div>
                              <strong>{item.estimatedValue}</strong>
                            </section>
                            <section className="compare-lines">
                              <div className="compare-head">
                                <span></span>
                                <span>Hoje</span>
                                <span>Depois</span>
                              </div>
                              <div className="compare-line">
                                <span className="compare-label">Parcela</span>
                                <strong className="compare-value">{item.installmentBefore}</strong>
                                <strong className="compare-value after">{item.installmentAfter}</strong>
                              </div>
                              <div className="compare-line">
                                <span className="compare-label">Prazo</span>
                                <strong className="compare-value">{item.termBefore}</strong>
                                <strong className="compare-value after">{item.termAfter}</strong>
                              </div>
                              <div className="compare-line">
                                <span className="compare-label">Taxa</span>
                                <strong className="compare-value">{item.rateBefore}</strong>
                                <strong className="compare-value after">{item.rateAfter}</strong>
                              </div>
                            </section>
                            <p className="compact-note"><strong>Contrato:</strong> {item.code}</p>
                          </article>
                        ))}
                      </div>
                      <button className="secondary consigai-cta-animated" style={{ marginTop: 10 }} onClick={() => window.print()}>Fazer download da oferta</button>
                    </div>
                  ) : null}

                  <div className="actions">
                    <button className="cta consigai-cta-animated" onClick={handleGoContratacao}>Continuar com esta oferta</button>
                    <button className="secondary consigai-cta-animated" onClick={() => setShowReceipt(v => !v)}>Gerar recibo da simulação</button>
                    {showReceipt ? (
                      <div style={{ marginTop: 4, borderRadius: 16, border: '1px solid #DDE8F6', background: '#f7f9fe', padding: 10, display: 'flex', justifyContent: 'center' }}>
                        <div style={{ width: 300, borderRadius: 10, padding: '14px 12px 12px', border: '1px solid #ececec', color: '#4f4f4f', fontSize: 12, background: 'linear-gradient(180deg, rgba(255,255,255,.45), rgba(0,0,0,.02)), #f5f5f3' }}>
                          <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 800, color: '#444' }}>SIMULAÇÃO DE PORTABILIDADE - CONSIGAI</div>
                          <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
                          <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 800, color: '#4a4a4a' }}>ECONOMIA ESTIMADA</div>
                          <div style={{ textAlign: 'center', marginTop: 2, fontSize: 22, fontWeight: 900, color: '#232323', lineHeight: 1 }}>{benefit}</div>
                          <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
                          <div style={{ display: 'grid', gap: 6, fontSize: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Estratégia</span><strong>{mode === 'eco' ? 'Economia inteligente' : 'Parcela menor'}</strong></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Parcela nova</span><strong>{d.newInstallment}</strong></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Margem livre</span><strong>até {d.margin}</strong></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Crédito futuro</span><strong>até {d.credit}</strong></div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                    {showReceipt ? (
                      <button
                        className="consigai-cta-animated"
                        onClick={downloadSimulationReceipt}
                        style={{
                          width: '100%',
                          minHeight: 46,
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
                    ) : null}
                    <p className="safe">Valores estimados. Sujeitos à análise e aprovação de crédito.</p>
                    <button className="back-btn consigai-cta-animated" onClick={() => navigate('/ofertas')}>Voltar para ofertas</button>
                  </div>
                </article>
              </section>
            </section>

            <aside className="sidebar" style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
              <ResumoCard
                rows={[
                  { label: 'Estratégia', value: mode === 'eco' ? 'Economia inteligente' : 'Parcela menor' },
                  { label: 'Parcela nova', value: d.newInstallment },
                  { label: 'Benefício', value: benefit },
                  { label: 'Margem livre', value: `até ${d.margin}` },
                  { label: 'Crédito futuro', value: `até ${d.credit}` },
                ]}
              />
              <ImpactoCard
                liquidoAntes={liquidoAntes}
                liquidoDepois={liquidoDepois}
                novaParcela={d.newInstallment}
                subtitle="Veja quanto sobra depois da portabilidade."
              />
              <ControleCard />
            </aside>
          </div>
        </main>
      </div>
    </>
  )
}
