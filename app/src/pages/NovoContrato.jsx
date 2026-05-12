import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { DesktopPageHeader, MobilePageHeader } from '../components/AppHeader'
import { appPageStyle } from '../ui/theme'
import { OFERTA } from '../data/novoContratoData'
import { fmt, fmtDec } from '../lib/formatters'
import { loadProfileData } from '../lib/profileStorage'
import { getSelectableCardStyle } from '../ui/cardSelection'
import { btnPrimary, btnPrimaryHoverShadow, btnSecondary, btnSecondaryHoverBg, btnSecondaryHoverShadow, btnCompact, btnCompactPrimary, btnToggleShape } from '../ui/buttonStyles'
import { printSimulationReceipt } from '../lib/receiptPrint'
import { ResumoCard, ImpactoCard, ControleCard } from '../components/SimulationSideCards'
import { OperationGuideCard } from '../components/OperationGuideCard'

const NOVO_CONTRATO_GUIDE = {
  badge: 'Guia ConsigAI',
  title: 'Como escolher seu valor',
  subtitle: 'Em três passos simples, escolha quanto quer receber, veja a parcela e confirme apenas se fizer sentido para você.',
  steps: [
    { label: 'Passo 1', title: 'Valor', body: 'Escolha quanto deseja receber agora.' },
    { label: 'Passo 2', title: 'Parcela', body: 'Compare o impacto mensal antes de decidir.' },
    { label: 'Passo 3', title: 'Condições', body: 'Veja prazo, taxa e custo total antes de continuar.' },
  ],
  finalTitle: 'Você decide no final',
  finalText: 'Nenhuma contratação acontece sem sua confirmação.',
  badges: ['Simulação sem compromisso', 'Confirmação antes de contratar'],
}

const calcPMT = (pv, rate, n) => {
  const i = rate / 100
  return pv * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1)
}

function Receipt({ offer }) {
  const total = offer.parcela * offer.prazo
  const today = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
  return (
    <div style={{ marginTop: 10, borderRadius: 16, border: '1px solid #DDE8F6', background: '#f7f9fe', padding: 10, display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: 300, borderRadius: 10, padding: '14px 12px 12px', border: '1px solid #ececec', color: '#4f4f4f', fontSize: 12, background: 'linear-gradient(180deg, rgba(255,255,255,.45), rgba(0,0,0,.02)), #f5f5f3' }}>
        <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 800, color: '#444' }}>SIMULAÇÃO DE NOVO CONTRATO - CONSIGAI</div>
        <div style={{ fontSize: 10, marginTop: 4, textAlign: 'center', color: '#808080' }}>{today}</div>
        <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
        <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 800 }}>VALOR ESTIMADO PARA RECEBER</div>
        <div style={{ textAlign: 'center', marginTop: 2, fontSize: 22, fontWeight: 900, color: '#232323' }}>{fmt(offer.valor)}</div>
        <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
        <div style={{ display: 'grid', gap: 6, fontSize: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Prazo</span><strong>{offer.prazo} meses</strong></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Parcela</span><strong>R$ {fmtDec(offer.parcela)}</strong></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Taxa</span><strong>{OFERTA.taxaMensal.toFixed(2).replace('.', ',')}% a.m.</strong></div>
        </div>
        <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10, fontWeight: 700 }}>Total a pagar</span>
          <strong>R$ {fmtDec(total)}</strong>
        </div>
      </div>
    </div>
  )
}

export default function NovoContrato() {
  const navigate = useNavigate()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const profile = loadProfileData()
  const clientName = profile.nomeExibicao || profile.nomeCompleto || 'Cliente'

  const [selected, setSelected] = useState(0)
  const [ctaHover, setCtaHover] = useState(false)
  const [secondHover, setSecondHover] = useState(false)
  const [customBtnHover, setCustomBtnHover] = useState(false)
  const [hoveredAnchor, setHoveredAnchor] = useState(null)
  const [customOpen, setCustomOpen] = useState(false)
  const [customRaw, setCustomRaw] = useState('')
  const [selectedPrazo, setSelectedPrazo] = useState(OFERTA.prazosDisponiveis[OFERTA.prazosDisponiveis.length - 1])
  const [showReceipt, setShowReceipt] = useState(false)

  const maxAnchorValue = Math.max(...OFERTA.ancoras.map(({ valor }) => valor))
  const minAnchorValue = Math.min(...OFERTA.ancoras.map(({ valor }) => valor))

  const selectedAnchor = OFERTA.ancoras[selected]
  const customValue = parseFloat(customRaw)
  const customValid = customValue >= OFERTA.valorMinimo && customValue <= OFERTA.creditoMaximo
  const offer = customOpen && customValid
    ? { valor: customValue, prazo: selectedPrazo, parcela: calcPMT(customValue, OFERTA.taxaMensal, selectedPrazo) }
    : selectedAnchor
  const salarioAntes = 1650
  const salarioDepois = salarioAntes - offer.parcela

  const downloadReceiptPdf = () => {
    const total = offer.parcela * offer.prazo
    printSimulationReceipt({
      title: 'SIMULAÇÃO DE NOVO CONTRATO - CONSIGAI',
      highlightLabel: 'VALOR ESTIMADO PARA RECEBER',
      highlightValue: fmt(offer.valor),
      rows: [
        { label: 'Prazo', value: `${offer.prazo} meses` },
        { label: 'Parcela', value: `R$ ${fmtDec(offer.parcela)}` },
        { label: 'Taxa', value: `${OFERTA.taxaMensal.toFixed(2).replace('.', ',')}% a.m.` },
      ],
      total: { label: 'Total a pagar', value: `R$ ${fmtDec(total)}` },
    })
  }

  const goContratacao = () => {
    navigate('/dados-bancarios', {
      state: {
        sourcePath: '/novo-contrato',
        nextPath: '/contratacao',
        offerState: {
          sourcePath: '/novo-contrato',
          offerTitle: 'Novo Contrato',
          offerSubtitle: 'Resumo da oferta selecionada antes da contratação',
          primaryValue: fmt(offer.valor),
          ctaLabel: 'Confirmar Novo Contrato',
          summary: [
            { label: 'Você recebe', value: fmt(offer.valor) },
            { label: 'Prazo', value: `${offer.prazo}x` },
            { label: 'Parcela', value: `R$ ${fmtDec(offer.parcela)}/mês` },
            { label: 'Taxa', value: `${OFERTA.taxaMensal.toFixed(2).replace('.', ',')}% a.m.` },
          ],
        },
      },
    })
  }

  const renderAnchorButton = (idx) => {
    const a = OFERTA.ancoras[idx]
    const active = selected === idx
    const isMaxMoney = a.valor === maxAnchorValue
    const isLowerImpact = a.valor === minAnchorValue
    const isRecommended = idx === 0
    const cardBackground = isRecommended
      ? 'radial-gradient(circle at 92% 8%, rgba(4, 59, 139, 0.08), transparent 34%), linear-gradient(180deg, #F8FBFF 0%, #FFFFFF 100%)'
      : isMaxMoney
        ? 'radial-gradient(circle at 92% 8%, rgba(36, 84, 214, 0.16), transparent 34%), linear-gradient(180deg, #EEF4FF 0%, #FFFFFF 100%)'
        : 'radial-gradient(circle at 92% 8%, rgba(0, 168, 107, 0.10), transparent 34%), linear-gradient(180deg, #F4FFF9 0%, #FFFFFF 100%)'
    const badgeStyle = isRecommended
      ? { background: 'rgba(4, 59, 139, 0.06)', border: '1px solid rgba(4, 59, 139, 0.18)', color: '#002D6E' }
      : isMaxMoney
        ? { background: '#F0F5FF', border: '1px solid #BFD4F6', color: '#2454D6' }
        : { background: '#F0FFF8', border: '1px solid #BDECD7', color: '#007A52' }
    const badgeLabel = isRecommended
      ? 'Sugestão ConsigAI'
      : isMaxMoney
        ? 'Máximo dinheiro'
        : 'Parcela mais leve'
    const valueColor = isLowerImpact ? '#007A52' : '#043B8B'
    const installmentStrongColor = isLowerImpact ? '#007A52' : isMaxMoney ? '#2454D6' : '#043B8B'
    const noteStyle = isRecommended
      ? { background: '#F0FFF8', border: '1px solid #BDECD7', color: '#007A52' }
      : isMaxMoney
        ? { background: '#F4F8FF', border: '1px solid #BFD4F6', color: '#2454D6' }
        : { background: '#F0FFF8', border: '1px solid #BDECD7', color: '#007A52' }
    const noteLabel = isRecommended
      ? 'Parcela dentro da sua margem'
      : isMaxMoney
        ? 'Maior valor liberado'
        : 'Menor impacto mensal'
    const selectionStyle = getSelectableCardStyle({
      selected: active,
      hovered: hoveredAnchor === idx,
      baseBackground: cardBackground,
    })
    return (
      <button
        onClick={() => {
          setCustomOpen(false)
          setCustomRaw('')
          setSelected(idx)
        }}
        onMouseEnter={() => setHoveredAnchor(idx)}
        onMouseLeave={() => setHoveredAnchor(null)}
        style={{
          width: '100%',
          minHeight: idx === 0 ? 130 : 80,
          borderRadius: idx === 0 ? 34 : 21,
          border: '1px solid',
          padding: idx === 0 ? '20px 18px' : '14px 16px',
          cursor: 'pointer',
          ...selectionStyle,
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 11px', borderRadius: 999, fontSize: 0, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.07em', ...badgeStyle }}>
          <span style={{ fontSize: 10 }}>{badgeLabel}</span>
        </div>
        <div style={{ marginTop: idx === 0 ? 10 : 8, color: valueColor, fontSize: idx === 0 ? 38 : 26, fontWeight: 900, letterSpacing: idx === 0 ? '-.07em' : '-.04em', lineHeight: 1 }}>
          {fmt(a.valor)}
        </div>
        <div style={{ marginTop: 7, color: '#64748B', fontSize: idx === 0 ? 13 : 12, fontWeight: 700 }}>
          {a.prazo}x de <strong style={{ color: installmentStrongColor }}>R$ {fmtDec(a.parcela)}</strong>
        </div>
        <div style={{ width: 'fit-content', margin: '10px auto 0', padding: '8px 12px', borderRadius: 999, fontSize: 12, fontWeight: 900, ...noteStyle }}>
          {noteLabel}
        </div>
      </button>
    )
  }

  const content = (
    <div style={isDesktop ? { display: 'flex', flexDirection: 'column', height: '100%' } : {}}>
      <section style={{ flex: isDesktop ? 1 : 'none', marginBottom: isDesktop ? 0 : 12, padding: isDesktop ? '22px' : '18px 16px', borderRadius: 28, border: '1px solid #DDE8F6', background: '#FFFFFF', boxShadow: '0 18px 46px rgba(3, 36, 111, 0.08)' }}>
        <div style={{ marginBottom: 12 }}>{renderAnchorButton(0)}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          {renderAnchorButton(1)}
          {renderAnchorButton(2)}
        </div>

        <button
          onClick={() => setCustomOpen(v => !v)}
          onMouseEnter={() => setCustomBtnHover(true)}
          onMouseLeave={() => setCustomBtnHover(false)}
          style={{
            ...btnToggleShape,
            marginTop: 6,
            marginBottom: customOpen ? 10 : 14,
            ...getSelectableCardStyle({
              selected: customOpen,
              hovered: customBtnHover,
              baseBackground: 'radial-gradient(circle at 92% 8%, rgba(4, 59, 139, 0.08), transparent 34%), linear-gradient(180deg, #F4FBFF 0%, #FFFFFF 100%)',
            }),
          }}
        >
          + Personalizar valor e prazo
        </button>
        {customOpen && (
          <div style={{ marginBottom: 14, background: '#fff', border: '1.5px solid #DDE8F6', borderRadius: 21, padding: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: 8 }}>Qual valor você quer?</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F8FBFF', border: '1px solid #DDE8F6', borderRadius: 13, padding: '10px 12px' }}>
              <span style={{ color: '#64748B', fontWeight: 800 }}>R$</span>
              <input
                type="number"
                value={customRaw}
                onChange={(e) => setCustomRaw(e.target.value)}
                placeholder="0"
                style={{ border: 0, outline: 'none', background: 'transparent', width: '100%', fontSize: 22, fontWeight: 900, color: '#002D6E' }}
              />
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: customValid || !customRaw ? '#64748B' : '#b42318' }}>
              {!customRaw && `Digite um valor entre ${fmt(OFERTA.valorMinimo)} e ${fmt(OFERTA.creditoMaximo)}`}
              {customRaw && !customValid && `Valor deve ficar entre ${fmt(OFERTA.valorMinimo)} e ${fmt(OFERTA.creditoMaximo)}`}
              {customRaw && customValid && `${selectedPrazo}x de R$ ${fmtDec(calcPMT(customValue, OFERTA.taxaMensal, selectedPrazo))}/mês`}
            </div>
            <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {OFERTA.prazosDisponiveis.map((prazo) => {
                const activePrazo = selectedPrazo === prazo
                return (
                  <button
                    key={prazo}
                    onClick={() => setSelectedPrazo(prazo)}
                    style={{ borderRadius: 13, border: `1px solid ${activePrazo ? '#043B8B' : '#DDE8F6'}`, background: activePrazo ? '#F0F5FF' : '#fff', color: activePrazo ? '#043B8B' : '#64748B', padding: '10px 6px', fontWeight: 800, cursor: 'pointer' }}
                  >
                    {prazo}x
                  </button>
                )
              })}
            </div>
          </div>
        )}
        <div style={{ margin: '4px 0 14px', borderTop: '1px solid #DDE8F6' }} />

        <button
          className="consigai-cta-animated"
          onClick={goContratacao}
          onMouseEnter={() => setCtaHover(true)}
          onMouseLeave={() => setCtaHover(false)}
          style={{ ...btnPrimary, boxShadow: ctaHover ? btnPrimaryHoverShadow : btnPrimary.boxShadow }}
        >
          Continuar com esta oferta
        </button>

        <button
          className="consigai-cta-animated"
          onClick={() => setShowReceipt(v => !v)}
          onMouseEnter={() => setSecondHover(true)}
          onMouseLeave={() => setSecondHover(false)}
          style={{ ...btnSecondary, marginTop: 10, background: secondHover ? btnSecondaryHoverBg : '#fff', boxShadow: secondHover ? btnSecondaryHoverShadow : btnSecondary.boxShadow }}
        >
          Gerar recibo da simulação
        </button>
        {showReceipt && <Receipt offer={offer} />}
        {showReceipt && (
          <button
            className="consigai-cta-animated"
            onClick={downloadReceiptPdf}
            style={{ ...btnCompactPrimary, marginTop: 8 }}
          >
            Baixar recibo da simulação
          </button>
        )}
        <p style={{ marginTop: 12, color: '#64748B', textAlign: 'center', fontSize: 11, fontWeight: 700 }}>Valores estimados. Sujeitos à análise e aprovação de crédito.</p>
        <button
          className="consigai-cta-animated"
          onClick={() => navigate('/ofertas')}
          style={{ ...btnCompact, marginTop: 10 }}
        >
          Voltar para ofertas
        </button>
      </section>
    </div>
  )

  const sidebarCards = (
    <>
      <ResumoCard
        title="Resumo da proposta"
        subtitle="Confira as principais condições simuladas antes de continuar."
        highlight={{ label: 'Oferta selecionada', value: fmt(offer.valor) }}
        rows={[
          { label: 'Produto', value: 'Novo contrato' },
          { label: 'Valor liberado', value: fmt(offer.valor) },
          { label: 'Prazo', value: `${offer.prazo} meses` },
          { label: 'Nova parcela total', value: `R$ ${fmtDec(offer.parcela)}/mês` },
          { label: 'Taxa', value: `${OFERTA.taxaMensal.toFixed(2).replace('.', ',')}% a.m.` },
        ]}
        style={isDesktop ? { flex: 1 } : {}}
      />
      <ImpactoCard
        liquidoAntes={salarioAntes}
        liquidoDepois={salarioDepois}
        novaParcela={`R$ ${fmtDec(offer.parcela)}`}
        novaParcelaLabel="Nova parcela total"
        style={isDesktop ? { flex: 1 } : {}}
      />
    </>
  )

  const sidebar = (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: 20, height: isDesktop ? '100%' : 'auto' }}>
      {sidebarCards}
    </aside>
  )

  return (
    <>
      <style>{`
        *{box-sizing:border-box}
        .consigai-cta-animated{
          position: relative;
          overflow: hidden;
          transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease, filter .16s ease;
        }
        .consigai-cta-animated:hover{
          transform: translateY(-1px) !important;
          filter: none;
        }
        .consigai-cta-animated:active{
          transform: translateY(0);
        }
      `}</style>
      <div style={appPageStyle}>
        {isDesktop ? (
          <>
            <DesktopPageHeader
              clientName={clientName}
              pageTitle="Novo Contrato"
              pageDescription="Escolha o valor e prazo que cabem no seu mês."
              onLogoClick={() => navigate('/ofertas')}
              actions={[
                { label: 'Ofertas', onClick: () => navigate('/ofertas') },
                { label: 'Configurações', onClick: () => navigate('/configuracoes') },
                { label: 'Acompanhamento', onClick: () => navigate('/acompanhamento') },
              ]}
            />
            <main style={{ maxWidth: 1400, margin: '0 auto', padding: '26px 24px 48px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '260px minmax(0, 1fr) 320px', gap: 28, alignItems: 'start' }}>
                <div>
                  <OperationGuideCard {...NOVO_CONTRATO_GUIDE} />
                </div>
                {content}
                {sidebar}
              </div>
              <div style={{ marginTop: 20 }}>
                <ControleCard horizontal />
              </div>
            </main>
          </>
        ) : (
          <>
            <MobilePageHeader
              clientName={clientName}
              chipLabel="Novo Contrato"
              title="Libere crédito novo com equilíbrio para o seu mês"
              subtitle="Simule valor e prazo com clareza para liberar crédito sem apertar o orçamento."
              onLogoClick={() => navigate('/ofertas')}
              actions={[
                { label: 'Ofertas', onClick: () => navigate('/ofertas') },
                { label: 'Configurações', onClick: () => navigate('/configuracoes') },
              { label: 'Acompanhamento', onClick: () => navigate('/acompanhamento') },
              ]}
            />
            <main style={{ padding: '20px 16px 28px' }}>
              {content}
              <div style={{ marginTop: 16 }}>
                {sidebar}
                <div style={{ marginTop: 16 }}><ControleCard /></div>
              </div>
            </main>
          </>
        )}
      </div>
    </>
  )
}
