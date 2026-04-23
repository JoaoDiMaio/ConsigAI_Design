import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const OFFER_ROUTES = [
  { route: '/estrategia-combinada', state: { strategyType: 'novo contrato + economia' } },
  { route: '/estrategia-combinada', state: { strategyType: 'refin + economia' } },
  { route: '/portabilidade' },
]

export default function OfertasNova() {
  const navigate = useNavigate()
  const iframeRef = useRef(null)
  const selectedOfferIndexRef = useRef(0)
  const attachedDocRef = useRef(null)
  const clickHandlerRef = useRef(null)

  useEffect(() => {
    let intervalId = null

    const goToSelectedOffer = () => {
      const selected = OFFER_ROUTES[selectedOfferIndexRef.current] || OFFER_ROUTES[0]
      navigate(selected.route, selected.state ? { state: selected.state } : undefined)
    }

    const attachBridge = () => {
      const frame = iframeRef.current
      const frameWindow = frame?.contentWindow
      const frameDoc = frameWindow?.document

      if (!frameWindow || !frameDoc) return

      if (typeof frameWindow.sel === 'function' && !frameWindow.__consigAIWrappedSel) {
        const originalSel = frameWindow.sel.bind(frameWindow)
        frameWindow.__consigAIWrappedSel = true
        frameWindow.sel = (idx) => {
          selectedOfferIndexRef.current = Number(idx) || 0
          frameWindow.__consigAISelectedOffer = selectedOfferIndexRef.current
          return originalSel(idx)
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
