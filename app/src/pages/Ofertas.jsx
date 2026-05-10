import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DesktopPageHeader, MobilePageHeader } from '../components/AppHeader'
import { useOffersData } from '../hooks/useOffersData.js'
import { THIRD_CARD_SUB_OFFERS, TURBO_LABEL_INSTALLMENT, TURBO_LABEL_CONTRACT } from '../data/offersMock.js'
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
  OFFER_CARD_BALANCED_LAYOUT_CSS,
  WIDE_LAYOUT_CSS,
} from '../styles/iframeOfertasStyles.js'
import { brandNameHtml } from '../lib/brandNameHtml.js'
import { buildOfferCardHtml } from '../lib/iframeCardBuilders.js'

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
const TRANSPARENT_BG_CSS = `html, body, .main { background: transparent !important; }`

function injectStyleOnce(doc, dataKey, css) {
  if (!doc?.body || doc.body.dataset[dataKey]) return
  const el = doc.createElement('style')
  el.textContent = css
  doc.head?.appendChild(el)
  doc.body.dataset[dataKey] = '1'
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
    offerSubtitle: 'Resumo da oferta selecionada antes da contratação',
    primaryValue: cashValue > 0 ? fmt(cashValue) : installmentAfter,
    summary: [
      { label: 'Oferta', value: config.ctaName || config.pill || config.id || 'Oferta' },
      cashValue > 0 ? { label: 'Você recebe', value: fmt(cashValue) } : null,
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
  const ctaLabel = variant.ctaName || `Turbo Economia - ${variant.label || (variantKey === 'installment' ? TURBO_LABEL_INSTALLMENT : TURBO_LABEL_CONTRACT)}`

  return {
    label: variant.label || (variantKey === 'installment' ? TURBO_LABEL_INSTALLMENT : TURBO_LABEL_CONTRACT),
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

function buildSelectedOfferSummary(entry, usuario, selectedThirdSubOffer) {
  if (!entry) return null

  const config = entry.config || {}
  const data = entry.data || {}
  const turboSnapshot = config.id === 'turbo'
    ? getTurboSubOfferSnapshot(entry, selectedThirdSubOffer, usuario)
    : null

  const installmentValue = data.parcelaNova != null && usuario
    ? `${getParcelaNova(data, usuario.parcelaAtual)}/mês`
    : null

  let primaryLabel = 'Valor principal'
  let primaryValue =
    data.creditoReceber != null && data.creditoReceber > 0
      ? fmt(data.creditoReceber)
      : null

  if (config.id === 'turbo' && turboSnapshot) {
    primaryLabel = turboSnapshot.label === TURBO_LABEL_INSTALLMENT ? 'Alívio mensal' : 'Economia no contrato'
    primaryValue = turboSnapshot.label === TURBO_LABEL_INSTALLMENT
      ? turboSnapshot.benefitDisplayMonthly
      : turboSnapshot.benefitDisplay
  } else if (config.id === 'equilibrio' || config.id === 'folga' || config.id === 'apenas_novo' || config.id === 'apenas_refin') {
    primaryLabel = 'Você recebe'
  }

  let operationType = null
  if (config.id === 'apenas_novo') operationType = 'Nova contratação com margem livre'
  if (config.id === 'apenas_refin') operationType = 'Refinanciamento do contrato atual'
  if (config.id === 'equilibrio') operationType = 'Combinação entre dinheiro na conta e economia'
  if (config.id === 'folga') operationType = 'Operação com foco em reduzir a parcela mensal'
  if (config.id === 'turbo') {
    operationType = turboSnapshot?.label === TURBO_LABEL_INSTALLMENT
      ? 'Estratégia focada em aliviar a parcela mensal'
      : 'Estratégia focada em economizar no contrato'
  }

  return {
    name: config.ctaName || config.pill,
    primaryLabel,
    primaryValue: primaryValue || 'Ver oferta',
    installmentValue: installmentValue || 'Conforme simulação',
    termValue: data.qtdParcelas ? `${data.qtdParcelas} meses` : 'Prazo informado na revisão',
    operationType: operationType || 'Oferta simulada com comparação antes de contratar',
    whyThisOffer: config.note || 'Opção organizada para facilitar sua decisão com clareza.',
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
    pocketTodayRaw: usuario.salarioBruto - usuario.parcelaAtual,
    creditToday: fmt(creditoAtual),
    installmentAfter: formatCurrencyClean(installmentAfter),
    pocketAfter: fmt(usuario.salarioBruto - (o.parcelaNova ?? (usuario.parcelaAtual - (o.economiaParcela ?? 0)))),
    pocketAfterRaw: usuario.salarioBruto - (o.parcelaNova ?? (usuario.parcelaAtual - (o.economiaParcela ?? 0))),
    creditAfter: fmt(creditoDepois),
    marginToday: 'R$ 0',
    marginAfter: fmt(ecoMensal),
    ecoMensal: `+${fmt(ecoMensal)}`,
    ecoAnual: `+${fmt(ecoMensal * 12)}`,
    creditoExtra: `+${fmt(Math.max(0, creditoDepois - creditoAtual))}`,
    salaryFactor: `${((ecoMensal * 12) / Math.max(1, usuario.salarioBruto)).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} salários`,
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

function applyTurboLabels(baSection, baPill, ctaSavingLabel, turboSnapshot) {
  const isParc = turboSnapshot.label === TURBO_LABEL_INSTALLMENT
  const gainPrimary = baSection.querySelector('[data-label="gainPrimary"]')
  const gainSecondary = baSection.querySelector('[data-label="gainSecondary"]')
  if (gainPrimary) gainPrimary.textContent = isParc ? 'Alívio mensal' : 'Economia no contrato'
  if (gainSecondary) gainSecondary.textContent = isParc ? 'Economia anual' : 'Economia projetada'
  if (baPill) baPill.textContent = turboSnapshot.benefitDisplay
  if (ctaSavingLabel) ctaSavingLabel.textContent = isParc ? 'de economia mensal' : 'de economia no contrato'
}

const POCKET_VISUAL_HTML = `
  <div class="projection-flow-updated" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
    
    <!-- Coluna Esquerda: Gráfico de Barras -->
    <div style="background: #fff; border-radius: 20px; border: 1px solid #DDE8F6; padding: 24px; box-shadow: 0 12px 32px rgba(3,36,111,.04); position: relative; overflow: hidden; display: flex; flex-direction: column;">
      <h4 style="font-size: 13px; color: #64748B; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 900;">Evolução de Salário Líquido</h4>
      
      <div style="margin-bottom: 28px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px; font-weight: 800; color: #64748B;">
          <span>Hoje</span>
          <span data-k="pocketToday" style="font-size: 16px;"></span>
        </div>
        <div style="height: 16px; border-radius: 8px; background: #F1F5F9; width: 100%; position: relative; overflow: hidden;">
          <div id="barToday" style="height: 100%; border-radius: 8px; background: #94A3B8; width: 60%; transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);"></div>
        </div>
      </div>
      
      <div style="margin-top: auto;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; font-weight: 800; color: #007A52;">
          <span style="display: flex; align-items: center; gap: 6px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7-7 7 7"/></svg>
            Com ConsigAI
          </span>
          <span data-k="pocketAfter" style="font-size: 18px; font-weight: 900;"></span>
        </div>
        <div style="height: 16px; border-radius: 8px; background: #F0FFF8; width: 100%; position: relative; overflow: hidden;">
          <div id="barAfter" style="height: 100%; border-radius: 8px; background: linear-gradient(90deg, #00A86B, #22C987); width: 85%; transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);"></div>
        </div>
      </div>
    </div>

    <!-- Coluna Direita: Métricas de Impacto -->
    <div style="display: grid; grid-template-rows: 1fr 1fr; gap: 16px;">
      
      <!-- Métrica 1: Ganho Mensal -->
      <div style="background: #fff; border-radius: 20px; border: 1px solid #DDE8F6; padding: 22px 24px; box-shadow: 0 12px 32px rgba(3,36,111,.04); display: flex; flex-direction: column; justify-content: center;">
        <div style="font-size: 12px; color: #64748B; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Ganho na Parcela (Livre por Mês)</div>
        <div style="display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap;">
          <span data-k="ecoMensal" style="font-size: 32px; font-weight: 950; color: #00A86B; letter-spacing: -0.04em; line-height: 1;"></span>
          <span style="font-size: 13px; color: #94A3B8; font-weight: 700;">a mais no bolso todo mês</span>
        </div>
      </div>

      <!-- Métrica 2: Economia Total -->
      <div style="background: #fff; border-radius: 20px; border: 1px solid #DDE8F6; padding: 22px 24px; box-shadow: 0 12px 32px rgba(3,36,111,.04); display: flex; flex-direction: column; justify-content: center;">
        <div style="font-size: 12px; color: #64748B; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;" data-label="gainSecondary">Economia Projetada Total</div>
        <div style="display: flex; align-items: baseline; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
          <span data-k="ecoAnual" style="font-size: 26px; font-weight: 950; color: #00A86B; letter-spacing: -0.04em; line-height: 1;"></span>
          <div style="display: flex; flex-direction: column; align-items: flex-end;">
            <div style="background: #F0FFF8; color: #007A52; padding: 4px 10px; border-radius: 8px; font-size: 12px; font-weight: 900; display: flex; align-items: center; gap: 6px; border: 1px solid #BDECD7;">
              Equivale a <strong id="impactSalaryFactor" data-k="salaryFactor" style="color: #007A52; font-weight: 900;"></strong>
            </div>
          </div>
        </div>
      </div>

    </div>

  </div>

  <p class="projection-transparency">
    <strong>Transparência ${brandNameHtml()}:</strong> esta é uma simulação e não representa aprovação final.
    Você verá taxa, parcelas, prazo, custo total e condições antes de confirmar.
  </p>
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
  if (baTitle) {
    baTitle.innerHTML = 'Projeção de <span class="impact-title-eco">Economia</span> Consig<span class="impact-title-ai">AI</span>'
  }
  if (baSub) baSub.textContent = turboSnapshot ? `Turbo Economia · ${turboSnapshot.label}` : 'Comparativo mensal com a oferta escolhida.'
  if (baHeader) {
    baHeader.classList.add('impact-header')
    baHeader.querySelector('.income-base')?.remove()
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

  // Update dynamic bar widths to visually emphasize the gain
  const todayRaw = values.pocketTodayRaw || 0;
  const afterRaw = values.pocketAfterRaw || 0;
  
  const barToday = visual.querySelector('#barToday');
  const barAfter = visual.querySelector('#barAfter');
  
  if (barToday && barAfter) {
    const diff = Math.max(afterRaw - todayRaw, 0);
    let pctToday = 70;
    let pctAfter = 100;
    
    if (diff === 0) {
      pctToday = 100;
      pctAfter = 100;
    } else {
      // Create a visual baseline to emphasize the difference (gain)
      const baseline = Math.max(0, Math.min(todayRaw, afterRaw) - (diff * 2.5));
      const maxGraph = Math.max(todayRaw, afterRaw) - baseline;
      pctToday = Math.max(((todayRaw - baseline) / maxGraph) * 100, 15);
      pctAfter = Math.max(((afterRaw - baseline) / maxGraph) * 100, 15);
    }
    
    barToday.style.width = `${pctToday}%`;
    barAfter.style.width = `${pctAfter}%`;
  }
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
          <p class="consigai-trust-copy">A ${brandNameHtml()} busca as melhores condições para você</p>
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
  const baNova = getCachedNode(cacheRef, doc, 'baNova', '#impactNovaParcela, #baNova')
  if (baNova?.textContent) {
    baNova.textContent = baNova.textContent.replace(/^[^0-9R$]*(?=R\$)/, '').trim()
  }
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
  if (heroEco) heroEco.dataset.benefitKind = 'monthly'
  const heroEcoLabel = getCachedNode(cacheRef, doc, 'heroEcoLabel', '.hc-saving-label')
  if (heroEcoLabel) heroEcoLabel.textContent = 'Economia mensal'

  const ctaSaving = getCachedNode(cacheRef, doc, 'ctaSaving', '#ctaSaving')
  if (ctaSaving) ctaSaving.textContent = `+${ecoFmt}/mês`

  if (ctaSaving) ctaSaving.dataset.benefitKind = 'monthly'
  const ctaSavingLabel = getCachedNode(cacheRef, doc, 'ctaSavingLabel', '.cta-saving-label')
  const heroSub = getCachedNode(cacheRef, doc, 'heroSub', '#heroSub')
  const baPill = getCachedNode(cacheRef, doc, 'baPill', '#baPill')
  const turboSnapshot = selectedEntry?.config?.id === 'turbo'
    ? getTurboSubOfferSnapshot(selectedEntry, selectedThirdSubOffer, usuario)
    : null
  if (turboSnapshot) {
    const turboValue = turboSnapshot.benefitDisplay
    if (heroEco) heroEco.textContent = turboValue
    if (heroEco) heroEco.dataset.benefitKind = turboSnapshot.label === TURBO_LABEL_INSTALLMENT ? 'monthly' : 'total'
    if (heroEcoLabel) heroEcoLabel.textContent = turboSnapshot.label === TURBO_LABEL_INSTALLMENT
      ? 'Economia mensal'
      : 'Economia total'
    if (ctaSaving) ctaSaving.textContent = `+${turboValue}`
    if (ctaSaving) ctaSaving.dataset.benefitKind = turboSnapshot.label === TURBO_LABEL_INSTALLMENT ? 'monthly' : 'total'
    if (ctaSavingLabel) ctaSavingLabel.textContent = turboSnapshot.label === TURBO_LABEL_INSTALLMENT
      ? 'de economia mensal'
      : 'de economia no contrato'
    if (heroSub) {
      heroSub.textContent = turboSnapshot.label === TURBO_LABEL_INSTALLMENT
        ? 'Turbo Economia focado em aliviar sua parcela.'
        : 'Turbo Economia focado em economizar no contrato.'
    }
    if (baPill) baPill.textContent = turboValue
  }

  const todayDeduct = getCachedNode(cacheRef, doc, 'todayDeduct', '.ba-col.today .ba-row-val.deduct')
  if (todayDeduct) todayDeduct.textContent = parcelaHoje
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
            <span class="consigai-offer-pill">Sem oferta disponível</span>
          </div>
          <div class="consigai-offer-lines consigai-offer-lines--no-min-height">
            <div class="consigai-offer-line">
              <span class="consigai-offer-line-main blue">Não há oferta para este cliente no momento</span>
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

function syncMobileOfferSelection(cacheRef, doc, selectedOfferIndexRef, refreshSelectedOfferUi) {
  if (!doc?.defaultView) return null
  const grid = getCachedNode(cacheRef, doc, 'offersGridMobileSync', '.offers-grid')
  const cards = getCachedNodeList(cacheRef, doc, 'offerCardsMobileSync', '.offers-grid .offer-card')
  if (!grid || !cards.length) return null

  const view = doc.defaultView

  let rafId = 0

  const updateSelectionFromViewport = () => {
    rafId = 0
    if (!view.matchMedia?.('(max-width: 760px)')?.matches) return
    const currentCards = Array.from(grid.querySelectorAll('.offer-card'))
    if (!currentCards.length) return

    const gridRect = grid.getBoundingClientRect()
    const targetCenterX = gridRect.left + (gridRect.width / 2)
    const targetCenterY = gridRect.top + (gridRect.height / 2)

    let bestIdx = 0
    let bestDistance = Number.POSITIVE_INFINITY

    currentCards.forEach((card, idx) => {
      const rect = card.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const cardCenterX = rect.left + (rect.width / 2)
      const cardCenterY = rect.top + (rect.height / 2)
      const distance = Math.hypot(cardCenterX - targetCenterX, cardCenterY - targetCenterY)
      if (distance < bestDistance) {
        bestDistance = distance
        bestIdx = idx
      }
    })

    if (bestIdx !== selectedOfferIndexRef.current) {
      refreshSelectedOfferUi(doc, bestIdx)
    }
  }

  const requestUpdate = () => {
    if (rafId) return
    rafId = view.requestAnimationFrame(updateSelectionFromViewport)
  }

  const onScroll = requestUpdate
  const onScrollEnd = updateSelectionFromViewport
  const onResize = requestUpdate

  // scrollend dispara após snap concluído — seleção precisa e imediata
  // scroll como fallback para browsers sem scrollend (Safari < 16.4)
  const hasScrollEnd = 'onscrollend' in grid
  if (hasScrollEnd) {
    grid.addEventListener('scrollend', onScrollEnd, { passive: true })
  }
  grid.addEventListener('scroll', onScroll, { passive: true })
  view.addEventListener('resize', onResize, { passive: true })
  requestUpdate()

  return () => {
    if (rafId) view.cancelAnimationFrame(rafId)
    if (hasScrollEnd) grid.removeEventListener('scrollend', onScrollEnd)
    grid.removeEventListener('scroll', onScroll)
    view.removeEventListener('resize', onResize)
  }
}

// ---------------------------------------------------------------------------
// Cards laterais desktop
// ---------------------------------------------------------------------------
const OFFER_UX_MAP = {
  turbo:       { summaryLabel: 'Economia estimada',  timing: 'Pode depender da portabilidade e do retorno dos bancos envolvidos' },
  equilibrio:  { summaryLabel: 'Economia mensal',    timing: 'Pode levar alguns dias úteis, conforme retorno dos bancos envolvidos' },
  folga:       { summaryLabel: 'Alívio mensal',      timing: 'Prazo e condições aparecem antes da confirmação' },
  apenas_novo: { summaryLabel: 'Você recebe',        timing: 'Até 24h úteis após assinatura e aprovação final' },
  apenas_refin:{ summaryLabel: 'Dinheiro disponível',timing: 'Até 24h úteis após assinatura e aprovação final',
                 warning: 'Pode alterar prazo e custo total. Você verá as condições antes de confirmar.' },
}

function DecisionGuideCard() {
  return (
    <section className="side-blue-card decision-guide-card">
      <div className="side-kicker">Guia ConsigAI</div>
      <h2>Como escolher sua <span>oferta</span></h2>
      <p>Em três passos simples, compare prioridade, impacto no bolso e condições antes de avançar.</p>
      <div className="choose-list">
        <div className="choose-row">
          <span className="choose-icon" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="guideOne" x1="28" y1="18" x2="66" y2="78" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#FFFFFF" />
                  <stop offset="0.45" stopColor="#A9FFD8" />
                  <stop offset="1" stopColor="#00E7FF" />
                </linearGradient>
              </defs>
              <path d="M51 18 C52.8 18 54.2 19.4 54.2 21.2 V75 C54.2 76.8 52.8 78.2 51 78.2 H43.8 C42 78.2 40.6 76.8 40.6 75 V33.8 L33.6 38.2 C32 39.2 30 38.7 29.1 37.1 L25.9 31.8 C25 30.3 25.5 28.3 27.1 27.4 L42.5 18.6 C43.1 18.2 43.9 18 44.7 18 H51Z" fill="url(#guideOne)" />
            </svg>
          </span>
          <div>
            <span className="choose-label">Prioridade</span>
            <strong>Escolha o que pesa mais agora</strong>
            <span>Receber dinheiro, reduzir o custo total ou aliviar a parcela do mês.</span>
          </div>
        </div>
        <div className="choose-row">
          <span className="choose-icon" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="guideTwo" x1="26" y1="18" x2="70" y2="78" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#FFFFFF" />
                  <stop offset="0.45" stopColor="#A9FFD8" />
                  <stop offset="1" stopColor="#00E7FF" />
                </linearGradient>
              </defs>
              <path d="M27 75 C27 72.8 27.8 70.9 29.3 69.4 L50.8 48.2 C55.4 43.6 57.4 40.5 57.4 36.7 C57.4 32.2 54.1 29.3 49 29.3 C44.1 29.3 40.7 32.1 39.5 36.6 C39 38.5 37.2 39.7 35.3 39.2 L29.1 37.8 C27.1 37.3 25.9 35.3 26.5 33.3 C29.2 23.7 37.6 18 49.4 18 C63.2 18 72.4 25.4 72.4 36.2 C72.4 43.7 68.9 49.4 61.5 56.3 L48.6 68.3 H69.6 C71.6 68.3 73.2 69.9 73.2 71.9 V75 C73.2 77 71.6 78.6 69.6 78.6 H30.6 C28.6 78.6 27 77 27 75Z" fill="url(#guideTwo)" />
            </svg>
          </span>
          <div>
            <span className="choose-label">Impacto no bolso</span>
            <strong>Compare o antes e depois</strong>
            <span>Veja parcela, sobra mensal, margem livre e economia estimada.</span>
          </div>
        </div>
        <div className="choose-row">
          <span className="choose-icon" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="guideThree" x1="25" y1="18" x2="72" y2="78" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#FFFFFF" />
                  <stop offset="0.45" stopColor="#A9FFD8" />
                  <stop offset="1" stopColor="#00E7FF" />
                </linearGradient>
              </defs>
              <path d="M48.6 79 C36.2 79 27.2 73.2 24.4 63.6 C23.8 61.6 25 59.6 27 59.1 L33.4 57.6 C35.2 57.2 37 58.2 37.7 60 C39.2 64.5 42.8 67.2 48.2 67.2 C54.2 67.2 58.2 64.1 58.2 59.2 C58.2 54 54.4 51.3 47.3 51.3 H42.5 C40.6 51.3 39.1 49.8 39.1 47.9 V42.8 C39.1 40.9 40.6 39.4 42.5 39.4 H47.1 C53.5 39.4 56.9 36.8 56.9 32.3 C56.9 28.1 53.5 25.5 48.4 25.5 C43.5 25.5 40.2 27.9 38.8 32 C38.2 33.8 36.4 34.8 34.6 34.4 L28.4 32.9 C26.4 32.4 25.2 30.4 25.9 28.4 C28.9 19.7 37.2 14.5 48.8 14.5 C62.7 14.5 72 21 72 31.5 C72 38.5 68.3 43.8 62.1 46.2 C69.4 48.7 73.4 54.3 73.4 61.8 C73.4 72.4 63.6 79 48.6 79Z" fill="url(#guideThree)" />
            </svg>
          </span>
          <div>
            <span className="choose-label">Condições</span>
            <strong>Entenda antes de confirmar</strong>
            <span>Confira taxa, prazo, custo total e próximos passos. Nada é contratado sem sua confirmação.</span>
          </div>
        </div>
      </div>
      <div className="guide-footer">
        <strong>Você decide no final</strong>
        <span>A ConsigAI compara por você, mas nenhuma contratação acontece sem sua confirmação.</span>
      </div>
    </section>
  )
}

function TrustMiniCard() {
  return (
    <section className="side-white-card">
      <h3>A ConsigAI compara</h3>
      <p>Recomendação baseada em economia, parcela, prazo e custo total.</p>
      <div className="trust-mini-list">
        <div className="trust-mini">
          <b>✓</b>
          <div>
            <strong>Sem compromisso</strong>
            <span>Você decide antes de avançar.</span>
          </div>
        </div>
        <div className="trust-mini">
          <b>✓</b>
          <div>
            <strong>Dados protegidos</strong>
            <span>Segurança e transparência.</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function StickyOfferSummary({ selectedOffer }) {
  if (!selectedOffer) return null

  const offerName =
    selectedOffer.name || selectedOffer.title || selectedOffer.nome ||
    selectedOffer.label || 'Oferta selecionada'

  const primaryLabel = selectedOffer.primaryLabel || 'Valor principal'
  const primaryValue =
    selectedOffer.primaryValue || selectedOffer.valorPrincipal || selectedOffer.valorReceber ||
    selectedOffer.creditoReceber || selectedOffer.economiaTotal ||
    selectedOffer.valor || 'Ver oferta'

  return (
    <section className="sticky-summary">
      <h3>Oferta escolhida</h3>

      <div className="summary-highlight">
        <small>Selecionada</small>
        <strong>{offerName}</strong>
      </div>

      <div className="summary-list">
        <div className="summary-row">
          <span>{primaryLabel}</span>
          <strong>{primaryValue}</strong>
        </div>

        <div className="summary-row">
          <span>Parcela estimada</span>
          <strong>{selectedOffer.installmentValue}</strong>
        </div>

        <div className="summary-row">
          <span>Prazo</span>
          <strong>{selectedOffer.termValue}</strong>
        </div>

        <div className="summary-row summary-row-stack">
          <span>Tipo de operação</span>
          <strong>{selectedOffer.operationType}</strong>
        </div>

        <div className="summary-row summary-row-stack">
          <span>Por que essa oferta?</span>
          <strong>{selectedOffer.whyThisOffer}</strong>
        </div>

      </div>

    </section>
  )
}

function ControlMiniCard() {
  return (
    <section className="side-blue-card compact">
      <div className="side-kicker">Você no controle</div>
      <h2>Entenda antes de <span>contratar</span></h2>
      <p>Nenhuma contratação é feita sem sua confirmação. A ConsigAI mostra taxas, prazos e custos antes do próximo passo.</p>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------
export default function Ofertas() {
  const navigate = useNavigate()
  const { activeOffers, usuario, impacto, loading, error } = useOffersData()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const profile = loadProfileData()
  const clientName = profile.nomeExibicao || profile.nomeCompleto || 'Cliente'

  const [ctaBar, setCtaBar] = useState(null) // { name, saving, savingLabel } | null
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [selectedThirdSubOffer, setSelectedThirdSubOffer] = useState('contract')
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

  const handleContractNavigation = useCallback(() => {
    const selected = activeOffersRef.current[selectedOfferIndexRef.current]
    if (!selected) return
    const contractState = buildContractState(selected, usuarioRef.current, selectedThirdSubOfferRef.current)
    navigate('/contratacao', contractState ? { state: contractState } : undefined)
  }, [navigate])

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    let ro = null
    const sync = () => {
      const fd = iframe.contentDocument
      if (!fd) return
      iframe.style.height = '1px'
      // body.scrollHeight é mais preciso que documentElement.scrollHeight a zoom != 100%
      const h = Math.max(fd.body?.scrollHeight ?? 0, fd.documentElement.scrollHeight)
      iframe.style.height = h + 'px'
    }
    const setup = () => {
      const fd = iframe.contentDocument
      if (!fd) return
      ro = new ResizeObserver(sync)
      ro.observe(fd.documentElement)
      sync()
    }
    iframe.addEventListener('load', setup)
    window.addEventListener('resize', sync)
    return () => {
      iframe.removeEventListener('load', setup)
      window.removeEventListener('resize', sync)
      ro?.disconnect()
    }
  }, [])

  useEffect(() => {
    activeOffersRef.current = activeOffers
    usuarioRef.current = usuario
    impactoRef.current = impacto
  }, [activeOffers, usuario, impacto])

  useEffect(() => {
    selectedThirdSubOfferRef.current = selectedThirdSubOffer
  }, [selectedThirdSubOffer])

  useEffect(() => {
    let normalizationTimer = null
    let skipObserverUntil = 0
    let intervalId = null
    let mobileSelectionCleanup = null

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
      const ctaName = doc.querySelector('#ctaName')
      const ctaSub = doc.querySelector('#ctaSub')
      const ctaSaving = doc.querySelector('#ctaSaving')
      const ctaSavingLabel = doc.querySelector('.cta-saving-label')
      if (ctaName) {
        setCtaBar(hasNoOffer ? null : {
          name: ctaName.textContent,
          sub: ctaSub?.textContent || '',
          saving: ctaSaving?.textContent || '',
          savingLabel: ctaSavingLabel?.textContent || '',
        })
      }
      setSelectedEntry(hasNoOffer ? null : selectedEntry)
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

      injectStyleOnce(frameDoc, 'consigaiResponsiveStyleApplied', RESPONSIVE_STYLES_CSS)
      injectStyleOnce(frameDoc, 'consigaiOfferRedesignStyleApplied', OFFER_CARD_REDESIGN_CSS)
      injectStyleOnce(frameDoc, 'consigaiTransparentBgApplied', TRANSPARENT_BG_CSS)
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

      if (!frameDoc.body?.dataset?.consigaiIframeHeaderOffsetApplied) {
        frameDoc.body.style.boxSizing = 'border-box'
        frameDoc.body.dataset.consigaiIframeHeaderOffsetApplied = '1'
      }

      injectStyleOnce(frameDoc, 'consigaiOfferBalancedLayoutStyleApplied', OFFER_CARD_BALANCED_LAYOUT_CSS)

      if (!frameDoc.body?.dataset?.consigaiLegacyLogoApplied) {
        const logoEl = frameDoc.querySelector('.topbar .logo')
        if (logoEl) {
          logoEl.innerHTML = '<img src="/logo-antigo.svg" alt="" aria-hidden="true" />'
          logoEl.addEventListener('click', () => navigate('/ofertas'))
          frameDoc.body.dataset.consigaiLegacyLogoApplied = '1'
        }
      }

      if (!frameDoc.body?.dataset?.consigaiHeroSectionCopyAdjusted) {
        const heroTextContainer = frameDoc.querySelector('.hero > div:first-child')
        if (heroTextContainer && isDesktop) {
          let note = frameDoc.querySelector('.consigai-hero-note')
          if (!note) {
            note = frameDoc.createElement('p')
            note.className = 'consigai-hero-note'
            heroTextContainer.appendChild(note)
          }
          note.innerHTML =
            `A ${brandNameHtml()} comparou seus contratos e encontrou opções para reduzir parcela, economizar no total ou receber dinheiro com clareza.`
        } else if (!isDesktop) {
          const existingNote = frameDoc.querySelector('.consigai-hero-note')
          if (existingNote?.parentElement) existingNote.parentElement.removeChild(existingNote)
        }
        const heroCompareLabel = frameDoc.querySelector('.hc-label')
        if (heroCompareLabel) {
          heroCompareLabel.innerHTML = `<span class="hc-label-main">Comparativo de oferta</span><span class="hc-label-sub">Antes e depois da ${brandNameHtml()}</span>`
        }
        // .section-header oculto via OFFER_CARD_REDESIGN_CSS

        frameDoc.body.dataset.consigaiHeroSectionCopyAdjusted = '1'
      }

      if (!frameDoc.body?.dataset?.consigaiLogoTextApplied) {
        const afterTag = frameDoc.querySelector('.ba-col.after .ba-col-tag')
        if (afterTag) {
          afterTag.innerHTML = ` <span class="brand-name">ConsigAI</span>`
          frameDoc.body.dataset.consigaiLogoTextApplied = '1'
        }
      }

      if (frameDoc !== attachedDocRef.current) {
        if (attachedDocRef.current && clickHandlerRef.current) {
          attachedDocRef.current.removeEventListener('click', clickHandlerRef.current, true)
        }
        if (mobileSelectionCleanup) {
          mobileSelectionCleanup()
          mobileSelectionCleanup = null
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
              setSelectedThirdSubOffer(subKey)
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
              // mobile: scroll já seleciona via syncMobileOfferSelection — tap é redundante
              const isMobile = frameDoc.defaultView?.matchMedia?.('(max-width: 760px)')?.matches
              if (isMobile) return
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
            handleContractNavigation()
          }
        }

        frameDoc.addEventListener('click', clickHandlerRef.current, true)
        attachedDocRef.current = frameDoc
      }

      if (!frameDoc.body?.dataset?.consigaiMobileSelectionSyncAttached) {
        mobileSelectionCleanup?.()
        mobileSelectionCleanup = syncMobileOfferSelection(
          docQueryCacheRef,
          frameDoc,
          selectedOfferIndexRef,
          refreshSelectedOfferUi,
        )
        frameDoc.body.dataset.consigaiMobileSelectionSyncAttached = '1'
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
      if (mobileSelectionCleanup) mobileSelectionCleanup()
      docQueryCacheRef.current = makeDomCache()
    }
  }, [navigate, isDesktop, handleContractNavigation])

  if (error) {
    return (
      <div className="offers-error-screen">
        <span className="offers-error-screen__icon" aria-hidden="true">⚠️</span>
        <p className="offers-error-screen__title">Erro ao carregar ofertas</p>
        <p className="offers-error-screen__msg">{error}</p>
      </div>
    )
  }

  const selectedOffer = selectedEntry
    ? buildSelectedOfferSummary(selectedEntry, usuario, selectedThirdSubOffer)
    : null

  return (
    <div style={{
      ...appPageStyle,
      minHeight: '100svh',
      paddingBottom: ctaBar ? (isDesktop ? '118px' : '172px') : 0,
    }}>
      {loading && <div className="offers-loading-bar" aria-hidden="true" />}
      {isDesktop ? (
        <DesktopPageHeader
          chipLabel={null}
          title={null}
          subtitle={null}
          clientName={clientName}
          onLogoClick={() => navigate('/ofertas')}
          actions={[
            { label: 'Acompanhamento', onClick: () => navigate('/acompanhamento') },
            { label: 'Configurações', onClick: () => navigate('/configuracoes') },
          ]}
        />
      ) : (
        <MobilePageHeader
          chipLabel={null}
          title={null}
          subtitle={null}
          clientName={clientName}
          onLogoClick={() => navigate('/ofertas')}
          actions={[
            { label: 'Acompanhamento', onClick: () => navigate('/acompanhamento') },
            { label: 'Configurações', onClick: () => navigate('/configuracoes') },
          ]}
        />
      )}
      <style>{WIDE_LAYOUT_CSS}</style>
      <div className="offers-desktop-layout">
        <aside className="offers-left-rail">
          <DecisionGuideCard />
        </aside>
        <main className="offers-center-content">
          <iframe
            ref={iframeRef}
            title="Ofertas"
            src="/Ofertas_ConsigAI.html"
            style={{
              width: '100%',
              height: '0',
              border: 'none',
              display: 'block',
              background: 'transparent',
              overflow: 'hidden',
            }}
          />
        </main>
        <aside className="offers-right-rail">
          <StickyOfferSummary selectedOffer={selectedOffer} />
          <ControlMiniCard />
        </aside>
      </div>
      {ctaBar && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: 'rgba(255,255,255,.97)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid #dde6f5',
          boxShadow: '0 -2px 16px rgba(0,24,81,.08)',
          padding: isDesktop ? '14px 24px' : '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: isDesktop ? 76 : undefined,
        }}>
          <div style={{
            display: 'grid',
            alignItems: 'center',
            gridTemplateColumns: isDesktop
              ? 'auto 1px 180px 320px'
              : 'minmax(0, 1fr) 132px',
            columnGap: isDesktop ? 28 : 16,
            rowGap: 10,
            width: 'fit-content',
            maxWidth: '100%',
            margin: '0 auto',
          }}>
            <div style={{
              width: 'fit-content',
              maxWidth: isDesktop ? 320 : 'none',
              minWidth: 0,
              justifySelf: isDesktop ? 'start' : 'stretch',
              paddingLeft: 0,
              paddingRight: 0,
              textAlign: 'left',
            }}>
              <div style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#071B45',
                lineHeight: '16px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textAlign: 'left',
              }}>{ctaBar.name}</div>
              {ctaBar.sub && <div style={{
                fontSize: 11,
                fontWeight: 500,
                color: '#667399',
                marginTop: 1,
                lineHeight: '15px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textAlign: 'left',
              }}>{ctaBar.sub}</div>}
            </div>
            {isDesktop && <div style={{ width: 1, height: 36, background: '#dde6f5', justifySelf: 'center' }} />}
            <div style={{
              width: isDesktop ? 180 : 132,
              minWidth: isDesktop ? 180 : 132,
              textAlign: 'left',
            }}>
              <div style={{
                width: isDesktop ? 180 : 132,
                minWidth: isDesktop ? 180 : 132,
                fontSize: 22,
                fontWeight: 800,
                color: '#007A52',
                letterSpacing: '-.02em',
                lineHeight: '25px',
                whiteSpace: 'nowrap',
                fontVariantNumeric: 'tabular-nums',
              }}>{ctaBar.saving}</div>
              <div style={{
                width: isDesktop ? 180 : 132,
                fontSize: 11,
                fontWeight: 500,
                color: '#667399',
                lineHeight: '13px',
                whiteSpace: 'nowrap',
              }}>{ctaBar.savingLabel}</div>
            </div>
            <button
              type="button"
              className="cta-btn-float"
              onClick={handleContractNavigation}
              style={{
                background: 'linear-gradient(145deg, #055ECE, #03246F)',
                color: '#fff', border: 0, borderRadius: 21,
                padding: '14px 28px', fontSize: 15, fontWeight: 900, lineHeight: 1.2,
                cursor: 'pointer', whiteSpace: 'nowrap',
                boxShadow: '0 8px 20px rgba(30,60,180,.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                gridColumn: isDesktop ? undefined : '1 / -1',
                width: isDesktop ? 320 : '100%',
                minWidth: isDesktop ? 320 : undefined,
                maxWidth: isDesktop ? 320 : undefined,
                minHeight: 44,
              }}
            >
              Continuar — você ainda pode revisar tudo
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
