import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { loadProfileData } from '../lib/profileStorage'
import { DesktopPageHeader, MobilePageHeader } from '../components/AppHeader'
import { appPageStyle, theme } from '../ui/theme'

const t = {
  ...theme,
  warning: '#9a6500',
  warningBg: '#fff6e7',
}

const statusMap = {
  aceita: { label: 'Aceita', bg: t.greenBg, color: t.green, border: '#b8e0ca' },
  recusada: { label: 'Nao aceita', bg: t.dangerBg, color: t.danger, border: '#f1c2c2' },
  andamento: { label: 'Em andamento', bg: t.blueLight, color: t.blue, border: '#c9d7ff' },
  concluida: { label: 'Concluida', bg: '#edf8f3', color: t.greenAccent, border: '#b8e0ca' },
  retida: { label: 'Retida', bg: t.warningBg, color: t.warning, border: '#f2d8a9' },
}

const summaryCards = [
  { title: 'Propostas aceitas', value: 3, status: 'aceita' },
  { title: 'Propostas nao aceitas', value: 1, status: 'recusada' },
  { title: 'Operacoes em andamento', value: 2, status: 'andamento' },
  { title: 'Contratos concluídos', value: 4, status: 'concluida' },
]

const proposals = [
  {
    id: 'PR-23981',
    product: 'Portabilidade',
    openedAt: '10/04/2026',
    status: 'retida',
    initialOffer: {
      cashOut: 'R$ 4.200,00',
      installment: 'R$ 538,40',
      term: '84x',
    },
    fulfilledOffer: {
      cashOut: 'R$ 3.100,00',
      installment: 'R$ 487,90',
      term: '84x',
    },
    note: 'Contrato retido pelo banco de origem. Oferta concretizada ajustada apos contraproposta.',
    progress: [
      { label: 'Proposta enviada', done: true },
      { label: 'Analise da margem', done: true },
      { label: 'Retencao aplicada', done: true },
      { label: 'Aceite final do cliente', done: false },
      { label: 'Pagamento', done: false },
    ],
  },
  {
    id: 'PR-23974',
    product: 'Novo contrato',
    openedAt: '06/04/2026',
    status: 'concluida',
    initialOffer: {
      cashOut: 'R$ 8.400,00',
      installment: 'R$ 622,15',
      term: '96x',
    },
    fulfilledOffer: {
      cashOut: 'R$ 8.400,00',
      installment: 'R$ 622,15',
      term: '96x',
    },
    note: 'Oferta mantida sem alteracoes. Contrato assinado e valor creditado.',
    progress: [
      { label: 'Proposta enviada', done: true },
      { label: 'Aprovacao de credito', done: true },
      { label: 'Assinatura', done: true },
      { label: 'Pagamento', done: true },
    ],
  },
  {
    id: 'PR-23962',
    product: 'Refinanciamento',
    openedAt: '02/04/2026',
    status: 'andamento',
    initialOffer: {
      cashOut: 'R$ 2.950,00',
      installment: 'R$ 413,20',
      term: '72x',
    },
    fulfilledOffer: {
      cashOut: 'R$ 2.950,00',
      installment: 'R$ 413,20',
      term: '72x',
    },
    note: 'Aguardando assinatura eletrônica para concluir a liberacao do valor.',
    progress: [
      { label: 'Proposta enviada', done: true },
      { label: 'Aprovacao de credito', done: true },
      { label: 'Assinatura', done: false },
      { label: 'Pagamento', done: false },
    ],
  },
]

function StatusBadge({ status }) {
  const style = statusMap[status] || statusMap.andamento
  return (
    <span
      style={{
        borderRadius: 999,
        border: `1px solid ${style.border}`,
        background: style.bg,
        color: style.color,
        fontSize: 10,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '.07em',
        padding: '5px 10px',
      }}
    >
      {style.label}
    </span>
  )
}

function OfferPanel({ title, offer }) {
  return (
    <div style={{ borderRadius: 14, border: `1px solid ${t.line}`, background: '#fff', padding: 12 }}>
      <div style={{ fontSize: 10, color: t.muted, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 8 }}>{title}</div>
      <div style={{ display: 'grid', gap: 6 }}>
        <div style={{ fontSize: 12, color: t.muted }}>Valor liberado: <strong style={{ color: t.text }}>{offer.cashOut}</strong></div>
        <div style={{ fontSize: 12, color: t.muted }}>Parcela: <strong style={{ color: t.text }}>{offer.installment}</strong></div>
        <div style={{ fontSize: 12, color: t.muted }}>Prazo: <strong style={{ color: t.text }}>{offer.term}</strong></div>
      </div>
    </div>
  )
}

export default function AndamentoPropostas() {
  const navigate = useNavigate()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const profile = useMemo(() => loadProfileData(), [])
  const clientName = profile.nomeCompleto || 'Cliente'

  const content = (
    <>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 999, background: t.blueLight, padding: '4px 12px 4px 8px', marginBottom: 10 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.blue }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', color: t.blue, textTransform: 'uppercase' }}>Monitoramento</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isDesktop ? 24 : 20, color: t.text, lineHeight: 1.2 }}>Acompanhe suas propostas e contratos</h2>
        <p style={{ margin: '8px 0 0', fontSize: 12, color: t.muted, lineHeight: 1.55 }}>
          Veja o status de cada proposta, compare o que foi ofertado com o que foi concretizado e acompanhe ajustes por retencao em portabilidade.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(4, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))', gap: 10, marginBottom: 16 }}>
        {summaryCards.map((item) => (
          <div key={item.title} style={{ borderRadius: 14, border: `1px solid ${t.cardBorder}`, background: '#fff', boxShadow: t.cardShadow, padding: '12px 12px 11px' }}>
            <StatusBadge status={item.status} />
            <div style={{ marginTop: 9, fontSize: 24, lineHeight: 1, fontWeight: 700, color: t.text }}>{item.value}</div>
            <div style={{ marginTop: 5, fontSize: 11, color: t.muted, lineHeight: 1.4 }}>{item.title}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {proposals.map((proposal) => {
          const changed =
            proposal.initialOffer.cashOut !== proposal.fulfilledOffer.cashOut ||
            proposal.initialOffer.installment !== proposal.fulfilledOffer.installment ||
            proposal.initialOffer.term !== proposal.fulfilledOffer.term

          return (
            <div key={proposal.id} style={{ borderRadius: 18, border: `1px solid ${t.cardBorder}`, background: '#fff', boxShadow: t.cardShadow, padding: isDesktop ? 16 : 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 10, color: t.muted, letterSpacing: '.07em', textTransform: 'uppercase', fontWeight: 700 }}>
                    {proposal.product} | {proposal.id}
                  </div>
                  <div style={{ marginTop: 4, fontSize: 12, color: t.muted }}>
                    Aberta em {proposal.openedAt}
                  </div>
                </div>
                <StatusBadge status={proposal.status} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr', gap: 10 }}>
                <OfferPanel title="Oferta apresentada" offer={proposal.initialOffer} />
                <OfferPanel title="Oferta concretizada" offer={proposal.fulfilledOffer} />
              </div>

              <div
                style={{
                  marginTop: 10,
                  borderRadius: 12,
                  padding: '9px 11px',
                  border: `1px solid ${changed ? '#f2d8a9' : '#b8e0ca'}`,
                  background: changed ? t.warningBg : t.greenBg,
                  color: changed ? t.warning : t.green,
                  fontSize: 11,
                  fontWeight: 600,
                  lineHeight: 1.45,
                }}
              >
                {proposal.note}
              </div>

              <div style={{ marginTop: 12 }}>
                <div style={{ marginBottom: 8, fontSize: 10, color: t.muted, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase' }}>
                  Status de andamento
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? `repeat(${proposal.progress.length}, minmax(0, 1fr))` : '1fr', gap: 8 }}>
                  {proposal.progress.map((step) => (
                    <div key={step.label} style={{ borderRadius: 10, border: `1px solid ${step.done ? '#b8e0ca' : t.line}`, background: step.done ? '#edf8f3' : t.bg, padding: '9px 10px' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: step.done ? t.greenAccent : t.muted, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                        {step.done ? 'Concluido' : 'Pendente'}
                      </div>
                      <div style={{ marginTop: 4, fontSize: 12, color: t.text, lineHeight: 1.35 }}>{step.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      <div style={appPageStyle}>
        {isDesktop ? (
          <>
            <DesktopPageHeader
              clientName={clientName}
              chipLabel="Historico e andamento"
              title="Transparencia total das suas propostas"
              subtitle="Acompanhe status, ajustes e o comparativo entre a oferta apresentada e a oferta concretizada."
              onLogoClick={() => navigate('/ofertas')}
              actions={[
                { label: 'Ofertas', onClick: () => navigate('/ofertas') },
                { label: 'Configuracoes', onClick: () => navigate('/configuracoes') },
              ]}
            />
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 40px 48px' }}>
              {content}
            </div>
          </>
        ) : (
          <>
            <MobilePageHeader
              clientName={clientName}
              onLogoClick={() => navigate('/ofertas')}
              actions={[
                { label: 'Ofertas', onClick: () => navigate('/ofertas') },
                { label: 'Configuracoes', onClick: () => navigate('/configuracoes') },
              ]}
            />

            <div style={{ background: t.bg, borderRadius: '26px 26px 0 0', marginTop: 0, padding: '20px 18px calc(24px + env(safe-area-inset-bottom))' }}>
              {content}
            </div>
          </>
        )}
      </div>
    </>
  )
}

