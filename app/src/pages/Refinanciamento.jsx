import { useCallback, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { DesktopPageHeader, MobilePageHeader } from '../components/AppHeader'
import { appPageStyle } from '../ui/theme'
import { loadProfileData } from '../lib/profileStorage'
import { SCENARIOS } from '../data/refinanciamentoData'
import { parseMoney } from '../lib/formatters'
import { getSelectableCardStyle } from '../ui/cardSelection'
import { btnPrimary, btnPrimaryHoverShadow, btnSecondary, btnSecondaryHoverBg, btnSecondaryHoverShadow, btnCompact, btnCompactPrimary, btnToggleShape } from '../ui/buttonStyles'
import { printSimulationReceipt } from '../lib/receiptPrint'
import { ResumoCard, ImpactoCard, ControleCard } from '../components/SimulationSideCards'
import { OperationGuideCard } from '../components/OperationGuideCard'

const REFINANCIAMENTO_GUIDE = {
  badge: 'Guia ConsigAI',
  title: 'Como ajustar seu contrato',
  subtitle: 'Compare cenários para liberar dinheiro, reduzir parcela ou equilibrar melhor seu contrato atual.',
  steps: [
    { label: 'Passo 1', title: 'Contrato atual', body: 'Veja quais contratos podem ser ajustados.' },
    { label: 'Passo 2', title: 'Cenário', body: 'Escolha entre mais dinheiro, parcela menor ou equilíbrio.' },
    { label: 'Passo 3', title: 'Condições', body: 'Confira taxa, prazo, custo total e valor liberado.' },
  ],
  finalTitle: 'Você continua no controle',
  finalText: 'Nenhuma alteração acontece sem sua confirmação.',
  badges: ['Simulação sem compromisso', 'Compare antes de decidir'],
}

// Card themes per scenario index
const CARD_THEMES = [
  {
    badge: 'Sugestão ConsigAI',
    badgeStyle: { background: 'rgba(4,59,139,.06)', border: '1px solid rgba(4,59,139,.18)', color: '#002D6E' },
    baseBackground: 'radial-gradient(circle at 92% 8%, rgba(4,59,139,.08), transparent 34%), linear-gradient(180deg, #F8FBFF 0%, #FFFFFF 100%)',
    valueColor: '#043B8B',
    chipLabel: (s) => `Margem livre estimada: ${s.margem}`,
    chipStyle: { background: '#F0FFF8', border: '1px solid #BDECD7', color: '#007A52' },
  },
  {
    badge: 'Equilíbrio inteligente',
    badgeStyle: { background: '#F0FFF8', border: '1px solid #BDECD7', color: '#007A52' },
    baseBackground: 'radial-gradient(circle at 92% 8%, rgba(0,168,107,.10), transparent 34%), linear-gradient(180deg, #F4FFF9 0%, #FFFFFF 100%)',
    valueColor: '#007A52',
    chipLabel: () => `Mais margem e parcela menor`,
    chipStyle: { background: '#F0FFF8', border: '1px solid #BDECD7', color: '#007A52' },
  },
  {
    badge: 'Mais folga no mês',
    badgeStyle: { background: '#F0F5FF', border: '1px solid #BFD4F6', color: '#2454D6' },
    baseBackground: 'radial-gradient(circle at 92% 8%, rgba(36,84,214,.12), transparent 34%), linear-gradient(180deg, #EEF4FF 0%, #FFFFFF 100%)',
    valueColor: '#2454D6',
    chipLabel: () => `Menor impacto mensal`,
    chipStyle: { background: '#F4F8FF', border: '1px solid #BFD4F6', color: '#2454D6' },
  },
]

export default function Refinanciamento() {
  const navigate = useNavigate()
  const location = useLocation()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const profile = loadProfileData()
  const clientName = profile.nomeExibicao || profile.nomeCompleto || 'Cliente'

  const [activeIdx, setActiveIdx] = useState(0)
  const [hoveredIdx, setHoveredIdx] = useState(null)
  const [openDetailsCardIdx, setOpenDetailsCardIdx] = useState(null)
  const [showReceipt, setShowReceipt] = useState(false)
  const [detailsHover, setDetailsHover] = useState(false)
  const [ctaHover, setCtaHover] = useState(false)
  const [secondHover, setSecondHover] = useState(false)

  const fmtCurrency = useCallback((value) => {
    const n = Number(value)
    if (Number.isFinite(n)) return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    if (typeof value === 'string' && value.trim()) return value
    return 'R$ 0'
  }, [])

  const fmtInstallment = useCallback((value) => {
    const s = fmtCurrency(value)
    return s.includes('/mês') || s.includes('/mes') ? s : `${s}/mês`
  }, [fmtCurrency])

  const normalizeScenario = useCallback((raw, index) => {
    const contractsRaw = raw?.contracts ?? raw?.contratos ?? []
    const receiptRowsRaw = raw?.receiptRows ?? raw?.recibo ?? raw?.contratosDetalhes ?? []

    const contractDetailsFromRows = Array.isArray(receiptRowsRaw)
      ? receiptRowsRaw.map((row, rowIdx) => {
          if (Array.isArray(row)) {
            const [code, bank, troco, taxaAntiga, taxaNova, parcelasAbertas, parcelasTotais, parcelaAntiga, parcelaNova] = row
            return {
              key: `${index}-${rowIdx}-${bank || code || 'contrato'}`,
              bank: bank || `Contrato ${rowIdx + 1}`,
              code: code || '-',
              troco: troco || '-',
              taxaAntiga: taxaAntiga || '-',
              taxaNova: taxaNova || '-',
              parcelasAbertas: parcelasAbertas || '-',
              parcelasTotais: parcelasTotais || '-',
              parcelaAntiga: parcelaAntiga || '-',
              parcelaNova: parcelaNova || '-',
              result: 'Compõe a proposta',
            }
          }
          return {
            key: `${index}-${rowIdx}-${row?.bank || row?.banco || 'contrato'}`,
            bank: row?.bank || row?.banco || `Contrato ${rowIdx + 1}`,
            code: row?.code || row?.codigo || '-',
            troco: row?.troco || row?.cashback || '-',
            taxaAntiga: row?.taxaAntiga || row?.oldRate || row?.taxa_antiga || '-',
            taxaNova: row?.taxaNova || row?.newRate || row?.taxa_nova || '-',
            parcelasAbertas: row?.parcelasAbertas || row?.openInstallments || row?.parcelas_abertas || '-',
            parcelasTotais: row?.parcelasTotais || row?.totalInstallments || row?.parcelas_totais || '-',
            parcelaAntiga: row?.parcelaAntiga || row?.oldInstallment || row?.parcela_antiga || '-',
            parcelaNova: row?.parcelaNova || row?.newInstallment || row?.parcela_nova || '-',
            result: row?.result || row?.resultado || 'Compõe a proposta',
          }
        })
      : []

    const contractDetailsFromContracts = Array.isArray(contractsRaw)
      ? contractsRaw.map((c, cIdx) => {
          if (typeof c === 'string') {
          return {
            key: `${index}-c-${cIdx}-${c}`,
            bank: c,
            code: '-',
            troco: '-',
            taxaAntiga: '-',
            taxaNova: '-',
            parcelasAbertas: '-',
            parcelasTotais: '-',
            parcelaAntiga: '-',
            parcelaNova: '-',
            result: 'Compõe a proposta',
          }
          }
          return {
            key: `${index}-c-${cIdx}-${c?.bank || c?.banco || 'contrato'}`,
            bank: c?.bank || c?.banco || `Contrato ${cIdx + 1}`,
            code: c?.code || c?.codigo || '-',
            troco: c?.troco || c?.cashback || '-',
            taxaAntiga: c?.taxaAntiga || c?.oldRate || c?.taxa_antiga || '-',
            taxaNova: c?.taxaNova || c?.newRate || c?.taxa_nova || '-',
            parcelasAbertas: c?.parcelasAbertas || c?.openInstallments || c?.parcelas_abertas || '-',
            parcelasTotais: c?.parcelasTotais || c?.totalInstallments || c?.parcelas_totais || '-',
            parcelaAntiga: c?.parcelaAntiga || c?.oldInstallment || c?.parcela_antiga || '-',
            parcelaNova: c?.parcelaNova || c?.newInstallment || c?.parcela_nova || '-',
            result: c?.result || c?.resultado || 'Compõe a proposta',
          }
        })
      : []

    const contractDetails = contractDetailsFromRows.length > 0 ? contractDetailsFromRows : contractDetailsFromContracts
    const contracts = contractDetails.map((c) => c.bank)

    return {
      key: raw?.key || raw?.id || `cenario_${index + 1}`,
      eyebrow: raw?.eyebrow || raw?.label || `Cenário ${index + 1}`,
      title: raw?.title || raw?.nome || raw?.name || `Cenário ${index + 1}`,
      desc: raw?.desc || raw?.descricao || raw?.description || 'Simulação de refinanciamento',
      cash: raw?.cash || raw?.creditoReceber || raw?.valorLiberado || fmtCurrency(raw?.valor),
      installment: raw?.installment || raw?.parcelaNova || fmtInstallment(raw?.parcela),
      margem: raw?.margem || raw?.margemLivre || fmtCurrency(raw?.margem_valor),
      contracts,
      contractDetails,
    }
  }, [fmtCurrency, fmtInstallment])

  const scenarios = useMemo(() => {
    const state = location.state || {}
    const apiCandidates =
      state.scenarios ||
      state.ofertasRefinanciamento ||
      state.ofertas_refinanciamento ||
      state.refinanciamentoOfertas ||
      state.refinOffers ||
      state.ofertas

    if (Array.isArray(apiCandidates) && apiCandidates.length > 0) {
      return apiCandidates.slice(0, 3).map((raw, idx) => normalizeScenario(raw, idx))
    }

    return SCENARIOS.map((raw, idx) =>
      normalizeScenario(
        {
          ...raw,
          contracts: raw.contracts,
          receiptRows: raw.receiptRows,
          margemLivre: raw.margem,
          parcelaNova: raw.installment,
          creditoReceber: raw.cash,
        },
        idx,
      ),
    )
  }, [location.state, normalizeScenario])

  const safeActiveIdx = activeIdx > scenarios.length - 1 ? 0 : activeIdx
  const scenario = scenarios[safeActiveIdx] || scenarios[0]

  const salarioBase = 2200
  const parcelaAntes = 550
  const parcelaDepois = parseMoney(scenario.installment)
  const liquidoAntes = salarioBase - parcelaAntes
  const liquidoDepois = salarioBase - parcelaDepois

  const goContratacao = () => {
    navigate('/dados-bancarios', {
      state: {
        sourcePath: '/refinanciamento',
        nextPath: '/contratacao',
        offerState: {
          sourcePath: '/refinanciamento',
          offerTitle: scenario.title || 'Refinanciamento',
          offerSubtitle: 'Resumo da oferta selecionada antes da contratação',
          primaryValue: scenario.cash || 'R$ 0',
          ctaLabel: 'Confirmar Refinanciamento',
          summary: [
            { label: 'Você recebe', value: scenario.cash || 'R$ 0' },
            { label: 'Nova parcela', value: scenario.installment || 'R$ 0/mês' },
            { label: 'Margem livre', value: scenario.margem || 'R$ 0' },
            { label: 'Contratos', value: `${scenario.contracts?.length || 0}` },
          ],
        },
      },
    })
  }

  const downloadReceiptPdf = () => {
    printSimulationReceipt({
      title: 'SIMULAÇÃO DE REFINANCIAMENTO - CONSIGAI',
      highlightLabel: 'VALOR ESTIMADO PARA RECEBER',
      highlightValue: scenario.cash,
      rows: [
        { label: 'Cenário', value: scenario.title },
        { label: 'Nova parcela', value: scenario.installment },
        { label: 'Margem livre', value: scenario.margem },
        { label: 'Contratos', value: `${scenario.contracts.length}` },
      ],
    })
  }


  const renderScenarioCard = (idx) => {
    if (idx >= scenarios.length) return null
    const s = scenarios[idx]
    const theme = CARD_THEMES[idx] || CARD_THEMES[0]
    const active = activeIdx === idx
    const isLarge = idx === 0

    const selectionStyle = getSelectableCardStyle({
      selected: active,
      hovered: hoveredIdx === idx,
      baseBackground: theme.baseBackground,
    })

    return (
      <button
        key={s.key}
        onClick={() => { setActiveIdx(idx) }}
        onMouseEnter={() => setHoveredIdx(idx)}
        onMouseLeave={() => setHoveredIdx((cur) => (cur === idx ? null : cur))}
        style={{
          width: '100%',
          minHeight: isLarge ? 130 : 80,
          borderRadius: isLarge ? 34 : 21,
          border: '1px solid',
          padding: isLarge ? '20px 18px' : '14px 16px',
          cursor: 'pointer',
          ...selectionStyle,
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 11px', borderRadius: 999, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.07em', ...theme.badgeStyle }}>
          {theme.badge}
        </div>
        <div style={{ marginTop: isLarge ? 10 : 8, color: theme.valueColor, fontSize: isLarge ? 38 : 26, fontWeight: 900, letterSpacing: isLarge ? '-.07em' : '-.04em', lineHeight: 1 }}>
          {s.cash}
        </div>
        <div style={{ marginTop: 7, color: '#64748B', fontSize: isLarge ? 13 : 12, fontWeight: 700 }}>
          {s.installment}
        </div>
        <div style={{ width: 'fit-content', margin: '10px auto 0', padding: '8px 12px', borderRadius: 999, fontSize: 12, fontWeight: 900, ...theme.chipStyle }}>
          {theme.chipLabel(s)}
        </div>
      </button>
    )
  }

  const content = (
    <div style={isDesktop ? { display: 'flex', flexDirection: 'column', height: '100%' } : {}}>
      <section style={{ flex: isDesktop ? 1 : 'none', marginBottom: isDesktop ? 0 : 12, padding: isDesktop ? '22px' : '18px 16px', borderRadius: 28, border: '1px solid #DDE8F6', background: '#FFFFFF', boxShadow: '0 18px 46px rgba(3,36,111,.08)' }}>

        {/* Scenario selection cards */}
        <div style={{ marginBottom: 12 }}>
          {renderScenarioCard(0)}
        </div>
        {scenarios.length > 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: scenarios.length > 2 ? '1fr 1fr' : '1fr', gap: 12, marginBottom: 12 }}>
            {renderScenarioCard(1)}
            {scenarios.length > 2 && renderScenarioCard(2)}
          </div>
        )}

        {/* Details toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            const currentScrollY = window.scrollY
            setOpenDetailsCardIdx((prev) => (prev === safeActiveIdx ? null : safeActiveIdx))
            requestAnimationFrame(() => { window.scrollTo({ top: currentScrollY, behavior: 'auto' }) })
          }}
          onMouseEnter={() => setDetailsHover(true)}
          onMouseLeave={() => setDetailsHover(false)}
          style={{
            ...btnToggleShape,
            marginTop: 6,
            marginBottom: openDetailsCardIdx !== null ? 10 : 14,
            ...getSelectableCardStyle({
              selected: openDetailsCardIdx !== null,
              hovered: detailsHover,
              baseBackground: 'radial-gradient(circle at 92% 8%, rgba(4,59,139,.08), transparent 34%), linear-gradient(180deg, #F4FBFF 0%, #FFFFFF 100%)',
            }),
          }}
        >
          {openDetailsCardIdx !== null ? 'Fechar detalhes' : 'Ver detalhes dos contratos'}
        </button>

        {/* Contract details panel */}
        {openDetailsCardIdx !== null && (
          <div style={{ marginBottom: 14, maxHeight: 'min(460px, 60vh)', overflowY: 'auto', paddingRight: 4 }}>
            {scenario.contractDetails.map((item) => (
              <article key={item.key} style={{ marginBottom: 10, padding: 16, borderRadius: 21, background: '#fff', border: '1px solid #DDE8F6', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: '0 0 auto 0', height: 4, background: 'linear-gradient(90deg, #043B8B, #1DA1EB, #00A86B)' }} />
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottom: '1px solid #DDE8F6', marginTop: 4 }}>
                  <div>
                    <small style={{ color: '#043B8B', fontSize: 10, fontWeight: 900, letterSpacing: '.12em', textTransform: 'uppercase' }}>Antes e depois</small>
                    <h3 style={{ marginTop: 2, color: '#002D6E', fontSize: 16, lineHeight: 1, fontWeight: 900, letterSpacing: '-.04em' }}>{item.bank}</h3>
                  </div>
                </header>
                <section style={{ marginTop: 10, padding: '10px 12px', borderRadius: 13, background: '#F0FFF8', border: '1px solid #BDECD7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <span style={{ display: 'block', color: '#007A52', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.06em', whiteSpace: 'nowrap' }}>Você recebe na conta</span>
                    <small style={{ display: 'block', marginTop: 2, color: '#64748B', fontSize: 10, lineHeight: 1.25, fontWeight: 700 }}>valor estimado</small>
                  </div>
                  <strong style={{ color: '#00A86B', fontSize: 21, lineHeight: 1, fontWeight: 800, letterSpacing: '-.055em', whiteSpace: 'nowrap' }}>{item.troco}</strong>
                </section>
                <section style={{ marginTop: 10, border: '1px solid #DDE8F6', borderRadius: 13, overflow: 'hidden', background: '#fff' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '74px 1fr 1fr', alignItems: 'center', gap: 8, padding: '8px 10px', background: '#F8FBFF', borderBottom: '1px solid #DDE8F6', color: '#64748B', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.07em' }}>
                    <span />
                    <span style={{ textAlign: 'center' }}>Hoje</span>
                    <span style={{ textAlign: 'center' }}>Depois</span>
                  </div>
                  {[
                    { label: 'Parcela', before: item.parcelaAntiga, after: item.parcelaNova },
                    { label: 'Prazo', before: item.parcelasAbertas, after: item.parcelasTotais },
                    { label: 'Taxa', before: item.taxaAntiga, after: item.taxaNova },
                  ].map(({ label, before, after }, ri) => (
                    <div key={label} style={{ display: 'grid', gridTemplateColumns: '74px 1fr 1fr', alignItems: 'center', gap: 8, padding: '9px 10px', borderBottom: ri < 2 ? '1px solid #DDE8F6' : 'none' }}>
                      <span style={{ color: '#002D6E', fontSize: 11, fontWeight: 800 }}>{label}</span>
                      <strong style={{ color: '#002D6E', fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap', letterSpacing: '-.025em', textAlign: 'center' }}>{before}</strong>
                      <strong style={{ color: '#043B8B', fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap', letterSpacing: '-.025em', textAlign: 'center' }}>{after}</strong>
                    </div>
                  ))}
                </section>
                <p style={{ marginTop: 10, padding: '9px 10px', borderRadius: 13, background: '#F8FBFF', border: '1px solid #DDE8F6', color: '#64748B', fontSize: 11, lineHeight: 1.3, fontWeight: 600 }}>
                  <strong style={{ color: '#002D6E', fontWeight: 900 }}>Contrato:</strong> {item.code}
                </p>
              </article>
            ))}
          </div>
        )}

        {/* Actions */}
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
          onClick={() => setShowReceipt((v) => !v)}
          onMouseEnter={() => setSecondHover(true)}
          onMouseLeave={() => setSecondHover(false)}
          style={{ ...btnSecondary, marginTop: 10, background: secondHover ? btnSecondaryHoverBg : '#fff', boxShadow: secondHover ? btnSecondaryHoverShadow : btnSecondary.boxShadow }}
        >
          Gerar recibo da simulação
        </button>

        {showReceipt && (
          <div style={{ marginTop: 10, borderRadius: 16, border: '1px solid #DDE8F6', background: '#f7f9fe', padding: 10, display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 300, borderRadius: 10, padding: '14px 12px 12px', border: '1px solid #ececec', color: '#4f4f4f', fontSize: 12, background: 'linear-gradient(180deg, rgba(255,255,255,.45), rgba(0,0,0,.02)), #f5f5f3' }}>
              <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 800, color: '#444' }}>SIMULAÇÃO DE REFINANCIAMENTO - CONSIGAI</div>
              <div style={{ fontSize: 10, marginTop: 4, textAlign: 'center', color: '#808080' }}>{new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
              <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 800, color: '#4a4a4a' }}>VALOR ESTIMADO PARA RECEBER</div>
              <div style={{ textAlign: 'center', marginTop: 2, fontSize: 22, fontWeight: 900, color: '#232323', lineHeight: 1 }}>{scenario.cash}</div>
              <div style={{ borderTop: '1px dashed #cfcfcf', margin: '10px 0' }} />
              <div style={{ display: 'grid', gap: 6, fontSize: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Cenário</span><strong>{scenario.title}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Nova parcela</span><strong>{scenario.installment}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Margem livre</span><strong>{scenario.margem}</strong></div>
              </div>
            </div>
          </div>
        )}
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

  const sidebar = (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <ResumoCard
        title="Resumo da proposta"
        subtitle="Confira as principais condições simuladas antes de continuar."
        highlight={{ label: 'Oferta selecionada', value: scenario.title }}
        rows={[
          { label: 'Produto', value: 'Refinanciamento' },
          { label: 'Valor liberado', value: scenario.cash },
          { label: 'Nova parcela total', value: scenario.installment },
          { label: 'Margem livre', value: scenario.margem },
          { label: 'Contratos incluídos', value: `${scenario.contracts.length} refinanciados` },
        ]}
      />
      <ImpactoCard
        liquidoAntes={liquidoAntes}
        liquidoDepois={liquidoDepois}
        novaParcela={String(scenario.installment).replace(/\/m[eê]s/i, '').trim()}
        novaParcelaLabel="Nova parcela total"
      />
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
              pageTitle="Refinanciamento"
              pageDescription="Compare cenários para ajustar seus contratos."
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
                  <OperationGuideCard {...REFINANCIAMENTO_GUIDE} />
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
              chipLabel="Refinanciamento"
              title="Refinancie com equilíbrio para melhorar seu mês"
              subtitle="Compare cenários com clareza para liberar valor sem perder o controle."
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
