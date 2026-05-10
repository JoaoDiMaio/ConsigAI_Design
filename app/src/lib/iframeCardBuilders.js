// HTML string builders para os cards de oferta injetados no iframe (e na preview nativa).
// Sem dependências de React — seguro importar em qualquer contexto.
import { fmt, getEcoMensal, getParcelaNova } from './offerUtils.js'
import { brandNameHtml } from './brandNameHtml.js'
import { TURBO_LABEL_INSTALLMENT, TURBO_LABEL_CONTRACT } from '../data/offersMock.js'

// Sanitiza strings de texto antes de interpolar em HTML.
// Necessário quando campos de configuração (pill, note, ctaName) vierem da API real.
function escapeHtml(str) {
  if (typeof str !== 'string') return String(str ?? '')
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// ---------------------------------------------------------------------------
// Shell helpers
// ---------------------------------------------------------------------------
export function cardShell(type, idx, inner, extraClass = '') {
  return `<div class="offer-card ${type}-offer${extraClass ? ` ${extraClass}` : ''}" id="oc${idx}" role="button" tabindex="0" aria-selected="false">
    <div class="consigai-offer-card consigai-card-shell ${type}-shell">
      <span class="consigai-hidden-state-badge badge pick" id="badge${idx}">Escolher</span>
      ${inner}
    </div>
  </div>`
}

export function cardHeader(type, iconHtml, title, subtitle) {
  return `<div class="consigai-card-header ${type}-header">
    <div class="consigai-card-title ${type}-title">
      <div class="${type}-icon" aria-hidden="true">${iconHtml}</div>
      <div class="consigai-card-title-copy"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(subtitle)}</span></div>
    </div>
  </div>`
}

export function cardNote(type, icon, text) {
  return `<div class="consigai-card-note ${type}-note"><span class="${type}-note-icon">${escapeHtml(icon)}</span><p>${escapeHtml(text)}</p></div>`
}

export function cardDetailsBtn(type, label = 'Ver condições') {
  return `<div class="consigai-offer-actions consigai-card-actions ${type}-actions">
    <button type="button" class="consigai-offer-details-btn consigai-card-cta ${type}-details-button">${label}</button>
  </div>`
}

export function cardSimNote() {
  return '<span class="consigai-offer-sim-note consigai-estimada-text">estimada</span>'
}

// ---------------------------------------------------------------------------
// SVG icons
// ---------------------------------------------------------------------------
export function svgEquilibrio(idx) {
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

export function svgFolga(idx) {
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

export function svgNovo() {
  return `<svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="consigaiGradient" x1="30" y1="18" x2="96" y2="112" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00E7FF"/><stop offset="0.38" stop-color="#1DA1EB"/><stop offset="0.72" stop-color="#1878DE"/><stop offset="1" stop-color="#055ECE"/></linearGradient></defs>
    <path d="M64 12C68.1 12 71.4 15.3 71.4 19.4V108.6C71.4 112.7 68.1 116 64 116C59.9 116 56.6 112.7 56.6 108.6V19.4C56.6 15.3 59.9 12 64 12Z" fill="url(#consigaiGradient)" stroke="#000" stroke-width="3" stroke-linejoin="round"/>
    <path d="M92.6 30.4C84.7 23.4 74.1 19.6 62.5 19.6C42.6 19.6 28.6 30.1 28.6 45.5C28.6 61.9 41.3 68.1 60.3 71.8L72.3 74.1C82.4 76.1 87.4 79.4 87.4 85.5C87.4 93.1 79.4 98.2 66.7 98.2C53.4 98.2 42.1 93.7 33.7 86.1C30.6 83.3 25.9 83.6 23.1 86.7C20.3 89.8 20.6 94.5 23.7 97.3C35.2 107.7 50.3 113.2 66.7 113.2C87.7 113.2 102.7 102.3 102.7 85.1C102.7 68.5 91.1 61.2 74.6 58L62.2 55.6C50.2 53.3 43.9 50.2 43.9 44.7C43.9 38.1 51.3 33.9 62.5 33.9C70.6 33.9 77.5 36.3 82.6 40.8C85.7 43.6 90.4 43.3 93.2 40.2C96 37.1 95.7 33.1 92.6 30.4Z" fill="url(#consigaiGradient)" stroke="#000" stroke-width="3" stroke-linejoin="round"/>
  </svg>`
}

export function svgRefin(idx) {
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

// ---------------------------------------------------------------------------
// Card builders
// ---------------------------------------------------------------------------
export function buildTurboCard(cfg, offer, idx, usuario, selectedThirdSubOffer) {
  const economiaContrato = `<strong class="turbo-value turbo-value-total">${fmt(offer.economiaContrato ?? offer.economiaTotal ?? 0)}</strong>`
  const novaParcelaTurbo = fmt(offer.parcelaNova ?? (usuario.parcelaAtual - (offer.economiaParcela ?? 0)))
  const sel = selectedThirdSubOffer === 'installment' ? 'installment' : 'contract'
  const opt = (key, label, val, sub) => {
    const active = sel === key
    return `<button type="button" class="consigai-offer-mini-card consigai-card-highlight turbo-option option${active ? ' active is-selected' : ''}" data-suboffer="${key}" role="button" tabindex="0" aria-pressed="${active}">
      <span class="option-label">${label}</span>
      <strong>${val}</strong>
      <small class="consigai-estimada-text">${sub}</small>
    </button>`
  }
  return cardShell('turbo', idx, `
    <div class="turbo-module-header">
      <div class="turbo-module-title">
        <img class="turbo-module-logo" src="/ConsigIA_logo_only_no_background.svg" alt="" aria-hidden="true" />
        <div><strong>Turbo Economia</strong><span>Foco em pagar menos — sem novo crédito</span></div>
      </div>
    </div>
    <div class="consigai-card-body turbo-body">
      <h2 class="consigai-card-heading turbo-heading"><span class="turbo-heading-blue">Escolha onde quer</span><span class="turbo-heading-green">Economizar</span></h2>
      <p class="consigai-card-intro card-plain-intro turbo-intro">A ${brandNameHtml()} mostra dois caminhos para reduzir o custo do seu consignado com clareza.</p>
      <div class="consigai-card-highlight-grid turbo-options">
        ${opt('contract', 'Nos contratos', economiaContrato, 'estimada')}
        ${opt('installment', 'Nova parcela', novaParcelaTurbo, 'estimada')}
      </div>
      <div class="consigai-offer-note turbo-note"><span class="note-icon" aria-hidden="true">✓</span><p>Você reduz o custo. Sem precisar contratar novo crédito.</p></div>
      ${cardDetailsBtn('turbo', 'Ver minha economia')}
    </div>
  `)
}

export function buildEquilibrioCard(offer, idx, usuario) {
  const valorNaConta = fmt(offer.creditoReceber ?? 0)
  const economiaNosContratos = fmt(offer.economiaTotal ?? (getEcoMensal(offer, usuario.parcelaAtual) * 12))
  return cardShell('equilibrio', idx, `
    ${cardHeader('equilibrio', svgEquilibrio(idx), 'Melhor equilíbrio', 'Dinheiro na conta + economia no contrato')}
    <div class="consigai-card-body equilibrio-body">
      <h2 class="consigai-card-heading equilibrio-heading">Receba dinheiro e <span>Economize</span></h2>
      <p class="consigai-card-intro equilibrio-intro">Boa opção para combinar dinheiro na conta com economia no contrato.</p>
      <div class="consigai-card-highlight-grid equilibrio-benefit-grid">
        <div class="consigai-card-highlight equilibrio-benefit money">
          <span class="equilibrio-benefit-label">Na conta</span>
          <strong>${valorNaConta}</strong>
          <small class="consigai-estimada-text">estimada</small>
        </div>
        <div class="consigai-card-highlight equilibrio-benefit economy">
          <span class="equilibrio-benefit-label">Nos contratos</span>
          <strong>${economiaNosContratos}</strong>
          <small class="consigai-estimada-text">estimada</small>
        </div>
      </div>
      ${cardNote('equilibrio', '✓', 'Dinheiro disponível e custo menor. Equilíbrio antes de decidir.')}
      ${cardDetailsBtn('equilibrio', 'Ver meu equilíbrio')}
    </div>
  `)
}

export function buildFolgaCard(offer, idx, usuario) {
  const valorNaConta = fmt(offer.creditoReceber ?? 0)
  const parcelaNova = getParcelaNova(offer, usuario.parcelaAtual)
  return cardShell('folga', idx, `
    ${cardHeader('folga', svgFolga(idx), 'Mais folga por mês', 'Parcela menor + dinheiro na conta')}
    <div class="consigai-card-body folga-body">
      <h2 class="consigai-card-heading folga-heading">Receba dinheiro e <span>Reduza a Parcela</span></h2>
      <p class="consigai-card-intro folga-intro">Boa opção para ganhar fôlego mensal com parcela menor e dinheiro na conta.</p>
      <div class="consigai-card-highlight-grid folga-highlight-grid">
        <div class="consigai-card-highlight folga-highlight money">
          <small>Na conta</small>
          <strong>${valorNaConta}</strong>
          <span class="consigai-estimada-text">estimada</span>
        </div>
        <div class="consigai-card-highlight folga-highlight installment">
          <small>Nova parcela</small>
          <strong>${parcelaNova}</strong>
          <span class="consigai-estimada-text">estimada</span>
        </div>
      </div>
      ${cardNote('folga', '✓', 'Foco em aliviar o peso mensal. Menos saindo do bolso todo mês.')}
      ${cardDetailsBtn('folga', 'Ver minha folga mensal')}
    </div>
  `)
}

export function buildNovoCard(offer, idx) {
  const valorEstimado = fmt(offer.creditoReceber ?? 0)
  return cardShell('new-contract', idx, `
    ${cardHeader('new-contract', svgNovo(), 'Novo Contrato', 'Crédito novo com clareza')}
    <div class="consigai-card-body new-contract-body">
      <h2 class="consigai-card-heading new-contract-heading">Receba dinheiro <span>na sua conta</span></h2>
      <p class="consigai-card-intro card-plain-intro new-contract-intro">Oferta focada em liberar novo valor com condicoes claras antes de continuar</p>
      <div class="consigai-card-highlight new-contract-highlight">
        <small>Valor estimado disponível</small>
        <strong>${valorEstimado}</strong>
        <span class="consigai-estimada-text">estimada</span>
      </div>
      ${cardNote('new-contract', 'i', 'Taxa, parcela, prazo e custo total aparecem antes de confirmar. Sem surpresa.')}
      ${cardDetailsBtn('new-contract', 'Ver condições do crédito')}
    </div>
  `)
}

export function buildRefinCard(offer, idx) {
  const valorEstimado = fmt(offer.creditoReceber ?? 0)
  return cardShell('refin', idx, `
    ${cardHeader('refin', svgRefin(idx), 'Refinanciamento', 'Ajuste o contrato atual')}
    <div class="consigai-card-body refin-body">
      <h2 class="consigai-card-heading refin-heading"><span>Use seus contratos para </span><span class="refin-heading-light">Receber Valor</span></h2>
      <p class="consigai-card-intro card-plain-intro refin-intro">Libere valor com seus contratos existentes. Condições claras antes de continuar.</p>
      <div class="consigai-card-highlight refin-highlight">
        <small>Valor estimado disponível</small>
        <strong>${valorEstimado}</strong>
        <span class="consigai-estimada-text">estimada</span>
      </div>
      ${cardNote('refin', 'i', 'Você vê taxa, parcelas e condições antes de avançar. Nada muda sem sua confirmação.')}
      ${cardDetailsBtn('refin', 'Ver condições do refinanciamento')}
    </div>
  `)
}

export function buildGenericCard(cfg, offer, idx, usuario) {
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
        <div class="consigai-offer-head"></div><span class="consigai-offer-pill">${escapeHtml(cfg.pill)}</span>
        <div class="consigai-offer-lines">
          <div class="consigai-offer-line">
            <span class="consigai-offer-line-main blue">Receba ${moneyValue}</span>
            <span class="consigai-offer-line-helper">na sua conta</span>
          </div>
          ${!isSimple ? `<div class="consigai-offer-line"><span class="consigai-offer-line-main consigai-offer-total-stack"><span class="consigai-offer-total-label"><span class="consigai-offer-word-orange">${totalLabel}</span></span><span class="consigai-offer-value-green">${totalValue}</span></span></div>` : ''}
        </div>
        ${isSimple ? `<div class="consigai-offer-mini-grid"><div class="consigai-offer-mini-card"><span class="consigai-offer-mini-label">${metricLabel}</span><span class="consigai-offer-mini-value">${metricValue}${cardSimNote()}</span></div><div class="consigai-offer-mini-card"><span class="consigai-offer-mini-label">${miniLabelSecond}</span><span class="consigai-offer-mini-value">${miniValueSecond}${cardSimNote()}</span></div></div>` : ''}
        ${!isSimple ? cardSimNote() : ''}
        <div class="consigai-offer-note"><span class="consigai-offer-note-text"><span class="consigai-offer-note-sub">${escapeHtml(cfg.note)}</span></span></div>
        <div class="consigai-offer-actions generic-actions">
          <button type="button" class="consigai-offer-details-btn generic-details-button">Ver condições</button>
          <p style="margin: 4px 0 0; font-size: 11px; color: #64748B; text-align: center; font-weight: 600;">Simulação sem compromisso</p>
        </div>
      </div>
    </div>
  `
}

export function buildOfferCardHtml(entry, idx, usuario, selectedThirdSubOffer = 'contract') {
  const { config: cfg, data: offer } = entry
  if (cfg.id === 'turbo')       return buildTurboCard(cfg, offer, idx, usuario, selectedThirdSubOffer)
  if (cfg.id === 'equilibrio')  return buildEquilibrioCard(offer, idx, usuario)
  if (cfg.id === 'folga')       return buildFolgaCard(offer, idx, usuario)
  if (cfg.id === 'apenas_novo') return buildNovoCard(offer, idx)
  if (cfg.id === 'apenas_refin') return buildRefinCard(offer, idx)
  return buildGenericCard(cfg, offer, idx, usuario)
}
