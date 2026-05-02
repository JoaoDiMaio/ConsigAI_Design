import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { DesktopPageHeader, MobilePageHeader } from '../components/AppHeader'
import { useOffersData } from '../hooks/useOffersData.js'
import { THIRD_CARD_SUB_OFFERS } from '../data/offersMock.js'
import { useMediaQuery } from '../hooks/useMediaQuery.js'
import { loadProfileData } from '../lib/profileStorage.js'
import { appPageStyle } from '../ui/theme.js'
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

function buildContractState(entry, usuario, selectedThirdSubOffer) {
  if (!entry?.config || !entry?.data || !usuario) return null

  const offer = entry.data
  const config = entry.config
  if (config.id === 'turbo') {
    const turbo = getTurboSubOfferSnapshot(entry, selectedThirdSubOffer, usuario)
    if (!turbo) return null
    return {
      sourcePath: '/ofertas',
      offerId: config.id,
      offerTitle: turbo.ctaLabel,
      offerSubtitle: turbo.subtitle,
      primaryValue: turbo.benefitDisplay,
      summary: [
        { label: 'Oferta', value: turbo.label },
        { label: turbo.benefitLabel, value: turbo.benefitDisplay },
        { label: 'Detalhe', value: turbo.detailsMode === 'parc' ? 'Parcela menor' : 'Economizar agora' },
      ],
    }
  }
  const monthlyGain = Math.max(0, getEcoMensal(offer, usuario.parcelaAtual))
  const installmentAfter = getParcelaNova(offer, usuario.parcelaAtual)
  const cashValue = Number(offer.creditoReceber || 0)

  return {
    sourcePath: '/ofertas',
    offerId: config.id,
    offerTitle: config.ctaName || config.pill || 'Oferta',
    offerSubtitle: 'Resumo da oferta selecionada antes da contratacao',
    primaryValue: cashValue > 0 ? fmt(cashValue) : installmentAfter,
    summary: [
      { label: 'Oferta', value: config.ctaName || config.pill || config.id || 'Oferta' },
      cashValue > 0 ? { label: 'Voce recebe', value: fmt(cashValue) } : null,
      { label: 'Nova parcela', value: installmentAfter },
      { label: 'Economia mensal', value: fmt(monthlyGain) },
    ].filter(Boolean),
  }
}

function getTurboSubOfferSnapshot(entry, selectedThirdSubOffer, usuario) {
  if (!entry?.data || entry?.config?.id !== 'turbo') return null
  const offer = entry.data
  const variantKey = selectedThirdSubOffer === 'installment' ? 'installment' : 'contract'
  const variant = offer.subOffers?.[variantKey] || {}
  const benefitValue = Number(variant.benefitValue ?? 0)
  const fallbackContract = Number(offer.economiaContrato ?? offer.economiaTotal ?? 0)
  const fallbackInstallment = Number(offer.economiaParcela ?? getEcoMensal(offer, usuario.parcelaAtual))
  const rawValue = benefitValue || (variantKey === 'installment' ? fallbackInstallment : fallbackContract)
  const displayValue = fmt(rawValue)
  const displayValueMonthly = variantKey === 'installment' ? `${displayValue}/mês` : displayValue
  const ctaLabel = variant.ctaName || `Turbo Economia - ${variant.label || (variantKey === 'installment' ? 'Na parcela' : 'No contrato')}`

  return {
    label: variant.label || (variantKey === 'installment' ? 'Na parcela' : 'No contrato'),
    ctaLabel,
    benefitLabel: variant.benefitLabel || (variantKey === 'installment' ? 'Alívio mensal' : 'Economia no contrato'),
    benefitValue: rawValue,
    benefitDisplay: displayValue,
    benefitDisplayMonthly: displayValueMonthly,
    detailsMode: variant.detailsMode || (variantKey === 'installment' ? 'parc' : 'eco'),
    subtitle: variantKey === 'installment'
      ? 'Turbo com foco em alívio mensal.'
      : 'Turbo com foco em economia total no contrato.',
  }
}

function getOfferNavigationTarget(entry) {
  if (!entry?.config) return null
  return {
    path: entry.config.route || '/ofertas',
    state: entry.config.state || undefined,
  }
}

// ---------------------------------------------------------------------------
// Seção de impacto no bolso
// ---------------------------------------------------------------------------
function calcImpactValues(selectedEntry, usuario, impacto, selectedThirdSubOffer) {
  const o = selectedEntry?.data ?? {
    creditoReceber: impacto.creditToday,
    parcelaNova: usuario.parcelaAtual,
    economiaParcela: 0,
  }
  const creditoAtual = impacto.creditToday
  const creditoDepois = o.creditoReceber ?? creditoAtual
  const ecoMensal = getEcoMensal(o, usuario.parcelaAtual)
  const turboSnapshot = selectedEntry?.config?.id === 'turbo'
    ? getTurboSubOfferSnapshot(selectedEntry, selectedThirdSubOffer, usuario)
    : null
  const installmentAfter = getParcelaNova(o, usuario.parcelaAtual)

  const values = {
    salaryUnified: fmt(usuario.salarioBruto),
    installmentToday: formatCurrencyClean(fmt(usuario.parcelaAtual)),
    pocketToday: fmt(usuario.salarioBruto - usuario.parcelaAtual),
    creditToday: fmt(creditoAtual),
    installmentAfter: formatCurrencyClean(installmentAfter),
    pocketAfter: fmt(usuario.salarioBruto - (o.parcelaNova ?? (usuario.parcelaAtual - (o.economiaParcela ?? 0)))),
    creditAfter: fmt(creditoDepois),
    ecoMensal: `+${fmt(ecoMensal)}`,
    ecoAnual: `+${fmt(ecoMensal * 12)}`,
    creditoExtra: `+${fmt(Math.max(0, creditoDepois - creditoAtual))}`,
  }

  if (turboSnapshot) {
    const turboPrimary = turboSnapshot.benefitValue
    values.ecoMensal = `+${turboSnapshot.benefitDisplay}`
    values.ecoAnual = selectedThirdSubOffer === 'installment'
      ? `+${fmt(turboPrimary * 12)}`
      : `+${turboSnapshot.benefitDisplay}`
  }

  return { values, turboSnapshot }
}

function applyTurboLabels(baSection, baPill, ctaSavingLabel, turboSnapshot, values) {
  const isParc = turboSnapshot.label === 'Na parcela'
  const gainPrimary = baSection.querySelector('[data-label="gainPrimary"]')
  const gainSecondary = baSection.querySelector('[data-label="gainSecondary"]')
  if (gainPrimary) gainPrimary.textContent = isParc ? 'Alivio mensal' : 'Economia no contrato'
  if (gainSecondary) gainSecondary.textContent = isParc ? 'Economia anual' : 'Economia projetada'
  if (baPill) baPill.textContent = turboSnapshot.benefitDisplay
  if (ctaSavingLabel) ctaSavingLabel.textContent = isParc ? 'de economia mensal' : 'de economia no contrato'
}

const POCKET_VISUAL_HTML = `
  <article class="impact-card impact-card-before">
    <div class="impact-chip">Antes da oferta</div>
    <div class="impact-row">
      <span class="impact-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 7h16a2 2 0 0 1 2 2v10H5a2 2 0 0 1-2-2V7Z"/><path d="M16 7V5.8a2 2 0 0 0-2.7-1.9L5 7"/><path d="M17 13h4"/><circle cx="17" cy="13" r="1"/></svg></span>
      <div><div class="consigai-pocket-label">Parcela atual</div><div class="consigai-pocket-val value-negative" data-k="installmentToday"></div></div>
    </div>
    <div class="impact-row">
      <span class="impact-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M19 10c1.2.4 2 1.5 2 2.8 0 1.7-1.3 3.2-3 3.2h-.4a6 6 0 0 1-11.2 0H6a3 3 0 0 1 0-6h.4A6 6 0 0 1 18 10Z"/><path d="M12 7v3"/><path d="M9 13h.01"/><path d="M15 13h.01"/><path d="M8 19v2"/><path d="M16 19v2"/></svg></span>
      <div><div class="consigai-pocket-label">Sobra estimada</div><div class="consigai-pocket-val" data-k="pocketToday"></div></div>
    </div>
    <div class="impact-row">
      <span class="impact-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/></svg></span>
      <div><div class="consigai-pocket-label">Crédito disponível</div><div class="consigai-pocket-val" data-k="creditToday"></div><div class="consigai-pocket-note">para emergências</div></div>
    </div>
  </article>
  <article class="impact-card impact-card-after">
    <div class="impact-chip"><span class="consigai-logo-mark" aria-hidden="true"></span><span>Depois com ConsigAI</span></div>
    <div class="impact-row">
      <span class="impact-icon brand-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6"/><path d="M9 13h6"/><path d="M9 17h3"/><circle cx="17" cy="17" r="2"/></svg></span>
      <div><div class="consigai-pocket-label">Nova parcela</div><div class="consigai-pocket-val value-positive" id="impactNovaParcela" data-k="installmentAfter"></div></div>
    </div>
    <div class="impact-row">
      <span class="impact-icon brand-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M19 10c1.2.4 2 1.5 2 2.8 0 1.7-1.3 3.2-3 3.2h-.4a6 6 0 0 1-11.2 0H6a3 3 0 0 1 0-6h.4A6 6 0 0 1 18 10Z"/><path d="M12 7v3"/><path d="M9 13h.01"/><path d="M15 13h.01"/><path d="M8 19v2"/><path d="M16 19v2"/></svg></span>
      <div><div class="consigai-pocket-label">Sobra estimada</div><div class="consigai-pocket-val value-positive" id="impactSobraDepois" data-k="pocketAfter"></div></div>
    </div>
    <div class="impact-row">
      <span class="impact-icon brand-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/></svg></span>
      <div><div class="consigai-pocket-label">Crédito disponível</div><div class="consigai-pocket-val value-positive" id="impactCreditoDepois" data-k="creditAfter"></div><div class="consigai-pocket-note">para emergências</div></div>
    </div>
  </article>
  <aside class="impact-card impact-card-gain">
    <div class="gain-header">
      <span class="gain-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m3 17 6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg></span>
      <div><div class="consigai-pocket-gain-title">Seu ganho estimado</div><div class="consigai-pocket-gain-value" id="impactGanhoMensal" data-k="ecoMensal"></div><div class="consigai-pocket-gain-copy">por mês no bolso</div></div>
    </div>
    <div class="gain-list">
      <div class="gain-item">
        <span class="consigai-pocket-gain-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 2v4"/><path d="M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/><path d="m9 16 2 2 4-5"/></svg></span>
        <div class="consigai-pocket-gain-label" data-label="gainPrimary">Economia mensal</div>
        <div class="consigai-pocket-gain-num" data-k="ecoMensal"></div>
      </div>
      <div class="gain-item">
        <span class="consigai-pocket-gain-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 2v4"/><path d="M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/><path d="M8 14h8"/><path d="M8 18h5"/></svg></span>
        <div class="consigai-pocket-gain-label" data-label="gainSecondary">Economia anual</div>
        <div class="consigai-pocket-gain-num" id="impactEconomiaAnual" data-k="ecoAnual"></div>
      </div>
      <div class="gain-item">
        <span class="consigai-pocket-gain-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/></svg></span>
        <div class="consigai-pocket-gain-label" data-label="gainTertiary">Crédito extra disponível</div>
        <div class="consigai-pocket-gain-num" id="impactCreditoExtra" data-k="creditoExtra"></div>
      </div>
    </div>
  </aside>
`

function upsertPocketInsight(doc, selectedEntry, usuario, impacto, selectedThirdSubOffer) {
  if (!doc) return
  const baSection = doc.querySelector('.ba-section')
  const baCols = baSection?.querySelector('.ba-cols')
  if (!baSection || !baCols) return

  const { values, turboSnapshot } = calcImpactValues(selectedEntry, usuario, impacto, selectedThirdSubOffer)

  // Header setup (one-time)
  const baTitle = baSection.querySelector('.ba-title')
  const baSub = baSection.querySelector('.ba-sub')
  const baPill = baSection.querySelector('#baPill')
  const ctaSavingLabel = baSection.ownerDocument?.querySelector?.('#ctaSaving')?.parentElement?.querySelector?.('.cta-saving-label') || doc.querySelector('.cta-saving-label')
  const baHeader = baSection.querySelector('.ba-header')
  if (baTitle) baTitle.textContent = 'Veja o impacto real no seu bolso'
  if (baSub) baSub.textContent = turboSnapshot ? `Turbo Economia · ${turboSnapshot.label}` : 'Comparativo mensal com a oferta escolhida.'
  if (baHeader) {
    baHeader.classList.add('impact-header')
    if (!baHeader.querySelector('.income-base')) {
      const incomeBase = doc.createElement('div')
      incomeBase.className = 'income-base'
      incomeBase.innerHTML = '<div class="income-base-label">Renda informada</div><div class="income-base-value" id="impactSalarioBase" data-k="salaryUnified"></div>'
      baHeader.appendChild(incomeBase)
    }
  }

  // Visual panel (one-time creation)
  let visual = baSection.querySelector('.consigai-pocket-visual')
  if (!visual) {
    visual = doc.createElement('div')
    visual.className = 'consigai-pocket-visual impact-grid'
    visual.innerHTML = POCKET_VISUAL_HTML
    baSection.insertBefore(visual, baCols)
  }
  visual.classList.add('impact-grid')
  baSection.classList.add('consigai-pocket-redesign', 'impact-section')

  // Turbo label overrides
  if (turboSnapshot) applyTurboLabels(baSection, baPill, ctaSavingLabel, turboSnapshot, values)

  // Batch DOM value update — single query, O(n)
  baSection.querySelectorAll('[data-k]').forEach((el) => {
    const val = values[el.dataset.k]
    if (val !== undefined) el.textContent = val
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
    card.classList.toggle('active', active)
    card.setAttribute('aria-pressed', active ? 'true' : 'false')
  })
}

function applyUnifiedParcelaHoje(cacheRef, doc, selectedEntry, usuario, selectedThirdSubOffer) {
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

  const ctaSavingLabel = getCachedNode(cacheRef, doc, 'ctaSavingLabel', '.cta-saving-label')
  const heroSub = getCachedNode(cacheRef, doc, 'heroSub', '#heroSub')
  const baPill = getCachedNode(cacheRef, doc, 'baPill', '#baPill')
  const turboSnapshot = selectedEntry?.config?.id === 'turbo'
    ? getTurboSubOfferSnapshot(selectedEntry, selectedThirdSubOffer, usuario)
    : null
  if (turboSnapshot) {
    const turboValue = turboSnapshot.benefitDisplay
    if (heroEco) heroEco.textContent = turboValue
    if (ctaSaving) ctaSaving.textContent = `+${turboValue}`
    if (ctaSavingLabel) ctaSavingLabel.textContent = turboSnapshot.label === 'Na parcela'
      ? 'de economia mensal'
      : 'de economia no contrato'
    if (heroSub) {
      heroSub.textContent = turboSnapshot.label === 'Na parcela'
        ? 'Turbo Economia focado em aliviar sua parcela.'
        : 'Turbo Economia focado em economizar no contrato.'
    }
    if (baPill) baPill.textContent = turboValue
  }

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

// -- Shell helpers --

function cardShell(type, idx, inner) {
  return `<div class="offer-card ${type}-offer" id="oc${idx}" role="button" tabindex="0" aria-selected="false">
    <div class="consigai-offer-card ${type}-shell">
      <span class="consigai-hidden-state-badge badge pick" id="badge${idx}">Escolher</span>
      ${inner}
    </div>
  </div>`
}

function cardHeader(type, iconHtml, title, subtitle, badge = '') {
  return `<div class="${type}-header">
    <div class="${type}-title">
      <div class="${type}-icon" aria-hidden="true">${iconHtml}</div>
      <div><strong>${title}</strong><span>${subtitle}</span></div>
    </div>
    ${badge}
  </div>`
}

function cardNote(type, icon, text) {
  return `<div class="${type}-note"><span class="${type}-note-icon">${icon}</span><p>${text}</p></div>`
}

function cardDetailsBtn(type) {
  return `<div class="consigai-offer-actions ${type}-actions">
    <button type="button" class="consigai-offer-details-btn ${type}-details-button">Ver detalhes</button>
  </div>`
}

// -- SVG icons --

function svgEquilibrio(idx) {
  const g = `blueGradient-${idx}`
  const grad = `<linearGradient id="${g}" x1="34" y1="20" x2="94" y2="108" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00E7FF"/><stop offset="0.42" stop-color="#1DA1EB"/><stop offset="0.72" stop-color="#1878DE"/><stop offset="1" stop-color="#055ECE"/></linearGradient>`
  const paths = [
    ['M64 24V91', 12, 8], ['M34 42H94', 12, 8], ['M46 96H82', 12, 8],
    ['M45 42L31 72', 10, 6], ['M45 42L59 72', 10, 6], ['M28 72H62', 10, 6],
    ['M83 42L69 72', 10, 6], ['M83 42L97 72', 10, 6], ['M66 72H100', 10, 6],
  ].map(([d, sw, sw2]) =>
    `<path d="${d}" stroke="#000" stroke-width="${sw}" stroke-linecap="round"/>` +
    `<path d="${d}" stroke="url(#${g})" stroke-width="${sw2}" stroke-linecap="round"/>`
  ).join('')
  return `<svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg"><defs>${grad}</defs>${paths}</svg>`
}

function svgFolga(idx) {
  const b = `folgaBlue-${idx}`
  const gr = `folgaGreen-${idx}`
  return `<svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="${b}" x1="28" y1="20" x2="100" y2="104" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00E7FF"/><stop offset="0.42" stop-color="#1DA1EB"/><stop offset="1" stop-color="#055ECE"/></linearGradient>
      <linearGradient id="${gr}" x1="46" y1="88" x2="82" y2="56" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#007A52"/><stop offset="1" stop-color="#22C987"/></linearGradient>
    </defs>
    <rect x="25" y="30" width="78" height="78" rx="20" fill="#F8FBFF" stroke="#000" stroke-width="6"/>
    <path d="M25 52V46C25 37.2 32.2 30 41 30H87C95.8 30 103 37.2 103 46V52H25Z" fill="url(#${b})" stroke="#000" stroke-width="6" stroke-linejoin="round"/>
    <path d="M47 21V38" stroke="#000" stroke-width="11" stroke-linecap="round"/>
    <path d="M81 21V38" stroke="#000" stroke-width="11" stroke-linecap="round"/>
    <path d="M47 21V38" stroke="url(#${b})" stroke-width="6" stroke-linecap="round"/>
    <path d="M81 21V38" stroke="url(#${b})" stroke-width="6" stroke-linecap="round"/>
    <path d="M40 64H88" stroke="#DDE8F6" stroke-width="4" stroke-linecap="round"/>
    <circle cx="45" cy="76" r="3.8" fill="#DDE8F6"/><circle cx="64" cy="76" r="3.8" fill="#DDE8F6"/><circle cx="83" cy="76" r="3.8" fill="#DDE8F6"/>
    <circle cx="45" cy="92" r="3.8" fill="#DDE8F6"/><circle cx="83" cy="92" r="3.8" fill="#DDE8F6"/>
    <path d="M64 58V92" stroke="#000" stroke-width="12" stroke-linecap="round"/>
    <path d="M64 58V92" stroke="url(#${gr})" stroke-width="8" stroke-linecap="round"/>
    <path d="M49 77L64 93L79 77" stroke="#000" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M49 77L64 93L79 77" stroke="url(#${gr})" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`
}

function svgNovo() {
  return `<svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="consigaiGradient" x1="30" y1="18" x2="96" y2="112" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00E7FF"/><stop offset="0.38" stop-color="#1DA1EB"/><stop offset="0.72" stop-color="#1878DE"/><stop offset="1" stop-color="#055ECE"/></linearGradient></defs>
    <path d="M64 12C68.1 12 71.4 15.3 71.4 19.4V108.6C71.4 112.7 68.1 116 64 116C59.9 116 56.6 112.7 56.6 108.6V19.4C56.6 15.3 59.9 12 64 12Z" fill="url(#consigaiGradient)" stroke="#000" stroke-width="3" stroke-linejoin="round"/>
    <path d="M92.6 30.4C84.7 23.4 74.1 19.6 62.5 19.6C42.6 19.6 28.6 30.1 28.6 45.5C28.6 61.9 41.3 68.1 60.3 71.8L72.3 74.1C82.4 76.1 87.4 79.4 87.4 85.5C87.4 93.1 79.4 98.2 66.7 98.2C53.4 98.2 42.1 93.7 33.7 86.1C30.6 83.3 25.9 83.6 23.1 86.7C20.3 89.8 20.6 94.5 23.7 97.3C35.2 107.7 50.3 113.2 66.7 113.2C87.7 113.2 102.7 102.3 102.7 85.1C102.7 68.5 91.1 61.2 74.6 58L62.2 55.6C50.2 53.3 43.9 50.2 43.9 44.7C43.9 38.1 51.3 33.9 62.5 33.9C70.6 33.9 77.5 36.3 82.6 40.8C85.7 43.6 90.4 43.3 93.2 40.2C96 37.1 95.7 33.1 92.6 30.4Z" fill="url(#consigaiGradient)" stroke="#000" stroke-width="3" stroke-linejoin="round"/>
  </svg>`
}

function svgRefin(idx) {
  const b = `refinBlue-${idx}`
  const d = `refinDark-${idx}`
  return `<svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="${b}" x1="22" y1="18" x2="106" y2="112" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00E7FF"/><stop offset="0.42" stop-color="#1DA1EB"/><stop offset="0.72" stop-color="#1878DE"/><stop offset="1" stop-color="#055ECE"/></linearGradient>
      <linearGradient id="${d}" x1="30" y1="108" x2="98" y2="18" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#03246F"/><stop offset="0.48" stop-color="#055ECE"/><stop offset="1" stop-color="#00E7FF"/></linearGradient>
    </defs>
    <circle cx="64" cy="64" r="54" fill="#FFFFFF"/>
    <path d="M95.6 38.4C87.8 28.9 76.1 23 63.2 23C42.7 23 25.8 37.8 22.4 57.2" stroke="#000" stroke-width="13" stroke-linecap="round"/>
    <path d="M95.6 38.4C87.8 28.9 76.1 23 63.2 23C42.7 23 25.8 37.8 22.4 57.2" stroke="url(#${b})" stroke-width="9" stroke-linecap="round"/>
    <path d="M93.8 24.8L98.4 39.8L82.9 41.9" stroke="#000" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M93.8 24.8L98.4 39.8L82.9 41.9" stroke="url(#${b})" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M32.4 89.6C40.2 99.1 51.9 105 64.8 105C85.3 105 102.2 90.2 105.6 70.8" stroke="#000" stroke-width="13" stroke-linecap="round"/>
    <path d="M32.4 89.6C40.2 99.1 51.9 105 64.8 105C85.3 105 102.2 90.2 105.6 70.8" stroke="url(#${d})" stroke-width="9" stroke-linecap="round"/>
    <path d="M34.2 103.2L29.6 88.2L45.1 86.1" stroke="#000" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M34.2 103.2L29.6 88.2L45.1 86.1" stroke="url(#${d})" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="42" y="34" width="44" height="60" rx="10" fill="#F4F8FF" stroke="#000" stroke-width="3"/>
    <path d="M54 50H74" stroke="#000" stroke-width="6" stroke-linecap="round"/>
    <path d="M54 50H74" stroke="#055ECE" stroke-width="4" stroke-linecap="round"/>
    <path d="M54 62H72" stroke="#000" stroke-width="6" stroke-linecap="round" opacity="0.9"/>
    <path d="M54 62H72" stroke="#1878DE" stroke-width="4" stroke-linecap="round" opacity="0.85"/>
    <path d="M54 74H66" stroke="#000" stroke-width="6" stroke-linecap="round" opacity="0.9"/>
    <path d="M54 74H66" stroke="#1DA1EB" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
  </svg>`
}

// -- Card builders --

function buildTurboCard(cfg, offer, idx, usuario, selectedThirdSubOffer) {
  const economiaContrato = fmt(offer.economiaContrato ?? offer.economiaTotal ?? 0)
  const economiaParcela = `${fmt(offer.economiaParcela ?? getEcoMensal(offer, usuario.parcelaAtual))}<span class="turbo-suffix">/mês</span>`
  const sel = selectedThirdSubOffer === 'installment' ? 'installment' : 'contract'
  const opt = (key, label, val, sub) => {
    const active = sel === key
    return `<button type="button" class="consigai-offer-mini-card turbo-option option${active ? ' active is-selected' : ''}" data-suboffer="${key}" role="button" tabindex="0" aria-pressed="${active}">
      <span class="option-label">${label}</span>
      <strong>${val}</strong>
      <small>${sub}</small>
    </button>`
  }
  return cardShell('turbo', idx, `
    <div class="turbo-module-header">
      <div class="turbo-module-title">
        <img class="turbo-module-logo" src="/ConsigIA_logo_only_no_background.svg" alt="" aria-hidden="true" />
        <div><strong>${cfg.ctaName || cfg.pill || 'Turbo Economia'}</strong><span>${cfg.subtitle || 'Foco em pagar menos'}</span></div>
      </div>
    </div>
    <div class="turbo-body">
      <h2 class="turbo-heading"><span class="turbo-heading-blue">Escolha onde quer</span><span class="turbo-heading-green">Economizar</span></h2>
      <p class="turbo-intro">A ConsigAI mostra dois caminhos para reduzir o custo do seu consignado com clareza.</p>
      <div class="turbo-options">
        ${opt('contract', 'No contrato', economiaContrato, 'Maior economia total')}
        ${opt('installment', 'Na parcela', economiaParcela, 'Mais folga mensal')}
      </div>
      <div class="consigai-offer-note turbo-note"><span class="note-icon" aria-hidden="true">✓</span><p>Boa opção para quem quer economizar sem contratar novo crédito.</p></div>
      ${cardDetailsBtn('turbo')}
    </div>
  `)
}

function buildEquilibrioCard(offer, idx, usuario, isRecommended) {
  const valorNaConta = fmt(offer.creditoReceber ?? 0)
  const economiaNosContratos = fmt(offer.economiaTotal ?? (getEcoMensal(offer, usuario.parcelaAtual) * 12))
  const badge = isRecommended ? '<div class="equilibrio-status">★ Recomendado</div>' : ''
  return cardShell('equilibrio', idx, `
    ${cardHeader('equilibrio', svgEquilibrio(idx), 'Melhor Equilíbrio', 'Dinheiro + economia', badge)}
    <div class="equilibrio-body">
      <h2 class="equilibrio-heading">Receba dinheiro e <span>economize</span></h2>
      <p class="equilibrio-intro">Boa opção para quem quer dinheiro na conta, parcela menor e prazo mantido.</p>
      <div class="equilibrio-benefit-grid">
        <div class="equilibrio-benefit money">
          <span class="equilibrio-benefit-label">Na conta</span>
          <strong>${valorNaConta}</strong>
          <small>valor estimado liberado</small>
        </div>
        <div class="equilibrio-benefit economy">
          <span class="equilibrio-benefit-label">Nos contratos</span>
          <strong>${economiaNosContratos}</strong>
          <small>economia estimada</small>
        </div>
      </div>
      ${cardNote('equilibrio', '✓', 'Recomendado por equilibrar dinheiro na conta, economia e prazo mantido.')}
      ${cardDetailsBtn('equilibrio')}
    </div>
  `)
}

function buildFolgaCard(offer, idx, usuario) {
  const valorNaConta = fmt(offer.creditoReceber ?? 0)
  const parcelaNova = getParcelaNova(offer, usuario.parcelaAtual)
  return cardShell('folga', idx, `
    ${cardHeader('folga', svgFolga(idx), 'Mais Folga por Mês', 'Dinheiro + Redução de Parcela')}
    <div class="folga-body">
      <h2 class="folga-heading">Receba dinheiro e <span>reduza a parcela</span></h2>
      <p class="folga-intro">Boa opção para quem quer dinheiro na conta e mais espaço no orçamento todos os meses.</p>
      <div class="folga-highlight-grid">
        <div class="folga-highlight money">
          <small>Na conta</small>
          <strong>${valorNaConta}</strong>
          <span>valor estimado liberado</span>
        </div>
        <div class="folga-highlight installment">
          <small>Nova parcela estimada</small>
          <strong>${parcelaNova}</strong>
          <span>menor impacto mensal</span>
        </div>
      </div>
      ${cardNote('folga', '✓', 'Indicada para aliviar o orçamento mensal, com dinheiro na conta e parcela reduzida.')}
      ${cardDetailsBtn('folga')}
    </div>
  `)
}

function buildNovoCard(offer, idx) {
  const valorEstimado = fmt(offer.creditoReceber ?? 0)
  return cardShell('new-contract', idx, `
    ${cardHeader('new-contract', svgNovo(), 'Novo Contrato', 'Use sua margem livre')}
    <div class="new-contract-body">
      <h2 class="new-contract-heading">Receba dinheiro <span>na sua conta</span></h2>
      <p class="new-contract-intro">Oferta focada em liberar valor novo, com parcela clara e prazo informado antes de continuar.</p>
      <div class="new-contract-highlight">
        <small>Valor estimado disponível</small>
        <strong>R$ ${valorEstimado}</strong>
        <span>simulação sem compromisso</span>
      </div>
      ${cardNote('new-contract', 'i', 'Nova contratação usando margem livre. Você verá taxa, custo total e condições antes de confirmar.')}
      ${cardDetailsBtn('new-contract')}
    </div>
  `)
}

function buildRefinCard(offer, idx) {
  const valorEstimado = fmt(offer.creditoReceber ?? 0)
  return cardShell('refin', idx, `
    ${cardHeader('refin', svgRefin(idx), 'Refinanciamento', 'Use seu contrato atual')}
    <div class="refin-body">
      <h2 class="refin-heading"><span>Dinheiro ajustando seu</span><span class="refin-heading-light">contrato</span></h2>
      <p class="refin-intro">Oferta direta para liberar valor ou reorganizar sua parcela usando um contrato existente.</p>
      <div class="refin-highlight">
        <small>Valor estimado disponível</small>
        <strong>R$ ${valorEstimado}</strong>
        <span>simulação sem compromisso</span>
      </div>
      ${cardNote('refin', 'i', 'Pode alterar prazo e custo total. Você verá taxa, parcelas e condições antes de confirmar.')}
      ${cardDetailsBtn('refin')}
    </div>
  `)
}

function buildGenericCard(cfg, offer, idx, usuario, isRecommended) {
  const moneyValue = fmt(offer.creditoReceber ?? 0)
  const isSimple = cfg.kind === 'simples'

  let totalLabel = 'Parcela estimada em'
  let totalValue = getParcelaNova(offer, usuario.parcelaAtual)
  let metricLabel = 'Economia de'
  let metricValue = `${fmt(getEcoMensal(offer, usuario.parcelaAtual))}/mês`

  if (cfg.id === 'alto imp') {
    totalLabel = 'Economize nos Contratos'
    totalValue = fmt(offer.economiaTotal ?? (getEcoMensal(offer, usuario.parcelaAtual) * 12))
    metricLabel = 'Parcela nova'
    metricValue = getParcelaNova(offer, usuario.parcelaAtual)
  } else if (isSimple) {
    metricLabel = 'Parcela'
    metricValue = getParcelaNova(offer, usuario.parcelaAtual)
  }

  const isSimpleContract = cfg.id === 'apenas_novo' || cfg.id === 'apenas_refin'
  const miniLabelSecond = isSimpleContract ? 'Qtd Parcelas' : metricLabel
  const miniValueSecond = isSimpleContract ? String(offer.qtdParcelas ?? '—') : metricValue

  return `
    <div class="offer-card${isSimple ? ' simple-offer' : ''}" id="oc${idx}" role="button" tabindex="0" aria-selected="false">
      <div class="consigai-offer-card">
        <span class="consigai-hidden-state-badge badge pick" id="badge${idx}">Escolher</span>
        ${isRecommended
          ? `<div class="consigai-offer-title-row"><span class="consigai-offer-pill">${cfg.pill}</span><div class="consigai-offer-head-badges"><span class="consigai-offer-badge-rec">Recomendada</span></div></div>`
          : `<div class="consigai-offer-head"></div><span class="consigai-offer-pill">${cfg.pill}</span>`}
        <div class="consigai-offer-lines">
          <div class="consigai-offer-line">
            <span class="consigai-offer-line-main blue">Receba ${moneyValue}</span>
            <span class="consigai-offer-line-helper">na sua conta</span>
          </div>
          ${!isSimple ? `<div class="consigai-offer-line"><span class="consigai-offer-line-main consigai-offer-total-stack"><span class="consigai-offer-total-label"><span class="consigai-offer-word-orange">${totalLabel}</span></span><span class="consigai-offer-value-green">${totalValue}</span></span></div>` : ''}
        </div>
        ${isSimple ? `<div class="consigai-offer-mini-grid"><div class="consigai-offer-mini-card"><span class="consigai-offer-mini-label">${metricLabel}</span><span class="consigai-offer-mini-value">${metricValue}</span></div><div class="consigai-offer-mini-card"><span class="consigai-offer-mini-label">${miniLabelSecond}</span><span class="consigai-offer-mini-value">${miniValueSecond}</span></div></div>` : ''}
        <div class="consigai-offer-note"><span class="consigai-offer-note-text"><span class="consigai-offer-note-sub">${cfg.note}</span></span></div>
        <div class="consigai-offer-actions" style="margin-top: 12px;">
          <button type="button" class="consigai-offer-details-btn" style="width: 100%; border-radius: 12px; border: 1px solid rgba(35,80,200,.20); background: #edf3ff; color: #2350c8; padding: 11px 14px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit;">Ver detalhes</button>
        </div>
      </div>
    </div>
  `
}

function buildOfferCardHtml(entry, idx, usuario, selectedThirdSubOffer) {
  const { config: cfg, data: offer, isRecommended } = entry
  if (cfg.id === 'turbo')      return buildTurboCard(cfg, offer, idx, usuario, selectedThirdSubOffer)
  if (cfg.id === 'equilibrio') return buildEquilibrioCard(offer, idx, usuario, isRecommended)
  if (cfg.id === 'folga')      return buildFolgaCard(offer, idx, usuario)
  if (cfg.id === 'apenas_novo') return buildNovoCard(offer, idx)
  if (cfg.id === 'apenas_refin') return buildRefinCard(offer, idx)
  return buildGenericCard(cfg, offer, idx, usuario, isRecommended)
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
    .map((entry, idx) => buildOfferCardHtml(entry, idx, usuario, selectedThirdSubOffer))
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
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const profile = loadProfileData()
  const clientName = profile.nomeExibicao || profile.nomeCompleto || 'Cliente'

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
      applyUnifiedParcelaHoje(docQueryCacheRef, doc, selectedEntry, u, subOffer)
      upsertOfferCardsRedesign(docQueryCacheRef, doc, offers, selectedOfferIndexRef, u, subOffer)
      upsertPocketInsight(doc, selectedEntry, u, imp, subOffer)
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
            'A ConsigAI comparou seus contratos e encontrou opções para reduzir parcela, economizar no total ou receber dinheiro com clareza.'
        }
        const heroCompareLabel = frameDoc.querySelector('.hc-label')
        if (heroCompareLabel) {
          heroCompareLabel.innerHTML = '<span class="hc-label-main">Comparativo de oferta</span><span class="hc-label-sub">Antes e depois da ConsigAI</span>'
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

        const navigateToContract = () => {
          const selected = activeOffersRef.current[selectedOfferIndexRef.current]
          if (!selected) return
          const contractState = buildContractState(selected, usuarioRef.current, selectedThirdSubOfferRef.current)
          navigate('/contratacao', contractState ? { state: contractState } : undefined)
        }

        clickHandlerRef.current = (event) => {
          const rawTarget = event.target
          const target = rawTarget?.nodeType === 1 ? rawTarget : rawTarget?.parentElement
          if (!target) return

          const selection = frameDoc.defaultView?.getSelection?.()
          if (selection && !selection.isCollapsed && selection.toString().trim()) return

          const detailsBtn = target.closest('.consigai-offer-details-btn')
          if (detailsBtn) {
            const offerCard = target.closest('.offer-card')
            if (!offerCard?.id?.startsWith('oc')) return
            const idx = Number(offerCard.id.replace('oc', ''))
            const selected = activeOffersRef.current[idx]
            if (!selected?.config) return
            const cfg = selected.config
            if (cfg.id === 'turbo') {
              const subKey = selectedThirdSubOfferRef.current
              const initialMode = subKey === 'installment' ? 'parc' : 'eco'
              event.preventDefault()
              event.stopPropagation()
              navigate('/portabilidade', { state: { initialMode } })
              return
            }
            const routeTarget = getOfferNavigationTarget(selected)
            if (!routeTarget) return
            event.preventDefault()
            event.stopPropagation()
            navigate(routeTarget.path, routeTarget.state ? { state: routeTarget.state } : undefined)
            return
          }

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
            navigateToContract()
          }
        }

        frameDoc.addEventListener('click', clickHandlerRef.current, true)
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
    <div style={{ ...appPageStyle, minHeight: '100svh', overflow: 'hidden' }}>
      {loading && <div className="offers-loading-bar" aria-hidden="true" />}
      {isDesktop ? (
        <DesktopPageHeader
          chipLabel="Ofertas"
          title="Ofertas ConsigAI"
          subtitle="Compare as melhores estratégias para economizar ou receber crédito."
          clientName={clientName}
          onLogoClick={() => navigate('/ofertas')}
          actions={[
            { label: 'Ofertas', onClick: () => navigate('/ofertas') },
            { label: 'Configuracoes', onClick: () => navigate('/configuracoes') },
          ]}
        />
      ) : (
        <MobilePageHeader
          chipLabel="Ofertas"
          title="Ofertas ConsigAI"
          subtitle="Compare opções."
          clientName={clientName}
          onLogoClick={() => navigate('/ofertas')}
          actions={[
            { label: 'Ofertas', onClick: () => navigate('/ofertas') },
            { label: 'Configuracoes', onClick: () => navigate('/configuracoes') },
          ]}
        />
      )}
      <iframe
        ref={iframeRef}
        title="Ofertas ConsigAI"
        src="/Ofertas_ConsigAI.html"
        style={{
          width: '100%',
          height: 'calc(100svh - 72px)',
          border: 'none',
          display: 'block',
          background: '#F6FAFF',
        }}
      />
    </div>
  )
}
