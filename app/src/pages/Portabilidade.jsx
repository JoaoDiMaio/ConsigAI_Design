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
import { getSelectableCardStyle } from '../ui/cardSelection'
import { ResumoCard, ImpactoCard, ControleCard } from '../components/SimulationSideCards'
import { OperationGuideCard } from '../components/OperationGuideCard'
import { btnToggleShape } from '../ui/buttonStyles'

const PORTABILIDADE_GUIDE = {
  badge: 'Guia ConsigAI',
  title: 'Como funciona a portabilidade',
  subtitle: 'Você move seu contrato para um banco com taxa menor. Sem pegar novo crédito. Sem custo. É um direito seu.',
  steps: [
    { label: 'Passo 1', title: 'Compare', body: 'Veja sua parcela atual e a nova condição proposta.' },
    { label: 'Passo 2', title: 'Entenda a economia', body: 'Veja quanto pode economizar no contrato e no mês.' },
    { label: 'Passo 3', title: 'Decida com calma', body: 'Confirme apenas se fizer sentido para você. Nada avança sozinho.' },
    { label: 'Passo 4', title: 'Acompanhe', body: 'A ConsigAI mostra cada etapa da portabilidade.' },
  ],
  finalTitle: 'Você está no controle',
  finalText: 'A portabilidade é um direito seu. Nenhuma contratação acontece sem sua confirmação.',
  badges: ['Sem custo para o cliente', 'Simulação sem compromisso', 'Direito garantido por lei'],
}

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
  const clientName = profile.nomeExibicao || profile.nomeCompleto || 'Cliente'

  const [mode, setMode] = useState('eco')
  const [hoveredMode, setHoveredMode] = useState(null)

  const [detailsOpen, setDetailsOpen] = useState(false)
  const [detailsHover, setDetailsHover] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const d = stateData[mode]
  const portContracts = getPortContracts(mode, d.newInstallment)

  const salarioBase = 2200
  const parcelaAntes = 550
  const parcelaDepois = parseMoney(d.newInstallment)
  const liquidoAntes = salarioBase - parcelaAntes
  const liquidoDepois = salarioBase - parcelaDepois
  const benefit = `${d.headlineValue}${d.headlineSuffix ? ` ${d.headlineSuffix}` : ''}`
  const economiaMensal = parcelaAntes - parcelaDepois > 0 ? Math.round(parcelaAntes - parcelaDepois) : 0

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
        :root{
          --blue-dark:#002D6E;
          --blue-main:#043B8B;
          --blue-interactive:#2454D6;
          --blue-soft:#F4F9FF;
          --blue-line:#BFD4F6;
          --green:#007A52;
          --green-strong:#00A86B;
          --green-soft:#F0FFF8;
          --green-line:#BDECD7;
          --muted:#64748B;
          --line:#DDE8F6;
        }
        .port-root{max-width:1400px;margin:0 auto;padding:26px 24px 48px}
        .main-layout{display:grid;grid-template-columns:260px minmax(0,1fr) 320px;gap:28px}
        .port-guide-col{}
        .card{border:1px solid var(--line);border-radius:28px;background:#fff;box-shadow:0 16px 38px rgba(3,36,111,.075)}
        .flow{padding:22px;border-radius:34px;position:relative;overflow:hidden;background:#fff;box-shadow:0 18px 42px rgba(3,36,111,.09)}
        .flow:before{content:'';position:absolute;inset:0 0 auto 0;height:5px;background:linear-gradient(90deg,var(--blue-main),var(--blue-interactive),var(--green-strong))}
        .flow > *{position:relative;z-index:1}
        .tabs{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}
        .tab{min-height:88px;padding:18px;border-radius:21px;border:1px solid var(--line);background:#fff;text-align:center;display:grid;place-items:center;gap:5px;cursor:pointer;position:relative;overflow:hidden;box-shadow:0 12px 32px rgba(3,36,111,.05)}
        .tab:before{display:none}
        .tab strong{font-size:16px;font-weight:900;color:var(--blue-dark)}
        .tab span{font-size:12px;color:var(--muted)}
        .strategy-icon{display:inline-flex;align-items:flex-end;justify-content:center;gap:4px;min-height:16px}
        .strategy-icon i{display:block;width:10px;border-radius:5px;background:var(--blue-interactive);opacity:.45}
        .strategy-icon i:nth-child(1){height:18px;opacity:1}
        .strategy-icon i:nth-child(2){height:14px;opacity:.9}
        .strategy-icon i:nth-child(3){height:11px;opacity:.8}
        .strategy-icon i:nth-child(4){height:8px;opacity:.72}
        .strategy-icon i:nth-child(5){height:6px;opacity:.62}
        .tab.active .strategy-icon i{background:var(--blue-main);opacity:.95}
        .strategy-icon.flat i{height:8px !important;opacity:.9}
        .offer{padding:22px;background:#fff}
        .compare{display:grid;grid-template-columns:1fr 56px 1fr;gap:12px;align-items:center;padding:16px;border-radius:21px;border:1px solid var(--line);background:linear-gradient(180deg,#fff,#f8fbff);box-shadow:0 10px 24px rgba(3,36,111,.045)}
        .pbox{padding:14px;border-radius:13px;border:1px solid var(--line);background:rgba(244,248,255,.72)}
        .pbox small{display:block;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}
        .pbox strong{display:block;margin-top:6px;font-size:24px;font-weight:800;letter-spacing:-.06em}
        .old strong{color:#b00020;text-decoration:line-through}
        .new{background:var(--green-soft);border-color:var(--green-line)}
        .new strong{color:var(--green)}
        .arrow{width:38px;height:38px;border-radius:999px;display:grid;place-items:center;background:linear-gradient(145deg,var(--blue-main),var(--blue-interactive));color:#fff;font-size:18px;font-weight:900;box-shadow:0 12px 24px rgba(4,59,139,.18)}
        .highlight{margin-top:16px;padding:22px;border-radius:21px;text-align:center;box-shadow:0 14px 32px rgba(3,36,111,.055)}
        .highlight small{font-size:11px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
        .highlight strong{display:block;margin-top:9px;font-size:38px;line-height:1;font-weight:800;letter-spacing:-.075em}
        .highlight span{display:block;margin-top:8px;font-size:12px;color:var(--muted)}
        .highlight-total{background:radial-gradient(circle at 92% 8%,rgba(0,122,82,.08),transparent 34%),linear-gradient(180deg,#fff,#f3fff9);border:1px solid var(--green-line)}
        .highlight-total small{color:var(--green)}
        .highlight-total strong{color:var(--green)}
        .highlight-monthly{background:radial-gradient(circle at 92% 8%,rgba(0,168,107,.08),transparent 34%),linear-gradient(180deg,#fff,#f6fffb);border:1px solid var(--green-line)}
        .highlight-monthly small{color:var(--green-strong)}
        .highlight-monthly strong{color:var(--green-strong)}
        .benefits{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px}
        .benefit{padding:15px;border-radius:13px;border:1px solid var(--line);background:radial-gradient(circle at 92% 8%,rgba(4,59,139,.06),transparent 34%),linear-gradient(180deg,#fff,#f8fbff);box-shadow:0 10px 24px rgba(3,36,111,.045)}
        .benefit small{display:block;font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
        .benefit strong{display:block;margin-top:6px;font-size:24px;font-weight:800;color:var(--blue-main)}
        .contracts-row{margin-top:16px;padding-top:14px;border-top:1px solid var(--line)}
        .contracts-row small{display:block;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:8px}
        .contracts-bottom{display:flex;justify-content:space-between;align-items:center;gap:12px}
        .contracts-tags{display:flex;flex-wrap:wrap;gap:8px}
        .contracts-tag{padding:7px 12px;border-radius:999px;background:var(--blue-soft);border:1px solid var(--line);color:var(--blue-main);font-size:11px;font-weight:800}
        .details-btn{flex:0 0 auto;min-height:44px;padding:0 16px;border-radius:13px;border:1px solid var(--blue-line);background:#fff;color:var(--blue-main);font-size:12px;font-weight:900;cursor:pointer;white-space:nowrap}
        .actions{margin-top:20px;padding-top:16px;border-top:1px solid var(--line)}
        .actions > button + button{margin-top:12px}
        .actions-divider{margin:16px 0;border:none;border-top:1px dashed var(--line)}
        .cta{width:100%;min-height:52px;border:0;border-radius:13px;background:linear-gradient(145deg,var(--blue-main),var(--blue-dark));color:#fff;font-size:16px;font-weight:900;cursor:pointer;box-shadow:0 14px 32px rgba(4,59,139,.22);display:flex;align-items:center;justify-content:center}
        .secondary{width:100%;min-height:48px;border-radius:13px;border:1px solid var(--blue-line);background:#fff;color:var(--blue-main);font-size:15px;font-weight:900;cursor:pointer;display:flex;align-items:center;justify-content:center}
        .safe{margin-top:12px;text-align:center;font-size:11px;color:var(--muted);font-weight:700}
        .consigai-cta-animated{position:relative;overflow:hidden;transition:transform .16s ease,box-shadow .16s ease,border-color .16s ease,filter .16s ease}
        .consigai-cta-animated:hover{transform:translateY(-1px)!important;filter:none}
        .consigai-cta-animated:active{transform:translateY(0)}
        .details-panel{margin-top:12px;max-height:min(560px,68vh);overflow:auto;padding-right:4px;scrollbar-gutter:stable}
        .receipt-wrap{margin-top:12px}
        .compact-contract-list{display:grid;gap:12px;margin-top:12px;margin-bottom:10px}
        .compact-refin-card{padding:16px;border-radius:21px;background:#fff;border:1px solid var(--line);box-shadow:none;position:relative;overflow:hidden}
        .compact-refin-card:before{content:'';position:absolute;inset:0 0 auto 0;height:4px;background:linear-gradient(90deg,var(--blue-main),var(--blue-interactive),var(--green-strong))}
        .compact-header{display:flex;justify-content:space-between;align-items:center;gap:10px;padding-bottom:10px;border-bottom:1px solid var(--line)}
        .compact-header small{color:var(--blue-main);font-size:10px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
        .compact-header h3{margin-top:2px;color:var(--blue-dark);font-size:16px;line-height:1;font-weight:900;letter-spacing:-.04em}
        .money-highlight{margin-top:10px;padding:10px 12px;border-radius:13px;display:flex;align-items:center;justify-content:space-between;gap:12px}
        .money-highlight.total{background:var(--green-soft);border:1px solid var(--green-line)}
        .money-highlight.total .money-copy span,.money-highlight.total strong{color:var(--green)}
        .money-highlight.monthly{background:linear-gradient(180deg,#f6fffb,#fff);border:1px solid var(--green-line)}
        .money-highlight.monthly .money-copy span,.money-highlight.monthly strong{color:var(--green-strong)}
        .money-copy span{display:block;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.06em}
        .money-copy small{display:block;margin-top:2px;color:var(--muted);font-size:10px;line-height:1.25;font-weight:700}
        .money-highlight strong{flex:0 0 auto;font-size:24px;line-height:1;font-weight:800;letter-spacing:-.055em;white-space:nowrap}
        .compare-lines{display:grid;margin-top:10px;border:1px solid var(--line);border-radius:13px;overflow:hidden;background:#fff}
        .compare-head,.compare-line{display:grid;grid-template-columns:74px 1fr 1fr;align-items:center;gap:8px}
        .compare-head{padding:8px 10px;background:var(--blue-soft);border-bottom:1px solid var(--line);color:var(--muted);font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.07em}
        .compare-head span:nth-child(2),.compare-head span:nth-child(3){text-align:center}
        .compare-line{padding:9px 10px;border-bottom:1px solid var(--line)}
        .compare-line:last-child{border-bottom:0}
        .compare-label{font-size:12px;font-weight:800;color:var(--blue-dark)}
        .compare-value{font-size:12px;font-weight:800;color:var(--blue-dark);text-align:center}
        .compare-value.after{color:var(--blue-main)}
        .compact-note{margin-top:8px;padding:8px 10px;border-radius:13px;background:var(--blue-soft);border:1px solid var(--line);color:var(--muted);font-size:11px}
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
        .back-btn{margin-top:10px;width:100%;min-height:46px;border-radius:13px;border:1px solid var(--blue-line);background:#fff;color:var(--blue-main);font-size:14px;font-weight:900;cursor:pointer;box-shadow:0 8px 20px rgba(4,59,139,.12);display:flex;align-items:center;justify-content:center}
        .process-accordion{margin-bottom:16px;border-radius:16px;border:1px solid var(--line);overflow:hidden}
        .process-accordion-btn{width:100%;display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:var(--blue-soft);border:0;color:var(--blue-dark);font-size:13px;font-weight:900;cursor:pointer;text-align:left;gap:8px}
        .process-accordion-btn:hover{background:#eaf1fd}
        .process-steps{padding:14px 16px;display:grid;gap:8px;background:#fff}
        .process-step{display:flex;align-items:flex-start;gap:10px;font-size:12px}
        .process-step-num{flex-shrink:0;width:22px;height:22px;border-radius:50%;background:var(--blue-main);color:#fff;display:grid;place-items:center;font-size:10px;font-weight:900}
        .process-step-body{color:var(--muted);font-weight:600;line-height:1.35}
        .process-step-body strong{display:block;color:var(--blue-dark);font-weight:800;margin-bottom:1px}
        .no-credit-line{margin-top:12px;padding:10px 14px;border-radius:13px;background:rgba(0,122,82,.07);border:1px solid var(--green-line);color:var(--green);font-size:12px;font-weight:750;line-height:1.4;text-align:center}
        .port-hero{margin-bottom:20px;padding:24px 22px;border-radius:21px;background:radial-gradient(circle at 90% 8%,rgba(0,122,82,.11),transparent 40%),linear-gradient(145deg,#f0fff8 0%,#fff 100%);border:1px solid var(--green-line);position:relative;overflow:hidden;text-align:center}
        .port-hero::before{content:'';position:absolute;inset:0 0 auto 0;height:3px;background:linear-gradient(90deg,var(--green),var(--green-strong),var(--blue-interactive))}
        .port-hero-kicker{display:inline-flex;align-items:center;gap:7px;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.1em;color:var(--green);margin-bottom:14px;justify-content:center}
        .port-hero-dot{width:7px;height:7px;border-radius:50%;background:var(--green-strong);box-shadow:0 0 9px rgba(0,168,107,.8);flex-shrink:0;animation:heroGlow 2s ease-in-out infinite}
        @keyframes heroGlow{0%,100%{box-shadow:0 0 9px rgba(0,168,107,.8)}50%{box-shadow:0 0 16px rgba(0,168,107,1)}}
        .port-hero-num{display:flex;align-items:baseline;gap:8px;justify-content:center;flex-wrap:wrap;line-height:1}
        .port-hero-prefix{font-size:17px;font-weight:800;color:var(--blue-dark)}
        .port-hero-num strong{font-size:56px;font-weight:900;letter-spacing:-.08em;color:var(--green);line-height:.95}
        .port-hero-suffix{font-size:20px;font-weight:800;color:var(--green-strong);align-self:flex-end;padding-bottom:5px}
        .port-hero-monthly{margin-top:10px;font-size:14px;font-weight:800;color:var(--green-strong);letter-spacing:-.01em}
        .port-hero-sub{margin-top:6px;font-size:11px;font-weight:700;color:var(--muted)}
        .port-mode-label{font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);text-align:center;margin-bottom:14px}
        .port-eco-badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:999px;background:linear-gradient(135deg,var(--green-soft),#e6fff3);border:1px solid var(--green-line);color:var(--green);font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px}
        .port-review-note{margin-top:10px;text-align:center;font-size:12px;font-weight:800;color:var(--blue-main)}
        @media (max-width:1200px){.main-layout{grid-template-columns:minmax(0,1fr) 320px}.port-guide-col{display:none}}
        @media (max-width:1100px){.main-layout{grid-template-columns:1fr}.port-guide-col{display:none}.sidebar{display:grid;grid-template-columns:1fr 1fr;gap:16px}.side-card + .side-card{margin-top:0}}
        @media (max-width:900px){.port-root{padding:16px}.tabs,.compare,.benefits,.salary,.sidebar{grid-template-columns:1fr}.arrow{transform:rotate(90deg);justify-self:center}.compare-head,.compare-line{grid-template-columns:1fr;gap:6px}.compare-head span:first-child{display:none}.contracts-bottom{flex-direction:column;align-items:stretch}.details-btn{width:100%}.details-panel{max-height:min(420px,62vh)}}
      `}</style>

      <div style={appPageStyle}>
        {isDesktop ? (
          <DesktopPageHeader
            clientName={clientName}
            pageTitle="Portabilidade"
            pageDescription="Pague menos pelo mesmo contrato — compare e decida antes de confirmar."
            onLogoClick={() => navigate('/ofertas')}
            actions={[{ label: 'Ofertas', onClick: () => navigate('/ofertas') }, { label: 'Configurações', onClick: () => navigate('/configuracoes') }, { label: 'Acompanhamento', onClick: () => navigate('/acompanhamento') }]}
          />
        ) : (
          <MobilePageHeader
            clientName={clientName}
            chipLabel="Portabilidade"
            title="Pague menos pelo mesmo contrato"
            subtitle="Compare e decida com calma. Você não está pegando novo crédito."
            onLogoClick={() => navigate('/ofertas')}
            actions={[{ label: 'Ofertas', onClick: () => navigate('/ofertas') }, { label: 'Configurações', onClick: () => navigate('/configuracoes') }, { label: 'Acompanhamento', onClick: () => navigate('/acompanhamento') }]}
          />
        )}

        <main className="port-root">
          <div className="main-layout">
            <div className="port-guide-col">
              <OperationGuideCard {...PORTABILIDADE_GUIDE} />
            </div>
            <section>
              <section className="card flow">
                <div className="port-hero">
                  <div className="port-hero-kicker">
                    <span className="port-hero-dot" />
                    Proposta calculada para você
                  </div>
                  <div className="port-hero-num">
                    <span className="port-hero-prefix">{d.headlinePrefix}</span>
                    <strong>{d.headlineValue}</strong>
                    {d.headlineSuffix && <span className="port-hero-suffix">{d.headlineSuffix}</span>}
                  </div>
                  {mode === 'eco' && economiaMensal > 0 && (
                    <div className="port-hero-monthly">R$ {economiaMensal} estimados a mais no seu bolso por mês</div>
                  )}
                  <div className="port-hero-sub">{d.subhead}</div>
                </div>

                <p className="port-mode-label">Escolha sua estratégia</p>

                <div className="tabs">
                  <button
                    className={`tab ${mode === 'eco' ? 'active' : ''}`}
                    onClick={() => setMode('eco')}
                    onMouseEnter={() => setHoveredMode('eco')}
                    onMouseLeave={() => setHoveredMode((current) => (current === 'eco' ? null : current))}
                    style={getSelectableCardStyle({
                      selected: mode === 'eco',
                      hovered: hoveredMode === 'eco',
                      baseBackground: '#fff',
                    })}
                  >
                    <div className="port-eco-badge">Maior Economia</div>
                    <div className="strategy-icon" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
                    <strong>Quero Economizar</strong><span>Economizar no custo total</span>
                  </button>
                  <button
                    className={`tab ${mode === 'parc' ? 'active' : ''}`}
                    onClick={() => setMode('parc')}
                    onMouseEnter={() => setHoveredMode('parc')}
                    onMouseLeave={() => setHoveredMode((current) => (current === 'parc' ? null : current))}
                    style={getSelectableCardStyle({
                      selected: mode === 'parc',
                      hovered: hoveredMode === 'parc',
                      baseBackground: '#fff',
                    })}
                  >
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

                  <div className="no-credit-line">
                    Você não está pegando novo crédito — só pagando menos pelo mesmo contrato.
                  </div>

                  <section className="benefits">
                    <div className="benefit"><small>Margem livre depois</small><strong>até {d.margin}</strong></div>
                    <div className="benefit"><small>Crédito disponível após portabilidade</small><strong>até {d.credit}</strong></div>
                  </section>

                  {/* Details toggle */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      const currentScrollY = window.scrollY
                      setDetailsOpen((prev) => !prev)
                      requestAnimationFrame(() => { window.scrollTo({ top: currentScrollY, behavior: 'auto' }) })
                    }}
                    onMouseEnter={() => setDetailsHover(true)}
                    onMouseLeave={() => setDetailsHover(false)}
                    style={{
                      ...btnToggleShape,
                      width: '100%',
                      marginTop: 20,
                      marginBottom: detailsOpen ? 10 : 14,
                      ...getSelectableCardStyle({
                        selected: detailsOpen,
                        hovered: detailsHover,
                        baseBackground: 'radial-gradient(circle at 92% 8%, rgba(4,59,139,.08), transparent 34%), linear-gradient(180deg, #F4FBFF 0%, #FFFFFF 100%)',
                      }),
                    }}
                  >
                    {detailsOpen ? 'Fechar detalhes' : mode === 'eco' ? 'Ver economia por contrato' : 'Ver alívio por contrato'}
                  </button>

                  {detailsOpen ? (
                    <div className="receipt-wrap details-panel">
                      <div className="compact-contract-list" style={{ marginTop: 0 }}>
                        {portContracts.map((item) => (
                          <article key={item.code} className="compact-refin-card">
                            <header className="compact-header">
                              <div>
                                <small>Portabilidade</small>
                                <h3>{item.bankName}</h3>
                              </div>
                            </header>
                            <section className={`money-highlight ${mode === 'eco' ? 'total' : 'monthly'}`}>
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
                    <button className="cta consigai-cta-animated" onClick={handleGoContratacao}>{mode === 'eco' ? 'Quero economizar com esta proposta' : 'Quero reduzir minha parcela'}</button>
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
                          borderRadius: 13,
                          border: 0,
                          background: 'linear-gradient(145deg, #043B8B, #002D6E)',
                          color: '#fff',
                          fontSize: 13,
                          fontWeight: 900,
                          cursor: 'pointer',
                          boxShadow: '0 8px 20px rgba(4,59,139,.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        Baixar recibo da simulação
                      </button>
                    ) : null}
                    <p className="port-review-note">Você ainda vai revisar tudo antes de confirmar</p>
                    <p className="safe">Valores estimados. Sujeitos à análise e aprovação de crédito.</p>
                    <button className="back-btn consigai-cta-animated" onClick={() => navigate('/ofertas')}>Voltar para ofertas</button>
                  </div>
                </article>
              </section>
            </section>

            <aside className="sidebar" style={{ display: 'grid', gap: 20, alignContent: 'start' }}>
              <ResumoCard
                title="Resumo da proposta"
                subtitle="Confira as principais condições simuladas antes de continuar."
                highlight={{ label: 'Oferta selecionada', value: mode === 'eco' ? 'Economia inteligente' : 'Parcela menor' }}
                rows={[
                  { label: 'Estratégia', value: mode === 'eco' ? 'Economia inteligente' : 'Parcela menor' },
                  { label: 'Parcela nova total', value: d.newInstallment },
                  { label: 'Benefício estimado', value: benefit },
                  { label: 'Margem livre', value: `até ${d.margin}` },
                  { label: 'Crédito disponível após portabilidade', value: `até ${d.credit}` },
                ]}
              />
              <ImpactoCard
                liquidoAntes={liquidoAntes}
                liquidoDepois={liquidoDepois}
                novaParcela={d.newInstallment}
                novaParcelaLabel="Nova parcela total"
              />
            </aside>
          </div>
          <div style={{ marginTop: 20 }}>
            <ControleCard horizontal />
          </div>
        </main>
      </div>
    </>
  )
}
