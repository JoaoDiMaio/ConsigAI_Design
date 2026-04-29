import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOffersData } from '../hooks/useOffersData.js'
import { THIRD_CARD_SUB_OFFERS } from '../data/offersMock.js'
import {
  fmt,
  getEcoMensal,
  getParcelaNova,
  formatCurrencyClean,
  normalizeMojibakeText,
  likelyNeedsTextNormalization,
} from '../lib/offerUtils.js'
import {
  RESPONSIVE_STYLES_CSS,
  OFFER_CARD_REDESIGN_CSS,
} from '../styles/iframeOfertasStyles.js'

// ---------------------------------------------------------------------------
// DOM cache helpers — necessários enquanto o HTML da oferta for um iframe externo
// ---------------------------------------------------------------------------
function makeDomCache() {
  return { doc: null, nodes: new Map(), lists: new Map() }
}

function ensureDocCache(cacheRef, doc) {
  if (!doc) return null
  if (cacheRef.current.doc !== doc) {
    cacheRef.current = { doc, nodes: new Map(), lists: new Map() }
  }
  return cacheRef.current
}

function clearDocCache(cacheRef, doc) {
  const cache = ensureDocCache(cacheRef, doc)
  if (!cache) return
  cache.nodes.clear()
  cache.lists.clear()
}

function getCachedNode(cacheRef, doc, key, selector, scope = doc) {
  const cache = ensureDocCache(cacheRef, doc)
  if (!cache) return null
  const cached = cache.nodes.get(key)
  if (cached && cached.isConnected) return cached
  const found = scope?.querySelector(selector) || null
  cache.nodes.set(key, found)
  return found
}

function getCachedNodeList(cacheRef, doc, key, selector, scope = doc) {
  const cache = ensureDocCache(cacheRef, doc)
  if (!cache) return []
  const cached = cache.lists.get(key)
  if (Array.isArray(cached) && cached.every((n) => n?.isConnected)) return cached
  const list = Array.from(scope?.querySelectorAll(selector) || [])
  cache.lists.set(key, list)
  return list
}

// ---------------------------------------------------------------------------
// Normalização de texto no documento do iframe
// ---------------------------------------------------------------------------
function normalizeTextNodesInDocument(doc) {
  if (!doc?.body) return false
  let changed = false
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT)
  let node = walker.nextNode()
  while (node) {
    const original = node.nodeValue || ''
    const mojibakeFixed = normalizeMojibakeText(original)
    const currencyFixed = mojibakeFixed.includes('R$ ')
      ? mojibakeFixed.replace(/R\$\s(?=\d)/g, 'R$ ')
      : mojibakeFixed
    if (currencyFixed !== original) {
      node.nodeValue = currencyFixed
      changed = true
    }
    node = walker.nextNode()
  }
  return changed
}

// ---------------------------------------------------------------------------
// Injeção de estilos no iframe
// ---------------------------------------------------------------------------
function applyResponsiveStyles(doc) {
  if (!doc || doc.body?.dataset?.consigaiResponsiveStyleApplied) return
  const styleEl = doc.createElement('style')
  styleEl.textContent = RESPONSIVE_STYLES_CSS
  doc.head?.appendChild(styleEl)
  doc.body.dataset.consigaiResponsiveStyleApplied = '1'
}

function applyOfferCardRedesignStyles(doc) {
  if (doc.body?.dataset?.consigaiOfferRedesignStyleApplied) return
  const styleEl = doc.createElement('style')
  styleEl.textContent = OFFER_CARD_REDESIGN_CSS
  doc.head?.appendChild(styleEl)
  doc.body.dataset.consigaiOfferRedesignStyleApplied = '1'
}

// ---------------------------------------------------------------------------
// Seção de impacto no bolso
// ---------------------------------------------------------------------------
function upsertPocketInsight(doc, selectedEntry, usuario, impacto) {
  if (!doc) return
  const baSection = doc.querySelector('.ba-section')
  const baCols = baSection?.querySelector('.ba-cols')
  if (!baSection || !baCols) return

  const o = selectedEntry?.data ?? {
    creditoReceber: impacto.creditToday,
    parcelaNova: usuario.parcelaAtual,
    economiaParcela: 0,
  }
  const parcelaNova = o.parcelaNova ?? (usuario.parcelaAtual - (o.economiaParcela ?? 0))
  const sobraAtual = usuario.salarioBruto - usuario.parcelaAtual
  const sobraDepois = usuario.salarioBruto - parcelaNova
  const creditoAtual = impacto.creditToday
  const creditoDepois = o.creditoReceber ?? creditoAtual
  const salaryUnified = fmt(usuario.salarioBruto)
  const installmentToday = fmt(usuario.parcelaAtual)
  const installmentAfter = getParcelaNova(o, usuario.parcelaAtual)
  const pocketToday = fmt(sobraAtual)
  const pocketAfter = fmt(sobraDepois)
  const creditToday = fmt(creditoAtual)
  const creditAfter = fmt(creditoDepois)
  const ecoMensal = getEcoMensal(o, usuario.parcelaAtual)
  const ecoAnual = ecoMensal * 12
  const creditoExtra = Math.max(0, creditoDepois - creditoAtual)

  const baTitle = baSection.querySelector('.ba-title')
  const baSub = baSection.querySelector('.ba-sub')
  const baHeader = baSection.querySelector('.ba-header')
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
    salaryUnified,
    installmentToday: formatCurrencyClean(installmentToday),
    pocketToday,
    creditToday,
    installmentAfter: formatCurrencyClean(installmentAfter),
    pocketAfter,
    creditAfter,
    ecoMensal: `+${fmt(ecoMensal)}`,
    ecoAnual: `+${fmt(ecoAnual)}`,
    creditoExtra: `+${fmt(creditoExtra)}`,
  }
  Object.entries(values).forEach(([key, val]) => {
    baSection.querySelectorAll(`[data-k="${key}"]`).forEach((el) => {
      el.textContent = val
    })
  })
}

// ---------------------------------------------------------------------------
// Trust badges (substituição do savings-banner)
// ---------------------------------------------------------------------------
function upsertSavingsReplacement(doc) {
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

  // .savings-banner oculto via OFFER_CARD_REDESIGN_CSS
}


// ---------------------------------------------------------------------------
// Normalizações de texto do CTA / valores do iframe
// ---------------------------------------------------------------------------
function normalizeCtaSaving(cacheRef, doc) {
  const ctaSaving = getCachedNode(cacheRef, doc, 'ctaSaving', '#ctaSaving')
  if (ctaSaving?.textContent) {
    ctaSaving.textContent = ctaSaving.textContent
      .trim()
      .replace(/^\s*[-−]\s*/, '+')
      .replace(/^R\$\s*/i, '+R$ ')
      .replace(/^([^+])/, '+$1')
  }
}

function normalizeComConsigaiNovaParcela(cacheRef, doc) {
  if (!doc) return
  const baNova = getCachedNode(cacheRef, doc, 'baNova', '#baNova')
  if (baNova?.textContent) {
    baNova.textContent = baNova.textContent.replace(/^[^0-9R$]*(?=R\$)/, '').trim()
  }
  const afterRowLabel = baNova?.closest('.ba-row')?.querySelector('.ba-row-label')
  if (afterRowLabel) afterRowLabel.textContent = 'Nova parcela'
}

function normalizeCtaOfferName(cacheRef, doc, selectedEntry, hasNoOffer, selectedThirdSubOffer) {
  if (!doc) return
  const ctaName = getCachedNode(cacheRef, doc, 'ctaName', '#ctaName')
  if (!ctaName) return
  if (hasNoOffer || !selectedEntry) {
    ctaName.textContent = 'Oferta escolhida: sem oferta disponivel'
    return
  }
  if (selectedEntry.config.id === 'turbo') {
    const sub = THIRD_CARD_SUB_OFFERS[selectedThirdSubOffer] || THIRD_CARD_SUB_OFFERS.contract
    ctaName.textContent = `Oferta escolhida: ${sub.label}`
    return
  }
  ctaName.textContent = `Oferta escolhida: ${selectedEntry.config.ctaName}`
}

function applyThirdCardSubOfferSelection(cacheRef, doc, selectedThirdSubOffer) {
  if (!doc) return
  const miniCards = getCachedNodeList(
    cacheRef, doc,
    'turboMiniCards',
    '.offer-card.turbo-offer .consigai-offer-mini-card[data-suboffer]',
  )
  miniCards.forEach((card) => {
    const key = card.getAttribute('data-suboffer')
    const active = key === selectedThirdSubOffer
    card.classList.toggle('is-selected', active)
    card.setAttribute('aria-pressed', active ? 'true' : 'false')
  })
}

function applyUnifiedParcelaHoje(cacheRef, doc, selectedEntry, usuario) {
  if (!doc) return
  const parcelaHoje = fmt(usuario.parcelaAtual)

  const heroOld = getCachedNode(cacheRef, doc, 'heroOld', '.hc-col-val.old')
  if (heroOld) heroOld.textContent = parcelaHoje

  const heroNew = getCachedNode(cacheRef, doc, 'heroNew', '.hc-col-val.new, #hcNova')
  if (heroNew) {
    heroNew.textContent = selectedEntry?.data
      ? getParcelaNova(selectedEntry.data, usuario.parcelaAtual)
      : 'R$ 0'
  }

  const eco = selectedEntry?.data
    ? Math.max(0, getEcoMensal(selectedEntry.data, usuario.parcelaAtual))
    : 0
  const ecoFmt = fmt(eco)

  const heroEco = getCachedNode(cacheRef, doc, 'heroEco', '.hc-saving-value, #hcEco')
  if (heroEco) heroEco.textContent = ecoFmt

  const ctaSaving = getCachedNode(cacheRef, doc, 'ctaSaving', '#ctaSaving')
  if (ctaSaving) ctaSaving.textContent = `+${ecoFmt}/mês`

  const todayDeduct = getCachedNode(cacheRef, doc, 'todayDeduct', '.ba-col.today .ba-row-val.deduct')
  if (todayDeduct) todayDeduct.textContent = parcelaHoje

  const oldValuesInCards = getCachedNodeList(cacheRef, doc, 'oldValuesInCards', '.offers-grid .offer-val-num.old')
  oldValuesInCards.forEach((el) => { el.textContent = parcelaHoje })

  // Esconder marcadores de seta entre valor antigo e novo nos cards
  const arrowSpans = getCachedNodeList(cacheRef, doc, 'arrowSpans', '.offers-grid .offer-val-block span')
  arrowSpans.forEach((el) => {
    const raw = (el.textContent || '').trim()
    // Setas legadas do HTML do iframe — sem classe CSS disponível para override
    if (raw === '?' || raw === '→' || raw === '->') el.style.display = 'none'
  })
}

// ---------------------------------------------------------------------------
// Renderização dos cards de oferta no grid do iframe
// ---------------------------------------------------------------------------
function buildOfferCardHtml(entry, idx, usuario) {
  const { config: cfg, data: offer, isRecommended } = entry

  if (cfg.id === 'turbo') {
    const economiaContrato = fmt(offer.economiaContrato ?? offer.economiaTotal ?? 0)
    const economiaParcela = `${fmt(offer.economiaParcela ?? getEcoMensal(offer, usuario.parcelaAtual))}/mês`
    return `
      <div class="offer-card turbo-offer" id="oc${idx}" role="button" tabindex="0" aria-selected="false">
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
  const isSimple = cfg.kind === 'simples'
  const showSecondaryLine = !isSimple

  let totalLabel = 'Parcela estimada em'
  let totalValue = getParcelaNova(offer, usuario.parcelaAtual)
  let metricLabel = 'Economia de'
  let metricValue = `${fmt(getEcoMensal(offer, usuario.parcelaAtual))}/mês`

  if (cfg.id === 'equilibrio') {
    totalLabel = 'Economize nos Contratos'
    totalValue = fmt(offer.economiaTotal ?? (getEcoMensal(offer, usuario.parcelaAtual) * 12))
    metricLabel = 'Parcela nova'
    metricValue = getParcelaNova(offer, usuario.parcelaAtual)
  } else if (cfg.id === 'folga') {
    totalLabel = 'Reduza a parcela para'
    totalValue = getParcelaNova(offer, usuario.parcelaAtual)
    metricLabel = 'Economia de'
    metricValue = `${fmt(offer.reducaoMensal ?? getEcoMensal(offer, usuario.parcelaAtual))}/mês`
  } else if (isSimple) {
    metricLabel = 'Parcela'
    metricValue = getParcelaNova(offer, usuario.parcelaAtual)
  }

  const isSimpleContract = cfg.id === 'apenas_novo' || cfg.id === 'apenas_refin'
  const simpleMiniLabelSecond = isSimpleContract ? 'Qtd Parcelas' : metricLabel
  const simpleMiniValueSecond = isSimpleContract ? String(offer.qtdParcelas ?? '—') : metricValue

  return `
    <div class="offer-card${isSimple ? ' simple-offer' : ''}" id="oc${idx}" role="button" tabindex="0" aria-selected="false">
      <div class="consigai-offer-card">
        <span class="consigai-hidden-state-badge badge pick" id="badge${idx}">Escolher</span>
        ${isRecommended
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
        ${isSimple
          ? `<div class="consigai-offer-mini-grid">
               <div class="consigai-offer-mini-card">
                 <span class="consigai-offer-mini-label">${metricLabel}</span>
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
}

function upsertOfferCardsRedesign(cacheRef, doc, activeOffers, selectedOfferIndexRef, usuario, selectedThirdSubOffer) {
  const offersGrid = getCachedNode(cacheRef, doc, 'offersGrid', '.offers-grid')
  if (!offersGrid) return

  const selectedIdx = activeOffers.length
    ? Math.min(selectedOfferIndexRef.current, activeOffers.length - 1)
    : 0
  selectedOfferIndexRef.current = selectedIdx

  if (!activeOffers.length) {
    const noOfferMarkup = `
      <div class="offer-card selected" id="oc0" role="button" tabindex="0" aria-selected="true">
        <div class="consigai-offer-card">
          <div class="consigai-offer-title-row">
            <span class="consigai-offer-pill">Sem oferta disponivel</span>
          </div>
          <div class="consigai-offer-lines consigai-offer-lines--no-min-height">
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
      clearDocCache(cacheRef, doc)
    }
    syncOfferSelectionUi(cacheRef, doc, selectedOfferIndexRef, true)
    return
  }

  const cardsHtml = activeOffers
    .map((entry, idx) => buildOfferCardHtml(entry, idx, usuario))
    .join('')

  if (offersGrid.innerHTML !== cardsHtml) {
    offersGrid.innerHTML = cardsHtml
    clearDocCache(cacheRef, doc)
  }
  syncOfferSelectionUi(cacheRef, doc, selectedOfferIndexRef, false)
  applyThirdCardSubOfferSelection(cacheRef, doc, selectedThirdSubOffer)
}

function syncOfferSelectionUi(cacheRef, doc, selectedOfferIndexRef, hasNoOffer) {
  if (!doc) return
  const offerCards = getCachedNodeList(cacheRef, doc, 'offerCards', '.offers-grid .offer-card')
  if (!offerCards.length) return
  const selectedIdx = hasNoOffer
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

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------
export default function OfertasNova() {
  const navigate = useNavigate()
  const { activeOffers, usuario, impacto, loading, error } = useOffersData()

  const iframeRef = useRef(null)
  const selectedOfferIndexRef = useRef(0)
  const selectedThirdSubOfferRef = useRef('contract')
  const attachedDocRef = useRef(null)
  const clickHandlerRef = useRef(null)
  const currencyObserverRef = useRef(null)
  const docQueryCacheRef = useRef(makeDomCache())

  // Refs para dados da API — permitem closures do useEffect lerem sempre o valor atual
  const activeOffersRef = useRef(activeOffers)
  const usuarioRef = useRef(usuario)
  const impactoRef = useRef(impacto)
  useEffect(() => {
    activeOffersRef.current = activeOffers
    usuarioRef.current = usuario
    impactoRef.current = impacto
  }, [activeOffers, usuario, impacto])

  useEffect(() => {
    let normalizationTimer = null
    let skipObserverUntil = 0
    let intervalId = null

    const scheduleTextNormalization = (doc) => {
      if (!doc?.body || normalizationTimer) return
      normalizationTimer = setTimeout(() => {
        normalizationTimer = null
        skipObserverUntil = Date.now() + 50
        normalizeTextNodesInDocument(doc)
      }, 40)
    }

    const getSelectedEntry = () => {
      const offers = activeOffersRef.current
      const idx = selectedOfferIndexRef.current
      return offers[idx] ?? offers[0] ?? null
    }

    const applyAllBridgeUpdates = (doc, offers, selectedEntry) => {
      const u = usuarioRef.current
      const imp = impactoRef.current
      const hasNoOffer = offers.length === 0
      const subOffer = selectedThirdSubOfferRef.current
      applyUnifiedParcelaHoje(docQueryCacheRef, doc, selectedEntry, u)
      upsertOfferCardsRedesign(docQueryCacheRef, doc, offers, selectedOfferIndexRef, u, subOffer)
      upsertPocketInsight(doc, selectedEntry, u, imp)
      upsertSavingsReplacement(doc)
      normalizeCtaSaving(docQueryCacheRef, doc)
      normalizeComConsigaiNovaParcela(docQueryCacheRef, doc)
      normalizeCtaOfferName(docQueryCacheRef, doc, selectedEntry, hasNoOffer, subOffer)
      normalizeTextNodesInDocument(doc)
    }

    const refreshSelectedOfferUi = (doc, idx) => {
      selectedOfferIndexRef.current = idx
      const offers = activeOffersRef.current
      const selectedEntry = offers[idx] ?? offers[0] ?? null
      applyAllBridgeUpdates(doc, offers, selectedEntry)
    }

    const attachBridge = () => {
      const frame = iframeRef.current
      const frameDoc = frame?.contentWindow?.document
      if (!frameDoc) return
      if (!getCachedNode(docQueryCacheRef, frameDoc, 'offersGrid', '.offers-grid')) return

      applyResponsiveStyles(frameDoc)
      applyOfferCardRedesignStyles(frameDoc)
      applyAllBridgeUpdates(frameDoc, activeOffersRef.current, getSelectedEntry())

      if (!frameDoc.body?.dataset?.consigaiCurrencyObserverAttached) {
        currencyObserverRef.current?.disconnect?.()
        currencyObserverRef.current = new MutationObserver((mutations) => {
          if (Date.now() < skipObserverUntil) return
          const shouldNormalize = mutations.some((m) => {
            if (m.type === 'characterData') return likelyNeedsTextNormalization(m.target?.nodeValue || '')
            if (m.type !== 'childList') return false
            return Array.from(m.addedNodes || []).some((n) => likelyNeedsTextNormalization(n?.textContent || ''))
          })
          if (shouldNormalize) scheduleTextNormalization(frameDoc)
        })
        currencyObserverRef.current.observe(frameDoc.body, { childList: true, subtree: true, characterData: true })
        frameDoc.body.dataset.consigaiCurrencyObserverAttached = '1'
      }

      if (!frameDoc.body?.dataset?.consigaiLegacyLogoApplied) {
        const logoEl = frameDoc.querySelector('.topbar .logo')
        if (logoEl) {
          logoEl.innerHTML = '<img src="/logo-antigo.svg" alt="ConsigAI" />'
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
            heroTextContainer.appendChild(note)
          }
          note.textContent =
            'Compare as opcoes para reduzir parcela, economizar no total, ou seguir em ofertas diretas como apenas novo contrato e apenas refinanciamento.'
        }
        // .section-header oculto via OFFER_CARD_REDESIGN_CSS

        frameDoc.body.dataset.consigaiHeroSectionCopyAdjusted = '1'
      }

      if (!frameDoc.body?.dataset?.consigaiLogoTextApplied) {
        const afterTag = frameDoc.querySelector('.ba-col.after .ba-col-tag')
        if (afterTag) {
          const textNode = Array.from(afterTag.childNodes).find((n) => n.nodeType === Node.TEXT_NODE)
          if (textNode) textNode.nodeValue = ' ConsigAI'
          else afterTag.appendChild(frameDoc.createTextNode(' ConsigAI'))
          frameDoc.body.dataset.consigaiLogoTextApplied = '1'
        }
      }

      if (frameDoc !== attachedDocRef.current) {
        if (attachedDocRef.current && clickHandlerRef.current) {
          attachedDocRef.current.removeEventListener('click', clickHandlerRef.current, true)
        }

        const navigateToOffer = () => {
          const selected = activeOffersRef.current[selectedOfferIndexRef.current]
          if (!selected) return
          const cfg = selected.config
          if (cfg.id === 'turbo') {
            const sub = THIRD_CARD_SUB_OFFERS[selectedThirdSubOfferRef.current] || THIRD_CARD_SUB_OFFERS.contract
            navigate(sub.route)
          } else {
            navigate(cfg.route, cfg.state ? { state: cfg.state } : undefined)
          }
        }

        clickHandlerRef.current = (event) => {
          const rawTarget = event.target
          const target = rawTarget?.nodeType === 1 ? rawTarget : rawTarget?.parentElement
          if (!target) return

          const thirdSubCard = target.closest('.offer-card.turbo-offer .consigai-offer-mini-card[data-suboffer]')
          if (thirdSubCard) {
            const subKey = thirdSubCard.getAttribute('data-suboffer')
            if (subKey && THIRD_CARD_SUB_OFFERS[subKey]) {
              const turboCard = thirdSubCard.closest('.offer-card.turbo-offer')
              const turboIdx = turboCard?.id?.startsWith('oc')
                ? Number(turboCard.id.replace('oc', ''))
                : NaN
              if (Number.isNaN(turboIdx)) return
              selectedThirdSubOfferRef.current = subKey
              selectedOfferIndexRef.current = turboIdx
              event.preventDefault()
              event.stopPropagation()
              refreshSelectedOfferUi(frameDoc, turboIdx)
              return
            }
          }

          const offerCard = target.closest('.offer-card')
          if (offerCard?.id?.startsWith('oc')) {
            if (activeOffersRef.current.length === 0) return
            const idx = Number(offerCard.id.replace('oc', ''))
            if (!Number.isNaN(idx)) {
              selectedOfferIndexRef.current = idx
              event.preventDefault()
              event.stopPropagation()
              refreshSelectedOfferUi(frameDoc, idx)
              return
            }
          }

          const cta = target.closest('.btn-cta')
          if (cta) {
            event.preventDefault()
            navigateToOffer()
          }
        }

        frameDoc.addEventListener('click', clickHandlerRef.current, true)

        const ctaButton = getCachedNode(docQueryCacheRef, frameDoc, 'ctaButton', '.btn-cta')
        if (ctaButton) {
          ctaButton.onclick = (event) => { event.preventDefault(); navigateToOffer() }
        }
        attachedDocRef.current = frameDoc
      }

      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    }

    const MAX_POLL_ATTEMPTS = 25 // 25 × 400ms = 10s máximo
    let pollAttempts = 0

    const attachBridgeWithLimit = () => {
      attachBridge()
      if (++pollAttempts >= MAX_POLL_ATTEMPTS && intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    }

    const iframe = iframeRef.current
    const handleIframeLoad = () => { pollAttempts = 0; attachBridge() }
    iframe?.addEventListener('load', handleIframeLoad)
    intervalId = setInterval(attachBridgeWithLimit, 400)
    attachBridge()

    return () => {
      iframe?.removeEventListener('load', handleIframeLoad)
      if (intervalId) clearInterval(intervalId)
      if (normalizationTimer) clearTimeout(normalizationTimer)
      currencyObserverRef.current?.disconnect?.()
      currencyObserverRef.current = null
      if (attachedDocRef.current && clickHandlerRef.current) {
        attachedDocRef.current.removeEventListener('click', clickHandlerRef.current, true)
      }
      docQueryCacheRef.current = makeDomCache()
    }
  }, [navigate])

  if (error) {
    return (
      <div className="offers-error-screen">
        <span className="offers-error-screen__icon" aria-hidden="true">⚠️</span>
        <p className="offers-error-screen__title">Erro ao carregar ofertas</p>
        <p className="offers-error-screen__msg">{error}</p>
      </div>
    )
  }

  return (
    <>
      {loading && <div className="offers-loading-bar" aria-hidden="true" />}
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
    </>
  )
}
