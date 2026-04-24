import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DesktopPageHeader, MobilePageHeader } from '../app/src/components/AppHeader'
import { useMediaQuery } from '../app/src/hooks/useMediaQuery'
import { loadProfileData } from '../app/src/lib/profileStorage'
import { appPageStyle, theme } from '../app/src/ui/theme'

const t = {
  ...theme,
  brandNavy: '#03246F',
  brandBlue: '#055ECE',
  brandBlueMid: '#1878DE',
  brandSky: '#1DA1EB',
  brandCyan: '#00E7FF',
  infoBg: '#edf3ff',
  successBg: '#eaf8f1',
  neutralBg: '#f6f8fe',
  textSecondary: '#4e5f8a',
}

const offers = [
  {
    id: 'economia_novo',
    tier: 'economy',
    badge: 'Equilibrio',
    title: '+Dinheiro +Economia',
    cashValue: 3000,
    installmentBefore: 284,
    installmentAfter: 214,
    route: '/estrategia-combinada',
    state: { strategyType: 'novo contrato + economia' },
    rationale: 'Busca equilibrio entre receber valor e manter parcela controlada.',
    trust: 'Sujeito a analise e aprovacao final.',
  },
  {
    id: 'economia_refin',
    tier: 'economy',
    badge: 'Parcela menor',
    title: '+Dinheiro +Parcela menor',
    cashValue: 500,
    installmentBefore: 254,
    installmentAfter: 168,
    route: '/estrategia-combinada',
    state: { strategyType: 'refin + economia' },
    rationale: 'Combina alivio mensal com um valor extra moderado.',
    trust: 'Condicoes finais podem variar por banco e margem.',
  },
  {
    id: 'economia_portabilidade',
    tier: 'economy',
    badge: 'Economia total',
    title: '+ Economia',
    cashValue: 0,
    installmentBefore: 248,
    installmentAfter: 176,
    route: '/portabilidade',
    rationale: 'Ideal para quem quer reduzir o custo mensal sem contratar valor novo.',
    trust: 'Sujeito a analise e validacao documental.',
  },
  {
    id: 'valor_novo',
    tier: 'value',
    badge: 'Opcao de valor',
    title: 'Novo Contrato',
    cashValue: 4200,
    installmentBefore: 284,
    installmentAfter: 256,
    route: '/novo-contrato',
    rationale: 'Opcao para priorizar valor liberado, com menor foco em economia.',
    trust: 'Validacao final conforme perfil e banco.',
  },
  {
    id: 'valor_refin',
    tier: 'value',
    badge: 'Opcao de valor',
    title: 'Refinanciamento',
    cashValue: 2500,
    installmentBefore: 254,
    installmentAfter: 236,
    route: '/refinanciamento',
    rationale: 'Alternativa para gerar valor extra sem tanto foco na menor parcela.',
    trust: 'Resultado sujeito a analise de credito.',
  },
]

function toCurrency(value) {
  return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function getMonthlyGain(offer) {
  return Number(offer?.installmentBefore || 0) - Number(offer?.installmentAfter || 0)
}

function getOfferButtonLabel(offer) {
  if (offer?.id === 'economia_novo') return 'Quero dinheiro e economia'
  if (offer?.id === 'economia_refin') return 'Quero dinheiro e parcela menor'
  if (offer?.id === 'economia_portabilidade') return 'Quero mais economia'
  if (offer?.id === 'valor_novo') return 'Quero novo contrato'
  if (offer?.id === 'valor_refin') return 'Quero refinanciamento'
  return 'Quero esta oferta'
}

function getEconomyCallPrimary(offer) {
  if (offer?.id === 'economia_novo') return 'Dinheiro liberado'
  if (offer?.id === 'economia_refin') return 'Dinheiro'
  if (offer?.id === 'economia_portabilidade') return 'Economia'
  return offer?.title || 'Oferta'
}

function getEconomyCallSecondary(offer, monthlyGain) {
  if (offer?.id === 'economia_novo') return `+ ${toCurrency(monthlyGain)}`
  if (offer?.id === 'economia_refin') return `- ${toCurrency(monthlyGain)}`
  if (offer?.id === 'economia_portabilidade') return `${toCurrency(offer.installmentBefore)} -> ${toCurrency(offer.installmentAfter)}`
  return ''
}

function getEconomyCardTheme(offer) {
  if (offer?.id === 'economia_novo') {
    return {
      background: 'linear-gradient(145deg, #03246F 0%, #055ECE 100%)',
      border: '1px solid rgba(5,94,206,.55)',
    }
  }
  if (offer?.id === 'economia_refin') {
    return {
      background: 'linear-gradient(145deg, #03246F 0%, #1055B8 55%, #1878DE 100%)',
      border: '1px solid rgba(16,85,184,.65)',
    }
  }
  return {
    background: 'linear-gradient(145deg, #03246F 0%, #055ECE 60%, #0E84D4 100%)',
    border: '1px solid rgba(14,132,212,.6)',
  }
}

function MetricPill({ label, value, positive = false, inverse = false }) {
  return (
    <div
      style={{
        borderRadius: 999,
        border: inverse ? '1px solid rgba(255,255,255,.3)' : `1px solid ${positive ? '#b9e2cd' : t.line}`,
        background: inverse ? 'rgba(255,255,255,.15)' : (positive ? '#eefaf3' : '#fff'),
        padding: '6px 10px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <span style={{ fontSize: 10, color: inverse ? 'rgba(255,255,255,.84)' : t.textSecondary, fontWeight: 700 }}>{label}</span>
      <span style={{ fontSize: 12, color: inverse ? '#fff' : (positive ? t.green : t.text), fontWeight: 800 }}>{value}</span>
    </div>
  )
}

function OfferCard({ offer, selected, subdued, onSelect }) {
  const monthlyGain = getMonthlyGain(offer)
  const isEconomyCard = offer.tier === 'economy'
  const economyTheme = getEconomyCardTheme(offer)
  const isRecommended = offer.id === 'economia_novo'
  const hasCash = Number(offer.cashValue || 0) > 0

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(offer)}
      className={selected ? 'card-selected' : undefined}
      style={{
        width: '100%',
        textAlign: 'left',
        borderRadius: 16,
        border: selected
          ? '1.5px solid rgba(34,197,94,.7)'
          : (isEconomyCard && !subdued ? economyTheme.border : `1px solid ${t.cardBorder}`),
        background: isEconomyCard && !subdued ? economyTheme.background : (subdued ? '#eef4ff' : '#fff'),
        boxShadow: selected
          ? (isEconomyCard && !subdued
              ? '0 16px 34px rgba(5,94,206,.35), inset 0 0 0 1px rgba(34,197,94,.25)'
              : '0 12px 28px rgba(23,62,154,.12), inset 0 0 0 1px rgba(34,197,94,.2)')
          : (isEconomyCard && !subdued ? '0 10px 24px rgba(5,94,206,.2)' : '0 3px 12px rgba(0,24,81,.06)'),
        padding: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        cursor: 'pointer',
        opacity: subdued ? 0.9 : 1,
        transition: 'border .2s ease, box-shadow .2s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span
            style={{
              borderRadius: 999,
              background: isEconomyCard && !subdued
                ? (selected ? 'rgba(0,0,0,.2)' : 'rgba(255,255,255,.24)')
                : (selected ? t.blue : t.infoBg),
              color: isEconomyCard && !subdued ? '#fff' : (selected ? '#fff' : t.blue2),
              padding: '4px 9px',
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '.04em',
            }}
          >
            {offer.badge}
          </span>
          {isRecommended ? (
            <span
              style={{
                borderRadius: 999,
                background: 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)',
                color: '#7C2D00',
                border: '1px solid rgba(251,191,36,.35)',
                padding: '4px 10px',
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '.04em',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
              className="badge-recommended"
            >
              ★ Mais indicada
            </span>
          ) : null}
        </div>
        <span style={{ fontSize: 11, color: isEconomyCard && !subdued ? 'rgba(255,255,255,.9)' : (selected ? t.greenAccent : t.textSecondary), fontWeight: 700 }}>
          {selected ? 'Selecionada ✓' : 'Escolher'}
        </span>
      </div>

      {isEconomyCard ? (
        <div style={{ borderRadius: 14, border: '1px solid rgba(255,255,255,.18)', background: 'rgba(255,255,255,.14)', padding: 12 }}>
          <div style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.6)', letterSpacing: '.04em', textTransform: 'uppercase', marginBottom: 4 }}>
            {getEconomyCallPrimary(offer)}
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', lineHeight: 1.05, letterSpacing: '-.01em' }}>
            {getEconomyCallSecondary(offer, monthlyGain)}
          </div>
        </div>
      ) : (
        <h3 style={{ margin: 0, fontSize: subdued ? 16 : 17, color: t.brandNavy, lineHeight: 1.3 }}>{offer.title}</h3>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <MetricPill label={hasCash ? 'Voce recebe' : 'Valor novo'} value={toCurrency(offer.cashValue)} inverse={isEconomyCard && !subdued} />
        <MetricPill label="Parcela depois" value={toCurrency(offer.installmentAfter)} inverse={isEconomyCard && !subdued} />
        <MetricPill label="Alivio mensal" value={toCurrency(monthlyGain)} positive={!isEconomyCard || subdued} inverse={isEconomyCard && !subdued} />
      </div>

      <p style={{ margin: 0, fontSize: 12.5, color: isEconomyCard && !subdued ? 'rgba(255,255,255,.92)' : t.textSecondary, lineHeight: 1.45 }}>
        {offer.rationale}
      </p>
    </button>
  )
}

function StickyCTA({ offer, onConfirm }) {
  if (!offer) return null
  const isEconomy = offer.tier === 'economy'

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '12px 16px calc(12px + env(safe-area-inset-bottom))',
        background: 'rgba(255,255,255,.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(5,94,206,.14)',
        boxShadow: '0 -8px 28px rgba(3,36,111,.1)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: '#4e5f8a', fontWeight: 600, letterSpacing: '.03em', textTransform: 'uppercase' }}>
          Oferta selecionada
        </div>
        <div style={{ fontSize: 14, color: '#03246F', fontWeight: 800, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {offer.title}
        </div>
      </div>
      <button
        type="button"
        onClick={onConfirm}
        className="focus-ring"
        style={{
          flexShrink: 0,
          borderRadius: 12,
          border: 0,
          background: isEconomy
            ? 'linear-gradient(135deg, #055ECE 0%, #1DA1EB 100%)'
            : '#055ECE',
          color: '#fff',
          fontSize: 14,
          fontWeight: 800,
          padding: '12px 22px',
          cursor: 'pointer',
          boxShadow: '0 6px 18px rgba(5,94,206,.32)',
          letterSpacing: '.01em',
        }}
      >
        {getOfferButtonLabel(offer)} →
      </button>
    </div>
  )
}

export default function OfertasNova() {
  const navigate = useNavigate()
  const isTabletUp = useMediaQuery('(min-width: 768px)')
  const isDesktopWide = useMediaQuery('(min-width: 1080px)')

  const profile = useMemo(() => loadProfileData(), [])
  const clientName = profile.nomeCompleto?.split(' ')[0] || 'Cliente'

  const economyOffers = offers.filter((offer) => offer.tier === 'economy')
  const valueOffers = offers.filter((offer) => offer.tier === 'value')
  const bestOffer = economyOffers[0]

  const [selectedOfferId, setSelectedOfferId] = useState(bestOffer?.id || offers[0]?.id || '')

  const selectedOffer = offers.find((o) => o.id === selectedOfferId) || null

  const handleSelectOffer = (offer) => {
    if (!offer) return
    setSelectedOfferId(offer.id)
  }

  const handleConfirm = () => {
    if (!selectedOffer) return
    navigate(selectedOffer.route, selectedOffer.state ? { state: selectedOffer.state } : undefined)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .focus-ring:focus-visible { outline: 3px solid #2350c8; outline-offset: 2px; }
        @keyframes cardSelect {
          0%   { box-shadow: 0 0 0 0 rgba(34,197,94,.5); }
          60%  { box-shadow: 0 0 0 10px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }
        .card-selected { animation: cardSelect .45s ease forwards; }
        @keyframes badgePulse {
          0%, 100% { box-shadow: 0 2px 8px rgba(245,158,11,.35); }
          50%       { box-shadow: 0 2px 14px rgba(245,158,11,.65); }
        }
        .badge-recommended { animation: badgePulse 2.4s ease-in-out infinite; }
      `}</style>
      <a href="#nova-ofertas-main" className="focus-ring" style={{ position: 'absolute', left: -9999, top: 'auto' }}>
        Pular para conteudo principal
      </a>

      <div
        style={{
          ...appPageStyle,
          background: `
            radial-gradient(1100px 520px at 100% -10%, rgba(0,231,255,.24), transparent 58%),
            radial-gradient(900px 460px at -10% 30%, rgba(5,94,206,.22), transparent 56%),
            linear-gradient(180deg, #eaf2ff 0%, #f6faff 36%, #eef5ff 100%)
          `,
        }}
      >
        {isTabletUp ? (
          <DesktopPageHeader
            clientName={clientName}
            chipLabel="Ofertas"
            title="Escolha sua oferta"
            subtitle="Veja as opcoes e siga com a condicao que faz mais sentido para seu momento."
            onLogoClick={() => navigate('/ofertas')}
            actions={[
              { label: 'Acompanhamento', onClick: () => navigate('/acompanhamento') },
              { label: 'Configuracoes', onClick: () => navigate('/configuracoes') },
            ]}
          />
        ) : (
          <MobilePageHeader
            clientName={clientName}
            onLogoClick={() => navigate('/ofertas')}
            actions={[
              { label: 'Acompanhamento', onClick: () => navigate('/acompanhamento') },
              { label: 'Configuracoes', onClick: () => navigate('/configuracoes') },
            ]}
          />
        )}

        <main id="nova-ofertas-main" style={{ maxWidth: 1200, margin: '0 auto', padding: isTabletUp ? '24px 28px 140px' : '14px 14px 140px' }}>
          {/* Personalized hero */}
          <section
            aria-label="Chamada principal"
            style={{
              borderRadius: 18,
              border: '1px solid rgba(0,231,255,.35)',
              background: 'linear-gradient(128deg, #03246F 0%, #055ECE 54%, #1DA1EB 100%)',
              boxShadow: '0 16px 34px rgba(3,36,111,.24)',
              padding: isTabletUp ? 18 : 14,
            }}
          >
            <h2 style={{ margin: 0, fontSize: isTabletUp ? 26 : 21, color: '#fff', lineHeight: 1.2 }}>
              {clientName}, voce pode liberar{' '}
              <span style={{ color: '#7EC8F4' }}>{toCurrency(bestOffer?.cashValue)}</span> hoje
            </h2>
            <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,.88)', fontSize: 14, lineHeight: 1.5, maxWidth: 800 }}>
              Selecione uma opcao abaixo. Voce decide e confirma tudo na proxima etapa — sem surpresas.
            </p>
          </section>

          <section
            aria-label="Ofertas de economia"
            style={{ marginTop: 14, borderRadius: 16, background: 'rgba(3,36,111,.05)', border: '1px solid rgba(5,94,206,.14)', padding: isTabletUp ? 14 : 10 }}
          >
            <h3 style={{ margin: 0, fontSize: 16, color: t.brandNavy }}>3 ofertas de economia</h3>
            <p style={{ margin: '5px 0 0', fontSize: 13, color: '#31538f' }}>As opcoes com maior foco em reduzir impacto mensal.</p>
            <div
              role="radiogroup"
              aria-label="Ofertas de economia"
              style={{
                marginTop: 10,
                display: 'grid',
                gridTemplateColumns: isDesktopWide ? 'repeat(3, minmax(0, 1fr))' : '1fr',
                gap: 10,
              }}
            >
              {economyOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} selected={selectedOfferId === offer.id} onSelect={handleSelectOffer} />
              ))}
            </div>
          </section>

          <section
            aria-label="Ofertas de valor"
            style={{
              marginTop: 16,
              borderRadius: 14,
              border: '1px solid rgba(24,120,222,.18)',
              background: 'linear-gradient(180deg, rgba(29,161,235,.08) 0%, rgba(255,255,255,.76) 100%)',
              padding: isTabletUp ? 12 : 10,
            }}
          >
            <h3 style={{ margin: 0, fontSize: 15, color: '#2f4f86' }}>2 ofertas de valor (opcional)</h3>
            <p style={{ margin: '5px 0 0', fontSize: 12, color: '#5d76a3' }}>Sem destaque principal: para quem quer priorizar valor liberado.</p>
            <div
              role="radiogroup"
              aria-label="Ofertas de valor"
              style={{
                marginTop: 9,
                display: 'grid',
                gridTemplateColumns: isDesktopWide ? 'repeat(2, minmax(0, 1fr))' : '1fr',
                gap: 10,
              }}
            >
              {valueOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} selected={selectedOfferId === offer.id} onSelect={handleSelectOffer} subdued />
              ))}
            </div>
          </section>

          <footer style={{ marginTop: 12, paddingBottom: 8 }}>
            <p style={{ margin: 0, fontSize: 11, color: t.muted, lineHeight: 1.5 }}>
              Simulacoes sujeitas a analise de credito, margem disponivel e validacao documental.
            </p>
          </footer>
        </main>

        <StickyCTA offer={selectedOffer} onConfirm={handleConfirm} />
      </div>
    </>
  )
}
