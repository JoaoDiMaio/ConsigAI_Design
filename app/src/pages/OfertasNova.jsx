import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DesktopPageHeader, MobilePageHeader } from '../components/AppHeader'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { loadProfileData } from '../lib/profileStorage'
import { appPageStyle } from '../ui/theme'

const C = {
  navy: '#0B1F4B',
  navyMid: '#1A3575',
  blue: '#2356D8',
  blueHover: '#1844C0',
  blueSoft: '#EEF2FF',
  mint: '#059669',
  mintBg: '#ECFDF5',
  mintText: '#047857',
  muted: '#7B90C0',
  line: '#DDE4F2',
  bg: '#F0F3FA',
  white: '#FFFFFF',
}

const SALARIO = 2200
const MARGEM_PCT = 0.35
const MARGEM_TOTAL = Math.round(SALARIO * MARGEM_PCT)
const PARCELA_ATUAL = 284
const MULTIPLICADOR_LIMITE = 40

const OFFERS_ECO = [
  {
    id: 'economia_novo',
    tag: 'DINHEIRO + ECONOMIA',
    badge: true,
    cashValue: 3000,
    installmentBefore: 284,
    installmentAfter: 214,
    route: '/estrategia-combinada',
    state: { strategyType: 'novo contrato + economia' },
    desc: 'Respira agora, sem sacrificar o futuro.',
    metrics: [
      { label: 'Valor liberado', valueKey: 'cashValue', color: C.blue },
      { label: 'Economia total', valueKey: 'gain', color: C.mint },
    ],
  },
  {
    id: 'economia_refin',
    tag: 'DINHEIRO + REDUCAO DE PARCELA',
    badge: false,
    cashValue: 500,
    installmentBefore: 254,
    installmentAfter: 168,
    route: '/estrategia-combinada',
    state: { strategyType: 'refin + economia' },
    desc: 'Seu mes fica mais leve de imediato.',
    metrics: [
      { label: 'Valor liberado', valueKey: 'cashValue', color: C.blue },
      { label: 'Reducao de parcela', valueKey: 'installmentAfter', color: C.mint, prefix: 'R$ 254 -> ' },
    ],
  },
  {
    id: 'economia_portabilidade',
    tag: 'ECONOMIA PLUS',
    badge: false,
    cashValue: 0,
    installmentBefore: 248,
    installmentAfter: 176,
    route: '/portabilidade',
    state: null,
    desc: 'Economize sem pegar mais divida.',
    metrics: [
      { label: 'Economia total', valueKey: 'gain', color: C.mint },
      { label: 'Reducao de parcela', valueKey: 'installmentAfter', color: C.blue, prefix: 'R$ 248 -> ' },
    ],
  },
]

const OFFERS_VALOR = [
  {
    id: 'valor_novo',
    tag: 'OPCAO DE VALOR',
    name: 'Novo Contrato',
    cashValue: 4200,
    installmentBefore: 284,
    installmentAfter: 256,
    route: '/novo-contrato',
    desc: 'Opcao para priorizar valor liberado, com menor foco em economia.',
    accentColor: C.blue,
    border: '#C7D6FA',
  },
  {
    id: 'valor_refin',
    tag: 'OPCAO DE VALOR',
    name: 'Refinanciamento',
    cashValue: 2500,
    installmentBefore: 254,
    installmentAfter: 236,
    route: '/refinanciamento',
    desc: 'Alternativa para gerar valor extra sem tanto foco na menor parcela.',
    accentColor: '#D97706',
    border: '#FDE68A',
  },
]

function toCurrency(v) {
  return Number(v || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

function Pill({ label, value, accent, inverse }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        background: inverse ? 'rgba(255,255,255,.1)' : accent ? C.mintBg : '#F0F4FF',
        border: `1px solid ${inverse ? 'rgba(255,255,255,.15)' : accent ? '#A7F3D0' : C.line}`,
        borderRadius: 99,
        padding: '4px 10px',
        fontSize: 11,
        fontWeight: 600,
        color: inverse ? (accent ? '#6EE7B7' : 'rgba(255,255,255,.85)') : accent ? C.mintText : C.navyMid,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontWeight: 500, color: inverse ? 'rgba(255,255,255,.5)' : C.muted }}>{label}</span>
      &nbsp;{value}
    </span>
  )
}

function DiagnosticoCard({ selectedOffer }) {
  const isTabletUp = useMediaQuery('(min-width: 768px)')

  const parcelaDepois = selectedOffer?.installmentAfter ?? PARCELA_ATUAL
  const sobraAntes = SALARIO - PARCELA_ATUAL
  const sobraDepois = SALARIO - parcelaDepois
  const delta = sobraDepois - sobraAntes
  const changed = delta !== 0
  const margemLivreAntes = MARGEM_TOTAL - PARCELA_ATUAL
  const margemLivreDepois = MARGEM_TOTAL - parcelaDepois
  const limiteAntes = Math.max(0, margemLivreAntes) * MULTIPLICADOR_LIMITE
  const limiteDepois = Math.max(0, margemLivreDepois) * MULTIPLICADOR_LIMITE
  const deltaLimite = limiteDepois - limiteAntes

  const renderColuna = ({ label, salario, parcela, sobra, limite, destaque }) => (
    <div
      style={{
        flex: 1,
        borderRadius: 16,
        border: `${destaque ? 1.5 : 1}px solid ${destaque ? '#A7F3D0' : C.line}`,
        background: destaque ? '#FAFFFE' : C.white,
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', color: destaque ? C.mint : C.muted, textTransform: 'uppercase', marginBottom: 14 }}>
        {label}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingBottom: 10, borderBottom: `1px solid ${C.line}` }}>
        <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>Salario liquido</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{toCurrency(salario)}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '10px 0', borderBottom: `2px solid ${C.navy}` }}>
        <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>- Parcela</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#E84A2F' }}>- {toCurrency(parcela)}</span>
      </div>

      <div style={{ paddingTop: 12, paddingBottom: 12, borderBottom: `1px solid ${C.line}` }}>
        <div style={{ fontSize: 11, color: destaque ? C.mintText : C.muted, fontWeight: 600, marginBottom: 4 }}>Sobra no bolso</div>
        <div
          style={{
            fontSize: destaque ? (isTabletUp ? 32 : 24) : isTabletUp ? 26 : 20,
            fontWeight: 900,
            color: destaque ? C.mint : C.navy,
            letterSpacing: '-.03em',
            lineHeight: 1,
          }}
        >
          {toCurrency(sobra)}
        </div>
      </div>

      <div style={{ paddingTop: 12 }}>
        <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 4 }}>Credito disponivel</div>
        <div style={{ fontSize: destaque ? 20 : 16, fontWeight: 800, color: destaque && deltaLimite > 0 ? C.blue : C.navy, letterSpacing: '-.02em', lineHeight: 1 }}>
          {toCurrency(limite)}
        </div>
        <div style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>em caso de emergencia</div>
      </div>
    </div>
  )

  return (
    <div style={{ background: C.white, borderRadius: 24, padding: '20px 24px', marginTop: 16, marginBottom: 0, boxShadow: '0 4px 24px rgba(11,31,75,.08)' }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 2 }}>O que sobra no seu bolso</div>
      <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>Comparativo mensal com a oferta escolhida.</div>

      <div style={{ display: 'flex', flexDirection: isTabletUp ? 'row' : 'column', gap: 12 }}>
        {renderColuna({ label: 'Hoje', salario: SALARIO, parcela: PARCELA_ATUAL, sobra: sobraAntes, limite: limiteAntes, destaque: false })}
        {renderColuna({ label: 'Com ConsigAI', salario: SALARIO, parcela: parcelaDepois, sobra: sobraDepois, limite: limiteDepois, destaque: true })}
      </div>

      {changed ? (
        <div
          style={{
            marginTop: 14,
            borderRadius: 12,
            background: C.mintBg,
            border: '1px solid #A7F3D0',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 13, color: C.mintText, fontWeight: 500 }}>
              Voce fica com <strong style={{ fontSize: 18, fontWeight: 900 }}>+{toCurrency(delta)}</strong> a mais todo mes
            </span>
            <span style={{ fontSize: 11, color: C.muted }}>= {toCurrency(delta * 12)} por ano</span>
          </div>
          {deltaLimite > 0 ? (
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>Credito extra disponivel</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.blue }}>+{toCurrency(deltaLimite)}</div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function EcoCard({ offer, selected, onSelect, isDesktopWide, isTabletUp }) {
  const isSel = selected === offer.id
  const gain = offer.installmentBefore - offer.installmentAfter

  const resolveValue = (m) => {
    if (m.valueKey === 'cashValue') return toCurrency(offer.cashValue)
    if (m.valueKey === 'gain') return toCurrency(gain)
    if (m.valueKey === 'installmentAfter') return toCurrency(offer.installmentAfter)
    return '-'
  }

  return (
    <div
      role="radio"
      aria-checked={isSel}
      tabIndex={0}
      onClick={() => onSelect(offer)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onSelect(offer)
      }}
      style={{
        flex: isDesktopWide ? '1 1 0' : isTabletUp ? '1 1 calc(50% - 6px)' : '1 1 100%',
        background: C.white,
        border: `${isSel ? 2 : 1.5}px solid ${isSel ? C.blue : C.line}`,
        borderRadius: 20,
        padding: '20px 18px 18px',
        cursor: 'pointer',
        transition: 'border-color .18s ease, box-shadow .18s ease',
        boxShadow: isSel ? '0 8px 28px rgba(35,86,216,.16)' : '0 2px 12px rgba(11,31,75,.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', color: isSel ? C.blue : C.muted }}>{offer.tag}</span>
          {offer.badge ? (
            <span
              style={{
                background: '#FFD60A',
                color: '#7A4F00',
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: '.06em',
                padding: '3px 8px',
                borderRadius: 99,
                boxShadow: '0 2px 6px rgba(255,214,10,.4)',
              }}
            >
              {isSel ? 'RECOMENDADA' : 'MAIS ECONOMIA'}
            </span>
          ) : null}
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, color: isSel ? C.mint : C.muted }}>{isSel ? 'Selecionada' : 'Escolher'}</span>
      </div>

      <div style={{ display: 'flex', gap: 20 }}>
        {offer.metrics.map((m) => (
          <div key={m.label}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.05em', color: C.muted, textTransform: 'uppercase', marginBottom: 5 }}>{m.label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', color: m.color, lineHeight: 1 }}>
              {m.prefix ? (
                <>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#E84A2F' }}>{m.prefix.replace(' -> ', '')}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: C.muted }}>{' -> '}</span>
                  {resolveValue(m)}
                </>
              ) : (
                resolveValue(m)
              )}
            </div>
          </div>
        ))}
      </div>

      <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: C.muted }}>{offer.desc}</p>
    </div>
  )
}

function ValorCard({ offer, navigate }) {
  const [hov, setHov] = useState(false)
  const gain = offer.installmentBefore - offer.installmentAfter

  return (
    <div
      onClick={() => navigate(offer.route)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: '1 1 260px',
        background: C.white,
        border: `1.5px solid ${hov ? offer.accentColor : offer.border}`,
        borderRadius: 20,
        padding: '20px 20px 18px',
        cursor: 'pointer',
        transition: 'border-color .16s ease, box-shadow .16s ease',
        boxShadow: hov ? '0 4px 20px rgba(11,31,75,.1)' : '0 2px 8px rgba(11,31,75,.05)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', color: offer.accentColor }}>{offer.tag}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.blue }}>Escolher agora</span>
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 12 }}>{offer.name}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
        <Pill label="Voce recebe" value={toCurrency(offer.cashValue)} />
        <Pill label="Parcela depois" value={toCurrency(offer.installmentAfter)} />
        <Pill label="Alivio mensal" value={toCurrency(gain)} accent />
      </div>
      <p style={{ margin: 0, fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{offer.desc}</p>
    </div>
  )
}

export default function OfertasNova() {
  const navigate = useNavigate()
  const isTabletUp = useMediaQuery('(min-width: 768px)')
  const isDesktopWide = useMediaQuery('(min-width: 1080px)')

  const profile = useMemo(() => loadProfileData(), [])
  const clientName = profile.nomeCompleto?.split(' ')[0] || 'Cliente'
  const bestOffer = OFFERS_ECO[0]

  const [selectedId, setSelectedId] = useState(bestOffer.id)
  const selectedOffer = OFFERS_ECO.find((o) => o.id === selectedId) || null

  const handleSelect = (offer) => setSelectedId(offer.id)

  const handleConfirm = () => {
    if (!selectedOffer) return
    navigate(selectedOffer.route, selectedOffer.state ? { state: selectedOffer.state } : undefined)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .focus-ring:focus-visible { outline: 3px solid #2350c8; outline-offset: 2px; }
      `}</style>

      <div style={{ ...appPageStyle, background: C.bg }}>
        {isTabletUp ? (
          <DesktopPageHeader
            clientName={clientName}
            chipLabel="Ofertas"
            title="A melhor condicao para reduzir sua parcela"
            subtitle="Aqui estao as opcoes com foco em economia e menos impacto no seu orcamento mensal."
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

        <main style={{ maxWidth: 1200, margin: '0 auto', padding: isDesktopWide ? '24px 40px 48px' : isTabletUp ? '24px 24px 48px' : '16px 14px 48px' }}>
          <section
            style={{
              marginBottom: 20,
              background: '#EFF7FF',
              border: `1px solid ${C.line}`,
              borderRadius: 24,
              padding: isDesktopWide ? '24px 28px' : '20px 18px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: isTabletUp ? 'row' : 'column', justifyContent: 'space-between', gap: 16, alignItems: 'stretch' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.09em', textTransform: 'uppercase', color: C.blue, marginBottom: 8 }}>Economia em foco</div>
                <h2 style={{ margin: 0, fontSize: isDesktopWide ? 34 : 28, lineHeight: 1.05, color: C.navy }}>A oferta que libera mais folga no seu orcamento</h2>
                <p style={{ margin: '12px 0 0', fontSize: 14, color: C.muted, maxWidth: 720, lineHeight: 1.6 }}>
                  {clientName}, a oferta selecionada reduz sua parcela para {toCurrency(selectedOffer?.installmentAfter ?? PARCELA_ATUAL)} e entrega uma economia de {toCurrency((selectedOffer?.installmentBefore ?? PARCELA_ATUAL) - (selectedOffer?.installmentAfter ?? PARCELA_ATUAL))} por mes.
                </p>
              </div>

              <div style={{ display: 'grid', gap: 14, minWidth: 240, borderRadius: 20, background: C.white, border: `1px solid ${C.line}`, padding: '18px 20px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: C.muted }}>Melhor economia</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 10, color: C.muted }}>Parcela hoje</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: C.navy }}>{toCurrency(PARCELA_ATUAL)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: C.muted }}>Parcela com oferta</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: C.mint }}>{toCurrency(selectedOffer?.installmentAfter ?? PARCELA_ATUAL)}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.blue }}>Economia mensal</span>
                  <span style={{ fontSize: 18, fontWeight: 900, color: C.mint }}>{selectedOffer ? toCurrency(selectedOffer.installmentBefore - selectedOffer.installmentAfter) : '-'}</span>
                </div>
              </div>
            </div>
          </section>

          <div
            style={{
              background: C.white,
              borderRadius: 24,
              padding: isDesktopWide ? '24px 24px 20px' : isTabletUp ? '20px 18px 18px' : '16px 12px 14px',
              marginBottom: 20,
              boxShadow: '0 4px 24px rgba(11,31,75,.08)',
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 4 }}>3 ofertas de economia</div>
              <div style={{ fontSize: 13, color: C.muted }}>As opcoes com maior foco em reduzir impacto mensal.</div>
            </div>

            <div role="radiogroup" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {OFFERS_ECO.map((offer) => (
                <EcoCard key={offer.id} offer={offer} selected={selectedId} onSelect={handleSelect} isDesktopWide={isDesktopWide} isTabletUp={isTabletUp} />
              ))}
            </div>

            <DiagnosticoCard selectedOffer={selectedOffer} />

            {selectedOffer ? (
              <div
                style={{
                  marginTop: 20,
                  padding: '18px 20px',
                  background: C.blueSoft,
                  border: '1.5px solid #C7D6FA',
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>
                    Oferta selecionada: <strong>{selectedOffer.tag}</strong>
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{selectedOffer.desc}</div>
                </div>
                <button
                  onClick={handleConfirm}
                  className="focus-ring"
                  style={{
                    background: C.blue,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 14,
                    padding: '14px 28px',
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: 'pointer',
                    letterSpacing: '-.01em',
                    transition: 'background .15s',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = C.blueHover
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = C.blue
                  }}
                >
                  Contratar esta oferta
                </button>
              </div>
            ) : null}
          </div>

          <div
            style={{
              background: C.white,
              borderRadius: 24,
              padding: isDesktopWide ? '24px 24px 20px' : isTabletUp ? '20px 18px 18px' : '16px 12px 14px',
              boxShadow: '0 4px 24px rgba(11,31,75,.06)',
            }}
          >
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>2 ofertas de valor</span>
                  <span
                    style={{
                      background: '#F0F4FF',
                      border: `1px solid ${C.line}`,
                      borderRadius: 99,
                      padding: '2px 8px',
                      fontSize: 10,
                      fontWeight: 600,
                      color: C.muted,
                    }}
                  >
                    opcional
                  </span>
                </div>
                <div style={{ fontSize: 13, color: C.muted }}>Sem destaque principal: para quem quer priorizar valor liberado.</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {OFFERS_VALOR.map((offer) => (
                <ValorCard key={offer.id} offer={offer} navigate={navigate} />
              ))}
            </div>
          </div>

          <footer style={{ marginTop: 16 }}>
            <p style={{ margin: 0, fontSize: 11, color: C.muted, lineHeight: 1.5 }}>
              Simulacoes sujeitas a analise de credito, margem disponivel e validacao documental.
            </p>
          </footer>
        </main>
      </div>
    </>
  )
}

