import { useEffect, useRef, useState } from 'react'
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
import { brandNameHtml } from '../lib/brandNameHtml.js'

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

function applyIframeTransparentBackground(doc) {
  if (doc.body?.dataset?.consigaiTransparentBgApplied) return
  const styleEl = doc.createElement('style')
  styleEl.textContent = `
    html, body, .main {
      background: transparent !important;
    }
  `
  doc.head?.appendChild(styleEl)
  doc.body.dataset.consigaiTransparentBgApplied = '1'
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
    primaryLabel = turboSnapshot.label === 'Na parcela' ? 'Alívio mensal' : 'Economia no contrato'
    primaryValue = turboSnapshot.label === 'Na parcela'
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
    operationType = turboSnapshot?.label === 'Na parcela'
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
  const isParc = turboSnapshot.label === 'Na parcela'
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
    if (heroEco) heroEco.dataset.benefitKind = turboSnapshot.label === 'Na parcela' ? 'monthly' : 'total'
    if (heroEcoLabel) heroEcoLabel.textContent = turboSnapshot.label === 'Na parcela'
      ? 'Economia mensal'
      : 'Economia total'
    if (ctaSaving) ctaSaving.textContent = `+${turboValue}`
    if (ctaSaving) ctaSaving.dataset.benefitKind = turboSnapshot.label === 'Na parcela' ? 'monthly' : 'total'
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

function cardShell(type, idx, inner, extraClass = '') {
  return `<div class="offer-card ${type}-offer${extraClass ? ` ${extraClass}` : ''}" id="oc${idx}" role="button" tabindex="0" aria-selected="false">
    <div class="consigai-offer-card ${type}-shell">
      <span class="consigai-hidden-state-badge badge pick" id="badge${idx}">Escolher</span>
      ${inner}
    </div>
  </div>`
}

function recommendationBadge(label = 'Recomendado') {
  return `<span class="consigai-offer-badge-rec consigai-offer-badge-rec--recommended">${label}</span>`
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

function cardDetailsBtn(type, label = 'Ver condições') {
  return `<div class="consigai-offer-actions ${type}-actions">
    <button type="button" class="consigai-offer-details-btn ${type}-details-button">${label}</button>
  </div>`
}

function cardSimNote() {
  return '<span class="consigai-offer-sim-note">Simulação sem compromisso</span>'
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
  const economiaContrato = `<span class="turbo-value turbo-value-total">${fmt(offer.economiaContrato ?? offer.economiaTotal ?? 0)}</span>`
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
      <p class="turbo-intro">A ${brandNameHtml()} mostra dois caminhos para reduzir o custo do seu consignado com clareza.</p>
      <div class="turbo-options">
        ${opt('contract', 'No contrato', economiaContrato, 'Economia total estimada')}
        ${opt('installment', 'Na parcela', economiaParcela, 'Redução mensal estimada')}
      </div>
      <div class="consigai-offer-note turbo-note"><span class="note-icon" aria-hidden="true">✓</span><p>Boa opção para reduzir o custo do contrato sem contratar novo crédito.</p></div>
      ${cardDetailsBtn('turbo')}
    </div>
  `)
}

function buildEquilibrioCard(offer, idx, usuario, isRecommended) {
  const valorNaConta = fmt(offer.creditoReceber ?? 0)
  const economiaNosContratos = fmt(offer.economiaTotal ?? (getEcoMensal(offer, usuario.parcelaAtual) * 12))
  const badge = isRecommended ? '<div class="equilibrio-status">★ Recomendado</div>' : ''
  return cardShell('equilibrio', idx, `
    ${cardHeader('equilibrio', svgEquilibrio(idx), 'Melhor equilíbrio', 'Mais equilíbrio para decidir', badge)}
    <div class="equilibrio-body">
      <h2 class="equilibrio-heading">Receba dinheiro e <span>Economize</span></h2>
      <p class="equilibrio-intro">Boa opção para combinar dinheiro na conta com economia no contrato.</p>
      <div class="equilibrio-benefit-grid">
        <div class="equilibrio-benefit money">
          <span class="equilibrio-benefit-label">Na conta</span>
          <strong>${valorNaConta}</strong>
          ${cardSimNote()}
          <small>valor estimado liberado</small>
        </div>
        <div class="equilibrio-benefit economy">
          <span class="equilibrio-benefit-label">Nos contratos</span>
          <strong>${economiaNosContratos}</strong>
          ${cardSimNote()}
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
    ${cardHeader('folga', svgFolga(idx), 'Mais folga por mês', 'Mais espaço no orçamento')}
    <div class="folga-body">
      <h2 class="folga-heading">Receba dinheiro e <span>Reduza a Parcela</span></h2>
      <p class="folga-intro">Boa opção para ganhar fôlego mensal com parcela menor e dinheiro na conta.</p>
      <div class="folga-highlight-grid">
        <div class="folga-highlight money">
          <small>Na conta</small>
          <strong>${valorNaConta}</strong>
          ${cardSimNote()}
          <span>valor estimado liberado</span>
        </div>
        <div class="folga-highlight installment">
          <small>Nova parcela estimada</small>
          <strong>${parcelaNova}</strong>
          ${cardSimNote()}
          <span>menor impacto mensal</span>
        </div>
      </div>
      ${cardNote('folga', '✓', 'Indicada para aliviar o orçamento mensal, com dinheiro na conta e parcela reduzida.')}
      ${cardDetailsBtn('folga')}
    </div>
  `)
}

function buildNovoCard(offer, idx, isRecommended) {
  const valorEstimado = fmt(offer.creditoReceber ?? 0)
  return cardShell('new-contract', idx, `
    ${cardHeader('new-contract', svgNovo(), 'Novo Contrato', 'Crédito novo com clareza', isRecommended ? recommendationBadge() : '')}
    <div class="new-contract-body">
      <h2 class="new-contract-heading">Receba dinheiro <span>na sua conta</span></h2>
      <p class="card-plain-intro">Oferta focada em liberar valor novo, com parcela clara e condições visíveis antes de continuar.</p>
      <div class="new-contract-highlight">
        <small>Valor estimado disponível</small>
        <strong>${valorEstimado}</strong>
        <span>Simulação sem compromisso</span>
      </div>
      ${cardNote('new-contract', 'i', 'Usa margem livre. Taxa, custo total, prazo e parcela aparecem antes da confirmação.')}
      ${cardDetailsBtn('new-contract')}
    </div>
  `, isRecommended ? 'recommended' : '')
}

function buildRefinCard(offer, idx) {
  const valorEstimado = fmt(offer.creditoReceber ?? 0)
  return cardShell('refin', idx, `
    ${cardHeader('refin', svgRefin(idx), 'Refinanciamento', 'Ajuste o contrato atual')}
    <div class="refin-body">
      <h2 class="refin-heading"><span>Dinheiro ajustando seu</span><span class="refin-heading-light">contrato</span></h2>
      <p class="card-plain-intro">Use um contrato existente para liberar valor com comparação clara de prazo, parcela e custo total.</p>
      <div class="refin-highlight">
        <small>Valor estimado disponível</small>
        <strong>${valorEstimado}</strong>
        <span>Simulação sem compromisso</span>
      </div>
      ${cardNote('refin', 'i', 'Altera seus contratos ativos. Você verá taxa, parcelas e condições antes de confirmar.')}
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
        ${isSimple ? `<div class="consigai-offer-mini-grid"><div class="consigai-offer-mini-card"><span class="consigai-offer-mini-label">${metricLabel}</span><span class="consigai-offer-mini-value">${metricValue}${cardSimNote()}</span></div><div class="consigai-offer-mini-card"><span class="consigai-offer-mini-label">${miniLabelSecond}</span><span class="consigai-offer-mini-value">${miniValueSecond}${cardSimNote()}</span></div></div>` : ''}
        ${!isSimple ? cardSimNote() : ''}
        <div class="consigai-offer-note"><span class="consigai-offer-note-text"><span class="consigai-offer-note-sub">${cfg.note}</span></span></div>
        <div class="consigai-offer-actions generic-actions">
          <button type="button" class="consigai-offer-details-btn generic-details-button">Ver condições</button>
          <p style="margin: 4px 0 0; font-size: 11px; color: #64748B; text-align: center; font-weight: 600;">Simulação sem compromisso</p>
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
  if (cfg.id === 'apenas_novo') return buildNovoCard(offer, idx, isRecommended)
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
    .map((entry, idx) => buildOfferCardHtml({
      ...entry,
      isRecommended: entry.isRecommended || (!activeOffers.some((item) => item.isRecommended) && idx === 0),
    }, idx, usuario, selectedThirdSubOffer))
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

const WIDE_LAYOUT_CSS = `
  .offers-desktop-layout {
    width: min(1680px, calc(100% - 48px));
    margin: 0 auto;
    display: grid;
    grid-template-columns: 250px minmax(0, 1fr) 250px;
    gap: 22px;
    align-items: start;
  }
  .offers-center-content { min-width: 0; }
  .offers-left-rail, .offers-right-rail {
    position: sticky;
    top: 96px;
    display: grid;
    gap: 16px;
  }
  .side-blue-card {
    padding: 22px; border-radius: 28px; color: white;
    background:
      radial-gradient(circle at 88% 10%, rgba(0,231,255,0.20), transparent 34%),
      linear-gradient(145deg, #06184E 0%, #03246F 54%, #055ECE 100%);
    border: 1px solid rgba(0,231,255,0.20);
    box-shadow: 0 24px 68px rgba(3,36,111,0.14);
    overflow: hidden; position: relative;
  }
  .decision-guide-card {
    min-height: 756px;
    height: 756px;
    display: flex;
    flex-direction: column;
  }
  .decision-guide-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 10px;
    padding: 8px 12px;
    border-radius: 999px;
    background: rgba(0, 168, 107, .12);
    border: 1px solid rgba(0, 168, 107, .18);
    color: #A8FFF0;
    font-size: 10px;
    font-weight: 950;
    letter-spacing: .08em;
    text-transform: uppercase;
  }
  .side-blue-card::after {
    content: ""; position: absolute;
    width: 240px; height: 240px; right: -130px; bottom: -130px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,231,255,0.20), transparent 64%);
  }
  .side-blue-card > * { position: relative; z-index: 1; }
  .side-kicker {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 7px 10px; border-radius: 999px;
    background: rgba(255,255,255,.10); border: 1px solid rgba(255,255,255,.16);
    color: #DDE8F6; font-size: 10px; font-weight: 950;
    text-transform: uppercase; letter-spacing: .08em;
  }
  .side-kicker::before {
    content: ""; width: 7px; height: 7px; border-radius: 50%;
    background: #00E7FF; box-shadow: 0 0 10px rgba(0,231,255,.9);
  }
  .side-blue-card h2 {
    margin-top: 18px; color: white;
    font-size: 27px; line-height: .98; font-weight: 950; letter-spacing: -0.06em;
  }
  .side-blue-card h2 span { color: #00A86B; }
  .side-blue-card p {
    margin-top: 12px; color: rgba(255,255,255,.76);
    font-size: 12.5px; line-height: 1.45; font-weight: 650;
  }
  .choose-list { display: grid; gap: 10px; margin-top: 18px; }
  .decision-guide-card .choose-list {
    flex: 1;
    align-content: start;
  }
  .choose-row {
    display: flex; gap: 10px; padding: 11px; border-radius: 16px;
    background: rgba(255,255,255,.10); border: 1px solid rgba(255,255,255,.14);
  }
  .choose-icon {
    width: 28px; height: 28px; flex: 0 0 auto;
    display: grid; place-items: center;
  }
  .choose-label {
    display: block; margin-bottom: 2px;
    color: rgba(255,255,255,.50); font-size: 9px; font-weight: 950;
    text-transform: uppercase; letter-spacing: .08em;
  }
  .choose-row strong { display: block; color: white; font-size: 12px; font-weight: 950; }
  .choose-row span {
    display: block; margin-top: 3px; color: rgba(255,255,255,.70);
    font-size: 10.5px; line-height: 1.25; font-weight: 650;
  }
  .guide-footer {
    margin-top: 16px; padding: 12px 14px; border-radius: 16px;
    background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.14);
  }
  .decision-guide-card .guide-footer {
    margin-top: auto;
  }
  .guide-footer strong {
    display: block; color: white; font-size: 11.5px; font-weight: 950;
  }
  .guide-footer span {
    display: block; margin-top: 3px; color: rgba(255,255,255,.65);
    font-size: 10.5px; line-height: 1.3; font-weight: 650;
  }
  .side-white-card, .sticky-summary {
    padding: 20px; border-radius: 26px;
    background:
      radial-gradient(circle at 92% 8%, rgba(0,231,255,0.09), transparent 34%),
      linear-gradient(180deg, rgba(255,255,255,.98) 0%, #FFFFFF 100%);
    border: 1px solid #DDE8F6; box-shadow: 0 16px 38px rgba(3,36,111,0.09);
  }
  .sticky-summary {
    min-height: 520px;
    height: 520px;
    display: flex;
    flex-direction: column;
  }
  .side-white-card h3, .sticky-summary h3 {
    color: #03246F; font-size: 15px; font-weight: 950;
    text-transform: uppercase; letter-spacing: .02em;
  }
  .side-white-card > p, .sticky-summary > p {
    margin-top: 6px; color: #64748B; font-size: 12px; line-height: 1.35; font-weight: 650;
  }
  .trust-mini-list { display: grid; gap: 10px; margin-top: 14px; }
  .trust-mini {
    display: flex; gap: 9px; align-items: flex-start; padding: 10px;
    border-radius: 15px; background: #F4F8FF; border: 1px solid #DDE8F6;
  }
  .trust-mini b {
    width: 20px; height: 20px; flex: 0 0 auto; border-radius: 50%;
    display: grid; place-items: center;
    background: #E9F8F1; border: 1px solid #BDECD7; color: #007A52; font-size: 11px;
  }
  .trust-mini strong { display: block; color: #03246F; font-size: 11.5px; font-weight: 950; }
  .trust-mini span {
    display: block; margin-top: 2px; color: #64748B;
    font-size: 10.5px; line-height: 1.25; font-weight: 650;
  }
  .consigai-offer-sim-note {
    display: block;
    margin-top: 4px;
    color: #64748B;
    font-size: 10px;
    line-height: 1.2;
    font-weight: 800;
    letter-spacing: .04em;
    text-transform: uppercase;
  }
  .summary-highlight {
    margin-top: 14px; padding: 16px; border-radius: 20px;
    background:
      radial-gradient(circle at 92% 8%, rgba(0,231,255,0.12), transparent 34%),
      linear-gradient(180deg, #F8FBFF 0%, #FFFFFF 100%);
    border: 1px solid rgba(0,231,255,.32);
    display: flex; flex-direction: column; justify-content: center; align-items: flex-start;
    min-height: 72px;
  }
  .summary-highlight small {
    color: #055ECE; font-size: 10px; font-weight: 950;
    letter-spacing: .08em; text-transform: uppercase;
  }
  .summary-highlight strong {
    display: block; margin-top: 6px; color: #03246F;
    font-size: 17px; font-weight: 950; line-height: 1.1;
  }
  .summary-list {
    display: grid;
    grid-template-rows: 46px 46px 46px 78px 112px;
    margin-top: 12px;
    flex: 1;
    align-content: start;
  }
  .summary-row {
    display: flex; justify-content: space-between; gap: 12px;
    padding: 8px 0; border-bottom: 1px solid #DDE8F6;
    color: #64748B; font-size: 12px; font-weight: 800;
    min-height: 0;
    align-items: center;
  }
  .summary-row-stack {
    display: grid;
    gap: 4px;
    align-content: start;
    padding-top: 10px;
  }
  .summary-row:last-child { border-bottom: 0; }
  .summary-row strong { color: #03246F; font-weight: 950; text-align: right; }
  .summary-row-stack strong { text-align: left; line-height: 1.35; }
  .summary-row.green strong { color: #007A52; }
  .summary-cta {
    width: 100%; min-height: 52px; margin-top: 16px; border: 0; border-radius: 17px;
    background: linear-gradient(145deg, #055ECE, #03246F); color: white;
    font-weight: 950; font-size: 14px; font-family: inherit; cursor: pointer;
    box-shadow: 0 18px 38px rgba(5,94,206,.22);
  }
  .summary-warning {
    margin-top: 12px; padding: 11px 12px; border-radius: 14px;
    background: #F4F8FF; border: 1px solid #DDE8F6;
    color: #64748B; font-size: 11px; line-height: 1.35; font-weight: 650;
  }
  .side-blue-card.compact { padding: 20px; }
  .side-blue-card.compact h2 { font-size: 24px; }
  .summary-secondary {
    width: 100%; min-height: 48px; margin-top: 10px; border-radius: 16px;
    border: 1px solid #BFD4F6; background: #FFFFFF; color: #055ECE;
    font-weight: 950; font-size: 14px; font-family: inherit; cursor: pointer;
  }
  @media (max-width: 1500px) {
    .offers-desktop-layout { grid-template-columns: minmax(0, 1fr) 250px; }
    .offers-left-rail { display: none; }
  }
  @media (max-width: 1100px) {
    .offers-desktop-layout { display: block; width: 100%; }
    .offers-left-rail, .offers-right-rail { display: none; }
  }
`

function DecisionGuideCard() {
  return (
    <section className="side-blue-card decision-guide-card">
      <div className="side-kicker">Guia ConsigAI</div>
      <span className="decision-guide-badge">Consulta gratuita</span>
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

      applyResponsiveStyles(frameDoc)
      applyOfferCardRedesignStyles(frameDoc)
      applyIframeTransparentBackground(frameDoc)
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
          afterTag.innerHTML = ` <span class="brand-name">Consig<span class="brand-ai">AI</span></span>`
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
            navigateToContract()
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
  }, [navigate, isDesktop])

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
          left: isDesktop ? '50%' : 0,
          right: isDesktop ? 'auto' : 0,
          width: isDesktop ? '100vw' : 'auto',
          transform: isDesktop ? 'translateX(-50%)' : 'none',
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
              onClick={() => {
                const selected = activeOffers[selectedOfferIndexRef.current]
                if (!selected) return
                const contractState = buildContractState(selected, usuario, selectedThirdSubOfferRef.current)
                navigate('/contratacao', contractState ? { state: contractState } : undefined)
              }}
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
