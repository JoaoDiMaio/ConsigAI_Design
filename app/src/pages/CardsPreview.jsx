import { useMemo } from 'react'
import { OFFER_CARD_CONFIG, MOCK_DADOS } from '../data/offersMock.js'
import { buildOfferCardHtml } from '../lib/iframeCardBuilders.js'
import { OFFER_CARD_REDESIGN_CSS, OFFER_CARD_BALANCED_LAYOUT_CSS } from '../styles/iframeOfertasStyles.js'
import { appFontFamily } from '../ui/theme.js'

const ALL_IDS = ['equilibrio', 'folga', 'turbo', 'apenas_novo', 'apenas_refin']

const PREVIEW_CSS = `
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; }
  .cards-preview-page {
    min-height: 100vh;
    background: #F0F5FF;
    padding: 32px 24px 48px;
    font-family: ${appFontFamily};
  }
  .cards-preview-header {
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .cards-preview-header h1 {
    margin: 0;
    font-size: 18px;
    font-weight: 800;
    color: #03246F;
    letter-spacing: -.02em;
  }
  .cards-preview-header a {
    font-size: 13px;
    color: #64748B;
    text-decoration: none;
    padding: 6px 12px;
    border: 1px solid #DDE8F6;
    border-radius: 8px;
    background: #fff;
  }
  .cards-preview-header a:hover { background: #F4F8FF; }
  .cards-preview-grid.offers-grid {
    display: grid !important;
    grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
    gap: 16px !important;
    align-items: stretch !important;
    grid-auto-rows: 1fr !important;
  }
  .cards-preview-grid .offer-card {
    height: 100% !important;
    align-self: stretch !important;
  }
` 

export default function CardsPreview() {
  const usuario = MOCK_DADOS.usuario

  const activeOffers = useMemo(() =>
    ALL_IDS
      .map(id => {
        const config = OFFER_CARD_CONFIG.find(c => c.id === id)
        const data = MOCK_DADOS.ofertas.find(o => o.id === id)
        if (!config || !data) return null
        return { config, data }
      })
      .filter(Boolean),
    []
  )

  const cardsHtml = useMemo(() =>
    activeOffers
      .map((entry, idx) => buildOfferCardHtml(entry, idx, usuario))
      .join(''),
    [activeOffers, usuario]
  )

  return (
    <div className="cards-preview-page">
      <style>{OFFER_CARD_REDESIGN_CSS}</style>
      <style>{OFFER_CARD_BALANCED_LAYOUT_CSS}</style>
      <style>{PREVIEW_CSS}</style>
      <div className="cards-preview-header">
        <h1>Preview — 5 cards lado a lado</h1>
        <a href="/ofertas">← Voltar às Ofertas</a>
      </div>
      <div
        className="cards-preview-grid offers-grid"
        dangerouslySetInnerHTML={{ __html: cardsHtml }}
      />
    </div>
  )
}
