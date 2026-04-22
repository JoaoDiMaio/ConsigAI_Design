import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { DesktopPageHeader, MobilePageHeader } from '../components/AppHeader'
import { loadProfileData } from '../lib/profileStorage'
import { appPageStyle, theme } from '../ui/theme'

const t = {
  ...theme,
  successBg: '#eaf8f1',
  infoBg: '#edf3ff',
  neutralBg: '#f3f6fc',
  textSecondary: '#4e5f8a',
}

const mainOffers = [
  {
    id: 'novo_economia',
    badge: 'Recomendada para voce',
    mode: 'equilibrio',
    title: 'Melhor equilibrio entre valor e parcela',
    receive: 'R$ 3.000',
    installment: 'R$ 214/mes',
    totalCost: 'R$ 5.140',
    rationale: 'Boa escolha para aliviar o mes sem esticar muito o custo total.',
    route: '/novo-economia',
    state: { strategyType: 'novo' },
    color: 'primary',
  },
  {
    id: 'refin_portabilidade',
    badge: 'Parcela mais leve',
    mode: 'parcela',
    title: 'Maior folga no curto prazo',
    receive: 'R$ 500',
    installment: 'R$ 168/mes',
    totalCost: 'R$ 4.870',
    rationale: 'Foco em reduzir a parcela mensal e ganhar folga no orcamento.',
    route: '/refin-portabilidade',
    state: { strategyType: 'refin' },
    color: 'success',
  },
  {
    id: 'portabilidade',
    badge: 'Maior flexibilidade',
    mode: 'flex',
    title: 'Mais opcoes para planejar os proximos passos',
    receive: 'R$ 600',
    installment: 'R$ 197/mes',
    totalCost: 'R$ 5.480',
    rationale: 'Boa para quem quer manter margem de decisao nas proximas etapas.',
    route: '/portabilidade',
    color: 'info',
  },
]

const singleProducts = [
  {
    id: 'novo-contrato',
    label: 'So credito novo',
    title: 'Novo contrato',
    value: 'R$ 8.400',
    desc: 'Dinheiro novo na conta com prazo e valor ajustados para o seu momento.',
    route: '/novo-contrato',
  },
  {
    id: 'refinanciamento',
    label: 'So refinanciamento',
    title: 'Refinanciamento',
    value: 'R$ 9.547',
    desc: 'Use contratos atuais para receber agora sem adicionar novas operacoes.',
    route: '/refinanciamento',
  },
]

const offerTone = {
  primary: {
    badgeBg: '#1f4fc4',
    badgeColor: '#fff',
    valueColor: '#1f4fc4',
  },
  success: {
    badgeBg: '#0f8a57',
    badgeColor: '#fff',
    valueColor: '#0f8a57',
  },
  info: {
    badgeBg: '#eaf0ff',
    badgeColor: '#173e9a',
    valueColor: '#173e9a',
  },
}

function SectionTag({ children }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        borderRadius: 999,
        background: t.infoBg,
        color: t.blue2,
        padding: '5px 10px',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '.04em',
        textTransform: 'uppercase',
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.blue }} />
      {children}
    </div>
  )
}

function SelectButton({ active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        borderRadius: 12,
        border: active ? `1px solid ${t.greenAccent}` : `1px solid ${t.cardBorder}`,
        background: active ? t.successBg : '#fff',
        color: active ? t.green : t.text,
        fontSize: 14,
        fontWeight: 700,
        padding: '11px 12px',
        cursor: 'pointer',
      }}
    >
      {active ? 'Oferta selecionada' : 'Selecionar esta oferta'}
    </button>
  )
}

function OfferCard({ offer, selected, onSelect }) {
  const tone = offerTone[offer.color]

  return (
    <article
      aria-selected={selected}
      style={{
        borderRadius: 18,
        border: selected ? `1.5px solid ${t.blue}` : `1px solid ${t.cardBorder}`,
        background: '#fff',
        boxShadow: selected ? '0 14px 34px rgba(23,62,154,.18)' : t.cardShadow,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span
          style={{
            borderRadius: 999,
            background: tone.badgeBg,
            color: tone.badgeColor,
            padding: '5px 10px',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '.05em',
            textTransform: 'uppercase',
          }}
        >
          {offer.badge}
        </span>
        {selected ? (
          <span style={{ fontSize: 11, fontWeight: 700, color: t.greenAccent }}>Selecionada</span>
        ) : null}
      </div>

      <h3 style={{ margin: 0, fontSize: 18, lineHeight: 1.3, color: t.text }}>{offer.title}</h3>

      <div style={{ borderRadius: 14, background: t.neutralBg, border: `1px solid ${t.line}`, padding: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: t.textSecondary, textTransform: 'uppercase', letterSpacing: '.04em' }}>
              Voce recebe
            </div>
            <div style={{ marginTop: 4, fontSize: 34, fontWeight: 700, lineHeight: 1, color: tone.valueColor }}>{offer.receive}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ borderRadius: 10, background: '#fff', border: `1px solid ${t.line}`, padding: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: t.textSecondary, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                Nova parcela
              </div>
              <div style={{ marginTop: 4, fontSize: 16, fontWeight: 700, color: t.text }}>{offer.installment}</div>
            </div>
            <div style={{ borderRadius: 10, background: '#fff', border: `1px solid ${t.line}`, padding: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: t.textSecondary, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                Custo total
              </div>
              <div style={{ marginTop: 4, fontSize: 16, fontWeight: 700, color: t.text }}>{offer.totalCost}</div>
            </div>
          </div>
        </div>
      </div>

      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: t.textSecondary }}>{offer.rationale}</p>

      <div style={{ marginTop: 'auto' }}>
        <SelectButton active={selected} onClick={onSelect} />
      </div>
    </article>
  )
}

function SingleProductCard({ product, onOpen }) {
  return (
    <article
      style={{
        borderRadius: 16,
        border: `1px solid ${t.cardBorder}`,
        background: '#fff',
        boxShadow: '0 8px 20px rgba(0,24,81,.06)',
        padding: 14,
      }}
    >
      <div style={{ display: 'inline-flex', borderRadius: 999, background: t.infoBg, color: t.blue2, padding: '4px 9px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>
        {product.label}
      </div>
      <h3 style={{ margin: '10px 0 6px', fontSize: 19, color: t.text }}>{product.title}</h3>
      <div style={{ fontSize: 33, fontWeight: 700, color: t.blue, lineHeight: 1 }}>{product.value}</div>
      <p style={{ margin: '10px 0 12px', fontSize: 13, lineHeight: 1.45, color: t.textSecondary }}>{product.desc}</p>
      <button
        type="button"
        onClick={onOpen}
        style={{
          width: '100%',
          border: 0,
          borderRadius: 12,
          background: t.blue,
          color: '#fff',
          padding: '11px 12px',
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        Ver detalhes
      </button>
    </article>
  )
}

export default function Ofertas() {
  const navigate = useNavigate()
  const isTabletUp = useMediaQuery('(min-width: 768px)')
  const isDesktopWide = useMediaQuery('(min-width: 1080px)')

  const profile = useMemo(() => loadProfileData(), [])
  const clientName = profile.nomeCompleto || 'Cliente'

  const [selectedMainId, setSelectedMainId] = useState(mainOffers[0].id)
  const [showSingleProducts, setShowSingleProducts] = useState(false)

  const selectedOffer = mainOffers.find((offer) => offer.id === selectedMainId) || mainOffers[0]

  function handleContinue() {
    if (!selectedOffer) return
    navigate(selectedOffer.route, selectedOffer.state ? { state: selectedOffer.state } : undefined)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      <div style={appPageStyle}>
        {isTabletUp ? (
          <>
            <DesktopPageHeader
              clientName={clientName}
              chipLabel="Suas ofertas"
              title="Escolha a opcao que melhora seu mes"
              subtitle="Compare valor liberado, parcela e custo total para decidir com seguranca."
              onLogoClick={() => navigate('/ofertas')}
              actions={[
                { label: 'Acompanhamento', onClick: () => navigate('/acompanhamento') },
                { label: 'Configuracoes', onClick: () => navigate('/configuracoes') },
              ]}
            />

            <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 28px 36px' }}>
              <section style={{ marginBottom: 16 }}>
                <SectionTag>Comparacao principal</SectionTag>
                <h2 style={{ margin: '10px 0 6px', fontSize: 29, lineHeight: 1.15, color: t.text }}>Ofertas personalizadas para voce</h2>
                <p style={{ margin: 0, fontSize: 15, color: t.textSecondary, lineHeight: 1.5 }}>
                  Recomendamos {selectedOffer.mode === 'equilibrio' ? 'o melhor equilibrio entre valor e parcela.' : selectedOffer.mode === 'parcela' ? 'a menor parcela para seu mes.' : 'a opcao com mais flexibilidade para planejamento.'}
                </p>
              </section>

              <section
                style={{
                  borderRadius: 16,
                  background: t.infoBg,
                  border: `1px solid ${t.blueLight}`,
                  padding: '10px 14px',
                  marginBottom: 14,
                  fontSize: 13,
                  fontWeight: 600,
                  color: t.blue2,
                }}
              >
                Recomendacao ConsigAI: <span style={{ fontWeight: 700 }}>{selectedOffer.title}</span>
              </section>

              <section
                style={{
                  display: 'grid',
                  gridTemplateColumns: isDesktopWide ? 'repeat(3, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))',
                  gap: 12,
                }}
              >
                {mainOffers.map((offer) => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    selected={selectedMainId === offer.id}
                    onSelect={() => setSelectedMainId(offer.id)}
                  />
                ))}
              </section>

              <section
                style={{
                  marginTop: 14,
                  borderRadius: 16,
                  border: `1px solid ${t.cardBorder}`,
                  background: '#fff',
                  boxShadow: t.cardShadow,
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                }}
              >
                <div style={{ fontSize: 13, color: t.textSecondary }}>
                  Sem compromisso ate a confirmacao final. CET e condicoes completas antes da contratacao.
                </div>
                <button
                  type="button"
                  onClick={handleContinue}
                  style={{
                    border: 0,
                    borderRadius: 12,
                    background: t.blue,
                    color: '#fff',
                    padding: '12px 18px',
                    minWidth: 280,
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Continuar com oferta selecionada
                </button>
              </section>

              <section style={{ marginTop: 18 }}>
                <button
                  type="button"
                  onClick={() => setShowSingleProducts((prev) => !prev)}
                  style={{
                    border: `1px solid ${t.cardBorder}`,
                    borderRadius: 12,
                    background: '#fff',
                    color: t.text,
                    padding: '10px 12px',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {showSingleProducts ? 'Ocultar opcoes de produto unico' : 'Ver opcoes de produto unico'}
                </button>

                {showSingleProducts ? (
                  <div
                    style={{
                      marginTop: 12,
                      display: 'grid',
                      gridTemplateColumns: isDesktopWide ? 'repeat(2, minmax(0, 1fr))' : '1fr',
                      gap: 12,
                    }}
                  >
                    {singleProducts.map((product) => (
                      <SingleProductCard key={product.id} product={product} onOpen={() => navigate(product.route)} />
                    ))}
                  </div>
                ) : null}
              </section>

              <footer
                style={{
                  marginTop: 18,
                  borderRadius: 14,
                  border: `1px solid ${t.cardBorder}`,
                  background: '#fff',
                  padding: '12px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 10,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ fontSize: 12, color: t.textSecondary }}>Seguranca de dados | Atendimento humanizado | Transparencia total</div>
                <div style={{ fontSize: 12, color: t.textSecondary }}>Termos | Privacidade | Suporte</div>
              </footer>
            </main>
          </>
        ) : (
          <>
            <MobilePageHeader
              clientName={clientName}
              onLogoClick={() => navigate('/ofertas')}
              actions={[
                { label: 'Acompanhamento', onClick: () => navigate('/acompanhamento') },
                { label: 'Configuracoes', onClick: () => navigate('/configuracoes') },
              ]}
            />

            <main style={{ padding: '14px 14px calc(86px + env(safe-area-inset-bottom))' }}>
              <section style={{ marginBottom: 10 }}>
                <SectionTag>Suas ofertas</SectionTag>
                <h2 style={{ margin: '8px 0 6px', fontSize: 24, lineHeight: 1.2, color: t.text }}>Escolha sua melhor oferta</h2>
                <p style={{ margin: 0, fontSize: 14, color: t.textSecondary, lineHeight: 1.5 }}>
                  Compare valor, parcela e custo total antes de decidir.
                </p>
              </section>

              <section style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
                {mainOffers.map((offer) => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    selected={selectedMainId === offer.id}
                    onSelect={() => setSelectedMainId(offer.id)}
                  />
                ))}
              </section>

              <section style={{ marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowSingleProducts((prev) => !prev)}
                  style={{
                    width: '100%',
                    border: `1px solid ${t.cardBorder}`,
                    borderRadius: 12,
                    background: '#fff',
                    color: t.text,
                    padding: '11px 12px',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {showSingleProducts ? 'Ocultar opcoes diretas' : 'Ver opcoes diretas'}
                </button>

                {showSingleProducts ? (
                  <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
                    {singleProducts.map((product) => (
                      <SingleProductCard key={product.id} product={product} onOpen={() => navigate(product.route)} />
                    ))}
                  </div>
                ) : null}
              </section>
            </main>

            <div
              style={{
                position: 'fixed',
                left: 0,
                right: 0,
                bottom: 0,
                background: '#fff',
                borderTop: `1px solid ${t.cardBorder}`,
                padding: '10px 12px calc(10px + env(safe-area-inset-bottom))',
                boxShadow: '0 -8px 18px rgba(0,24,81,.08)',
              }}
            >
              <button
                type="button"
                onClick={handleContinue}
                style={{
                  width: '100%',
                  border: 0,
                  borderRadius: 12,
                  background: t.blue,
                  color: '#fff',
                  padding: '12px 14px',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Continuar com oferta selecionada
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
