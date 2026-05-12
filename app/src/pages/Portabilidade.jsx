import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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
import { btnToggleShape, btnCompactPrimary } from '../ui/buttonStyles'

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------
function track(event, props = {}) {
  try {
    if (import.meta.env.DEV) console.log('[consigai:track]', event, props)
    if (typeof window.gtag === 'function') window.gtag('event', event, props)
    if (typeof window.analytics?.track === 'function') window.analytics.track(event, props)
    window.dispatchEvent(new CustomEvent('consigai:track', { detail: { event, ...props } }))
  } catch { /* silencioso em produção */ }
}

// Lê variante de A/B test do localStorage — pronto para experimentos futuros
// Escrever: localStorage.setItem('consigai_ab_portabilidade_hero', 'monthly')
// eslint-disable-next-line no-unused-vars
function getAbVariant(testName, defaultVariant = 'control') {
  try { return localStorage.getItem(`consigai_ab_${testName}`) || defaultVariant } catch { return defaultVariant }
}

// ---------------------------------------------------------------------------
// Guide card — objeções respondidas dentro dos passos e badges
// ---------------------------------------------------------------------------
const PORTABILIDADE_GUIDE = {
  badge: 'Guia ConsigAI',
  title: 'Como funciona a portabilidade',
  subtitle: 'Você move seu contrato para um banco com taxa menor. Mesma dívida. Condição melhor. É um direito seu garantido por lei.',
  steps: [
    {
      label: 'Passo 1',
      title: 'Veja a diferença',
      body: 'Compare sua parcela atual com a condição que encontramos para você. Sem nenhum custo nesta etapa.',
    },
    {
      label: 'Passo 2',
      title: 'Calcule seu ganho',
      body: 'Veja quanto pode sobrar no bolso por mês e no total. Você não precisa falar com o banco antigo — a ConsigAI cuida disso.',
    },
    {
      label: 'Passo 3',
      title: 'Decida com calma',
      body: 'Confirme apenas se fizer sentido. Você pode desistir a qualquer momento antes de confirmar. Nada avança sem você.',
    },
    {
      label: 'Passo 4',
      title: 'Acompanhe tudo',
      body: 'A ConsigAI conduz todo o processo. Em média 5 a 10 dias úteis após sua confirmação. Você recebe atualização em cada etapa.',
    },
  ],
  finalTitle: 'Você está no controle',
  finalText: 'Portabilidade é direito garantido por lei. Seu banco atual não pode bloquear. Seu benefício não muda. Nenhuma contratação acontece sem sua confirmação expressa.',
  badges: [
    'Seu benefício não muda',
    'Sem novo crédito — mesma dívida, condição melhor',
    'Direito garantido por lei',
    'Regulado pelo Banco Central',
    'Dados protegidos conforme LGPD',
    'Simulação sem compromisso',
  ],
}

// ---------------------------------------------------------------------------
// Receipt data
// ---------------------------------------------------------------------------
const RECEIPT_DATA = {
  eco: {
    heroValue: 'R$ 2.399',
    heroSuffix: null,
    heroLabel: 'SEM AUMENTAR O PRAZO · ESTIMATIVA',
    tableHeader: 'Economia',
    rows: [
      ['0056347710', 'FACTA → Banrisul', 'R$ 779,14'],
      ['0123472010087', 'Bradesco → Banrisul', 'R$ 550,93'],
      ['0056346924', 'FACTA → Banrisul', 'R$ 365,63'],
      ['0057628452', 'FACTA → Banrisul', 'R$ 167,50'],
      ['622921912', 'Itaú Consig. → Banrisul', 'R$ 0,30'],
    ],
    totalLabel: 'Economia Total Estimada',
    totalValue: 'R$ 1.863,50',
  },
  parc: {
    heroValue: 'R$ 117',
    heroSuffix: '/mês',
    heroLabel: 'ALÍVIO MENSAL ESTIMADO',
    tableHeader: 'Alívio/mês',
    rows: [
      ['0123472010087', 'Bradesco → Banrisul', 'R$ 25,86'],
      ['0056347710', 'FACTA → Banrisul', 'R$ 24,85'],
      ['0056346924', 'FACTA → Banrisul', 'R$ 12,13'],
      ['0057628452', 'FACTA → Banrisul', 'R$ 7,95'],
    ],
    totalLabel: 'Alívio Estimado por Mês',
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

// Taxa representativa para exibição no card principal (pior caso → nova taxa)
const TAXA_REF = {
  antes: '2,09% a.m.',
  depois: '1,88% a.m.',
  prazo: '84x',
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

// ---------------------------------------------------------------------------
// Tab icons — SVG, mostra conceito visual de cada estratégia
// ---------------------------------------------------------------------------
function EcoTabIcon({ active }) {
  return (
    <svg width="42" height="28" viewBox="0 0 42 28" fill="none" aria-hidden="true" style={{ display: 'block' }}>
      {/* Barra antes — cinza, alta */}
      <rect x="0" y="4" width="9" height="23" rx="3" fill="#94A3B8" opacity="0.32" />
      {/* Barra meio — verde médio quando active = caminho da economia */}
      <rect x="11" y="10" width="9" height="17" rx="3" fill="var(--green-strong)" opacity={active ? 0.55 : 0.30} />
      {/* Barra depois — verde forte, menor = economia */}
      <rect x="22" y="15" width="9" height="12" rx="3" fill="var(--green-strong)" opacity={active ? 0.95 : 0.65} />
      {/* Badge verde com + = ganho */}
      <circle cx="37" cy="7" r="4.5" fill="var(--green-strong)" opacity={active ? 1 : 0.75} />
      <path d="M35.2 7 L38.8 7 M37 5.2 L37 8.8" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function ParcTabIcon({ active }) {
  const stroke = active ? 'var(--blue-interactive)' : '#94A3B8'
  return (
    <svg width="34" height="30" viewBox="0 0 34 30" fill="none" aria-hidden="true" style={{ display: 'block' }}>
      {/* Calendário — mensal */}
      <rect x="2" y="5" width="22" height="20" rx="3" fill={active ? 'rgba(36,84,214,.07)' : 'none'} stroke={stroke} strokeWidth="1.5" opacity={active ? 1 : 0.5} />
      <line x1="2" y1="11" x2="24" y2="11" stroke={stroke} strokeWidth="1.5" opacity={active ? 1 : 0.5} />
      <line x1="7" y1="2" x2="7" y2="7" stroke={stroke} strokeWidth="2" strokeLinecap="round" opacity={active ? 1 : 0.6} />
      <line x1="19" y1="2" x2="19" y2="7" stroke={stroke} strokeWidth="2" strokeLinecap="round" opacity={active ? 1 : 0.6} />
      {/* Seta para baixo = parcela reduzindo — azul no active */}
      <path d="M13 15 L13 22 M10 19.5 L13 22 L16 19.5" stroke={active ? 'var(--blue-interactive)' : 'var(--green-strong)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity={active ? 1 : 0.7} />
      {/* Badge azul com − = alívio mensal */}
      <circle cx="29" cy="23" r="4.5" fill={active ? 'var(--blue-interactive)' : '#94A3B8'} opacity={active ? 1 : 0.75} />
      <path d="M27.2 23 L30.8 23" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------
export default function Portabilidade() {
  const navigate = useNavigate()
  const location = useLocation()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const profile = loadProfileData()
  const clientName = profile.nomeExibicao || profile.nomeCompleto || 'Cliente'

  const initialMode = location.state?.initialMode === 'parc' ? 'parc' : 'eco'
  const [mode, setMode] = useState(initialMode)
  const [hoveredMode, setHoveredMode] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [detailsHover, setDetailsHover] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)
  const [primaryCtaVisible, setPrimaryCtaVisible] = useState(false)
  const primaryCtaRef = useRef(null)
  const pageLoadTime = useRef(0)

  const d = stateData[mode]
  const portContracts = getPortContracts(mode, d.newInstallment)

  const salarioBase = 2200
  const parcelaAntes = 550

  // Economia mensal calculada separadamente por modo — tabs sempre mostram o número correto
  const ecoMensal = Math.max(0, Math.round(parcelaAntes - parseMoney(stateData.eco.newInstallment)))
  const parcMensal = Math.max(0, Math.round(parcelaAntes - parseMoney(stateData.parc.newInstallment)))
  const parcelaDepois = parseMoney(d.newInstallment)
  const liquidoAntes = salarioBase - parcelaAntes
  const liquidoDepois = salarioBase - parcelaDepois
  const benefit = `${d.headlineValue}${d.headlineSuffix ? ` ${d.headlineSuffix}` : ''}`
  const ctaBar = {
    name: mode === 'eco' ? 'Menos custo total' : 'Parcela Menor',
    sub: mode === 'eco' ? 'Economia estimada no contrato' : 'Alívio mensal estimado',
    saving: mode === 'eco' ? benefit : `R$ ${parcMensal}/mês`,
    savingLabel: mode === 'eco' ? 'de economia no contrato' : 'de alívio mensal',
    actionLabel: mode === 'eco' ? 'Quero economizar' : 'Quero reduzir minha parcela',
  }

  useEffect(() => {
    pageLoadTime.current = Date.now()
    track('view_portabilidade', { mode: 'eco' })
  }, [])

  useEffect(() => {
    const node = primaryCtaRef.current
    if (!node || typeof IntersectionObserver === 'undefined') return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        setPrimaryCtaVisible(entry.isIntersecting)
      },
      { threshold: 0.25 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [mode])

  const handleModeSwitch = (newMode) => {
    track(newMode === 'eco' ? 'click_strategy_eco' : 'click_strategy_parc', { from: mode })
    if (newMode !== mode) track('switch_mode_portabilidade', { from: mode, to: newMode })
    setMode(newMode)
  }

  const handleGoContratacao = () => {
    track('click_continue_portabilidade', { mode, benefit, time_to_click_ms: Date.now() - pageLoadTime.current })
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
            { label: 'Estratégia', value: mode === 'eco' ? 'Menos custo total' : 'Parcela Menor' },
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
        { label: 'Estratégia', value: mode === 'eco' ? 'Menos custo total' : 'Parcela Menor' },
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
          --green-border:#BDECD7;
          --muted:#64748B;
          --line:#DDE8F6;
        }
        .port-root{max-width:1400px;margin:0 auto;padding:26px 24px 48px}
        .main-layout{display:grid;grid-template-columns:260px minmax(0,1fr) 320px;gap:28px}
        .port-guide-col{}
        .card{border:1px solid var(--line);border-radius:28px;background:#fff;box-shadow:0 16px 38px rgba(3,36,111,.075)}
        .flow{padding:22px;border-radius:34px;position:relative;overflow:hidden;background:radial-gradient(ellipse at 5% 0%,rgba(4,59,139,.05),transparent 40%),linear-gradient(160deg,#f0f7ff 0%,#fff 65%);box-shadow:0 22px 52px rgba(3,36,111,.11)}
        .flow:before{content:'';position:absolute;inset:0 0 auto 0;height:5px;background:linear-gradient(90deg,var(--blue-main),var(--blue-interactive),var(--green-strong))}
        .flow > *{position:relative;z-index:1}
        .tabs{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}
        .tab{min-height:108px;padding:16px 18px;border-radius:21px;border:1px solid var(--line);background:linear-gradient(160deg,#f6faff 0%,#fff 80%);text-align:center;display:grid;place-items:center;gap:4px;cursor:pointer;position:relative;overflow:hidden;box-shadow:0 8px 24px rgba(3,36,111,.06);transition:box-shadow .18s ease,border-color .18s ease,transform .18s ease,background .18s ease}
        .tab:before{display:none}
        .tab strong{font-size:15px;font-weight:900;color:var(--blue-dark)}
        .tab-monthly{font-size:13px;font-weight:800;color:var(--green-strong);letter-spacing:-.01em}
        .tab-monthly-parc{font-size:13px;font-weight:800;color:var(--blue-interactive);letter-spacing:-.01em}
        .tab-sub{font-size:10px;color:var(--muted);font-weight:600}
        .tab.active{}
        .tab-eco.active strong{color:var(--green)}
        .tab-eco.active .tab-monthly{color:var(--green-strong)}
        .tab-parc.active strong{color:var(--blue-main)}
        .tab-parc.active .tab-monthly-parc{color:var(--blue-interactive)}
        .tab.active strong{color:var(--blue-main)}
        .tab.active .port-eco-badge{background:linear-gradient(135deg,#CFF9E6,#EAFDF4);border-color:var(--green-border);box-shadow:0 6px 16px rgba(0,168,107,.12)}
        .tab.active .port-parc-badge{background:linear-gradient(135deg,#DDEBFF,#EEF4FF);border-color:var(--blue-line);box-shadow:0 6px 16px rgba(36,84,214,.12)}
        .offer{padding:22px;background:#fff}
        .compare{display:grid;grid-template-columns:1fr 56px 1fr;gap:12px;align-items:center;padding:16px;border-radius:21px;border:1px solid var(--blue-line);background:linear-gradient(180deg,#eef5ff,#fff);box-shadow:0 8px 22px rgba(3,36,111,.07)}
        .pbox{padding:14px;border-radius:13px;border:1px solid #E2E8F0;background:rgba(248,250,252,.9)}
        .pbox small{display:block;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}
        .pbox strong{display:block;margin-top:6px;font-size:24px;font-weight:800;letter-spacing:-.06em}
        .old strong{color:#94A3B8;text-decoration:line-through;text-decoration-color:#CBD5E1;text-decoration-thickness:2px}
        .new{background:linear-gradient(135deg,var(--green-soft),#e8fff4);border-color:var(--green-line)}
        .new strong{color:var(--green-strong)}
        .arrow{width:38px;height:38px;border-radius:999px;display:grid;place-items:center;background:var(--blue-interactive);color:#fff;font-size:18px;font-weight:900;box-shadow:0 10px 22px rgba(4,59,139,.22)}
        .compare-diff{grid-column:1/-1;margin-top:6px;padding:11px 18px;border-radius:13px;background:linear-gradient(135deg,#e8fff4,var(--green-soft));border:1.5px solid var(--green-line);border-left:4px solid var(--green-strong);display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;box-shadow:0 4px 12px rgba(0,122,82,.07)}
        .compare-diff strong{color:var(--green-strong);font-size:16px;font-weight:900;letter-spacing:-.02em}
        .compare-diff small{color:var(--muted);font-size:10px;font-weight:600}
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
        .contracts-row{margin-top:16px;padding-top:14px;border-top:1px solid var(--line)}
        .contracts-row small{display:block;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:8px}
        .contracts-bottom{display:flex;justify-content:space-between;align-items:center;gap:12px}
        .contracts-tags{display:flex;flex-wrap:wrap;gap:8px}
        .contracts-tag{padding:7px 12px;border-radius:999px;background:var(--blue-soft);border:1px solid var(--line);color:var(--blue-main);font-size:11px;font-weight:800}
        .details-btn{flex:0 0 auto;min-height:44px;padding:0 16px;border-radius:13px;border:1px solid var(--blue-line);background:#fff;color:var(--blue-main);font-size:12px;font-weight:900;cursor:pointer;white-space:nowrap}
        .actions{margin-top:20px;padding-top:16px;border-top:1px solid var(--line)}
        .actions > button + button{margin-top:12px}
        .cta{width:100%;min-height:52px;border:0;border-radius:13px;padding:0 22px;background:linear-gradient(145deg,var(--blue-main),var(--blue-dark));color:#fff;font-size:16px;font-weight:900;letter-spacing:-.01em;cursor:pointer;box-shadow:0 14px 32px rgba(4,59,139,.22);display:flex;align-items:center;justify-content:center}
        .secondary{width:100%;min-height:48px;border-radius:13px;padding:0 22px;border:1px solid var(--blue-line);background:#fff;color:var(--blue-main);font-size:15px;font-weight:900;cursor:pointer;display:flex;align-items:center;justify-content:center}
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
        .compare-value.after{color:var(--green)}
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
        .back-btn{margin-top:10px;width:100%;min-height:46px;border-radius:13px;padding:0 18px;border:1px solid var(--blue-line);background:#fff;color:var(--blue-main);font-size:14px;font-weight:900;cursor:pointer;box-shadow:0 8px 20px rgba(4,59,139,.12);display:flex;align-items:center;justify-content:center}
        .no-credit-line{margin-top:14px;padding:13px 18px;border-radius:13px;background:linear-gradient(135deg,#E8F0FF,#EEF5FF);border:1.5px solid var(--blue-line);color:var(--blue-main);font-size:13px;font-weight:800;line-height:1.45;text-align:center;letter-spacing:-.01em;box-shadow:0 4px 14px rgba(4,59,139,.08)}
        .port-hero{margin-bottom:20px;padding:26px 22px 22px;border-radius:21px;position:relative;overflow:hidden;text-align:center;box-shadow:0 12px 32px rgba(3,36,111,.11);transition:background .3s ease,border-color .3s ease}
        .port-hero::before{content:'';position:absolute;inset:0 0 auto 0;height:5px;transition:background .3s ease}
        /* Hero eco — verde como cor da economia */
        .port-hero.hero-eco{background:radial-gradient(ellipse at 16% 0%,rgba(0,122,82,.13),transparent 34%),radial-gradient(ellipse at 90% 8%,rgba(0,168,107,.20),transparent 42%),radial-gradient(ellipse at 50% 40%,rgba(36,84,214,.06),transparent 46%),linear-gradient(160deg,#E8FFF4 0%,#FFFFFF 54%,#F2FFF9 100%);border:1.5px solid var(--green-line)}
        .port-hero.hero-eco::before{background:linear-gradient(90deg,var(--green),var(--green-strong),#00D68A,var(--blue-interactive))}
        /* Hero parc — azul como cor do controle/alívio */
        .port-hero.hero-parc{background:radial-gradient(ellipse at 16% 0%,rgba(36,84,214,.22),transparent 34%),radial-gradient(ellipse at 90% 8%,rgba(4,59,139,.16),transparent 42%),radial-gradient(ellipse at 50% 40%,rgba(0,231,255,.10),transparent 46%),linear-gradient(160deg,#EAF0FF 0%,#FFFFFF 54%,#EEF4FF 100%);border:1.5px solid var(--blue-line)}
        .port-hero.hero-parc::before{background:linear-gradient(90deg,var(--blue-main),var(--blue-interactive),#00E7FF)}
        .port-hero.hero-parc .port-hero-num strong{color:var(--blue-interactive);text-shadow:0 2px 24px rgba(36,84,214,.28)}
        .port-hero.hero-parc .port-hero-suffix{color:var(--blue-interactive)}
        .port-hero.hero-parc .port-hero-kicker{color:var(--blue-main)}
        .port-hero.hero-parc .port-hero-dot{background:var(--blue-interactive);box-shadow:0 0 9px rgba(36,84,214,.8);animation:heroGlowBlue 2s ease-in-out infinite}
        .port-hero.hero-parc .port-hero-label{color:var(--blue-main)}
        .port-hero.hero-parc .port-hero-proof{border-color:var(--blue-line);background:linear-gradient(135deg,#DDEBFF,#EEF4FF)}
        .port-hero.hero-parc .port-hero-proof strong{color:var(--blue-interactive)}
        @keyframes heroGlowBlue{0%,100%{box-shadow:0 0 9px rgba(36,84,214,.8)}50%{box-shadow:0 0 18px rgba(36,84,214,1),0 0 32px rgba(36,84,214,.4)}}
        .port-hero-kicker{display:inline-flex;align-items:center;gap:7px;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.1em;color:var(--blue-main);margin-bottom:14px;justify-content:center}
        .port-hero-dot{width:7px;height:7px;border-radius:50%;background:var(--green-strong);box-shadow:0 0 9px rgba(0,168,107,.8);flex-shrink:0;animation:heroGlow 2s ease-in-out infinite}
        @keyframes heroGlow{0%,100%{box-shadow:0 0 9px rgba(0,168,107,.8)}50%{box-shadow:0 0 18px rgba(0,168,107,1),0 0 32px rgba(0,168,107,.4)}}
        .port-hero-num{display:flex;align-items:baseline;gap:8px;justify-content:center;flex-wrap:wrap;line-height:1}
        .port-hero-num strong{font-size:58px;font-weight:900;letter-spacing:-.08em;color:var(--green-strong);line-height:.95;text-shadow:0 2px 24px rgba(0,168,107,.32)}
        .port-hero-suffix{font-size:22px;font-weight:800;color:var(--green-strong);align-self:flex-end;padding-bottom:6px}
        .port-hero-label{margin-top:8px;font-size:13px;font-weight:800;color:var(--blue-main);letter-spacing:-.01em}
        .port-hero-proof{display:inline-block;margin-top:12px;padding:9px 18px;border-radius:999px;background:linear-gradient(135deg,#DDEBFF,#E8FFF4);border:1px solid var(--green-line);font-size:13px;font-weight:800;color:var(--blue-main);box-shadow:0 4px 14px rgba(0,122,82,.10)}
        .port-hero-proof strong{color:var(--green-strong);font-weight:900}
        .port-hero-sub{margin-top:10px;font-size:11px;font-weight:700;color:var(--muted)}
        .port-mode-label{font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);text-align:center;margin-bottom:14px}
        .port-eco-badge{display:inline-flex;align-items:center;padding:4px 11px;border-radius:999px;background:linear-gradient(135deg,#d6ffec,#e8fff4);border:1px solid var(--green-line);color:var(--green);font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.07em;margin-bottom:4px;box-shadow:0 2px 8px rgba(0,122,82,.10)}
        .port-parc-badge{display:inline-flex;align-items:center;padding:4px 11px;border-radius:999px;background:linear-gradient(135deg,#ddeeff,#EEF4FF);border:1px solid var(--blue-line);color:var(--blue-interactive);font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.07em;margin-bottom:4px;box-shadow:0 2px 8px rgba(36,84,214,.10)}
        .taxa-proof{margin-top:16px;display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:stretch}
        .taxa-box{padding:11px 14px;border-radius:14px;border:1px solid #E2E8F0;background:#F8FAFC}
        .taxa-box small{display:block;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}
        .taxa-box strong{display:block;margin-top:5px;font-size:15px;font-weight:800;letter-spacing:-.02em;color:#94A3B8}
        .taxa-box.depois{background:linear-gradient(135deg,var(--green-soft),#edfff5);border-color:var(--green-line)}
        .taxa-box.depois strong{color:var(--green-strong)}
        .taxa-arrow{width:30px;height:30px;border-radius:50%;background:var(--blue-interactive);color:#fff;display:grid;place-items:center;font-size:14px;font-weight:900;box-shadow:0 6px 16px rgba(4,59,139,.20);flex-shrink:0;justify-self:center;align-self:center}
        .prazo-badge{margin-top:10px;padding:9px 16px;border-radius:13px;background:linear-gradient(135deg,#EEF4FF,#F4F9FF);border:1px solid var(--blue-interactive);display:flex;align-items:center;justify-content:center;gap:8px;font-size:12px;font-weight:800;color:var(--blue-main);box-shadow:0 4px 14px rgba(4,59,139,.09)}
        .prazo-badge span{color:var(--muted);font-weight:600;font-size:11px}
        .port-review-note{margin-top:10px;text-align:center;font-size:12px;font-weight:800;color:var(--blue-main)}
        .guide-inline{display:none}
        .guide-inline-btn{width:100%;display:flex;justify-content:space-between;align-items:center;padding:13px 16px;border-radius:16px;border:1px solid rgba(255,255,255,.18);background:linear-gradient(145deg,rgba(255,255,255,.12),rgba(255,255,255,.06));color:#fff;font-size:13px;font-weight:900;cursor:pointer;text-align:left;gap:10px;letter-spacing:-.01em}
        .guide-inline-btn:hover{background:rgba(255,255,255,.16)}
        .guide-inline-chevron{flex-shrink:0;font-size:11px;opacity:.8;transition:transform .2s ease}
        .guide-inline-chevron.open{transform:rotate(180deg)}
        .guide-inline-badges{display:flex;flex-wrap:wrap;gap:8px;padding:12px 0 0}
        .guide-inline-badge{padding:5px 12px;border-radius:999px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.18);color:rgba(255,255,255,.9);font-size:11px;font-weight:700}
        .guide-inline-steps{display:grid;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,.12)}
        .guide-inline-step{display:flex;gap:10px;align-items:flex-start}
        .guide-inline-num{flex-shrink:0;width:22px;height:22px;border-radius:50%;background:rgba(255,255,255,.18);color:#00E7FF;display:grid;place-items:center;font-size:10px;font-weight:900}
        .guide-inline-body{font-size:11.5px;color:rgba(255,255,255,.75);font-weight:650;line-height:1.35}
        .guide-inline-body strong{display:block;color:#fff;font-weight:900;font-size:12px;margin-bottom:1px}
        .guide-inline-final{margin-top:10px;padding:11px 14px;border-radius:14px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.75);font-size:11.5px;line-height:1.35}
        .guide-inline-final strong{display:block;color:#fff;font-weight:900;margin-bottom:4px}
        @media (max-width:1200px){.main-layout{grid-template-columns:minmax(0,1fr) 320px}.port-guide-col{display:none}.guide-inline{display:block;margin-bottom:20px;padding:16px;border-radius:20px;background:radial-gradient(circle at 88% 10%,rgba(0,231,255,.18),transparent 34%),linear-gradient(160deg,#03246F 0%,#071B45 55%,#002D6E 100%);border:1px solid rgba(255,255,255,.08);box-shadow:0 16px 40px rgba(3,36,111,.18)}}
        @media (max-width:1100px){.main-layout{grid-template-columns:1fr}.port-guide-col{display:none}.sidebar{display:grid;grid-template-columns:1fr 1fr;gap:16px}.side-card + .side-card{margin-top:0}}
        @media (max-width:900px){.port-root{padding:16px}.tabs,.compare,.sidebar{grid-template-columns:1fr}.taxa-proof{grid-template-columns:1fr auto 1fr}.arrow{transform:rotate(90deg);justify-self:center}.compare-head,.compare-line{grid-template-columns:1fr;gap:6px}.compare-head span:first-child{display:none}.contracts-bottom{flex-direction:column;align-items:stretch}.details-btn{width:100%}.details-panel{max-height:min(420px,62vh)}}
        @media (max-width:600px){.taxa-proof{grid-template-columns:1fr;gap:6px}.taxa-arrow{transform:rotate(90deg);width:24px;height:24px;font-size:11px}}
      `}</style>

      <div style={appPageStyle}>
        {isDesktop ? (
          <DesktopPageHeader
            clientName={clientName}
            pageTitle="Portabilidade"
            pageDescription="Compare, veja quanto pode pagar a menos e decida antes de confirmar."
            onLogoClick={() => navigate('/ofertas')}
            actions={[{ label: 'Ofertas', onClick: () => navigate('/ofertas') }, { label: 'Configurações', onClick: () => navigate('/configuracoes') }, { label: 'Acompanhamento', onClick: () => navigate('/acompanhamento') }]}
          />
        ) : (
          <MobilePageHeader
            clientName={clientName}
            chipLabel="Portabilidade"
            title="Pague menos pelo mesmo contrato"
            subtitle="Compare com calma. Nada é contratado sem sua confirmação."
            onLogoClick={() => navigate('/ofertas')}
            actions={[{ label: 'Ofertas', onClick: () => navigate('/ofertas') }, { label: 'Configurações', onClick: () => navigate('/configuracoes') }, { label: 'Acompanhamento', onClick: () => navigate('/acompanhamento') }]}
          />
        )}

        <main className="port-root" style={{ paddingBottom: isDesktop ? '118px' : '172px' }}>
          <div className="main-layout">

            {/* Coluna esquerda — guia educacional + objeções */}
            <div className="port-guide-col">
              <OperationGuideCard {...PORTABILIDADE_GUIDE} />
            </div>

            {/* Coluna central — card principal */}
            <section>
              <section className="card flow">

                {/* Guia inline — visível só quando coluna esquerda some (<1200px) */}
                <div className="guide-inline">
                  <button
                    className="guide-inline-btn"
                    onClick={() => {
                      const opening = !guideOpen
                      setGuideOpen((v) => !v)
                      if (opening) track('open_guide_inline', { mode })
                    }}
                    aria-expanded={guideOpen}
                  >
                    <span>Guia ConsigAI — como funciona a portabilidade</span>
                    <span className={`guide-inline-chevron${guideOpen ? ' open' : ''}`}>▼</span>
                  </button>
                  <div className="guide-inline-badges">
                    {PORTABILIDADE_GUIDE.badges.map((b) => (
                      <span key={b} className="guide-inline-badge">{b}</span>
                    ))}
                  </div>
                  {guideOpen && (
                    <>
                      <div className="guide-inline-steps">
                        {PORTABILIDADE_GUIDE.steps.map((s, i) => (
                          <div key={i} className="guide-inline-step">
                            <div className="guide-inline-num">{i + 1}</div>
                            <div className="guide-inline-body">
                              <strong>{s.title}</strong>
                              {s.body}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="guide-inline-final">
                        <strong>{PORTABILIDADE_GUIDE.finalTitle}</strong>
                        {PORTABILIDADE_GUIDE.finalText}
                      </div>
                    </>
                  )}
                </div>

                {/* Hero — muda cor conforme estratégia selecionada */}
                <div className={`port-hero hero-${mode}`}>
                  <div className="port-hero-kicker">
                    <span className="port-hero-dot" />
                    {mode === 'eco' ? 'Encontramos economia no seu contrato' : 'Encontramos alívio para a sua parcela'}
                  </div>

                  {mode === 'eco' ? (
                    <>
                      <div className="port-hero-num">
                        <strong>{stateData.eco.headlineValue}</strong>
                      </div>
                      <div className="port-hero-label">de economia estimada no contrato total</div>
                      {ecoMensal > 0 && (
                        <div className="port-hero-proof">
                          <strong>R$ {ecoMensal}/mês</strong> a menos · mesmo prazo · sem novo crédito
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="port-hero-num">
                        <strong>{d.headlineValue}</strong>
                        {d.headlineSuffix && <span className="port-hero-suffix">{d.headlineSuffix}</span>}
                      </div>
                      <div className="port-hero-label">{d.eyebrow}</div>
                      {parcMensal > 0 && (
                        <div className="port-hero-proof">
                          <strong>R$ {parcMensal * 12} estimado em 12 meses</strong> · mais margem disponível
                        </div>
                      )}
                    </>
                  )}

                  <div className="port-hero-sub">{d.subhead}</div>
                </div>

                <p className="port-mode-label">Escolha sua estratégia</p>

                {/* Tabs — ícones novos, número mensal em cada tab */}
                <div className="tabs">
                  <button
                    className={`tab tab-eco ${mode === 'eco' ? 'active' : ''}`}
                    onClick={() => handleModeSwitch('eco')}
                    onMouseEnter={() => setHoveredMode('eco')}
                    onMouseLeave={() => setHoveredMode((c) => c === 'eco' ? null : c)}
                    style={{
                      ...getSelectableCardStyle({ selected: mode === 'eco', hovered: hoveredMode === 'eco', baseBackground: '#fff', selectedBackground: '#F2FFF9' }),
                      ...(mode === 'eco' ? {
                        borderColor: 'var(--green-strong)',
                        boxShadow: '0 0 0 3px rgba(0,168,107,.13), 0 8px 24px rgba(0,122,82,.09)',
                        background: 'linear-gradient(180deg,#EDFFF5 0%,#FFFFFF 62%,#F5FFF9 100%)',
                      } : {}),
                    }}
                  >
                    <div className="port-eco-badge">Menos custo total</div>
                    <EcoTabIcon active={mode === 'eco'} />
                    <strong>Menos custo total</strong>
                    <span className="tab-monthly">{stateData.eco.headlineValue} estimado</span>
                    <span className="tab-sub">no total · mesmo prazo</span>
                  </button>

                  <button
                    className={`tab tab-parc ${mode === 'parc' ? 'active' : ''}`}
                    onClick={() => handleModeSwitch('parc')}
                    onMouseEnter={() => setHoveredMode('parc')}
                    onMouseLeave={() => setHoveredMode((c) => c === 'parc' ? null : c)}
                    style={{
                      ...getSelectableCardStyle({ selected: mode === 'parc', hovered: hoveredMode === 'parc', baseBackground: '#fff', selectedBackground: '#EEF4FF' }),
                      ...(mode === 'parc' ? {
                        borderColor: 'var(--blue-interactive)',
                        boxShadow: '0 0 0 3px rgba(36,84,214,.14), 0 8px 24px rgba(4,59,139,.10)',
                        background: 'linear-gradient(180deg,#EEF4FF 0%,#FFFFFF 62%,#F4F8FF 100%)',
                      } : {}),
                    }}
                  >
                    <div className="port-parc-badge">Parcela Menor</div>
                    <ParcTabIcon active={mode === 'parc'} />
                    <strong>Parcela Menor</strong>
                    <span className="tab-monthly-parc">R$ {parcMensal}/mês estimado</span>
                    <span className="tab-sub">a menos todo mês · mais margem livre</span>
                  </button>
                </div>

                <article className="card offer">

                  {/* Comparativo antes/depois + linha de diferença */}
                  <section className="compare">
                    <div className="pbox old">
                      <small>Você paga hoje</small>
                      <strong>R$ 550</strong>
                    </div>
                    <div className="arrow"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                    <div className="pbox new">
                      <small>Você passaria a pagar</small>
                      <strong>{d.newInstallment}</strong>
                    </div>
                    {mode === 'eco' ? (
                      <div className="compare-diff">
                        <strong>= R$ {stateData.eco.headlineValue} de economia no total</strong>
                        <small>· mesmo prazo · estimativa</small>
                      </div>
                    ) : parcMensal > 0 ? (
                      <div className="compare-diff">
                        <strong>= R$ {parcMensal}/mês · R$ {parcMensal * 12}/ano estimado</strong>
                        <small>· mais margem disponível · estimativa</small>
                      </div>
                    ) : null}
                  </section>

                  {/* Diferenciador principal */}
                    <div className="no-credit-line">
                    {mode === 'eco'
                      ? 'Você não está pegando novo crédito — mesma dívida, condição melhor.'
                      : 'Parcela bem menor. Mais dinheiro sobrando todo mês. Sem novo crédito.'}
                  </div>


                  {/* Prova técnica — taxa e prazo */}
                  <div className="taxa-proof">
                    <div className="taxa-box antes">
                      <small>Taxa atual (referência)</small>
                      <strong>{TAXA_REF.antes}</strong>
                    </div>
                    <div className="taxa-arrow"><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                    <div className="taxa-box depois">
                      <small>Taxa nova estimada</small>
                      <strong>{TAXA_REF.depois}</strong>
                    </div>
                  </div>

                  {/* Detalhes por contrato */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      const scrollY = window.scrollY
                      const opening = !detailsOpen
                      setDetailsOpen((prev) => !prev)
                      if (opening) track('open_contract_details', { mode })
                      requestAnimationFrame(() => { window.scrollTo({ top: scrollY, behavior: 'auto' }) })
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
                      ...(detailsOpen ? {
                        borderColor: 'var(--blue-interactive)',
                        boxShadow: '0 0 0 3px rgba(36,84,214,.10), 0 8px 24px rgba(3,36,111,.06)',
                      } : {}),
                    }}
                  >
                    {detailsOpen ? 'Fechar detalhes' : mode === 'eco' ? 'Ver economia por contrato' : 'Ver Parcela Menor por contrato'}
                  </button>

                  {detailsOpen && (
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
                                <small>valor estimado · sujeito à análise</small>
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
                      <button className="secondary consigai-cta-animated" style={{ marginTop: 10 }} onClick={() => window.print()}>
                        Gerar recibo da simulação
                      </button>
                    </div>
                  )}

                  {/* Ações */}
                  <div className="actions">
                    <button ref={primaryCtaRef} className="cta consigai-cta-animated" onClick={handleGoContratacao}>
                      {mode === 'eco' ? 'Quero economizar' : 'Quero reduzir minha parcela'}
                    </button>

                    <button
                      className="secondary consigai-cta-animated"
                      onClick={() => {
                        const opening = !showReceipt
                        setShowReceipt((v) => !v)
                        if (opening) track('click_receipt', { mode })
                      }}
                    >
                      {mode === 'eco' ? 'Ver economia detalhada' : 'Ver simulação detalhada'}
                    </button>

                    {showReceipt && (
                      <div style={{ marginTop: 4, borderRadius: 16, border: '1px solid #DDE8F6', background: '#f7f9fe', padding: 10, display: 'flex', justifyContent: 'center' }}>
                        <div style={{ width: 300, borderRadius: 10, padding: '14px 12px 12px', border: '1px solid #ececec', color: '#4f4f4f', fontSize: 12, background: 'linear-gradient(180deg, rgba(255,255,255,.45), rgba(0,0,0,.02)), #f5f5f3' }}>
                          <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 800, color: '#444' }}>SIMULAÇÃO DE PORTABILIDADE — CONSIGAI</div>
                          <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
                          <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 800, color: '#4a4a4a' }}>ECONOMIA ESTIMADA</div>
                          <div style={{ textAlign: 'center', marginTop: 2, fontSize: 22, fontWeight: 900, color: '#232323', lineHeight: 1 }}>{benefit}</div>
                          <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
                          <div style={{ display: 'grid', gap: 6, fontSize: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Estratégia</span><strong>{mode === 'eco' ? 'Menos custo total' : 'Parcela Menor'}</strong></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Parcela nova</span><strong>{d.newInstallment}</strong></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Margem livre</span><strong>até {d.margin}</strong></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Crédito futuro</span><strong>até {d.credit}</strong></div>
                          </div>
                          <div style={{ borderTop: '1px dashed #cfcfcf', margin: '8px 0' }} />
                          <div style={{ textAlign: 'center', fontSize: 9, color: '#888' }}>Valores estimados. Sujeitos à análise e aprovação de crédito.</div>
                        </div>
                      </div>
                    )}

                    {showReceipt && (
                      <button
                        className="consigai-cta-animated"
                        onClick={() => { track('download_simulation', { mode }); downloadSimulationReceipt() }}
                        style={{ ...btnCompactPrimary, marginTop: 4 }}
                      >
                        Gerar recibo da simulação
                      </button>
                    )}

                    <p className="port-review-note">Você ainda vai revisar tudo antes de confirmar</p>
                    <p className="safe">Valores estimados. Sujeitos à análise e aprovação de crédito.</p>
                    <button
                      className="back-btn consigai-cta-animated"
                      onClick={() => { track('exit_to_ofertas'); navigate('/ofertas') }}
                    >
                      Voltar para ofertas
                    </button>
                  </div>
                </article>
              </section>
            </section>

            {/* Coluna direita — resumo (com margem/crédito) + impacto */}
            <aside className="sidebar" style={{ display: 'grid', gap: 20, alignContent: 'start' }}>
              <ResumoCard
                title="Resumo da simulação"
                subtitle="Condições simuladas. Confirme tudo antes de avançar."
                highlight={{ label: 'Estratégia selecionada', value: mode === 'eco' ? 'Menos custo total' : 'Parcela Menor' }}
                rows={[
                  { label: 'Parcela nova total', value: d.newInstallment },
                  { label: 'Benefício estimado', value: benefit },
                  { label: 'Margem livre após portabilidade', value: `até ${d.margin}` },
                  { label: 'Crédito disponível após portabilidade', value: `até ${d.credit}` },
                ]}
              />
              <ImpactoCard
                liquidoAntes={liquidoAntes}
                liquidoDepois={liquidoDepois}
                novaParcela={d.newInstallment}
                subtitle="Impacto estimado no seu mês."
              />
            </aside>
          </div>

          {/* ControleCard com items específicos de portabilidade */}
          <div style={{ marginTop: 20 }}>
            <ControleCard horizontal items={[
              ['Sem contratação automática', 'Você confirma cada passo. Nada avança sem sua autorização expressa.'],
              ['Seu benefício não muda', 'A portabilidade altera só a taxa e o banco. Seu benefício segue igual.'],
              ['Processo 100% cuidado pela ConsigAI', 'Você não precisa falar com o banco antigo. A ConsigAI conduz tudo.'],
            ]} />
          </div>
        </main>

        {!primaryCtaVisible && (
        <div style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
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
            gridTemplateColumns: isDesktop ? '320px 1px 180px 320px' : '1fr',
            columnGap: isDesktop ? 28 : 0,
            rowGap: 10,
            width: '100%',
            maxWidth: '100%',
            margin: '0 auto',
            justifyContent: 'center',
          }}>
            <div style={{
              width: '100%',
              maxWidth: isDesktop ? 320 : 'none',
              minWidth: 0,
              justifySelf: isDesktop ? 'end' : 'stretch',
              textAlign: isDesktop ? 'right' : 'left',
              minHeight: 36,
              paddingRight: isDesktop ? 8 : 0,
            }}>
              <div style={{
                fontSize: 12,
                fontWeight: 900,
                color: '#071B45',
                lineHeight: '16px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>{ctaBar.name}</div>
              {ctaBar.sub && <div style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#64748B',
                marginTop: 1,
                lineHeight: '15px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>{ctaBar.sub}</div>}
            </div>
            {isDesktop && <div style={{ width: 1, height: 36, background: '#DDE8F6', justifySelf: 'center' }} />}
            <div style={{
              width: isDesktop ? 180 : 136,
              minWidth: isDesktop ? 180 : 136,
              textAlign: 'left',
            }}>
              <div style={{
                width: isDesktop ? 180 : 152,
                minWidth: isDesktop ? 180 : 152,
                fontSize: 22,
                fontWeight: 900,
                color: mode === 'eco' ? 'var(--green)' : 'var(--blue-interactive)',
                letterSpacing: '-.02em',
                lineHeight: '25px',
                whiteSpace: 'nowrap',
                fontVariantNumeric: 'tabular-nums',
              }}>{ctaBar.saving}</div>
              <div style={{
                width: isDesktop ? 180 : 152,
                fontSize: 11,
                fontWeight: 600,
                color: '#64748B',
                lineHeight: '13px',
                whiteSpace: 'nowrap',
              }}>{ctaBar.savingLabel}</div>
            </div>
            <button
              type="button"
              className="cta consigai-cta-animated"
              onClick={handleGoContratacao}
              style={{
                gridColumn: isDesktop ? undefined : '1 / -1',
                width: isDesktop ? 320 : '100%',
                minWidth: isDesktop ? 320 : undefined,
                maxWidth: isDesktop ? 320 : undefined,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                gap: 10,
                marginTop: isDesktop ? 0 : 2,
              }}
            >
              {ctaBar.actionLabel}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
        )}
      </div>
    </>
  )
}
