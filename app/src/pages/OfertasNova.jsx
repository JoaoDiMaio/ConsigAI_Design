import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const OFFER_ROUTES = [
  { route: '/estrategia-combinada', state: { strategyType: 'novo contrato + economia' } },
  { route: '/estrategia-combinada', state: { strategyType: 'refin + economia' } },
  { route: '/portabilidade' },
]
const OFFER_CTA_NAMES = ['Melhor Equilíbrio', 'Mais Folga por Mês', 'Turbo Economia']
const THIRD_CARD_SUB_OFFERS = {
  contract: { label: 'No contrato', route: '/portabilidade' },
  installment: { label: 'Na parcela', route: '/refinanciamento' },
}
const TOTAL_ECONOMIA = 'R$ 2.399'
const PARCELA_HOJE = 284

export default function OfertasNova() {
  const navigate = useNavigate()
  const iframeRef = useRef(null)
  const selectedOfferIndexRef = useRef(0)
  const attachedDocRef = useRef(null)
  const clickHandlerRef = useRef(null)
  const currencyObserverRef = useRef(null)
  const selectedThirdSubOfferRef = useRef('contract')

  useEffect(() => {
    let intervalId = null

    const parseCurrency = (text) => {
      if (!text) return 0
      const numeric = String(text).replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.')
      const parsed = Number(numeric)
      return Number.isFinite(parsed) ? parsed : 0
    }

    const formatCurrency = (value) => `R$ ${Math.round(value).toLocaleString('pt-BR')}`

    const enforceCurrencyNoBreak = (doc) => {
      if (!doc?.body) return
      const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT)
      let node = walker.nextNode()
      while (node) {
        const original = node.nodeValue
        if (original && original.includes('R$ ')) {
          const fixed = original.replace(/R\$\s(?=\d)/g, 'R$\u00A0')
          if (fixed !== original) node.nodeValue = fixed
        }
        node = walker.nextNode()
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
        .consigai-pocket-visual {
          --cp-gap: 12px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(260px, .95fr);
          align-items: stretch;
          gap: var(--cp-gap);
          position: relative;
        }
        .consigai-pocket-card.today {
          grid-column: 1;
        }
        .consigai-pocket-card.after {
          grid-column: 2;
        }
        .consigai-pocket-gain {
          grid-column: 3;
        }
        .consigai-pocket-card {
          border: 1px solid #d7e1fb;
          border-radius: 14px;
          background: #f8faff;
          padding: 14px 14px 12px;
        }
        .consigai-pocket-card.after {
          background: linear-gradient(180deg, #f4fdf8 0%, #f8fffb 100%);
          border-color: #aee9c8;
        }
        .consigai-pocket-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 84px;
          border-radius: 999px;
          padding: 4px 12px;
          margin-bottom: 10px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        .consigai-pocket-card.today .consigai-pocket-pill {
          background: #e8efff;
          color: #1e4fc4;
        }
        .consigai-pocket-card.after .consigai-pocket-pill {
          background: #dff8ea;
          color: #0a7c52;
        }
        .consigai-pocket-metric {
          display: grid;
          grid-template-columns: 34px minmax(0, 1fr);
          gap: 10px;
          align-items: center;
          padding: 9px 0;
          border-bottom: 1px solid #dfe7f5;
        }
        .consigai-pocket-metric:last-child {
          border-bottom: 0;
          padding-bottom: 0;
        }
        .consigai-pocket-icon {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 800;
          line-height: 1;
        }
        .consigai-pocket-icon svg {
          width: 18px;
          height: 18px;
          stroke: currentColor;
          fill: none;
          stroke-width: 1.9;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .consigai-pocket-card.today .consigai-pocket-icon {
          background: #eaf0ff;
          color: #1f51cc;
        }
        .consigai-pocket-card.after .consigai-pocket-icon {
          background: #e0f8ea;
          color: #0a7c52;
        }
        .consigai-pocket-label {
          font-size: 11px;
          font-weight: 600;
          color: #34508a;
          margin-bottom: 2px;
        }
        .consigai-pocket-val {
          font-size: clamp(16px, 2.1vw, 24px);
          font-weight: 900;
          letter-spacing: -.03em;
          color: #061a55;
          line-height: 1.05;
        }
        .consigai-pocket-val.negative { color: rgb(192, 0, 0); }
        .consigai-pocket-val.positive { color: #0a7c52; }
        .consigai-pocket-note {
          margin-top: 2px;
          color: #49649b;
          font-size: 10px;
          line-height: 1.2;
        }
        .consigai-pocket-gain {
          border-radius: 14px;
          border: 1.5px solid #0a7c52;
          background: linear-gradient(180deg, #fbfffd 0%, #f2fbf6 100%);
          padding: 14px 14px 12px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .consigai-pocket-gain-title {
          font-size: 12px;
          font-weight: 900;
          letter-spacing: .05em;
          text-transform: uppercase;
          color: #0a7c52;
          text-align: center;
        }
        .consigai-pocket-gain-hero {
          display: grid;
          grid-template-columns: 42px minmax(0, 1fr);
          gap: 10px;
          align-items: center;
          border-bottom: 1px solid #aee9c8;
          padding-bottom: 10px;
        }
        .consigai-pocket-gain-main-icon {
          width: 42px;
          height: 42px;
          border-radius: 999px;
          background: #0a7c52;
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 900;
        }
        .consigai-pocket-gain-main-icon svg {
          width: 22px;
          height: 22px;
          stroke: currentColor;
          fill: none;
          stroke-width: 2.2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .consigai-pocket-gain-kicker {
          font-size: 11px;
          color: #061a55;
          font-weight: 600;
          margin-bottom: 1px;
        }
        .consigai-pocket-gain-value {
          font-size: clamp(20px, 2.8vw, 34px);
          line-height: 1;
          letter-spacing: -.04em;
          color: #0a7c52;
          font-weight: 900;
        }
        .consigai-pocket-gain-copy {
          font-size: 12px;
          color: #061a55;
          font-weight: 700;
        }
        .consigai-pocket-gain-list {
          display: grid;
          gap: 8px;
        }
        .consigai-pocket-gain-item {
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
          background: #e0f8ea;
          color: #0a7c52;
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
          color: #0f2057;
          text-transform: uppercase;
          letter-spacing: .04em;
        }
        .consigai-pocket-gain-num {
          font-size: 16px;
          line-height: 1;
          color: #0a7c52;
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
          .consigai-pocket-visual { gap: 10px !important; }
          .consigai-pocket-card { padding: 12px 12px 10px !important; }
          .consigai-pocket-gain { padding: 12px 12px 10px !important; gap: 10px !important; }
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
          .consigai-pocket-visual { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important; }
          .consigai-pocket-card.today { grid-column: 1 !important; }
          .consigai-pocket-card.after { grid-column: 2 !important; }
          .consigai-pocket-gain {
            grid-column: 1 / -1 !important;
          }
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
          .consigai-pocket-visual { grid-template-columns: minmax(0, 1fr) !important; gap: 10px !important; }
          .consigai-pocket-card.today,
          .consigai-pocket-card.after,
          .consigai-pocket-gain {
            grid-column: 1 !important;
          }
          .consigai-pocket-gain-hero {
            grid-template-columns: 1fr !important;
            text-align: center !important;
            justify-items: center !important;
          }
          .consigai-pocket-gain-item {
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

      const textOf = (selector) => doc.querySelector(selector)?.textContent?.trim() || ''
      const salaryToday = textOf('.ba-col.today .ba-row:first-of-type .ba-row-val') || textOf('.ba-col.after .ba-row:first-of-type .ba-row-val')
      const installmentToday = `R$ ${PARCELA_HOJE.toLocaleString('pt-BR')}`
      const pocketToday = textOf('.ba-col.today .ba-total-val')
      const creditToday = textOf('.ba-col.today .ba-credit-val')

      const salaryAfter = textOf('.ba-col.after .ba-row:first-of-type .ba-row-val') || salaryToday
      const installmentAfter = textOf('#baNova') || textOf('.ba-col.after .ba-row:nth-of-type(2) .ba-row-val')
      const salaryUnified = salaryAfter || salaryToday || 'R$ 2.200'
      const pocketAfter = textOf('.ba-col.after .ba-total-val')
      const creditAfter = textOf('.ba-col.after .ba-credit-val')

      const ecoMensal = Math.max(0, parseCurrency(pocketAfter) - parseCurrency(pocketToday))
      const ecoAnual = ecoMensal * 12
      const creditoExtra = Math.max(0, parseCurrency(creditAfter) - parseCurrency(creditToday))

      const formatCurrencyClean = (value) => value.replace(/^[^0-9R$]*(?=R\$)/, '').trim()

      let visual = baSection.querySelector('.consigai-pocket-visual')
      if (!visual) {
        visual = doc.createElement('div')
        visual.className = 'consigai-pocket-visual'
        visual.innerHTML = `
          <article class="consigai-pocket-card today">
            <div class="consigai-pocket-pill">Hoje</div>
            <div class="consigai-pocket-metric">
              <span class="consigai-pocket-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M3 7h16a2 2 0 0 1 2 2v10H5a2 2 0 0 1-2-2V7Z"/><path d="M16 7V5.8a2 2 0 0 0-2.7-1.9L5 7"/><path d="M17 13h4"/><circle cx="17" cy="13" r="1"/></svg>
              </span>
              <div>
                <div class="consigai-pocket-label">Salário líquido</div>
                <div class="consigai-pocket-val" data-k="salaryToday"></div>
              </div>
            </div>
            <div class="consigai-pocket-metric">
              <span class="consigai-pocket-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6"/><path d="M9 13h6"/><path d="M9 17h3"/><circle cx="17" cy="17" r="2"/></svg>
              </span>
              <div>
                <div class="consigai-pocket-label">Parcela atual</div>
                <div class="consigai-pocket-val negative" data-k="installmentToday"></div>
              </div>
            </div>
            <div class="consigai-pocket-metric">
              <span class="consigai-pocket-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M19 10c1.2.4 2 1.5 2 2.8 0 1.7-1.3 3.2-3 3.2h-.4a6 6 0 0 1-11.2 0H6a3 3 0 0 1 0-6h.4A6 6 0 0 1 18 10Z"/><path d="M12 7v3"/><path d="M9 13h.01"/><path d="M15 13h.01"/><path d="M8 19v2"/><path d="M16 19v2"/></svg>
              </span>
              <div>
                <div class="consigai-pocket-label">Sobra no bolso</div>
                <div class="consigai-pocket-val" data-k="pocketToday"></div>
              </div>
            </div>
            <div class="consigai-pocket-metric">
              <span class="consigai-pocket-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/></svg>
              </span>
              <div>
                <div class="consigai-pocket-label">Crédito disponível</div>
                <div class="consigai-pocket-val" data-k="creditToday"></div>
                <div class="consigai-pocket-note">para emergências</div>
              </div>
            </div>
          </article>
          <article class="consigai-pocket-card after">
            <div class="consigai-pocket-pill">Com ConsigAI</div>
            <div class="consigai-pocket-metric">
              <span class="consigai-pocket-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M3 7h16a2 2 0 0 1 2 2v10H5a2 2 0 0 1-2-2V7Z"/><path d="M16 7V5.8a2 2 0 0 0-2.7-1.9L5 7"/><path d="M17 13h4"/><circle cx="17" cy="13" r="1"/></svg>
              </span>
              <div>
                <div class="consigai-pocket-label">Salário líquido</div>
                <div class="consigai-pocket-val" data-k="salaryAfter"></div>
              </div>
            </div>
            <div class="consigai-pocket-metric">
              <span class="consigai-pocket-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6"/><path d="M9 13h6"/><path d="M9 17h3"/><circle cx="17" cy="17" r="2"/></svg>
              </span>
              <div>
                <div class="consigai-pocket-label">Nova parcela</div>
                <div class="consigai-pocket-val positive" data-k="installmentAfter"></div>
              </div>
            </div>
            <div class="consigai-pocket-metric">
              <span class="consigai-pocket-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M19 10c1.2.4 2 1.5 2 2.8 0 1.7-1.3 3.2-3 3.2h-.4a6 6 0 0 1-11.2 0H6a3 3 0 0 1 0-6h.4A6 6 0 0 1 18 10Z"/><path d="M12 7v3"/><path d="M9 13h.01"/><path d="M15 13h.01"/><path d="M8 19v2"/><path d="M16 19v2"/></svg>
              </span>
              <div>
                <div class="consigai-pocket-label">Sobra no bolso</div>
                <div class="consigai-pocket-val positive" data-k="pocketAfter"></div>
              </div>
            </div>
            <div class="consigai-pocket-metric">
              <span class="consigai-pocket-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/></svg>
              </span>
              <div>
                <div class="consigai-pocket-label">Crédito disponível</div>
                <div class="consigai-pocket-val positive" data-k="creditAfter"></div>
                <div class="consigai-pocket-note">para emergências</div>
              </div>
            </div>
          </article>
          <aside class="consigai-pocket-gain">
            <div class="consigai-pocket-gain-title">Seu ganho com ConsigAI</div>
            <div class="consigai-pocket-gain-hero">
              <span class="consigai-pocket-gain-main-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="m3 17 6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>
              </span>
              <div>
                <div class="consigai-pocket-gain-kicker">Você ganha</div>
                <div class="consigai-pocket-gain-value" data-k="ecoMensal"></div>
                <div class="consigai-pocket-gain-copy">por mês no bolso</div>
              </div>
            </div>
            <div class="consigai-pocket-gain-list">
              <div class="consigai-pocket-gain-item">
                <span class="consigai-pocket-gain-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M8 2v4"/><path d="M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/><path d="m9 16 2 2 4-5"/></svg>
                </span>
                <div class="consigai-pocket-gain-label">Economia mensal</div>
                <div class="consigai-pocket-gain-num" data-k="ecoMensal"></div>
              </div>
              <div class="consigai-pocket-gain-item">
                <span class="consigai-pocket-gain-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M8 2v4"/><path d="M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/><path d="M8 14h8"/><path d="M8 18h5"/></svg>
                </span>
                <div class="consigai-pocket-gain-label">Economia anual</div>
                <div class="consigai-pocket-gain-num" data-k="ecoAnual"></div>
              </div>
              <div class="consigai-pocket-gain-item">
                <span class="consigai-pocket-gain-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/></svg>
                </span>
                <div class="consigai-pocket-gain-label">Crédito extra disponível</div>
                <div class="consigai-pocket-gain-num" data-k="creditoExtra"></div>
              </div>
            </div>
          </aside>
        `
        baSection.classList.add('consigai-pocket-redesign')
        baSection.insertBefore(visual, baCols)
      }

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
        visual.querySelectorAll(`[data-k="${key}"]`).forEach((el) => {
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
      const ctaSaving = doc?.querySelector('#ctaSaving')
      if (ctaSaving?.textContent) {
        const raw = ctaSaving.textContent.trim()
        const withPositiveSign = raw
          .replace(/^\s*[−-]\s*/, '+')
          .replace(/^R\$\s*/i, '+R$ ')
        ctaSaving.textContent = withPositiveSign
      }
    }

    const normalizeComConsigaiNovaParcela = (doc) => {
      if (!doc) return
      const baNova = doc.querySelector('#baNova')
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
      const ctaName = doc.querySelector('#ctaName')
      if (!ctaName) return
      if (idx === 2) {
        const sub = THIRD_CARD_SUB_OFFERS[selectedThirdSubOfferRef.current] || THIRD_CARD_SUB_OFFERS.contract
        ctaName.textContent = `Oferta escolhida: ${sub.label}`
        return
      }
      const selectedName = OFFER_CTA_NAMES[idx] || OFFER_CTA_NAMES[0]
      ctaName.textContent = `Oferta escolhida: ${selectedName}`
    }

    const applyThirdCardSubOfferSelection = (doc) => {
      if (!doc) return
      const miniCards = doc.querySelectorAll('#oc2 .consigai-offer-mini-card[data-suboffer]')
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

      const heroOld = doc.querySelector('.hc-col-val.old')
      if (heroOld) heroOld.textContent = parcelaHoje

      const todayDeduct = doc.querySelector('.ba-col.today .ba-row-val.deduct')
      if (todayDeduct) todayDeduct.textContent = parcelaHoje

      const oldValuesInCards = doc.querySelectorAll('.offers-grid .offer-val-num.old')
      oldValuesInCards.forEach((el) => {
        el.textContent = parcelaHoje
      })

      // Remove arrow markers between old/new values in offer cards.
      const arrowSpans = doc.querySelectorAll('.offers-grid .offer-val-block span')
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

    const getOfferCardSnapshot = (doc) => {
      const textOf = (selector, fallback = '') => doc.querySelector(selector)?.textContent?.trim() || fallback
      const economiaCard0 = parseCurrency(textOf('#oc0 .offer-val-num.green', 'R$ 70'))
      const parcela0Calculada = Math.max(PARCELA_HOJE - economiaCard0, 0)

      return {
        money0: textOf('#oc0 .offer-val-num.blue', 'R$ 3.000'),
        money1: textOf('#oc1 .offer-val-num.blue', 'R$ 500'),
        parcela0: formatCurrency(parcela0Calculada),
        parcela1: textOf('#oc1 .offer-val-num.green:last-child', 'R$ 168'),
      }
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
        .hc-col-val.old { color: rgb(192, 0, 0) !important; }
        .hc-col-val.new,
        .hc-saving-value,
        #hcNova,
        #hcEco {
          color: #0a7c52 !important;
        }
        .ba-row-val.deduct { color: rgb(192, 0, 0) !important; }
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
        .ba-section .consigai-pocket-val:not(.positive):not(.negative),
        .ba-section .consigai-pocket-card.today .consigai-pocket-pill,
        .ba-section .consigai-pocket-card.today .consigai-pocket-icon,
        .ba-section .consigai-pocket-card.after .consigai-pocket-label {
          color: #1a3d8f !important;
        }
        .btn-cta {
          background: linear-gradient(160deg, #1e4aaa, #12307a) !important;
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
          min-height: 266px !important;
          transition: all .18s ease !important;
          touch-action: manipulation !important;
          will-change: transform, box-shadow, border-color;
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
          transform: translateY(-1px) !important;
        }
        .offer-card:active {
          transform: scale(.998) !important;
        }

        .consigai-offer-card {
          height: 100%;
          display: flex;
          flex-direction: column;
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
        #oc2 .consigai-offer-lines {
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
          font-size: 11px;
          line-height: 1.15;
          color: #1a3d8f;
          font-weight: 800;
        }
        #oc2 .consigai-offer-mini-label {
          font-size: 10.5px;
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
        #oc2 .consigai-offer-mini-grid {
          gap: 8px;
          margin-top: 26px !important;
        }
        #oc2 .consigai-offer-mini-card {
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
        #oc2 .consigai-offer-mini-value {
          font-size: clamp(18px, 2.05vw, 22px);
          line-height: .98;
          letter-spacing: -.015em;
          min-width: 0;
          color: #2a8f73;
        }
        #oc2.offer-card.selected .consigai-offer-mini-card {
          border-color: #dbe6f7;
          background: #f7faff;
          box-shadow: none;
          transition: border-color .16s ease, box-shadow .16s ease, background .16s ease;
        }
        #oc2 .consigai-offer-mini-label {
          color: #355f9a;
        }
        #oc2.offer-card.selected .consigai-offer-mini-card.is-selected {
          border-color: #2454D6 !important;
          background: #eef5ff !important;
          box-shadow: 0 3px 10px rgba(35, 80, 200, .12) !important;
        }

        .consigai-offer-note {
          display: block;
          margin-top: 6px;
          min-height: 44px;
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
          min-height: 40px;
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
          font-size: 11px;
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
        #oc2 .consigai-offer-note {
          margin-top: auto;
        }

        @media (max-width: 1080px) {
          .offers-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          .offers-grid > .offer-card:nth-child(3) {
            grid-column: 1 / -1 !important;
            justify-self: center !important;
            width: min(520px, 100%) !important;
          }
        }

        @media (max-width: 760px) {
          .offers-grid {
            grid-template-columns: minmax(0, 1fr) !important;
            gap: 10px !important;
          }
          .offers-grid > .offer-card:nth-child(3) {
            grid-column: auto !important;
            justify-self: stretch !important;
            width: 100% !important;
          }
          .offer-card {
            min-height: auto !important;
            padding: 14px !important;
          }
          .consigai-offer-lines,
          #oc2 .consigai-offer-lines {
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
          #oc2 .consigai-offer-mini-grid {
            grid-template-columns: 1fr !important;
            gap: 8px !important;
          }
          #oc2 .consigai-offer-mini-label {
            font-size: 11px !important;
          }
        }
      `
      doc.head?.appendChild(styleEl)
      doc.body.dataset.consigaiOfferRedesignStyleApplied = '1'
    }

    const upsertOfferCardsRedesign = (doc) => {
      const card0 = doc.querySelector('#oc0')
      const card1 = doc.querySelector('#oc1')
      const card2 = doc.querySelector('#oc2')
      if (!card0 || !card1 || !card2) return

      // Keep cards stable after first render to improve tap/click responsiveness.
      const isAlreadyRedesigned =
        card0.querySelector('.consigai-offer-card') &&
        card1.querySelector('.consigai-offer-card') &&
        card2.querySelector('.consigai-offer-card')
      if (isAlreadyRedesigned) return

      const snapshot = getOfferCardSnapshot(doc)
      const totalEconomiaMensal = 'R$ 116/mês'
      const totalEconomiaParcelas = 'R$ 108/mês'
      const receiveFuture = 'até R$ 5.033'

      card0.innerHTML = `
        <div class="consigai-offer-card">
          <span class="consigai-hidden-state-badge badge sel" id="badge0">Selecionada</span>
          <div class="consigai-offer-title-row">
            <span class="consigai-offer-pill">Melhor Equilíbrio</span>
            <div class="consigai-offer-head-badges">
              <span class="consigai-offer-badge-rec">★ Recomendada</span>
            </div>
          </div>
          <div class="consigai-offer-lines">
            <div class="consigai-offer-line">
              <span class="consigai-offer-line-main blue">Receba ${snapshot.money0}</span>
              <span class="consigai-offer-line-helper">na sua conta</span>
            </div>
            <div class="consigai-offer-line">
              <span class="consigai-offer-line-main consigai-offer-total-stack">
                <span class="consigai-offer-total-label">
                  <span class="consigai-offer-word-orange">Economia total</span>
                </span>
                <span class="consigai-offer-value-green">${TOTAL_ECONOMIA}</span>
              </span>
            </div>
          </div>
          <div class="consigai-offer-metric">
            <span class="consigai-offer-metric-label">Parcela nova</span>
            <span class="consigai-offer-metric-value green">${snapshot.parcela0}</span>
          </div>
          <div class="consigai-offer-note">
            <span class="consigai-offer-note-text">
              <span class="consigai-offer-note-sub">Boa opção para quem quer dinheiro na conta, parcela menor e prazo mantido.</span>
            </span>
          </div>
        </div>
      `

      card1.innerHTML = `
        <div class="consigai-offer-card">
          <span class="consigai-hidden-state-badge badge pick" id="badge1">Escolher</span>
          <div class="consigai-offer-head"></div>
          <span class="consigai-offer-pill">Mais Folga por Mês</span>
          <div class="consigai-offer-lines">
            <div class="consigai-offer-line">
              <span class="consigai-offer-line-main blue">Receba ${snapshot.money1}</span>
              <span class="consigai-offer-line-helper">na sua conta</span>
            </div>
            <div class="consigai-offer-line">
              <span class="consigai-offer-line-main consigai-offer-total-stack">
                <span class="consigai-offer-total-label">
                  <span class="consigai-offer-word-orange">Redução na parcela</span>
                </span>
                <span class="consigai-offer-value-green">${totalEconomiaMensal}</span>
              </span>
            </div>
          </div>
          <div class="consigai-offer-metric">
            <span class="consigai-offer-metric-label">Parcela nova</span>
            <span class="consigai-offer-metric-value green">${snapshot.parcela1}</span>
          </div>
          <div class="consigai-offer-note">
            <span class="consigai-offer-note-text">
              <span class="consigai-offer-note-sub">Boa opção para quem quer aliviar o orçamento mensal sem receber um valor alto.</span>
            </span>
          </div>
        </div>
      `

      card2.innerHTML = `
        <div class="consigai-offer-card">
          <span class="consigai-hidden-state-badge badge pick" id="badge2">Escolher</span>
          <div class="consigai-offer-head"></div>
          <span class="consigai-offer-pill">Turbo Economia</span>
          <div class="consigai-offer-lines">
            <div class="consigai-offer-pretext">Economize sem pegar novo crédito</div>
            <div class="consigai-offer-mini-grid">
              <div class="consigai-offer-mini-card">
                <span class="consigai-offer-mini-label">No contrato</span>
                <span class="consigai-offer-mini-value">${TOTAL_ECONOMIA}</span>
              </div>
              <div class="consigai-offer-mini-card">
                <span class="consigai-offer-mini-label">Na parcela</span>
                <span class="consigai-offer-mini-value">${totalEconomiaParcelas}</span>
              </div>
            </div>
          </div>
          <div class="consigai-offer-note">
            <span class="consigai-offer-note-text">
              <span class="consigai-offer-note-sub">Boa opção para quem quer diminuir o impacto mensal no orçamento sem pegar dinheiro novo.</span>
            </span>
          </div>
        </div>
      `

      const subCardContract = card2.querySelector('.consigai-offer-mini-card:nth-child(1)')
      const subCardInstallment = card2.querySelector('.consigai-offer-mini-card:nth-child(2)')
      if (subCardContract) {
        subCardContract.setAttribute('data-suboffer', 'contract')
        subCardContract.setAttribute('role', 'button')
        subCardContract.setAttribute('tabindex', '0')
      }
      if (subCardInstallment) {
        subCardInstallment.setAttribute('data-suboffer', 'installment')
        subCardInstallment.setAttribute('role', 'button')
        subCardInstallment.setAttribute('tabindex', '0')
      }
      applyThirdCardSubOfferSelection(doc)
    }

    const goToSelectedOffer = () => {
      if (selectedOfferIndexRef.current === 2) {
        const thirdSub = THIRD_CARD_SUB_OFFERS[selectedThirdSubOfferRef.current] || THIRD_CARD_SUB_OFFERS.contract
        navigate(thirdSub.route)
        return
      }
      const selected = OFFER_ROUTES[selectedOfferIndexRef.current] || OFFER_ROUTES[0]
      navigate(selected.route, selected.state ? { state: selected.state } : undefined)
    }

    const keepSelectedCardInView = (doc, win, idx) => {
      if (!doc || !win) return
      const card = doc.querySelector(`#oc${idx}`)
      if (!card) return

      const cardRect = card.getBoundingClientRect()
      const topbarHeight = doc.querySelector('.topbar')?.getBoundingClientRect()?.height || 0
      const ctaHeight = doc.querySelector('.sticky-cta')?.getBoundingClientRect()?.height || 0
      const safeTop = topbarHeight + 8
      const safeBottom = win.innerHeight - ctaHeight - 8

      // Never auto-scroll upward on card selection. Only scroll down when needed.
      const downDelta = cardRect.bottom - safeBottom
      if (downDelta > 4) {
        const behavior = win.innerWidth <= 760 ? 'auto' : 'smooth'
        win.scrollBy({ top: downDelta + 8, behavior })
      }
    }

    const attachBridge = () => {
      const frame = iframeRef.current
      const frameWindow = frame?.contentWindow
      const frameDoc = frameWindow?.document

      if (!frameWindow || !frameDoc) return

      applyResponsiveStyles(frameDoc)
      enforceCurrencyNoBreak(frameDoc)
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
        currencyObserverRef.current = new MutationObserver(() => enforceCurrencyNoBreak(frameDoc))
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
          note.textContent = 'Compare as opções disponíveis para Reduzir sua Parcela, Receber Dinheiro Agora ou Economizar mais no Total dos Contratos.'
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

      if (typeof frameWindow.sel === 'function' && !frameWindow.__consigAIWrappedSel) {
        const originalSel = frameWindow.sel.bind(frameWindow)
        frameWindow.__consigAIWrappedSel = true
        frameWindow.sel = (idx) => {
          selectedOfferIndexRef.current = Number(idx) || 0
          frameWindow.__consigAISelectedOffer = selectedOfferIndexRef.current
          const result = originalSel(idx)
          normalizeCtaSaving(frameDoc)
          normalizeComConsigaiNovaParcela(frameDoc)
          normalizeCtaOfferName(frameDoc, selectedOfferIndexRef.current)
          frameWindow.requestAnimationFrame(() => {
            normalizeCtaSaving(frameDoc)
            normalizeComConsigaiNovaParcela(frameDoc)
            normalizeCtaOfferName(frameDoc, selectedOfferIndexRef.current)
            upsertOfferCardsRedesign(frameDoc)
            upsertPocketInsight(frameDoc)
            upsertSavingsReplacement(frameDoc)
            enforceCurrencyNoBreak(frameDoc)
          })
          return result
        }
      }

      if (frameDoc !== attachedDocRef.current) {
        if (attachedDocRef.current && clickHandlerRef.current) {
          attachedDocRef.current.removeEventListener('click', clickHandlerRef.current, true)
        }

        clickHandlerRef.current = (event) => {
          const target = event.target
          if (!target || target.nodeType !== 1) return

          const thirdSubCard = target.closest('#oc2 .consigai-offer-mini-card[data-suboffer]')
          if (thirdSubCard) {
            const subKey = thirdSubCard.getAttribute('data-suboffer')
            if (subKey && THIRD_CARD_SUB_OFFERS[subKey]) {
              selectedThirdSubOfferRef.current = subKey
              selectedOfferIndexRef.current = 2
              event.preventDefault()
              event.stopPropagation()
              if (typeof frameWindow.sel === 'function') {
                frameWindow.sel(2)
              }
              applyThirdCardSubOfferSelection(frameDoc)
              normalizeCtaOfferName(frameDoc, 2)
              return
            }
          }

          const offerCard = target.closest('.offer-card')
          if (offerCard?.id?.startsWith('oc')) {
            const idx = Number(offerCard.id.replace('oc', ''))
            if (!Number.isNaN(idx)) {
              selectedOfferIndexRef.current = idx
              if (typeof frameWindow.sel === 'function') {
                event.preventDefault()
                event.stopPropagation()
                frameWindow.sel(idx)
                return
              }
            }
          }

          const cta = target.closest('.btn-cta')
          if (cta) {
            event.preventDefault()
            goToSelectedOffer()
          }
        }

        frameDoc.addEventListener('click', clickHandlerRef.current, true)
        const ctaButton = frameDoc.querySelector('.btn-cta')
        if (ctaButton) {
          ctaButton.onclick = (event) => {
            event.preventDefault()
            goToSelectedOffer()
          }
        }
        attachedDocRef.current = frameDoc
      }
    }

    const handleLoad = () => attachBridge()

    const iframe = iframeRef.current
    iframe?.addEventListener('load', handleLoad)
    intervalId = setInterval(attachBridge, 400)
    attachBridge()

    return () => {
      iframe?.removeEventListener('load', handleLoad)
      if (intervalId) clearInterval(intervalId)
      currencyObserverRef.current?.disconnect?.()
      currencyObserverRef.current = null
      if (attachedDocRef.current && clickHandlerRef.current) {
        attachedDocRef.current.removeEventListener('click', clickHandlerRef.current, true)
      }
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

