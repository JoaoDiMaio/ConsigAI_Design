import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { loadProfileData } from '../lib/profileStorage'
import { DesktopPageHeader, MobilePageHeader } from '../components/AppHeader'
import { appPageStyle } from '../ui/theme'
import { statusMap, summaryCardDefs, proposals, financialSummary } from '../data/andamentoPropostasDataClean'

function StatusBadge({ status, compact = false }) {
  const style = statusMap[status] || statusMap.andamento
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 999,
        border: `1px solid ${style.border}`,
        background: style.bg,
        color: style.color,
        fontSize: compact ? 10 : 10.5,
        fontWeight: 950,
        textTransform: 'uppercase',
        letterSpacing: '.05em',
        minHeight: compact ? 28 : 30,
        padding: compact ? '0 12px' : '0 13px',
        whiteSpace: 'nowrap',
      }}
    >
      {style.label}
    </span>
  )
}

function OfferPanel({ title, offer, positive = false }) {
  return (
    <div style={{ padding: 16, borderRadius: 20, background: positive ? 'linear-gradient(180deg, #FFFFFF 0%, #F8FFFC 100%)' : '#FFFFFF', border: `1px solid ${positive ? '#BDECD7' : '#DDE8F6'}` }}>
      <div style={{ fontSize: 10, color: '#64748B', fontWeight: 950, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12 }}>{title}</div>
      <div style={{ display: 'grid', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, color: '#64748B', fontSize: 12, lineHeight: 1.25, fontWeight: 740 }}><span>Valor liberado</span><strong style={{ color: positive ? '#007A52' : '#002D6E' }}>{offer.cashOut}</strong></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, color: '#64748B', fontSize: 12, lineHeight: 1.25, fontWeight: 740 }}><span>Parcela</span><strong style={{ color: positive ? '#007A52' : '#002D6E' }}>{offer.installment}</strong></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, color: '#64748B', fontSize: 12, lineHeight: 1.25, fontWeight: 740 }}><span>Prazo</span><strong style={{ color: positive ? '#007A52' : '#002D6E' }}>{offer.term}</strong></div>
      </div>
    </div>
  )
}

function TimelineStep({ step, isCurrent, isDesktop }) {
  const colors = step.done
    ? { border: '#BDECD7', bg: '#F0FFF8', color: '#007A52', label: 'Concluido' }
    : isCurrent
      ? { border: '#93C5FD', bg: '#EFF6FF', color: '#1D4ED8', label: 'Agora' }
      : { border: '#DDE8F6', bg: '#F8FBFF', color: '#94A3B8', label: 'Pendente' }
  return (
    <div style={{ minHeight: isDesktop ? 70 : 56, padding: '11px 12px', borderRadius: 16, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.color, display: 'grid', alignContent: 'start', gap: 6, boxShadow: isCurrent ? '0 0 0 2px rgba(29,78,216,.15)' : 'none' }}>
      <strong style={{ display: 'block', fontSize: 9.5, fontWeight: 950, letterSpacing: '.04em', textTransform: 'uppercase' }}>{colors.label}</strong>
      <span style={{ display: 'block', fontSize: 10.5, lineHeight: 1.2, fontWeight: 740 }}>{step.label}</span>
    </div>
  )
}

export default function AndamentoPropostas() {
  const navigate = useNavigate()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const profile = useMemo(() => loadProfileData(), [])
  const clientName = profile.nomeCompleto || profile.nomeExibicao || 'Cliente'
  const proposalListRef = useRef(null)
  const [openProposalId, setOpenProposalId] = useState(proposals[0]?.id || null)

  const summaryCards = summaryCardDefs.map((def) => ({
    ...def,
    value: proposals.filter((p) => p.status === def.status).length,
  }))

  const completedCount = proposals.filter((proposal) => proposal.status === 'concluida').length
  const retainedProposal = proposals.find((proposal) => proposal.status === 'retida')
  const inProgressProposal = proposals.find((proposal) => proposal.status === 'andamento')
  const changedOffers = proposals.filter((proposal) =>
    proposal.initialOffer.cashOut !== proposal.fulfilledOffer.cashOut ||
    proposal.initialOffer.installment !== proposal.fulfilledOffer.installment ||
    proposal.initialOffer.term !== proposal.fulfilledOffer.term,
  )

  const proposalCtaMap = {
    andamento: { label: 'Assinar contrato', action: (id) => setOpenProposalId(id) },
    retida:    { label: 'Revisar proposta', action: (id) => setOpenProposalId(id) },
    concluida: { label: 'Ver contrato',     action: (id) => setOpenProposalId(id) },
  }

  const content = (
    <>
      <section style={{ padding: isDesktop ? 34 : 24, borderRadius: isDesktop ? 34 : 26, background: 'rgba(255,255,255,.98)', border: '1px solid #DDE8F6', boxShadow: '0 24px 68px rgba(3,36,111,.12)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: '0 0 auto 0', height: 5, background: 'linear-gradient(90deg, #043B8B, #2454D6, #00A86B)' }} />
        <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'minmax(0, 1.15fr) minmax(320px, .85fr)' : '1fr', gap: 28, alignItems: 'stretch' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 999, background: 'rgba(29,161,235,.12)', border: '1px solid rgba(29,161,235,.24)', color: '#043B8B', fontSize: 11, fontWeight: 950, letterSpacing: '.10em', textTransform: 'uppercase' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#1DA1EB', boxShadow: '0 0 10px rgba(29,161,235,.7)' }} />
              Monitoramento
            </div>
            <h1 style={{ margin: '18px 0 0', maxWidth: 660, color: '#002D6E', fontSize: 'clamp(34px, 4vw, 54px)', lineHeight: 1.02, fontWeight: 950, letterSpacing: '-.075em' }}>
              Acompanhe suas propostas e <span style={{ color: '#00A86B' }}>contratos</span>
            </h1>
            <p style={{ maxWidth: 650, marginTop: 13, color: '#64748B', fontSize: 15, lineHeight: 1.5, fontWeight: 650 }}>
              Veja o status de cada proposta, compare o que foi ofertado com o que foi concretizado e entenda os ajustes por retencao ou contraproposta.
            </p>
            <div className="no-print" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 22 }}>
              <button className="cta-primary consigai-cta-animated" type="button" onClick={() => proposalListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Ver proximas acoes</button>
              <button className="cta-secondary consigai-cta-animated" type="button" onClick={() => window.print()}>Gerar relatorio</button>
            </div>
          </div>
          <aside style={{ minHeight: 250, padding: 24, borderRadius: 28, background: 'radial-gradient(circle at 88% 10%, rgba(0,231,255,.18), transparent 34%), linear-gradient(145deg, #06184E 0%, #03246F 58%, #055ECE 100%)', color: '#fff', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', width: 240, height: 240, right: -110, bottom: -120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,231,255,.16), transparent 64%)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 999, background: 'rgba(255,255,255,.10)', border: '1px solid rgba(255,255,255,.16)', color: '#DDFBFF', fontSize: 11, fontWeight: 950, letterSpacing: '.10em', textTransform: 'uppercase' }}>ConsigAI acompanha</div>
              <h2 style={{ marginTop: 14, fontSize: 26, lineHeight: 1, letterSpacing: '-.05em', fontWeight: 950 }}>Voce no controle do <span style={{ color: '#A8FFF0' }}>processo</span></h2>
              <p style={{ marginTop: 10, color: 'rgba(255,255,255,.78)', fontSize: 13, lineHeight: 1.45, fontWeight: 650 }}>Acompanhamos cada etapa para voce entender o que avancou, o que mudou e o que ainda depende de confirmacao.</p>
              <div style={{ marginTop: 20, padding: 14, borderRadius: 18, background: 'rgba(255,255,255,.10)', border: '1px solid rgba(255,255,255,.16)' }}>
                <small style={{ display: 'block', color: 'rgba(255,255,255,.64)', fontSize: 10, fontWeight: 950, letterSpacing: '.09em', textTransform: 'uppercase' }}>Proximo passo seguro</small>
                <strong style={{ display: 'block', marginTop: 6, color: '#fff', fontSize: 15, lineHeight: 1.2, fontWeight: 950 }}>Revisar propostas com diferenca entre oferta apresentada e oferta concretizada.</strong>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(4, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))', gap: 12, margin: '18px 0' }}>
        {summaryCards.map((item) => (
          <div key={item.title} style={{ borderRadius: 24, border: '1px solid #DDE8F6', background: '#fff', boxShadow: '0 14px 30px rgba(3,36,111,.05)', padding: '14px 14px 12px' }}>
            <StatusBadge status={item.status} />
            <div style={{ marginTop: 9, fontSize: 28, lineHeight: 1, fontWeight: 950, color: '#002D6E', letterSpacing: '-.06em' }}>{item.value}</div>
            <div style={{ marginTop: 5, fontSize: 11, color: '#64748B', lineHeight: 1.4 }}>{item.title}</div>
          </div>
        ))}
      </div>
      <section style={{ marginBottom: 18, padding: isDesktop ? 24 : 18, borderRadius: 30, background: 'radial-gradient(circle at 92% 8%, rgba(29,161,235,.10), transparent 34%), rgba(255,255,255,.98)', border: '1px solid #DDE8F6', boxShadow: '0 16px 38px rgba(3,36,111,.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 22, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 999, background: 'rgba(29,161,235,.12)', border: '1px solid rgba(29,161,235,.24)', color: '#043B8B', fontSize: 11, fontWeight: 950, letterSpacing: '.10em', textTransform: 'uppercase' }}>Resumo da vida financeira</div>
            <h2 style={{ marginTop: 10, color: '#002D6E', fontSize: 28, lineHeight: 1.02, fontWeight: 950, letterSpacing: '-.06em' }}>O que aconteceu com a proposta do <span style={{ color: '#00A86B' }}>{clientName.split(' ')[0] || 'cliente'}</span></h2>
            <p style={{ maxWidth: 660, marginTop: 8, color: '#64748B', fontSize: 13, lineHeight: 1.45, fontWeight: 650 }}>Compilado da economia, do dinheiro ofertado versus liberado e da mudanca de parcela antes e depois da oferta aceita.</p>
          </div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 999, color: '#007A52', background: '#F0FFF8', border: '1px solid #BDECD7', fontSize: 11, lineHeight: 1, fontWeight: 950, textTransform: 'uppercase', letterSpacing: '.05em' }}>{completedCount} oferta{completedCount === 1 ? '' : 's'} concluida{completedCount === 1 ? '' : 's'}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1.15fr .85fr .85fr' : '1fr', gap: 12, marginTop: 18 }}>
          <article style={{ minHeight: 132, padding: 16, borderRadius: 22, background: 'linear-gradient(180deg, #FFFFFF 0%, #F0FFF8 100%)', border: '1px solid #BDECD7', display: 'grid', alignContent: 'space-between' }}>
            <span style={{ display: 'block', color: '#64748B', fontSize: 10, lineHeight: 1.1, fontWeight: 950, letterSpacing: '.08em', textTransform: 'uppercase' }}>Economia</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, marginTop: 14, borderRadius: 14, overflow: 'hidden', border: '1px solid #BDECD7' }}>
              <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,.80)' }}>
                <span style={{ display: 'block', color: '#64748B', fontSize: 9.5, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.05em' }}>Mensal</span>
                <strong style={{ display: 'block', marginTop: 6, color: '#00A86B', fontSize: 22, lineHeight: 1, fontWeight: 950, letterSpacing: '-.05em' }}>{financialSummary.economyMonthly}</strong>
              </div>
              <div style={{ padding: '12px 14px', background: 'rgba(240,255,248,.70)', borderLeft: '1px solid #BDECD7' }}>
                <span style={{ display: 'block', color: '#64748B', fontSize: 9.5, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.05em' }}>Total</span>
                <strong style={{ display: 'block', marginTop: 6, color: '#007A52', fontSize: 22, lineHeight: 1, fontWeight: 950, letterSpacing: '-.05em' }}>{financialSummary.economyTotal}</strong>
              </div>
            </div>
          </article>
          <article style={{ minHeight: 132, padding: 16, borderRadius: 22, background: '#F8FBFF', border: '1px solid #DDE8F6' }}>
            <span style={{ display: 'block', color: '#64748B', fontSize: 10, lineHeight: 1.1, fontWeight: 950, letterSpacing: '.08em', textTransform: 'uppercase' }}>Dinheiro ofertado</span>
            <strong style={{ display: 'block', marginTop: 8, color: '#475569', fontSize: 25, lineHeight: 1, fontWeight: 950, letterSpacing: '-.06em' }}>{financialSummary.offeredCash}</strong>
            <span style={{ display: 'block', marginTop: 7, color: '#94A3B8', fontSize: 11, lineHeight: 1.28, fontWeight: 650 }}>valor apresentado na simulacao</span>
          </article>
          <article style={{ minHeight: 132, padding: 16, borderRadius: 22, background: 'linear-gradient(180deg, #FFFFFF 0%, #F0FFF8 100%)', border: '1px solid #BDECD7' }}>
            <span style={{ display: 'block', color: '#007A52', fontSize: 10, lineHeight: 1.1, fontWeight: 950, letterSpacing: '.08em', textTransform: 'uppercase' }}>Dinheiro liberado</span>
            <strong style={{ display: 'block', marginTop: 8, color: '#007A52', fontSize: 25, lineHeight: 1, fontWeight: 950, letterSpacing: '-.06em' }}>{financialSummary.releasedCash}</strong>
            <span style={{ display: 'block', marginTop: 7, color: '#64748B', fontSize: 11, lineHeight: 1.28, fontWeight: 650 }}>valor efetivamente contratado</span>
          </article>
        </div>
        <div style={{ marginTop: 16, padding: 16, borderRadius: 22, background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF7E8 100%)', border: '1px solid #F4D19B', display: 'grid', gridTemplateColumns: isDesktop ? 'minmax(0, 1fr) auto' : '1fr', gap: 16, alignItems: 'center' }}>
          <div>
            <small style={{ display: 'block', color: '#9A6500', fontSize: 10, fontWeight: 950, letterSpacing: '.08em', textTransform: 'uppercase' }}>Portabilidades retidas</small>
            <strong style={{ display: 'block', marginTop: 6, color: '#002D6E', fontSize: 16, lineHeight: 1.2, fontWeight: 950, letterSpacing: '-.025em' }}>{retainedProposal ? '1 portabilidade teve retencao do banco de origem.' : 'Sem retencoes identificadas.'}</strong>
            <p style={{ marginTop: 5, color: '#64748B', fontSize: 12, lineHeight: 1.35, fontWeight: 650 }}>Isso pode reduzir o valor liberado frente ao valor inicialmente ofertado na simulacao.</p>
          </div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 999, color: '#9A6500', background: '#FFFFFF', border: '1px solid #F4D19B', fontSize: 11, fontWeight: 950, whiteSpace: 'nowrap' }}>{financialSummary.retentionValue}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr', gap: 16, marginTop: 16, alignItems: 'stretch' }}>
          <article style={{ padding: 18, borderRadius: 24, background: '#FFFFFF', border: '1px solid #DDE8F6', boxShadow: '0 10px 24px rgba(3,36,111,.04)' }}>
            <span style={{ display: 'block', color: '#64748B', fontSize: 10, lineHeight: 1.1, fontWeight: 950, letterSpacing: '.08em', textTransform: 'uppercase' }}>Evolucao de salario liquido</span>
            <div style={{ display: 'grid', gap: 16, marginTop: 14 }}>
              <div style={{ display: 'grid', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 14 }}>
                  <span style={{ color: '#64748B', fontSize: 12, fontWeight: 900 }}>Antes</span>
                  <strong style={{ color: '#002D6E', fontSize: 18, lineHeight: 1, fontWeight: 950, letterSpacing: '-.04em' }}>{financialSummary.salaryBefore}</strong>
                </div>
                <div style={{ height: 13, borderRadius: 999, background: '#E7EEF8', overflow: 'hidden', border: '1px solid rgba(221,232,246,.84)' }}>
                  <div style={{ width: financialSummary.salaryBeforeWidth, height: '100%', borderRadius: 'inherit', background: 'linear-gradient(90deg, #B8C6D9 0%, #8798B1 100%)' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 14 }}>
                  <span style={{ color: '#007A52', fontSize: 12, fontWeight: 900 }}>Realizado com ConsigAI</span>
                  <strong style={{ color: '#007A52', fontSize: 18, lineHeight: 1, fontWeight: 950, letterSpacing: '-.04em' }}>{financialSummary.salaryAfter}</strong>
                </div>
                <div style={{ height: 13, borderRadius: 999, background: '#E7EEF8', overflow: 'hidden', border: '1px solid rgba(221,232,246,.84)' }}>
                  <div style={{ width: financialSummary.salaryAfterWidth, height: '100%', borderRadius: 'inherit', background: 'linear-gradient(90deg, #007A52 0%, #00A86B 100%)' }} />
                </div>
              </div>
            </div>
            <div style={{ display: 'inline-flex', width: 'fit-content', marginTop: 12, alignItems: 'center', gap: 7, padding: '8px 11px', borderRadius: 999, color: '#007A52', background: '#F0FFF8', border: '1px solid #BDECD7', fontSize: 12, lineHeight: 1, fontWeight: 950 }}>
              + {financialSummary.salaryGain}
            </div>
          </article>
          <article style={{ padding: 18, borderRadius: 24, background: 'radial-gradient(circle at 92% 8%, rgba(29,161,235,.09), transparent 34%), #FFFFFF', border: '1px solid #DDE8F6', boxShadow: '0 10px 24px rgba(3,36,111,.04)' }}>
            <span style={{ display: 'block', color: '#64748B', fontSize: 10, lineHeight: 1.1, fontWeight: 950, letterSpacing: '.08em', textTransform: 'uppercase' }}>Parcela antes e depois</span>
            <h3 style={{ marginTop: 8, color: '#002D6E', fontSize: 20, lineHeight: 1.05, fontWeight: 950, letterSpacing: '-.045em' }}>O cliente paga menos por mes apos a oferta aceita.</h3>
            <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1fr auto 1fr' : '1fr', gap: 12, alignItems: 'center', marginTop: 14 }}>
              <div style={{ minHeight: 92, padding: 15, borderRadius: 20, background: '#F8FBFF', border: '1px solid #DDE8F6' }}>
                <span style={{ display: 'block', color: '#64748B', fontSize: 10, lineHeight: 1, fontWeight: 950, letterSpacing: '.08em', textTransform: 'uppercase' }}>Antes</span>
                <strong style={{ display: 'block', marginTop: 9, color: '#002D6E', fontSize: 24, lineHeight: 1, fontWeight: 950, letterSpacing: '-.06em' }}>{financialSummary.installmentBefore}</strong>
                <em style={{ display: 'block', marginTop: 7, color: '#64748B', fontSize: 11, lineHeight: 1.3, fontStyle: 'normal', fontWeight: 650 }}>parcela mensal estimada antes da operacao</em>
              </div>
              <div style={{ width: 34, height: 34, borderRadius: '50%', display: 'grid', placeItems: 'center', color: '#FFFFFF', background: 'linear-gradient(145deg, #043B8B, #2454D6)', fontWeight: 950, boxShadow: '0 12px 24px rgba(36,84,214,.18)', justifySelf: 'center', transform: isDesktop ? 'none' : 'rotate(90deg)' }}>{'->'}</div>
              <div style={{ minHeight: 92, padding: 15, borderRadius: 20, background: 'linear-gradient(180deg, #FFFFFF 0%, #F0FFF8 100%)', border: '1px solid #BDECD7' }}>
                <span style={{ display: 'block', color: '#64748B', fontSize: 10, lineHeight: 1, fontWeight: 950, letterSpacing: '.08em', textTransform: 'uppercase' }}>Agora</span>
                <strong style={{ display: 'block', marginTop: 9, color: '#007A52', fontSize: 24, lineHeight: 1, fontWeight: 950, letterSpacing: '-.06em' }}>{financialSummary.installmentAfter}</strong>
                <em style={{ display: 'block', marginTop: 7, color: '#64748B', fontSize: 11, lineHeight: 1.3, fontStyle: 'normal', fontWeight: 650 }}>parcela mensal realizada apos a contratacao</em>
              </div>
            </div>
          </article>
        </div>
        <p style={{ marginTop: 10, color: '#94A3B8', fontSize: 10.5, lineHeight: 1.4, fontWeight: 650 }}>Valores de economia e salario sao estimativas baseadas nas operacoes concluidas. Sujeito a analise final do agente financeiro.</p>

        <article style={{ marginTop: 16, padding: 18, borderRadius: 24, background: '#FFFFFF', border: '1px solid #DDE8F6', boxShadow: '0 10px 24px rgba(3,36,111,.04)' }}>
          <span style={{ display: 'block', color: '#64748B', fontSize: 10, lineHeight: 1.1, fontWeight: 950, letterSpacing: '.08em', textTransform: 'uppercase' }}>Por que chegou nesse resultado?</span>
          <h3 style={{ marginTop: 8, color: '#002D6E', fontSize: 20, lineHeight: 1.05, fontWeight: 950, letterSpacing: '-.045em' }}>A oferta aceita gerou economia e aumentou o salario liquido realizado.</h3>
          <p style={{ marginTop: 10, color: '#64748B', fontSize: 12.5, lineHeight: 1.45, fontWeight: 650 }}>
            O foco da analise foi economia: a ConsigAI comparou custo total, margem, dinheiro ofertado, dinheiro liberado e salario liquido antes e realizado. O novo contrato chegou ao valor ofertado porque aprovacao e margem bateram com a simulacao. Ja a portabilidade retida teve contraproposta do banco de origem, reduzindo o valor liberado frente ao valor inicialmente ofertado.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr', gap: 9, marginTop: 14 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 11, borderRadius: 16, background: '#F8FBFF', border: '1px solid #DDE8F6' }}>
              <span style={{ width: 24, height: 24, flex: '0 0 auto', display: 'grid', placeItems: 'center', borderRadius: '50%', background: '#F0FFF8', border: '1px solid #BDECD7', color: '#007A52', fontSize: 11, fontWeight: 950 }}>OK</span>
              <div>
                <strong style={{ display: 'block', color: '#002D6E', fontSize: 12, lineHeight: 1.2, fontWeight: 950 }}>Oferta aceita sem alteracao</strong>
                <span style={{ display: 'block', marginTop: 3, color: '#64748B', fontSize: 11, lineHeight: 1.3, fontWeight: 650 }}>No novo contrato, o valor ofertado e o valor liberado ficaram iguais: R$ 8.400 com parcela de R$ 622,15 por mes.</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 11, borderRadius: 16, background: '#F8FBFF', border: '1px solid #DDE8F6' }}>
              <span style={{ width: 24, height: 24, flex: '0 0 auto', display: 'grid', placeItems: 'center', borderRadius: '50%', background: '#FFF7E8', border: '1px solid #F4D19B', color: '#9A6500', fontSize: 11, fontWeight: 950 }}>!</span>
              <div>
                <strong style={{ display: 'block', color: '#002D6E', fontSize: 12, lineHeight: 1.2, fontWeight: 950 }}>Retencao explicada</strong>
                <span style={{ display: 'block', marginTop: 3, color: '#64748B', fontSize: 11, lineHeight: 1.3, fontWeight: 650 }}>Na portabilidade, houve retencao do banco de origem: R$ 4.200 ofertados viraram R$ 3.100 liberados.</span>
              </div>
            </div>
          </div>
        </article>
      </section>

      {inProgressProposal && (
        <div style={{ marginBottom: 18, padding: '14px 18px', borderRadius: 20, background: '#EFF6FF', border: '1px solid #93C5FD', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1D4ED8', boxShadow: '0 0 8px rgba(29,78,216,.5)', flexShrink: 0 }} />
            <span style={{ color: '#1D4ED8', fontSize: 13, fontWeight: 950 }}>
              Acao pendente — {inProgressProposal.product} ({inProgressProposal.id})
            </span>
            <span style={{ color: '#64748B', fontSize: 12, fontWeight: 650 }}>
              {inProgressProposal.progress.find((s) => !s.done)?.label || 'Pendente'}
            </span>
          </div>
          <button
            className="consigai-cta-animated"
            type="button"
            style={{ minHeight: 36, padding: '0 16px', borderRadius: 999, border: '1px solid #93C5FD', background: '#fff', color: '#1D4ED8', fontSize: 12, fontWeight: 950, cursor: 'pointer', fontFamily: 'inherit' }}
            onClick={() => setOpenProposalId(inProgressProposal.id)}
          >
            Assinar contrato
          </button>
        </div>
      )}

      <div ref={proposalListRef} style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'minmax(0, 1fr) 300px' : '1fr', gap: 18, alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 16 }}>
        {proposals.length === 0 ? (
          <div style={{ padding: 32, borderRadius: 24, border: '1px solid #DDE8F6', background: '#F8FBFF', textAlign: 'center' }}>
            <strong style={{ display: 'block', color: '#002D6E', fontSize: 16, fontWeight: 950 }}>Nenhuma proposta encontrada</strong>
            <p style={{ marginTop: 8, color: '#64748B', fontSize: 13 }}>Assim que uma proposta for criada ela aparece aqui.</p>
            <button className="cta-primary consigai-cta-animated" type="button" style={{ marginTop: 16 }} onClick={() => navigate('/ofertas')}>Ver ofertas disponíveis</button>
          </div>
        ) : proposals.map((proposal) => {
          const changed =
            proposal.initialOffer.cashOut !== proposal.fulfilledOffer.cashOut ||
            proposal.initialOffer.installment !== proposal.fulfilledOffer.installment ||
            proposal.initialOffer.term !== proposal.fulfilledOffer.term
          const isOpen = openProposalId === proposal.id
          const currentStepIdx = proposal.progress.findIndex((s) => !s.done)
          const proposalCta = proposalCtaMap[proposal.status]

          return (
            <div key={proposal.id} style={{ borderRadius: 30, border: '1px solid #DDE8F6', background: '#fff', boxShadow: '0 16px 38px rgba(3,36,111,.08)', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: '0 0 auto 0', height: 4, background: proposal.status === 'retida' ? 'linear-gradient(90deg, #9A6500, #FFB84D)' : 'linear-gradient(90deg, #043B8B, #1878DE, #1DA1EB)', opacity: 0.82 }} />
              <div style={{ padding: isDesktop ? '22px 22px 0' : '18px 18px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 10, color: '#64748B', letterSpacing: '.07em', textTransform: 'uppercase', fontWeight: 700 }}>
                    {proposal.product} | {proposal.id}
                  </div>
                  <div style={{ marginTop: 4, fontSize: 12, color: '#64748B', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <span>Aberta em {proposal.openedAt}</span>
                    {proposal.updatedAt && (
                      <span style={{ color: '#94A3B8' }}>· Atualizada em {proposal.updatedAt}</span>
                    )}
                  </div>
                </div>
                <StatusBadge status={proposal.status} compact />
              </div>
              <div style={{ marginTop: 12 }}>
                <div style={{ marginBottom: 8, fontSize: 10, color: '#64748B', fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase' }}>
                  Status de andamento
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? `repeat(${proposal.progress.length}, minmax(0, 1fr))` : '1fr', gap: 8 }}>
                  {proposal.progress.map((step, idx) => <TimelineStep key={step.label} step={step} isCurrent={idx === currentStepIdx} isDesktop={isDesktop} />)}
                </div>
              </div>
              </div>
              <div style={{ marginTop: 16, borderTop: '1px solid #DDE8F6', background: 'linear-gradient(180deg, #FFFFFF 0%, #FBFDFF 100%)' }}>
                <div className="no-print" style={{ minHeight: 58, padding: '0 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  {proposalCta && (
                    <button
                      className="cta-primary consigai-cta-animated"
                      type="button"
                      style={{ minHeight: 36, padding: '0 16px', borderRadius: 999, fontSize: 12 }}
                      onClick={() => proposalCta.action(proposal.id)}
                    >
                      {proposalCta.label}
                    </button>
                  )}
                  <button className="details-toggle consigai-cta-animated" type="button" style={{ marginLeft: 'auto' }} onClick={() => setOpenProposalId(isOpen ? null : proposal.id)}>{isOpen ? 'Ocultar detalhes' : 'Ver detalhes'}</button>
                </div>
                {isOpen ? (
                  <div style={{ padding: isDesktop ? '18px 22px 22px' : '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start', marginBottom: 14, flexWrap: 'wrap' }}>
                      <div>
                        <small style={{ display: 'block', color: '#043B8B', fontSize: 10, lineHeight: 1, fontWeight: 950, letterSpacing: '.08em', textTransform: 'uppercase' }}>Detalhes de {proposal.product.toLowerCase()}</small>
                        <strong style={{ display: 'block', marginTop: 6, color: '#002D6E', fontSize: 18, lineHeight: 1.1, fontWeight: 950, letterSpacing: '-.04em' }}>{changed ? 'A oferta final mudou em relacao a simulacao inicial.' : 'A oferta apresentada foi mantida ate a concretizacao.'}</strong>
                        <p style={{ marginTop: 5, color: '#64748B', fontSize: 12, lineHeight: 1.35, fontWeight: 650 }}>Compare o valor apresentado com o valor concretizado para entender o resultado final da operacao.</p>
                      </div>
                      <span style={{ flex: '0 0 auto', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 999, fontSize: 11, fontWeight: 950, whiteSpace: 'nowrap', color: changed ? '#9A6500' : '#007A52', background: changed ? '#FFF7E8' : '#F0FFF8', border: `1px solid ${changed ? '#F4D19B' : '#BDECD7'}` }}>{changed ? 'Oferta ajustada' : 'Assinado e creditado'}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr', gap: 12 }}>
                      <OfferPanel title="Oferta apresentada" offer={proposal.initialOffer} />
                      <OfferPanel title="Oferta concretizada" offer={proposal.fulfilledOffer} positive />
                    </div>
                    <div style={{ marginTop: 12, padding: '12px 14px', borderRadius: 16, fontSize: 11.5, lineHeight: 1.35, fontWeight: 750, color: changed ? '#9A6500' : '#007A52', background: changed ? '#FFF7E8' : '#F0FFF8', border: `1px solid ${changed ? '#F4D19B' : '#BDECD7'}` }}>{proposal.note}</div>
                  </div>
                ) : null}
              </div>
            </div>
          )
        })}
        </div>

        <aside className="no-print" style={{ position: isDesktop ? 'sticky' : 'static', top: 20, display: 'grid', gap: 14 }}>
          <section style={{ padding: 20, borderRadius: 28, background: 'rgba(255,255,255,.98)', border: '1px solid #DDE8F6', boxShadow: '0 16px 38px rgba(3,36,111,.08)' }}>
            <h3 style={{ color: '#002D6E', fontSize: 15, lineHeight: 1.15, fontWeight: 950, textTransform: 'uppercase', letterSpacing: '.02em' }}>Proxima acao recomendada</h3>
            <p style={{ marginTop: 7, color: '#64748B', fontSize: 12, lineHeight: 1.4, fontWeight: 650 }}>Priorize as propostas com diferenca entre valor ofertado e valor concretizado.</p>
            <div style={{ marginTop: 16, padding: 16, borderRadius: 20, background: '#F4F9FF', border: '1px solid #DDE8F6' }}>
              <small style={{ display: 'block', color: '#043B8B', fontSize: 10, fontWeight: 950, letterSpacing: '.08em', textTransform: 'uppercase' }}>Foco agora</small>
              <strong style={{ display: 'block', marginTop: 7, color: '#002D6E', fontSize: 18, lineHeight: 1.15, fontWeight: 950, letterSpacing: '-.035em' }}>{changedOffers.length} proposta{changedOffers.length === 1 ? '' : 's'} com ajuste para revisar</strong>
            </div>
          </section>
          <section style={{ padding: 20, borderRadius: 28, color: '#fff', background: 'radial-gradient(circle at 88% 10%, rgba(0,231,255,.18), transparent 34%), linear-gradient(145deg, #06184E 0%, #03246F 58%, #055ECE 100%)', border: '1px solid rgba(0,231,255,.20)', boxShadow: '0 16px 38px rgba(3,36,111,.08)' }}>
            <h3 style={{ color: '#fff', fontSize: 20, lineHeight: 1.05, letterSpacing: '-.04em', fontWeight: 950 }}>ConsigAI explica cada <span style={{ color: '#A8FFF0' }}>mudanca</span></h3>
            <p style={{ marginTop: 10, color: 'rgba(255,255,255,.76)', fontSize: 12, lineHeight: 1.4, fontWeight: 650 }}>Nada fica escondido: voce acompanha status, retencao, contraproposta e liberacao final no mesmo fluxo.</p>
            {retainedProposal && (
              <button className="side-action consigai-cta-animated" type="button" onClick={() => setOpenProposalId(retainedProposal.id)}>Ver proposta retida</button>
            )}
          </section>
          <section style={{ padding: 16, borderRadius: 20, background: '#F8FBFF', border: '1px solid #DDE8F6' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span style={{ fontSize: 16, lineHeight: 1, flexShrink: 0 }}>🔒</span>
              <div>
                <strong style={{ display: 'block', color: '#002D6E', fontSize: 12, fontWeight: 950 }}>Seus dados estao protegidos</strong>
                <p style={{ marginTop: 5, color: '#64748B', fontSize: 11, lineHeight: 1.45, fontWeight: 650 }}>Nenhuma contratacao ocorre sem sua confirmacao. Valores apresentados sao estimativas sujeitas a analise de credito.</p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .andamento-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 10% 18%, rgba(29, 161, 235, 0.18), transparent 30%),
            radial-gradient(circle at 90% 16%, rgba(5, 94, 206, 0.14), transparent 34%),
            linear-gradient(180deg, #DDF4FF 0%, #EEF8FF 48%, #FFFFFF 100%);
        }
        .cta-primary,
        .cta-secondary,
        .details-toggle,
        .side-action {
          min-height: 46px;
          padding: 0 18px;
          border-radius: 17px;
          font-size: 13px;
          font-weight: 950;
          font-family: inherit;
          cursor: pointer;
        }
        .cta-primary {
          border: 0;
          color: #fff;
          background: linear-gradient(145deg, #043B8B, #002D6E);
          box-shadow: 0 16px 30px rgba(4,59,139,.18);
        }
        .cta-secondary {
          border: 1px solid #BFD4F6;
          color: #043B8B;
          background: #FFFFFF;
          box-shadow: 0 12px 24px rgba(3,36,111,.06);
        }
        .details-toggle {
          min-height: 34px;
          padding: 0 14px;
          border-radius: 999px;
          border: 1px solid #BFD4F6;
          color: #043B8B;
          background: #FFFFFF;
          font-size: 11px;
          line-height: 1;
          letter-spacing: .02em;
          box-shadow: 0 10px 22px rgba(3,36,111,.06);
        }
        .side-action {
          width: 100%;
          margin-top: 16px;
          border: 1px solid rgba(255,255,255,.16);
          background: rgba(255,255,255,.10);
          color: #fff;
        }
        .consigai-cta-animated {
          position: relative;
          overflow: hidden;
          transform: translateY(0);
          transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease, background-position .35s ease, filter .18s ease;
          animation: andamentoCtaFloat 3.8s ease-in-out infinite;
          background-size: 220% 100%;
          background-position: 0% 0%;
        }
        .consigai-cta-animated:hover {
          background-position: 100% 0%;
          animation-play-state: paused;
          transform: translateY(-2px) scale(1.01) !important;
          filter: saturate(1.05);
        }
        .consigai-cta-animated:active {
          transform: translateY(0) scale(.985);
        }
        .consigai-cta-animated::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(115deg, transparent 0%, rgba(255,255,255,.55) 45%, transparent 60%);
          transform: translateX(-120%) skewX(-18deg);
          opacity: 0;
          pointer-events: none;
        }
        .consigai-cta-animated:hover::after {
          opacity: 1;
          animation: andamentoCtaShine .9s ease forwards;
        }
        @keyframes andamentoCtaFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1px); }
        }
        @keyframes andamentoCtaShine {
          0% { transform: translateX(-120%) skewX(-18deg); }
          100% { transform: translateX(120%) skewX(-18deg); }
        }
        @media print {
          .no-print { display: none !important; }
          .andamento-page { background: #fff !important; }
        }
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
                { label: 'Acompanhamento', onClick: () => navigate('/acompanhamento') },
                { label: 'Configuracoes', onClick: () => navigate('/configuracoes') },
              ]}
            />
            <div className="andamento-page">
              <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 40px 48px' }}>{content}</div>
            </div>
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

            <div className="andamento-page" style={{ padding: '20px 18px calc(24px + env(safe-area-inset-bottom))' }}>{content}</div>
          </>
        )}
      </div>
    </>
  )
}

