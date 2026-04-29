import { chromium } from 'playwright'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { OFFER_CARD_REDESIGN_CSS } from '../src/styles/iframeOfertasStyles.js'
import { OFFER_CARD_CONFIG, MOCK_DADOS } from '../src/data/offersMock.js'
import { fmt, getEcoMensal, getParcelaNova } from '../src/lib/offerUtils.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const outDir = path.join(__dirname, 'combo-shots-v4')
await fs.mkdir(outDir, { recursive: true })

const offersMap = new Map(MOCK_DADOS.ofertas.map((o) => [o.id, o]))
const offerIds = OFFER_CARD_CONFIG.map((c) => c.id)

function comboKey(combo) {
  return combo.join('__')
}

function combinations(arr, k) {
  const out = []
  const pick = (start, chosen) => {
    if (chosen.length === k) {
      out.push(chosen.slice())
      return
    }
    for (let i = start; i < arr.length; i += 1) {
      chosen.push(arr[i])
      pick(i + 1, chosen)
      chosen.pop()
    }
  }
  pick(0, [])
  return out
}

function buildCardHtml(cfg, offer, isRecommended, selected) {
  if (cfg.id === 'turbo') {
    const economiaContrato = fmt(offer.economiaContrato ?? offer.economiaTotal ?? 0)
    const economiaParcela = `${fmt(offer.economiaParcela ?? getEcoMensal(offer, MOCK_DADOS.usuario.parcelaAtual))}/mês`
    return `
      <div class="offer-card turbo-offer${selected ? ' selected active' : ''}" id="${cfg.id}">
        <div class="consigai-offer-card">
          <div class="consigai-offer-title-row">
            <span class="consigai-offer-pill">${cfg.pill}</span>
            ${isRecommended ? '<div class="consigai-offer-head-badges"><span class="consigai-offer-badge-rec">Recomendada</span></div>' : ''}
          </div>
          <div class="consigai-offer-lines">
            <div class="consigai-offer-pretext">Economize sem pegar novo crédito</div>
            <div class="consigai-offer-mini-grid">
              <div class="consigai-offer-mini-card" data-suboffer="contract">
                <span class="consigai-offer-mini-label">No contrato</span>
                <span class="consigai-offer-mini-value">${economiaContrato}</span>
              </div>
              <div class="consigai-offer-mini-card" data-suboffer="installment">
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

  const isSimple = cfg.kind === 'simples'
  const showSecondaryLine = !isSimple
  let totalLabel = 'Parcela estimada em'
  let totalValue = getParcelaNova(offer, MOCK_DADOS.usuario.parcelaAtual)
  let metricLabel = 'Economia de'
  let metricValue = `${fmt(getEcoMensal(offer, MOCK_DADOS.usuario.parcelaAtual))}/mês`

  if (cfg.id === 'equilibrio') {
    totalLabel = 'Economize nos Contratos'
    totalValue = fmt(offer.economiaTotal ?? (getEcoMensal(offer, MOCK_DADOS.usuario.parcelaAtual) * 12))
    metricLabel = 'Parcela nova'
    metricValue = getParcelaNova(offer, MOCK_DADOS.usuario.parcelaAtual)
  } else if (cfg.id === 'folga') {
    totalLabel = 'Reduza a parcela para'
    totalValue = getParcelaNova(offer, MOCK_DADOS.usuario.parcelaAtual)
    metricLabel = 'Economia de'
    metricValue = `${fmt(offer.reducaoMensal ?? getEcoMensal(offer, MOCK_DADOS.usuario.parcelaAtual))}/mês`
  } else if (isSimple) {
    metricLabel = 'Parcela'
    metricValue = getParcelaNova(offer, MOCK_DADOS.usuario.parcelaAtual)
  }

  const isSimpleContract = cfg.id === 'apenas_novo' || cfg.id === 'apenas_refin'
  const simpleMiniLabelSecond = isSimpleContract ? 'Qtd Parcelas' : metricLabel
  const simpleMiniValueSecond = isSimpleContract ? String(offer.qtdParcelas ?? '—') : metricValue

  return `
    <div class="offer-card${isSimple ? ' simple-offer' : ''}${selected ? ' selected active' : ''}" id="${cfg.id}">
      <div class="consigai-offer-card">
        <div class="consigai-offer-title-row">
          <span class="consigai-offer-pill">${cfg.pill}</span>
          ${isRecommended ? '<div class="consigai-offer-head-badges"><span class="consigai-offer-badge-rec">Recomendada</span></div>' : ''}
        </div>
        <div class="consigai-offer-lines">
          <div class="consigai-offer-line">
            <span class="consigai-offer-line-main blue">Receba ${fmt(offer.creditoReceber ?? 0)}</span>
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

const combos = combinations(offerIds, 3)
const results = []

const browser = await chromium.launch({ headless: true })

for (const combo of combos) {
  const comboSet = new Set(combo)
  const cards = OFFER_CARD_CONFIG.filter((cfg) => comboSet.has(cfg.id))
  const html = `
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          :root {
            --font: Inter, Arial, Helvetica, sans-serif;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 32px;
            background: linear-gradient(180deg, #071f58 0%, #0a2a76 100%);
            font-family: var(--font);
          }
          .wrap {
            max-width: 1100px;
            margin: 0 auto;
          }
          .offers-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 14px;
            align-items: stretch;
          }
          ${OFFER_CARD_REDESIGN_CSS}
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="offers-grid">
            ${cards.map((cfg, idx) => buildCardHtml(cfg, MOCK_DADOS.ofertas.find((o) => o.id === cfg.id), idx === 0, idx === 0)).join('')}
          </div>
        </div>
      </body>
    </html>
  `

  const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 })
  await page.setContent(html, { waitUntil: 'load' })
  await page.waitForLoadState('networkidle')

  const cardData = await page.locator('.offer-card').evaluateAll((els) =>
    els.map((el) => {
      const r = el.getBoundingClientRect()
      return {
        id: el.id,
        width: Number(r.width.toFixed(2)),
        height: Number(r.height.toFixed(0)),
      }
    }),
  )
  const heights = cardData.map((c) => c.height)
  const widths = cardData.map((c) => c.width)
  const heightMin = Math.min(...heights)
  const heightMax = Math.max(...heights)
  const widthMin = Math.min(...widths)
  const widthMax = Math.max(...widths)

  const fileName = `${comboKey(combo)}.png`
  const screenshotPath = path.join(outDir, fileName)
  await page.screenshot({ path: screenshotPath, fullPage: true })
  await page.close()

  results.push({
    combo,
    cards: cardData,
    heightMin,
    heightMax,
    heightDelta: heightMax - heightMin,
    widthMin,
    widthMax,
    widthDelta: Number((widthMax - widthMin).toFixed(2)),
    equalHeight: heightMin === heightMax,
    screenshot: screenshotPath,
  })
}

await browser.close()
await fs.writeFile(path.join(outDir, 'results.json'), JSON.stringify(results, null, 2), 'utf8')
console.log(JSON.stringify(results, null, 2))
