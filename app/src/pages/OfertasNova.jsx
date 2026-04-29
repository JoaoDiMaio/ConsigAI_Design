import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const OFFER_CARD_CONFIG = [
  {
    id: 'equilibrio',
    kind: 'equilibrio',
    ctaName: 'Melhor Equilibrio',
    pill: 'Melhor Equilibrio',
    route: '/estrategia-combinada',
    state: { strategyType: 'novo contrato + economia' },
    note: 'Boa opcao para quem quer dinheiro na conta, parcela menor e prazo mantido.',
  },
  {
    id: 'folga',
    kind: 'folga',
    ctaName: 'Mais Folga por Mes',
    pill: 'Mais Folga por Mes',
    route: '/estrategia-combinada',
    state: { strategyType: 'refin + economia' },
    note: 'Boa opcao para quem quer aliviar o orcamento mensal sem receber um valor alto.',
  },
  {
    id: 'turbo',
    kind: 'turbo',
    ctaName: 'Turbo Economia',
    pill: 'Turbo Economia',
    route: '/portabilidade',
    note: 'Boa opcao para quem quer diminuir o impacto mensal no orcamento sem pegar dinheiro novo.',
  },
  {
    id: 'apenas_novo',
    kind: 'simples',
    ctaName: 'Novo Contrato',
    pill: 'Novo Contrato',
    route: '/novo-contrato',
    note: 'Oferta focada em liberar valor com menor complexidade.',
  },
  {
    id: 'apenas_refin',
    kind: 'simples',
    ctaName: 'Refinanciamento',
    pill: 'Refinanciamento',
    route: '/refinanciamento',
    note: 'Oferta direta para ajustar parcela e manter o fluxo mensal mais leve.',
  },
]
const MAX_API_CARDS = 3
const FORCED_VISIBLE_OFFER_IDS = ['equilibrio', 'turbo', 'apenas_refin']
const THIRD_CARD_SUB_OFFERS = {
  contract: { label: 'No contrato', route: '/portabilidade' },
  installment: { label: 'Na parcela', route: '/refinanciamento' },
}
const DADOS = {
  usuario: { salarioBruto: 2200, parcelaAtual: 550 },
  ofertas: [
    { id: 'equilibrio', creditoReceber: 5033.74, parcelaNova: 496.17, economiaTotal: 2399.11 },
    { id: 'folga', creditoReceber: 7593.9, parcelaNova: 433.19, reducaoMensal: 116.81 },
    { id: 'turbo', creditoReceber: 0, parcelaNova: 401.05, economiaContrato: 2960.4, economiaParcela: 148.95 },
    { id: 'apenas_novo', creditoReceber: 4200, parcelaNova: 522.4, economiaTotal: 1104 },
    { id: 'apenas_refin', creditoReceber: 2500, parcelaNova: 463.75, economiaTotal: 1896 },
  ],
  impacto: { pocketToday: 1650, pocketAfter: 1766.81, creditToday: 2845.53, creditAfter: 7593.9 },
}

const fmt = (v) => `R$\u00A0${Math.round(v).toLocaleString('pt-BR')}`
const PARCELA_HOJE = DADOS.usuario.parcelaAtual
const getEcoMensal = (offer) => {
  const parcelaNova = offer?.parcelaNova ?? (DADOS.usuario.parcelaAtual - (offer?.economiaParcela ?? offer?.reducaoMensal ?? 0))
  return Math.max(0, DADOS.usuario.parcelaAtual - parcelaNova)
}
const getParcelaNova = (offer) => {
  const o = offer ?? DADOS.ofertas[0]
  return fmt(o.parcelaNova ?? (DADOS.usuario.parcelaAtual - (o.economiaParcela ?? 0)))
}
const formatCurrencyClean = (value) => value.replace(/^[^0-9R$]*(?=R\$)/, '').trim()

export default function OfertasNova() {
  const navigate = useNavigate()
  const iframeRef = useRef(null)
  const selectedOfferIndexRef = useRef(0)
  const activeOffersRef = useRef([])
  const hasNoOfferRef = useRef(true)
  const attachedDocRef = useRef(null)
  const clickHandlerRef = useRef(null)
  const currencyObserverRef = useRef(null)
  const docQueryCacheRef = useRef({ doc: null, nodes: new Map(), lists: new Map() })
  const selectedThirdSubOfferRef = useRef('contract')

  useEffect(() => {
    let intervalId = null
    let normalizationTimer = null
    let skipObserverUntil = 0

    const formatCurrency = (value) => `R$ ${Math.round(value).toLocaleString('pt-BR')}`
    const MOJIBAKE_REPLACEMENTS = [
      ['Ã¡', 'á'], ['Ã ', 'à'], ['Ã¢', 'â'], ['Ã£', 'ã'], ['Ã¤', 'ä'],
      ['Ã©', 'é'], ['Ã¨', 'è'], ['Ãª', 'ê'], ['Ã«', 'ë'],
      ['Ã­', 'í'], ['Ã¬', 'ì'], ['Ã®', 'î'], ['Ã¯', 'ï'],
      ['Ã³', 'ó'], ['Ã²', 'ò'], ['Ã´', 'ô'], ['Ãµ', 'õ'], ['Ã¶', 'ö'],
      ['Ãº', 'ú'], ['Ã¹', 'ù'], ['Ã»', 'û'], ['Ã¼', 'ü'],
      ['Ã§', 'ç'], ['Ã‘', 'Ñ'], ['Ã±', 'ñ'],
      ['Ã', 'Á'], ['Ã€', 'À'], ['Ã‚', 'Â'], ['Ãƒ', 'Ã'], ['Ã„', 'Ä'],
      ['Ã‰', 'É'], ['Ãˆ', 'È'], ['ÃŠ', 'Ê'], ['Ã‹', 'Ë'],
      ['Ã', 'Í'], ['ÃŒ', 'Ì'], ['ÃŽ', 'Î'], ['Ã', 'Ï'],
      ['Ã“', 'Ó'], ['Ã’', 'Ò'], ['Ã”', 'Ô'], ['Ã•', 'Õ'], ['Ã–', 'Ö'],
      ['Ãš', 'Ú'], ['Ã™', 'Ù'], ['Ã›', 'Û'], ['Ãœ', 'Ü'],
      ['Ã‡', 'Ç'],
      ['Â ', '\u00A0'], ['Â°', '°'],
      ['â€“', '–'], ['â€”', '—'], ['â€˜', '‘'], ['â€™', '’'], ['â€œ', '“'], ['â€', '”'],
      ['â€¦', '…'], ['â€¢', '•'], ['â†’', '→'], ['âˆ’', '−'], ['â‰ˆ', '≈'], ['â˜…', '★'],
    ]
    const normalizeMojibakeText = (text) => {
      if (!text) return text
      let fixed = text
      MOJIBAKE_REPLACEMENTS.forEach(([broken, good]) => {
        if (fixed.includes(broken)) fixed = fixed.split(broken).join(good)
      })
      return fixed
    }
    const ensureDocCache = (doc) => {
      if (!doc) return null
      if (docQueryCacheRef.current.doc !== doc) {
        docQueryCacheRef.current = { doc, nodes: new Map(), lists: new Map() }
      }
      return docQueryCacheRef.current
    }
    const clearDocCache = (doc) => {
      const cache = ensureDocCache(doc)
      if (!cache) return
      cache.nodes.clear()
      cache.lists.clear()
    }
    const getCachedNode = (doc, key, selector, scope = doc) => {
      const cache = ensureDocCache(doc)
      if (!cache) return null
      const cached = cache.nodes.get(key)
      if (cached && cached.isConnected) return cached
      const found = scope?.querySelector(selector) || null
      cache.nodes.set(key, found)
      return found
    }
    const getCachedNodeList = (doc, key, selector, scope = doc) => {
      const cache = ensureDocCache(doc)
      if (!cache) return []
      const cached = cache.lists.get(key)
      if (Array.isArray(cached) && cached.every((node) => node?.isConnected)) return cached
      const list = Array.from(scope?.querySelectorAll(selector) || [])
      cache.lists.set(key, list)
      return list
    }
    const normalizeTextNodesInDocument = (doc) => {
      if (!doc?.body) return false
      let changed = false
      const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT)
      let node = walker.nextNode()
      while (node) {
        const original = node.nodeValue || ''
        const mojibakeFixed = normalizeMojibakeText(original)
        const currencyFixed = mojibakeFixed.includes('R$ ')
          ? mojibakeFixed.replace(/R\$\s(?=\d)/g, 'R$\u00A0')
          : mojibakeFixed
        if (currencyFixed !== original) {
          node.nodeValue = currencyFixed
          changed = true
        }
        node = walker.nextNode()
      }
      return changed
    }
    const likelyNeedsTextNormalization = (text) => {
      if (!text) return false
      return text.includes('R$ ') || text.includes('Ã') || text.includes('Â') || text.includes('â')
    }
    const scheduleTextNormalization = (doc) => {
      if (!doc?.body || normalizationTimer) return
      normalizationTimer = setTimeout(() => {
        normalizationTimer = null
        skipObserverUntil = Date.now() + 50
        normalizeTextNodesInDocument(doc)
      }, 40)
    }
    const getCatalogEntryById = (id) => {
      const cfg = OFFER_CARD_CONFIG.find((item) => item.id === id)
      const data = DADOS.ofertas.find((item) => item.id === id)
      if (!cfg || !data) return null
      return { config: cfg, data }
    }
    const getActiveOfferEntries = () => activeOffersRef.current || []
    const getActiveOfferEntryByIndex = (idx) => {
      const active = getActiveOfferEntries()
      return active[idx] ?? active[0] ?? null
    }
    const normalizeApiOffers = (payload) => {
      if (!payload) return []
      const rawList = Array.isArray(payload)
        ? payload
        : Array.isArray(payload.offers)
          ? payload.offers
          : Array.isArray(payload.data?.offers)
            ? payload.data.offers
            : []
      return rawList
        .map((item) => {
          if (typeof item === 'string') return { id: item, isRecommended: false }
          const id = item?.id
          if (!id) return null
          const isRecommended = item?.isRecommended === true
          return { id, isRecommended }
        })
        .filter(Boolean)
        .slice(0, MAX_API_CARDS)
    }
    const syncActiveOffersFromApiPayload = (payload) => {
      const offers = normalizeApiOffers(payload)
      const active = offers
        .map((offerItem) => {
          const base = getCatalogEntryById(offerItem.id)
          if (!base) return null
          return { ...base, isRecommended: offerItem.isRecommended }
        })
        .filter(Boolean)
        .slice(0, MAX_API_CARDS)
      activeOffersRef.current = active
      hasNoOfferRef.current = active.length === 0
      selectedOfferIndexRef.current = active.length ? Math.min(selectedOfferIndexRef.current, active.length - 1) : 0
    }
    const loadOffersFromApi = async () => {
      if (FORCED_VISIBLE_OFFER_IDS.length) {
        syncActiveOffersFromApiPayload(FORCED_VISIBLE_OFFER_IDS)
        return
      }
      try {
        const response = await fetch('/api/ofertas')
        if (!response.ok) {
          syncActiveOffersFromApiPayload([])
          return
        }
        const payload = await response.json()
        syncActiveOffersFromApiPayload(payload)
      } catch {
        syncActiveOffersFromApiPayload([])
      }
    }

    const applyResponsiveStyles = (doc) => {
      if (!doc || doc.body?.dataset?.consigaiResponsiveStyleApplied) return

      const styleEl = doc.createElement('style')
      styleEl.textContent = `
        .offer-val-num,
        .hc-col-val,
        .hc-saving-value,
        .ba-row-val,
        .ba-total-val,
        .ba-credit-val,
        .sb-extra-val,
        .sb-main .highlight,
        #ctaSaving,
        #heroNova,
        #heroEco,
        #hcNova,
        #hcEco,
        #baNova,
        #baSobra,
        #baCredito,
        #baPill,
        #sbHi,
        #sbExtra {
          white-space: nowrap !important;
          word-break: keep-all !important;
          font-variant-numeric: tabular-nums;
        }

        .hero-title { font-size: clamp(24px, 3.2vw, 32px) !important; }
        .section-title { font-size: clamp(16px, 2.1vw, 18px) !important; }
        .offer-val-num { font-size: clamp(19px, 2.4vw, 26px) !important; }
        .ba-total-val { font-size: clamp(26px, 3.5vw, 32px) !important; }
        .sb-main { font-size: clamp(18px, 2.7vw, 20px) !important; }
        .sb-extra-val { font-size: clamp(18px, 3vw, 22px) !important; }
        .ba-section.consigai-pocket-redesign .ba-cols {
          display: none !important;
        }
        .impact-section {
          --blue-title: #0E2F7E;
          --blue-action: #2454D6;
          --cyan-brand: #18B7E8;
          --teal-brand: #00A99D;
          --aqua-brand: #6DF5D4;
          --green-strong: #0a7c52;
          --green-medium: #0a7c52;
          --green-soft: #EAF8F0;
          --green-border: #A8DEC3;
          --red-negative: #C00000;
          --gray-text: #667399;
          --gray-border: #DCE5FF;
          --gray-bg: #F7FAFF;
          --white: #FFFFFF;
        }
        .impact-header {
          display: grid;
          grid-template-columns: 1fr auto;
          grid-template-rows: auto auto;
          gap: 2px 12px;
          align-items: center;
          margin-bottom: 12px;
        }
        .impact-header .ba-title {
          grid-column: 1;
          grid-row: 1;
        }
        .impact-header .ba-sub {
          grid-column: 1;
          grid-row: 2;
          color: var(--gray-text) !important;
          font-size: 13px;
        }
        .impact-header .income-base {
          grid-column: 2;
          grid-row: 1 / 3;
          align-self: center;
        }
        .income-base {
          min-width: 160px;
          max-width: 160px;
          border: 1px solid var(--gray-border);
          border-radius: 12px;
          background: #f4f8ff;
          padding: 8px 12px;
        }
        .income-base-label {
          font-size: 11px;
          line-height: 1.2;
          color: var(--gray-text);
          font-weight: 600;
          margin-bottom: 3px;
        }
        .income-base-value {
          font-size: 19px;
          line-height: 1;
          color: var(--blue-title);
          font-weight: 800;
          letter-spacing: -.02em;
        }
        .consigai-pocket-visual.impact-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          align-items: stretch;
          gap: 12px;
        }
        .impact-card {
          border-radius: 14px;
          padding: 14px 14px 12px;
          border: 1px solid var(--gray-border);
          background: var(--gray-bg);
        }
        .impact-card-before {
          background: var(--gray-bg);
          border-color: var(--gray-border);
        }
        .impact-card-after {
          background: linear-gradient(180deg, #F6FFFB 0%, #F7FBFF 100%);
          border-color: var(--green-border);
        }
        .impact-card-gain {
          background: #F8FFFB;
          border: 2px solid var(--green-strong);
        }
        .impact-chip {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border-radius: 999px;
          padding: 5px 11px;
          margin-bottom: 10px;
          font-size: 10px;
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: .05em;
          text-transform: uppercase;
          color: var(--blue-title);
          border: 1px solid transparent;
          background: #e9f0ff;
        }
        .impact-card-after .impact-chip {
          background: rgba(109, 245, 212, 0.18);
          border-color: rgba(0, 169, 157, 0.25);
        }
        .consigai-logo-mark {
          width: 12px;
          height: 12px;
          border-radius: 999px;
          background: linear-gradient(135deg, var(--blue-action) 0%, var(--cyan-brand) 55%, var(--teal-brand) 100%);
          box-shadow: 0 0 0 1px rgba(36, 84, 214, 0.08);
          flex: 0 0 auto;
        }
        .impact-row {
          display: grid;
          grid-template-columns: 34px minmax(0, 1fr);
          gap: 10px;
          align-items: center;
          padding: 9px 0;
          border-bottom: 1px solid #dfe7f5;
        }
        .impact-row:last-child {
          border-bottom: 0;
          padding-bottom: 0;
        }
        .impact-icon {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--blue-action);
          background: #eaf0ff;
        }
        .impact-card-after .impact-icon {
          color: var(--teal-brand);
          background: rgba(24, 183, 232, 0.12);
        }
        .brand-icon {
          color: var(--teal-brand);
          background: rgba(24, 183, 232, 0.12);
        }
        .impact-icon svg {
          width: 18px;
          height: 18px;
          stroke: currentColor;
          fill: none;
          stroke-width: 1.9;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .consigai-pocket-label {
          font-size: 11px;
          font-weight: 600;
          color: var(--blue-title);
          margin-bottom: 2px;
        }
        .consigai-pocket-val {
          font-size: clamp(16px, 2.1vw, 24px);
          font-weight: 900;
          letter-spacing: -.03em;
          color: var(--blue-title);
          line-height: 1.05;
        }
        .value-negative { color: var(--red-negative); }
        .value-positive { color: var(--green-medium); }
        .consigai-pocket-note {
          margin-top: 2px;
          color: var(--gray-text);
          font-size: 10px;
          line-height: 1.2;
        }
        .gain-header {
          display: grid;
          grid-template-columns: 42px minmax(0, 1fr);
          gap: 10px;
          align-items: center;
          border-bottom: 1px solid var(--green-border);
          padding-bottom: 10px;
          margin-bottom: 10px;
        }
        .gain-icon {
          width: 42px;
          height: 42px;
          border-radius: 999px;
          background: linear-gradient(145deg, var(--green-strong) 0%, var(--teal-brand) 100%);
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .gain-icon svg {
          width: 22px;
          height: 22px;
          stroke: currentColor;
          fill: none;
          stroke-width: 2.2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .consigai-pocket-gain-title {
          font-size: 12px;
          font-weight: 800;
          color: var(--blue-title);
          margin-bottom: 2px;
        }
        .consigai-pocket-gain-value {
          font-size: clamp(20px, 2.8vw, 34px);
          line-height: 1;
          letter-spacing: -.04em;
          color: var(--green-strong);
          font-weight: 900;
        }
        .consigai-pocket-gain-copy {
          font-size: 12px;
          color: var(--blue-title);
          font-weight: 700;
        }
        .gain-list {
          display: grid;
          gap: 8px;
        }
        .gain-item {
          display: grid;
          grid-template-columns: 28px minmax(0, 1fr) auto;
          align-items: center;
          gap: 10px;
          border: 1px solid #cfeedd;
          border-radius: 10px;
          padding: 8px 10px;
          background: #fff;
        }
        .consigai-pocket-gain-icon {
          width: 28px;
          height: 28px;
          border-radius: 999px;
          background: var(--green-soft);
          color: var(--green-medium);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .consigai-pocket-gain-icon svg {
          width: 16px;
          height: 16px;
          stroke: currentColor;
          fill: none;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .consigai-pocket-gain-label {
          font-size: 10px;
          font-weight: 700;
          color: var(--blue-title);
          text-transform: uppercase;
          letter-spacing: .04em;
        }
        .consigai-pocket-gain-num {
          font-size: 16px;
          line-height: 1;
          color: var(--green-medium);
          font-weight: 900;
          letter-spacing: -.03em;
          white-space: nowrap;
        }
        .consigai-trust-replacement {
          margin-top: 12px;
          border: 1px solid #d7e1fb;
          border-radius: 14px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          padding: 16px 18px;
          gap: 14px;
          background: #ffffff;
        }
        .consigai-trust-item {
          display: grid;
          grid-template-columns: 46px minmax(0, 1fr);
          align-items: center;
          gap: 10px;
          min-height: 58px;
          border-right: 1px solid #dfe7f5;
          padding-right: 10px;
        }
        .consigai-trust-item:last-child {
          border-right: 0;
          padding-right: 0;
        }
        .consigai-trust-icon {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #f1fcf6;
          border: 1px solid #c9f0d9;
          color: #0a7c52;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .consigai-trust-icon svg {
          width: 21px;
          height: 21px;
          stroke: currentColor;
          fill: none;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .consigai-trust-title {
          font-size: 14px;
          font-weight: 900;
          color: #061a55;
          margin-bottom: 2px;
          line-height: 1.15;
        }
        .consigai-trust-copy {
          font-size: 12px;
          line-height: 1.3;
          color: #57709f;
          font-weight: 600;
        }

        @media (min-width: 1024px) {
          .main { padding: 18px 18px 100px !important; }
          .hero { padding: 18px 24px !important; margin-bottom: 14px !important; gap: 18px !important; }
          .hero-eyebrow { margin-bottom: 6px !important; }
          .hero-title { margin-bottom: 6px !important; font-size: clamp(22px, 2.8vw, 30px) !important; }
          .consigai-hero-note { margin-top: 6px !important; font-size: 12px !important; }
          .offers-grid { gap: 10px !important; margin-bottom: 14px !important; }
          .offer-card { padding: 14px !important; }
          .offer-desc { margin-top: 2px !important; }
          .ba-section { padding: 14px 16px !important; margin-bottom: 8px !important; border-radius: 16px !important; }
          .ba-header { margin-bottom: 8px !important; }
          .ba-title { font-size: 15px !important; margin-bottom: 1px !important; }
          .ba-sub { font-size: 12px !important; }
          .consigai-pocket-visual.impact-grid { gap: 10px !important; }
          .impact-card { padding: 12px 12px 10px !important; }
          .consigai-pocket-gain-value { font-size: clamp(18px, 2.2vw, 28px) !important; }
          .consigai-pocket-gain-num { font-size: 14px !important; }
          .consigai-trust-replacement { margin-top: 8px !important; }
          .ba-col { padding: 14px 14px !important; }
          .ba-col-tag { margin-bottom: 10px !important; }
          .ba-row { padding: 5px 0 !important; font-size: 12px !important; }
          .ba-total-label { margin-bottom: 2px !important; }
          .ba-total-val { margin-bottom: 6px !important; font-size: clamp(22px, 2.4vw, 28px) !important; }
          .ba-credit { padding: 7px 9px !important; border-radius: 8px !important; }
          .ba-credit-val { font-size: 14px !important; }
          .ba-credit-note { font-size: 9px !important; }
          .ba-center-pill { padding: 5px 12px !important; font-size: 11px !important; }
          .savings-banner { padding: 14px 18px !important; }
          .sticky-cta { padding: 10px 18px !important; gap: 16px !important; }
          .btn-cta { padding: 12px 22px !important; }
        }

        @media (max-width: 1080px) {
          .main { padding: 24px 16px 120px !important; }
          .hero { padding: 18px 18px !important; gap: 16px !important; }
          .hero-compare { justify-self: end !important; width: min(360px, 100%) !important; }
          .offers-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .offers-grid > .offer-card:nth-child(3) {
            grid-column: 1 / -1 !important;
            justify-self: center !important;
            width: min(520px, 100%) !important;
          }
          .ba-section { padding: 20px 16px !important; }
          .consigai-pocket-visual.impact-grid { grid-template-columns: minmax(0, 1fr) !important; }
          .consigai-trust-replacement {
            margin-top: 10px !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          .consigai-trust-item:nth-child(2) { border-right: 0 !important; }
        }

        @media (max-width: 760px) {
          .topbar {
            padding: 10px 12px !important;
            height: auto !important;
            min-height: 64px !important;
            gap: 10px !important;
            flex-wrap: wrap !important;
          }
          .topbar-center { order: 3; width: 100%; }
          .topbar-title { font-size: 14px !important; }
          .topbar-sub { font-size: 11px !important; }
          .main { padding: 16px 12px 132px !important; }
          .hero { grid-template-columns: minmax(0, 1fr) !important; }
          .hero-compare { justify-self: stretch !important; width: 100% !important; }
          .offers-grid { grid-template-columns: minmax(0, 1fr) !important; gap: 10px !important; }
          .offers-grid > .offer-card:nth-child(3) {
            grid-column: auto !important;
            justify-self: stretch !important;
            width: 100% !important;
          }
          .offer-card { padding: 14px !important; }
          .offer-values { gap: 12px !important; }
          .consigai-pocket-visual.impact-grid { grid-template-columns: minmax(0, 1fr) !important; gap: 10px !important; }
          .impact-card-before,
          .impact-card-after,
          .impact-card-gain {
            grid-column: 1 !important;
          }
          .gain-header {
            grid-template-columns: 1fr !important;
            text-align: center !important;
            justify-items: center !important;
          }
          .gain-item {
            grid-template-columns: 28px minmax(0, 1fr) !important;
            grid-template-areas:
              "icon label"
              "icon value" !important;
            align-items: flex-start !important;
            gap: 3px !important;
          }
          .consigai-pocket-gain-icon { grid-area: icon !important; }
          .consigai-pocket-gain-label { grid-area: label !important; }
          .consigai-pocket-gain-num { grid-area: value !important; }
          .consigai-trust-replacement {
            grid-template-columns: minmax(0, 1fr) !important;
            padding: 12px !important;
            gap: 10px !important;
          }
          .consigai-trust-item {
            border-right: 0 !important;
            border-bottom: 1px solid #dfe7f5 !important;
            padding-right: 0 !important;
            padding-bottom: 8px !important;
            grid-template-columns: 40px minmax(0, 1fr) !important;
          }
          .consigai-trust-item:last-child {
            border-bottom: 0 !important;
            padding-bottom: 0 !important;
          }
          .consigai-trust-icon {
            width: 36px !important;
            height: 36px !important;
          }
          .consigai-trust-title { font-size: 13px !important; }
          .consigai-trust-copy { font-size: 12px !important; }
          .ba-col.today, .ba-col.after {
            border-radius: 12px !important;
            border-left: 1px solid var(--line) !important;
          }
          .ba-center-badge { position: static !important; transform: none !important; margin: 8px 0; }
          .savings-banner {
            padding: 14px 14px !important;
            gap: 10px !important;
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .sb-right { text-align: left !important; }
          .sticky-cta {
            padding: 10px 12px !important;
            gap: 10px !important;
            flex-wrap: wrap !important;
            justify-content: flex-start !important;
          }
          .cta-sep { display: none !important; }
          .btn-cta {
            width: 100% !important;
            justify-content: center !important;
            padding: 12px 16px !important;
          }
        }
      `
      doc.head?.appendChild(styleEl)
      doc.body.dataset.consigaiResponsiveStyleApplied = '1'
    }

    const upsertPocketInsight = (doc) => {
      if (!doc) return
      const baSection = doc.querySelector('.ba-section')
      const baCols = baSection?.querySelector('.ba-cols')
      if (!baSection || !baCols) return

      const idx = selectedOfferIndexRef.current
      const selectedEntry = getActiveOfferEntryByIndex(idx)
      const o = selectedEntry?.data ?? { creditoReceber: DADOS.impacto.creditToday, parcelaNova: PARCELA_HOJE, economiaParcela: 0 }
      const parcelaNova = o.parcelaNova ?? (PARCELA_HOJE - (o.economiaParcela ?? 0))
      const _pt = DADOS.usuario.salarioBruto - PARCELA_HOJE
      const _pa = DADOS.usuario.salarioBruto - parcelaNova
      const _ct = DADOS.impacto.creditToday
      const _ca = o.creditoReceber ?? _ct
      const salaryUnified = fmt(DADOS.usuario.salarioBruto)
      const installmentToday = fmt(PARCELA_HOJE)
      const installmentAfter = getParcelaNova(o)
      const pocketToday = fmt(_pt)
      const pocketAfter = fmt(_pa)
      const creditToday = fmt(_ct)
      const creditAfter = fmt(_ca)
      const salaryToday = salaryUnified
      const salaryAfter = salaryUnified
      const ecoMensal = Math.max(0, _pa - _pt)
      const ecoAnual = ecoMensal * 12
      const creditoExtra = Math.max(0, _ca - _ct)

      const baHeader = baSection.querySelector('.ba-header')
      const baTitle = baSection.querySelector('.ba-title')
      const baSub = baSection.querySelector('.ba-sub')
      if (baTitle) baTitle.textContent = 'Veja o impacto real no seu bolso'
      if (baSub) baSub.textContent = 'Comparativo mensal com a oferta escolhida.'
      if (baHeader) {
        baHeader.classList.add('impact-header')
        if (!baHeader.querySelector('.income-base')) {
          const incomeBase = doc.createElement('div')
          incomeBase.className = 'income-base'
          incomeBase.innerHTML = `
            <div class="income-base-label">Renda informada</div>
            <div class="income-base-value" id="impactSalarioBase" data-k="salaryUnified"></div>
          `
          baHeader.appendChild(incomeBase)
        }
      }

      let visual = baSection.querySelector('.consigai-pocket-visual')
      if (!visual) {
        visual = doc.createElement('div')
        visual.className = 'consigai-pocket-visual impact-grid'
        visual.innerHTML = `
          <article class="impact-card impact-card-before">
            <div class="impact-chip">Antes da oferta</div>
            <div class="impact-row">
              <span class="impact-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M3 7h16a2 2 0 0 1 2 2v10H5a2 2 0 0 1-2-2V7Z"/><path d="M16 7V5.8a2 2 0 0 0-2.7-1.9L5 7"/><path d="M17 13h4"/><circle cx="17" cy="13" r="1"/></svg>
              </span>
              <div>
                <div class="consigai-pocket-label">Parcela atual</div>
                <div class="consigai-pocket-val value-negative" data-k="installmentToday"></div>
              </div>
            </div>
            <div class="impact-row">
              <span class="impact-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M19 10c1.2.4 2 1.5 2 2.8 0 1.7-1.3 3.2-3 3.2h-.4a6 6 0 0 1-11.2 0H6a3 3 0 0 1 0-6h.4A6 6 0 0 1 18 10Z"/><path d="M12 7v3"/><path d="M9 13h.01"/><path d="M15 13h.01"/><path d="M8 19v2"/><path d="M16 19v2"/></svg>
              </span>
              <div>
                <div class="consigai-pocket-label">Sobra estimada</div>
                <div class="consigai-pocket-val" data-k="pocketToday"></div>
              </div>
            </div>
            <div class="impact-row">
              <span class="impact-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/></svg>
              </span>
              <div>
                <div class="consigai-pocket-label">Crédito disponível</div>
                <div class="consigai-pocket-val" data-k="creditToday"></div>
                <div class="consigai-pocket-note">para emergências</div>
              </div>
            </div>
          </article>
          <article class="impact-card impact-card-after">
            <div class="impact-chip">
              <span class="consigai-logo-mark" aria-hidden="true"></span>
              <span>Depois com ConsigAI</span>
            </div>
            <div class="impact-row">
              <span class="impact-icon brand-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6"/><path d="M9 13h6"/><path d="M9 17h3"/><circle cx="17" cy="17" r="2"/></svg>
              </span>
              <div>
                <div class="consigai-pocket-label">Nova parcela</div>
                <div class="consigai-pocket-val value-positive" id="impactNovaParcela" data-k="installmentAfter"></div>
              </div>
            </div>
            <div class="impact-row">
              <span class="impact-icon brand-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M19 10c1.2.4 2 1.5 2 2.8 0 1.7-1.3 3.2-3 3.2h-.4a6 6 0 0 1-11.2 0H6a3 3 0 0 1 0-6h.4A6 6 0 0 1 18 10Z"/><path d="M12 7v3"/><path d="M9 13h.01"/><path d="M15 13h.01"/><path d="M8 19v2"/><path d="M16 19v2"/></svg>
              </span>
              <div>
                <div class="consigai-pocket-label">Sobra estimada</div>
                <div class="consigai-pocket-val value-positive" id="impactSobraDepois" data-k="pocketAfter"></div>
              </div>
            </div>
            <div class="impact-row">
              <span class="impact-icon brand-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/></svg>
              </span>
              <div>
                <div class="consigai-pocket-label">Crédito disponível</div>
                <div class="consigai-pocket-val value-positive" id="impactCreditoDepois" data-k="creditAfter"></div>
                <div class="consigai-pocket-note">para emergências</div>
              </div>
            </div>
          </article>
          <aside class="impact-card impact-card-gain">
            <div class="gain-header">
              <span class="gain-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="m3 17 6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>
              </span>
              <div>
                <div class="consigai-pocket-gain-title">Seu ganho estimado</div>
                <div class="consigai-pocket-gain-value" id="impactGanhoMensal" data-k="ecoMensal"></div>
                <div class="consigai-pocket-gain-copy">por mês no bolso</div>
              </div>
            </div>
            <div class="gain-list">
              <div class="gain-item">
                <span class="consigai-pocket-gain-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M8 2v4"/><path d="M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/><path d="m9 16 2 2 4-5"/></svg>
                </span>
                <div class="consigai-pocket-gain-label">Economia mensal</div>
                <div class="consigai-pocket-gain-num" data-k="ecoMensal"></div>
              </div>
              <div class="gain-item">
                <span class="consigai-pocket-gain-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M8 2v4"/><path d="M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/><path d="M8 14h8"/><path d="M8 18h5"/></svg>
                </span>
                <div class="consigai-pocket-gain-label">Economia anual</div>
                <div class="consigai-pocket-gain-num" id="impactEconomiaAnual" data-k="ecoAnual"></div>
              </div>
              <div class="gain-item">
                <span class="consigai-pocket-gain-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/></svg>
                </span>
                <div class="consigai-pocket-gain-label">Crédito extra disponível</div>
                <div class="consigai-pocket-gain-num" id="impactCreditoExtra" data-k="creditoExtra"></div>
              </div>
            </div>
          </aside>
        `
        baSection.insertBefore(visual, baCols)
      }
      visual.classList.add('impact-grid')
      baSection.classList.add('consigai-pocket-redesign', 'impact-section')

      const values = {
        salaryToday: salaryToday || salaryUnified,
        installmentToday: formatCurrencyClean(installmentToday),
        pocketToday,
        creditToday,
        salaryAfter: salaryAfter || salaryUnified,
        salaryUnified,
        installmentAfter: formatCurrencyClean(installmentAfter),
        pocketAfter,
        creditAfter,
        ecoMensal: `+${formatCurrency(ecoMensal)}`,
        ecoAnual: `+${formatCurrency(ecoAnual)}`,
        creditoExtra: `+${formatCurrency(creditoExtra)}`,
      }

      Object.entries(values).forEach(([key, val]) => {
        baSection.querySelectorAll(`[data-k="${key}"]`).forEach((el) => {
          el.textContent = val
        })
      })
    }

    const upsertSavingsReplacement = (doc) => {
      if (!doc) return
      const savingsBanner = doc.querySelector('.savings-banner')
      if (!savingsBanner) return

      if (!doc.querySelector('.consigai-trust-replacement')) {
        const replacement = doc.createElement('section')
        replacement.className = 'consigai-trust-replacement'
        replacement.setAttribute('aria-label', 'Benefícios da simulação')
        replacement.innerHTML = `
          <div class="consigai-trust-item">
            <span class="consigai-trust-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="M9 12h6"/><path d="M12 9v6"/></svg>
            </span>
            <div>
              <h3 class="consigai-trust-title">Segurança</h3>
              <p class="consigai-trust-copy">Seus dados protegidos com criptografia</p>
            </div>
          </div>
          <div class="consigai-trust-item">
            <span class="consigai-trust-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v5l3 2"/><path d="M9 2h6"/></svg>
            </span>
            <div>
              <h3 class="consigai-trust-title">É rápido</h3>
              <p class="consigai-trust-copy">Simulação em poucos segundos</p>
            </div>
          </div>
          <div class="consigai-trust-item">
            <span class="consigai-trust-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M12 2 9.8 5.8 5.5 5.7 7.7 9.4 5.5 13.1l4.3-.1L12 17l2.2-4 4.3.1-2.2-3.7 2.2-3.7-4.3.1L12 2Z"/><path d="m9 11 2 2 4-5"/></svg>
            </span>
            <div>
              <h3 class="consigai-trust-title">100% online</h3>
              <p class="consigai-trust-copy">Sem burocracia e sem sair de casa</p>
            </div>
          </div>
          <div class="consigai-trust-item">
            <span class="consigai-trust-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/></svg>
            </span>
            <div>
              <h3 class="consigai-trust-title">Melhores ofertas</h3>
              <p class="consigai-trust-copy">ConsigAI busca as melhores condições para você</p>
            </div>
          </div>
        `
        savingsBanner.insertAdjacentElement('afterend', replacement)
      }

      savingsBanner.style.display = 'none'
    }

    const normalizeCtaSaving = (doc) => {
      const ctaSaving = getCachedNode(doc, 'ctaSaving', '#ctaSaving')
      if (ctaSaving?.textContent) {
        const raw = ctaSaving.textContent.trim()
        const withPositiveSign = raw
          .replace(/^\s*[-−]\s*/, '+')
          .replace(/^R\$\s*/i, '+R$ ')
        ctaSaving.textContent = withPositiveSign
      }
    }

    const normalizeComConsigaiNovaParcela = (doc) => {
      if (!doc) return
      const baNova = getCachedNode(doc, 'baNova', '#baNova')
      if (baNova?.textContent) {
        baNova.textContent = baNova.textContent.replace(/^[^0-9R$]*(?=R\$)/, '').trim()
      }

      const afterRowLabel = baNova?.closest('.ba-row')?.querySelector('.ba-row-label')
      if (afterRowLabel) {
        afterRowLabel.textContent = 'Nova parcela'
      }
    }

    const normalizeCtaOfferName = (doc, idx) => {
      if (!doc) return
      const ctaName = getCachedNode(doc, 'ctaName', '#ctaName')
      if (!ctaName) return
      const selectedConfig = getActiveOfferEntryByIndex(idx)?.config
      if (!selectedConfig) {
        ctaName.textContent = 'Oferta escolhida: sem oferta disponivel'
        return
      }
      if (selectedConfig.id === 'turbo') {
        const sub = THIRD_CARD_SUB_OFFERS[selectedThirdSubOfferRef.current] || THIRD_CARD_SUB_OFFERS.contract
        ctaName.textContent = `Oferta escolhida: ${sub.label}`
        return
      }
      ctaName.textContent = `Oferta escolhida: ${selectedConfig.ctaName}`
    }

    const applyThirdCardSubOfferSelection = (doc) => {
      if (!doc) return
      const miniCards = getCachedNodeList(doc, 'turboMiniCards', '.offer-card.turbo-offer .consigai-offer-mini-card[data-suboffer]')
      if (!miniCards.length) return

      miniCards.forEach((card) => {
        const key = card.getAttribute('data-suboffer')
        const active = key === selectedThirdSubOfferRef.current
        card.classList.toggle('is-selected', active)
        card.setAttribute('aria-pressed', active ? 'true' : 'false')
      })
    }

    const applyUnifiedParcelaHoje = (doc) => {
      if (!doc) return
      const parcelaHoje = `R$ ${PARCELA_HOJE.toLocaleString('pt-BR')}`

      const heroOld = getCachedNode(doc, 'heroOld', '.hc-col-val.old')
      if (heroOld) heroOld.textContent = parcelaHoje

      const heroNew = getCachedNode(doc, 'heroNew', '.hc-col-val.new, #hcNova')
      const activeForHero = getActiveOfferEntryByIndex(selectedOfferIndexRef.current)?.data
      if (heroNew) heroNew.textContent = activeForHero ? getParcelaNova(activeForHero) : 'R$ 0'

      const heroEco = getCachedNode(doc, 'heroEco', '.hc-saving-value, #hcEco')
      const idxEco = selectedOfferIndexRef.current
      const oEco = getActiveOfferEntryByIndex(idxEco)?.data
      const ecoMensal = oEco ? Math.max(0, Math.round(getEcoMensal(oEco))) : 0
      if (heroEco) heroEco.textContent = `R$\u00A0${ecoMensal.toLocaleString('pt-BR')}`

      const ctaSaving = getCachedNode(doc, 'ctaSaving', '#ctaSaving')
      if (ctaSaving) ctaSaving.textContent = `+R$\u00A0${ecoMensal.toLocaleString('pt-BR')}/mês`

      const todayDeduct = getCachedNode(doc, 'todayDeduct', '.ba-col.today .ba-row-val.deduct')
      if (todayDeduct) todayDeduct.textContent = parcelaHoje

      const oldValuesInCards = getCachedNodeList(doc, 'oldValuesInCards', '.offers-grid .offer-val-num.old')
      oldValuesInCards.forEach((el) => {
        el.textContent = parcelaHoje
      })

      // Remove arrow markers between old/new values in offer cards.
      const arrowSpans = getCachedNodeList(doc, 'arrowSpans', '.offers-grid .offer-val-block span')
      arrowSpans.forEach((el) => {
        const raw = (el.textContent || '').trim()
        if (raw === '?' || raw === '→' || raw === '->') {
          el.style.display = 'none'
        }
      })
      normalizeCtaSaving(doc)
      normalizeComConsigaiNovaParcela(doc)
      normalizeCtaOfferName(doc, selectedOfferIndexRef.current)
    }

    const applyOfferCardRedesignStyles = (doc) => {
      if (doc.body?.dataset?.consigaiOfferRedesignStyleApplied) return

      const styleEl = doc.createElement('style')
      styleEl.textContent = `
        .hero-sub { display: none !important; }
        body {
          min-height: 100vh !important;
          font-family: Inter, Arial, Helvetica, sans-serif !important;
          background-image: url('/fundo-ofertas.svg') !important;
          background-size: cover !important;
          background-position: center !important;
          background-repeat: no-repeat !important;
          color: var(--text-main, var(--text)) !important;
          padding: 0 24px 24px !important;
        }
        .main {
          position: relative !important;
          z-index: 0 !important;
        }
        .main::before {
          display: none !important;
        }
        .hero-title { color: #1a3d8f !important; }
        .hero-title em {
          color: #0a7c52 !important;
          font-style: normal !important;
        }
        @media (min-width: 1024px) {
          .hero-title {
            white-space: nowrap !important;
          }
        }
        .hc-col-val.old { color: #C00000 !important; }
        .hc-col-val.new,
        .hc-saving-value,
        #hcNova,
        #hcEco {
          color: #0a7c52 !important;
        }
        .ba-row-val.deduct { color: #C00000 !important; }
        .ba-col.after .ba-row-val.deduct,
        #baNova {
          color: #0a7c52 !important;
        }
        .ba-section .ba-title,
        .ba-section .ba-row-label,
        .ba-section .ba-total-label,
        .ba-section .ba-credit-label,
        .ba-section .ba-credit-note,
        .ba-section .ba-col.today .ba-row-val:not(.deduct),
        .ba-section .ba-col.today .ba-total-val,
        .ba-section .ba-col.today .ba-credit-val {
          color: #1a3d8f !important;
        }
        .ba-section .consigai-pocket-label,
        .ba-section .consigai-pocket-note,
        .ba-section .consigai-pocket-val:not(.positive):not(.negative):not(.value-positive):not(.value-negative),
        .ba-section .consigai-pocket-card.today .consigai-pocket-pill,
        .ba-section .consigai-pocket-card.today .consigai-pocket-icon,
        .ba-section .consigai-pocket-card.after .consigai-pocket-label {
          color: #1a3d8f !important;
        }
        .btn-cta {
          background: linear-gradient(160deg, #1e4aaa, #12307a) !important;
        }
        .hc-saving-label {
          font-size: 15px !important;
        }
        /* Keep motion only on the 3 offer cards */
        .main * {
          animation: none !important;
          transition: none !important;
          transform: none;
        }
        .offers-grid .offer-card {
          transition: all .18s ease !important;
        }
        .ba-section .vc,
        .ba-section .popped,
        #baNova,
        #baSobra,
        #baCredito,
        #baPill {
          animation: none !important;
          transition: none !important;
          transform: none !important;
        }

        .offers-grid {
          display: grid !important;
          grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          gap: 14px !important;
          align-items: stretch !important;
        }

        .offer-card {
          background: #fff !important;
          border: 2px solid transparent !important;
          box-shadow: 0 8px 24px rgba(0,24,81,.06) !important;
          border-radius: 22px !important;
          padding: 18px !important;
          height: 282px !important;
          min-height: 282px !important;
          container-type: inline-size;
          transition: border-color .18s ease, box-shadow .18s ease, background .18s ease !important;
          touch-action: manipulation !important;
          will-change: transform, box-shadow, border-color;
          user-select: text;
        }
        .offer-card.selected,
        .offer-card.active {
          border: 2px solid transparent !important;
          background:
            linear-gradient(180deg, #ffffff 0%, #f7fbff 100%) padding-box,
            linear-gradient(135deg, #2454D6, #18B7E8, #00A99D) border-box !important;
          box-shadow: 0 18px 42px rgba(13, 35, 90, 0.24) !important;
        }
        .offer-card.selected::before,
        .offer-card.active::before { display: none !important; }
        .offer-card:hover {
          border-color: #c2d0f8 !important;
        }
        .offer-card:active { }

        .consigai-offer-card {
          height: 100%;
          display: flex;
          flex-direction: column;
          user-select: text;
        }

        .consigai-offer-head {
          margin-bottom: 0;
          min-height: 0;
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
        }
        .consigai-offer-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 14px;
          flex-wrap: nowrap;
        }
        .consigai-offer-title-row .consigai-offer-head-badges {
          margin-left: auto;
          justify-content: flex-end;
        }
        .consigai-offer-head-badges {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          flex-wrap: nowrap;
          flex-shrink: 0;
        }
        .consigai-hidden-state-badge {
          display: none !important;
        }
        #badge0,
        #badge1,
        #badge2 {
          display: none !important;
        }
        .consigai-offer-head-badges .badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .04em;
          line-height: 1;
          padding: 6px 10px;
          border-radius: 999px;
          white-space: nowrap;
        }
        .consigai-offer-badge-rec {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          border-radius: 999px;
          padding: 6px 10px;
          background: linear-gradient(135deg, #fff3cf 0%, #ffe3a3 100%);
          border: 1px solid #f0d38a;
          color: #9a6a00;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .06em;
          text-transform: uppercase;
          line-height: 1;
          white-space: nowrap;
        }
        .consigai-offer-badge-rec::before {
          content: '★';
          font-size: 14px !important;
          font-weight: 900;
          line-height: 1;
        }

        .consigai-offer-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          align-self: flex-start;
          width: auto;
          max-width: max-content;
          border-radius: 999px;
          padding: 7px 12px;
          background: #e8eeff;
          border: 1px solid #c2d0f8;
          color: #1a3d8f;
          font-size: 12px;
          font-weight: 900;
          line-height: 1;
          margin-bottom: 14px;
        }
        .consigai-offer-title-row .consigai-offer-pill {
          margin-bottom: 0;
          flex-shrink: 0;
        }
        .offer-card.selected .consigai-offer-pill {
          background: #1a3d8f;
          border-color: #1a3d8f;
          color: #fff;
          box-shadow: 0 8px 18px rgba(35,80,200,.18);
        }

        .consigai-offer-lines {
          display: grid;
          gap: 3px;
          margin-bottom: 10px;
          align-content: start;
          min-height: 112px;
        }
        .consigai-offer-pretext {
          font-size: 24px;
          line-height: 1.08;
          letter-spacing: -.03em;
          color: #1a3d8f;
          font-weight: 850;
          margin-bottom: 8px;
        }
        .consigai-offer-lines .consigai-offer-line:first-of-type {
          min-height: 50px;
          align-content: start;
        }
        .consigai-offer-line {
          display: grid;
          gap: 3px;
        }
        .consigai-offer-line-main {
          font-size: 24px;
          font-weight: 850;
          line-height: 1.08;
          letter-spacing: -.03em;
        }
        .consigai-offer-line-main.blue { color: #1a3d8f; }
        .consigai-offer-line-main.green { color: #ec7000; }
        .consigai-offer-line-main.brand-green { color: #0a7c52; }
        .consigai-offer-word-orange { color: #0a7c52; }
        .consigai-offer-value-green { color: #0a7c52; }
        .consigai-offer-word-estimada {
          color: #7a8db8;
          font-size: .58em;
          font-weight: 700;
          letter-spacing: 0;
          vertical-align: baseline;
          margin-left: 2px;
        }
        .consigai-offer-total-stack {
          display: inline-flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
        }
        .consigai-offer-total-label {
          display: inline-flex;
          align-items: baseline;
          gap: 2px;
          white-space: nowrap;
          line-height: 1.06;
          font-size: clamp(12px, 6.2cqi, 24px);
          max-inline-size: 100%;
        }
        .consigai-offer-total-label .consigai-offer-word-orange {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: clip;
        }
        .consigai-offer-total-stack .consigai-offer-value-green {
          display: block;
        }
        .consigai-offer-line-helper {
          font-size: 11px;
          color: #1a3d8f;
          font-weight: 750;
          line-height: 1;
        }
        .consigai-offer-line-helper.spacer {
          color: transparent;
        }

        .consigai-offer-or {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: fit-content;
          font-size: 13px;
          color: #1a3d8f;
          font-weight: 850;
          line-height: 1;
          letter-spacing: -.01em;
          border-radius: 999px;
          background: #e8eeff;
          border: 1px solid #c2d0f8;
          padding: 5px 8px;
          white-space: nowrap;
          margin: 2px 0;
        }
        .offer-card.turbo-offer .consigai-offer-lines {
          display: block;
          min-height: 112px;
        }
        .consigai-offer-mini-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }
        .consigai-offer-mini-card {
          display: grid;
          gap: 6px;
          padding: 11px 10px;
          border-radius: 12px;
          border: 1px solid #d7e2ff;
          background: #f6f9ff;
          min-width: 0;
        }
        .offer-card.selected .consigai-offer-mini-card {
          background: #edf3ff;
          border-color: #c2d0f8;
        }
        .consigai-offer-mini-label {
          font-size: 13px;
          line-height: 1.15;
          color: #1a3d8f;
          font-weight: 800;
        }
        .offer-card.turbo-offer .consigai-offer-mini-label {
          font-size: 13px;
          line-height: 1.22;
          letter-spacing: 0;
          overflow-wrap: anywhere;
          word-break: normal;
          text-wrap: balance;
          min-height: 26px;
          display: block;
        }
        .consigai-offer-mini-value {
          font-size: 24px;
          line-height: 1;
          color: #0a7c52;
          font-weight: 900;
          letter-spacing: -.03em;
          white-space: nowrap;
        }
        .offer-card.turbo-offer .consigai-offer-mini-grid {
          gap: 8px;
          margin-top: 26px !important;
        }
        .offer-card.turbo-offer .consigai-offer-mini-card {
          gap: 4px;
          padding: 9px 8px;
          align-content: start;
          overflow: hidden;
          cursor: pointer;
          border-color: #dbe6f7;
          background: #f7faff;
          box-shadow: none;
          transition: none;
        }
        .offer-card.turbo-offer .consigai-offer-mini-value {
          font-size: clamp(18px, 2.05vw, 22px);
          line-height: .98;
          letter-spacing: -.015em;
          min-width: 0;
          color: #0a7c52;
        }
        .offer-card.simple-offer .consigai-offer-mini-grid {
          grid-template-columns: minmax(0, 1fr);
          gap: 6px;
          margin-top: auto !important;
          margin-bottom: 6px;
        }
        .offer-card.simple-offer .consigai-offer-lines {
          min-height: 0 !important;
          margin-bottom: 6px;
        }
        .offer-card.simple-offer .consigai-offer-mini-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          padding: 7px 8px;
          overflow: hidden;
          cursor: default;
          border-color: #dbe6f7;
          background: #f7faff;
          box-shadow: none;
          transition: none;
        }
        .offer-card.simple-offer .consigai-offer-mini-label {
          font-size: 13px;
          line-height: 1.15;
          letter-spacing: 0;
          min-height: 0;
          display: inline-block;
        }
        .offer-card.simple-offer .consigai-offer-mini-value {
          font-size: clamp(18px, 2.05vw, 22px);
          line-height: .98;
          letter-spacing: -.015em;
          min-width: 0;
          color: #0a7c52;
          margin-left: auto;
          white-space: nowrap;
        }
        .offer-card.simple-offer .consigai-offer-note-sub {
          min-height: 20px;
          line-height: 1.25;
        }
        .offer-card.turbo-offer.selected .consigai-offer-mini-card {
          border-color: #dbe6f7;
          background: #f7faff;
          box-shadow: none;
          transition: border-color .16s ease, box-shadow .16s ease, background .16s ease;
        }
        .offer-card.turbo-offer .consigai-offer-mini-label {
          color: #1a3d8f;
        }
        .offer-card.turbo-offer.selected .consigai-offer-mini-card.is-selected {
          border-color: #2454D6 !important;
          background: #eef5ff !important;
          box-shadow: 0 3px 10px rgba(35, 80, 200, .12) !important;
        }

        .consigai-offer-note {
          display: block;
          margin-top: auto;
          min-height: 0;
        }
        .consigai-offer-note-dot {
          display: none;
        }
        .consigai-offer-note-text {
          display: block;
        }
        .consigai-offer-note-title {
          display: none;
        }
        .consigai-offer-note-sub {
          color: #7a8db8;
          font-weight: 400;
          font-size: 12px;
          line-height: 1.35;
          display: block;
          min-height: 20px;
        }

        .consigai-offer-metric {
          margin-top: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 12px;
          background: #f8faff;
          border: 1px solid #e4eaf8;
          padding: 12px;
        }
        .offer-card.selected .consigai-offer-metric {
          background: #f2f6ff;
          border-color: #c2d0f8;
          box-shadow: 0 8px 18px rgba(35,80,200,.08);
        }
        .consigai-offer-metric-label {
          font-size: 15px;
          color: #1a3d8f;
          font-weight: 800;
        }
        .consigai-offer-metric-value {
          font-size: 16px;
          color: #1a3d8f;
          font-weight: 900;
          letter-spacing: -.02em;
          white-space: nowrap;
        }
        .consigai-offer-metric-value.green { color: #0a7c52; }
        @media (max-width: 1080px) {
          .offers-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 760px) {
          .offers-grid {
            grid-template-columns: minmax(0, 1fr) !important;
            gap: 10px !important;
          }
          .offer-card {
            min-height: auto !important;
            padding: 14px !important;
          }
          .consigai-offer-lines,
          .offer-card.turbo-offer .consigai-offer-lines {
            min-height: 0 !important;
          }
          .consigai-offer-note,
          .consigai-offer-note-sub {
            min-height: 0 !important;
          }
          .consigai-offer-line-main {
            font-size: 22px !important;
          }
          .consigai-offer-mini-value {
            font-size: 22px !important;
          }
          .offer-card.turbo-offer .consigai-offer-mini-grid {
            grid-template-columns: 1fr !important;
            gap: 8px !important;
          }
          .offer-card.turbo-offer .consigai-offer-mini-label {
            font-size: 13px !important;
          }
        }
      `
      doc.head?.appendChild(styleEl)
      doc.body.dataset.consigaiOfferRedesignStyleApplied = '1'
    }

    const upsertOfferCardsRedesign = (doc) => {
      const offersGrid = getCachedNode(doc, 'offersGrid', '.offers-grid')
      if (!offersGrid) return

      const entries = getActiveOfferEntries()
      const selectedIdx = entries.length ? Math.min(selectedOfferIndexRef.current, entries.length - 1) : 0
      selectedOfferIndexRef.current = selectedIdx

      if (!entries.length) {
        const noOfferMarkup = `
          <div class="offer-card selected" id="oc0">
            <div class="consigai-offer-card">
              <div class="consigai-offer-title-row">
                <span class="consigai-offer-pill">Sem oferta disponivel</span>
              </div>
              <div class="consigai-offer-lines" style="min-height:0">
                <div class="consigai-offer-line">
                  <span class="consigai-offer-line-main blue">Nao ha oferta para este cliente no momento</span>
                  <span class="consigai-offer-line-helper">Tente novamente mais tarde.</span>
                </div>
              </div>
            </div>
          </div>
        `
        if (offersGrid.innerHTML !== noOfferMarkup) {
          offersGrid.innerHTML = noOfferMarkup
          clearDocCache(doc)
        }
        syncOfferSelectionUi(doc)
        return
      }

      const cardsHtml = entries.map((entry, idx) => {
        const cfg = entry.config
        const offer = entry.data
        const showRecommendedBadge = entry.isRecommended === true

        if (cfg.id === 'turbo') {
          const economiaContrato = fmt(offer.economiaContrato ?? offer.economiaTotal ?? 0)
          const economiaParcela = `${fmt(offer.economiaParcela ?? getEcoMensal(offer))}/mês`
          return `
            <div class="offer-card turbo-offer" id="oc${idx}">
              <div class="consigai-offer-card">
                <span class="consigai-hidden-state-badge badge pick" id="badge${idx}">Escolher</span>
                <div class="consigai-offer-head"></div>
                <span class="consigai-offer-pill">${cfg.pill}</span>
                <div class="consigai-offer-lines">
                  <div class="consigai-offer-pretext">Economize sem pegar novo credito</div>
                  <div class="consigai-offer-mini-grid">
                    <div class="consigai-offer-mini-card" data-suboffer="contract" role="button" tabindex="0">
                      <span class="consigai-offer-mini-label">No contrato</span>
                      <span class="consigai-offer-mini-value">${economiaContrato}</span>
                    </div>
                    <div class="consigai-offer-mini-card" data-suboffer="installment" role="button" tabindex="0">
                      <span class="consigai-offer-mini-label">Na parcela</span>
                      <span class="consigai-offer-mini-value">${economiaParcela}</span>
                    </div>
                  </div>
                </div>
                <div class="consigai-offer-note">
                  <span class="consigai-offer-note-text">
                    <span class="consigai-offer-note-sub">${cfg.note}</span>
                  </span>
                </div>
              </div>
            </div>
          `
        }

        const moneyValue = fmt(offer.creditoReceber ?? 0)
        const showSecondaryLine = cfg.kind !== 'simples'
        let totalLabel = 'Parcela estimada em'
        let totalValue = getParcelaNova(offer)
        let metricLabel = 'Economia de'
        let metricValue = `${fmt(getEcoMensal(offer))}/mês`

        if (cfg.id === 'equilibrio') {
          totalLabel = 'Economize nos Contratos'
          totalValue = fmt(offer.economiaTotal ?? (getEcoMensal(offer) * 12))
          metricLabel = 'Parcela nova'
          metricValue = getParcelaNova(offer)
        } else if (cfg.id === 'folga') {
          totalLabel = 'Reduza a parcela para'
          totalValue = getParcelaNova(offer)
          metricLabel = 'Economia de'
          metricValue = `${fmt(offer.reducaoMensal ?? getEcoMensal(offer))}/mês`
        } else if (cfg.kind === 'simples') {
          metricLabel = 'Parcela'
          metricValue = getParcelaNova(offer)
        }
        const simpleMiniLabelFirst = metricLabel
        const isSimpleContractCard = cfg.id === 'apenas_novo' || cfg.id === 'apenas_refin'
        const simpleMiniLabelSecond = isSimpleContractCard ? 'Qtd Parcelas' : metricLabel
        const simpleMiniValueSecond = isSimpleContractCard ? '48' : metricValue


        return `
          <div class="offer-card${cfg.kind === 'simples' ? ' simple-offer' : ''}" id="oc${idx}">
            <div class="consigai-offer-card">
              <span class="consigai-hidden-state-badge badge pick" id="badge${idx}">Escolher</span>
              ${showRecommendedBadge
                ? `<div class="consigai-offer-title-row">
                     <span class="consigai-offer-pill">${cfg.pill}</span>
                     <div class="consigai-offer-head-badges">
                       <span class="consigai-offer-badge-rec">Recomendada</span>
                     </div>
                   </div>`
                : `<div class="consigai-offer-head"></div>
                   <span class="consigai-offer-pill">${cfg.pill}</span>`}
              <div class="consigai-offer-lines">
                <div class="consigai-offer-line">
                  <span class="consigai-offer-line-main blue">Receba ${moneyValue}</span>
                  <span class="consigai-offer-line-helper">na sua conta</span>
                </div>
                ${showSecondaryLine
                  ? `<div class="consigai-offer-line">
                       <span class="consigai-offer-line-main consigai-offer-total-stack">
                         <span class="consigai-offer-total-label">
                           <span class="consigai-offer-word-orange">${totalLabel}</span>
                         </span>
                         <span class="consigai-offer-value-green">${totalValue}</span>
                       </span>
                     </div>`
                  : ''}
              </div>
              ${cfg.kind === 'simples'
                ? `<div class="consigai-offer-mini-grid">
                     <div class="consigai-offer-mini-card">
                       <span class="consigai-offer-mini-label">${simpleMiniLabelFirst}</span>
                       <span class="consigai-offer-mini-value">${metricValue}</span>
                     </div>
                     <div class="consigai-offer-mini-card">
                       <span class="consigai-offer-mini-label">${simpleMiniLabelSecond}</span>
                       <span class="consigai-offer-mini-value">${simpleMiniValueSecond}</span>
                     </div>
                   </div>`
                : ''}
              <div class="consigai-offer-note">
                <span class="consigai-offer-note-text">
                  <span class="consigai-offer-note-sub">${cfg.note}</span>
                </span>
              </div>
            </div>
          </div>
        `
      }).join('')

      if (offersGrid.innerHTML !== cardsHtml) {
        offersGrid.innerHTML = cardsHtml
        clearDocCache(doc)
      }
      syncOfferSelectionUi(doc)
      applyThirdCardSubOfferSelection(doc)
    }

    const syncOfferSelectionUi = (doc) => {
      if (!doc) return
      const offerCards = getCachedNodeList(doc, 'offerCards', '.offers-grid .offer-card')
      if (!offerCards.length) return
      const selectedIdx = hasNoOfferRef.current
        ? 0
        : Math.min(selectedOfferIndexRef.current, offerCards.length - 1)
      selectedOfferIndexRef.current = selectedIdx

      offerCards.forEach((card, idx) => {
        const selected = idx === selectedIdx
        card.classList.toggle('selected', selected)
        card.classList.toggle('active', selected)
        card.setAttribute('aria-selected', selected ? 'true' : 'false')
        const badge = card.querySelector('.consigai-hidden-state-badge')
        if (badge) {
          badge.classList.toggle('sel', selected)
          badge.classList.toggle('pick', !selected)
          badge.textContent = selected ? 'Selecionada' : 'Escolher'
        }
      })
    }

    const goToSelectedOffer = () => {
      const selectedConfig = getActiveOfferEntryByIndex(selectedOfferIndexRef.current)?.config
      if (!selectedConfig) return
      if (selectedConfig.id === 'turbo') {
        const thirdSub = THIRD_CARD_SUB_OFFERS[selectedThirdSubOfferRef.current] || THIRD_CARD_SUB_OFFERS.contract
        navigate(thirdSub.route)
        return
      }
      navigate(selectedConfig.route, selectedConfig.state ? { state: selectedConfig.state } : undefined)
    }

    const attachBridge = () => {
      const frame = iframeRef.current
      const frameWindow = frame?.contentWindow
      const frameDoc = frameWindow?.document

      if (!frameWindow || !frameDoc) return
      if (!getCachedNode(frameDoc, 'offersGrid', '.offers-grid')) return
      const refreshSelectedOfferUi = (idx) => {
        selectedOfferIndexRef.current = idx
        normalizeCtaSaving(frameDoc)
        normalizeComConsigaiNovaParcela(frameDoc)
        normalizeCtaOfferName(frameDoc, idx)
        applyUnifiedParcelaHoje(frameDoc)
        upsertOfferCardsRedesign(frameDoc)
        applyThirdCardSubOfferSelection(frameDoc)
        upsertPocketInsight(frameDoc)
        upsertSavingsReplacement(frameDoc)
        normalizeTextNodesInDocument(frameDoc)
      }

      applyResponsiveStyles(frameDoc)
      normalizeTextNodesInDocument(frameDoc)
      applyUnifiedParcelaHoje(frameDoc)
      applyOfferCardRedesignStyles(frameDoc)
      upsertOfferCardsRedesign(frameDoc)
      applyThirdCardSubOfferSelection(frameDoc)
      upsertPocketInsight(frameDoc)
      upsertSavingsReplacement(frameDoc)
      normalizeComConsigaiNovaParcela(frameDoc)
      normalizeCtaOfferName(frameDoc, selectedOfferIndexRef.current)

      if (!frameDoc.body?.dataset?.consigaiCurrencyObserverAttached) {
        currencyObserverRef.current?.disconnect?.()
        currencyObserverRef.current = new MutationObserver((mutations) => {
          if (Date.now() < skipObserverUntil) return
          const shouldNormalize = mutations.some((mutation) => {
            if (mutation.type === 'characterData') {
              return likelyNeedsTextNormalization(mutation.target?.nodeValue || '')
            }
            if (mutation.type !== 'childList') return false
            return Array.from(mutation.addedNodes || []).some((node) => likelyNeedsTextNormalization(node?.textContent || ''))
          })
          if (shouldNormalize) scheduleTextNormalization(frameDoc)
        })
        currencyObserverRef.current.observe(frameDoc.body, { childList: true, subtree: true, characterData: true })
        frameDoc.body.dataset.consigaiCurrencyObserverAttached = '1'
      }

      if (!frameDoc.body?.dataset?.consigaiLegacyLogoApplied) {
        const logoEl = frameDoc.querySelector('.topbar .logo')
        if (logoEl) {
          logoEl.innerHTML = '<img src="/logo-antigo.svg" alt="ConsigAI" style="height:34px;width:auto;display:block;" />'
          logoEl.style.gap = '0'
          logoEl.style.fontSize = '0'
          logoEl.style.lineHeight = '0'
          logoEl.style.cursor = 'pointer'
          logoEl.addEventListener('click', () => navigate('/ofertas'))
          frameDoc.body.dataset.consigaiLegacyLogoApplied = '1'
        }
      }

      if (!frameDoc.body?.dataset?.consigaiHeroSectionCopyAdjusted) {
        const heroTextContainer = frameDoc.querySelector('.hero > div:first-child')
        if (heroTextContainer) {
          let note = frameDoc.querySelector('.consigai-hero-note')
          if (!note) {
            note = frameDoc.createElement('p')
            note.className = 'consigai-hero-note'
            note.style.margin = '10px 0 0'
            note.style.fontSize = '13px'
            note.style.fontWeight = '500'
            note.style.color = '#7a8db8'
            note.style.lineHeight = '1.4'
            heroTextContainer.appendChild(note)
          }
          note.textContent = 'Compare as opcoes para reduzir parcela, economizar no total, ou seguir em ofertas diretas como apenas novo contrato e apenas refinanciamento.'
        }

        const sectionHeader = frameDoc.querySelector('.section-header')
        if (sectionHeader) sectionHeader.style.display = 'none'

        frameDoc.body.dataset.consigaiHeroSectionCopyAdjusted = '1'
      }

      if (!frameDoc.body?.dataset?.consigaiLogoTextApplied) {
        const afterTag = frameDoc.querySelector('.ba-col.after .ba-col-tag')
        if (afterTag) {
          const textNode = Array.from(afterTag.childNodes).find((node) => node.nodeType === Node.TEXT_NODE)
          if (textNode) textNode.nodeValue = ' ConsigAI'
          else afterTag.appendChild(frameDoc.createTextNode(' ConsigAI'))

          frameDoc.body.dataset.consigaiLogoTextApplied = '1'
        }
      }

      if (frameDoc !== attachedDocRef.current) {
        if (attachedDocRef.current && clickHandlerRef.current) {
          attachedDocRef.current.removeEventListener('click', clickHandlerRef.current, true)
        }

        clickHandlerRef.current = (event) => {
          const rawTarget = event.target
          const target = rawTarget?.nodeType === 1 ? rawTarget : rawTarget?.parentElement
          if (!target) return
          const clickedOfferCard = target.closest('.offer-card')

          const thirdSubCard = target.closest('.offer-card.turbo-offer .consigai-offer-mini-card[data-suboffer]')
          if (thirdSubCard) {
            const subKey = thirdSubCard.getAttribute('data-suboffer')
            if (subKey && THIRD_CARD_SUB_OFFERS[subKey]) {
              const turboOfferCard = thirdSubCard.closest('.offer-card.turbo-offer')
              const turboOfferIndex = turboOfferCard?.id?.startsWith('oc')
                ? Number(turboOfferCard.id.replace('oc', ''))
                : Number.NaN
              if (Number.isNaN(turboOfferIndex)) return
              selectedThirdSubOfferRef.current = subKey
              selectedOfferIndexRef.current = turboOfferIndex
              event.preventDefault()
              event.stopPropagation()
              refreshSelectedOfferUi(turboOfferIndex)
              return
            }
          }

          const offerCard = target.closest('.offer-card')
          if (offerCard?.id?.startsWith('oc')) {
            if (hasNoOfferRef.current) return
            const idx = Number(offerCard.id.replace('oc', ''))
            if (!Number.isNaN(idx)) {
              selectedOfferIndexRef.current = idx
              event.preventDefault()
              event.stopPropagation()
              refreshSelectedOfferUi(idx)
              return
            }
          }

          const cta = target.closest('.btn-cta')
          if (cta) {
            event.preventDefault()
            goToSelectedOffer()
          }
        }

        frameDoc.addEventListener('click', clickHandlerRef.current, true)
        const ctaButton = getCachedNode(frameDoc, 'ctaButton', '.btn-cta')
        if (ctaButton) {
          ctaButton.onclick = (event) => {
            event.preventDefault()
            goToSelectedOffer()
          }
        }
        attachedDocRef.current = frameDoc
      }

      // After the bridge is attached and cards are mounted, stop polling to avoid UI jitter.
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    }

    const handleLoad = () => attachBridge()
    const initializeOffers = async () => {
      await loadOffersFromApi()
      attachBridge()
    }

    const iframe = iframeRef.current
    iframe?.addEventListener('load', handleLoad)
    intervalId = setInterval(attachBridge, 400)
    initializeOffers()

    return () => {
      iframe?.removeEventListener('load', handleLoad)
      if (intervalId) clearInterval(intervalId)
      if (normalizationTimer) {
        clearTimeout(normalizationTimer)
        normalizationTimer = null
      }
      currencyObserverRef.current?.disconnect?.()
      currencyObserverRef.current = null
      if (attachedDocRef.current && clickHandlerRef.current) {
        attachedDocRef.current.removeEventListener('click', clickHandlerRef.current, true)
      }
      docQueryCacheRef.current = { doc: null, nodes: new Map(), lists: new Map() }
    }
  }, [navigate])

  return (
    <iframe
      ref={iframeRef}
      title="Ofertas ConsigAI"
      src="/Ofertas_ConsigAI.html"
      style={{
        width: '100%',
        height: '100vh',
        border: 'none',
        display: 'block',
        background: '#EEF1F9',
      }}
    />
  )
}


