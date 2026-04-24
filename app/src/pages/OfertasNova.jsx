import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const OFFER_ROUTES = [
  { route: '/estrategia-combinada', state: { strategyType: 'novo contrato + economia' } },
  { route: '/estrategia-combinada', state: { strategyType: 'refin + economia' } },
  { route: '/portabilidade' },
]
const TOTAL_ECONOMIA = 'R$ 2.399'
const PARCELA_HOJE = 284

export default function OfertasNova() {
  const navigate = useNavigate()
  const iframeRef = useRef(null)
  const selectedOfferIndexRef = useRef(0)
  const attachedDocRef = useRef(null)
  const clickHandlerRef = useRef(null)
  const currencyObserverRef = useRef(null)

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
          color: #08783a;
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
          color: #0f9d4a;
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
        .consigai-pocket-val.negative { color: #d73232; }
        .consigai-pocket-val.positive { color: #0f9d4a; }
        .consigai-pocket-note {
          margin-top: 2px;
          color: #49649b;
          font-size: 10px;
          line-height: 1.2;
        }
        .consigai-pocket-gain {
          border-radius: 14px;
          border: 1.5px solid #0f9d4a;
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
          color: #08783a;
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
          background: #0f9d4a;
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
          color: #0f9d4a;
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
          color: #0f9d4a;
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
          color: #0f9d4a;
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
          color: #0f9d4a;
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
          .hero { padding: 22px 24px !important; margin-bottom: 14px !important; gap: 20px !important; }
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
          .hero { padding: 22px 18px !important; gap: 18px !important; }
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

      const formatDeduct = (value) => {
        const clean = value.replace(/^\s*[−-]\s*/, '').trim()
        return clean ? `- ${clean}` : value
      }

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
                <div class="consigai-pocket-label">Credito disponivel</div>
                <div class="consigai-pocket-val" data-k="creditToday"></div>
                <div class="consigai-pocket-note">para emergencias</div>
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
                <div class="consigai-pocket-val negative" data-k="installmentAfter"></div>
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
                <div class="consigai-pocket-label">Credito disponivel</div>
                <div class="consigai-pocket-val positive" data-k="creditAfter"></div>
                <div class="consigai-pocket-note">para emergencias</div>
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
                <div class="consigai-pocket-gain-kicker">Voce ganha</div>
                <div class="consigai-pocket-gain-value" data-k="ecoMensal"></div>
                <div class="consigai-pocket-gain-copy">por mes no bolso</div>
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
                <div class="consigai-pocket-gain-label">Credito extra disponivel</div>
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
        installmentToday: formatDeduct(installmentToday),
        pocketToday,
        creditToday,
        salaryAfter: salaryAfter || salaryUnified,
        salaryUnified,
        installmentAfter: formatDeduct(installmentAfter),
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
        ctaSaving.textContent = ctaSaving.textContent.replace(/^\s*[−-]\s*/, '')
      }
    }

    const applyUnifiedParcelaHoje = (doc) => {
      if (!doc) return
      const parcelaHoje = `R$ ${PARCELA_HOJE.toLocaleString('pt-BR')}`

      const heroOld = doc.querySelector('.hc-col-val.old')
      if (heroOld) heroOld.textContent = parcelaHoje

      const todayDeduct = doc.querySelector('.ba-col.today .ba-row-val.deduct')
      if (todayDeduct) todayDeduct.textContent = `− ${parcelaHoje}`

      const oldValuesInCards = doc.querySelectorAll('.offers-grid .offer-val-num.old')
      oldValuesInCards.forEach((el) => {
        el.textContent = parcelaHoje
      })

      // Remove arrow markers between old/new values in offer cards.
      const arrowSpans = doc.querySelectorAll('.offers-grid .offer-val-block span')
      arrowSpans.forEach((el) => {
        const raw = (el.textContent || '').trim()
        if (raw === '→' || raw === 'â†’' || raw === '->') {
          el.style.display = 'none'
        }
      })
      normalizeCtaSaving(doc)
    }

    const goToSelectedOffer = () => {
      const selected = OFFER_ROUTES[selectedOfferIndexRef.current] || OFFER_ROUTES[0]
      navigate(selected.route, selected.state ? { state: selected.state } : undefined)
    }

    const attachBridge = () => {
      const frame = iframeRef.current
      const frameWindow = frame?.contentWindow
      const frameDoc = frameWindow?.document

      if (!frameWindow || !frameDoc) return

      applyResponsiveStyles(frameDoc)
      enforceCurrencyNoBreak(frameDoc)
      applyUnifiedParcelaHoje(frameDoc)
      upsertPocketInsight(frameDoc)
      upsertSavingsReplacement(frameDoc)

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

      if (!frameDoc.body?.dataset?.consigaiCardNameStyleApplied) {
        const styleEl = frameDoc.createElement('style')
        styleEl.textContent = `
          .offer-name {
            color: #001851 !important;
            font-size: 12px !important;
            font-weight: 800 !important;
            letter-spacing: .075em !important;
          }
          .hero-sub {
            display: none !important;
          }
          .hc-col-val.old {
            color: #d03030 !important;
          }
          .offer-val-num.old {
            display: none !important;
          }
          .offer-values {
            justify-content: center !important;
            align-items: center !important;
            text-align: center !important;
          }
          .offer-val-block {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 4px !important;
            text-align: center !important;
          }
          .offer-val-label,
          .offer-val-num {
            width: 100% !important;
            text-align: center !important;
          }
          .badge.pick,
          .badge.sel {
            display: none !important;
          }
          .offer-card.selected {
            border: 2px solid #2350c8 !important;
            box-shadow: 0 0 0 2px rgba(35, 80, 200, .16), var(--shadow-md) !important;
          }
          .offer-card.selected::before {
            display: none !important;
          }
        `
        frameDoc.head?.appendChild(styleEl)
        frameDoc.body.dataset.consigaiCardNameStyleApplied = '1'
      }

      if (!frameDoc.body?.dataset?.consigaiOfferCardAdjusted) {
        const firstCard = frameDoc.querySelector('#oc0')
        const thirdCard = frameDoc.querySelector('#oc2')

        const firstBlocks = firstCard?.querySelectorAll('.offer-val-block')
        const firstSecondBlock = firstBlocks?.[1]
        const firstLabel = firstSecondBlock?.querySelector('.offer-val-label')
        const firstValue = firstSecondBlock?.querySelector('.offer-val-num.green')

        const thirdBlocks = thirdCard?.querySelectorAll('.offer-val-block')
        const thirdFirstBlock = thirdBlocks?.[0]
        const thirdLabel = thirdFirstBlock?.querySelector('.offer-val-label')
        const thirdValue = thirdFirstBlock?.querySelector('.offer-val-num.green')

        if (firstLabel && firstValue && thirdLabel && thirdValue) {
          firstLabel.textContent = 'ECONOMIA TOTAL'
          firstValue.textContent = TOTAL_ECONOMIA

          thirdLabel.textContent = 'ECONOMIA TOTAL'
          thirdValue.textContent = TOTAL_ECONOMIA

          frameDoc.body.dataset.consigaiOfferCardAdjusted = '1'
        }
      }

      if (!frameDoc.body?.dataset?.consigaiThirdCardOuApplied) {
        const thirdValues = frameDoc.querySelector('#oc2 .offer-values')
        const blocks = thirdValues?.querySelectorAll('.offer-val-block')
        if (thirdValues && blocks && blocks.length >= 2 && !thirdValues.querySelector('.consigai-ou')) {
          const ou = frameDoc.createElement('span')
          ou.className = 'consigai-ou'
          ou.textContent = 'OU'
          ou.style.alignSelf = 'center'
          ou.style.fontSize = '21px'
          ou.style.fontWeight = '800'
          ou.style.letterSpacing = '-.03em'
          ou.style.lineHeight = '1'
          ou.style.color = '#2350c8'
          ou.style.whiteSpace = 'nowrap'
          thirdValues.insertBefore(ou, blocks[1])
          frameDoc.body.dataset.consigaiThirdCardOuApplied = '1'
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
          note.textContent = 'As opções com maior foco em reduzir impacto mensal.'
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
          frameWindow.requestAnimationFrame(() => {
            normalizeCtaSaving(frameDoc)
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

          const offerCard = target.closest('.offer-card')
          if (offerCard?.id?.startsWith('oc')) {
            const idx = Number(offerCard.id.replace('oc', ''))
            if (!Number.isNaN(idx)) selectedOfferIndexRef.current = idx
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
